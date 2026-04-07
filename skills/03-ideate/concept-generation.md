---
name: concept-generation
phase: 03 — Ideate
description: Generate a broad set of design concepts from a validated problem frame — using structured brainstorming, multi-angle generation, and outside-the-box thinking drawn from unrelated domains. Use when transitioning from Define to Ideate, when the team is stuck in obvious solution territory, or when you need more than one concept direction before committing to prototyping. Depends on outputs from problem-framing.md and journey-mapping.md. Outputs feed into idea-clustering.md and concept-critique.md.
ai_leverage: high
claude_surface: chat
---

# Concept Generation

Move from a validated problem frame to a rich set of concept directions — including ideas you wouldn't have reached from inside your own domain expertise.

## When to Use

- You have a locked problem statement and HMW questions from Define
- You need more than the first obvious solution
- The team keeps gravitating toward the same kind of answer
- You want to explore multiple directions before committing to one
- You need to break out of your expert solution vocabulary

---

## The Two Modes — Don't Mix Them

Ideation works in two distinct modes. Mixing them kills both.

**Diverge — generate without judgment**
Quantity over quality. No evaluation during generation. Every idea is valid. The goal is volume and variety — including ideas that seem bad, because bad ideas spark good ones.

**Converge — evaluate and select**
Systematic comparison. Evidence-based scoring. The goal is to identify which directions are worth prototyping. Use `idea-clustering.md` and `concept-critique.md` for this step.

This skill file covers **diverge only**. Do not evaluate ideas during this step.

---

## What Claude Needs to Start

1. **Problem statement** — the locked HMW, JTBD, or User + Need + Insight from `problem-framing.md`
2. **Primary persona** — who this concept must work for
3. **Top 3–5 HMW questions** — the scored list from Define
4. **Key constraints** — technical, business, or user constraints that bound the solution space
5. **Research context** — the core insight that drove the problem frame

---

## Step 1: Generate From the Problem Frame

Start with the most direct approach — generating concepts from your HMW questions. This establishes the baseline solution space before expanding beyond it.

**Claude prompt:**
> "Using the problem frame and HMW questions below, generate 5 distinct concept directions. Each concept should represent a meaningfully different approach — not variations of the same idea. For each concept:
> - Name it (2–4 words, memorable)
> - One-sentence description from the user's perspective
> - The core mechanism — what makes it work
> - Which HMW question it primarily responds to
> - What assumption it bets on
>
> Do not evaluate or score them yet. Generate all 5 first.
>
> Problem statement: [paste]
> Primary persona: [paste]
> HMW questions: [paste top 3–5]
> Key constraints: [paste]"

---

## Step 2: Generate From Multiple Angles

The first concepts you generate are almost always inside your expert solution vocabulary. Force new angles before concluding.

Run each of these angles as a separate prompt. Each should produce 2–3 new concepts the previous step didn't surface.

---

### Angle 1 — First Principles

Strip away how things are currently done. Reason from what the user actually needs.

**Claude prompt:**
> "Forget how [problem domain] currently works. Starting from first principles:
> What does [persona] fundamentally need to accomplish? What's the minimum mechanism that delivers that outcome? What would you build if no existing solution existed as a reference?
>
> Generate 3 concepts that don't resemble any current product in this space.
>
> Problem: [paste]
> Persona: [paste]"

---

### Angle 2 — Outside Your Domain (Analogous Inspiration)

This is the most powerful angle for breaking expert fixedness. The goal is to find structural parallels in domains that have solved a similar problem — then transfer the underlying principle, not the surface solution.

The key insight: you're not looking for what journalism or medicine looks like. You're looking for the *principle* they use — and asking how that principle could apply to your problem.

**Claude prompt:**
> "Identify 5 domains outside of [product category] that have solved a structurally similar problem to this one:
> '[problem statement]'
>
> For each domain:
> 1. Name the domain and describe how they solved the problem
> 2. Extract the underlying principle — not the surface solution
> 3. Translate that principle into a concrete product concept for [persona]
>
> Good domains to explore: emergency medicine, investigative journalism, aviation, military logistics, competitive sport, architecture, education, supply chain, game design, financial trading.
>
> Be specific about the transfer — explain what changes and what stays the same.
>
> Persona: [paste]
> Constraints: [paste]"

