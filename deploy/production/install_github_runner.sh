#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  cat <<'EOF'
Install and register the repository-scoped GitHub Actions runner on this VM.

Usage:
  sudo deploy/production/install_github_runner.sh [options]

Options:
  --repository-url URL   GitHub repository URL
                         (default: https://github.com/alfabaria/sarga-website)
  --release-branch NAME  Only commits contained by this origin branch may deploy
                         (default: feature/sarga-major-revamp)
  --runner-name NAME     Runner name shown in GitHub
                         (default: sarga-tencent-staging-01)
  --help                 Show this help

The script prompts without echo for GitHub's short-lived runner registration
token. For non-interactive automation, provide it as RUNNER_TOKEN in the process
environment; never save that token in the repository or shell history.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

runner_version="2.336.0"
runner_sha256="04cf0be1aff4c3ec3554466c39124ca250e3effd8873bb7e8d68535aa9505d5d"
runner_user="github-runner"
runner_dir="/opt/actions-runner"
runner_name="sarga-tencent-staging-01"
repository_url="https://github.com/alfabaria/sarga-website"
release_branch="feature/sarga-major-revamp"
repo_path="/srv/sarga-website"
installed_deployer="/usr/local/sbin/sarga-deploy-staging"
release_ref_file="/etc/sarga/github-runner-release-ref"
authorization_file="/etc/sarga/github-runner-deploy-token"
sudoers_file="/etc/sudoers.d/sarga-github-runner"
runner_labels="sarga-staging,tencent-cvm"

while (($#)); do
  case "$1" in
    --repository-url)
      [[ -n "${2:-}" && "$2" != --* ]] || fail "--repository-url requires a value"
      repository_url="$2"
      shift 2
      ;;
    --release-branch)
      [[ -n "${2:-}" && "$2" != --* ]] || fail "--release-branch requires a value"
      release_branch="$2"
      shift 2
      ;;
    --runner-name)
      [[ -n "${2:-}" && "$2" != --* ]] || fail "--runner-name requires a value"
      runner_name="$2"
      shift 2
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

[[ "${EUID}" -eq 0 ]] || fail "run this installer with sudo"
[[ "$(uname -s)" == "Linux" && "$(uname -m)" == "x86_64" ]] ||
  fail "this pinned runner package supports Linux x86_64 only"
[[ "$repository_url" =~ ^https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(\.git)?$ ]] ||
  fail "--repository-url must be an HTTPS GitHub repository URL"
[[ "$release_branch" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*$ ]] || fail "invalid release branch"
[[ "$release_branch" != *..* ]] || fail "release branch cannot contain '..'"
[[ "$runner_name" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]] || fail "invalid runner name"
[[ -x "$repo_path/deploy/production/deploy_github_revision.sh" ]] ||
  fail "deployment command is missing from $repo_path"

for command in curl install openssl runuser sha256sum tar useradd visudo; do
  command -v "$command" >/dev/null || fail "required command is not installed: $command"
done

if ! id "$runner_user" >/dev/null 2>&1; then
  useradd \
    --system \
    --create-home \
    --home-dir "$runner_dir" \
    --shell /usr/sbin/nologin \
    "$runner_user"
fi
install -d -o "$runner_user" -g "$runner_user" -m 0750 "$runner_dir"

install -o root -g root -m 0755 \
  "$repo_path/deploy/production/deploy_github_revision.sh" \
  "$installed_deployer"
install -d -o root -g sarga -m 0750 /etc/sarga
printf 'refs/remotes/origin/%s\n' "$release_branch" >"$release_ref_file"
chown root:root "$release_ref_file"
chmod 0600 "$release_ref_file"
if [[ ! -f "$authorization_file" ]]; then
  openssl rand -hex 32 >"$authorization_file"
fi
chown root:root "$authorization_file"
chmod 0600 "$authorization_file"
authorization_value="$(<"$authorization_file")"
[[ "$authorization_value" =~ ^[0-9a-f]{64}$ ]] ||
  fail "invalid deployment authorization file: $authorization_file"
unset authorization_value

sudoers_candidate="$(mktemp)"
archive_path=""
cleanup() {
  rm -f "$sudoers_candidate"
  [[ -z "$archive_path" ]] || rm -f "$archive_path"
}
trap cleanup EXIT

printf '%s ALL=(root) NOPASSWD: %s\n' "$runner_user" "$installed_deployer" \
  >"$sudoers_candidate"
chmod 0440 "$sudoers_candidate"
visudo -cf "$sudoers_candidate" >/dev/null
install -o root -g root -m 0440 "$sudoers_candidate" "$sudoers_file"
visudo -cf "$sudoers_file" >/dev/null

if [[ -f "$runner_dir/.runner" ]]; then
  printf 'Runner is already configured; refreshed deployment policy and command.\n'
  (
    cd "$runner_dir"
    ./svc.sh start
    ./svc.sh status
    printf 'Set GitHub staging secret SARGA_DEPLOY_AUTHORIZATION from:\n'
    printf '  sudo cat %s\n' "$authorization_file"
  )
  exit 0
fi

runner_token="${RUNNER_TOKEN:-}"
if [[ -z "$runner_token" ]]; then
  [[ -t 0 ]] || fail "RUNNER_TOKEN is required when no interactive terminal is available"
  read -r -s -p "GitHub runner registration token: " runner_token
  printf '\n'
fi
[[ -n "$runner_token" ]] || fail "runner registration token cannot be empty"

archive_name="actions-runner-linux-x64-$runner_version.tar.gz"
archive_url="https://github.com/actions/runner/releases/download/v$runner_version/$archive_name"
archive_path="$(mktemp --suffix=.tar.gz)"

printf 'Downloading GitHub Actions runner v%s...\n' "$runner_version"
curl --fail --location --silent --show-error "$archive_url" --output "$archive_path"
printf '%s  %s\n' "$runner_sha256" "$archive_path" | sha256sum --check --status ||
  fail "GitHub Actions runner checksum verification failed"

tar --extract --gzip --file "$archive_path" --directory "$runner_dir" --no-same-owner
chown -R "$runner_user:$runner_user" "$runner_dir"

(
  cd "$runner_dir"
  ./bin/installdependencies.sh
  runuser -u "$runner_user" -- env HOME="$runner_dir" ./config.sh \
    --url "$repository_url" \
    --token "$runner_token" \
    --name "$runner_name" \
    --labels "$runner_labels" \
    --work _work \
    --unattended \
    --replace
  ./svc.sh install "$runner_user"
  ./svc.sh start
  ./svc.sh status
)
unset runner_token RUNNER_TOKEN

printf '\nGitHub Actions runner installed.\n'
printf 'Runner: %s\n' "$runner_name"
printf 'Labels: self-hosted, linux, x64, %s\n' "$runner_labels"
printf 'Allowed deployment branch: origin/%s\n' "$release_branch"
printf 'Privileged command: %s\n' "$installed_deployer"
printf 'Set GitHub staging secret SARGA_DEPLOY_AUTHORIZATION from:\n'
printf '  sudo cat %s\n' "$authorization_file"
