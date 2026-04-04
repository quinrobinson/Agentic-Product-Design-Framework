---
name: iteration-brief
phase: 05 — Validate
description: Convert usability test findings into a precise, actionable iteration brief — exactly what to change, why, and in what order — so the next design cycle starts with a clear scope rather than an open-ended redesign. Use when the go/no-go decision is "iterate" and the team needs to define the next prototype before starting it. Closes the Validate loop and restarts the Prototype cycle with evidence-grounded scope. Depends on insight-report.md outputs.
ai_leverage: high
claude_surface: chat
---

# Iteration Brief

Define exactly what to change, why, and in what order — so the next prototype starts with a scope, not a blank page.

## When to Use

- The go/no-go decision from usability testing is "iterate"
- The team needs to agree on what changes to make before starting them
- You want to prevent over-iteration — changing things that didn't need changing
- A developer or prototyper needs a clear brief before the next design cycle begins
- You need to document why specific changes were made for future reference

---

## The Risk This Skill Prevents

When usability findings are handed over without a scoped brief, two things typically happen:

**Over-iteration:** The designer redesigns everything — including the elements that worked — because the findings highlighted problems and the team loses sight of what was successful. The next prototype is harder to evaluate because nothing is controlled.

**Under-iteration:** Only the most obvious surface changes get made, leaving the root cause unaddressed. The next test surfaces the same fundamental issues.

The iteration brief prevents both by defining: what changes (and why), what stays the same (and why), and what gets tested next.

---

## What Claude Needs to Start

1. **Findings report** — from `insight-report.md` — Critical and Major findings with design recommendations
2. **What worked** — documented in the findings report
3. **Go/no-go rationale** — what drove the decision to iterate vs. proceed
4. **Constraints** — timeline, what's in scope, who's building the next iteration
5. **Next test questions** — what remains unknown after this round

---

## Step 1: Separate What Changes from What Stays

Before defining changes, explicitly preserve what worked. This is as important as specifying what to fix.

**Claude prompt:**
> "From these usability test findings, create two lists:
>
> **PRESERVE — Do not change these:**
> For each element that tested well:
> - Element: [specific component, screen, copy, or interaction]
> - Evidence it worked: [N of N participants succeeded / quote]
> - Why it matters to keep: [what the design decision accomplishes]
>
> **CHANGE — Fix these:**
> For each Critical and Major finding:
> - Element: [specific component, screen, copy, or interaction]
> - What's wrong: [observable problem — not interpretation]
> - Evidence: [N of N participants affected]
> - Change required: [specific, actionable — what to do differently]
>
> After both lists: flag any tension where a change might accidentally break something in the PRESERVE list.
>
> Findings: [paste]
> What worked section: [paste]"

---

## Step 2: Define Changes at the Right Specificity

Changes in an iteration brief need to be specific enough that a wireframer can act on them without interpretation — but not so prescriptive that they remove the designer's judgment.

**Too vague:** "Improve the onboarding experience"
**Too specific:** "Change the button color from #3B82F6 to #22C55E"
**Right level:** "Add a step indicator to the 3-step setup flow showing current step and total steps — participants didn't know how many steps remained and 3 of 5 abandoned before completing"

**Claude prompt:**
> "Review these iteration changes and calibrate each one to the right level of specificity.
>
> Too vague = a designer could interpret it in 10 different ways
> Too specific = it prescribes the solution rather than the problem to solve
> Right level = clear enough to start wireframing, leaves room for design judgment
>
> For each change that's too vague: rewrite it with the specific element and failure mode
> For each change that's too specific: back it up to the design problem it solves
>
> Changes: [paste]
> Findings evidence: [paste]"

---

## Step 3: Prioritize the Change List

Not all changes need to happen before the next test. Prioritize by: impact on the prototype questions + feasibility + risk of breaking what works.

**Claude prompt:**
> "Prioritize these iteration changes into three tiers:
>
> **Tier 1 — Must fix before the next test:**
> Changes that directly affect the prototype questions being tested
> Changes where the current design prevents task completion
>
> **Tier 2 — Fix in this iteration but don't re-test:**
> Major friction points that don't affect the core prototype questions
> Copy changes and label fixes
>
> **Tier 3 — Defer to next cycle:**
> Minor findings
> Cosmetic issues
> Changes that require significant architectural rework
>
> For each Tier 1 change: estimate the design effort (hours)
> Flag any change that affects the Tier 1 / Tier 2 boundary — the team should discuss these.
>
> Changes: [paste]
> Prototype questions: [paste]"

