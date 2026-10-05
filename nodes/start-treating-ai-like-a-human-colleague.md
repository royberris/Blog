---
title: "Start Treating AI Like a Human Colleague"
date: "2026-10-04"
updated: "2026-10-05"
excerpt: "Why treating AI like an engineering colleague means handing over desired outcomes and whole systems instead of micromanaging at the component level."
tags: ["AI", "AI Agents", "Software Architecture", "Engineering Leadership"]
author: "Roy Berris"
related: ["ai-assisted-blogging", "designing-apis-for-ai-agents"]
---

# Start Treating AI Like a Human Colleague

**TL;DR:** The biggest mistake with AI in software engineering is component-level micromanagement: pre-designing every interface, class, and table yourself before handing off the pieces. When you treat AI like a capable engineering colleague, you define the desired business outcome and domain boundaries, then let it architect and build the whole system. Your job shifts from sketching components to steering outcomes, evaluating trade-offs, and mentoring.

I'll be honest with you: as a software architect, my default instinct has always been to break everything down. For years, I treated system design like a puzzle where my job was to shape every single piece. When AI coding tools arrived, I brought that exact habit with me.

I would spend hours mapping out every database table, defining every service interface, specifying every Data Transfer Object (DTO), and deciding which method called which helper. Once I had pre-chewed every component, I handed the pieces to the AI one by one, like an architect handing brick specifications to a bricklayer.

It gave me a sense of control, but it was exhausting. I was doing ninety percent of the thinking myself, drawing boxes and dictating signatures. I was acting as the architect, the product manager, and the micromanager, using AI as a fast typist to fill in the blanks I had already solved. I was the biggest bottleneck on the project.

The turning point came when I stopped and looked at how I work with senior engineering colleagues. When a talented engineer joins the team, you don't hand them a diagram of twelve classes and tell them what to name every variable. You explain the business problem, lay out the constraints and domain boundaries, and say: "We need this outcome. Design the system and build it." Once I gave an AI agent an outcome and let it design the whole system, the way I work changed completely.

## Why Does Component-Level Micromanagement Fail?

When developers tell me that AI only produces shallow code, the problem is almost always how they divide the work. They do all the high-level thinking themselves, break the problem into tiny component-level tasks, and then ask the model to implement one isolated piece at a time. In my experience, this micromanagement breaks down in three ways.

First, the architect stays the bottleneck. If you have to design every component before an agent can write a line of code, your delivery speed is capped by your own calendar. You spend your day writing micro-specifications, reviewing tiny pull requests, and answering questions about isolated classes. You aren't scaling your engineering output. You are just drowning in administrative overhead.

Second, systems end up fragmented. When you feed an AI agent one component at a time, it has no visibility into how the whole system fits together. It writes a clean repository class, a nice validator, and an isolated controller. But when you wire them up, the pieces clash. The validator expects data the controller never extracts, the database transaction doesn't cover the event publisher, and error handling is inconsistent. Because the model was trapped inside a single component, it couldn't design for the real failure modes of the system.

Third, you waste the model's actual reasoning strength. Modern frontier models can inspect an entire repository, understand cross-cutting concerns, and reason about architectural trade-offs across multiple layers. When you force the model to only fill in pre-defined method stubs, you discard that capability. You treat an engine capable of designing systems like a line-by-line code generator.

## How Do You Hand Over an Outcome Instead of a Component?

In my post on [AI-assisted blogging](/nodes/ai-assisted-blogging/), I described how I treat AI as a writing partner rather than a ghostwriter. I bring the ideas, the real-world experiences, and the editorial judgment, while the model helps with structure and flow.

Engineering delegation works the same way, but at the system level.

The component-level approach looks like this: "Create an order validation service with an interface that checks inventory levels against the database and returns a validation result enum." You have already made every design decision. The model is just typing syntax.

The outcome-level approach looks like this: "We need an order processing subsystem that handles checkout requests under high concurrency. It must guarantee that we never sell out-of-stock items, handle payment gateway timeouts cleanly without leaving orphaned orders, and publish domain events for downstream shipping. Respect our existing outbox pattern, write the database migrations, and verify the flow with integration tests."

When you frame the task around an outcome, you let the AI do what engineers do: synthesize a solution. The agent evaluates the data model, chooses how components interact, designs the API contracts, and wires up the persistence layer.

When you delegate at this macro level, your role shifts upward:

- **Framing outcomes and success criteria:** You define what the system must accomplish, including performance targets, consistency requirements, and compliance rules.
- **Guarding domain invariants:** You make sure illegal states are unrepresentable in your domain models, an idea I explored in [Using Value Objects in .NET](/nodes/using-value-objects-in-net/). Strong domain invariants prevent the agent from inventing invalid business logic.
- **Setting system boundaries:** You establish the perimeter, including security policies, external contracts, and integration protocols (as discussed in [Designing APIs for AI Agents](/nodes/designing-apis-for-ai-agents/)).
- **Reviewing architecture and mentoring:** You evaluate the agent's proposed system design and review the resulting pull request with the same rigor you would give a human peer.

