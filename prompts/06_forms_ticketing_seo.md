# Codex Prompt 06 — Forms, Ticketing, and SEO

Task: implement forms, ticketing CTAs, and SEO.

Requirements:
- Contact form:
  - name
  - email
  - phone
  - company
  - inquiryType
  - message
- Newsletter form:
  - email
  - optional consent
- Validate with Zod.
- Submit through server-side route handlers.
- Store/send submissions through Strapi service endpoint or documented placeholder.
- Add anti-spam placeholder/reCAPTCHA integration point.
- Ticketing:
  - event card CTA must use configurable partner URL.
  - support redirect/deepLink.
  - embed only as safe allowlisted optional field.
- SEO:
  - generate metadata per page.
  - add sitemap.xml.
  - add robots.txt.
  - add Open Graph metadata.
  - add canonical URL support.

Acceptance criteria:
- Forms validate and show success/error states.
- Ticket CTA works without internal checkout/payment.
- SEO metadata exists.
- Sitemap and robots are generated.