**What good analogous transfer looks like:**

*Problem: Designers struggle to communicate research findings to stakeholders who weren't in the room.*

| Domain | Their solution | Underlying principle | Product concept |
|---|---|---|---|
| Investigative journalism | Inverted pyramid — most critical finding first | Lead with the conclusion, provide evidence after | Research brief that opens with the single most important finding, then layered evidence |
| Emergency medicine | SBAR — Situation, Background, Assessment, Recommendation | Structured handoff prevents information loss | Structured synthesis format that forces a recommendation, not just findings |
| Aviation | Cockpit voice recorder — verbatim capture of critical moments | The exact words matter as much as the summary | Research report that embeds verbatim participant quotes alongside interpretations |
| Military | "Commander's intent" — communicate the goal so subordinates can act without constant check-ins | Empower action without needing every detail | One-page brief that tells the design team what to solve without explaining every research session |

---

### Angle 3 — Constraint as Catalyst

Take your biggest constraint and use it as the core design driver instead of a limitation.

**Claude prompt:**
> "Our biggest constraint is [constraint — e.g. 'users have less than 5 minutes', 'must work on mobile only', 'no onboarding budget', 'API is read-only'].
>
> Generate 3 concepts where this constraint is the core design principle — not something to work around, but the thing that makes the concept distinctive.
>
> Problem: [paste]
> Persona: [paste]"

---

### Angle 4 — Technology Inversion

Instead of asking "what technology could help?" — ask "what if the technology worked in reverse?"

**Claude prompt:**
> "Generate 3 concepts by inverting common technology assumptions in this problem space:
> - What if the system did less instead of more?
> - What if the user saw the algorithm's work, not just the output?
> - What if the product got out of the way instead of providing a feature?
>
> Problem: [paste]
> Persona: [paste]"

---

### Angle 5 — Worst Possible Idea (then reverse)

Deliberately generate terrible ideas to unlock thinking that politeness and perfectionism suppress. Then reverse each bad idea into something useful.

**Claude prompt:**
> "Generate the 10 worst possible solutions to this problem — ideas that would embarrass a designer, frustrate the user, or make the problem dramatically worse.
>
> Then reverse each bad idea: what does its opposite suggest? What useful concept direction emerges from inverting the terrible idea?
>
> Problem: [paste]
> Persona: [paste]"

**Why this works:** The worst ideas often contain the seed of the best ones. "Make the user re-enter all their data every session" reversed becomes "eliminate persistent state entirely and make each session self-contained." That's a real architectural decision worth exploring.

---

## Step 3: Role-Play the Persona

Generate concepts by inhabiting the user's perspective — not designing for them, but thinking as them.

**Claude prompt:**
> "You are [persona name] — [role, context, goal]. You have [their specific pain point] and you've been struggling with [specific problem] for [time period].
>
> A product designer asks you: 'If you could wave a magic wand and have exactly the tool you need — with no technical constraints — what would it do? Walk me through a specific moment in your day where it would help and exactly what it would do.'
>
> Answer in first person as [persona]. Be specific about the workflow moment, the emotion, and what the ideal experience feels like.
>
> Persona details: [paste]
> Research context: [paste]"

This often surfaces concepts that no angle-based approach reaches — because it accesses the emotional and contextual truth of the problem, not just its functional dimension.

---

## Step 4: Future-State Scenario

Write the press release for the product that solved the problem. This forces concreteness about what success actually looks like — before designing it.

**Claude prompt:**
> "Write a 200-word 'product announcement' from 18 months in the future. The product has launched and users love it. Write it as a press release or product blog post — specific about what the product does, who uses it, and what they say about it.
>
> Then extract: what does this imply about the core concept? What must be true about the product for this announcement to be real?
>
> Problem statement: [paste]
> Primary persona: [paste]
> Success criteria from Define: [paste]"

---

## Capturing the Full Concept Set

After running 2–3 angles, you should have 15–30 raw concepts. Before clustering, do a quick pass to document each one consistently.

