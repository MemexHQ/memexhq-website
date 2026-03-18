# MemexHQ

> **Your AI finally knows your business.**

MemexHQ is a business context intelligence platform that gives every AI tool your team uses — Claude Code, ChatGPT, Copilot, Gemini, and more — a complete, up-to-date understanding of your organisation. Every meeting, commit, sales call, and decision flows into a private context layer that makes AI agents dramatically smarter, without changing how your team works.

---

## The Problem

Modern AI coding and productivity tools are powerful — but they are contextually blind. Every session starts from zero. No memory of past architectural decisions. No knowledge of what failed last sprint. No awareness of what your biggest client asked for on Tuesday's call.

Your team carries this institutional knowledge in their heads, in Slack threads, in meeting recordings nobody rewatches, in Jira tickets nobody reads twice. When they sit down to use AI, they spend 20+ minutes re-briefing it — or worse, the AI confidently repeats a mistake the team already paid the cost of discovering.

**The result:**

- Claude Code suggests the same Redis architecture your team reverted three weeks ago
- ChatGPT writes a campaign for a feature your biggest enterprise client explicitly said they don't want
- Copilot has no idea you deprecated that module last month
- Every new AI tool needs a full company briefing from scratch

This is not an AI capability problem. It is a context problem.

---

## What MemexHQ Does

MemexHQ is a **distributed context server** that runs entirely on your local network. It connects to every tool your team already uses, extracts what matters, stores it in a private vector database, and automatically enriches every AI query with the most relevant business context — before the query leaves your machine.

**The result:** Every AI agent your team uses arrives fully briefed. First attempts are production-ready. Institutional knowledge compounds instead of evaporating between sessions.

---

## How It Works

### 1. Context Nodes Collect Silently

Lightweight local agents — called **nodes** — attach to your existing tools. They listen, summarise, tag, and timestamp meaningful signals: architecture decisions, client objections, sprint priorities, code patterns, team agreements, past failures. No new workflows. No migration.

### 2. Stored Locally in a Distributed Vector Database

Every signal is embedded and stored in a private vector database that lives entirely on your network. Semantic search retrieves the right context for any query — not keyword matching, but actual meaning across your entire organisation. Nothing leaves your local network.

### 3. Every AI Query Is Automatically Enriched

When anyone on your team opens Claude Code, ChatGPT, Gemini, or any other AI tool, MemexHQ intercepts the query, retrieves the top-k most relevant business context, and prepends it automatically. The AI receives a fully briefed prompt. No extra work required from your team.

### 4. Memory Compounds Over Time

Every AI session output feeds back into the context store. The longer MemexHQ runs, the more institutional knowledge it captures. Teams that use it for six months have a fundamentally different AI experience than teams starting fresh — and that gap widens every week.

---

## Context Nodes

Each node is a lightweight local agent that connects to one source, extracts what matters, and writes it to the shared context store.

| Node | What it captures |
|---|---|
| **GitHub / GitLab** | PRs, commits, reviews, reverts, architecture decisions, changelogs |
| **Jira / Linear / Trello** | Sprint state, priorities, blockers, acceptance criteria |
| **Google Meet / Zoom / Teams** | Meeting transcripts, decisions, action items, sentiment |
| **Slack / Teams / Discord / GChat** | Informal decisions, escalations, alignment moments |
| **Gmail / Outlook** | Client threads, proposals, commitments, unanswered follow-ups |
| **Salesforce / HubSpot / Pipedrive** | Deal context, objections, competitor mentions, client history |
| **Gong / Chorus** | Sales call intelligence, client verbatims, buying signals |
| **Notion / Confluence / Google Docs** | PRDs, RFCs, design docs, wikis |
| **Claude Code / Cursor / Copilot** | AI coding session logs, what was tried, what failed, what shipped |
| **Offline / In-person** | Local mic transcription for physical meetings and whiteboard sessions |
| **Custom (SDK)** | Any internal tool with an API can become a context source |

---

## Integrations

MemexHQ supports 40+ integrations at launch across every category of tool modern teams use.

**Communication:** Slack, Microsoft Teams, Google Chat, Discord, Gmail, Outlook

**Meetings & Voice:** Google Meet, Zoom, Teams Meetings, Loom, Otter.ai, Fireflies

**Project Management:** Jira, Linear, Trello, Asana, Notion, Monday.com, ClickUp, Basecamp

**Code & Version Control:** GitHub, GitLab, Bitbucket, Azure DevOps

