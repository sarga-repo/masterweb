#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  cat <<'EOF'
Create and persist a swap file for Sarga server build-spike protection.

Usage:
  sudo deploy/production/configure_swap.sh [--size-gb NUMBER]

Options:
  --size-gb NUMBER  Swap-file size in GiB (default: 4; allowed: 1-64).
  --help            Show this help.

The script uses /swapfile, mode 600, adds an /etc/fstab entry, and sets
vm.swappiness=10. When /swapfile is already active, it only verifies/repairs
persistence and swappiness. It does not combine with a different swap device.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

size_gb=4
while (($#)); do
  case "$1" in
    --size-gb)
      [[ -n "${2:-}" && "${2:-}" != --* ]] || fail "$1 requires a value"
      size_gb="$2"
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

[[ "${EUID}" -eq 0 ]] || fail "run this swap configurator with sudo"
[[ "$size_gb" =~ ^[0-9]+$ ]] || fail "--size-gb must be a whole number"
((size_gb >= 1 && size_gb <= 64)) || fail "--size-gb must be between 1 and 64"

for command_name in swapon mkswap fallocate install sysctl; do
  command -v "$command_name" >/dev/null || fail "required command not found: $command_name"
done

swapfile_active=false
if swapon --show=NAME --noheadings | awk '{$1=$1};1' | grep -Fxq /swapfile; then
  swapfile_active=true
  printf '/swapfile is already active; verifying persistence and swappiness.\n'
else
  existing_swap="$(swapon --show=NAME --noheadings | awk '{$1=$1};1')"
  [[ -z "$existing_swap" ]] || fail "another swap device is already active: $existing_swap"
  [[ ! -e /swapfile ]] || fail "/swapfile exists but is not active; inspect it before continuing"

  required_bytes=$((size_gb * 1024 * 1024 * 1024))
  available_bytes="$(df --output=avail -B1 / | tail -n 1 | tr -d '[:space:]')"
  ((available_bytes > required_bytes + 1073741824)) ||
    fail "insufficient free disk space for ${size_gb} GiB swap plus 1 GiB reserve"

  fallocate -l "${size_gb}G" /swapfile
  chmod 0600 /swapfile
  mkswap /swapfile
  swapon /swapfile
fi

if ! grep -Eq '^[[:space:]]*/swapfile[[:space:]]+none[[:space:]]+swap[[:space:]]' /etc/fstab; then
  printf '/swapfile none swap sw 0 0\n' >>/etc/fstab
fi

swappiness_config="$(mktemp)"
cleanup() {
  rm -f -- "$swappiness_config"
}
trap cleanup EXIT
printf 'vm.swappiness=10\n' >"$swappiness_config"
install -o root -g root -m 0644 \
  "$swappiness_config" /etc/sysctl.d/99-sarga-swap.conf
sysctl --system >/dev/null

if [[ "$swapfile_active" == true ]]; then
  printf 'Verified active swap file with vm.swappiness=%s.\n' "$(sysctl -n vm.swappiness)"
else
  printf 'Configured %s GiB swap with vm.swappiness=%s.\n' \
    "$size_gb" "$(sysctl -n vm.swappiness)"
fi
swapon --show
free -h
