You are a **Senior System Documentation Specialist, Technical Writer, CMS Specialist, and UX Documentation Expert**.

Your task is to create a **complete, practical, and user-friendly CMS User Manual for the Sarga Motorsport website**.

The intended readers are **non-technical CMS administrators, marketing/content teams, and business users**. The manual must help a user confidently manage Sarga Motorsport website content without needing assistance from a developer.

The final documentation should answer questions such as:

- "Where do I change this text?"
- "Which CMS field controls this part of the website?"
- "How do I replace this image?"
- "How do I add a new item?"
- "How do I remove an item?"
- "Where does this content appear on the website?"
- "Why is my update not visible?"
- "What happens if I leave this field empty?"

The guide should work as a **day-to-day reference manual**, especially when users are confused or forget how to manage a particular part of the website.

---

# 1. Understand the System Before Writing

Do **not** immediately start writing the manual.

First, carefully inspect the repository and understand how the Sarga Motorsport frontend and CMS are implemented.

Read at minimum:

- `AGENTS.md`
- `README.md`
- relevant Markdown documentation under `doc/` or `docs/`
- CMS/Strapi configuration
- content types
- components
- schemas
- relations
- media fields
- dynamic zones/components, if used
- frontend page routes
- frontend page components
- API/content fetching implementation
- mapping between CMS responses and frontend components
- existing screenshots or documentation assets

Search the repository as necessary rather than making assumptions.

The documentation must be based on the **actual implementation**, not on generic Strapi behavior.

If the CMS and frontend are maintained in separate folders/projects, inspect both.

---

# 2. Scope

Create a comprehensive guide covering **all CMS-manageable content used by the Sarga Motorsport website**.

The scope must include an exhaustive audit of **every Sarga Motorsport entry
available to editors in Strapi under both Collection Types and Single Types**.
Discover this inventory from the running/local CMS configuration and the
repository schemas rather than relying on a predefined list of content types.
Do not hardcode or assume a menu list is complete. Any editor entry discovered
in the Motorsport CMS must be reviewed and either documented, mapped to its
frontend consumer, or explicitly marked as unused, shared, operational,
legacy, or not currently rendered. This rule applies equally to existing and
newly discovered editor entries so no CMS area is omitted from the manual.

Cover **every Sarga Motorsport frontend page and route**, including nested/detail pages where appropriate.

Examples may include, but are not limited to:

- Home
- About
- News
- News Listing
- News Detail
- Events
- Event Listing
- Event Detail
- Championship
- Race/Competition pages
- Teams
- Drivers/Riders
- Leadership
- Partners/Sponsors
- Gallery
- Contact
- Footer
- Header/navigation
- Shared/global content
- SEO-related content
- Any additional Motorsport page discovered in the repository

Do **not** rely only on the examples above.

Create the page inventory from the actual application.

---

# 3. Build a Complete Content Inventory

Before writing detailed instructions, identify:

1. All Strapi editor entries available to Sarga Motorsport users under
   Collection Types and Single Types. Build this list from the actual CMS
   configuration; do not limit discovery to examples or previously named menu
   items.
2. All Sarga Motorsport frontend routes.
3. All visible sections on each route.
4. Which sections are CMS-managed.
5. Which CMS content type/component controls each section.
6. Which CMS fields control individual frontend elements.
7. Shared/global fields reused across pages.
8. Repeatable content such as:
   - cards
   - slides
   - events
   - news
   - people
   - gallery items
   - sponsors
   - statistics
   - CTA items
9. Content that is still hardcoded and therefore cannot currently be managed from CMS.

Create a coverage matrix with one row for every discovered Collection Type and
Single Type. The matrix must include the user-facing editor location, schema
name, frontend consumers, status, and documentation location. If an editor
entry has no current frontend consumer, keep it in the matrix and explain why
it is retained or whether it is a cleanup candidate.

If something is hardcoded, explicitly document it as:

> **Not currently editable from CMS**

Do not invent CMS mappings for hardcoded content.

---

# 4. CMS-to-Frontend Mapping

This is one of the most important parts of the manual.

For **every editable page section**, clearly map:

**Website Page → Website Section → CMS Menu → CMS Content Type → CMS Field → Frontend Element**

For example:

