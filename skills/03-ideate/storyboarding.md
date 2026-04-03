---
name: storyboarding
phase: 03 — Ideate
description: Translate a selected concept into a narrative, step-by-step visualization of how a user experiences it — before any wireframes exist. Use at the end of Ideate to bridge concept selection and prototyping, when the team needs to align on the user flow before designing screens, or when a concept needs to be communicated to stakeholders in a tangible but low-commitment format. Depends on outputs from concept-critique.md. Outputs feed directly into Prototype phase.
ai_leverage: high
claude_surface: chat
---

# Storyboarding

Turn a selected concept into a scene-by-scene narrative of the user experience — specific enough to prototype from, human enough to communicate the concept's value without a single wireframe.

## When to Use

- A concept has been selected and critiqued, and the team is ready to move to prototyping
- The team is aligned on what to build but not on how the experience unfolds
- A concept needs to be communicated to stakeholders before design work begins
- You need to align on the highest-risk moment in the flow before deciding what to prototype first
- The concept involves multiple touchpoints or stages that need to be sequenced

---

## What a Storyboard Is — and Isn't

**A storyboard is:** A scene-by-scene narrative of one user, in one scenario, experiencing the concept from trigger to resolution. Each scene describes what happens, what the user thinks and feels, and what the interface or system does.

**A storyboard is not:** A wireframe. Not a user flow diagram. Not a feature list. Not a prototype script.

The storyboard lives between the concept and the prototype. It answers "what happens?" before prototyping answers "what does it look like?"

**Why this order matters:** Teams that skip storyboarding and go straight to wireframes frequently discover mid-prototype that they disagree on the fundamental flow — and have to re-do work. A storyboard surfaces those disagreements in 30 minutes, not 3 days.

---

## What Claude Needs to Start

1. **Selected concept** — name, one-liner, core mechanism, strategic bet
2. **Primary persona** — from `persona-creation.md`
3. **Key scenario** — the specific situation and trigger for this experience
4. **Top risks to validate** — from `concept-critique.md` — these shape which moments to detail most carefully
5. **Success criteria** — what does a successful experience look like for the user?

---

## Step 1: Define the Scenario

One storyboard = one persona + one scenario + one goal. Lock all three before writing a single scene.

**Claude prompt:**
> "Help me define the storyboard scenario for this concept.
>
> Based on the concept and persona below, suggest:
> 1. **The specific trigger** — what exact event or moment causes [persona] to reach for this product? Be specific — not 'when they need to synthesize research' but 'when [persona] realizes at 4pm that their stakeholder presentation is tomorrow and they have 12 unprocessed interview sessions'
> 2. **The emotional starting state** — how does [persona] feel at the moment the scenario begins?
> 3. **The goal** — what does [persona] need to accomplish in this scenario? What does success feel like?
> 4. **The end point** — what signals that the scenario is complete? What does [persona] do next?
> 5. **The risk moment** — based on the critique findings, which moment in this scenario is most likely to go wrong?
>
> Concept: [paste]
> Persona: [paste]
> Top risks from critique: [paste]"

---

## Step 2: Generate the Storyboard

A storyboard has 6–10 scenes. Fewer than 6 is too abstract. More than 12 loses the narrative thread.

Each scene has four elements:
- **What happens** — the observable action or system event
- **What the user thinks** — their internal monologue
- **What the user feels** — their emotional state
- **What the interface does** — what they see, hear, or interact with

