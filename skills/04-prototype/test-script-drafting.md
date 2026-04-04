---
name: test-script-drafting
phase: 04 — Prototype
description: Write the usability test script — tasks, scenarios, probing questions, and observation guides — that transforms a prototype into a structured learning session. Use at the end of Prototype to bridge into Validate. Depends on outputs from prototype-scoping.md (the 3 prototype questions) and heuristic-review.md (remaining open questions). Outputs feed directly into Validate phase usability testing.
ai_leverage: high
claude_surface: chat
---

# Test Script Drafting

Write the usability test script before the prototype is done — so testing starts the moment the prototype is ready.

## When to Use

- At the end of Prototype, before usability sessions begin
- When the prototype is ready but no one has written the tasks yet
- When previous test sessions produced vague or unusable feedback
- When testing with a facilitator who needs a structured guide to follow
- When the team needs to align on what to learn before they learn it

---

## What a Test Script Is — and Why It Matters

**A test script is:** A structured guide for the test facilitator — tasks, scenarios, probing questions, and observation cues — that makes a usability session produce consistent, comparable, actionable data.

**Without a test script:** Sessions drift. Facilitators ask leading questions. Different sessions test different things. It's impossible to compare results. The "learning" is a collection of impressions, not evidence.

**A good test script:**
- Gives every participant the same starting conditions
- Asks participants to do, not evaluate
- Probes for reasoning, not just behavior
- Generates observations that answer the prototype questions

The script is written for the facilitator — but the structure it creates protects the data.

---

## What Claude Needs to Start

1. **Prototype questions** — the 3 questions from `prototype-scoping.md`
2. **Prototype scope** — which screens and flows are testable
3. **Persona** — who is being tested and what they should know coming in
4. **Session length** — how long each test session is (typically 45–60 minutes)
5. **Heuristic review findings** — the open questions the heuristic review flagged

---

## Test Script Structure

Every usability test script has the same five sections:

1. **Introduction** — sets up the session, explains the rules, creates psychological safety
2. **Warm-up questions** — learns about the participant's context and mental model before they see the prototype
3. **Tasks** — the core of the session; what participants do and what you observe
4. **Probing questions** — follow-up questions after tasks to understand reasoning
5. **Debrief** — overall impressions, things they'd change, questions they have

---

## Step 1: Write the Introduction

The introduction sets the conditions for good data. It explains what's being tested, creates psychological safety, and establishes that the prototype is being evaluated — not the participant.