| Website Page | Website Section | CMS Location | CMS Field | What It Controls |
|---|---|---|---|---|
| Home | Hero | Motorsport Home Page → Hero | `title` | Main hero heading |
| Home | Hero | Motorsport Home Page → Hero | `description` | Text below the heading |
| Home | Hero | Motorsport Home Page → Hero | `backgroundImage` | Hero background image |

Use the **actual CMS labels visible to users** whenever possible.

Technical/internal field names may be included as secondary references, but the user-facing CMS name should be more prominent.

---

# 5. Document Every Website Section

For each page, organize the guide based on the order users see sections on the actual website.

Recommended structure:

## Page Name

Briefly explain what the page is for.

### How to Open This Page in CMS

Example:

`Content Manager → Motorsport Home Page`

### Section 1 — Hero

Explain:

- where it appears on the website
- where it appears in CMS
- CMS fields involved
- what each field controls
- how to update it
- image requirements where relevant
- important notes
- expected frontend result

Include a screenshot of:

1. The frontend section.
2. The related CMS fields.

Clearly connect the CMS screenshot with the frontend result.

Continue this approach for every section.

---

# 6. CRUD Instructions

For content that supports creating or removing entries, provide clear instructions for:

## Add

Explain step-by-step how users add a new item.

Examples:

- news
- event
- driver
- leadership member
- gallery item
- sponsor
- card
- slide
- related item

## Update

Explain how existing content is modified.

## Delete

Explain:

- how to remove the item
- any confirmation required
- possible impact on the website
- whether deleting the content can affect related pages

If a safer option such as **Unpublish** should normally be used instead of Delete, clearly explain it.

---

# 7. Publishing Workflow

Explain the content publishing workflow in simple language.

Cover, where applicable:

- Save
- Draft
- Publish
- Unpublish
- Delete
- Cancel/discard changes
- required fields
- validation errors
- relations
- ordering
- preview behavior
- when website changes become visible

Explain the difference between:

**Save** and **Publish**

in non-technical language.

If the actual Strapi configuration behaves differently, document the real behavior.

---

# 8. Media Management

Create a dedicated section explaining how to manage:

- images
- hero images
- thumbnails
- logos
- gallery images
- icons
- videos, if supported
- downloadable documents, if supported

Explain:

- uploading a new file
- selecting an existing file
- replacing media
- removing media
- supported formats
- recommended image dimensions if they can be determined
- recommended aspect ratio
- file-size considerations
- image cropping behavior
- image quality considerations
- meaningful file naming

Where exact recommended dimensions cannot be verified, do not invent them. Explain the aspect ratio or current implementation instead.

---

# 9. Relations and Repeatable Content

Some CMS fields may involve selecting another CMS record rather than typing content directly.

Explain these concepts in user-friendly language.

For example:

Instead of:

> "Configure the one-to-many relational entity."

Use:

> "Choose the related Event that should appear in this section."

Explain how users manage:

- related content
- repeatable components
- cards
- lists
- drag-and-drop ordering
- adding/reordering/removing list items
- linked records

Include screenshots where they reduce ambiguity.

---

# 10. Ordering and Content Position

Determine how content ordering works.

Examples:

- newest first
- publish date
- explicit sort order
- drag-and-drop CMS ordering
- manually configured `order`
- frontend sorting logic

Document this clearly.

Users should know how to answer questions such as:

> "How do I make this item appear first?"

Do not assume ordering behavior; verify it from the implementation.

---

# 11. Screenshots

Screenshots are essential to this manual.

Use screenshots to visually connect the **CMS field** with the **actual website result**.

Where possible, every important section should contain:

### Frontend Screenshot

Show where the content appears on the Sarga Motorsport website.

### CMS Screenshot

Show exactly where the user edits that content.

When useful, annotate screenshots with:

- arrows
- numbered markers
- highlighted areas
- labels

Example:

`1 — Hero Title`

`2 — Hero Description`

`3 — Background Image`

The same numbering can then be used in the explanation below the screenshot.

Do not overload screenshots with unnecessary annotations.

Ensure:

- text remains readable
- screenshots are not stretched
- screenshots are not blurry
- screenshots are not excessively cropped
- important UI elements are visible
- screenshots fit properly when converted to PDF

Prefer actual application screenshots over diagrams whenever possible.

