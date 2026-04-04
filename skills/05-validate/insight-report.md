---
name: insight-report
phase: 05 — Validate
description: Generate a complete usability test findings report — from raw synthesis to a structured document with findings, evidence, recommendations, and a go/no-go decision — that drives design decisions and stakeholder alignment. Use after completing usability-findings-synthesis.md. Outputs feed into iteration-brief.md and stakeholder-presentation.md.
ai_leverage: high
claude_surface: chat
---

# Insight Report

Turn usability test findings into a structured document that drives design decisions — not just documents what happened.

## When to Use

- You've completed usability findings synthesis and need a shareable document
- Stakeholders need evidence before approving the next design iteration
- The team needs to align on what to fix before handing off to engineering
- A previous test round needs to be documented for project records
- You're handing off findings to a team member who wasn't in the sessions

---

## What a Good Findings Report Does

Most usability test reports fail for one of two reasons: they're too long (stakeholders skip them) or too vague (designers can't act on them). A good report:

**Is specific.** Not "users had trouble with navigation" — but "4 of 5 participants navigated to Settings when looking for the Export function, because the top nav label 'Account' didn't suggest file management."

**Is actionable.** Every finding leads to a specific design recommendation. Not "improve the onboarding flow" — but "add a progress indicator to the 3-step setup flow — participants didn't know how many steps remained and three abandoned before completing."

**Separates what failed from what should change.** A finding is an observation. A recommendation is a design response. Not the same thing — and keeping them separate prevents the report from prescribing solutions before the team has discussed options.

**Documents what worked.** Equal in importance to what failed. This prevents over-iteration — redesigning things that didn't need changing.

---

## What Claude Needs to Start

1. **Findings synthesis** — the structured output from `usability-findings-synthesis.md`
2. **Prototype questions** — the 3 questions this test was designed to answer
3. **Pass/fail criteria** — the predefined thresholds
4. **Go/no-go decision** — the recommendation from synthesis
5. **Audience** — who will read this report (design team, engineering, executive, client)

---

## Step 1: Generate the Report Structure

**Claude prompt:**
> "Generate a usability test findings report from this synthesis. The report should be specific enough to act on and short enough to be read.
>
> Audience: [who will read this — design team / engineering / executive / client]
> Recommended length: [1–2 pages for executive, 3–5 pages for design/engineering team]
>
> Report structure:
>
> ## Executive Summary (3–5 sentences)
> What was tested, with whom, key finding, and the go/no-go decision.
>
> ## Test Setup
> - Prototype tested: [name + fidelity]
> - Participants: [N — describe segment, not individuals]
> - Tasks: [list]
> - Date: [range]
>
> ## What We Were Testing (the 3 prototype questions)
> [Restate each question and its pass/fail criteria]
>
> ## Answers to Prototype Questions
> For each question: Answer (Yes/No/Partial) + Evidence (N of N participants + quote) + Confidence
>
> ## Critical Findings (task failures)
> [Each finding: observation + frequency + evidence quote + design recommendation]
>
> ## Major Findings (significant friction)
> [Same format]
>
> ## What Worked (don't change these)
> [What succeeded + why it matters to preserve it]
>
> ## Decision
> [Proceed / Iterate / Return to ideation — with rationale]
>
> ## Recommended Next Steps
> [3–5 specific actions, ordered by priority]
>
> Findings synthesis: [paste]
> Prototype questions: [paste]
> Pass/fail criteria: [paste]"

---

## Step 2: Write Each Finding Precisely

The finding format is the most important part of the report. Use this structure for every Critical and Major finding:

```
### Finding [N]: [Short title — the problem in 5–8 words]

**Observation:** [What users did — specific, observable, no interpretation]
"[Representative direct quote — verbatim]" — Participant [code]

**Frequency:** [N] of [N] participants
**Severity:** Critical / Major

**Why it matters:** [1 sentence — what this finding means for the user's ability to accomplish their goal]

**Design recommendation:** [Specific change — what to add, remove, move, or rewrite]
Not: "Improve the navigation"
Yes: "Rename 'Account' to 'Files & Export' in the top navigation, or move Export into the primary toolbar"

**What not to change:** [If this finding might trigger over-iteration — what should stay the same]
```

