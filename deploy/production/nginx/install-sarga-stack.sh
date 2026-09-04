#!/usr/bin/env bash

set -Eeuo pipefail

usage() {
  cat <<'EOF'
Install the Sarga systemd units and Nginx virtual hosts.

HTTP-only setup (useful before certificates are supplied):
  sudo ./install-sarga-stack.sh \
    --motorsport-host staging-motorsport.example.com \
    --cms-host staging-cms.example.com

Add the other sites whenever they are deployed:
  sudo ./install-sarga-stack.sh \
    --gateway-host www.example.com \
    --gateway-onepage-host presentation.example.com \
    --motorsport-host motorsport.example.com \
    --horsesport-host horsesport.example.com \
    --cms-host cms.example.com

Client-supplied or Cloudflare origin certificates:
  sudo ./install-sarga-stack.sh \
    --motorsport-host motorsport.example.com \
    --cms-host cms.example.com \
    --tls \
    --motorsport-cert /etc/ssl/sarga/motorsport-fullchain.pem \
    --motorsport-key /etc/ssl/sarga/motorsport-privkey.pem \
    --cms-cert /etc/ssl/sarga/cms-fullchain.pem \
    --cms-key /etc/ssl/sarga/cms-privkey.pem \
    --start-services

Options:
  --gateway-host HOST      Optional Gateway hostname (port 3000).
  --gateway-onepage-host HOST
                           Optional one-page Gateway hostname (port 3003).
  --motorsport-host HOST   Required Motorsport hostname.
  --horsesport-host HOST   Optional Horse Sport hostname (port 3002).
  --cms-host HOST          Required CMS hostname.
  --tls                    Configure HTTPS and redirect HTTP to HTTPS.
  --gateway-cert PATH      Gateway certificate/full-chain path.
  --gateway-key PATH       Gateway private-key path.
  --gateway-onepage-cert PATH
                           One-page Gateway certificate/full-chain path.
  --gateway-onepage-key PATH
                           One-page Gateway private-key path.
  --motorsport-cert PATH   Motorsport certificate/full-chain path.
  --motorsport-key PATH    Motorsport private-key path.
  --horsesport-cert PATH   Horse Sport certificate/full-chain path.
  --horsesport-key PATH    Horse Sport private-key path.
  --cms-cert PATH          CMS certificate/full-chain path.
  --cms-key PATH           CMS private-key path.
  --start-services         Enable and start all configured services.
  --help                   Show this help.

Without --tls, the generated virtual hosts listen on HTTP only. Re-run the
script with --tls after certificates are installed. The script does not issue,
copy, renew, or otherwise manage certificates.
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

validate_hostname() {
  local hostname="$1"
  [[ "$hostname" =~ ^[A-Za-z0-9]([A-Za-z0-9.-]*[A-Za-z0-9])?$ ]] ||
    fail "invalid hostname: $hostname"
  [[ "$hostname" == *.* ]] || fail "hostname must be a fully qualified name: $hostname"
  [[ "$hostname" != *..* ]] || fail "invalid hostname: $hostname"
}

gateway_host=""
gateway_onepage_host=""
motorsport_host=""
horsesport_host=""
cms_host=""
tls_enabled=false
start_services=false
gateway_cert=""
gateway_key=""
gateway_onepage_cert=""
gateway_onepage_key=""
motorsport_cert=""
motorsport_key=""
horsesport_cert=""
horsesport_key=""
cms_cert=""
cms_key=""

while (($#)); do
  case "$1" in
    --gateway-host)
      require_value "$1" "${2:-}"
      gateway_host="$2"
      shift 2
      ;;
    --gateway-onepage-host)
      require_value "$1" "${2:-}"
      gateway_onepage_host="$2"
      shift 2
      ;;
    --motorsport-host)
      require_value "$1" "${2:-}"
      motorsport_host="$2"
      shift 2
      ;;
    --horsesport-host)
      require_value "$1" "${2:-}"
      horsesport_host="$2"
      shift 2
      ;;
    --cms-host)
      require_value "$1" "${2:-}"
      cms_host="$2"
      shift 2
      ;;
    --tls)
      tls_enabled=true
      shift
      ;;
    --gateway-cert)
      require_value "$1" "${2:-}"
      gateway_cert="$2"
      shift 2
      ;;
    --gateway-key)
      require_value "$1" "${2:-}"
      gateway_key="$2"
      shift 2
      ;;
    --gateway-onepage-cert)
      require_value "$1" "${2:-}"
      gateway_onepage_cert="$2"
      shift 2
      ;;
    --gateway-onepage-key)
      require_value "$1" "${2:-}"
      gateway_onepage_key="$2"
      shift 2
      ;;
    --motorsport-cert)
      require_value "$1" "${2:-}"
      motorsport_cert="$2"
      shift 2
      ;;
    --motorsport-key)
      require_value "$1" "${2:-}"
      motorsport_key="$2"
      shift 2
      ;;
    --horsesport-cert)
      require_value "$1" "${2:-}"
      horsesport_cert="$2"
      shift 2
      ;;
    --horsesport-key)
      require_value "$1" "${2:-}"
      horsesport_key="$2"
      shift 2
      ;;
    --cms-cert)
      require_value "$1" "${2:-}"
      cms_cert="$2"
      shift 2
      ;;
    --cms-key)
      require_value "$1" "${2:-}"
      cms_key="$2"
      shift 2
      ;;
    --start-services)
      start_services=true
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
[[ -n "$motorsport_host" ]] || fail "--motorsport-host is required"
[[ -n "$cms_host" ]] || fail "--cms-host is required"
validate_hostname "$motorsport_host"
validate_hostname "$cms_host"
[[ -z "$gateway_host" ]] || validate_hostname "$gateway_host"
[[ -z "$gateway_onepage_host" ]] || validate_hostname "$gateway_onepage_host"
[[ -z "$horsesport_host" ]] || validate_hostname "$horsesport_host"

