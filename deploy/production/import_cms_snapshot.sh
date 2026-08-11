#!/usr/bin/env bash

set -Eeuo pipefail

readonly EXPECTED_STRAPI_VERSION="5.49.0"

usage() {
  cat <<'EOF'
Validate and import an encrypted Sarga Strapi content/media snapshot.

Usage:
  sudo deploy/production/import_cms_snapshot.sh \
    --archive /var/backups/sarga/incoming/sarga-cms-YYYYMMDDTHHMMSSZ.tar.gz.enc

Options:
  --archive PATH       Required encrypted Strapi archive. The matching
                       .sha256 and .git-sha sidecars must be beside it.
  --repo PATH          Repository path (default: /srv/sarga-website).
  --cms-env PATH       CMS environment file (default: /etc/sarga/cms.env).
  --database NAME      Target PostgreSQL database (default: sarga_strapi).
  --backup-dir PATH    Rollback backup directory (default: /var/backups/sarga).
  --service NAME       CMS systemd service (default: sarga-cms).
  --app-user NAME      Application Linux user (default: sarga).
  --help               Show this help.

The import is destructive. The script requires an interactive terminal, makes
a paired PostgreSQL/uploads backup, asks for explicit confirmation, and leaves
Strapi's encrypted-archive passphrase prompt interactive. It never uses
Strapi's --force option and does not recreate admin users or API tokens.
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

archive=""
repo_path="/srv/sarga-website"
cms_env="/etc/sarga/cms.env"
database_name="sarga_strapi"
backup_dir="/var/backups/sarga"
service_name="sarga-cms"
app_user="sarga"

while (($#)); do
  case "$1" in
    --archive)
      require_value "$1" "${2:-}"
      archive="$2"
      shift 2
      ;;
    --repo)
      require_value "$1" "${2:-}"
      repo_path="$2"
      shift 2
      ;;
    --cms-env)
      require_value "$1" "${2:-}"
      cms_env="$2"
      shift 2
      ;;
    --database)
      require_value "$1" "${2:-}"
      database_name="$2"
      shift 2
      ;;
    --backup-dir)
      require_value "$1" "${2:-}"
      backup_dir="$2"
      shift 2
      ;;
    --service)
      require_value "$1" "${2:-}"
      service_name="$2"
      shift 2
      ;;
    --app-user)
      require_value "$1" "${2:-}"
      app_user="$2"
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