---

## Step 4: Define the Next Prototype Scope

After defining changes, define the next test scope — what questions the next prototype will answer.

**Claude prompt:**
> "Based on what this iteration is addressing, define the scope and questions for the next round of testing.
>
> **What this iteration changes:** [paste Tier 1 + 2 changes]
>
> **What remains unknown after this round:**
> - [Question this test raised but didn't answer]
> - [Assumption that still needs validation]
>
> **Next prototype questions (3 maximum):**
> 1. [The new question this iteration creates — does the fix work?]
> 2. [Any remaining question from the original prototype questions that wasn't fully answered]
> 3. [New question surfaced by unexpected findings]
>
> **Minimum scope for next prototype:**
> [Which screens need to be in the next test based on the questions above]
>
> **What doesn't need to be re-tested:**
> [Elements that validated clearly in this round — can be treated as stable]"

---

## Complete Iteration Brief Template

```
# Iteration Brief: [Project Name] — Iteration [N]
### Based on: [Prototype name] usability test
### Date: [DATE]
### Next prototype target: [DATE]

---

## Why we're iterating
[1–2 sentences: which finding or prototype question failure drove the iterate decision]

---

## PRESERVE — Do not change (tested well)
| Element | Evidence | Why it matters |
|---|---|---|
| [Component/screen/copy] | [N/N users succeeded] | [What this accomplishes] |

---

## CHANGE — Required fixes

### Tier 1 (must fix before next test)
| # | Element | Change Required | Evidence | Effort |
|---|---|---|---|---|
| 1 | [Specific element] | [What to do differently] | [N/N + finding] | [Hours] |
| 2 | [Specific element] | [Change] | [Evidence] | [Hours] |

### Tier 2 (fix in this iteration, don't re-test)
| # | Element | Change Required | Evidence |
|---|---|---|---|
| 1 | [Element] | [Change] | [Evidence] |

### Tier 3 (defer)
- [Change] — defer because: [reason]

---

## Estimated iteration scope
- Tier 1 changes: [N] — Estimated effort: [hours]
- Tier 2 changes: [N] — Estimated effort: [hours]
- Total: [hours] — Target completion: [date]

---

## Next prototype questions
1. [Question — linked to Tier 1 change being tested]
2. [New question surfaced by this round]

## What doesn't need re-testing
[Elements that validated — treat as stable in next iteration]

---

## Design constraints from this round
[Any findings that constrain the solution space for iteration — things the iteration must not break]

## Open questions for the design team
[Things the findings raised that need design exploration before the next prototype]
```

---

## Quality Checklist

Before starting the iteration:
- [ ] PRESERVE list is explicit — team knows what not to touch
- [ ] Every Tier 1 change is specific enough to wireframe without asking questions
- [ ] Tier 1 changes link directly to prototype questions or Critical findings
- [ ] Design effort estimated — timeline is realistic
- [ ] Next prototype questions defined — team knows what the next test will answer
- [ ] Brief has been reviewed by at least one person who wasn't in the test sessions

---

## Phase Handoff Block

```
## Handoff: Validate → Prototype (next cycle)
### From: Iteration Brief
### Project: [PROJECT NAME]
### Date: [DATE]

---

### This iteration
- Based on: [Test name and date]
- Decision: Iterate
- Changes: [N Tier 1] + [N Tier 2]
- Estimated effort: [hours]
- Target date: [date]

### Tier 1 changes (next prototype must include)
1. [Change] — [element] — [hours]
2. [Change] — [element] — [hours]

### Elements to preserve
- [Element] — [why]

### Next prototype questions
1. [Question]
2. [Question]

### What's stable (doesn't need re-testing)
- [Element confirmed in this round]

### Entering next Prototype cycle
- prototype-scoping.md: Use next prototype questions as input
- Scope to Tier 1 changes + preserve list only
- Don't add scope beyond what the questions require

---
*This brief is the opening document for the next Prototype cycle.*
*Paste as context when opening prototype-scoping.md for the next iteration.*
```
