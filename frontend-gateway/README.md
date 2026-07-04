This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Strapi integration

Content is fetched server-side through the typed services in `src/lib/strapi/`
(`homepage.ts`, `ecosystem.ts`, `news.ts`, `events.ts`, `forms.ts`). Every read
service **falls back to bundled mock data** (`src/lib/mock-data.ts`) when Strapi
is unreachable or unconfigured, so the site renders without a running CMS.

Environment variables (see the repo-root `.env.example`):

| Variable                     | Scope       | Purpose                                                                                           |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `STRAPI_API_URL`             | server-only | Base URL used for content fetching (Docker: `http://strapi:1337`, local: `http://localhost:1337`) |
| `NEXT_PUBLIC_STRAPI_API_URL` | public      | Browser-reachable base URL used to build absolute media/image URLs                                |
| `STRAPI_API_TOKEN`           | server-only | Read-only API token; never exposed to the browser. Blank ⇒ mock fallback                          |
| `NEXT_PUBLIC_SITE_URL`       | public      | Canonical public site URL used for Open Graph, sitemap, and share-card image resolution           |

The Strapi client imports `server-only`, guaranteeing the token and fetch logic
are never bundled into client-side JavaScript.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
