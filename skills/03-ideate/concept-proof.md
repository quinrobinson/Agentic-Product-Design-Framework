---
name: concept-proof
phase: 03 — Ideate
description: >
  Generate Figma Make prompts that turn written concept cards into throwaway interactive prototypes
  — giving stakeholders clickable artifacts to react to before concept selection. Use after
  concept-generation.md and before concept-critique.md, or in parallel with idea-clustering.md.
  Each proof takes 5–10 minutes to generate in Figma Make. Outputs are prototype URLs embedded
  into the concept-critique evaluation and the Ideate → Prototype handoff block.
ai_leverage: high
claude_surface: chat
---

# Concept Proof

Turn written concept cards into clickable Figma Make prototypes — so concept selection is grounded in tangible artifacts, not text descriptions.

## When to Use

- You have 3+ documented concept cards (name, one-liner, core mechanism) from `concept-generation.md`
- You want stakeholders to click through concepts before selecting one, not just read about them
- The team is divided on a concept direction and needs something tangible to react to
- You want to surface interaction problems before committing to a full prototype
- You're using Figma Make and want structured prompts to generate each proof

---

## What a Concept Proof Is — and Isn't

**A concept proof is:** A throwaway, low-fidelity interactive prototype generated in Figma Make from a single concept card. It demonstrates the core mechanism and primary interaction — enough to evaluate and compare, not enough to ship.

**A concept proof is not:** A polished prototype. Not a usability test artifact. Not a design decision. It exists to make concept selection concrete — then gets discarded once prototyping begins.

**Why before critique:** Teams that evaluate concepts as text descriptions project their own assumptions onto them. A clickable proof forces the team to react to what the concept actually implies — not what they imagined it would look like.

---

## What Claude Needs to Start

1. **Concept cards** — name, one-liner, core mechanism, and key assumption for each concept (from `concept-generation.md`)
2. **Primary persona** — who is experiencing this concept
3. **Key scenario** — the specific trigger and goal from the storyboard scenario definition
4. **Platform** — web, iOS, Android, or responsive

---

## Step 1: Generate the Figma Make Prompt

For each concept, Claude generates a structured Figma Make prompt that describes the core interaction clearly enough for Make to produce a useful prototype.

> **How this works:** Claude already has your concept cards and persona from this session. You don't need to re-paste anything — just ask Claude to generate the prompt for a specific concept by name. Claude synthesizes from what it already knows.

**Claude prompt:**
> "Using the concept cards we've developed in this session, generate a Figma Make prompt for [concept name].
>
> The prompt should:
> 1. Describe 2–3 screens that demonstrate the core mechanism
> 2. Specify the key interaction — what the user does and what changes on screen
> 3. Use realistic placeholder content drawn from [persona]'s actual context — specific names, dates, tasks
> 4. Keep fidelity low — no visual style, no brand colors, wireframe quality only
>
> Format as a single focused paragraph under 150 words, ready to paste directly into Figma Make."

---

### Figma Make Prompt Template

Use this structure when writing prompts manually:

```
Build a [platform] prototype demonstrating [concept name].

The user is [persona context — 1 sentence]. They need to [goal].

Show [N] screens:
1. [Screen name] — [what appears and what the user does]
2. [Screen name] — [what appears after the action, what changed]
3. [Screen name — if needed] — [the resolved state]

Key interaction: When the user [action], [what happens on screen].

Use realistic placeholder content — [example: "3 research interview transcripts with names, dates, and excerpt previews"]. No styled design. Wireframe fidelity is fine.
```

---

## Step 2: Generate Proofs for All Concept Candidates

Run Step 1 for every concept that made it past idea clustering — typically 3–5 concepts. The goal is a proof for each direction, not just the favorite.

**Why all of them:** The concept that looked weakest on paper sometimes clicks once it's interactive. The concept everyone agreed on sometimes reveals a fatal interaction problem in proof form. Compare before selecting.

**Time budget:** Budget 5–10 minutes per concept proof in Figma Make. Three concepts = 30 minutes of Make time before running a single critique lens.

---

## Step 3: Capture the Prototype URLs

After each Figma Make prototype is generated and published, record the URL alongside the concept card.

**Format:**
```
**[Concept Name]**
One-liner: [paste]
Core mechanism: [paste]
Figma Make prototype: [URL]
First impression: [1–2 sentences — what the proof revealed that the text didn't]
```

---

## Step 4: Run a Quick Proof Review

Before moving to formal concept critique, do a 10-minute proof review with the team. Not a formal critique — just first impressions from clicking.

**Claude prompt:**
> "We've generated Figma Make proofs for [N] concepts. Help us run a 10-minute proof review.
>
> For each concept, ask:
> 1. **Does the core mechanism make sense on first click?** — Yes / No / Unclear
> 2. **What's the first thing users would try that the proof doesn't handle?**
> 3. **Does this feel like the right pattern for [persona]'s context?**
>
> Then: which concepts are worth running full critique lenses on? Which can be eliminated based on the proof alone?
>
> Concepts and prototype URLs: [paste all concept cards + URLs]
> Persona: [paste]"

This step often eliminates 1–2 concepts before the formal critique, making the critique faster and more focused.

---

## Quality Checklist

Before moving to Concept Critique:
- [ ] A Figma Make proof generated for each concept candidate (not just the favorite)
- [ ] Prototype URLs recorded alongside each concept card
- [ ] Quick proof review completed — team has clicked all proofs, not just read descriptions
- [ ] At least one concept eliminated or deprioritized based on proof behavior (if none, run more angles in generation)
- [ ] First impressions documented — what the proofs revealed that text descriptions didn't

---

## Phase Handoff to Concept Critique

Add this section to the Concept Generation handoff block when opening Concept Critique.

```
### Concept Proofs (Figma Make)

| Concept | Prototype URL | First impression |
|---|---|---|
| [Name] | [URL] | [1 sentence] |
| [Name] | [URL] | [1 sentence] |
| [Name] | [URL] | [1 sentence] |

**Eliminated from proof review:** [Concept name] — [why, based on proof behavior]

**Carry forward to full critique:**
- [Concept name] — [URL]
- [Concept name] — [URL]
```

---

## Notes on Figma Make Prompts

**What works well:**
- Specific content descriptions ("a list of 4 expense categories with amounts") over abstract descriptions ("a list of items")
- Named interactions ("when the user taps 'Approve', the card flips to show a confirmation state") over vague ones ("make it interactive")
- Explicit screen count (2–3 screens) — Make produces better output with a bounded scope

**What to avoid:**
- Visual style direction in the prompt — Make will choose its own style, which is fine for proofs
- Over-specifying layout ("three columns with…") — let Make decide structure, focus on content and interaction
- Including the full concept card verbatim — distill to core mechanism and key interaction only

**If the proof misses the concept:** Revise the Figma Make prompt to be more specific about the core mechanism, not the visual style. The mechanism is what needs to come through — layout and aesthetics don't matter at this stage.
