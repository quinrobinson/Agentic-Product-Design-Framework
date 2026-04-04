---
name: user-flow-mapping
phase: 04 — Prototype
description: Map the complete step-by-step paths a user takes to accomplish a task — including decision points, alternative paths, error states, and edge cases — before wireframing begins. Use at the start of Prototype to define what needs to be built before building it. The map becomes the scope document for the prototype. Depends on outputs from storyboarding.md and prototype-scoping.md. Outputs feed directly into wireframing and ux-copy-writing.md.
ai_leverage: high
claude_surface: chat
---

# User Flow Mapping

Define every path a user can take through a feature — including the ones they'll take when something goes wrong — before drawing a single screen.

## When to Use

- Starting a new feature and need to define scope before wireframing
- The storyboard covers the happy path but not error states or alternative paths
- Team is disagreeing about what screens need to exist
- You need a complete screen inventory before prototyping begins
- Prototype scope is unclear and you need to define it before building

---

## What a User Flow Map Is — and Isn't

**A user flow map is:** A step-by-step diagram of every path a user can take through a feature or experience — including what they see, what they decide, what happens when things go wrong, and where they end up.

**A user flow map is not:** A wireframe. Not a sitemap. Not a journey map. Not a process diagram.

The key difference from a storyboard: a storyboard shows one scenario with emotional context. A user flow map shows all scenarios as a branching diagram — optimistic path, alternative paths, error paths, exit points.

**Why this comes before wireframing:** Every branch in a user flow is a screen. Every decision point is a design decision. Discovering these after wireframing has started means redoing work. Discovering them in a flow mapping session means the wireframing scope is already defined.

---

## What Claude Needs to Start

1. **Entry point** — where does this flow begin? (Button click, page load, notification tap)
2. **End point(s)** — what does success look like? What does abandonment look like?
3. **Primary task** — the one thing the user is trying to accomplish
4. **Persona** — who is doing this, and what do they already know?
5. **Known constraints** — anything the system can or can't do (auth states, permissions, API limitations)
6. **Storyboard** — the scenario narrative from `storyboarding.md` if available

---

## Step 1: Map the Happy Path

Start with the optimistic path — the one where everything works and the user succeeds. This is the backbone the other paths branch from.

