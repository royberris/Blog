---
title: "Clearing my evening thoughts with a personal VPS"
date: "2026-09-26"
excerpt: "How I stopped evening work anxiety by wiring up a private VPS, Matrix, and an Obsidian second brain into an always-on personal AI assistant."
tags: ["AI", "AI Agents", "Software Architecture"]
author: "Roy Berris"
related: ["ai-assisted-blogging", "designing-apis-for-ai-agents"]
---

# Mental Cache Invalidation: Self-Hosting a Personal AI Assistant on a $5 VPS to Save Your Weekends

The promise of AI-assisted engineering was supposed to be breathing room. In reality, it turned me into a high-bandwidth orchestrator.

When generating implementations, reviewing distributed systems architectures, and debugging complex traces take minutes instead of hours, you don't touch one problem at a time—you touch ten. By the end of the workday, my working memory felt like a distributed system under partition: dozens of dangling references to half-reviewed PRs, edge cases in microservices, and architectural refactors still spinning in my head.

Humans don't have atomic garbage collection. Without a reliable, zero-friction offload mechanism, those open threads follow you into your evening, conversations with family, and sleep. I found myself running an involuntary background process all evening, chewing mental cycles on tomorrow's problems.

I needed a mental cache invalidation mechanism: a private, always-available sink where I could dump raw thoughts from anywhere, trust that they were captured and categorized, and immediately flush my working memory.

Here is how I built that system on a $5 VPS using an owner-operated stack, grounded in the cognitive psychology of offloading mental residue.

## The Cognitive Science: Why Offloading Works

Engineers often treat mental exhaustion as a failure of willpower or focus. In reality, it is a well-documented cognitive bottleneck. 

Psychological research on **cognitive offloading**—defined by Risko & Gilbert (2016) as the use of physical actions or external devices to alter the information processing requirements of a task—demonstrates that our biological working memory has strict, unforgiving bandwidth constraints. When an unresolved work problem or future intention stays in our head, the brain continues to expend executive resources rehearsing it. 

Furthermore, as research by Morrison & Richmond (2020) and broader studies on prospective memory show, externalizing intentions onto a dependable external store directly relieves working memory load and terminates involuntary retrieval loops. When we don't offload, we suffer from what organizational psychologists describe as **cognitive residue**: attention and working memory capacity remain tethered to an unfinished task, lingering long after we have stepped away from the keyboard and impairing our ability to engage with the present moment. 

Writing things down is not just about keeping a todo list—it physically and mentally frees working memory load, neutralizes lingering cognitive residue, and signals to the brain's executive control network that the loop is safely closed.

The catch? If the offloading mechanism introduces friction, the brain defaults to keeping the data in working memory.

## The Architectural Requirements: Zero Friction and Absolute Privacy

Commercial SaaS assistants (ChatGPT, Claude, Notion AI) are impressive, but they failed my personal requirements for two reasons:

1. **Friction kills capture**: If offloading a late-night thought requires unlocking a phone, opening a heavy app, waiting for a web view to load, and navigating menus, I won't do it. Capture must be as low-latency as sending a message to a friend.
2. **Data sovereignty**: I frequently think through proprietary architecture trade-offs, internal client constraints, and unvarnished personal thoughts. Routing those unfiltered into a multi-tenant corporate cloud felt fundamentally irresponsible.

The design constraints became clear: an owner-operated stack running on a modest 2 vCPU, 4 GB RAM Ubuntu server, secured entirely behind a private mesh network, with end-to-end encrypted chat on my phone and instant synchronization into my personal markdown vault.

```mermaid
flowchart TD
    subgraph ClientDevices ["Client Devices (MacBook & Phone)"]
        A["Matrix Client (Element)"]
        B["Obsidian App (LiveSync)"]
    end

    subgraph VPS ["Private VPS (Tailnet Secured)"]
        C["Matrix Server (Continuwuity)"] -->|Webhook / API| D["Hermes Agent Gateway"]
        D -->|Append / Query| E["Local Vault (Deno Bridge)"]
        E -->|Two-way Sync| F["CouchDB (LiveSync Database)"]
    end

    subgraph Offsite ["Offsite Disaster Recovery"]
        G["Private GitHub Repository"]
    end

    A -->|E2EE Instant Text / Voice| C
    B <-->|Real-time Sync| F
    E -.->|Hourly Git Cron| G
```

## The Stack Breakdown

The entire system runs on a cheap cloud node consuming under 450 MB of resident RAM, leaving abundant headroom.

### 1. Transport Layer: Matrix via Continuwuity
Rather than building a bot on Telegram or Discord—which exposes metadata to third parties and lacks native decentralized E2EE—I deployed **Continuwuity** (a lightweight Matrix homeserver) in Docker. 

Using Element on my phone and laptop gives me an instant chat interface with push notifications, voice note recording, and full message persistence.

