#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  cat <<'EOF'
Configure the baseline UFW policy for the Sarga Nginx deployment.

Usage:
  sudo deploy/production/configure_firewall.sh [--ssh-port PORT]

The script allows the selected SSH port and the Nginx Full profile (HTTP and
HTTPS), sets default deny incoming/allow outgoing policies, and asks for
confirmation before enabling UFW. Cloud-provider firewall/security-group rules
must be configured separately.
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

ssh_port=""
while (($#)); do
  case "$1" in
    --ssh-port)
      [[ -n "${2:-}" && "${2:-}" != --* ]] || fail "$1 requires a value"
      ssh_port="$2"
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

[[ "${EUID}" -eq 0 ]] || fail "run this firewall configurator with sudo"
[[ -t 0 ]] || fail "an interactive terminal is required"
command -v ufw >/dev/null || fail "ufw is not installed"

if [[ -z "$ssh_port" && -n "${SSH_CONNECTION:-}" ]]; then
  ssh_port="$(awk '{print $4}' <<<"$SSH_CONNECTION")"
fi
ssh_port="${ssh_port:-22}"
[[ "$ssh_port" =~ ^[0-9]+$ ]] || fail "SSH port must be numeric"
((ssh_port >= 1 && ssh_port <= 65535)) || fail "SSH port is out of range"

printf 'This will enable UFW with inbound access for:\n'
printf '  SSH: TCP %s\n' "$ssh_port"
printf '  Nginx: TCP 80 and 443\n'
printf 'Confirm that the provider firewall also permits TCP %s before continuing.\n' "$ssh_port"
printf 'Type ENABLE to continue: '
read -r confirmation
[[ "$confirmation" == "ENABLE" ]] || fail "confirmation not received; firewall unchanged"

ufw default deny incoming
ufw default allow outgoing
ufw allow "${ssh_port}/tcp" comment 'SSH'
ufw allow 'Nginx Full'
ufw --force enable
ufw status verbose

printf '\nUFW configured. Keep the current SSH session open and test a second session now.\n'

