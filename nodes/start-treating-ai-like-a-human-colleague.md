---
title: "Start Treating AI Like a Human Colleague"
date: "2026-10-04"
updated: "2026-10-05"
excerpt: "Why treating AI like an engineering colleague beats prompt-by-prompt autocomplete: how I delegate epics, run an overnight cadence and mentor the agent."
tags: ["AI", "AI Agents", "Team Collaboration", "Engineering Leadership"]
author: "Roy Berris"
related: ["ai-assisted-blogging", "designing-apis-for-ai-agents"]
---

# Start Treating AI Like a Human Colleague

**TL;DR:** I get the most value from AI by treating it like an engineering colleague rather than a line-by-line autocomplete. Instead of micromanaging syntax, I delegate whole epics, set strict domain boundaries, and coach the agent through PR reviews and harness updates. That creates an asynchronous cadence where the agent can run tasks overnight and hand back clean pull requests in the morning.

I'll be honest with you, for a long time I used AI tools the way most developers do: like a glorified autocomplete. I sat in my IDE, typed half a method signature, pressed Tab, and watched the model guess the next few lines. If it guessed right, I saved two seconds. If it guessed wrong, I deleted the hallucinated code and typed it myself.

It felt fast in the moment, but by the end of the day, I was exhausted. I was spending my energy micromanaging every single keystroke and waiting for completions. I wasn't doing software architecture; I was babysitting a predictive text generator.

Everything changed when I stopped treating the agent like an inline code snippet generator and started treating it like a junior engineering colleague who joined our team. When you onboard a new developer, you don't hover over their shoulder and dictate every variable name. You give them a clear epic, walk them through the domain rules, point them to the test suite, and check in when they need guidance. Once I applied that exact mindset to AI agents, our daily development cadence changed completely.

## Why Does Line-by-Line Prompting Fall Short?

When developers complain that AI models produce poor code, the problem is almost always how they interact with the tool. They treat the agent like a search bar, throwing isolated three-sentence prompts at a chat window and expecting a polished architecture in return. In my experience, this micro-prompting causes three major issues.

First, prompt fatigue is real. If you have to write ten detailed prompts to get fifty lines of code, you aren't saving time. You are context-switching every two minutes, and your focus shatters.

Second, the model lacks architectural context. When you ask for a helper function or an isolated class, the model has no idea what invariants govern your system. It doesn't know that your domain models enforce immutability, that your API responses must follow standard problem details, or that your database transactions use optimistic concurrency. It guesses based on generic internet training data, which means you end up rewriting half the output anyway.

Third, it keeps human engineers stuck at the lowest level of abstraction. Software engineering isn't about typing characters quickly; it's about domain modeling, system boundaries, and clear communication. If your entire interaction with AI is about autocompleting loops, you miss where the real impact lies.

## How Do You Treat an AI Agent Like a Teammate?

In my post on [AI-assisted blogging](/nodes/ai-assisted-blogging/), I described how I treat AI as a writing partner rather than a ghostwriter. I bring the real-world experiences, architecture decisions, and editorial judgment, while the model helps with structure and readability.

Engineering delegation follows the exact same principle. Instead of micromanaging syntax, you delegate substantive, end-to-end epics. For example, instead of asking an agent to write a helper method that parses a webhook payload, you give it the complete feature: implement the webhook handling pipeline, verify the signature, map the payload into domain events, persist them through an outbox pattern, and verify that the integration tests pass.

When you delegate at this level, your role as an architect shifts upward. You focus on four primary responsibilities:

- **System architecture and boundaries:** Defining system boundaries, deciding which patterns to use, and choosing where components live.
- **Domain modeling:** Establishing clear domain invariants, value objects, and business rules so the agent cannot violate core business logic.
- **Harness refinement:** Building and maintaining the environment where the agent works, including tools, repository skills, markdown rules, and test suites.
- **Code review and mentoring:** Reviewing the agent's pull requests with the same rigor you apply to work from any human engineer on your team.

## What Does the Day-and-Night Cadence Look Like in Practice?

Once you view the agent as a teammate, your work rhythm transforms. My team developed an asynchronous day-and-night cadence that feels natural and productive. Here is how that works across a typical working day:

### Morning Alignment

Just like bringing a team member into a morning standup or sprint planning session, we align on work early. I review the backlog, pick a well-specified epic, and set up the agent with the necessary context and constraints. While the agent runs autonomously on that epic, I spend my morning where my time is most valuable: refining specifications, talking with product managers, designing system integrations, and unblocking team dependencies.

### Midday Review and Mentoring

