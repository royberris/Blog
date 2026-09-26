---
name: write-node
description: Write a new Berris.dev blog post (a "node" in nodes/) in the author's tone of voice, from notes, a brain dump, an outline or source material. Use when asked to write, draft or create a blog post, article or node for Berris.dev.
---

# Write a Berris.dev node

Turn the author's raw material into a finished node that sounds like them. The author provides the ideas, experience and opinions. You provide structure, flow and readability. This is the workflow described in `nodes/ai-assisted-blogging.md`: a writing partner, not a ghostwriter.

## Before you write

1. Read `references/voice.md` (tone of voice) and `references/format.md` (front matter, clusters, code and diagram rules).
2. Read `nodes/ai-assisted-blogging.md` as the reference for the voice. Skim the other files in `nodes/` to see what already exists and what this node might build on.
3. Read `data/tags.json` and `data/authors.json`.

## Gather the raw material

The voice depends on real experience, so never invent it. You need:

- **The topic and the angle.** What is the one thing the reader should take away?
- **The real story.** What project, decision or problem is behind it? What went well, what went wrong, what was surprising?
- **Opinions.** Where does the author stand, and why?
- **Evidence.** Numbers, reports, docs or links that back the claims.
- **Audience depth.** How technical should it get?

If the user gave notes, emails, diagrams or other material, work from that. If important parts are missing (especially the real story or the takeaway), ask a few focused questions before drafting. Don't fill gaps with made-up anecdotes, team details, metrics or results. If you must draft without something, leave a clear `[TODO: ...]` marker for the author.

## Structure

Use this framework as a default, and adapt the headings to the topic (descriptive headings, not the framework labels). Where it reads naturally, phrase a few headings as the question a reader would search for.

0. **TL;DR.** Directly under the H1: 2 to 3 sentences that answer the core question on their own, with the key facts.
1. **Introduction.** An honest hook: a personal admission, a concrete moment, or a surprising fact. Why this matters now, and why the author cares.
2. **The problem.** What exactly is the challenge? What is already known, and where do current approaches fall short?
3. **The approach.** What the author did and how they decided. Which alternatives they looked at and why they didn't pick them.
4. **What happened in practice.** What worked, what broke, what surprised them. Technical and team or organisational lessons.
5. **Recommendations.** Specific, actionable advice for a reader facing the same problem. Speak to "you".
6. **Conclusion.** Short summary, what's next, and one plain closing sentence that sticks.
7. **FAQ.** 3 or 4 short questions and answers, grounded only in what the post already says.

Aim for roughly 900 to 1,800 words unless the user asks otherwise.

## Write

- Follow `references/voice.md` closely: first person, direct, short sentences, active voice, no corporate words, no em dashes.
- Separate facts (with a named source, linked inline) from opinion ("In my experience...", "I think..."). Link to the primary source (the report, spec or official docs), not to an article about it.
- Prefer specific, first-hand examples over general advice. They are what search engines and AI assistants quote.
- Explain every acronym the first time.
- Keep one term per concept for the whole post.
- Follow the code and Mermaid rules in `references/format.md`.

## Save

1. Pick a slug (see `references/format.md`) and write the file to `nodes/<slug>.md`.
2. Fill in the front matter. Use today's date unless told otherwise, and `"Roy Berris"` as author unless told otherwise. Keep the title under about 60 characters with the main keyword near the start, and write the excerpt as a 140 to 160 character search snippet (see `references/format.md`).
3. Pick 2 to 4 existing clusters. Only propose a new one when nothing fits, and explain why before adding it to `data/tags.json`.
4. Add `related` only for nodes this one really builds on.
5. If the author wants it, end with the short italic transparency note used in `nodes/ai-assisted-blogging.md`, stating that AI helped with structure and readability while the insights are the author's own.
6. Run `npm run validate-tags` and fix any issue.

## Self-review

Before handing it back, run the checklist from the `review-node` skill (`.agents/skills/review-node/SKILL.md`) over your draft and fix what you find. Then tell the user:

- The file path and slug.
- The clusters you picked, and any new cluster you added.
- Every `[TODO: ...]` you left and every claim that still needs a source.