**AI Coding Tools** *(context injected automatically)*: Claude Code, GitHub Copilot, Cursor, Gemini CLI, OpenAI Codex, Windsurf, Perplexity, Aider, Continue.dev

**Documentation:** Confluence, Notion, Google Docs/Drive, SharePoint, Coda, GitBook

**Sales & CRM:** Salesforce, HubSpot, Pipedrive, Gong, Chorus.ai, Outreach, Intercom, Zendesk

**Data & Analytics** *(coming soon)*: Amplitude, Mixpanel, Snowflake, BigQuery, Looker

---

## Use Cases

### Engineering

**Without MemexHQ:** Claude Code suggests the same Redis-based rate limiter your team reverted after a latency spike at 500 rps. Another day lost re-investigating a dead end.

**With MemexHQ:** Claude Code arrives knowing about the failed PR, the team's decision to use token bucket, the existing throttle middleware, and the current sprint requirement. First attempt is production-ready.

---

### Sales

**Without MemexHQ:** 45 minutes manually searching Slack, rereading the last call transcript, hunting for the DPA email, checking Jira for the SLA doc status. You walk into the call still missing context.

**With MemexHQ:** A complete 30-second brief: champion is VP Eng with budget approved, DPA sent 10 days ago and unanswered (follow up critical), Glean pitched them last week, lead with local-only deployment story, SLA doc ready Friday.

---

### Marketing

**Without MemexHQ:** ChatGPT writes generic copy that leads with a feature your biggest enterprise client explicitly said they don't need. The positioning misses the real buyer.

**With MemexHQ:** ChatGPT knows the real objections from 6 sales calls (SSO + audit logs), the agreed positioning (compliance first, not feature count), and the differentiator vs the main competitor (zero cloud egress). First draft hits the exact buyer nerve.

---

### DevOps

**Without MemexHQ:** 45 minutes reconstructing what changed, who deployed, and what's happened before. The AI gives generic troubleshooting steps because it has no context about your infrastructure.

**With MemexHQ:** Deploy history, the matching postmortem from two weeks ago, and the runbook are surfaced immediately. Root cause confirmed in minutes, not hours.

---

### Product

**Without MemexHQ:** ChatGPT writes a generic PRD. No knowledge of what the client requested on the last call, what engineering flagged as out of scope, or what the competitor just shipped.

**With MemexHQ:** The PRD includes real client input (webhook support, requested explicitly), engineering constraints (real-time push out of scope Q3), and the competitive gap (3 recent sales calls mentioned this as a blocker). First draft is already aligned across sales, engineering, and clients.

---

## Security & Privacy

MemexHQ was designed from day one for organisations where data sovereignty is non-negotiable.

### Zero Cloud Egress

The context server runs entirely on your local network. No data is sent to MemexHQ's infrastructure. Not summaries, not embeddings, not query logs. Nothing. Your institutional knowledge stays on your machines.

### Distributed Vector Store

Context is stored across nodes in your network. No single point of failure. No vendor lock-in on your company's collective memory. Air-gapped deployment available for organisations with strict compliance requirements.

### Permission-Aware Retrieval

Context is scoped to each querying user's access level. Engineers see engineering context. Sales sees sales context. Executives can see everything. Role-based access control is fully configurable.

### Full Audit Trail

Every context retrieval is logged locally. Know exactly what business context was injected into any AI session, by whom, and when. Immutable, queryable, exportable.

### Enterprise Compliance

- GDPR compliant
- SAML SSO support
- SOC 2 Type II in progress
- RBAC with fine-grained permissions
- Air-gapped deployment option
- Enterprise SLA available

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   LOCAL NETWORK BOUNDARY                │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  GitHub  │ │   Jira   │ │  Slack   │ │   Zoom   │  │
│  │   Node   │ │   Node   │ │   Node   │ │   Node   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │             │             │        │
│       └─────────────┴─────────────┴─────────────┘        │
│                           │                              │
│                           ▼                              │
│              ┌─────────────────────┐                    │
│              │  MemexHQ Context    │                    │
│              │      Server         │                    │
│              │                     │                    │
│              │  • Embedding model  │                    │
│              │  • Vector DB (dist) │                    │
│              │  • RAG retrieval    │                    │
│              │  • Permissions      │                    │
│              └──────────┬──────────┘                    │
│                         │                               │
│                         ▼                               │
│         ┌───────────────────────────────┐               │
│         │     AI Query Interceptor      │               │
│         │  Enriches queries before send │               │
│         └───────────┬───────────────────┘               │
│                     │                                   │
└─────────────────────┼───────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    Claude Code   ChatGPT      Copilot
     (enriched)  (enriched)  (enriched)
