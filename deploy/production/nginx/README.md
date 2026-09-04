# Sarga stack Nginx installer

This directory contains the reviewed all-site Nginx example and a focused
installer that currently requires Sarga Motorsport and the shared Strapi CMS.
Gateway, the one-page Gateway presentation, and Horse Sport are optional and
can be enabled with hostname flags when those applications are deployed.
It is part of this repository so proxy configuration remains versioned with
the applications and systemd units; a separate Nginx repository is not needed.

The installer expects the repository at any location, but the installed
systemd units continue to use the approved `/srv/sarga-website` deployment
path. Install Nginx first and prepare `/etc/sarga/cms.env` and
`/etc/sarga/motorsport.env` before starting services.

## HTTP-only installation

Use this before DNS or client-managed certificates are ready:

```bash
sudo deploy/production/nginx/install-sarga-stack.sh \
  --motorsport-host staging-motorsport.example.com \
  --cms-host staging-cms.example.com \
  --start-services
```

The two virtual hosts listen on port 80 and proxy only to the loopback
listeners on ports 3001 and 1337. Test an unresolved hostname from another
machine with:

```bash
curl --resolve staging-motorsport.example.com:80:SERVER_IP \
  http://staging-motorsport.example.com/
```

## Client-managed or Cloudflare origin certificates

Install the certificate and private-key files outside the repository, then
re-run the installer:

```bash
sudo deploy/production/nginx/install-sarga-stack.sh \
  --motorsport-host motorsport.example.com \
  --cms-host cms.example.com \
  --tls \
  --motorsport-cert /etc/ssl/sarga/motorsport-fullchain.pem \
  --motorsport-key /etc/ssl/sarga/motorsport-privkey.pem \
  --cms-cert /etc/ssl/sarga/cms-fullchain.pem \
  --cms-key /etc/ssl/sarga/cms-privkey.pem \
  --start-services
```

## Adding Gateway and Horse Sport

Pass either optional hostname when its application, environment file, and
production build are ready:

```bash
sudo deploy/production/nginx/install-sarga-stack.sh \
  --gateway-host www.example.com \
  --gateway-onepage-host presentation.example.com \
  --motorsport-host motorsport.example.com \
  --horsesport-host horsesport.example.com \
  --cms-host cms.example.com \
  --start-services
```

Gateway maps to loopback port 3000, the one-page Gateway presentation maps to
port 3004, and Horse Sport maps to port 3002. With `--tls`, also pass the
matching certificate/key options for every configured optional host. A
wildcard certificate may reuse the same absolute paths for multiple hosts if it
covers every configured hostname.

The script validates that all certificate paths are absolute and readable,
tests the complete Nginx configuration before reload, and keeps a timestamped
backup when replacing its prior generated file. It deliberately does not copy,
issue, or renew certificates. Certificate lifecycle remains with the
infrastructure owner.

Use Cloudflare **Full (strict)** when the records are proxied. A Cloudflare
Origin CA certificate is intended for the Cloudflare-to-origin connection and
will not be trusted by browsers connecting directly to the server.

## What the installer changes

- installs `sarga-cms.service` and `sarga-motorsport.service`, plus the Gateway,
  one-page Gateway, and Horse Sport units when their hostname flags are
  supplied;
- writes `/etc/nginx/sites-available/sarga-stack.conf`;
- enables that Nginx site without deleting unrelated/default sites;
- validates and reloads Nginx;
- enables and starts all configured application services only when
  `--start-services` is supplied; otherwise it only installs their units.

When upgrading from the earlier focused installer, it disables the exact
legacy `sarga-motorsport-stack.conf` enabled symlink to avoid duplicate virtual
hosts, while retaining the old available file.

It does not install operating-system packages, clone the repository, create
environment files, migrate content, change the firewall, alter DNS, or manage
certificates. Those remain explicit operator steps in the deployment and
content-promotion runbooks.