## What Does System-Level Delegation Look Like in Practice?

Here's how this actually works in practice across our team's daily cadence.

### Aligning on Outcomes and Architecture

Instead of spending hours drafting component specifications, I write a clear outcome brief for an entire subsystem. I describe the problem, the existing system topology, and our operational constraints.

Before writing application code, the agent explores the repository and proposes an architectural plan or a draft Architecture Decision Record (ADR). As I wrote in [Standardizing API Conventions with ADRs](/nodes/standardizing-api-conventions/), written records make architectural intent explicit. The agent outlines how it plans to structure components, what data models it needs, and what trade-offs it considered. For example, it might explain why it chose an outbox pattern with transactional messaging over synchronous HTTP calls to downstream services.

I review that architecture proposal. If the design has a flaw, we discuss it and adjust the plan before any code is written.

### System-Wide Implementation and Verification

Once we align on the architectural direction, the agent builds the entire system across the codebase. It doesn't stop at one class. It creates the database migrations, implements domain logic, builds API endpoints, configures background workers, and writes integration test suites.

Because the agent owns the full system, the contracts between components fit together naturally.

The agent also runs the test suite locally. If an integration test fails because an outbox event didn't publish during a database rollback, the agent diagnoses the failure across both components and fixes the transaction boundary. It doesn't wait for me to find the bug in code review; it verifies its own work.

### Mentoring and Harness Feedback

When I review the pull request, I look at the big picture: Does this architecture fit our long-term goals? Are our operational failure modes covered?

If the agent made an architectural misstep, like introducing an unnecessary distributed lock or violating an API convention, I don't just quietly patch the code. I explain the issue and update our repository instructions, ADRs, or test fixtures. Just like mentoring a human colleague, you teach the agent how your team thinks so it doesn't repeat the mistake on the next system.

## Where Are the Boundaries Between Macro Delegation and Direct Control?

Delegating entire systems to AI is powerful, but it does not mean stepping away from responsibility. You have to know where your boundaries lie.

### What Humans Must Own

There are areas where human judgment is irreplaceable:

- **Strategic business trade-offs:** AI cannot know the organizational politics of your company, which features can be compromised to hit a launch deadline, or how much operational risk your business can absorb. You own the strategy.
- **Security perimeters and blast radiuses:** Authentication mechanisms, tenant isolation rules, authorization boundaries, and secrets management must be strictly guarded. You define the perimeter; the agent builds inside it.
- **Production accountability:** When a system breaks in production at 3 AM, the AI isn't on call. You are. That is why reviewing the macro architecture, inspecting failure modes, and enforcing automated verification remain your responsibility.

### When to Keep It Interactive

There are two scenarios where autonomous system delegation doesn't work well:

- **Ambiguous or exploratory requirements:** If the business problem is still vague and you don't know what outcome you want, delegating an entire system will only produce the wrong architecture faster. In those moments, I sit with product managers and sketch ideas interactively before delegating anything.
- **Visual user interfaces:** Building web or mobile UIs relies heavily on visual feedback, brand feel, and subjective aesthetic judgment. Autonomous delegation often struggles here; interactive pairing with fast hot-reloading remains far more effective.

Save system-level delegation for substantive backend subsystems, data pipelines, integrations, and automated test coverage. Those are the areas where clear specifications, domain invariants, and automated verification shine.

## Conclusion

Treating AI like an engineering colleague isn't about pretending software has feelings. It is about understanding where human thinking creates the most value.

When you spend your week micromanaging components, drafting method signatures, and pre-chewing classes, you become a bottleneck. You end up tired, and your systems end up fragmented.

When you step back, define clear outcomes, and let AI architect and build the whole system, your day changes. You spend your time on what truly matters: defining domain boundaries, evaluating architectural trade-offs, and mentoring.

If you want real impact from AI, stop pre-chewing every component and start handing over the whole problem.

## FAQ

### What does it mean to delegate at the outcome level instead of the component level?

It means asking AI to solve a complete business problem rather than write an isolated class or method. You provide the goals, domain boundaries, and constraints, and let the agent design the component architecture, data contracts, and implementation across the whole system.

### How do you stop an AI agent from choosing the wrong architecture for a whole system?

Have the agent produce an architectural plan or draft Architecture Decision Record (ADR) before it writes code. By reviewing the proposed component boundaries, data models, and trade-offs upfront, you catch misalignments before implementation starts.

### Does letting AI design whole systems replace the software architect?

No, it elevates the architect. Instead of spending your time specifying low-level interfaces and drawing component boxes, you focus on business strategy, domain invariants, security perimeters, and architectural evaluation.

### When should you avoid delegating an entire system to an AI agent?

Avoid it when the business requirements are still ambiguous, or when working on visual user interfaces that require subjective aesthetic judgment. In those cases, interactive pairing and rapid prototyping work much better.
