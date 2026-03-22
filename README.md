# MemexHQ

**Your AI finally knows your business.**

MemexHQ is a context layer platform that runs as a lightweight server on your local network. It unifies your organization's institutional knowledge — meetings, code decisions, sales conversations, product requirements, team agreements — and automatically enriches every AI query with relevant context. The result: Claude Code, ChatGPT, Copilot, Gemini, and any other AI agent in your stack can operate with full awareness of your business, without re-explaining the same background every session.

## The Problem

Every AI session starts blank. Engineers spend 20+ minutes briefing tools. AI suggests approaches teams already tried and abandoned. Sales, engineering, product, and HR knowledge is fragmented across dozens of tools with no shared memory.

## How It Works

1. **Nodes collect context silently** — Local agents attach to your tools (GitHub, Jira, Notion, Slack, Gmail, and 40+ more), listening for meaningful signals
2. **Stored locally in a distributed vector DB** — Semantic search retrieves the right context at the right time, not keyword matching
3. **Collective memory compounds** — Every AI output feeds back into the context store, making the system smarter over time

## Use Cases

- **Engineering** — AI knows your PR history, failed approaches, architectural decisions, and sprint state before you type a word
- **Sales** — Draft follow-ups with full awareness of deal notes, pricing floors, competitor intel, and client priorities
- **Marketing** — Generate content grounded in actual product decisions and competitive positioning, not hallucinated features
- **Product** — Scaffold features to spec using PRDs, design review decisions, and client requirements automatically retrieved
- **DevOps** — Flag CI/CD risks by cross-referencing incident history and team runbook agreements
- **HR / Onboarding** — Build tailored onboarding plans using offer letters, team notes, and live project context

## Key Properties

- **Zero cloud egress** — All data stays on your local network; nothing leaves your organization
- **<80ms context retrieval latency** — Context injection adds no perceptible slowdown
- **Permission-aware retrieval** — RBAC ensures people only see context they're authorized for
- **Full audit trail** — Every context retrieval is logged locally
- **Air-gapped deployment** — Available for maximum compliance requirements
- **40+ integrations at launch** — GitHub, Jira, Linear, Notion, Slack, Gmail, Google Workspace, Gong, Confluence, Zoom, and more

## Context Sources

| Node | What It Captures |
|---|---|
| GitHub | PRs, commits, reviews, architectural decisions, reverts |
| Jira / Linear | Sprint state, priorities, blockers, acceptance criteria |
| Meetings & Voice | Real-time transcription from Google Meet, Zoom, Teams |
| AI Coding Sessions | Claude Code, Cursor, Copilot session logs |
| Sales & Client Calls | Gong, Chorus, direct recording analysis |
| Docs | Notion, Confluence, Google Docs |
| Chat & Email | Slack, Teams, Discord, Gmail, Outlook |
| Custom | Any tool with an API (coming soon) |

## Status

Open source release coming soon. Sign up at [memexhq.com](https://memexhq.com) for early access.

SOC 2 Type II in progress · GDPR compliant · SAML SSO · Enterprise SLA available

---

## Development

```bash
npm install
npm run dev
```

## Tech Stack

- [Next.js](https://nextjs.org/) — frontend and API routes
- [Vercel](https://vercel.com/) — hosting and Postgres database
- [Vitest](https://vitest.dev/) — testing
