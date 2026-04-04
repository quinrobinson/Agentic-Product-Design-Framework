---
name: stakeholder-presentation
phase: 05 — Validate
description: Reframe usability test findings for different stakeholder audiences — executive, engineering, and design team — each requiring a different emphasis, depth, and decision framing. Use after completing insight-report.md when findings need to be presented to audiences who weren't in the sessions. High Claude leverage for audience-specific reframing of the same content.
ai_leverage: high
claude_surface: chat
---

# Stakeholder Findings Presentation

Present the same test findings three different ways — because your PM, engineering lead, and design director each need different things from the same data.

## When to Use

- Usability test findings need to be presented to stakeholders who weren't in the sessions
- You need design iteration approved before you can start it
- Different stakeholders have different concerns that need to be addressed separately
- A findings readout is scheduled and the presentation doesn't exist yet
- Findings need to be communicated in a meeting, Slack message, or async document

---

## The Core Challenge

Usability test findings contain everything a designer needs to know. That's the problem — for everyone else.

A PM needs to know: what's blocking the product's success, and what's the decision?
An engineering lead needs to know: what needs to change, how specific is it, and how much work is it?
A design director needs to know: did the concept hold up, what's the evidence quality, and what's next?

The findings don't change. The emphasis, depth, and framing do.

---

## What Claude Needs to Start

1. **Complete findings report** — from `insight-report.md`
2. **Go/no-go decision** — the recommendation
3. **Audience** — who is being presented to and what they care about
4. **Format** — meeting presentation, Slack message, async doc, or executive summary
5. **Time available** — how long the presentation or read will take

---

## Audience Profiles

**Executive / Senior Leadership**
- Cares about: business impact, timeline, risk
- Doesn't need: methodology details, minor findings, design specifics
- Decision they need to make: approve iteration budget / timeline, or pivot
- Framing: "Here's what we learned, here's the risk, here's what we recommend"

**Product Manager**
- Cares about: feature viability, scope impact, user value, roadmap implications
- Needs: which assumptions were validated vs. invalidated, what changes are required
- Decision they need to make: proceed / iterate / reprioritize
- Framing: "Here's the data, here's what it means for our roadmap bet"

**Engineering Lead**
- Cares about: what specifically needs to change, feasibility, scope of rework
- Needs: specific UI elements, interaction patterns, copy changes — not general impressions
- Decision they need to make: estimate the rework, flag architectural implications
- Framing: "Here's exactly what users couldn't do and what needs to change"

**Design Team**
- Cares about: what failed and why, what worked and why, design direction
- Needs: mental model mismatches, detailed behavioral observations, direct quotes
- Decision they need to make: which direction to iterate in
- Framing: "Here's what we observed, here's what it tells us about the design"

---

## Step 1: Executive / Leadership Version

**Claude prompt:**
> "Reframe these usability test findings for a senior leadership audience. They have 5 minutes.
>
> Format: [meeting slide outline / one-page document / Slack message]
>
> Structure:
> **The test (1 sentence):** What we tested and with whom
> **The key finding (2 sentences):** The most important thing we learned
> **The business implication (1–2 sentences):** What this means for the product's success or timeline
> **The decision (1 sentence):** What we recommend and why
> **What we need from this room (1 sentence):** The specific approval or input required
>
> Do not include: methodology, minor findings, individual participant observations, design specifics
>
> Findings: [paste]
> Decision: [paste]"

---

## Step 2: Product Manager Version

**Claude prompt:**
> "Reframe these usability test findings for the product manager. Format as a 10-minute readout or async document.
>
> Structure:
> **What we tested:** [prototype + scope + the 3 prototype questions]
> **What we set out to validate:** [the key assumptions behind this feature]
> **What we learned — per assumption:**
>   - Assumption [N]: [Validated / Invalidated / Inconclusive] — [evidence]
> **Roadmap implications:** [What this means for current sprint / release plan]
> **Scope impact of changes:** [High / Medium / Low — with brief rationale]
> **Recommendation:** [Proceed / Iterate / Reprioritize]
> **Minimum changes required to proceed:** [What must change before shipping]
>
> Findings: [paste]
> Prototype questions / assumptions: [paste]"

