---
name: prototype-scoping
phase: 04 — Prototype
description: Define the minimum prototype needed to validate the riskiest assumption — what to include, what to defer, what fidelity is appropriate, and what questions the prototype must answer. Use before any wireframing begins to prevent over-building. The most skipped and most expensive-when-skipped step in the Prototype phase. Depends on outputs from concept-critique.md and storyboarding.md.
ai_leverage: high
claude_surface: chat
---

# Prototype Scoping

Define the minimum representation of a concept that answers the questions that matter — before building more than you need.

## When to Use

- Before starting wireframes on a new feature or concept
- When the team is unsure what the prototype needs to include
- When a previous prototype was too polished and took too long to build
- When stakeholders are expecting a prototype but the team hasn't defined what it should test
- When there's pressure to prototype everything — and you need a principled way to scope it down

---

## The Core Principle

A prototype exists to answer questions. If you don't know what questions it's answering, you'll build too much, at too high a fidelity, and learn too little.

**The scoping formula:** Minimum fidelity × Minimum scope = Maximum learning per hour invested.

Every hour spent polishing a prototype that could test at lower fidelity is an hour not spent on testing, iteration, or the next concept. The goal is not a beautiful prototype. The goal is an answer.

---

## What Claude Needs to Start

1. **Selected concept** — name, one-liner, core mechanism
2. **Top 3 risks from concept critique** — the assumptions most likely to break the concept
3. **Storyboard** — the scenario and scenes from `storyboarding.md`
4. **Success criteria** — how you'll know the prototype test succeeded
5. **Constraints** — timeline, who's building it, what tools are available

---

## Step 1: Identify the Questions

The prototype scope is determined by its questions — not by the full feature scope.

**Claude prompt:**
> "Based on these concept critique findings and storyboard, identify the 3 questions this prototype must answer.
>
> Each question should:
> - Be answerable through observation — not a survey question
> - Correspond to a specific assumption from the critique
> - Have a clear 'yes/no' or 'works/doesn't work' test
>
> Format each question as:
> **Question:** [The thing we need to know]
> **Assumption it tests:** [The belief from the critique this corresponds to]
> **How we'll observe it:** [What we'll see in testing that answers the question]
> **What 'yes' looks like:** [Evidence that the assumption is valid]
> **What 'no' looks like:** [Evidence that the assumption fails]
>
> Concept: [paste]
> Top risks from critique: [paste]
> Storyboard: [paste]"

---

## Step 2: Define the Minimum Scope

Once the questions are defined, scope the prototype to exactly what's needed to answer them.

