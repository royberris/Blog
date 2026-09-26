---
name: review-node
description: Review or rewrite an existing Berris.dev blog post (a node in nodes/) so it matches the author's tone of voice, structure and format rules. Use when asked to review, edit, polish, proofread or fix the tone of a blog post or node.
---

# Review a Berris.dev node

Check a node against the Berris.dev voice and format, then fix it or report what to change.

## Before you review

1. Read `.agents/skills/write-node/references/voice.md` and `.agents/skills/write-node/references/format.md`.
2. Read `nodes/ai-assisted-blogging.md` as the voice reference.
3. Read the node under review in full, plus `data/tags.json`.

## Checklist

**Voice**
- [ ] First person ("I", "my"), talks to the reader as "you". "We" only for a specific team.
- [ ] Professional but casual all the way through. No switch to formal or report language.
- [ ] No words from the "avoid" table in `voice.md` (leverage, utilize, operationalize, comprehensive, robust, seamless, and so on).
- [ ] Active voice for the author's own decisions.
- [ ] Short, simple sentences. Paragraphs of 2 to 5 sentences.
- [ ] One term per concept across the whole post.
- [ ] No em dashes (—).
- [ ] Opens with an honest hook, closes with one plain sentence. No stacked grand closers.

**Substance**
- [ ] Real experience: concrete projects, decisions, failures and surprises, not generic advice.
- [ ] Facts have a named, linked source. Opinions are marked as opinions.
- [ ] Claims of improvement have a number or a concrete example. No bare "significantly".
- [ ] Honest about scope and limits. No overstated authority.
- [ ] Acronyms explained on first use.
- [ ] Alternatives considered, and why they were not picked.
- [ ] Recommendations are specific and actionable.
- [ ] ADRs mentioned where the post is about a design decision and it fits naturally.

**Format**
- [ ] Front matter complete: title, date, excerpt, tags, author (plus `related` if it builds on other nodes).
- [ ] 2 to 4 tags, all in `data/tags.json`. `related` slugs exist.
- [ ] Excerpt is plain and specific, in the same voice.
- [ ] Body starts with an H1 matching the title. Descriptive H2/H3 headings.
- [ ] No application code walkthroughs. Any schema or config snippet is introduced and explained.
- [ ] Mermaid `style` overrides use dark fills with explicit light text colour.
- [ ] `npm run validate-tags` passes.

## Output

- If the user asked for a review, list the findings grouped by Voice, Substance and Format. Quote the offending sentence and give a rewrite in the Berris.dev voice.
- If the user asked for edits, apply them directly to the file. Keep the author's ideas, opinions and facts. Change how things are said, not what is claimed.
- Never add anecdotes, numbers or results the author didn't provide. Where something is missing, add a `[TODO: ...]` marker or ask.
- Finish with a short summary of what changed and anything the author still needs to fill in.
