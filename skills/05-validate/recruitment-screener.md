---
name: recruitment-screener
phase: 05 — Validate
description: Generate a participant recruitment screener — criteria, questions, and disqualifiers — from a persona definition. Use before any usability testing to ensure participants match the user being designed for. A well-designed screener takes 2–4 hours manually; Claude generates a complete first draft in minutes. Depends on persona-creation.md outputs.
ai_leverage: high
claude_surface: chat
---

# Recruitment Screener

Define who qualifies to test your prototype — and write the screening questions that find them accurately.

## When to Use

- Before scheduling any usability test sessions
- When using a recruitment agency and need to provide screener criteria
- When running unmoderated tests on a platform (Maze, UserZoom, Lookback) that requires participant filters
- When recruiting internally and need to define who counts as a valid participant
- When a previous test used the wrong participants and you need tighter criteria

---

## Why the Screener Matters

Testing with the wrong participants is worse than not testing at all — because wrong-participant findings produce false confidence or misdirected iteration. A user who doesn't have the problem you're solving will complete tasks your actual users can't. A user who's over-qualified won't reveal the friction points beginners face.

The screener's job is not to find the most agreeable participants. It's to find the most representative ones — including the ones who will struggle.

---

## What Claude Needs to Start

1. **Persona** — from `persona-creation.md` — behavioral segment, goals, context, pain points
2. **Product context** — what the product does and who it's for
3. **Test focus** — which tasks or scenarios will be tested (affects which criteria matter most)
4. **Disqualifiers** — anyone who should be excluded (competitors, researchers, employees)
5. **Sample size target** — typically 5 for qualitative, more for quantitative

---

## Step 1: Define Inclusion and Exclusion Criteria

Before writing screener questions, define the criteria in plain language — then translate them into questions.

