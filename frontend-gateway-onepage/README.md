# Sarga.co One-page Gateway

Static, presentation-ready implementation of the client-supplied Sarga.co one-page layout. Phase 1 deliberately has no CMS or runtime API dependency.

## Local development

```bash
pnpm install
pnpm dev
```

The app runs on `http://localhost:3004` so it can coexist with the existing gateway, motorsport, and horse sport frontends.

## Production

```bash
pnpm build
pnpm start
```

All navigation items scroll to sections on this page. External campaign, ecosystem, and social links open in a new tab.
