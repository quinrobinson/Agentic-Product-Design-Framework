---
name: usability-findings-synthesis
phase: 05 — Validate
description: Synthesize raw usability test session notes into structured findings — themes, frequency, severity, and specific design recommendations — across 5+ sessions. The highest-value post-testing activity in Validate. Use immediately after completing usability test sessions, before writing the findings report. Same pattern-recognition leverage as research synthesis in Discover, applied to usability observations. Outputs feed into insight-report.md and iteration-brief.md.
ai_leverage: very_high
claude_surface: chat
---

# Usability Findings Synthesis

Turn 5 sessions of raw observation notes into a structured, prioritized findings set — in hours instead of days.

## When to Use

- You've completed 5+ usability test sessions and have raw notes to process
- The team needs to move from "what we observed" to "what it means and what to fix"
- You need to prioritize findings before a design iteration or stakeholder presentation
- Multiple team members observed different sessions and notes need to be unified
- Post-testing debrief is needed quickly and synthesis time is constrained

---

## Why This Takes So Long — and Why AI Changes It

Manually synthesizing 5 usability sessions means:
- Reading through 5 sets of notes (15–25 min each)
- Identifying patterns across sessions (1–2 hours)
- Writing up findings with evidence (1–2 hours)
- Prioritizing by severity (30–60 min)
- Total: **4–8 hours** for a complete synthesis

With Claude and structured session notes: **1–2 hours** — because the pattern-matching across sessions is exactly what LLMs do well at scale.

The key is structured input. Raw stream-of-consciousness notes produce mediocre synthesis. Notes organized per session in a consistent format produce precise, citation-supported findings.

---

## What Claude Needs to Start

1. **Session notes** — one set per participant, in any format (raw observations, timestamps, quotes)
2. **Task structure** — what tasks participants attempted and what they were trying to accomplish
3. **Prototype questions** — the 3 questions from `prototype-scoping.md` this test was designed to answer
4. **Pass/fail criteria** — what you defined as passing before testing

---

## Step 1: Structure Each Session Before Synthesizing

Before synthesizing across sessions, structure each session consistently. This takes 10–15 minutes per session and dramatically improves cross-session synthesis quality.

**Claude prompt (run once per session):**
> "Structure these raw session notes into a consistent format.
>
> Participant: [code name or number — never real names]
> Session length: [N minutes]
> Tasks attempted: [list]
>
> For each task:
> - **Completion:** Completed without help / Completed with prompting / Failed
> - **Time on task:** [approximate]
> - **Key observations:** [specific behaviors — what they did, not what they said]
> - **Direct quotes:** [verbatim — preserve exact wording]
> - **Friction points:** [where they hesitated, went back, expressed confusion]
> - **Unexpected behaviors:** [anything that surprised the observer]
>
> After tasks:
> - **Overall impression quote:** [their most revealing debrief comment]
> - **Mental model notes:** [how they thought about the product — vocabulary they used]
>
> Raw notes: [paste]"

---

## Step 2: Cross-Session Synthesis

Once all sessions are structured, synthesize across all participants.

