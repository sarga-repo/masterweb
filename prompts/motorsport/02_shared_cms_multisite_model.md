# 02 — Shared CMS Multisite Model

Execute this phase only.

Read:

- `docs/multisite/03_shared_cms_content_sync_strategy.md`
- `docs/motorsport/05_motorsport_content_model_extensions.md`
- existing `docs/05_content_model_strapi.md`
- existing Strapi schemas under `cms/src`

Tasks:

1. Extend Strapi models to support site-aware content.
2. Add or prepare `Site` collection type.
3. Add site visibility fields to shared content where appropriate.
4. Extend events, news, ticket CTAs, and partners for motorsport use.
5. Keep backward compatibility with existing gateway content.
6. Update `strapi/content-types.json` and relevant docs if schemas change.

Rules:

- Use one shared Strapi CMS.
- Do not duplicate content types unnecessarily.
- Do not create a second CMS.
- Do not implement checkout/payment/account logic.

Acceptance criteria:

- CMS can distinguish gateway, motorsport, and shared content.
- Motorsport event/news/ticket content can be queried separately.
- Gateway can show motorsport teasers when configured.

Do not continue to the next phase.