If screenshots are already available in the repository, reuse the appropriate ones.

If the local application can safely be run and screenshots can be captured from it, you may use them.

Do not fabricate screenshots.

---

# 12. Writing Style

The documentation is intended primarily for **non-technical users**.

Use:

- simple English
- short sentences
- direct instructions
- consistent terminology
- numbered steps for procedures
- bullet points for notes
- descriptive headings
- examples where useful

Avoid unnecessary terms such as:

- API endpoint
- JSON payload
- React component
- dynamic zone
- database relation
- frontend props
- GraphQL/REST
- component schema

unless understanding the term is necessary for the CMS user.

If a technical term must be used, briefly explain it.

For example:

> **Slug** — the part of the website address used to identify a page, such as `jakarta-race-2026` in `/event/jakarta-race-2026`.

---

# 13. Use Exact CMS Labels

Whenever possible, instructions must match what the user actually sees in CMS.

For example, prefer:

> Open **Content Manager → Motorsport Home Page → Hero**

rather than:

> Open the homepage single type.

Avoid exposing internal implementation terminology when a clearer user-facing name exists.

Use **bold formatting** for UI labels, buttons, menu names, and field names.

Example:

1. Open **Content Manager**.
2. Select **Motorsport Events**.
3. Click **Create new entry**.
4. Enter the event **Title**.
5. Upload the **Cover Image**.
6. Click **Save**.
7. Click **Publish**.

---

# 14. Important Notes and Warnings

Use consistent callouts.

For example:

> **Tip:** Use images with a similar aspect ratio to existing images to avoid unexpected cropping.

> **Important:** Clicking **Save** does not necessarily make the content visible on the website. The entry must also be **Published**.

> **Warning:** Deleting this item may remove it from multiple website sections because the same content is reused.

Only add warnings that are supported by actual system behavior.

---

# 15. Shared Content

Identify content that appears on several pages.

Examples:

- Header
- Navigation
- Footer
- Social links
- Contact information
- Logos
- Global CTA
- Sponsors
- SEO defaults

Create a dedicated:

# Global & Shared Content

section so users understand that changing shared content may affect multiple pages.

Clearly state where each shared element is used.

---

# 16. SEO Content

If CMS exposes SEO fields, provide a simple explanation for:

- Meta Title
- Meta Description
- Share Image / Open Graph Image
- Slug
- Canonical URL, if applicable

Explain why they matter without turning the manual into an SEO technical guide.

---

# 17. Common Tasks / Quick Guide

Create a practical **Common Tasks** section near the beginning of the manual.

Examples:

### Change Homepage Hero Text

`Content Manager → Motorsport Home Page → Hero → Title`

### Replace Homepage Hero Image

`Content Manager → Motorsport Home Page → Hero → Background Image`

### Add New News Article

`Content Manager → Motorsport News → Create new entry`

### Add New Event

`Content Manager → Motorsport Events → Create new entry`

### Update Footer Social Media

`Content Manager → Motorsport Global → Footer`

Use the actual CMS paths discovered from the system.

This section should work as a quick reference.

---

# 18. Troubleshooting

Create a dedicated troubleshooting section.

Include common situations such as:

### I changed the content but it is not visible

Possible checks:

- Was the entry saved?
- Was it published?
- Are required fields completed?
- Is the correct Motorsport entry being edited?
- Does the frontend use this CMS field?
- Is another related entry controlling the content?
- Is browser caching involved?

### My image looks cropped

Explain likely aspect-ratio behavior.

### My new item does not appear first

Explain actual ordering rules.

### I cannot delete an item

Explain relations or permissions if applicable.

### A field is available in CMS but does not appear on the website

Explain whether it is currently unused by the frontend.

Only include behavior that can be reasonably verified.

---

# 19. Glossary

At the end, provide a small glossary for CMS terminology users may encounter.

Examples:

- CMS
- Entry
- Draft
- Publish
- Unpublish
- Slug
- Media
- Relation
- Required field
- SEO
- Section

Keep explanations short and user-friendly.

---

# 20. Recommended Document Structure

Use approximately this structure:

# Sarga Motorsport CMS User Manual

## 1. Introduction
### Purpose of This Guide
### Who Should Use This Guide
### What You Can Manage

