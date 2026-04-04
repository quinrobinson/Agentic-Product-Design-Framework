---
name: heuristic-review
phase: 04 — Prototype
description: Evaluate a prototype against Nielsen's 10 usability heuristics before user testing — surfacing friction, inconsistency, and usability failures that can be fixed in hours rather than after a test session. Use before any usability test to reduce the noise of obvious problems so testing surfaces deeper insights. Depends on a prototype or wireframe set to evaluate.
ai_leverage: high
claude_surface: chat
---

# Heuristic Review

Find usability problems before users do — systematically, quickly, and without scheduling a single test session.

## When to Use

- Before a usability test — to fix obvious problems so testing surfaces deeper insights
- When a prototype is built and the team has stopped seeing it clearly
- When you need a quick quality pass before a stakeholder review
- When there's no budget or time for full usability testing
- When a shipped product needs a quick usability audit before a redesign

---

## What Heuristic Evaluation Is — and Isn't

**It is:** A systematic expert review of a design against established usability principles — the 10 heuristics developed by Jakob Nielsen and Rolf Molich. It finds usability problems without requiring user testing.

**It is not:** A replacement for usability testing. Heuristic evaluation finds approximately 75–80% of usability problems — but misses the ones that depend on specific user contexts, mental models, and behaviors. Do both.

**Why before testing:** If a prototype has 20 usability problems and 12 of them are obvious heuristic violations, your test sessions will surface those 12 problems — and you'll spend 45 minutes per session watching users struggle with things you already know are wrong. Fix the obvious problems first so testing reveals the non-obvious ones.

---

## The 10 Nielsen Heuristics

| # | Heuristic | Core question |
|---|---|---|
| 1 | Visibility of system status | Does the user always know what's happening? |
| 2 | Match between system and real world | Does the product speak the user's language? |
| 3 | User control and freedom | Can the user undo, go back, or escape? |
| 4 | Consistency and standards | Is the same thing always called the same thing? |
| 5 | Error prevention | Does the design prevent errors before they happen? |
| 6 | Recognition over recall | Does the user see options rather than having to remember them? |
| 7 | Flexibility and efficiency | Can power users find shortcuts? |
| 8 | Aesthetic and minimalist design | Does every element earn its place? |
| 9 | Help users recognize, diagnose, recover from errors | Do error messages explain what happened and what to do? |
| 10 | Help and documentation | Is help available when needed? |

---

## What Claude Needs to Start

1. **Prototype description** — describe each screen: what it contains, what actions are available, what the user is trying to do on this screen
2. **User context** — who the user is, what they already know, what they expect
3. **Task context** — what the user is trying to accomplish and the flow they're following
4. **Known concerns** — any usability issues the team already suspects

---

## Step 1: Full Heuristic Sweep

Run all 10 heuristics against the complete prototype.

**Claude prompt:**
> "Run a heuristic evaluation of this prototype against Nielsen's 10 usability heuristics.
>
> For each heuristic:
> 1. Evaluate: Does the prototype satisfy this heuristic? (Pass / Partial / Fail)
> 2. Evidence: Cite the specific screen, element, or interaction that supports the rating
> 3. Severity: Rate violations as Critical (blocks task completion) / Major (significant friction) / Minor (noticeable but workaround exists)
> 4. Recommendation: For each violation, suggest the specific change
>
> User context: [persona — what they know and expect]
> Task: [what the user is trying to do]
>
> Prototype screens (describe each):
> [Screen 1: name, what it contains, available actions]
> [Screen 2: name, what it contains, available actions]
> [Continue for all screens]"

---

## Step 2: Severity Ranking

After the full sweep, prioritize findings by severity and fix cost.

