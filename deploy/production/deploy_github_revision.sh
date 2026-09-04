#!/usr/bin/env bash

set -Eeuo pipefail

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

case "${0##*/}" in
  sarga-deploy-staging)
    deploy_environment="staging"
    ;;
  sarga-deploy-production)
    deploy_environment="production"
    ;;
  deploy_github_revision.sh)
    deploy_environment="${SARGA_DEPLOY_ENVIRONMENT:-staging}"
    ;;
  *)
    fail "unrecognized installed deployment command: ${0##*/}"
    ;;
esac
[[ "$deploy_environment" == "staging" || "$deploy_environment" == "production" ]] ||
  fail "deployment environment must be staging or production"

usage() {
  cat <<'EOF'
Deploy one reviewed Git revision to a Sarga environment.

Usage:
  sudo sarga-deploy-ENVIRONMENT GIT_SHA TARGET

Targets:
  cms          Build and restart the shared Strapi CMS.
  gateway      Build and restart the Gateway frontend.
  gateway-onepage
               Build and restart the static one-page Gateway presentation frontend.
  motorsport   Build and restart the Motorsport frontend.
  all-active   Build and restart CMS, Gateway, and Motorsport sequentially.

The exact 40-character commit must be contained by the remote release branch
configured for the installed environment. A matching environment deployment
authorization token must be supplied as the first line on standard input.
EOF
  printf '\nSelected environment: %s\n' "$deploy_environment"
}

repo_path="/srv/sarga-website"
app_user="sarga"
release_ref_file="/etc/sarga/github-runner-$deploy_environment-release-ref"
authorization_file="/etc/sarga/github-runner-$deploy_environment-deploy-token"
backup_root="/var/backups/sarga/deployments/$deploy_environment"
state_root="/var/lib/sarga-deploy/$deploy_environment"
deployment_log="/var/log/sarga-deployments.log"
lock_file="/run/lock/sarga-$deploy_environment-deploy.lock"
database_name="sarga_strapi"

[[ "${1:-}" != "--help" && "${1:-}" != "-h" ]] || {
  usage
  exit 0
}

[[ "${EUID}" -eq 0 ]] || fail "run this deployment command with sudo"
[[ "$#" -eq 2 ]] || fail "expected GIT_SHA and TARGET (use --help)"
[[ -r "$authorization_file" ]] ||
  fail "deployment authorization is missing: $authorization_file"

IFS= read -r provided_authorization ||
  fail "deployment authorization must be supplied on standard input"
IFS= read -r expected_authorization <"$authorization_file"
[[ "$provided_authorization" =~ ^[0-9a-f]{64}$ ]] ||
  fail "invalid deployment authorization"
[[ "$provided_authorization" == "$expected_authorization" ]] ||
  fail "invalid deployment authorization"
unset provided_authorization expected_authorization

target_sha="${1,,}"
target="$2"
[[ "$target_sha" =~ ^[0-9a-f]{40}$ ]] || fail "GIT_SHA must be a full 40-character hexadecimal commit"

build_flags=()
services=()
health_urls=()
includes_cms=false

case "$target" in
  cms)
    build_flags=(--cms)
    services=(sarga-cms)
    health_urls=(http://127.0.0.1:1337/admin)
    includes_cms=true
    ;;
  gateway)
    build_flags=(--gateway)
    services=(sarga-gateway)
    health_urls=(http://127.0.0.1:3000/)
    ;;
  gateway-onepage)
    build_flags=(--gateway-onepage)
    services=(sarga-gateway-onepage)
    health_urls=(http://127.0.0.1:3003/)
    ;;
  motorsport)
    build_flags=(--motorsport)
    services=(sarga-motorsport)
    health_urls=(http://127.0.0.1:3001/)
    ;;
  all-active)
    build_flags=(--cms --gateway --motorsport)
    services=(sarga-cms sarga-gateway sarga-motorsport)
    health_urls=(
      http://127.0.0.1:1337/admin
      http://127.0.0.1:3000/
      http://127.0.0.1:3001/
    )
    includes_cms=true
    ;;
  *)
    fail "unsupported TARGET: $target"
    ;;
esac

for command in curl flock git install pg_dump sudo systemctl tar; do
  command -v "$command" >/dev/null || fail "required command is not installed: $command"
done

id "$app_user" >/dev/null 2>&1 || fail "application user does not exist: $app_user"
[[ -d "$repo_path/.git" ]] || fail "repository checkout was not found: $repo_path"
[[ -r "$release_ref_file" ]] || fail "release branch configuration is missing: $release_ref_file"

IFS= read -r allowed_remote_ref <"$release_ref_file"
[[ "$allowed_remote_ref" =~ ^refs/remotes/origin/[A-Za-z0-9._/-]+$ ]] ||
  fail "invalid remote release ref in $release_ref_file"
[[ "$allowed_remote_ref" != *..* ]] || fail "remote release ref cannot contain '..'"
release_branch="${allowed_remote_ref#refs/remotes/origin/}"

exec 9>"$lock_file"
flock --nonblock 9 || fail "another Sarga deployment is already running"