---

## Step 3: Engineering Lead Version

**Claude prompt:**
> "Reframe these usability test findings for the engineering lead. Be specific and technical — name UI elements, interactions, and copy by their exact names.
>
> Format: structured list — no narrative, no methodology
>
> **Critical changes required (blocks ship):**
> For each:
> - Element: [specific component, screen, or interaction]
> - Current behavior: [what it does now]
> - Required behavior: [what it needs to do]
> - User impact: [what fails without this change]
>
> **Major changes needed (significant friction):**
> [Same format]
>
> **Minor changes (polish):**
> [List — shorter format]
>
> **What doesn't need to change:**
> [Specific elements that tested well — to prevent unnecessary churn]
>
> **Questions for engineering:**
> [Anything from the findings that has architectural implications worth discussing]
>
> Findings: [paste — include specific UI element names from the prototype]"

---

## Step 4: Design Team Version

**Claude prompt:**
> "Reframe these usability test findings for the design team who will be doing the iteration. They need the full picture — what worked, what failed, and the mental model insights that explain why.
>
> Format: full findings debrief document
>
> **Test context:** [prototype + tasks + participants]
>
> **Mental model findings:** [How users conceptualized the product — vocabulary they used, expectations they brought, analogies they referenced]
>
> **Critical failures — with behavioral detail:**
> For each:
> - What we observed (specific behavior — not interpretation)
> - Why it happened (mental model mismatch, IA problem, copy failure, etc.)
> - Direct quotes
> - What the design should do differently
>
> **What worked — and why it worked:**
> [Be as specific as the failures — explain the design decision that produced the success]
>
> **Surprising observations:**
> [Things users did that we didn't predict — implications for the next iteration]
>
> **Open questions the test raised:**
> [Things we still don't know — inputs for the next round of testing]
>
> Findings: [paste]
> Session notes with mental model observations: [paste if available]"

---

## Presentation Formats by Situation

| Situation | Format | Length |
|---|---|---|
| Scheduled readout meeting | Slide outline + talking points | 15–30 min |
| Async stakeholder update | Written document | 1–2 pages |
| Quick Slack update | Bulleted summary | 5–8 bullets |
| Design team debrief | Full findings document | 3–5 pages |
| Executive briefing | One-page summary | 1 page |

**Claude prompt for Slack format:**
> "Convert these findings to a Slack message for [audience]. 5–8 bullets maximum.
>
> Lead with: the go/no-go decision
> Include: top 2–3 findings with participant counts
> End with: the one thing you need from this audience
>
> Findings: [paste]
> Decision: [paste]"

---

## Quality Checklist

Before presenting to each audience:
- [ ] Executive version contains no methodology details or minor findings
- [ ] Engineering version names specific components and elements — not design concepts
- [ ] Design version includes mental model observations and direct quotes
- [ ] Every version states the go/no-go decision explicitly — not implied
- [ ] Every version ends with a specific ask — what you need from this audience
- [ ] Participant anonymity is maintained — no names, only codes

---

## Phase Handoff Block

```
## Handoff: Validate — Stakeholder Presentation
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Presentations produced
- [ ] Executive / leadership (1 page / 5 min)
- [ ] Product manager (10 min readout)
- [ ] Engineering lead (change list)
- [ ] Design team (full debrief)

### Go / No-Go decision communicated to
- [ ] [Stakeholder group] — [date] — [format]
- [ ] [Stakeholder group] — [date] — [format]

### Approvals received
- [ ] Iteration approved: Yes / No / Pending
- [ ] Timeline: [next milestone]
- [ ] Open questions from stakeholders: [list]

### What's next
[Next step — iteration brief, next test, or Deliver phase]

---
*Document stakeholder questions and objections — they inform the iteration brief.*
*Share findings before starting iteration to prevent rework.*
```
