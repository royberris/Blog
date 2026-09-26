# Node Format Reference

On Berris.dev, blog posts are called **nodes** and tags are called **clusters**. Each node is a Markdown file in `nodes/`, served at `/nodes/<slug>`. Nodes appear on the interactive node map and connect through shared clusters and `related` links.

## Slug

- The file name is the slug: `nodes/<slug>.md`. Lowercase, words separated by hyphens, short and descriptive (for example `designing-apis-for-ai-agents`).
- Every node gets a what3words-style code (for example `///willow.cedar.hollow`) derived from its slug. Renaming the slug later changes the code, so pick it carefully.
- The build fails if two slugs hash to the same code. If that happens, pick a different slug.

## Front matter

```yaml
---
title: "Designing APIs for AI Agents: Schemas, Security and MCP"
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
excerpt: "140 to 160 characters on what the reader gets out of this node, written like a search snippet, in the same voice as the post."
tags: ["Tag1", "Tag2", "Tag3"]
author: "Roy Berris"
related: ["other-node-slug"]
---
```

Required:

- **title**: Clear about the topic, under about 60 characters, with the main keyword near the start (the phrase a reader would search for). A "Topic: angle" subtitle works well.
- **date**: Publication date, `YYYY-MM-DD`, quoted.
- **excerpt**: 140 to 160 characters, plain and specific, no marketing words. Write it as the search result snippet: the main keyword plus what the reader learns. Shown on cards, as the meta description, in search results and in `/llms.txt`.
- **tags**: 2 to 4 clusters, all present as keys in `data/tags.json`.
- **author**: Must match a key in `data/authors.json` exactly. Add a new author there (role, bio, avatar, github) before using a new name.

Optional:

- **related**: Slugs (file name without `.md`) of nodes this one really builds on. Each one draws a direct line on the map. Don't add links just to connect things.
- **updated**: `YYYY-MM-DD`, quoted. Set it whenever you revise a published node in a meaningful way (new sections, corrected facts, a TL;DR or FAQ). Leave `date` as the original publication date. Typo fixes don't count.

## Body

- Start the body with an H1 that repeats the title. The site strips it (the page header already shows the title), but it keeps the Markdown readable on its own.
- Directly under the H1, add a 2 to 3 sentence **TL;DR** (`**TL;DR:** ...`) that answers the core question of the node on its own, with the key facts and numbers.
- Use H2 for main sections and H3 for sub-sections. Descriptive headings, not "Section 1". Where it reads naturally, phrase a few headings as the question a reader would ask ("How should API security change for AI agents?").
- End with a short `## FAQ` section (before the optional transparency note): 3 or 4 questions as H3s, each answered in 2 to 4 sentences. Answers only restate what the post already says, never new claims.
- Lists, **bold** and *italic* are fine. Don't overdo them.

## Search and AI citability

Nodes are read by search engines and by AI assistants (ChatGPT, Claude, Perplexity) through the pages, `/llms.txt`, `/llms-full.txt` and the raw `/nodes/<slug>.md` files. These rules make a node easy to find and to quote correctly:

- **Answer first.** The TL;DR and the first paragraph of each section state the answer, then explain it. Each section should make sense when quoted on its own.
- **Cite primary sources.** Every external fact or statistic links inline to the original source (the report, spec or official docs), not to an article about it. Name the source and year in the sentence ("[Postman's 2025 State of the API report](https://www.postman.com/state-of-api/2025/) shows...").
- **Be specific and first-hand.** Concrete projects, decisions, numbers and trade-offs from the author's own work beat general advice. Never invent them.
- **Keep facts exact.** Quote numbers as the source states them. Don't round, merge or reinterpret.
- **Link between nodes.** Link to related nodes inline with `/nodes/<slug>/` (trailing slash) and list them in `related` when this node really builds on them.

## Clusters (tags)

Always reuse existing clusters from `data/tags.json`. The build and `npm run validate-tags` warn about unknown tags, and unknown tags are dropped from the page.

1. Read `data/tags.json` and pick the best matches.
2. An existing tag that fits reasonably is better than a new near-duplicate.
3. Only create a new cluster when nothing fits. Then:
   - Explain to the user why no existing tag fits.
   - Add it to `data/tags.json` with a `fullName` and a one-sentence `description` (the description feeds the `/llms.txt` glossary).
   - Make it broad enough to reuse for future nodes and named like the existing ones.

## Code and diagrams

- The focus is on concepts and decisions, not tutorials. Explain approaches in prose first.
- No application code walkthroughs (C#, TypeScript, and so on).
- A short schema, config or contract snippet (OpenAPI, JSON, YAML) is fine when it shows the idea faster than prose. Always introduce it in a sentence and explain what the reader should notice after it.
- Mermaid diagrams are welcome for architecture and flows. The site has a dark theme with light text, so only use `style` overrides with dark fills and an explicit light `color`, for example:

  ```
  style Schema fill:#0e3a4a,stroke:#67e8f9,color:#e0f7ff
  style Patterns fill:#3b1f5c,stroke:#c084fc,color:#f3e8ff
  style Context fill:#14432a,stroke:#4ade80,color:#dcfce7
  style Discovery fill:#4a2e0e,stroke:#fb923c,color:#ffedd5
  ```

  Light fills like `#e1f5fe` make the text unreadable.

## .NET and technical accuracy

- Use official names for .NET and C# features and include version numbers when talking about capabilities (for example ".NET 8", "C# 12").
- Use the correct names for libraries and tools.
- Back technical claims with Microsoft documentation, specs or other trusted sources. Link them inline.
- When a post is about a design decision, mention Architecture Decision Records (ADRs) where it fits naturally: how the decision was documented, or why it's worth documenting.

## Validation

Run before handing the node back:

```
npm run validate-tags
```

It checks that every tag exists in `data/tags.json` and every `related` slug points at an existing node.
