---
title: "My Agentic Engineering Workflow"
date: "2026-03-29"
excerpt: "How I ship software with AI agents doing the coding — and why I still read every line."
author: "MemexHQ Team"
tags: ["engineering", "AI", "agents", "workflow", "Claude Code"]
---

AI agents can write code. The hard part is making sure they write the right code, in the right order, with enough context to not guess.

This is the workflow I've landed on. It's not finished — it probably never will be — but it ships software. Here's how it works.

## The Loop

### Scoping

Everything starts with a conversation, not a ticket. I drop core feature ideas, tools, and constraints into the chat interface and have an in-depth system design discussion. The output isn't a summary — it's a set of nested markdown files: scope specifications for each project milestone.

Those specs go into a repo alongside all previous scopes and any other project context that matters. Over time, this becomes the central knowledge repository for the project. New contributors and new agents both start here.

### Designing Issues

Before any code gets written, each milestone gets broken down into **atomic GitHub issues**. The target size is deliberate: a max of 500–700 line diff per PR. Small enough to review thoroughly. Large enough to be meaningful.

Each issue contains everything an agent needs to execute it — no loose threads. That means:

- Full context and background
- Links to specific lines in the scope specification
- A `blocked-by` relationship to every issue it depends on

That last point matters. The dependencies form a **topological graph** of feature work. Agents can look at what's unblocked and pick up the next issue without coordination overhead.

Every issue also carries a non-negotiable constraint: **TDD**. Tests must be written first, all tests must pass, and user-facing documentation must be updated before a PR can be created.

### Execution

This is where the agents come in. I ask Claude Code to work in parallel — multiple instances, each picking an unblocked issue from the graph, writing code, and pushing a PR to GitHub.

The key is that each issue is self-contained. An agent doesn't need to ask clarifying questions. It has the spec links, the context, the test requirements, and the dependency map. It executes, then hands back a PR.

### Review

This is where I slow down deliberately.

First, I do a deep manual review of every PR. Not a skim — a real read. This serves two purposes: it keeps me at low-level context on how the codebase is actually evolving, and it catches errors and hidden assumptions that agents make confidently but incorrectly.

Second, I run the PR through a three-level review using opencode (a cheaper alternative to Claude Code for review passes):

1. **Architecture review** — Does this fit the overall design? Are there structural problems?
2. **Code review** — Is the implementation correct, clean, and consistent?
3. **Tests review** — Is the coverage real? Are the tests testing the right things?

After resolving all comments, clearing conflicts, and verifying everything passes, the PR gets merged.

Then the loop starts again.

---

## The Non-Negotiables

The workflow changes. These three things don't.

**I must have high and low level context at all times.** I don't just track the roadmap — I read the code. The deep PR reviews are how I stay connected to what's actually been built, not just what was planned.

**Code must have maximal test coverage.** This isn't a nicety. Agents work fast and confidently. Tests are what stop a confident wrong answer from shipping quietly.

**There must be proper documentation.** Two kinds: user-level docs that describe what the software does, and architecture docs that describe why it works the way it does. Both get updated in the same issue cycle as the code that changes them.

---

The workflow is a loop. The non-negotiables are the floor.

Everything above that floor is subject to revision.
