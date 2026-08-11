#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  cat <<'EOF'
Create the Sarga Linux account/directories and local PostgreSQL role/database.

Usage:
  sudo deploy/production/initialize_server.sh [options]

Options:
  --app-user NAME          Linux application user (default: sarga).
  --repo-path PATH         Repository directory (default: /srv/sarga-website).
  --db-role NAME           PostgreSQL login role (default: sarga_cms).
  --database NAME          PostgreSQL database (default: sarga_strapi).
  --fix-repo-ownership     Recursively assign an existing repository to the
                           application user. Use only for this exact checkout.
  --help                   Show this help.

When the PostgreSQL role is new, createuser prompts for its password without
putting the value in shell history. Existing users, roles, and databases are
left intact and validated instead of having credentials reset automatically.
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

app_user="sarga"
repo_path="/srv/sarga-website"
db_role="sarga_cms"
database_name="sarga_strapi"
fix_repo_ownership=false

while (($#)); do
  case "$1" in
    --app-user)
      require_value "$1" "${2:-}"
      app_user="$2"
      shift 2
      ;;
    --repo-path)
      require_value "$1" "${2:-}"
      repo_path="$2"
      shift 2
      ;;
    --db-role)
      require_value "$1" "${2:-}"
      db_role="$2"
      shift 2
      ;;
    --database)
      require_value "$1" "${2:-}"
      database_name="$2"
      shift 2
      ;;
    --fix-repo-ownership)
      fix_repo_ownership=true
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

[[ "${EUID}" -eq 0 ]] || fail "run this initializer with sudo"
[[ -t 0 ]] || fail "an interactive terminal is required for a new database role"
[[ "$app_user" =~ ^[a-z_][a-z0-9_-]*$ ]] || fail "invalid Linux user name"
[[ "$db_role" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || fail "invalid PostgreSQL role name"
[[ "$database_name" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]] || fail "invalid database name"
[[ "$repo_path" == /srv/* && "$repo_path" != "/srv" ]] ||
  fail "--repo-path must be a specific directory below /srv"

for command_name in adduser install systemctl sudo psql createuser createdb; do
  command -v "$command_name" >/dev/null || fail "required command not found: $command_name"
done
systemctl is-active --quiet postgresql || fail "PostgreSQL is not active"

if id "$app_user" >/dev/null 2>&1; then
  printf 'Linux user already exists: %s\n' "$app_user"
else
  adduser --disabled-password --gecos "" "$app_user"
fi
app_group="$(id -gn "$app_user")"

install -d -o "$app_user" -g "$app_group" -m 0755 "$repo_path"
install -d -o root -g "$app_group" -m 0750 /etc/sarga
install -d -o root -g "$app_group" -m 0750 /var/backups/sarga
install -d -o "$app_user" -g "$app_group" -m 0700 \
  /var/backups/sarga/incoming /var/backups/sarga/outgoing

if [[ "$fix_repo_ownership" == true ]]; then
  chown -R -- "$app_user:$app_group" "$repo_path"
elif [[ -n "$(find "$repo_path" -mindepth 1 ! -user "$app_user" -print -quit)" ]]; then
  printf 'Warning: %s contains files not owned by %s.\n' "$repo_path" "$app_user" >&2
  printf 'Re-run with --fix-repo-ownership after confirming this exact target.\n' >&2
fi

role_exists="$(sudo -u postgres psql --no-align --tuples-only --dbname=postgres \
  --command="SELECT 1 FROM pg_roles WHERE rolname = '${db_role}'")"
if [[ "$role_exists" == "1" ]]; then
  printf 'PostgreSQL role already exists; password was not changed: %s\n' "$db_role"
else
  printf 'Create a unique staging password for PostgreSQL role %s.\n' "$db_role"
  sudo -u postgres createuser --login --pwprompt "$db_role"
fi

database_owner="$(sudo -u postgres psql --no-align --tuples-only --dbname=postgres \
  --command="SELECT pg_catalog.pg_get_userbyid(datdba) FROM pg_database WHERE datname = '${database_name}'")"
if [[ -z "$database_owner" ]]; then
  sudo -u postgres createdb --owner="$db_role" --encoding=UTF8 "$database_name"
  database_owner="$db_role"
elif [[ "$database_owner" != "$db_role" ]]; then
  fail "database $database_name exists but is owned by $database_owner, not $db_role"
fi

printf '\nServer application identity and database initialized.\n'
printf 'Linux user/group: %s/%s\n' "$app_user" "$app_group"
printf 'Repository path: %s\n' "$repo_path"
printf 'Environment directory: /etc/sarga\n'
printf 'Backup directory: /var/backups/sarga\n'
printf 'PostgreSQL role/database: %s/%s\n' "$db_role" "$database_name"
cat <<'EOF'

Still required:
  1. Put the prompted database password in /etc/sarga/cms.env.
  2. Clone or update the reviewed repository revision as the application user.
  3. Create the protected CMS and frontend environment files.
EOF