**Claude prompt:**
> "Synthesize these [N] usability test sessions into structured findings.
>
> Tasks tested:
> [List tasks with prototype question each corresponds to]
>
> Sessions:
> [Paste all structured session notes — one per participant]
>
> For each prototype question, generate:
>
> **Prototype Question [N]: [The question]**
>
> Findings:
> - What did users do? (observable behaviors, not interpretations)
> - Where did they succeed? (frequency: N of N participants)
> - Where did they fail or struggle? (frequency: N of N participants)
> - What did they say? (direct quotes with participant codes)
> - What surprised us? (behaviors we didn't predict)
>
> **Answer to prototype question:** [Yes / No / Partial — with evidence]
>
> Then, across all questions, list every usability issue observed:
> - Issue description
> - Frequency: [N of N participants affected]
> - Evidence: [participant codes + quotes]
> - Which task it appeared in"

---

## Step 3: Severity Rating

Rate every finding by severity — this determines what gets fixed before the next iteration.

**Severity scale:**

| Level | Definition | Action |
|---|---|---|
| **Critical** | Prevents task completion — participant failed or would abandon | Fix before any further testing |
| **Major** | Causes significant frustration or error, but participant eventually succeeds | Fix before next iteration |
| **Minor** | Noticeable friction but low impact on completion or satisfaction | Fix in next design cycle |
| **Cosmetic** | Preference or polish issue — doesn't affect usability | Fix when convenient |

**Claude prompt:**
> "Rate each usability issue by severity using this scale:
> - Critical: prevents task completion or would cause abandonment
> - Major: causes significant friction or error but user recovers
> - Minor: noticeable but low impact on completion
> - Cosmetic: preference issue only
>
> For each issue, also rate:
> - **Frequency:** how many of [N] participants encountered it
> - **Impact:** what it means for the prototype question it's linked to
>
> Then rank all issues by: Severity first, then Frequency.
> Produce a prioritized fix list.
>
> Issues: [paste all issues from synthesis]"

---

## Step 4: Generate the Findings Summary

**Claude prompt:**
> "Generate a findings summary from this usability test synthesis. Structure it as:
>
> ## Test Summary
> - Prototype tested: [name]
> - Sessions: [N participants]
> - Tasks: [N tasks]
> - Date range: [dates]
>
> ## Prototype Questions — Answers
> For each of the 3 prototype questions:
> - Question: [restate]
> - Answer: [Yes / No / Partial]
> - Evidence: [key supporting observations + participant count]
> - Confidence: [High / Medium / Low — based on consistency across sessions]
>
> ## Top Findings (Critical + Major only)
> For each finding:
> - Finding: [specific, observable — not interpretive]
> - Frequency: [N of N participants]
> - Severity: [Critical / Major]
> - Representative quote: [one verbatim quote from a participant]
> - Design implication: [what needs to change]
>
> ## Patterns Worth Noting
> [Unexpected behaviors or consistent mental model mismatches that didn't produce critical failures but inform future design]
>
> ## What Passed
> [What worked well — be specific. This is as important as what failed.]
>
> Synthesis: [paste]
> Prototype questions: [paste]"

---

## Step 5: Go / No-Go Assessment

Map findings to the pass/fail criteria defined in `prototype-scoping.md`.

**Claude prompt:**
> "Assess this prototype test against the predefined pass/fail criteria.
>
> Pass/fail criteria (defined before testing):
> [Paste from prototype-scoping.md handoff]
>
> Test findings:
> [Paste synthesis summary]
>
> For each criterion:
> - **Criterion:** [restate]
> - **Result:** Pass / Fail / Partial
> - **Evidence:** [specific observations that support the result]
>
> **Overall recommendation:** Proceed to hi-fi / Iterate and re-test / Return to ideation
>
> **Rationale:** [1–2 sentences — which findings drive this recommendation]
>
> **If iterating:** What are the minimum changes needed before the next test?
> **If returning to ideation:** What fundamental assumption failed?"

---

## Synthesis Quality Checklist

Before writing the findings report:
- [ ] Every finding is grounded in observed behavior — not the facilitator's interpretation
- [ ] Every critical and major finding has a participant count and at least one direct quote
- [ ] Prototype questions have clear Yes/No/Partial answers — not just "it was mixed"
- [ ] The pass/fail criteria have been applied — not just "here are things we learned"
- [ ] What worked is documented alongside what failed — equal importance
- [ ] Severity ratings are consistent — Critical means task failure, not "bad"
- [ ] Findings are actionable — each one implies a specific design change

---

## Phase Handoff Block

```
## Handoff: Validate — Usability Findings Synthesis
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Test summary
- Prototype: [name]
- Sessions: [N participants] — [dates]
- Tasks: [N] — [list]

### Prototype questions answered
1. [Question] → [Yes / No / Partial] — Confidence: [High/Medium/Low]
2. [Question] → [Yes / No / Partial] — Confidence: [High/Medium/Low]
3. [Question] → [Yes / No / Partial] — Confidence: [High/Medium/Low]

### Go / No-Go
**Decision:** [Proceed / Iterate / Return to ideation]
**Rationale:** [One sentence]

### Critical findings (must fix)
1. [Finding] — [N/N participants] — [design implication]
2. [Finding] — [N/N participants] — [design implication]

### Major findings (fix before next test)
1. [Finding] — [N/N participants] — [design implication]

### What passed (don't change these)
- [What worked] — [N/N participants succeeded]

### Unexpected patterns
- [Something observed that wasn't predicted — implications for design]

### What goes into the insight report
[Which findings need the most stakeholder attention]

---
*Pass this to insight-report.md to generate the full findings document.*
*Pass critical + major findings to iteration-brief.md if iterating.*
```