**Claude prompt:**
> "Generate a [N]-scene storyboard for this scenario. Write it as a narrative — not a bullet list. Each scene should feel like a specific, real moment in [persona]'s day.
>
> For each scene:
> - **Scene [N]: [Scene title]** — a short, specific title for this moment
> - **What happens:** [The observable action — what a camera would capture]
> - **[Persona] thinks:** [Internal monologue — use first person, specific to their context]
> - **[Persona] feels:** [Emotional state — specific emotion, not just 'frustrated' or 'happy']
> - **The interface:** [What they see and interact with — described in terms of function, not appearance]
>
> Rules:
> - Ground every scene in the research — reference actual pain points and behaviors from the persona
> - Scene 3–4 should be the moment of highest risk (from the critique) — detail this moment most carefully
> - The final scene should show the user achieving their goal and feeling the emotional resolution
> - Do not describe visual design — describe function and experience
>
> Concept: [name + one-liner + core mechanism]
> Persona: [paste]
> Scenario trigger: [paste]
> Goal: [paste]
> Risk moment: [paste from critique]"

---

### Storyboard Template

```
# Storyboard: [Concept Name]
### Persona: [Name] | Scenario: [One sentence] | Date: [DATE]

---

## Scene 1: [Title — e.g. "The realization hits at 4pm"]

**What happens:**
[Specific, observable action. What a camera would capture. Not internal state — external event.]

**[Persona] thinks:**
"[First-person internal monologue — specific to their situation, not generic user thoughts]"

**[Persona] feels:**
[Specific emotion + intensity — e.g. "Dread with a spike of panic" not just "anxious"]

**The interface:**
[What they see and interact with — described functionally. "A single input field with a prompt" not "a clean UI with a text box"]

---

## Scene 2: [Title]
[Repeat structure]

---

[Continue for all scenes — 6–10 total]

---

## Emotional Arc

| Scene | Title | Emotional state |
|---|---|---|
| 1 | [Title] | [Emotion] |
| 2 | [Title] | [Emotion] |
| 3 | [Title] | [Emotion — should be the low point] |
| 4 | [Title] | [Emotion — risk moment] |
| 5 | [Title] | [Emotion — turning point] |
| 6 | [Title] | [Emotion — resolution] |

**Arc narrative:** [2–3 sentences describing the emotional journey — where it starts, where it's most tense, and how it resolves]

---

## What this storyboard reveals

**The moment of highest value:** [Which scene — and what makes it valuable]
**The moment of highest risk:** [Which scene — and what could go wrong]
**The design decision this storyboard forces:** [What the team needs to decide before wireframing]
**What's deliberately left unresolved:** [Open questions this storyboard surfaces but doesn't answer]
```

---

## Step 3: Identify What the Storyboard Forces

The real value of a storyboard isn't the document — it's the disagreements it surfaces. Use Claude to extract them explicitly.

**Claude prompt:**
> "Review this storyboard and identify:
>
> 1. **Forced design decisions** — moments where the storyboard requires a specific design choice that hasn't been made yet. For each: what are the options, and what are the implications of each?
>
> 2. **Assumed behaviors** — moments where the storyboard assumes the user will do something that may not happen naturally. What would need to be true in the design for that behavior to occur?
>
> 3. **Unanswered questions** — moments the storyboard glosses over that the prototype will need to resolve. List them as questions the prototype should answer.
>
> 4. **Stakeholder disagreement points** — which scenes are most likely to generate disagreement when shown to stakeholders? What's the underlying tension?
>
> Storyboard: [paste]
> Top risks from critique: [paste]"

---

## Step 4: Stress-Test the Scenario

The storyboard represents the happy path. Stress-test it before it becomes the prototype brief.

**Claude prompt:**
> "Stress-test this storyboard by running three alternative scenarios:
>
> 1. **The rushed version** — [persona] is under time pressure and skipping steps. What breaks?
> 2. **The confused version** — [persona] doesn't understand a key step. Where do they get stuck, and what do they do?
> 3. **The skeptical version** — [persona] doubts the output at a critical moment. Do they trust it and proceed, or abandon?
>
> For each stress-test: describe what happens in the storyboard's most critical scene, and what design decision could reduce the failure risk.
>
> Storyboard: [paste]
> Persona: [paste]
> Risk moment: [paste]"

---

## Using the Storyboard to Brief Prototypers

A storyboard is only as useful as the briefing it enables. Use Claude to translate it into a prototype brief.