---

## Step 3: Separate Findings from Recommendations

One of the most common report errors: mixing observations with design decisions.

**Claude prompt:**
> "Review this draft report and separate findings from recommendations. For each finding:
>
> Finding = what users did or said (observable, evidence-based, could be verified by another observer)
> Recommendation = design response (the team's decision about what to change — not the only possible response)
>
> Flag any finding that assumes a specific solution. Rewrite it as a pure observation, then add the recommendation separately.
>
> Also flag any recommendation that isn't directly tied to a finding — remove it or add the supporting evidence.
>
> Draft report: [paste]"

---

## Step 4: Calibrate Length for the Audience

**Claude prompt:**
> "Produce [audience-appropriate] version of this findings report.
>
> **For executive stakeholders (1 page max):**
> - Executive summary only (what was tested, key insight, decision)
> - Top 3 findings as bullet points with participant counts
> - Decision and next steps
> - No detailed methodology
>
> **For design team (full report, 3–5 pages):**
> - Full structure as outlined above
> - Include minor findings and 'what worked' sections
> - Include design recommendations per finding
>
> **For engineering handoff:**
> - Focus on functional failures and edge cases
> - Include specific UI elements that need changing by name
> - Flag anything that affects architecture or component design
> - Skip background and context the team already knows
>
> Full findings synthesis: [paste]
> Target audience: [specify]"

---

## Including Quotes Effectively

Direct quotes are the most powerful evidence in a findings report. Use them selectively — every quote should earn its place.

**Rules for quotes:**
- Verbatim only — never paraphrase and attribute as a quote
- One representative quote per finding — not every instance
- Include participant code, not name ("P3" not "the third participant")
- Quotes that reveal mental models are more valuable than quotes that express frustration

**Claude prompt for finding the best quotes:**
> "From these session notes, identify the 3–5 quotes that best support the key findings. A good quote:
> - Reveals the user's mental model or expectation (not just their frustration)
> - Is specific to the design element being discussed
> - Would be compelling to a stakeholder who wasn't in the room
>
> For each quote: identify which finding it supports and why it's the most representative.
>
> Session notes: [paste]
> Key findings: [paste]"

---

## Report QA Checklist

Before sharing the report:
- [ ] Executive summary states the go/no-go decision explicitly
- [ ] Every Critical and Major finding has a participant count
- [ ] Every finding has at least one direct quote with participant code
- [ ] Findings and recommendations are clearly separated
- [ ] Recommendations are specific — not "improve X" but "change X to Y because Z"
- [ ] "What worked" section exists — not just a list of failures
- [ ] Minor findings and cosmetic issues are clearly labeled — not mixed with Critical
- [ ] Report length matches the primary audience
- [ ] No participant names appear anywhere in the document

---

## Phase Handoff Block

```
## Handoff: Validate — Insight Report
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Report summary
- Test: [prototype name]
- Participants: [N]
- Decision: [Proceed / Iterate / Return to ideation]
- Report shared with: [stakeholders]

### Top 3 findings
1. [Finding title] — [N/N participants] — Severity: [level]
2. [Finding title] — [N/N participants] — Severity: [level]
3. [Finding title] — [N/N participants] — Severity: [level]

### Decision rationale
[1–2 sentences: which findings drove the go/no-go]

### Recommended next steps
1. [Action — who owns it — by when]
2. [Action — who owns it — by when]
3. [Action — who owns it — by when]

### What to preserve in the next iteration
[Specific elements that worked — document to prevent over-iteration]

### Open questions for the next round
[Things this test surfaced but didn't resolve — inputs for the next prototype question set]

---
*Share report with stakeholders before starting iteration.*
*Pass critical + major findings to iteration-brief.md.*
*If returning to ideation, pass to concept-critique.md with failed assumptions documented.*
```