**Claude prompt:**
> "Review the concepts generated across all angles. For each distinct concept (not variations), write a concept card:
>
> **Name:** [2–4 words]
> **One-liner:** [What it does, from the user's perspective — one sentence]
> **Core mechanism:** [What makes it work — the key design/technical decision]
> **Angle:** [Which generation angle produced it]
> **Assumption it bets on:** [What must be true for this to work]
>
> Identify and merge any concepts that are variations of the same idea. Flag any that don't respond to the problem statement.
>
> Concepts: [paste all generated concepts]"

---

## Step 5: Generate Concept Proofs (Figma Make)

Before moving to Idea Clustering or Concept Critique, turn the most promising concept cards into throwaway interactive prototypes using Figma Make. This makes the concept selection decision tangible — stakeholders click through options instead of reading about them.

**When to run this step:**
- You have 15+ documented concept cards and are ready to identify candidates for critique
- Stakeholders will be involved in concept selection
- The team is divided on a direction and needs something to react to

**How to run it:**

Use `concept-proof.md` to generate a Figma Make prompt for each concept candidate (typically the 3–5 strongest cards after a first-pass review). Each prompt takes 5–10 minutes in Figma Make to produce a clickable proof.

Record each prototype URL alongside the concept card before moving to clustering or critique:

```
**[Concept Name]**
One-liner: [paste]
Core mechanism: [paste]
Figma Make prototype: [URL — add after generating in Figma Make]
```

**This step is optional but strongly recommended** when multiple stakeholders are evaluating concepts or when the team has more than 3 viable directions. Skip it when the team is aligned on a direction and moving quickly.

> **Figma Make tip:** Keep prompts to 2–3 screens and focus on the core mechanism. Visual fidelity doesn't matter at this stage — the mechanism is what needs to come through.

---

## When You're Stuck

If concept generation stalls — ideas all feel similar or the team keeps circling — use one of these prompts:

**Break the pattern:**
> "The last 5 concepts we've generated all assume [pattern — e.g. 'the user does the work' / 'the system is proactive' / 'this is a screen-based interface']. Generate 3 concepts that explicitly break that assumption."

**Change the user:**
> "Generate 3 concepts by designing for the most extreme version of our persona — someone who has [the problem] 10x worse than our typical user. What would they need?"

**Remove a constraint:**
> "Ignore [biggest constraint] entirely for this exercise. If [constraint] didn't exist, what's the best possible solution? Now add the constraint back — what survives?"

---

## Quality Checklist

Before moving to Idea Clustering:
- [ ] At least 15–20 distinct concepts generated — not variations of 3 ideas
- [ ] At least one concept from analogous inspiration (outside the product domain)
- [ ] At least one concept that makes a teammate uncomfortable — it's too different
- [ ] No evaluation has happened during generation — all ideas are still alive
- [ ] Every concept has a name, one-liner, and core mechanism documented
- [ ] The full set covers multiple strategic directions — not one direction explored deeply

---

## Phase Handoff Block

Generate this block at the close of Concept Generation. Combine with Define handoffs when opening Concept Critique or Storyboarding.

```
## Handoff: Ideate — Concept Generation
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Concepts generated: [N total]
- Angles run: [list — HMW direct / first principles / analogous / constraint / worst-then-reverse / persona role-play / future state]
- Analogous domains explored: [list domains]

### Problem statement (carried from Define)
> [The locked HMW / JTBD / User+Need+Insight]

### Primary persona
- Who: [name + context]
- Goal: [what they're trying to accomplish]

### Full concept set
[Paste all concept cards — name, one-liner, core mechanism, angle, assumption]

### Most unexpected concept
**[Name]** — [why it's unexpected, what domain or angle produced it]

### Concepts that feel most promising (no scoring yet — just instinct)
1. [Name] — [why]
2. [Name] — [why]
3. [Name] — [why]

### Concepts that feel risky but interesting
1. [Name] — [what the risk is]

### Concept proofs (Figma Make) — if generated
| Concept | Prototype URL | First impression |
|---|---|---|
| [Name] | [URL] | [1 sentence — what the proof revealed] |
| [Name] | [URL] | [1 sentence] |
| [Name] | [URL] | [1 sentence] |

### What's missing
[Directions that weren't explored — angles that ran out of time, constraints that weren't inverted, domains that weren't tried]

---
*Paste this block when opening Idea Clustering, Concept Critique, or Storyboarding.*
*Do not evaluate or rank concepts until Idea Clustering is complete.*
```