### 2. Orchestration & Agent: Hermes Gateway
The agent logic runs as a managed `systemd` service (`hermes-gateway`). When a message arrives in my private Matrix control room, Hermes processes the intent:
- **Raw dumps**: "Remind me to check the idempotent consumer retry loop on the order service tomorrow morning."
- **Architectural sketches**: Notes on decoupling two domain boundaries.
- **Vault queries**: "What did I decide last month about the JWT expiration strategy?"

The gateway evaluates the message against my system prompt (`SOUL.md`) and routes it accordingly:

```yaml
# hermes-agent/config.yaml snippet
agent:
  name: "Hermes"
  workspace: "/var/lib/vault/second-brain"
  default_inbox: "inbox/daily-dumps.md"
  sync_strategy: "append-with-timestamp"
matrix:
  homeserver_url: "http://127.0.0.1"
  listen_room: "!internal-ops:matrix.local"
```

### 3. Second Brain Storage: Obsidian + CouchDB LiveSync
My primary knowledge base is a local-first Obsidian vault. While Obsidian Sync is great for desktop-to-mobile, headless server integration requires something programmable. 

I run CouchDB alongside `couchdb-livesync`. A lightweight Deno bridge keeps the VPS filesystem in sync with CouchDB. When Hermes writes markdown directly to `/var/lib/vault/second-brain/inbox/`, CouchDB pushes the diff to my phone and laptop within milliseconds.

### 4. Zero Public Surface: Tailscale Overlay
None of these services are exposed to the public internet:
- No public domain names or DNS records pointing to the VPS.
- No public reverse proxy or open HTTP/HTTPS ports.
- UFW drops all inbound traffic except Tailscale's WireGuard interface (`tailscale0`) and SSH keys.

Whether I am at my home desk, in the kitchen, or out running errands on mobile data, my phone connects seamlessly over the encrypted Tailnet mesh.

### 5. Disaster Recovery: Hourly Git Commits
Database files can corrupt; physical nodes can disappear. An hourly cron job snapshots the vault state, agent configuration, and prompts into a private, encrypted GitHub repository:

```bash
#!/usr/bin/env bash
cd /var/lib/vault/second-brain && \
git add . && \
git diff-index --quiet HEAD || git commit -m "auto: vault snapshot $(date -u +'%Y-%m-%dT%H:%M:%SZ')" && \
git push origin main --quiet
```

## The Workflow in Practice

Here is what this looks like on a typical evening:

1. **The Kitchen Sanctuary**: At 18:00 PM, I arrive home carrying fresh groceries, ready to decompress. Cooking is one of my favorite hobbies—a tactile, sensory craft that usually pulls me away from terminals and monitors. But as I stand over the hot pan stir-frying chicken, watching the garlic and scallions sizzle in the oil, an unexpected work thought pops into mind: *We missed a race condition in our distributed event processor when tenant updates arrive out of order.*
2. **The 5-Second Offload**: In the past, this was where the evening dissolved into rumination. My brain would clutch the idea, turning it over in an anxious loop while dinner burned. Instead of ruminating, I reach for my phone on the counter with a clean hand and send a quick message to Hermes: *"Check the partition key on the event consumer. If two tenant updates arrive out of order, the state store could get corrupted. Put this on the todo list for tomorrow morning."*
3. **The Agent Handling**: Hermes intercepts the message over Matrix, transcribes the note, tags it `#architecture/concurrency`, and immediately appends it to my actionable todo list for the next day or upcoming week in Obsidian.
4. **The Flush**: Within three seconds, Hermes replies: *"Captured. Added to tomorrow's todo list under Architecture Review."*
5. **Cache Invalidated**: Because I trust the storage system implicitly, my working memory immediately lets go. The cognitive residue dissolves, the intrusive loop terminates, and I can return entirely to stir-frying my chicken and enjoying my evening.

> **The Zero-Friction Rule**: If capturing a thought requires more than three taps or more than five seconds, you will hesitate. When you hesitate, you retain the thought in working memory, and working memory ruins your downtime.

## Architectural Lessons & Production Advice

If you are setting up a personal assistant sink, keep these rules in mind:

- **Separate Capture from Execution**: Do not ask your mobile assistant to execute complex refactors or kick off builds while you're offline. Treat it strictly as an intake and retrieval engine during off-hours.
- **Local Markdown is the Ultimate Format**: Avoid proprietary databases for your notes. Plain markdown files with YAML frontmatter guarantee that you can switch tools or replace LLMs ten years from now without data loss.
- **Fail Closed, Not Open**: Keep your AI assistant behind Tailscale. If a model hallucinates or an agent gateway hits an unhandled exception, it should fail quietly on an isolated loopback address, never in a way that leaks data.

## Conclusion

Engineering velocity with AI is only an advantage if you have the discipline—and the infrastructure—to disconnect from it. 

Building a self-hosted assistant isn't about hoarding infrastructure or spending weekends writing YAML. It's about designing an architectural safety valve: an owner-operated sink that leverages cognitive offloading to invalidate your mental cache, eliminate cognitive residue, and let you enjoy your life outside the editor.

---

*Written by Roy Berris. Maintained in a self-hosted Obsidian vault.*