**Claude prompt:**
> "Convert this storyboard into a prototype brief. The brief should give a prototyper everything they need to build a testable prototype without being in the room.
>
> Include:
> 1. **What to prototype** — the specific flow, not the entire concept
> 2. **What to test** — the top 3 questions the prototype should answer
> 3. **The critical scenes** — which scenes from the storyboard must be in the prototype (not all of them)
> 4. **What to leave out** — explicitly list what doesn't need to be in v1 of the prototype
> 5. **Success criteria** — how will you know the prototype test was successful?
>
> Storyboard: [paste]
> Top risks from critique: [paste]
> Success criteria from Define: [paste]"

---

## Storyboard Variations — When to Use Each

Not every concept needs the same storyboard format. Choose based on what needs to be communicated.

| Situation | Format | When |
|---|---|---|
| Single interaction | Linear 6–8 scenes | Most common — one flow, start to finish |
| Multi-touchpoint | Split storyboard | When the experience spans multiple sessions or channels |
| Comparison | Side-by-side | When showing before/after (current state vs. concept) |
| Stakeholder presentation | Narrative prose | When the audience needs story, not scene-by-scene structure |
| Prototype brief | Question-framed | When the goal is to identify what to test, not what to build |

**Claude prompt for narrative prose version:**
> "Convert this storyboard into a 300-word narrative written from [persona]'s perspective. Write in first person, past tense — as if they're describing the experience to a colleague the next day. Make it specific to their context — not a generic user story.
>
> Storyboard: [paste]
> Persona: [paste]"

---

## Quality Checklist

Before handing off to Prototype:
- [ ] Scenario is specific — one persona, one trigger, one goal
- [ ] 6–10 scenes — enough to show the full arc without losing the thread
- [ ] Each scene has all four elements — what happens, thinks, feels, interface
- [ ] Scene 3–4 is the risk moment — detailed more carefully than others
- [ ] Final scene shows emotional resolution — not just task completion
- [ ] Emotional arc is documented — shows where tension peaks and resolves
- [ ] Forced design decisions identified — team has discussed them
- [ ] Stress-tested against rushed, confused, and skeptical user scenarios
- [ ] Prototype brief generated — prototyper can start without further briefing

---

## Phase Handoff Block

Generate this block at the close of Storyboarding. This is the primary handoff from Ideate to Prototype.

```
## Handoff: Ideate → Prototype
### From: Storyboarding
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What Ideate produced
- Concepts generated: [N]
- Clusters identified: [N]
- Concepts critiqued: [N]
- Concept selected: [name]
- Storyboard scenes: [N]

### The concept
**Name:** [concept name]
**One-liner:** [what it does from the user's perspective]
**Core mechanism:** [what makes it work]
**Strategic bet:** [what must be true for this to succeed]

### The scenario
- **Persona:** [name + context]
- **Trigger:** [specific event that starts the experience]
- **Goal:** [what they need to accomplish]
- **Emotional starting state:** [how they feel at the start]
- **Emotional resolution:** [how they feel at the end]

### The storyboard (full)
[Paste all scenes]

### What to prototype
**Scope:** [The specific flow — not the full concept]
**Critical scenes to include:** [Scene numbers and titles]
**Leave out:** [What doesn't need to be in v1]

### What the prototype needs to answer
1. [Question — linked to top risk from critique]
2. [Question — linked to second risk]
3. [Question — what the storyboard left unresolved]

### Forced design decisions (resolve before wireframing)
- [Decision] — [options and implications]
- [Decision] — [options and implications]

### Success criteria for the prototype test
1. [Measurable outcome — how you'll know the prototype succeeded]
2. [Measurable outcome]

### What was rejected and why
- **[Concept]** — [one sentence rationale]
- **[Concept]** — [one sentence rationale]

---
*This block is the complete Ideate → Prototype handoff.*
*Paste it as the first message when opening any Prototype phase skill.*
*The prototype must answer the three questions above — everything else is secondary.*
```