**Claude prompt:**
> "From the heuristic evaluation above, produce a prioritized fix list.
>
> Rank all violations by: Severity × Fix cost
> - Critical violations (blocks task): fix before any testing
> - Major violations (significant friction): fix before usability testing if time allows
> - Minor violations (noticeable): fix before stakeholder review or dev handoff
>
> For each violation in priority order:
> - **Heuristic violated:** [#N — name]
> - **Screen/element:** [where it appears]
> - **Problem:** [what's wrong]
> - **Severity:** [Critical / Major / Minor]
> - **Fix:** [specific, actionable change]
> - **Fix effort:** [10 min / 1 hour / Half day]
>
> Evaluation findings: [paste]"

---

### Severity Reference

| Severity | Definition | Action |
|---|---|---|
| **Critical** | User cannot complete the task — flow is blocked | Fix before any testing |
| **Major** | User can complete the task but with significant frustration, confusion, or error recovery | Fix before usability testing |
| **Minor** | User notices the issue but completes the task — low frustration | Fix before stakeholder review or dev handoff |
| **Cosmetic** | User would prefer this changed but it doesn't affect task completion | Fix when convenient |

---

## Step 3: Deep Dives by Heuristic

Use these focused prompts when you need to go deeper on specific heuristics that are most relevant to your product.

---

### H1 — Visibility of System Status
> "Evaluate system status visibility in this prototype. For every async operation, state change, or system event:
> - Does the user know the system received their input?
> - Does the user know how long to wait?
> - Does the user know when something is complete?
> - Does the user know when something has failed?
>
> Flag every moment where the system could be working and the user has no feedback.
> Flag every loading state that doesn't have a corresponding loading indicator.
>
> Prototype: [paste]"

---

### H3 — User Control and Freedom
> "Evaluate user control and freedom in this prototype.
> - At every step: can the user go back without losing progress?
> - At every destructive action: is there a confirmation step and an undo?
> - At every multi-step flow: can the user exit without completing?
> - Are there any dead ends — screens where the only option is to complete the flow?
>
> For each control/freedom violation: describe the stuck state and recommend the escape route.
>
> Prototype: [paste]"

---

### H4 — Consistency and Standards
> "Evaluate consistency across this prototype.
> - Are the same actions always triggered the same way? (Primary CTAs always same color/style?)
> - Are the same things always called the same thing? (List of inconsistent terminology)
> - Are similar screens structured consistently? (Same information in the same position?)
> - Does the product follow platform conventions? (iOS/Android/Web standards)
>
> List every inconsistency — including ones that seem minor. Consistency violations compound across a product.
>
> Prototype: [paste]"

---

### H5 — Error Prevention
> "Evaluate error prevention in this prototype. For every form, input, or action that could go wrong:
> - Does the design prevent the error before it happens? (Constraints, validation hints, confirmation steps)
> - Or does it only catch the error after it happens?
>
> For each error-prone interaction:
> 1. What's the error that can happen?
> 2. What does the current design do to prevent it?
> 3. What should it do instead?
>
> Prototype: [paste]"

---

### H8 — Aesthetic and Minimalist Design
> "Evaluate information density and visual noise in this prototype. For each screen:
> - What is the primary action the user needs to take?
> - How many competing elements are fighting for attention?
> - Is there any information that doesn't help the user accomplish the primary action?
> - Are there any design elements that exist for the system's benefit rather than the user's?
>
> For each screen: list what could be removed or deferred without affecting task completion.
>
> Prototype: [paste]"

---

### H9 — Error Recognition, Diagnosis, Recovery
> "Evaluate error message quality in this prototype. For every error state:
> 1. Does the message say what happened (not just 'Error')?
> 2. Does it explain why (if the user can understand and act on the reason)?
> 3. Does it tell the user what to do next?
> 4. Is the next action reachable from the error state?
> 5. Is the tone appropriate — not blaming, not dismissive?
>
> Apply the error message formula to each existing error: [What happened] + [Why] + [What to do]
>
> Prototype error states: [paste or describe]"

---

## Step 4: Generate the Fix List

Package findings into an actionable list for the prototype builder.

**Claude prompt:**
> "Generate a fix list from this heuristic evaluation. Format as a table the prototype builder can work through in order.
>
> | Priority | Screen | Problem | Heuristic | Fix | Effort |
> |---|---|---|---|---|---|
>
> Group by: Fix now (before testing) / Fix soon (before stakeholder review) / Fix later (before dev handoff)
>
> Evaluation findings: [paste prioritized violations]"

---

## Quick Heuristic Pass (15 minutes)

When there's no time for a full evaluation, run this abbreviated pass on the 3 heuristics that catch the most critical problems.

**Claude prompt:**
> "Run a 15-minute heuristic pass on this prototype — focus only on:
>
> 1. **System status (H1)** — can the user always tell what's happening?
> 2. **User control (H3)** — can the user always go back or escape?
> 3. **Error recovery (H9)** — do error messages help the user recover?
>
> These three catch the critical and major problems in most prototypes. Flag only Critical and Major violations.
>
> Prototype: [paste]"

---

## Quality Checklist

Before calling the heuristic review complete:
- [ ] All 10 heuristics evaluated — not just the ones that felt relevant
- [ ] Every violation has a severity rating — Critical / Major / Minor / Cosmetic
- [ ] Every violation has a specific, actionable fix recommendation
- [ ] Fix list is prioritized — builder knows what to fix before testing vs. before handoff
- [ ] Critical violations are fixed before usability testing begins
- [ ] Findings are documented — for the test script and for stakeholder review

---

## Phase Handoff Block

```
## Handoff: Prototype — Heuristic Review
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Review summary
- Heuristics evaluated: 10 of 10
- Screens reviewed: [N]
- Violations found: [N total] — Critical: [N] / Major: [N] / Minor: [N]
- Fixed before testing: [N]
- Deferred: [N]

### Critical violations (must fix before testing)
1. [Heuristic] — [Screen] — [Problem] — [Fix]
2. [Heuristic] — [Screen] — [Problem] — [Fix]

### Major violations (fix before stakeholder review)
1. [Heuristic] — [Screen] — [Problem] — [Fix]

### Patterns across the prototype
[Any heuristic that was violated multiple times — suggests a systemic issue]

### What the usability test should watch for
[The non-obvious problems this heuristic review couldn't catch — the ones that require observing real users]

---
*Fix Critical violations before testing.*
*Bring the Minor and Cosmetic list to the test debrief — users may surface the same issues.*
```