## 2. Getting Started
### Accessing the CMS
### CMS Dashboard Overview
### Content Manager Overview
### Understanding Save and Publish

## 3. Quick Reference — Common Tasks

## 4. Media Management

## 5. Global & Shared Content
### Header
### Navigation
### Footer
### Social Media
### Other Shared Content

## 6. Homepage
### Hero
### Section 2
### Section 3
...

## 7. About
...

## 8. Events
### Event Landing Page
### Creating an Event
### Updating an Event
### Removing an Event
### Event Detail Page
...

## 9. News
### News Landing Page
### Creating an Article
### Updating an Article
### Removing an Article
### News Detail Page
...

Continue for **every route discovered in Sarga Motorsport**.

## N. SEO Management

## N. Publishing & Unpublishing

## N. Troubleshooting

## N. Frequently Asked Questions

## N. CMS-to-Website Mapping Reference

## N. Glossary

---

# 21. CMS-to-Website Master Reference

Near the end of the document, create a consolidated mapping table.

Example:

| Page | Frontend Section | CMS Menu | CMS Section | Field | Content Type |
|---|---|---|---|---|---|
| Home | Hero | Motorsport Home | Hero | Title | Text |
| Home | Hero | Motorsport Home | Hero | Background Image | Media |
| Events | Hero | Motorsport Event Page | Hero | Subtitle | Text |

This should act as a **quick lookup table** for experienced CMS users.

Cover every CMS-managed frontend element that is practical to document.

---

# 22. Screenshot and Asset Organization

Keep documentation assets organized.

Recommended structure:

```text
docs/
└── cms-user-guide/
    ├── SARGA_MOTORSPORT_CMS_USER_GUIDE.md
    ├── assets/
    │   ├── getting-started/
    │   ├── global/
    │   ├── home/
    │   ├── about/
    │   ├── events/
    │   ├── news/
    │   └── ...
    └── SARGA_MOTORSPORT_CMS_USER_GUIDE.pdf
```

Use clear image filenames, for example:

```text
home-hero-frontend.png
home-hero-cms.png
event-create-entry.png
news-cover-image-field.png
footer-social-links-cms.png
```

Adapt the folder location to the repository's existing documentation convention if one already exists.

---

# 23. Markdown Quality

The Markdown document must:

- have a clickable Table of Contents
- use consistent heading levels
- have predictable section structure
- use relative image paths
- render correctly on GitHub/GitLab
- avoid broken links
- avoid overly wide tables where possible
- keep screenshots readable
- include page breaks or PDF hints where appropriate
- remain maintainable when the CMS changes later

Do not generate one enormous unstructured block of text.

---

# 24. PDF Generation

After the Markdown documentation is complete and validated, generate a **single PDF manual** from it.

The PDF should:

- contain all documentation
- contain all screenshots
- have a professional manual/book appearance
- have a cover/title page
- have a Table of Contents
- maintain correct heading hierarchy
- preserve readable screenshot resolution
- avoid screenshot cropping
- avoid splitting screenshots awkwardly across pages
- keep tables readable
- have appropriate margins
- include page numbers if practical
- be suitable for viewing digitally and printing on A4 paper

Suggested title:

**Sarga Motorsport  
CMS User Manual**

Subtitle:

**Content Management Guide**

Do not sacrifice image quality merely to reduce PDF size.

---

# 25. Validation Before Completion

Before considering the task finished, perform a documentation audit.

Verify:

### Page Coverage

- [ ] Every Sarga Motorsport route has been reviewed.
- [ ] Every CMS-manageable page has documentation.
- [ ] Shared/global content has documentation.

### CMS Editor Coverage

- [ ] Every discovered Sarga Motorsport Collection Type editor entry is in the coverage matrix.
- [ ] Every discovered Sarga Motorsport Single Type editor entry is in the coverage matrix.
- [ ] No editor entry was omitted because it was not in the initial examples or expected menu list.
- [ ] Unused, legacy, shared, operational, and frontend-unrendered editor entries are explicitly classified.

### Section Coverage

- [ ] Every visible CMS-managed section is mapped.
- [ ] CMS fields are mapped to frontend elements.
- [ ] Hardcoded sections are explicitly identified.

### CMS Operations

