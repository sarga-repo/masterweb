# 00 - Master Instruction for Codex

Read `AGENTS.md`, `README.md`, all `/docs`, and the relevant source PDFs before coding.

You are now working on a multisite Sarga repository:

- Sarga.co gateway and motorsport remains active.
- Sarga Horsesport will become a dedicated website in a separate frontend folder.
- All frontends use the same Strapi CMS.
- PostgreSQL local host port must remain `5435`.

Important:

- Do not build all phases at once.
- Do not create a second CMS unless explicitly approved.
- Do not implement internal payment, public accounts, or an internal ticketing engine.
- Use partner ticket redirect/deep link for ticketing.
- Use the all UI frontend design skill available for the Sarga Horsesport frontend.

First, summarize your understanding of:

1. The current repo structure.
2. The target repo structure.
3. The shared CMS strategy.
4. The visual difference between Sarga.co gateway and Sarga Motorsport.
5. The implementation phase order.

Do not write code until the user approves the plan or asks you to execute the first phase.


## Horse Sport expansion note

The project now includes a third frontend target:

```text
frontend-horsesport/ → Sarga Horse Sport dedicated site → local port 3002
```

Before implementing Horse Sport, read:

```text
docs/horsesport/
prompts/horsesport/
docs/multisite/04_three_site_integration_strategy.md
```

Use one shared Strapi CMS. Add `horsesport` to content scoping and do not create a second CMS.
