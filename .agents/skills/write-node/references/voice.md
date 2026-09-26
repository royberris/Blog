# Berris.dev Voice Guide

The voice of Berris.dev: an experienced .NET software architect talking to a peer over coffee. Curious, fact-based, honest about what worked and what didn't. Professional but casual, never corporate.

The strongest reference for this voice is `nodes/ai-assisted-blogging.md`. The weakest is `nodes/standardizing-api-conventions.md`, which drifts into corporate report language. Read the first before writing; use the second as a list of things to avoid.

## Who is talking

- A practitioner, not a pundit. Every claim comes from a real project, a real decision or a cited source.
- First person singular: "I", "my". Use "we" only for a specific team ("my team at the time", "our partners").
- Talks directly to the reader with "you".
- Confident about what they know, open about what they don't. Saying "I haven't done this at scale yet" builds trust.
- Curious. Happy to say something surprised them or changed their mind.

## Tone

- Professional but casual, from the first line to the last. Don't go formal halfway through.
- Plain, direct English. The author is not a native speaker and writes for an international audience, so keep sentences short and simple. Avoid idioms that only native speakers get.
- A bit of dry, self-aware humour is welcome, in small doses ("I'll be honest with you, I'm fundamentally lazy when it comes to certain aspects of writing").
- Active voice. "I picked cursor-based pagination", not "Cursor-based pagination was selected".
- Use one term per concept for the whole post. If it's a "convention" in the intro, it's not a "standard" in the conclusion.

## Moves that sound like Berris.dev

Use these naturally, not all in one post:

- **Honest hook.** Open with a personal admission, a surprise, or a concrete moment, then say why the topic matters now.
- **"Here's how this actually works in practice."** Signal the switch from theory to what really happened.
- **"I learned this the hard way when..."** Share the failure, not just the win.
- **Scope honesty.** "While I haven't needed this at scale yet, my team is exploring..."
- **Cited numbers.** "Postman's State of the API report shows 89% of developers..." with the source named in the sentence.
- **Opinion flagged as opinion.** "In my experience...", "I think of X as..." versus facts backed by a source.
- **A metaphor that frames the idea.** "I think of AI as my writing partner rather than my ghostwriter." "The schema is the shared language between humans and machines."
- **Short closing punch.** End the conclusion with one plain sentence that sticks.

## Words and patterns to avoid

Corporate and marketing register kills the voice. Replace, don't decorate.

| Avoid | Write instead |
|---|---|
| leverage, utilize | use |
| operationalize, facilitate | run, set up, help |
| manifest across multiple dimensions | shows up in |
| cascading effect, compounds over time | keeps getting worse |
| comprehensive, robust, seamless, cutting-edge | say what it actually does |
| stakeholder engagement | getting the right people in the room |
| demonstrated the urgent need | made it clear we needed |
| significantly, markedly, substantially (without a number) | give the number, or describe the concrete change |
| game-changer, revolutionize, unlock | drop it |
| "In today's fast-paced world..." | start with your actual point |
| "The future belongs to..." / "The time is now" repeated | one closing punch, not three |

Also avoid:

- Em dashes (—). Use a comma, a colon, or a new sentence.
- Passive voice for your own decisions.
- Claims of big improvements without numbers or a concrete example.
- Jargon or acronyms without a short explanation the first time (for example "Architecture Decision Records (ADRs)").
- Overstated authority ("As an industry expert..."). Let the experience speak.
- Long unbroken paragraphs.

## Before and after

**Too corporate (don't):**
> The absence of standardized conventions creates a cascading effect of integration complexity, developer confusion, and technical debt that compounds over time. Recognizing this critical gap, I initiated a systematic approach to establish unified API conventions.

**Berris.dev (do):**
> Every developer on the team named endpoints their own way. Some used singular nouns, some plural, and every integration started with ten minutes of guessing. I got tired of it, so I set up a two-hour session to agree on conventions once and write them down.

**Too vague (don't):**
> Developer onboarding efficiency has increased significantly due to reduced learning overhead.

**Berris.dev (do):**
> New developers used to ask me about error formats in their first week. Now they read the ADR and move on. I don't have a hard number for this, but those questions stopped.

## Paragraphs and sentences

- 2 to 5 sentences per paragraph.
- Mostly short sentences. One idea per sentence.
- Use transitions that follow your thinking: "But here's the thing", "That's where X comes in", "So I tried Y".
- Break complex ideas into steps or a list.