- [ ] Create instructions are included where applicable.
- [ ] Update instructions are included.
- [ ] Delete/Unpublish instructions are included where applicable.
- [ ] Publishing workflow is explained.
- [ ] Media management is explained.
- [ ] Relations/repeatable items are explained where necessary.

### Visual Documentation

- [ ] Important frontend sections have screenshots.
- [ ] Relevant CMS screens have screenshots.
- [ ] Screenshots are readable.
- [ ] Screenshot paths are valid.
- [ ] Screenshots are not cropped in the PDF.

### User Experience

- [ ] Instructions can be understood by a non-technical user.
- [ ] CMS labels match the actual CMS.
- [ ] Technical terminology has been minimized.
- [ ] Common tasks are easy to locate.
- [ ] Troubleshooting is included.
- [ ] Master CMS-to-frontend mapping is included.

### Output

- [ ] Markdown renders correctly.
- [ ] Table of Contents works.
- [ ] PDF generated successfully.
- [ ] PDF contains all images.
- [ ] No important content is cut off.

---

# 26. Accuracy Rules

These rules are critical:

1. **Do not invent CMS fields.**
2. **Do not invent frontend behavior.**
3. **Do not assume a page is CMS-managed without checking the implementation.**
4. **Do not document generic Strapi features that are not relevant to this project.**
5. **Use the actual user-facing CMS labels whenever available.**
6. **Clearly identify hardcoded frontend content.**
7. **Clearly identify CMS fields that exist but are not currently consumed by the frontend.**
8. **Verify relations and content ordering from the code.**
9. **Verify whether content is shared across Sarga Gateway, Motorsport, or Horsesport before telling users that changing it affects only Motorsport.**
10. **Sarga Motorsport is the scope of this manual. Do not unnecessarily document Gateway or Horsesport content.**

---

# 27. Documentation Workflow

Execute the task carefully in phases.

## Phase 1 — Discovery & Inventory

Inspect the repository and identify:

- every Sarga Motorsport editor entry under Collection Types and Single Types
  from the actual local CMS configuration
- frontend routes
- page sections
- CMS content types
- components
- CMS/frontend mapping
- global/shared content
- hardcoded content
- screenshot availability

Create a temporary coverage/inventory checklist before writing the final guide.

## Phase 2 — CMS-to-Frontend Mapping

Build the complete mapping between:

**CMS → Field → Frontend Page → Frontend Section**

Validate the mapping against the actual implementation.

## Phase 3 — Documentation

Create:

`SARGA_MOTORSPORT_CMS_USER_GUIDE.md`

Write the full manual using the structure defined above.

## Phase 4 — Screenshots

Add and organize appropriate screenshots.

Ensure screenshots clearly connect CMS controls with frontend results.

## Phase 5 — Documentation Audit

Compare:

- route inventory
- CMS content inventory
- documentation sections

Identify and fix anything missing.

## Phase 6 — PDF

Only after the Markdown guide passes the documentation audit, generate:

`SARGA_MOTORSPORT_CMS_USER_GUIDE.pdf`

Perform a final visual inspection of the PDF to ensure screenshots, headings, tables, and page breaks render correctly.

---

# 28. Final Deliverables

At completion, provide:

```text
SARGA_MOTORSPORT_CMS_USER_GUIDE.md
SARGA_MOTORSPORT_CMS_USER_GUIDE.pdf
cms-user-guide/assets/...
```

Also provide a short completion report containing:

### Pages Documented
List all Sarga Motorsport routes covered.

### CMS Areas Documented
List the major CMS content types covered.

### Hardcoded Content Found
List any frontend content that users may expect to edit but that is currently not configurable from CMS.

### CMS Fields Not Used by Frontend
List any significant CMS fields discovered that currently have no visible effect.

### Documentation Limitations
Mention anything that could not be verified.

### Files Generated
List the final Markdown, PDF, and asset locations.

---

# Primary Goal

The quality bar is:

> A person who has never seen the Sarga Motorsport codebase should be able to open this manual, find the website section they want to change, identify exactly where it is located in CMS, update it correctly, publish it, and understand the expected result without asking a developer for help.

Prioritize **accuracy, completeness, clarity, visual guidance, and ease of navigation** over brevity.

Treat this as an official **Sarga Motorsport CMS User Manual**, not merely technical documentation.
