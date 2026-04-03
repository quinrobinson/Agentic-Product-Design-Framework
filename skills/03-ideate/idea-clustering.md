---
name: idea-clustering
phase: 03 — Ideate
description: Transform a large set of raw concepts into a navigable landscape of strategic directions — by grouping, naming, and mapping the solution space before evaluation. Use immediately after concept generation when you have 15+ ideas and need to see the shape of what you have before deciding what to prototype. Depends on outputs from concept-generation.md. Outputs feed into concept-critique.md and storyboarding.md.
ai_leverage: high
claude_surface: chat
---

# Idea Clustering

Turn a sprawling list of raw concepts into a clear landscape of strategic directions — so the team can make a real decision about what to bet on.

## When to Use

- You have 15+ raw concepts from a brainstorm or concept generation session
- Ideas feel scattered and the team can't see what they have
- You need to reduce the solution space before evaluation
- Stakeholders need to see the strategic options, not a list of 40 sticky notes
- You're deciding which concept directions to develop further

---

## What Clustering Actually Does

Clustering isn't sorting. The goal isn't to file ideas into neat boxes — it's to reveal the **strategic landscape** hiding inside the raw idea set.

A good clustering session answers three questions:
1. **What directions exist?** — How many meaningfully different bets are in this idea set?
2. **What's the split?** — Are most ideas clustered in one direction, with a few outliers? Or spread evenly across several?
3. **What's missing?** — Are there gaps in the solution space that no idea addresses?

The clusters become the unit of decision-making. The team doesn't choose between 40 ideas — they choose between 5–7 directions.

---

## What Claude Needs to Start

1. **Full concept set** — all concepts from `concept-generation.md`, in any format (names + one-liners is sufficient)
2. **Problem statement** — to evaluate whether clusters address the right problem
3. **Primary persona** — to check clusters against user needs
4. **Strategic context** — any business or technical constraints that should shape which directions are viable

---

## Step 1: Raw Clustering

Paste the full idea set and let Claude group them. Don't pre-sort or pre-filter — start with everything.

**Claude prompt:**
> "Group these [N] concepts into 5–7 meaningful clusters. Each cluster should represent a distinct strategic direction — a different bet about how to solve the problem.
>
> Rules:
> - Cluster by the underlying approach or mechanism, not by surface similarity
> - Each cluster should be meaningfully different from the others — if two clusters feel similar, merge them
> - Every concept should fit in exactly one cluster — no orphans, no overlap
> - Don't evaluate yet — just group
>
> For each cluster:
> - Give it a name (3–5 words, action-oriented)
> - List the concepts it contains
> - Write one sentence describing the strategic bet this cluster represents
>
> Problem statement: [paste]
> Full concept set: [paste all concepts]"

---

## Step 2: Validate the Clusters

Raw clustering often produces groupings that are too surface-level. Run this validation pass before moving on.

**Claude prompt:**
> "Review these clusters and evaluate them:
>
> 1. **Distinctiveness** — are all clusters genuinely different from each other? Could any be merged without losing meaningful distinction?
>
> 2. **Coverage** — do the clusters together cover the full solution space for this problem? Name any directions that aren't represented.
>
> 3. **User fit** — which clusters most directly address [persona]'s primary goal? Which are more tangential?
>
> 4. **Outliers** — are there any concepts that don't fit cleanly into any cluster? These outliers are often the most interesting — what do they represent?
>
> Clusters: [paste]
> Problem statement: [paste]
> Primary persona: [paste]"

---

## Step 3: Name and Frame Each Cluster

The cluster name is the most important artifact. It needs to communicate the strategic direction clearly enough that a stakeholder who wasn't in the brainstorm can understand what the team is choosing between.

**Claude prompt:**
> "For each cluster, generate three naming options ranging from descriptive to provocative:
>
> 1. **Descriptive** — explains what the solution does
> 2. **User-centric** — describes the outcome for the user
> 3. **Provocative** — captures the strategic bet or tension
>
> Then recommend one name per cluster and explain why it communicates the direction most clearly to a stakeholder who wasn't in the ideation session.
>
> Clusters: [paste]"

**What makes a good cluster name:**

| Weak | Strong |
|---|---|
| "AI features" | "The system does the work" |
| "Better UI" | "Reduce cognitive load at the moment of synthesis" |
| "Collaboration" | "Make research a team sport, not a solo task" |
| "Automation" | "Eliminate the steps users hate most" |
| "Simplification" | "One thing, done perfectly" |

---

## Step 4: Map the Strategic Landscape

Once clusters are named, map them to understand the full shape of the solution space — before any evaluation happens.

