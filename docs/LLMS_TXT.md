# Machine-readable content: llms.txt, llms-full.txt and Markdown exports

Berris.dev publishes three plain-text views of its content so AI assistants (ChatGPT, Claude, Perplexity and others) and other tools can read and cite nodes without parsing the interactive map.

| URL | Source | What it contains |
|---|---|---|
| `/llms.txt` | `app/llms.txt/route.ts` | Index of the site in the [llmstxt.org](https://llmstxt.org/) format |
| `/llms-full.txt` | `app/llms-full.txt/route.ts` | The full Markdown body of every node in one file, newest first |
| `/nodes/<slug>.md` | `scripts/export-markdown.js` | The raw Markdown of one node, with a small front matter header |

All three are generated at build time. Nothing needs to be edited by hand when a node is added: they read `nodes/*.md` through `lib/nodes.ts` (or `gray-matter` in the script), and use `lib/site.ts` for the site URL, name, description and author.

## /llms.txt

Follows the llmstxt.org structure:

1. `# Berris.dev` (H1 with the site name).
2. A blockquote with `SITE_DESCRIPTION`.
3. A short paragraph about the author with links to `/about/`, GitHub and LinkedIn, plus a note on the `.md` variants and `/llms-full.txt`.
4. One H2 section per cluster (tag), biggest cluster first. Each section has the cluster description from `data/tags.json`, a link to the cluster page (`/clusters/<cluster-slug>/`) and a list of nodes: `- [Title](https://berris.dev/nodes/<slug>/): excerpt ([Markdown](https://berris.dev/nodes/<slug>.md))`. A node with several clusters appears in each of them.
5. An `## Optional` section with the about page, the node index, `/llms-full.txt` and the sitemap.

Because the excerpt is shown next to every link, write it as a 140 to 160 character summary (see `.agents/skills/write-node/references/format.md`).

## /llms-full.txt

One Markdown document: a short header (site, author, link back to `/llms.txt`), then every node separated by `---`. Each node starts with its title as H1, followed by its URL, Markdown URL, author, published date, updated date (when set), clusters, the excerpt as a blockquote and the full body.

## /nodes/<slug>.md

`next build` renders each node to `out/nodes/<slug>/index.html` (with `trailingSlash: true`). After the build, `scripts/export-markdown.js` writes the source Markdown next to it as `out/nodes/<slug>.md`, so the two never clash. The file starts with a front matter header:

```yaml
---
title: "Node title"
canonical: "https://berris.dev/nodes/<slug>/"
author: "Roy Berris"
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
excerpt: "..."
tags: ["..."]
---
```

The `canonical` field points to the HTML page, which is the version that should be cited and indexed.

The script runs as part of `pnpm build` (`next build && node scripts/export-markdown.js`). To run it on its own after a build: `pnpm export-markdown`. It exits with an error if `out/nodes` doesn't exist.

## Local testing

- `pnpm dev`, then open `http://localhost:3000/llms.txt` or `/llms-full.txt`. The `.md` exports only exist after `pnpm build`.
- After `pnpm build`, check `out/llms.txt`, `out/llms-full.txt` and `out/nodes/*.md`.

## Environment variables

- `NEXT_PUBLIC_BASE_URL`: base URL for absolute links. Defaults to `https://berris.dev`. Used by `lib/site.ts` and `scripts/export-markdown.js`.

## Clusters

Cluster names and descriptions come from `data/tags.json`. Add or change a cluster there, and it shows up in `/llms.txt` on the next build. Only tags listed in `data/tags.json` are included; run `pnpm validate-tags` to check.