started_at="$(date --utc +%FT%TZ)"
short_sha="${target_sha:0:12}"
status="failed"
log_result() {
  local exit_code="$?"
  printf '%s status=%s environment=%s sha=%s target=%s actor=%s\n' \
    "$(date --utc +%FT%TZ)" "$status" "$deploy_environment" "$target_sha" "$target" \
    "${SUDO_USER:-root}" >>"$deployment_log"
  exit "$exit_code"
}
trap log_result EXIT

printf 'Fetching release branch %s...\n' "$release_branch"
sudo -u "$app_user" git -C "$repo_path" fetch \
  --prune origin "+refs/heads/$release_branch:$allowed_remote_ref"

resolved_sha="$(sudo -u "$app_user" git -C "$repo_path" rev-parse "$target_sha^{commit}")" ||
  fail "commit is not available after fetching the release branch: $target_sha"
[[ "$resolved_sha" == "$target_sha" ]] || fail "resolved commit does not match requested SHA"
sudo -u "$app_user" git -C "$repo_path" merge-base --is-ancestor \
  "$target_sha" "$allowed_remote_ref" ||
  fail "commit $target_sha is not contained by $allowed_remote_ref"

dirty_paths="$(
  sudo -u "$app_user" git -C "$repo_path" status \
    --porcelain --untracked-files=all -- . ':(exclude)cms/public/uploads/**'
)"
[[ -z "$dirty_paths" ]] || {
  printf '%s\n' "$dirty_paths" >&2
  fail "deployment checkout has changes outside cms/public/uploads"
}

previous_sha="$(sudo -u "$app_user" git -C "$repo_path" rev-parse HEAD)"
printf 'Deploying %s (previous revision %s).\n' "$target_sha" "$previous_sha"

backup_dir=""
if [[ "$includes_cms" == true ]]; then
  backup_dir="$backup_root/$(date --utc +%Y%m%dT%H%M%SZ)-$short_sha"
  install -d -o postgres -g postgres -m 0700 "$backup_dir"
  [[ -d "$repo_path/cms/public/uploads" ]] || fail "CMS uploads directory is missing"

  printf 'Backing up PostgreSQL and CMS uploads to %s...\n' "$backup_dir"
  sudo -u postgres pg_dump \
    --format=custom \
    --dbname="$database_name" \
    --file="$backup_dir/$database_name.dump"
  tar -C "$repo_path/cms/public" -czf "$backup_dir/uploads.tar.gz" uploads
  chown root:root "$backup_dir" "$backup_dir/$database_name.dump" "$backup_dir/uploads.tar.gz"
  chmod 0700 "$backup_dir"
  chmod 0600 "$backup_dir/$database_name.dump" "$backup_dir/uploads.tar.gz"
fi

sudo -u "$app_user" git -C "$repo_path" checkout --detach --force "$target_sha"
[[ "$(sudo -u "$app_user" git -C "$repo_path" rev-parse HEAD)" == "$target_sha" ]] ||
  fail "repository did not switch to the requested commit"

build_helper="$repo_path/deploy/production/build_applications.sh"
[[ -x "$build_helper" ]] || fail "build helper is missing or not executable at the target revision"

if ! "$build_helper" "${build_flags[@]}"; then
  printf 'Build failed before services were restarted. Restoring revision %s...\n' "$previous_sha" >&2
  if sudo -u "$app_user" git -C "$repo_path" checkout --detach --force "$previous_sha"; then
    previous_build_helper="$repo_path/deploy/production/build_applications.sh"
    if [[ -x "$previous_build_helper" ]] && "$previous_build_helper" "${build_flags[@]}"; then
      printf 'Previous revision and build artifacts were restored; running services were not restarted.\n' >&2
    else
      printf 'Warning: previous revision was restored, but its build artifacts could not be rebuilt.\n' >&2
    fi
  else
    printf 'Warning: failed to restore previous Git revision %s.\n' "$previous_sha" >&2
  fi
  exit 1
fi

for service in "${services[@]}"; do
  systemctl restart "$service"
done

for service in "${services[@]}"; do
  systemctl is-active --quiet "$service" || fail "service did not become active: $service"
done

for url in "${health_urls[@]}"; do
  curl \
    --fail \
    --silent \
    --show-error \
    --location \
    --retry 10 \
    --retry-all-errors \
    --retry-delay 2 \
    --max-time 20 \
    "$url" >/dev/null
  printf 'Verified %s\n' "$url"
done

install -d -o root -g root -m 0755 "$state_root"
printf '%s\n' "$target_sha" >"$state_root/last-successful-sha"
printf '%s\n' "$target" >"$state_root/last-successful-target"
printf '%s\n' "$started_at" >"$state_root/last-successful-started-at"
chmod 0644 "$state_root"/last-successful-*

status="succeeded"
printf 'Deployment completed: environment=%s sha=%s target=%s\n' \
  "$deploy_environment" "$target_sha" "$target"
[[ -z "$backup_dir" ]] || printf 'Pre-deploy CMS backup: %s\n' "$backup_dir"