**Claude prompt:**
> "Analyze these clusters as a strategic landscape. For each cluster:
>
> 1. **Strategic position** — where does this cluster sit on the spectrum from 'safe/incremental' to 'risky/transformative'?
>
> 2. **Core assumption** — what single belief must be true for this direction to succeed?
>
> 3. **User value proposition** — what does the user get that they don't have today?
>
> 4. **Key tension** — what does this direction give up or trade off?
>
> Then: which two clusters are most directly in tension with each other? (e.g. 'The system does the work' vs 'Give users more control' — these can't both be true.)
>
> Clusters: [paste]
> Problem statement: [paste]
> Constraints: [paste]"

---

## Step 5: Generate the Cluster Map Document

Package the clustering output into a format the team can use to make decisions.

```
# Idea Cluster Map: [Project Name]
### Date: [DATE] | Concepts clustered: [N] | Clusters: [N]

---

## The Strategic Landscape

[2–3 sentences describing the overall shape — e.g. "Most concepts cluster around automation and AI assistance, with a smaller set exploring human-centered control. There's a notable gap in concepts that address the social/collaborative dimension of research synthesis."]

---

## Cluster 1: [Name]

**Strategic bet:** [One sentence — what must be true for this to win]
**User value:** [What the user gets that they don't have today]
**Key trade-off:** [What this direction gives up]
**Risk level:** Safe / Incremental / Ambitious / Transformative

**Concepts in this cluster:**
- [Concept name] — [one-liner]
- [Concept name] — [one-liner]
- [Concept name] — [one-liner]

**Representative concept:** [The one concept that best embodies this direction]

---

## Cluster 2: [Name]
[Repeat structure]

---

## Outliers (concepts that don't fit any cluster)

| Concept | Why it's an outlier | Worth exploring? |
|---|---|---|
| [Name] | [What makes it unusual] | Yes / No — [rationale] |

---

## Key Tensions

**[Cluster A] vs [Cluster B]**
[Describe the fundamental tension — why pursuing both would require compromise]

**Design implication:** [What the team needs to decide before prototyping]

---

## Coverage Gaps

[Directions that no concept addresses — worth a targeted brainstorm before selection?]

---

## Recommended for further development

Based on coverage, distinctiveness, and user fit — not scoring:
1. [Cluster name] — [one-line rationale]
2. [Cluster name] — [one-line rationale]
3. [Cluster name] — [one-line rationale]
```

---

## When Clusters Collapse

Sometimes concepts that seemed distinct during generation turn out to be variations of the same idea. That's useful information — it means the idea set has a strong center of gravity in one direction.

**Claude prompt:**
> "After clustering, we have [N] clusters but [X] of them feel similar. Help us decide whether to merge them or keep them separate.
>
> Clusters in question: [paste the similar clusters]
>
> For each pair: what's the meaningful distinction that justifies keeping them separate? If that distinction doesn't change a design decision, they should be merged.
>
> Problem statement: [paste]"

**The rule:** If two clusters would produce the same wireframe, merge them. If they'd produce different wireframes, keep them separate.

---

## Using Clustering for Stakeholder Alignment

Cluster maps are more useful for stakeholder conversations than raw idea lists. They transform "we brainstormed 40 ideas" into "we identified 5 strategic directions and need your input on two key tensions."

**Claude prompt:**
> "Reframe this cluster map as a 5-minute stakeholder briefing. The goal is to get input on which 1–2 directions to develop further — not to present every concept.
>
> Structure it as:
> 1. The problem we're solving (one sentence)
> 2. The strategic directions we identified (cluster names + one-liners)
> 3. The key tension we need a decision on
> 4. What we're asking for (direction, not approval)
>
> Cluster map: [paste]
> Stakeholder context: [role, priorities, time available]"

---

## Quality Checklist

Before moving to Concept Critique:
- [ ] 5–7 clusters — not too many (over-segmented) or too few (under-differentiated)
- [ ] Each cluster represents a genuinely different strategic bet — merging two wouldn't lose a meaningful design choice
- [ ] Every concept placed in exactly one cluster — no orphans left unassigned
- [ ] Cluster names communicate the direction to someone who wasn't in the session
- [ ] Key tensions between clusters are documented — the team knows what trade-offs exist
- [ ] Coverage gaps identified — the team has decided whether to fill them or proceed
- [ ] Outliers are documented and a decision made on whether to pursue them

---

## Phase Handoff Block

Generate this block at the close of Idea Clustering. Paste it when opening Concept Critique.

```
## Handoff: Ideate — Idea Clustering
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Concepts clustered: [N]
- Clusters identified: [N]
- Key tensions mapped: [N]
- Recommended for development: [N clusters]

### Strategic landscape summary
[2–3 sentences — what the overall shape of the solution space looks like]

### Clusters (full set)
1. **[Cluster name]** — [strategic bet in one sentence]
2. **[Cluster name]** — [strategic bet in one sentence]
3. **[Cluster name]** — [strategic bet in one sentence]
4. **[Cluster name]** — [strategic bet in one sentence]
5. **[Cluster name]** — [strategic bet in one sentence]

### Key tension
**[Cluster A] vs [Cluster B]** — [what the fundamental trade-off is]
**Decision needed:** [what the team needs to resolve before prototyping]

### Recommended for further development
1. [Cluster name] — [rationale]
2. [Cluster name] — [rationale]

### Outliers worth preserving
- [Concept name] — [why it's interesting despite not fitting a cluster]

### Coverage gaps
- [Directions no concept addresses — decided to pursue / not pursue]

### What Concept Critique should focus on
[Which clusters or tensions need the most scrutiny before committing to prototyping]

---
*Paste this block when opening Concept Critique.*
*Critique the recommended clusters first — not the full set.*
```
