---
name: ux-copy-writing
phase: 04 — Prototype
description: Generate all interface text for a product or feature — labels, CTAs, error messages, empty states, onboarding copy, tooltips, confirmations, and microcopy — grounded in the product's voice and user context. The highest-value single AI activity in the design process. Use whenever a prototype or feature needs real copy before testing, when placeholder text is blocking stakeholder feedback, or when inconsistent copy is creating usability friction. Depends on outputs from storyboarding.md or prototype-scoping.md.
ai_leverage: very_high
claude_surface: chat
---

# UX Copy Writing

Write all interface text — completely, consistently, and grounded in how your users actually talk — before a single user sees the prototype.

## When to Use

- A prototype needs real copy before usability testing
- Placeholder text is preventing stakeholders from giving meaningful feedback
- Copy is inconsistent across screens and creating usability confusion
- You need a complete error state library before dev handoff
- Onboarding or empty states need to be written and haven't been prioritized

---

## Why UX Copy Is the Most Underinvested Prototype Activity

Most design teams treat copy as something that gets filled in later — after the design is approved, before development. This creates three compounding problems:

**Testing with placeholder copy produces unreliable results.** Users react to words. "Submit" and "Get started" produce different behavior. Lorem ipsum tells you nothing about whether your labels communicate correctly.

**Copy reveals design gaps.** When you try to write a confirmation message for a flow, you often discover the flow is ambiguous. Writing forces clarity that wireframing defers.

**Late copy means late changes.** If copy is written after design approval, every copy change potentially triggers layout changes. Writing copy during prototyping is always cheaper than writing it after.

Claude's leverage here is exceptional: a complete UX copy set for a mid-sized feature — all screens, all states, all messages — takes a designer 2–3 days manually and is almost always incomplete. With a well-briefed Claude session, it takes 20–40 minutes and is systematically complete.

---

## What Claude Needs to Start

1. **Product context** — what it does, for whom, in what context
2. **Voice and tone** — 3–5 adjectives describing the product's personality, plus examples of what it sounds like and what it doesn't
3. **Feature or flow scope** — which screens or user journey to write copy for
4. **User context** — who they are and what emotional state they're in when they hit each screen
5. **Storyboard or prototype brief** — the flow from `storyboarding.md` or `prototype-scoping.md`

---

## Step 1: Define Voice and Tone

Before writing a word of copy, lock the voice. Copy written without a voice brief produces generic, corporate-sounding text.

**Claude prompt:**
> "Define the voice and tone for this product based on the context below.
>
> Produce:
> 1. **Voice** — 4 adjectives that describe the product's personality (not aspirational — actual)
> 2. **Tone shifts** — how the tone changes in different emotional moments (error states, success, onboarding vs. returning user)
> 3. **We sound like:** [3 example phrases] / **We don't sound like:** [3 example phrases]
> 4. **Words we use** / **Words we avoid**
> 5. **Reading level target** — what complexity level fits this user and context?
>
> Product: [description]
> Primary user: [persona — context, goals, emotional state when using this product]
> Brand context: [any existing voice guidelines, comparable products]"

---

### Voice and Tone Reference Card

```
# Voice + Tone: [Product Name]

## Voice (consistent — who we are)
[Adjective 1] — [one sentence explaining what this means for copy]
[Adjective 2] — [one sentence]
[Adjective 3] — [one sentence]
[Adjective 4] — [one sentence]

## Tone shifts (situational — how we adjust)
| Moment | Tone | Example |
|---|---|---|
| Onboarding (first use) | [tone] | [example phrase] |
| Mid-flow (in the zone) | [tone] | [example phrase] |
| Error (something went wrong) | [tone] | [example phrase] |
| Success (task complete) | [tone] | [example phrase] |
| Empty state (nothing yet) | [tone] | [example phrase] |

## We sound like / We don't sound like
✓ [Example phrase] ✗ [What we're replacing / avoiding]
✓ [Example phrase] ✗ [What we're replacing / avoiding]
✓ [Example phrase] ✗ [What we're replacing / avoiding]

## Words we use / Words we avoid
✓ [Word/phrase] — [why] | ✗ [Word/phrase] — [why]
```

---

## Step 2: Write the Core Flow Copy

Generate copy for every screen in the primary user flow first — before edge cases and error states.

**Claude prompt:**
> "Write complete UX copy for every screen in this flow. For each screen:
> - **Headline** — the primary message (what this screen is doing for the user)
> - **Body** — supporting context if needed (not always required — challenge every word)
> - **Primary CTA** — the main action button (action verb + context, not just 'Submit')
> - **Secondary actions** — any links, back buttons, or alternative paths
> - **Helper text** — form field labels, placeholders, input hints
>
> Voice brief: [paste reference card]
> User flow: [paste from storyboard or prototype brief — screen by screen]
> User context at each screen: [emotional state, what they just did, what they need to know]"

---

### Copy Quality Standards

**Headlines:**
- Lead with user benefit, not system action
- 5 words or fewer when possible — test every word's necessity
- Present tense, active voice
- Don't: "Settings updated successfully" / Do: "You're all set"

**CTAs:**
- Always verb + noun — never just a verb ("Continue" is weaker than "Continue to payment")
- Specific beats generic — "Start free trial" beats "Get started"
- Match the user's mental model — what do they think they're doing?
- One primary CTA per screen — two competing primaries means the IA is broken

**Body copy:**
- Every word must earn its space — cut anything that doesn't change behavior
- Plain language — if a 12-year-old can't understand it, rewrite it
- Avoid passive voice, hedging language ("may," "might," "possibly"), jargon
- Maximum 2 sentences for in-flow body copy — more than that belongs in a tooltip or help doc