**Claude prompt:**
> "Generate recruitment criteria for usability testing of this product.
>
> Product: [description]
> Persona: [paste persona — including behavioral segment, context, goals, current tools]
> Test focus: [which tasks or scenarios will be tested]
> Target participants: [N — typical is 5 for qualitative usability testing]
>
> Produce:
>
> **Inclusion criteria (all must be true):**
> - [Behavioral or contextual — not demographic unless directly relevant]
> - [Experience level with the problem domain]
> - [Frequency of the behavior being studied]
>
> **Nice-to-have criteria (varied across the participant set):**
> - [Diversity factors that would make the set more representative]
>
> **Exclusion criteria (any one disqualifies):**
> - [Competitor employees or researchers who study this area]
> - [Over-familiar users who won't represent real adoption patterns]
> - [Internal team members]
>
> For each criterion: explain WHY it matters for this specific test."

---

## Step 2: Write the Screener Questions

Screener questions must be phrased so participants can't guess the "right" answer. Every question that signals what you're looking for produces biased responses.

**Claude prompt:**
> "Write a participant recruitment screener for this usability test. Convert the criteria below into survey questions that don't reveal what we're looking for.
>
> Inclusion criteria: [paste]
> Exclusion criteria: [paste]
>
> For each screener question:
> - Use multiple choice where possible — open-ended questions are hard to screen at scale
> - Never reveal which answer qualifies
> - Include disqualifying options in every list — don't make the right answer obvious
> - For behavioral frequency questions, use ranges rather than asking about specific numbers
>
> Format each question as:
> **Q[N]: [Question text]**
> Options: [A / B / C / D]
> Qualifies if: [A, C] — (INTERNAL NOTE — not shown to participant)
> Disqualifies if: [B, D] — (INTERNAL NOTE)
>
> Criteria to screen for:
> [paste inclusion and exclusion criteria]"

---

### Screener Question Principles

**Never ask directly about experience — ask about behavior.**
- Bad: "Are you experienced with UX research tools?"
- Good: "In the past month, approximately how often have you synthesized user research notes?"

**Obscure the disqualifying answers.**
- Bad: "Do you work at [Competitor]? Yes / No"
- Good: "Which of the following best describes your primary employer?" [List including competitors mixed with valid options]

**Use ranges, not absolutes.**
- Bad: "Do you conduct user research?"
- Good: "How often do you conduct or participate in user research activities?" [Daily / Weekly / Monthly / A few times a year / Rarely or never]

**Test for the pain point, not the persona label.**
- Bad: "Are you a UX designer?"
- Good: "Which of these best describes your primary responsibilities?" [List that includes but doesn't exclusively target UX designers]

---

## Step 3: Structure the Complete Screener

**Claude prompt:**
> "Assemble the complete recruitment screener document, including intro, questions, and closing.
>
> Product name: [visible name — something neutral if blind screener]
> Study description: [what to tell participants — keep vague to avoid bias]
> Session details: [length, format, compensation, dates]
>
> Structure:
>
> **Intro paragraph (shown to all respondents):**
> [Study name] is conducting research to understand how [broad role description] [broad activity]. We're looking for participants for a [N-minute] online/in-person session.
>
> **Screener questions:** [all questions]
>
> **Qualified close:** 'Thank you! You may qualify for this study. We'll contact you within [timeframe] to schedule a session.'
>
> **Disqualified close:** 'Thank you for your time. Unfortunately, you don't match the profile for this study, but we may reach out for future opportunities.'
>
> Questions: [paste from Step 2]
> Session details: [paste]"

---

## Complete Screener Template

```
# Recruitment Screener: [Project Name — Internal Only]
### For: [Persona segment] | Sessions: [N] | Date: [TARGET DATE]

---

## Internal criteria (not shared with participants)

**Qualifies if all true:**
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

**Disqualifies if any true:**
- [Disqualifier 1]
- [Disqualifier 2]

---

## Participant-facing screener

**Introduction:**
[Study name] is conducting research to understand how [broad description]. We're looking for participants for a [N]-minute [remote/in-person] session. Participants will receive [compensation].

**Q1: [Opening behavioral question — sets context, filters out obvious mismatches]**
Options: [A / B / C / D / E]
→ Qualifies: [A, B, C] | Disqualifies: [D, E]

**Q2: [Frequency question — confirms the behavior is active]**
Options: [Daily / Weekly / Monthly / A few times a year / Never]
→ Qualifies: [Daily / Weekly] | Disqualifies: [Never]

**Q3: [Tool or context question — confirms the environment]**
Options: [List]
→ Qualifies: [options] | Disqualifies: [options]

**Q4: [Experience level question — without naming a skill level]**
Options: [List]
→ Qualifies: [mid-range] | Disqualifies: [extremes if appropriate]

**Q5: [Competitor / conflict of interest filter]**
"Which of the following best describes your employer's primary business?"
Options: [Technology / Healthcare / Finance / Education / Government / Other]
→ Disqualifies: [specific competitor categories — flag for manual review]

**Q6: [Availability confirmation]**
"Are you available for a [N]-minute online session between [DATE RANGE]?"
Options: [Yes / No]
→ Disqualifies: No

**Q7 (optional): [Diversity / representativeness factor]**
[Question that helps balance the participant set — not a qualifier or disqualifier]

---

**Qualified close:**
Thank you! Based on your responses, you may be a great fit for this study. A member of our team will contact you within [N] business days to confirm your participation and schedule your session.

**Disqualified close:**
Thank you for your time. Unfortunately, you don't match the profile we need for this particular study. We may reach out for future research opportunities.
```

---

## Quality Checklist

Before distributing the screener:
- [ ] No question reveals which answer qualifies
- [ ] Every behavioral criterion has a corresponding question
- [ ] Disqualifier questions include plausible non-disqualifying options
- [ ] Screener length is appropriate — 5–8 questions maximum for cold recruitment
- [ ] Participant-facing language is neutral — doesn't hint at what the study is about
- [ ] Qualified and disqualified closes are distinct and professional
- [ ] Session details (compensation, length, format) are stated clearly
- [ ] Manual review process exists for edge cases

---

## Phase Handoff Block

```
## Handoff: Validate — Recruitment Screener
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Screener summary
- Target persona segment: [description]
- Target participants: [N]
- Session format: [moderated remote / in-person / unmoderated]
- Session length: [N minutes]
- Compensation: [amount/format]
- Target test dates: [range]

### Qualification criteria (summary)
Must be true:
1. [Criterion]
2. [Criterion]
Must not be true:
1. [Disqualifier]

### Recruitment channels
- [Where screener will be distributed — Respondent.io, internal list, agency, etc.]
- [Expected response rate and timeline to fill N sessions]

### Manual review flags
- [Any ambiguous responses that need human judgment]

---
*Screener distributes before test script is finalized.*
*Allow [N] days between screener close and first session.*
```
