# Go-Live Checklist

## Content — Gateway (sarga.co)

- [ ] Final homepage copy approved
- [ ] Final About copy approved
- [ ] Final ecosystem content approved
- [ ] Final news/publication content approved
- [ ] Footer/legal text approved
- [ ] All images have alt text

## Content — Motorsport (motorsport.sarga.co)

- [ ] Final homepage copy approved
- [ ] Final About copy approved
- [ ] Final events content approved
- [ ] Final news content approved
- [ ] Footer/legal text approved
- [ ] All images have alt text

## Technical

- [ ] Production build passes (gateway)
- [ ] Production build passes (motorsport)
- [ ] Domain configured (sarga.co)
- [ ] Domain configured (motorsport subdomain)
- [ ] SSL active on all domains
- [ ] CDN active
- [ ] Strapi production admin configured
- [ ] Strapi admin password changed from default
- [ ] API tokens created (least-privilege, one per frontend)
- [ ] PostgreSQL backup configured
- [ ] Media storage configured (S3-compatible)
- [ ] Environment variables configured (all secrets replaced)
- [ ] `SEED_DEMO_CONTENT=false` in production
- [ ] No secrets in repo
- [ ] Cross-site links tested (gateway ↔ motorsport)

## SEO

- [ ] Metadata completed (both sites)
- [ ] Open Graph images configured (both sites)
- [ ] sitemap.xml working (both sites)
- [ ] robots.txt working (both sites)
- [ ] Canonicals reviewed
- [ ] Search indexing allowed where appropriate

## Forms

- [ ] Contact form submits (motorsport)
- [ ] `FORM_SUBMISSION_MODE=strapi` in production
- [ ] Error state works
- [ ] Anti-spam active (rate limiting + honeypot)
- [ ] Recipient/webhook confirmed
- [ ] Optional reCAPTCHA configured if approved

## Ticketing

- [ ] Event CTA links tested
- [ ] External links open safely (`target="_blank" rel="noopener noreferrer"`)
- [ ] Partner URLs confirmed by Sarga
- [ ] No internal payment flow present
- [ ] Optional embed iframe tested if configured

## CMS Content

- [ ] All content has explicit `siteScope` set
- [ ] Motorsport events/news with gateway teasers verified
- [ ] Ticket CTAs linked to correct events
- [ ] Partner logos uploaded
- [ ] Media gallery populated

## Handover

- [ ] Repository access handed over
- [ ] Admin credentials handed over
- [ ] Deployment guide handed over
- [ ] CMS admin guide handed over
- [ ] Environment variable inventory documented
- [ ] Maintenance process agreed
- [ ] Hypercare channel agreed
- [ ] UAT checklist signed off
# Go-Live Checklist

## Content

- [ ] Final homepage copy approved
- [ ] Final About copy approved
- [ ] Final ecosystem content approved
- [ ] Final news/publication content approved
- [ ] Final ticketing links approved
- [ ] Footer/legal text approved
- [ ] All images have alt text

## Technical

- [ ] Production build passes
- [ ] Domain configured
- [ ] SSL active
- [ ] CDN active
- [ ] Strapi production admin configured
- [ ] PostgreSQL backup configured
- [ ] Media storage configured
- [ ] Environment variables configured
- [ ] No secrets in repo

## SEO

- [ ] Metadata completed
- [ ] Open Graph image configured
- [ ] sitemap.xml working
- [ ] robots.txt working
- [ ] Canonicals reviewed
- [ ] Search indexing allowed where appropriate

## Forms

- [ ] Contact form submits
- [ ] Newsletter submits
- [ ] Error state works
- [ ] Anti-spam active
- [ ] Recipient/webhook confirmed

## Ticketing

- [ ] Event CTA links tested
- [ ] External links open safely
- [ ] Partner URLs confirmed by Sarga
- [ ] No internal payment flow present

## Handover

- [ ] Repository access handed over
- [ ] Admin credentials handed over
- [ ] Deployment guide handed over
- [ ] CMS admin guide handed over
- [ ] Maintenance process agreed
- [ ] Hypercare channel agreed