**Form labels and placeholders:**
- Labels: sentence case, noun phrases, no colons
- Placeholders: example data, not re-stating the label ("e.g. jane@email.com" not "Email address")
- Helper text: what the user needs to know, not system constraints ("We'll send a code to this number" not "10-digit mobile number required")

---

## Step 3: Write Error States and Empty States

Error and empty states are the most under-written copy in most products. They're also the moments users most need good copy — when something has gone wrong or nothing has happened yet.

**Claude prompt:**
> "Write complete error state and empty state copy for this product. For each state:
> - **Error headline** — what happened (don't say 'Error' — say what actually happened)
> - **Error body** — why it happened and what to do about it (if the user can fix it)
> - **Primary action** — the most helpful next step
> - **Secondary action** — an escape route
>
> Error states to cover:
> 1. Network/connection failure
> 2. Form validation errors (field-level and form-level)
> 3. Permission denied
> 4. Empty search results
> 5. Timeout
> 6. [Product-specific errors from the user flow]
>
> Empty states to cover:
> 1. First-time use (nothing yet — most important to get right)
> 2. Cleared state (user deleted everything)
> 3. No search results
> 4. No notifications / no activity
>
> Voice brief: [paste]
> Product context: [paste]"

---

### Error State Principles

**Don't blame the user.** "You entered an invalid email" → "That email doesn't look right"

**Don't be vague.** "Something went wrong" tells the user nothing. "We couldn't save your changes — try again in a moment" is actionable.

**Always give a next step.** If the user can fix it: tell them how. If they can't: tell them who can (support link) or when it'll resolve.

**Match severity to tone.** A missed required field is minor — keep the tone light. A data loss error is serious — drop the humor.

**The error message formula:** [What happened] + [Why (if knowable)] + [What to do]

---

## Step 4: Write Onboarding and First-Use Copy

First-use copy is the highest-leverage copy in any product. Users are deciding in the first 60 seconds whether to engage or leave.

**Claude prompt:**
> "Write first-use onboarding copy for this product. The user has just signed up or launched for the first time.
>
> Write:
> 1. **Welcome message** — what the product does for them (benefit, not feature list)
> 2. **First action prompt** — the single thing they should do right now, and why
> 3. **Empty state copy** — for the main content area before they've created anything (this is the most important empty state)
> 4. **Progress/completion indicators** — copy for any setup steps or onboarding checklist
> 5. **First success message** — when they complete their first meaningful action
>
> The user at this moment: [emotional state — uncertain? excited? skeptical?]
> What they want to accomplish: [their primary goal]
> What they need to do first: [the first action that makes the product useful]
> Voice brief: [paste]"

---

## Step 5: Write Microcopy and System Messages

Microcopy is the small text most teams skip: tooltips, confirmation dialogs, loading states, notification copy.

**Claude prompt:**
> "Write complete microcopy for this product. For each:
>
> **Tooltips** (for: [list UI elements that need tooltips])
> Format: One sentence, maximum 15 words, present tense
>
> **Confirmation dialogs** (for: [list destructive or irreversible actions])
> Format: Headline (what's about to happen) + Body (consequence, if any) + CTA (action, not 'Yes') + Cancel
>
> **Loading and progress states** (for: [list async operations])
> Format: Action verb in present progressive + timeframe if known
>
> **Notification and alert copy** (for: [list notification types])
> Format: What happened + why it matters to the user
>
> **Success confirmations** (for: [list key task completions])
> Format: What succeeded + what happens next (if relevant)
>
> Voice brief: [paste]"

---

## Copy Audit — Reviewing Existing Copy

If copy already exists and needs review rather than generation from scratch:

**Claude prompt:**
> "Audit the copy in this product against these criteria. For each piece of copy, flag issues and provide a rewrite.
>
> Audit criteria:
> 1. **Clarity** — can a first-time user understand this immediately?
> 2. **Voice consistency** — does this match the voice brief?
> 3. **CTA strength** — is the primary action specific and action-oriented?
> 4. **Error handling** — do error messages explain what happened and what to do?
> 5. **Passive voice** — flag and rewrite passive constructions
> 6. **Jargon** — flag terms a non-expert user might not understand
> 7. **Word count** — flag anything that could be cut by 30%+ without losing meaning
>
> Voice brief: [paste]
> Current copy to audit: [paste or describe screen by screen]"

---

## Quality Checklist

Before handing off to usability testing:
- [ ] Every screen has a headline — no screen is title-less
- [ ] Every CTA uses verb + noun — no standalone "Continue" or "Next"
- [ ] All form fields have labels (not just placeholders)
- [ ] Error states cover all failure modes identified in concept critique
- [ ] Empty states explain what will appear here and how to add it
- [ ] First-use copy exists and doesn't just list features
- [ ] Copy is consistent — same terms used for same concepts throughout
- [ ] No Lorem ipsum remains in screens that will be shown to users
- [ ] Voice is consistent — no screen sounds like a different product

---

## Phase Handoff Block

```
## Handoff: Prototype — UX Copy Writing
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Screens with copy written: [N]
- Error states written: [N]
- Empty states written: [N]
- Copy audit run: Yes / No

### Voice and tone summary
Voice: [4 adjectives]
Tone in error states: [description]
Key copy rules: [3 most important voice rules for this product]

### Copy inventory
[List every screen/state with copy — name and CTA]

### Copy that still needs work
- [Screen/state] — [what's missing or needs revision]

### Open questions
- [Any copy decisions that require product or stakeholder input]
- [Terms or labels the team hasn't aligned on]

### What test scripts should probe
[Specific copy elements to observe during usability testing — labels users might misread, CTAs that might be ambiguous]

---
*Attach the full copy document to the prototype before usability testing.*
*Flag copy elements to observe closely in the test script.*
```