**Claude prompt:**
> "Map the happy path for this user flow. List every step in sequence — not screens yet, but user actions and system responses.
>
> Format each step as:
> **[Step N]:** [Actor] — [Action or Response]
> - Actor: User or System
> - Action: What the user does (tap, type, select, scroll)
> - Response: What the system does (load, validate, navigate, display)
>
> At each step, flag any decisions the user makes (these become branches).
> At the end, list the steps that require a screen or state change.
>
> Entry point: [where the flow starts]
> End point: [what success looks like]
> Primary task: [what the user is trying to do]
> Persona: [who — context and what they already know]
> Constraints: [anything the system can/can't do]"

---

## Step 2: Identify and Map All Decision Points

Every time the user makes a choice or the system returns a variable result, that's a branch. Each branch needs its own path.

**Claude prompt:**
> "Review the happy path above and identify every decision point — moments where the flow could go differently.
>
> For each decision point:
> - **What branches are possible?** (List all options, not just the obvious ones)
> - **What triggers each branch?** (User choice, system state, permission level, data presence)
> - **Where does each branch lead?** (Same flow, different end state, error, or exit)
>
> Then map each alternative branch as its own step sequence.
>
> Also identify:
> - **Gates** — points where the user must have something (permission, data, payment) to proceed
> - **Loops** — points where the user might need to repeat a step
> - **Exit points** — points where a user might abandon the flow (by choice or by force)
>
> Happy path: [paste]"

---

## Step 3: Map All Error States

Error states are the most commonly missed flows. Every time the system can fail — or the user can do something unexpected — there's an error path.

**Claude prompt:**
> "Map all error states for this flow. For each error:
>
> 1. **Where it can occur** — which step in the happy path this error interrupts
> 2. **What triggers it** — the technical or user-behavior cause
> 3. **What the user sees** — the error state (not the copy — the screen type or component)
> 4. **What paths are available** — retry, back, contact support, exit
> 5. **Whether the user's progress is preserved** — do they start over or can they recover?
>
> Error categories to cover:
> - Network/connection failures
> - Validation errors (user input doesn't meet requirements)
> - Permission errors (user doesn't have access to do this)
> - Not found errors (something they're looking for doesn't exist)
> - Timeout errors (async operation took too long)
> - Conflict errors (the thing they're trying to do was already done)
> - Rate limit / quota errors (if applicable)
> - [Product-specific errors based on the flow]
>
> Full flow with decision points: [paste]"

---

## Step 4: Generate the Screen Inventory

A user flow map directly produces a screen inventory — every state that needs to exist in the prototype.

**Claude prompt:**
> "From this complete user flow (happy path + branches + error states), generate a screen inventory.
>
> For each unique screen or state:
> - **Screen name** — what this state is called (used consistently across the prototype)
> - **Screen type** — Page / Modal / Sheet / Toast / Inline state / Empty state / Error state
> - **When it appears** — which step in the flow triggers this screen
> - **What it contains** — headline, primary action, secondary actions (not design — content)
> - **Where it goes** — every possible exit from this screen
>
> Group screens by: Happy path screens / Alternative path screens / Error states / Empty states
>
> Total screen count at the end — this is the prototype scope.
>
> Complete flow: [paste]"

---

### Screen Inventory Template

```
# Screen Inventory: [Feature Name]
### Flow version: [N] | Date: [DATE]

---

## Happy Path Screens

| # | Screen Name | Type | Triggered By | Primary Action | Leads To |
|---|---|---|---|---|---|
| 1 | [Name] | Page | [Trigger] | [CTA] | [Next screen] |
| 2 | [Name] | Modal | [Trigger] | [CTA] | [Next screen] |

---

## Alternative Path Screens

| # | Screen Name | Type | Condition | Primary Action | Leads To |
|---|---|---|---|---|---|
| 1 | [Name] | [Type] | [When this appears] | [CTA] | [Next screen] |

---

## Error States

| # | Error Name | Triggered By | User Can Fix? | Primary Action |
|---|---|---|---|---|
| 1 | [Name] | [Cause] | Yes / No | [Action] |

---

## Empty States

| # | State Name | When It Appears | First-Use? | Primary Action |
|---|---|---|---|---|
| 1 | [Name] | [Condition] | Yes / No | [CTA] |

---

**Total screens:** [N]
**Prototype scope (recommended):** [Which screens to include in the first prototype, and why]
```

---

## Step 5: Validate the Flow

Before handing off to wireframing, run these validation checks.

**Claude prompt:**
> "Validate this user flow against five criteria:
>
> 1. **Completeness** — is every decision point accounted for? Are there any paths that lead nowhere?
>
> 2. **User mental model** — does the flow match how [persona] expects this to work? Flag any steps that might surprise them.
>
> 3. **Error coverage** — for every action the user takes, what happens if the system can't complete it? Are all failure modes covered?
>
> 4. **Exit completeness** — can the user exit the flow at every reasonable point? Are there any dead ends?
>
> 5. **Minimum viable scope** — which branches are essential for a first prototype and which could be deferred? What's the smallest flow that tests the core assumption?
>
> Complete flow and screen inventory: [paste]
> Core assumption to test (from concept critique): [paste]"

---

## Edge Case Generation

One of Claude's most valuable contributions to flow mapping is systematic edge case generation — the scenarios a designer working alone typically misses.

**Claude prompt:**
> "Generate edge cases for this user flow. Think systematically across:
>
> 1. **State edge cases** — what happens when the user arrives in an unexpected state? (Already completed this action, partial completion from a previous session, different permission level)
>
> 2. **Data edge cases** — what happens with extreme data? (Empty names, extremely long strings, special characters, zero items, maximum items, single item)
>
> 3. **Timing edge cases** — what happens if the user is slow, fast, or interrupted? (Session timeout, leaves and returns mid-flow, double-taps, rage-clicks)
>
> 4. **Context edge cases** — what happens in unusual contexts? (Offline, slow connection, different device, different screen size)
>
> 5. **User behavior edge cases** — what happens when users do the unexpected? (Goes back when they shouldn't, skips a step, submits twice, refreshes mid-flow)
>
> For each edge case: describe what happens, whether it's handled, and what the design should do if it isn't.
>
> Flow: [paste]"

---

## Quality Checklist

Before handing off to wireframing:
- [ ] Happy path is complete — every step from entry to success is mapped
- [ ] Every decision point has all branches mapped — not just the expected one
- [ ] Every error state is documented — what triggers it, what the user sees, what they can do
- [ ] Every screen has a unique name — no ambiguous "screen 3" or "modal"
- [ ] All empty states are identified — first-use and cleared states
- [ ] Screen inventory total count is agreed — team knows what they're building
- [ ] Prototype scope is defined — which screens are in v1 and which are deferred
- [ ] Core assumption (from concept critique) is visible in the flow — the prototype tests it

---

## Phase Handoff Block

```
## Handoff: Prototype — User Flow Mapping
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Happy path steps: [N]
- Decision points mapped: [N]
- Alternative paths: [N]
- Error states: [N]
- Total screens inventoried: [N]
- Prototype scope (v1): [N screens]

### Entry and exit points
- Entry: [where the flow starts]
- Success exit: [what completion looks like]
- Abandonment exits: [where users might leave — and how many]

### Prototype scope (v1)
**In scope:**
[List screens included in first prototype]

**Deferred:**
[List screens not in v1 — with rationale]

### Core assumption this flow tests
[The riskiest assumption from concept critique — which screen or step reveals it]

### Most complex decision point
[The branch that requires the most design thinking — and what the options are]

### Edge cases to handle in v1
[The edge cases that are likely enough and impactful enough to include in the prototype]

### Open questions for wireframing
- [Design decision the flow map raised but didn't resolve]
- [Interaction pattern that needs exploration]

---
*This screen inventory is the wireframing scope.*
*Every screen in v1 scope must appear in the prototype.*
*Deferred screens should be noted in the prototype as out of scope.*
```
