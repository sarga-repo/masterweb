#!/usr/bin/env bash

set -Eeuo pipefail

readonly NODE_MAJOR="22"
readonly PNPM_VERSION="10.22.0"
readonly POSTGRES_MAJOR="16"

usage() {
  cat <<'EOF'
Install production host dependencies for the Sarga native systemd deployment.

Usage:
  sudo deploy/production/install_dependencies.sh [options]

Options:
  --skip-postgres  Do not add the PostgreSQL repository or install PostgreSQL.
  --skip-nginx     Do not install or enable Nginx.
  --help           Show this help.

The script installs packages and pinned runtimes only. It does not create the
Sarga Linux user, database role/database, environment files, firewall rules,
swap, certificates, application builds, or CMS data imports.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

skip_postgres=false
skip_nginx=false

while (($#)); do
  case "$1" in
    --skip-postgres)
      skip_postgres=true
      shift
      ;;
    --skip-nginx)
      skip_nginx=true
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

[[ "${EUID}" -eq 0 ]] || fail "run this installer with sudo"
command -v apt-get >/dev/null || fail "apt-get was not found; Ubuntu is required"

# shellcheck source=/dev/null
source /etc/os-release
[[ "${ID:-}" == "ubuntu" ]] || fail "unsupported operating system: ${ID:-unknown}"
case "${VERSION_ID:-}" in
  22.04|24.04) ;;
  *) fail "supported Ubuntu releases are 22.04 and 24.04; found ${VERSION_ID:-unknown}" ;;
esac

export DEBIAN_FRONTEND=noninteractive

printf 'Installing base build and runtime packages...\n'
apt-get update
base_packages=(
  build-essential
  ca-certificates
  curl
  git
  gnupg
  libvips-dev
  make
  openssl
  python3
  rsync
  snapd
  ufw
)
if [[ "$skip_nginx" == false ]]; then
  base_packages+=(nginx)
fi
apt-get install -y --no-install-recommends "${base_packages[@]}"

installed_node_major=""
if command -v node >/dev/null; then
  installed_node_major="$(node --version | sed -E 's/^v([0-9]+).*/\1/')"
fi

if [[ "$installed_node_major" != "$NODE_MAJOR" ]]; then
  printf 'Configuring NodeSource for Node.js %s...\n' "$NODE_MAJOR"
  nodesource_setup="$(mktemp)"
  cleanup_nodesource() {
    rm -f -- "$nodesource_setup"
  }
  trap cleanup_nodesource EXIT
  curl --fail --show-error --silent --location \
    "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" \
    --output "$nodesource_setup"
  bash "$nodesource_setup"
  cleanup_nodesource
  trap - EXIT
  apt-get install -y nodejs
fi

command -v node >/dev/null || fail "Node.js installation did not provide node"
actual_node_major="$(node --version | sed -E 's/^v([0-9]+).*/\1/')"
[[ "$actual_node_major" == "$NODE_MAJOR" ]] ||
  fail "expected Node.js $NODE_MAJOR.x, found $(node --version)"

command -v corepack >/dev/null || fail "Node.js installation did not provide corepack"
corepack enable --install-directory /usr/local/bin
COREPACK_ENABLE_DOWNLOAD_PROMPT=0 COREPACK_DEFAULT_TO_LATEST=0 \
  corepack install --global "pnpm@${PNPM_VERSION}"
command -v pnpm >/dev/null || fail "Corepack did not provide pnpm"
actual_pnpm_version="$(COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
  COREPACK_DEFAULT_TO_LATEST=0 \
  corepack "pnpm@${PNPM_VERSION}" --version)"
[[ "$actual_pnpm_version" == "$PNPM_VERSION" ]] ||
  fail "expected pnpm $PNPM_VERSION, found $actual_pnpm_version"

if [[ "$skip_postgres" == false ]]; then
  printf 'Configuring the PostgreSQL Apt repository...\n'
  apt-get install -y --no-install-recommends postgresql-common

  install -d -o root -g root -m 0755 /usr/share/postgresql-common/pgdg
  curl --fail --show-error --silent --location \
    https://www.postgresql.org/media/keys/ACCC4CF8.asc \
    --output /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
  chmod 0644 /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc

  architecture="$(dpkg --print-architecture)"
  codename="${VERSION_CODENAME:-}"
  [[ -n "$codename" ]] || fail "Ubuntu VERSION_CODENAME is unavailable"

  pgdg_sources="$(mktemp)"
  cleanup_pgdg() {
    rm -f -- "$pgdg_sources"
  }
  trap cleanup_pgdg EXIT
  cat >"$pgdg_sources" <<EOF
Types: deb
URIs: https://apt.postgresql.org/pub/repos/apt
Suites: ${codename}-pgdg
Architectures: ${architecture}
Components: main
Signed-By: /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
EOF
  install -o root -g root -m 0644 \
    "$pgdg_sources" /etc/apt/sources.list.d/pgdg.sources
  cleanup_pgdg
  trap - EXIT

  apt-get update
  apt-get install -y --no-install-recommends \
    "postgresql-${POSTGRES_MAJOR}" \
    "postgresql-client-${POSTGRES_MAJOR}"
  systemctl enable --now postgresql
fi

if [[ "$skip_nginx" == false ]]; then
  systemctl enable --now nginx
  nginx -t
fi

printf '\nDependency installation completed.\n'
printf 'Node.js: %s\n' "$(node --version)"
printf 'pnpm: %s\n' "$actual_pnpm_version"
if [[ "$skip_postgres" == false ]]; then
  printf 'PostgreSQL client: %s\n' "$(psql --version)"
  pg_isready || true
fi
if [[ "$skip_nginx" == false ]]; then
  printf 'Nginx: %s\n' "$(nginx -v 2>&1)"
fi
cat <<'EOF'

Still required:
  1. Create the sarga user and /srv, /etc/sarga, and backup directories.
  2. When PostgreSQL was installed, create its application role and database.
  3. Clone the reviewed Git revision and run build_applications.sh.
  4. Create the protected environment files required by the selected apps.
  5. Run deploy/production/nginx/install-sarga-stack.sh for this host topology.
EOF