[[ "${EUID}" -eq 0 ]] || fail "run this importer with sudo"
[[ -t 0 ]] || fail "an interactive terminal is required"
[[ -n "$archive" ]] || fail "--archive is required"
[[ "$archive" == /* ]] || fail "--archive must be an absolute path"
[[ "$repo_path" == /* ]] || fail "--repo must be an absolute path"
[[ "$cms_env" == /* ]] || fail "--cms-env must be an absolute path"
[[ "$backup_dir" == /* ]] || fail "--backup-dir must be an absolute path"
[[ "$database_name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || fail "invalid database name"
[[ "$service_name" =~ ^[A-Za-z0-9_.@-]+$ ]] || fail "invalid service name"
[[ "$app_user" =~ ^[A-Za-z_][A-Za-z0-9_-]*$ ]] || fail "invalid application user"

for command_name in git openssl pnpm pg_dump tar systemctl sudo curl; do
  command -v "$command_name" >/dev/null || fail "required command not found: $command_name"
done

checksum_file="${archive}.sha256"
git_sha_file="${archive}.git-sha"
cms_path="$repo_path/cms"
uploads_path="$cms_path/public/uploads"

[[ -s "$archive" ]] || fail "archive is missing or empty: $archive"
[[ -s "$checksum_file" ]] || fail "checksum sidecar is missing or empty: $checksum_file"
[[ -s "$git_sha_file" ]] || fail "Git SHA sidecar is missing or empty: $git_sha_file"
[[ -d "$repo_path/.git" ]] || fail "repository checkout was not found: $repo_path"
[[ -f "$cms_path/package.json" ]] || fail "CMS package was not found: $cms_path"
[[ -r "$cms_env" ]] || fail "CMS environment file is not readable: $cms_env"
id "$app_user" >/dev/null 2>&1 || fail "application user does not exist: $app_user"
systemctl cat "$service_name" >/dev/null || fail "systemd service does not exist: $service_name"
systemctl is-active --quiet postgresql || fail "PostgreSQL is not active"
systemctl is-active --quiet "$service_name" || fail "$service_name must be active before import"

expected_sha="$(tr -d '[:space:]' <"$checksum_file")"
actual_sha="$(openssl dgst -sha256 "$archive" | awk '{print $NF}')"
[[ "$actual_sha" == "$expected_sha" ]] || fail "archive SHA-256 does not match its sidecar"

expected_git_sha="$(tr -d '[:space:]' <"$git_sha_file")"
[[ "$expected_git_sha" =~ ^[0-9a-fA-F]{40}$ ]] || fail "invalid Git SHA sidecar"
actual_git_sha="$(git -C "$repo_path" rev-parse HEAD)"
[[ "$actual_git_sha" == "$expected_git_sha" ]] ||
  fail "target Git SHA $actual_git_sha does not match snapshot SHA $expected_git_sha"

# shellcheck source=/dev/null
set -a
source "$cms_env"
set +a
[[ "${DATABASE_NAME:-}" == "$database_name" ]] ||
  fail "CMS environment DATABASE_NAME (${DATABASE_NAME:-unset}) does not match --database ($database_name)"

actual_strapi_version="$(sudo -u "$app_user" --preserve-env \
  pnpm --dir "$cms_path" exec strapi version | tail -n 1 | tr -d '[:space:]')"
[[ "$actual_strapi_version" == "$EXPECTED_STRAPI_VERSION" ]] ||
  fail "expected Strapi $EXPECTED_STRAPI_VERSION, found $actual_strapi_version"

database_exists="$(sudo -u postgres psql --no-align --tuples-only \
  --dbname=postgres \
  --command="SELECT 1 FROM pg_database WHERE datname = '${database_name}'")"
[[ "$database_exists" == "1" ]] || fail "target database does not exist: $database_name"

app_group="$(id -gn "$app_user")"
install -d -o root -g root -m 0700 "$backup_dir"
install -d -o "$app_user" -g "$app_group" -m 0755 "$uploads_path"

printf '\nValidated snapshot:\n'
printf '  Archive: %s\n' "$archive"
printf '  SHA-256: %s\n' "$actual_sha"
printf '  Git SHA: %s\n' "$actual_git_sha"
printf '  Strapi: %s\n' "$actual_strapi_version"
printf '  Database: %s\n' "$database_name"
printf '  Service: %s\n' "$service_name"
printf '\nThis operation will replace the target Strapi content and uploads.\n'
printf 'Type the database name (%s) to continue: ' "$database_name"
read -r confirmation
[[ "$confirmation" == "$database_name" ]] || fail "confirmation did not match; nothing was changed"

backup_id="$(date -u +%Y%m%dT%H%M%SZ)"
database_backup="$backup_dir/pre_import_${database_name}_${backup_id}.dump"
uploads_backup="$backup_dir/pre_import_${database_name}_${backup_id}_uploads.tar.gz"
service_stopped=false

restart_after_failure() {
  exit_status=$?
  if [[ "$service_stopped" == true ]]; then
    systemctl start "$service_name" || true
  fi
  if ((exit_status != 0)); then
    printf 'Import failed. Keep editorial access closed and inspect the backups:\n' >&2
    printf '  %s\n  %s\n' "$database_backup" "$uploads_backup" >&2
  fi
  exit "$exit_status"
}
trap restart_after_failure EXIT

systemctl stop "$service_name"
service_stopped=true

printf 'Creating PostgreSQL rollback backup...\n'
sudo -u postgres pg_dump --format=custom "$database_name" >"$database_backup"
[[ -s "$database_backup" ]] || fail "database backup is empty"

printf 'Creating uploads rollback backup...\n'
tar -C "$cms_path/public" -czf "$uploads_backup" uploads
[[ -s "$uploads_backup" ]] || fail "uploads backup is empty"
chmod 0600 "$database_backup" "$uploads_backup"

printf 'Importing snapshot. Enter its separately stored passphrase when prompted.\n'
sudo -u "$app_user" --preserve-env \
  pnpm --dir "$cms_path" data:import --file "$archive"

systemctl start "$service_name"
service_stopped=false
trap - EXIT

systemctl is-active --quiet "$service_name" || fail "$service_name did not become active"
curl --fail --silent --show-error --retry 10 --retry-delay 2 \
  http://127.0.0.1:1337/admin >/dev/null

printf '\nCMS snapshot import completed.\n'
printf 'Database rollback backup: %s\n' "$database_backup"
printf 'Uploads rollback backup: %s\n' "$uploads_backup"
printf 'Uploaded files now present: '
find "$uploads_path" -type f | wc -l
cat <<'EOF'

Still required:
  1. Verify collection counts, draft/published states, media, and representative pages.
  2. Verify or recreate staging admin users; they are not in the snapshot.
  3. Recreate least-privilege staging API tokens; they are not in the snapshot.
  4. Put the token in /etc/sarga/motorsport.env, rebuild/restart Motorsport, and smoke-test it.
EOF