**Claude prompt:**
> "Write a usability test introduction for this session.
>
> Include:
> 1. **Purpose statement** — what we're testing (the prototype, not the participant)
> 2. **Think-aloud instructions** — ask participants to narrate their thinking
> 3. **'We didn't build this' framing** — separates the facilitator from the design
> 4. **No wrong answers** — explicitly removes the fear of failure
> 5. **Recording consent** — request to record (if applicable)
> 6. **Time commitment** — how long the session will take
> 7. **Questions OK?** — tell them you'll answer most questions after, not during
>
> Session length: [N minutes]
> Recording: [Yes / No]
> Product context: [what they're being shown]"

---

### Introduction Template

```
Thanks for joining today — I really appreciate your time.

My name is [Name], and I'm a [designer/researcher] working on [product area].
Today we're going to look at an early prototype of [brief description].
I want to be clear upfront: we're testing the design, not you. There are no
right or wrong answers — if something doesn't work, that's useful information
for us, not a problem with you.

This prototype is rough in places — some things are clickable, some aren't.
If something doesn't work the way you expect, just tell me what you expected
to happen.

As you work through the tasks, I'd love for you to think out loud — narrate
what you're looking at, what you're thinking, and what you're about to do.
It can feel a bit strange at first, but it's the most helpful thing you can do.

I'll mostly be quiet and let you explore. I might ask you questions, but I'll
try not to answer any of yours until the end — not because I'm being difficult,
but because your first instincts are the data we're looking for.

[If recording:] Do you mind if I record this session? The recording is just for
our internal team — it won't be shared publicly. [Wait for consent.]

Any questions before we start?
```

---

## Step 2: Write Warm-Up Questions

Warm-up questions learn about the participant's existing mental model and context before they see the prototype. This data makes the task observations interpretable.

**Claude prompt:**
> "Write 3–5 warm-up questions for a usability test with [persona description].
>
> Questions should:
> - Learn about their current behavior and tools (not their opinions about the prototype they haven't seen yet)
> - Surface their mental model of the problem space
> - Take no more than 5–8 minutes total
>
> Avoid: Questions that prime them for what they're about to see.
> Include: Questions about their current workflow, pain points, and expectations.
>
> Persona: [paste]
> Product domain: [what problem space this is]
> What we're curious about their mental model of: [specific aspect]"

---

### Warm-Up Question Principles

**Ask about past behavior, not future intention.**
- Bad: "Would you use a tool that synthesized your research automatically?"
- Good: "Walk me through how you currently go from raw research notes to a deliverable."

**Ask about specifics, not generalities.**
- Bad: "What tools do you use for research?"
- Good: "Last time you completed a research synthesis — what did you do first?"

**Listen for vocabulary.** The words they use to describe the problem will tell you whether your copy matches their mental model.

---

## Step 3: Write the Tasks

Tasks are the core of the script. Each task corresponds to one of the 3 prototype questions — and is written as a realistic scenario, not a directive.

**Claude prompt:**
> "Write [N] usability test tasks for this prototype. Each task should correspond to one of the 3 prototype questions.
>
> For each task:
> 1. **Scenario** — realistic context that explains why the user would do this task (not 'Click on X' — set up the situation)
> 2. **Task statement** — what you're asking them to do (use their language, not ours)
> 3. **Starting point** — which screen they begin on
> 4. **Success criteria** — what task completion looks like (not opinion — observable behavior)
> 5. **What to observe** — the specific moments that answer the prototype question
> 6. **Probing prompts** — 2–3 follow-up questions for during or after the task
>
> Prototype questions: [paste]
> Prototype scope: [list of testable screens]
> Persona: [paste]"

---

### Task Writing Principles

**Never name what you want them to find.**
- Bad: "Find the 'Export' button and use it to export your research"
- Good: "You've just finished a research session and need to share the findings with your PM. Show me what you'd do."

**Give them a realistic motivation.**
- Bad: "Complete the onboarding flow"
- Good: "You've just signed up and you have a call with a stakeholder in 30 minutes. Get yourself set up."

**Keep it open-ended.** The task tells them what to accomplish — not how to accomplish it.

**One task per prototype question.** Two questions per task produces uninterpretable data.

---

### Task Template

```
**Task [N]: [Short title for facilitator reference]**

**Scenario:** [2–3 sentences setting up the realistic situation]
"Imagine you've just [context]. You need to [goal]."

**Starting screen:** [Screen name]

**What to observe:**
- [ ] [Specific behavior that answers the prototype question]
- [ ] [Hesitation point to watch for]
- [ ] [The moment the critical assumption is tested]

**Probing prompts (use only if participant gets stuck or is silent):**
- "What are you looking for right now?"
- "What would you expect to happen if you [action]?"
- "What's going through your mind?"

**Task complete when:** [Observable behavior — not "when they say they're done"]

**If they get stuck for more than 2 minutes:** [Prompt or rescue instruction]
```

---

## Step 4: Write Probing Questions

Probing questions get at the reasoning behind observed behavior. Run them after tasks, not during — during-task questions interrupt the natural flow.

**Claude prompt:**
> "Write 8–10 probing questions for this usability test. Questions should surface:
>
> 1. **Reasoning behind decisions** — why did they do what they did?
> 2. **Expectations that were violated** — what did they expect to happen?
> 3. **Copy comprehension** — did they understand what they read?
> 4. **Trust signals** — at what moments did they feel confident or uncertain?
> 5. **Comparison to current behavior** — how does this compare to how they do it today?
>
> Format: one question per line, with the prototype question it corresponds to in brackets.
>
> Prototype questions: [paste]
> Specific moments of interest from heuristic review: [paste]"

---

### Probing Question Principles

**Ask about what happened, not what they'd prefer.**
- Weak: "What would make this better?"
- Strong: "You paused at that step — what were you expecting to see?"

**Follow behavior, not opinion.**
- Weak: "Did you find that easy to use?"
- Strong: "I noticed you went back twice on that screen — what were you looking for?"

**Use their language, not yours.**
- Weak: "Did the 'Synthesize' CTA make sense?"
- Strong: "When you saw that button, what did you expect would happen if you tapped it?"

---

## Step 5: Write the Debrief

The debrief captures overall impressions after all tasks are complete.

**Claude prompt:**
> "Write a 5-minute debrief section for this usability test.
>
> Include:
> 1. Overall impression question (open-ended, last impression)
> 2. Comparison to current behavior (does this change how they'd work?)
> 3. Top 3 things that worked well (what to preserve)
> 4. Top 3 things that need work (what to fix — but asked about the design, not the participant's preferences)
> 5. Anything they expected to see that they didn't
> 6. Open question slot (anything else they want to tell us)
>
> Product context: [what this is]
> What we most want to know at the end: [specific open question]"

---

## Observation Guide

The observation guide is for note-takers — it focuses their attention on the moments that matter.

**Claude prompt:**
> "Write an observation guide for this usability test. The guide helps note-takers capture the right data during sessions.
>
> For each prototype question, create a section with:
> - The question being tested
> - The specific moment or screen where it gets answered
> - What 'passing' behavior looks like (observable)
> - What 'failing' behavior looks like (observable)
> - Space for verbatim quotes
>
> Also include:
> - A note-taking code legend (e.g. ✓ = completes task, ? = confused, ! = insight, ✗ = fails task)
> - A column for timing (how long each task takes)
>
> Prototype questions: [paste]
> Task structure: [paste]"

---

## Quality Checklist

Before the first test session:
- [ ] Introduction establishes psychological safety — "testing the design, not you"
- [ ] Warm-up questions are about past behavior, not future preferences
- [ ] Every task corresponds to a prototype question — nothing is "just good to know"
- [ ] Task language uses the user's vocabulary — not the product's
- [ ] Tasks don't name what they're looking for
- [ ] Probing questions are about reasoning, not preference
- [ ] Observation guide exists for note-takers
- [ ] Pass/fail criteria from `prototype-scoping.md` are in the facilitator's guide
- [ ] Script has been piloted internally once — at least one dry run before real sessions

---

## Phase Handoff Block

```
## Handoff: Prototype → Validate
### From: Test Script Drafting
### Project: [PROJECT NAME]
### Date: [DATE]

---

### The prototype
**Concept:** [Name + one-liner]
**Fidelity:** [Lo-fi / Mid-fi / Hi-fi]
**Screens:** [N in scope]

### The test
**Session length:** [N minutes]
**Participants needed:** [N — recommend 5 for qualitative]
**Recruitment criteria:** [Who to test with]

### 3 questions this test must answer
1. [Question] — observed on: [screen/task]
2. [Question] — observed on: [screen/task]
3. [Question] — observed on: [screen/task]

### Pass/fail criteria
**Proceed if:** [Specific threshold]
**Iterate if:** [Specific failure signal]
**Return to ideation if:** [Fundamental concept failure signal]

### What to watch most carefully
[The 2–3 specific moments in the prototype where the most important questions get answered]

### Artifacts to hand off to Validate
- [ ] Prototype (link or file)
- [ ] Test script
- [ ] Observation guide
- [ ] Recruitment screener (if not yet written)
- [ ] Pass/fail criteria document

---
*This is the complete Prototype → Validate handoff.*
*Validate begins with usability testing using this script.*
*Do not modify the script after testing begins — consistency across sessions is the data.*
```
