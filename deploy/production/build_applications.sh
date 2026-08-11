#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  cat <<'EOF'
Install locked dependencies and build selected Sarga applications sequentially.

Usage:
  sudo deploy/production/build_applications.sh [applications] [options]

Applications (select at least one):
  --cms          Build the shared Strapi CMS.
  --gateway      Build the Gateway frontend.
  --motorsport   Build the Motorsport frontend.
  --horsesport   Build the Horse Sport frontend.
  --all          Build CMS, Gateway, Motorsport, then Horse Sport.

Options:
  --repo PATH       Repository path (default: /srv/sarga-website).
  --app-user NAME   Linux application user (default: sarga).
  --restart         Restart selected existing systemd services only after all
                    selected installs/builds succeed.
  --help            Show this help.

Each application loads its protected /etc/sarga/<application>.env file in an
isolated subshell. Builds are sequential to limit peak memory usage.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

require_value() {
  local option="$1"
  local value="${2:-}"
  [[ -n "$value" && "$value" != --* ]] || fail "$option requires a value"
}

repo_path="/srv/sarga-website"
app_user="sarga"
restart_services=false
selected=()

add_selected() {
  local requested="$1"
  local existing
  for existing in "${selected[@]:-}"; do
    [[ "$existing" != "$requested" ]] || return 0
  done
  selected+=("$requested")
}

while (($#)); do
  case "$1" in
    --cms)
      add_selected cms
      shift
      ;;
    --gateway)
      add_selected gateway
      shift
      ;;
    --motorsport)
      add_selected motorsport
      shift
      ;;
    --horsesport)
      add_selected horsesport
      shift
      ;;
    --all)
      add_selected cms
      add_selected gateway
      add_selected motorsport
      add_selected horsesport
      shift
      ;;
    --repo)
      require_value "$1" "${2:-}"
      repo_path="$2"
      shift 2
      ;;
    --app-user)
      require_value "$1" "${2:-}"
      app_user="$2"
      shift 2
      ;;
    --restart)
      restart_services=true
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1 (use --help)"
      ;;
  esac
done

[[ "${EUID}" -eq 0 ]] || fail "run this build helper with sudo"
((${#selected[@]} > 0)) || fail "select at least one application"
[[ "$repo_path" == /* ]] || fail "--repo must be an absolute path"
[[ "$app_user" =~ ^[a-z_][a-z0-9_-]*$ ]] || fail "invalid application user"
id "$app_user" >/dev/null 2>&1 || fail "application user does not exist: $app_user"
[[ -d "$repo_path/.git" ]] || fail "repository checkout was not found: $repo_path"
command -v pnpm >/dev/null || fail "pnpm is not installed"
command -v sudo >/dev/null || fail "sudo is not installed"

application_path() {
  case "$1" in
    cms) printf '%s/cms' "$repo_path" ;;
    gateway) printf '%s/frontend-gateway' "$repo_path" ;;
    motorsport) printf '%s/frontend-motorsport' "$repo_path" ;;
    horsesport) printf '%s/frontend-horsesport' "$repo_path" ;;
  esac
}

environment_path() {
  printf '/etc/sarga/%s.env' "$1"
}

service_name() {
  printf 'sarga-%s' "$1"
}

for application in "${selected[@]}"; do
  app_path="$(application_path "$application")"
  env_path="$(environment_path "$application")"
  [[ -f "$app_path/package.json" ]] || fail "missing package.json for $application: $app_path"
  [[ -f "$app_path/pnpm-lock.yaml" ]] || fail "missing pnpm lockfile for $application: $app_path"
  [[ -r "$env_path" ]] || fail "environment file is not readable: $env_path"
  if [[ "$restart_services" == true ]]; then
    systemctl cat "$(service_name "$application")" >/dev/null ||
      fail "systemd service is not installed: $(service_name "$application")"
  fi
done

release_sha="$(git -C "$repo_path" rev-parse HEAD)"
printf 'Building Git revision: %s\n' "$release_sha"

for application in "${selected[@]}"; do
  app_path="$(application_path "$application")"
  env_path="$(environment_path "$application")"
  printf '\nInstalling locked dependencies for %s...\n' "$application"
  sudo -u "$app_user" pnpm --dir "$app_path" install --frozen-lockfile

  printf 'Building %s with %s...\n' "$application" "$env_path"
  (
    # shellcheck source=/dev/null
    set -a
    source "$env_path"
    set +a
    [[ "${NODE_ENV:-}" == "production" ]] ||
      fail "$env_path must set NODE_ENV=production"
    sudo -u "$app_user" --preserve-env pnpm --dir "$app_path" build
  )

  if [[ "$application" != "cms" ]]; then
    [[ -s "$app_path/.next/BUILD_ID" ]] || fail "$application did not produce .next/BUILD_ID"
  fi
done

[[ "$(git -C "$repo_path" rev-parse HEAD)" == "$release_sha" ]] ||
  fail "repository Git revision changed while builds were running"

if [[ "$restart_services" == true ]]; then
  for application in "${selected[@]}"; do
    systemctl restart "$(service_name "$application")"
    systemctl is-active --quiet "$(service_name "$application")" ||
      fail "service did not become active: $(service_name "$application")"
  done
fi

printf '\nSelected application builds completed at Git revision %s.\n' "$release_sha"
if [[ "$restart_services" == false ]]; then
  printf 'Services were not restarted. Use install-sarga-stack.sh or systemctl after configuration is ready.\n'
fi