After lunch, I check in on the agent's progress. I look at the branch diff, review the test output, and inspect the decisions it made. If the agent took a wrong turn, I don't just quietly fix the code. That would be like secretly rewriting a junior colleague's pull request without explaining why.

Instead, I give the agent feedback and update the project harness. If the agent violated our API naming conventions, I check whether our rules file or Architecture Decision Records (ADRs) clearly documented that convention. If the convention wasn't documented, that's on me: I add a rule or test fixture so the agent (and any human engineer who joins later) won't make the same mistake again. This is how project knowledge builds up over time.

### Overnight Runs

At the end of the day, before shutting down my laptop, I prepare well-scoped, long-running tasks. This might be writing a full suite of integration tests for an existing module, refactoring an outdated client library, or running a large data migration script across test environments. I kick off the agent run and let it work while I sleep. When I open my laptop the next morning, the pull request and test logs are ready for review.

### Continuous Learning

Every correction is a coaching opportunity. When you onboard a human engineer, you invest time in teaching them how your organization thinks. The same applies here. By continuously feeding learnings back into your skills, rules, and repository guides, your agent colleague gets better at working within your specific codebase every week.

## Where Are the Boundaries Between Pairing and Delegating?

Delegation is powerful, but it isn't the right choice for every task. You have to know when to delegate autonomously and when to keep things interactive.

### Setting the Agent Up for Success

An AI colleague can only be as effective as the context you provide. Before handing off an epic, make sure you have:

1. **Clear domain invariants:** Use strongly typed domain models and value objects (like I discussed in [Using Value Objects in .NET](/nodes/using-value-objects-in-net/)). When illegal states are unrepresentable in your code, the agent cannot generate invalid domain logic.
2. **Predictable machine interfaces:** If the agent needs to call internal tools or services, make sure the contracts are explicit and machine-readable (an idea I explored in [Designing APIs for AI Agents](/nodes/designing-apis-for-ai-agents/)).
3. **Automated test harnesses:** The agent needs immediate feedback loops. If it can run tests locally, it can detect and fix its own syntax and logic errors before you ever see the code.
4. **Documented decisions:** If your team has agreed on standards, make sure they live in written Architecture Decision Records (ADRs). As I wrote in [Standardizing API Conventions with ADRs](/nodes/standardizing-api-conventions/), written conventions prevent endless guessing for humans and agents alike.

### When to Keep It Interactive

There are two areas where autonomous delegation usually struggles:

- **UI and visual polish:** Building user interfaces requires subjective aesthetic judgment and visual nuance. Running an autonomous agent to polish visual layouts without a human in the loop is a recipe for disappointment. For visual design, interactive pairing with fast hot-reloading tools remains much faster.
- **Quick ad-hoc tasks:** If you need a regex pattern, a quick shell command, or a one-line SQL query, launching a full autonomous harness is overkill. Lightweight prompt tools and chat interfaces remain more practical for quick questions.

Save autonomous delegation for substantive backend epics, data pipelines, integrations, and test coverage. Those are the areas where clear specifications, domain invariants, and automated verification shine.

## Conclusion

Treating AI like a human colleague is not about pretending that large language models have consciousness or feelings. It is about understanding how work actually gets done on an engineering team.

When you move from autocomplete to delegation, your day-to-day work gets better. You spend less time fighting with predictive text in your IDE and more time on domain modeling, architecture, and mentoring.

If you want better output from AI, stop prompting it like a calculator and start leading it like an engineer.

## FAQ

### What does it mean to treat AI as a colleague rather than an autocomplete?

It means shifting from typing prompts for isolated code snippets to delegating substantive, end-to-end epics. You provide domain context, business invariants, and automated test harnesses, then review the agent's work and coach it with constructive feedback.

### How do you prevent an AI agent from going off track during overnight runs?

Set strict boundaries before kicking off the run. Give the agent a well-scoped task, domain models that make invalid states unrepresentable, and automated tests it can run locally to verify its own work before finishing.

### Why shouldn't you delegate UI and visual polish to autonomous agents?

User interface polish requires visual feedback and subjective human judgment. Pairing interactively with hot-reloading tools is much faster for UI design than running an autonomous agent without visual review.

### What should you do when an AI agent produces the wrong implementation?

View misalignments as a gap in your specifications or harness rather than just a model error. Update your project rules, ADRs, or automated test fixtures so both the agent and human developers avoid the same mistake in the future.

---

*This blog post was created using the AI-assisted approach described in [AI-assisted blogging](/nodes/ai-assisted-blogging/). All technical insights, architectural practices, and workflow experiences reflect my direct experience as a software architect, while AI helped refine the structure and readability.*