```

### Key Design Decisions

**Local-first:** The entire stack runs on your network. We never see your data.

**Distributed vector storage:** Context is sharded across nodes for resilience. No single database to breach or lose.

**Semantic retrieval:** Queries are matched by meaning, not keywords. "Auth latency issue" surfaces the Redis postmortem even if that postmortem never used those exact words.

**Asynchronous ingestion:** Nodes ingest and embed continuously in the background. No batch jobs, no maintenance windows.

**Query interception layer:** MemexHQ sits transparently between your team's AI tools and the model APIs. Works with any LLM that accepts a text prompt.

---

## Metrics

| Metric | Value |
|---|---|
| Cloud egress | 0 bytes |
| Context retrieval latency | < 80ms |
| Integrations at launch | 40+ |
| AI agents supported | Any LLM |
| Teams on waitlist | 340+ |

---

## Pricing

| Plan | Price | Users | Nodes |
|---|---|---|---|
| **Startup** | $299 / month | Up to 10 | 5 context nodes |
| **Growth** | $899 / month | Up to 50 | Unlimited |
| **Enterprise** | Custom | Unlimited | Unlimited + air-gapped |

All plans include local deployment, zero cloud egress, and all AI coding tool integrations. Early access teams receive permanent early-adopter pricing.

---

## Brand

**Name:** MemexHQ

**Domain:** memexhq.dev

**Tagline:** Your AI finally knows your business.

**Logo concept:** The MemexHQ mark is a direct abstraction of Vannevar Bush's 1945 memex desk illustration — the original vision for a machine that stores and retrieves collective human knowledge by association. Two adjacent viewing screens (Bush's dual display panels), connected by an associative trail (the dashed line — his core innovation: items "tied together"), with a central node marking the moment of association. A desk base rail. A microfilm reel above. Five elements. One concept.

**Name origin:** *Memex* is a portmanteau of "memory" and "index," coined by Vannevar Bush in his 1945 essay *As We May Think*. Bush described it as "an enlarged intimate supplement to memory" — a device in which an individual stores all their books, records, and communications, mechanised so it may be consulted with exceeding speed and flexibility. MemexHQ takes that vision from the individual to the organisation.

---

## The Name Inspiration

> *"Consider a future device… in which an individual stores all his books, records, and communications, and which is mechanized so that it may be consulted with exceeding speed and flexibility. An enlarged intimate supplement to his memory."*
>
> — Vannevar Bush, *As We May Think*, The Atlantic, 1945

Bush's memex was the conceptual ancestor of hypertext, the internet, and personal knowledge management. It was never built. MemexHQ builds the organisational version of it — not for individuals, but for the entire company — and makes every AI agent in your stack a beneficiary.

---

## Status

- **Stage:** Pre-seed / private beta
- **Waitlist:** 340+ teams
- **Target customer:** Engineering-led teams of 10–200 people already using AI tools heavily
- **Primary buyer:** VP Engineering, CTO, Founding Engineer
- **Geography:** Global — local-network architecture means no data residency constraints
- **Deployment model:** On-premise / self-hosted (local network)

---

## Early Access

We are onboarding teams in batches. Early access includes:

- White-glove node setup and configuration
- Direct line to the founding team
- Permanent early-adopter pricing
- Input on product roadmap

**Apply:** [memexhq.dev](https://memexhq.dev)

---

## Roadmap (Public)

| Quarter | Milestone |
|---|---|
| Q2 2025 | Private beta — first 20 teams onboarded |
| Q2 2025 | Node SDK released — custom integrations |
| Q3 2025 | Data & Analytics nodes (Amplitude, Snowflake, BigQuery) |
| Q3 2025 | SOC 2 Type II certification |
| Q4 2025 | Public launch |
| Q1 2026 | Native IDE plugins (VS Code, JetBrains) |
| Q1 2026 | Mobile context capture (voice memos, offline meetings) |

---

## Contact

**Website:** [memexhq.dev](https://memexhq.dev)
**Email:** hello@memexhq.dev
**Early access:** [memexhq.dev/#signup](https://memexhq.dev/#signup)

---

*MemexHQ — Your AI finally knows your business.*