**Claude prompt:**
> "Given these 3 prototype questions, define the minimum prototype scope.
>
> For each question, identify:
> - **Which scenes from the storyboard** must be in the prototype to answer it
> - **Which screens** those scenes require
> - **What the screen must contain** to generate the observation (not the full design — just what's necessary)
>
> Then produce:
> 1. **In scope** — every screen and state that's needed to answer at least one question
> 2. **Out of scope** — screens and states that don't contribute to answering the questions (with rationale)
> 3. **Happy path only or branches too?** — whether alternative paths and error states are needed for this round
>
> The test: if removing something from scope means you can't answer one of the 3 questions, it must stay in. If removing it doesn't affect any question, it should be cut.
>
> Prototype questions: [paste]
> Storyboard scenes: [paste]"

---

## Step 3: Choose the Fidelity

Fidelity is the most important scoping decision. The right fidelity is the lowest that still generates valid observations.

**Claude prompt:**
> "Recommend the appropriate prototype fidelity for this test. Evaluate each fidelity option:
>
> **Paper / sketch**
> - When it's right: testing navigation logic, information architecture, screen sequence
> - When it fails: when the visual or copy treatment affects behavior (especially for emotion-driven or trust-sensitive flows)
>
> **Lo-fi digital (grayscale wireframes, placeholder copy)**
> - When it's right: testing task completion, flow logic, primary navigation
> - When it fails: when copy clarity is a core assumption being tested, when visual hierarchy affects the task
>
> **Mid-fi (real copy, basic layout, no visual polish)**
> - When it's right: most usability testing. Tests flow AND copy without the cost of hi-fi
> - When it fails: when the visual design itself is part of the trust signal (e.g. financial products, medical products)
>
> **Hi-fi (near-final visual design)**
> - When it's right: stakeholder sign-off, testing visual design as a variable, final validation before dev
> - When it fails: almost always too early — hi-fi takes 3–5× longer to build and change
>
> Given these 3 prototype questions and constraints, recommend a fidelity and explain why.
>
> Questions: [paste]
> Constraints: [timeline, who's building, tools available]"

---

### Fidelity Decision Matrix

| Question type | Appropriate fidelity |
|---|---|
| Does the flow make sense? | Paper or lo-fi |
| Can users find and complete the task? | Lo-fi or mid-fi |
| Do users understand what the copy means? | Mid-fi (real copy required) |
| Do users trust the product enough to continue? | Mid-fi or hi-fi |
| Does the visual design communicate the right brand? | Hi-fi only |
| Would stakeholders approve this direction? | Mid-fi or hi-fi |

---

## Step 4: Write the Prototype Brief

Package the scope decision into a brief that the person building the prototype can act on immediately.

**Claude prompt:**
> "Generate a prototype brief from this scoping session. The brief should enable someone to build the prototype without any further clarification.
>
> Prototype brief format:
>
> **What we're testing:** [1 sentence — the concept and the core question]
> **Who we're testing with:** [Persona description and recruitment criteria]
> **Fidelity:** [Lo-fi / Mid-fi / Hi-fi — and why]
>
> **In scope (must build):**
> [List each screen with what it must contain — not the design, the content and interaction]
>
> **Out of scope (do not build):**
> [List what's explicitly excluded — with rationale for each]
>
> **The 3 questions this prototype must answer:**
> 1. [Question + what we'll observe]
> 2. [Question + what we'll observe]
> 3. [Question + what we'll observe]
>
> **What 'done' looks like:**
> [Specific criteria for when the prototype is ready to test — not 'when it looks good']
>
> **Build time estimate:** [Hours or days — based on scope and fidelity]
>
> Scoping outputs: [paste questions, scope, fidelity decision]"

---

## Step 5: Define the Test Criteria

Before building the prototype, define what a passing test looks like. This prevents post-hoc rationalization of results.

**Claude prompt:**
> "Define pass/fail criteria for this prototype test. For each of the 3 questions:
>
> **If the answer is yes (assumption validated):**
> - What specific behaviors would we observe?
> - What threshold makes it a 'yes'? (e.g. 4 of 5 users complete the task without assistance)
>
> **If the answer is no (assumption fails):**
> - What specific behaviors would we observe?
> - What would we do next? (Iterate on this concept / pivot to a different concept / go back to ideation)
>
> **The threshold for proceeding to hi-fi:**
> [What needs to be true before we invest in higher-fidelity design]
>
> Questions: [paste]
> Concept risks: [paste from critique]"

---

## Quality Checklist

Before starting wireframes:
- [ ] 3 prototype questions defined — specific, observable, linked to critique assumptions
- [ ] Scope is in and out — every screen is explicitly in or explicitly deferred
- [ ] Fidelity is justified — not just "we always do mid-fi"
- [ ] Prototype brief is written — builder can start without further briefing
- [ ] Pass/fail criteria are defined before building — not after seeing results
- [ ] Build time estimated — team has committed to a timeline before starting

---

## Phase Handoff Block

```
## Handoff: Prototype — Prototype Scoping
### Project: [PROJECT NAME]
### Date: [DATE]

---

### The prototype
**Concept:** [Name + one-liner]
**Fidelity:** [Lo-fi / Mid-fi / Hi-fi]
**Estimated build time:** [Hours/days]

### 3 questions this prototype must answer
1. [Question] — passes if: [observable evidence]
2. [Question] — passes if: [observable evidence]
3. [Question] — passes if: [observable evidence]

### Scope
**In scope:**
[List of screens with brief content description]

**Out of scope:**
[List of deferred screens — with rationale]

### Pass/fail criteria
**Proceed to hi-fi / next phase if:**
[Specific threshold — e.g. 4/5 users complete primary task without prompting]

**Return to ideation if:**
[Specific failure signal — e.g. all users abandon at screen 3]

### What the test script should focus on
[The critical observation points — the moments in the prototype where the questions get answered]

---
*This brief is the wireframing scope.*
*Do not add screens that aren't in the in-scope list.*
*Pass/fail criteria should be shared with the test facilitator before testing begins.*
```
