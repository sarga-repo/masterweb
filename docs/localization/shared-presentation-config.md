# Shared presentation configuration across locales

## Phase 1 contract

The CMS keeps translated editorial copy in each locale. A separate internal
`localized-presentation-config` record stores whether a locale is local, the
global source, or inheriting from the global source. The `Use global config`
action also persists a copy of the shared presentation values into the current
locale's draft entry; translated editorial copy is never copied.

### States

- `local`: the locale uses its own presentation values.
- `global`: this locale is the canonical presentation source for the document.
- `inherit`: the locale reads shared presentation values from the global locale.

Changing the global source does not overwrite translated text. `Use global
config` intentionally overwrites the current locale's shared presentation
values, while `Use local config` detaches the locale for future edits; it does
not restore values that were already overwritten.

### Inherited values

Only allowlisted presentation containers and presentation-named values are
inherited:

- visibility: `show*`, `hide*`, and boolean names ending in `Enabled`,
  `Active`, or `Visible` (including `pageEnabled` and
  `eventMenuEnabled`);
- media: fields ending in `Media`, `Image`, or `Video`, plus the shared
  `mediaItems` gallery field, including mobile variants;
- CTA destinations and targets ending in `CtaUrl` or `CtaTarget`.

Titles, descriptions, labels, body copy, alt text, generic URLs, SEO fields,
slugs, dates, relationships, and ordering remain locale-specific. The
`seo` object is not a presentation container, so its `ogImage` remains local.
Repeatable presentation items are matched by their existing array position;
items are never created or deleted by inheritance.

### Safety rules

- A source must be another locale of the same localized document.
- A document can have at most one global locale.
- Public reads resolve inherited values from the global locale. Using the
  global action also writes the current locale's shared values to its draft
  entry so the editor displays the persisted result.
- Public rendering uses the published source when the requested record is
  published. Draft preview uses the source status only for an authorized draft
  preview.
- If configuration, source content, or source locale is missing, the requested
  locale remains unchanged.

## Rollout phases

1. Contract and sidecar persistence (this phase).
2. Admin editor actions and status indicator.
3. Public API read-time resolver and Motorsport integration.
4. Cross-site frontend adoption, UAT, migration rehearsal, and deployment.
