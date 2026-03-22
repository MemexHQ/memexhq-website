---
title: "Open Source Shoutout: Two Projects Worth Your Attention"
date: "2026-03-22"
excerpt: "Two open source projects that quietly changed what we think AI can do."
author: "MemexHQ Team"
tags: ["open source", "AI", "agents", "research"]
---

Most AI tools answer questions. These two run experiments.

We spend a lot of time watching what gets built in the open. Most of it is derivative. Occasionally something comes along that makes us stop and think differently. This month, two projects did that.

---

## MiroFish — What If You Could Simulate the Future?

Here is a problem nobody talks about enough: prediction is hard because the future involves people. People change their minds. They react to each other. They form opinions in groups. No spreadsheet captures that.

[MiroFish](https://github.com/666ghj/MiroFish) takes a different approach. Instead of modeling outcomes with statistics, it simulates the humans involved. You feed it a seed — a news story, a policy draft, a novel's first act — and it builds a digital world populated by thousands of independent agents. Each one has its own personality, memory, and behavior. Then it lets them loose.

What comes out the other side is a prediction report, plus a living simulation you can poke and interrogate.

The use cases are stranger and richer than they first appear. A PR team could run a crisis through the engine before it goes public. A policy analyst could watch how a proposed regulation ripples through a simulated population. A novelist could feed in 80 chapters and ask the engine to predict the ending. The MiroFish team has done exactly that — with *Dream of the Red Chamber*, a classic Chinese novel whose final chapters were lost. The engine's prediction reportedly holds up.

What makes this unusual isn't the technology. It's the mental model. Most forecasting asks: *what will happen?* MiroFish asks: *who will do what, and to whom?* That is a much harder question. It's also a much more useful one.

The project has 32,000 GitHub stars and backing from Shanda Group. It is not a toy.

---

## DeerFlow — An AI That Has Its Own Computer

Most AI assistants are good at talking. DeerFlow is built to act.

[DeerFlow](https://github.com/bytedance/deer-flow), built by ByteDance and now at version 2.0, describes itself as a "super agent harness." That phrase undersells it. What it actually is: an AI that can research a topic, write code to analyze what it finds, generate a slide deck from the results, and hand you a finished deliverable — without you touching anything in between.

The key insight behind DeerFlow is that most complex tasks aren't one task. They're twenty tasks, chained together. DeerFlow breaks a big request into pieces, hands each piece to a sub-agent, runs them in parallel where possible, and reassembles the results. It is less like asking an assistant a question and more like assigning a project to a small team.

It also has memory. Most AI tools forget everything the moment a session ends. DeerFlow builds a persistent picture of who you are — your preferences, your working style, your recurring projects. The longer you use it, the more it knows what you actually want, not just what you said.

The practical applications are wide. A consultant could use it to produce a research report from scratch in an hour. A solo founder could hand it a vague product brief and get back a structured competitive analysis. An analyst could point it at a data source and ask for a presentation. What used to take a day can take a coffee break.

DeerFlow hit #1 on GitHub Trending in late February 2026, the week version 2.0 launched. It now has over 22,000 stars.

---

## Why These Two

Separately, these projects solve specific problems. Together, they point at something bigger.

We are moving from AI that answers to AI that acts. MiroFish acts on the future — modeling it, stress-testing it, letting you explore it before committing. DeerFlow acts on the present — taking a messy problem and producing a finished output, not just a suggestion.

The open source community built both of these. Neither required a research lab or a nine-figure budget.

That is the thing worth noticing.

---

*Check them out: [MiroFish](https://github.com/666ghj/MiroFish) · [DeerFlow](https://github.com/bytedance/deer-flow)*
