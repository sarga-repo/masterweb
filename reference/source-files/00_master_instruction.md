# Codex Prompt 00 - Master Instruction

You are the coding agent for the Sarga.co website revamp.

Read all specification files in this repository before coding. The goal is to build a modern group gateway website for Sarga.co with Next.js, TypeScript, Tailwind CSS, and Strapi CMS.

Use the project specifications as the source of truth. Build incrementally. Do not implement payment, public user accounts, or an internal ticketing engine. Ticketing must use configurable partner redirect/deep link first.

Start by inspecting the repository structure. Then propose the implementation sequence and wait for confirmation before making large changes.

Visual reference requirement:

- Read `docs/12_visual_reference_guideline.md`.
- Use page 7 of `reference/source-pdfs/sarga_website_preview.pdf` as the primary brand guide for colors, typefaces, graphic language, and hero photography style.
- Treat the website screens on pages 1-5 as inspiration and proof of direction, not templates or pixel-perfect targets.
- Design an original premium interface at an international frontend standard. Preserve product requirements and content meaning, but exercise creative judgment in composition, layout, interaction, and responsive art direction.
- Use `reference/source-pdfs/requirements.pdf` as the original requirement source.
- Follow `docs/13_local_docker_deployment.md` for local Docker deployment.
- Do not embed the PDF directly into the site; implement the design as responsive components.

Also keep the local Docker Compose target working. The final repository must run frontend, Strapi, and PostgreSQL locally, with PostgreSQL exposed on host port 5435.