configured_hosts=("$motorsport_host" "$cms_host")
[[ -z "$gateway_host" ]] || configured_hosts+=("$gateway_host")
[[ -z "$gateway_onepage_host" ]] || configured_hosts+=("$gateway_onepage_host")
[[ -z "$horsesport_host" ]] || configured_hosts+=("$horsesport_host")
for ((host_index = 0; host_index < ${#configured_hosts[@]}; host_index++)); do
  for ((other_index = host_index + 1; other_index < ${#configured_hosts[@]}; other_index++)); do
    [[ "${configured_hosts[$host_index]}" != "${configured_hosts[$other_index]}" ]] ||
      fail "configured hostnames must be unique: ${configured_hosts[$host_index]}"
  done
done

for command_name in nginx systemctl install mktemp; do
  command -v "$command_name" >/dev/null || fail "required command not found: $command_name"
done

if [[ "$tls_enabled" == true ]]; then
  tls_paths=("$motorsport_cert" "$motorsport_key" "$cms_cert" "$cms_key")
  if [[ -n "$gateway_host" ]]; then
    tls_paths+=("$gateway_cert" "$gateway_key")
  fi
  if [[ -n "$gateway_onepage_host" ]]; then
    tls_paths+=("$gateway_onepage_cert" "$gateway_onepage_key")
  fi
  if [[ -n "$horsesport_host" ]]; then
    tls_paths+=("$horsesport_cert" "$horsesport_key")
  fi
  for tls_path in "${tls_paths[@]}"; do
    [[ -n "$tls_path" ]] || fail "certificate/key options are required for every configured host with --tls"
    [[ "$tls_path" == /* ]] || fail "certificate and key paths must be absolute: $tls_path"
    [[ "$tls_path" != *[$'\n\r\t ']* ]] || fail "certificate and key paths cannot contain whitespace"
    [[ -r "$tls_path" ]] || fail "certificate or key is not readable: $tls_path"
  done
fi

if [[ "$start_services" == true ]]; then
  [[ -f /etc/sarga/cms.env ]] || fail "missing /etc/sarga/cms.env"
  [[ -f /etc/sarga/motorsport.env ]] || fail "missing /etc/sarga/motorsport.env"
  [[ -z "$gateway_host" || -f /etc/sarga/gateway.env ]] || fail "missing /etc/sarga/gateway.env"
  [[ -z "$gateway_onepage_host" || -f /etc/sarga/gateway-onepage.env ]] || fail "missing /etc/sarga/gateway-onepage.env"
  [[ -z "$horsesport_host" || -f /etc/sarga/horsesport.env ]] ||
    fail "missing /etc/sarga/horsesport.env"
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "$script_dir/../../.." && pwd)"
systemd_source="$repo_root/deploy/production/systemd"
nginx_available="/etc/nginx/sites-available/sarga-stack.conf"
nginx_enabled="/etc/nginx/sites-enabled/sarga-stack.conf"
legacy_nginx_available="/etc/nginx/sites-available/sarga-motorsport-stack.conf"
legacy_nginx_enabled="/etc/nginx/sites-enabled/sarga-motorsport-stack.conf"

configured_units=(sarga-cms.service sarga-motorsport.service)
[[ -z "$gateway_host" ]] || configured_units+=(sarga-gateway.service)
[[ -z "$gateway_onepage_host" ]] || configured_units+=(sarga-gateway-onepage.service)
[[ -z "$horsesport_host" ]] || configured_units+=(sarga-horsesport.service)
for unit in "${configured_units[@]}"; do
  [[ -f "$systemd_source/$unit" ]] || fail "missing repository service unit: $systemd_source/$unit"
done

temporary_config="$(mktemp)"
cleanup() {
  rm -f -- "$temporary_config"
}
trap cleanup EXIT

write_proxy_headers() {
  cat <<'EOF'
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
EOF
}

write_http_server() {
  local hostname="$1"
  local upstream="$2"
  local read_timeout="$3"
  local max_body="${4:-}"

  cat <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $hostname;
EOF
  if [[ -n "$max_body" ]]; then
    printf '    client_max_body_size %s;\n' "$max_body"
  fi
  cat <<EOF

    location / {
        proxy_pass http://$upstream;
EOF
  write_proxy_headers
  cat <<EOF
        proxy_read_timeout $read_timeout;
    }
}

EOF
}

write_redirect_server() {
  local hostname="$1"
  cat <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $hostname;
    return 301 https://\$host\$request_uri;
}

EOF
}

write_tls_server() {
  local hostname="$1"
  local upstream="$2"
  local certificate="$3"
  local key="$4"
  local read_timeout="$5"
  local max_body="${6:-}"

  cat <<EOF
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name $hostname;

    ssl_certificate $certificate;
    ssl_certificate_key $key;
EOF
  if [[ -n "$max_body" ]]; then
    printf '    client_max_body_size %s;\n' "$max_body"
  fi
  cat <<EOF

    location / {
        proxy_pass http://$upstream;
EOF
  write_proxy_headers
  cat <<EOF
        proxy_read_timeout $read_timeout;
    }
}

EOF
}

{
  printf '# Generated by deploy/production/nginx/install-sarga-stack.sh\n'
  printf '# Re-run the installer to change hostnames or certificate paths.\n\n'

  if [[ "$tls_enabled" == true ]]; then
    if [[ -n "$gateway_host" ]]; then
      write_redirect_server "$gateway_host"
      write_tls_server "$gateway_host" "127.0.0.1:3000" \
        "$gateway_cert" "$gateway_key" "60s"
    fi
    if [[ -n "$gateway_onepage_host" ]]; then
      write_redirect_server "$gateway_onepage_host"
      write_tls_server "$gateway_onepage_host" "127.0.0.1:3003" \
        "$gateway_onepage_cert" "$gateway_onepage_key" "60s"
    fi
    write_redirect_server "$motorsport_host"
    write_tls_server "$motorsport_host" "127.0.0.1:3001" \
      "$motorsport_cert" "$motorsport_key" "60s"
    if [[ -n "$horsesport_host" ]]; then
      write_redirect_server "$horsesport_host"
      write_tls_server "$horsesport_host" "127.0.0.1:3002" \
        "$horsesport_cert" "$horsesport_key" "60s"
    fi
    write_redirect_server "$cms_host"
    write_tls_server "$cms_host" "127.0.0.1:1337" \
      "$cms_cert" "$cms_key" "300s" "100m"
  else
    if [[ -n "$gateway_host" ]]; then
      write_http_server "$gateway_host" "127.0.0.1:3000" "60s"
    fi
    if [[ -n "$gateway_onepage_host" ]]; then
      write_http_server "$gateway_onepage_host" "127.0.0.1:3003" "60s"
    fi
    write_http_server "$motorsport_host" "127.0.0.1:3001" "60s"
    if [[ -n "$horsesport_host" ]]; then
      write_http_server "$horsesport_host" "127.0.0.1:3002" "60s"
    fi
    write_http_server "$cms_host" "127.0.0.1:1337" "300s" "100m"
  fi
} >"$temporary_config"

for unit in "${configured_units[@]}"; do
  install -o root -g root -m 0644 \
    "$systemd_source/$unit" "/etc/systemd/system/$unit"
done

install -d -o root -g root -m 0755 /etc/nginx/sites-available /etc/nginx/sites-enabled

backup_path=""
if [[ -e "$nginx_available" ]]; then
  backup_path="${nginx_available}.bak.$(date -u +%Y%m%dT%H%M%SZ)"
  cp -a -- "$nginx_available" "$backup_path"
fi

install -o root -g root -m 0644 "$temporary_config" "$nginx_available"
ln -sfn "$nginx_available" "$nginx_enabled"

legacy_site_disabled=false
if [[ -L "$legacy_nginx_enabled" ]] &&
  [[ "$(readlink -f -- "$legacy_nginx_enabled")" == "$legacy_nginx_available" ]]; then
  unlink -- "$legacy_nginx_enabled"
  legacy_site_disabled=true
fi

if ! nginx -t; then
  if [[ -n "$backup_path" ]]; then
    cp -a -- "$backup_path" "$nginx_available"
  else
    mv -- "$nginx_available" "${nginx_available}.invalid"
  fi
  if [[ "$legacy_site_disabled" == true ]]; then
    ln -s "$legacy_nginx_available" "$legacy_nginx_enabled"
  fi
  nginx -t || true
  fail "Nginx validation failed; the previous configuration was restored"
fi

systemctl daemon-reload
systemctl enable --now nginx
systemctl reload nginx

if [[ "$start_services" == true ]]; then
  systemctl enable --now "${configured_units[@]}"
else
  printf 'Application units were installed but not enabled or started.\n'
fi

printf 'Installed Nginx configuration: %s\n' "$nginx_available"
if [[ -n "$gateway_host" ]]; then
  printf 'Gateway: %s -> 127.0.0.1:3000\n' "$gateway_host"
fi
if [[ -n "$gateway_onepage_host" ]]; then
  printf 'Gateway one-page: %s -> 127.0.0.1:3003\n' "$gateway_onepage_host"
fi
printf 'Motorsport: %s -> 127.0.0.1:3001\n' "$motorsport_host"
if [[ -n "$horsesport_host" ]]; then
  printf 'Horse Sport: %s -> 127.0.0.1:3002\n' "$horsesport_host"
fi
printf 'CMS: %s -> 127.0.0.1:1337\n' "$cms_host"
if [[ "$tls_enabled" == true ]]; then
  printf 'TLS mode: client-supplied certificates\n'
else
  printf 'TLS mode: HTTP only; re-run with --tls after certificates are installed\n'
fi
if [[ -n "$backup_path" ]]; then
  printf 'Previous Nginx configuration backup: %s\n' "$backup_path"
fi
printf 'Validate services with: systemctl status nginx %s\n' "${configured_units[*]}"
