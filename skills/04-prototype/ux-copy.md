---
name: ux-copy
phase: 04 — Prototype
description: Write all interface text for a prototype or product — labels, CTAs, error messages, empty states, onboarding copy, tooltips, microcopy, and confirmation language. Use when building a prototype that needs real copy instead of Lorem ipsum, when auditing existing copy for clarity and consistency, or when handing off a complete copy spec to engineering. Claude's highest-leverage single activity in the design process. Depends on outputs from storyboarding.md and user-flow-mapping.md. Outputs feed directly into prototyping and test-script.md.
ai_leverage: very high
claude_surface: chat
---

# UX Copy Writing

Write every word a user reads — labels, actions, errors, empty states, onboarding, and confirmations — grounded in the user's mental model and the product's voice.

## When to Use

- Building a prototype and need real copy instead of Lorem ipsum
- Auditing existing product copy for clarity, consistency, or tone
- Writing error messages and empty states that designers typically defer
- Preparing a complete copy spec for engineering handoff
- Rewriting an existing flow to reduce cognitive load or improve conversion

---

## Why UX Copy Is Claude's Highest-Leverage Activity

Writing complete UX copy for a mid-sized feature takes a solo designer 2–3 days and is almost always incomplete — error states get deferred, empty states get "TBD," onboarding copy gets written by whoever has time. The result is a product that works mechanically but feels cold, confusing, or inconsistent.

Claude generates a complete copy set for an entire user flow in 20–30 minutes. The draft needs editing, but it's complete — every state covered, every edge case addressed, every label consistent with the others.

---

## Before Writing — Establish the Voice

Copy without a voice definition produces inconsistent output. Establish these before generating any copy.

**Claude prompt:**
> "Define the UX writing voice for [product name]. Based on this product context and persona:
>
> Product: [what it is, what it does]
> Primary persona: [who uses it — role, context, sophistication level]
> Brand personality (if known): [adjectives, examples, competitors to reference]
>
> Generate:
> 1. Three voice attributes with do/don't examples for each
> 2. Tone spectrum — how voice shifts across contexts (onboarding vs. error vs. success)
> 3. Five vocabulary rules — specific words to use and avoid
> 4. Reading level target — and what that means for sentence length and structure"

**Voice template:**
```
## UX Voice: [Product Name]

### Voice attributes
1. [Attribute] — Do: "[example]" / Don't: "[example]"
2. [Attribute] — Do: "[example]" / Don't: "[example]"
3. [Attribute] — Do: "[example]" / Don't: "[example]"

### Tone by context
- Onboarding: [how to sound]
- Neutral/working: [how to sound]
- Success: [how to sound]
- Error/warning: [how to sound]
- Empty states: [how to sound]

### Vocabulary rules
- Use: [word] instead of [word]
- Avoid: [word or phrase and why]

### Reading level
[Target grade level] — [what that means in practice]
```

---

## Step 1: Map the Copy Inventory

Before writing, enumerate every text element in the flow. This prevents the most common failure mode — writing some copy and discovering 30% of states were missed when building the prototype.

**Claude prompt:**
> "Map the complete copy inventory for this user flow.
>
> For each screen or state, list every text element that needs copy:
> - Page/screen title
> - Body text or description
> - All labels (fields, sections, navigation)
> - All CTAs and buttons
> - All links
> - Placeholder text (form fields)
> - Helper text / tooltips
> - Validation messages (inline errors)
> - Empty states
> - Loading states
> - Success states
> - Error states (system, network, permission, not found)
> - Confirmation dialogs
>
> User flow: [paste flow from user-flow-mapping.md or storyboard]
> Product context: [what each screen does]"

---

## Step 2: Write the Core Flow Copy

Generate copy for the main path first — what a user sees when everything goes right.

**Claude prompt:**
> "Write UX copy for the core user flow below. Apply this voice:
> [paste voice definition]
>
> For each screen, write:
> - **Title:** [screen title — action-oriented where possible]
> - **Body:** [any explanatory text — keep short, earn every word]
> - **Labels:** [all field and section labels]
> - **CTAs:** [all buttons and primary actions — verb-first]
> - **Placeholders:** [form field placeholder text — hint, not label]
> - **Helper text:** [inline guidance below fields]
>
> Rules:
> - CTAs must start with a verb: Save, Continue, Add, Generate — never 'Click here' or 'Submit'
> - Labels are nouns: Email address, Project name — not questions
> - Placeholder text hints at format, not just repeats the label: 'you@company.com' not 'Email'
> - Body copy must earn every word — remove any sentence that doesn't help the user
> - Maintain consistent terminology — pick one word for each concept and use it everywhere
>
> Core user flow:
> [paste step-by-step flow — screen by screen]
>
> Product voice: [paste voice attributes]
> Primary persona: [paste]"

---

## Step 3: Write Error States

Error messages are the most consistently under-written copy in any product. They're also the highest-stakes — users read errors closely, and poor error copy destroys trust.

**Claude prompt:**
> "Write error messages for every failure state in this flow.
>
> For each error, write three elements:
> 1. **Error title** (if applicable) — what went wrong in plain language
> 2. **Error body** — what happened and what the user can do about it
> 3. **Recovery action** — the specific next step (button label or instruction)
>
> Error categories to cover for each applicable screen:
> - Validation errors (inline — field-level, triggered on blur or submit)
> - Submission errors (form-level — when multiple fields fail or backend rejects)
> - Network errors (no connection, timeout, slow response)
> - Permission errors (not authorized, logged out, plan limit)
> - Not found errors (resource deleted, URL invalid)
> - System errors (something went wrong on our end)
> - Conflict errors (duplicate, already exists)
>
> Rules:
> - Never blame the user: 'Invalid email' → 'Check the email address — it looks like something's missing'
> - Never use jargon: '404 error', 'null value', 'exception'
> - Always tell the user what to do next — not just what went wrong
> - Match the severity to the tone — minor validation: calm. Data loss: direct but not alarming.
>
> Flow context: [paste]
> Product voice: [paste]"

---

## Step 4: Write Empty States

Empty states are a retention opportunity disguised as an edge case. A good empty state explains why nothing's here and gives the user a reason and path to fill it.

**Claude prompt:**
> "Write empty state copy for every screen or component that can appear without content.
>
> For each empty state:
> 1. **Heading** — what this space is for (not 'No items found')
> 2. **Body** — why it's empty and what the user will see when it's not
> 3. **CTA** — the action that fills it (if applicable)
>
> Empty state categories:
> - First-time / zero state (user has never added anything)
> - Search/filter (no results match the query)
> - Cleared (user deleted everything)
> - Awaiting data (content will appear when others act or when time passes)
> - Permission (user can't see content due to access level)
>
> Rules:
> - Zero states are the best onboarding copy you'll write — make them welcoming
> - Don't apologize: 'Sorry, nothing here' → 'Your projects will appear here'
> - If there's an action to take, surface it — empty state + CTA converts better than empty state alone
> - Be specific: 'No results for "dashboard"' not 'No results found'
>
> Screens with potential empty states: [list]
> Product voice: [paste]
> Persona: [paste]"

---

## Step 5: Write Onboarding Copy

Onboarding copy is where users decide whether to invest time in a product. It carries a disproportionate share of the product's first impression.

**Claude prompt:**
> "Write onboarding copy for [product / feature name].
>
> Generate copy for each onboarding moment:
> 1. **Welcome screen** — first thing users see: value proposition in one sentence
> 2. **Setup steps** (if any) — each step: title, body (why this matters), CTA
> 3. **First success moment** — what users see after completing the first meaningful action
> 4. **Contextual tooltips** — inline guidance at moments of first encounter with key features
> 5. **Progressive disclosure hints** — copy that reveals depth over time (not all at once)
>
> Onboarding principles to apply:
> - Lead with what the user gets, not what the product does
> - One thing per screen — don't stack value props
> - Make the first action feel achievable in under 2 minutes
> - The first success moment is more important than the welcome screen
>
> Product: [what it does]
> Primary persona: [paste]
> Core value prop: [what's the one thing this product does for users]
> Product voice: [paste]"

---

## Step 6: Write Confirmations and Success States

Confirmations and success messages are where products earn emotional trust — or waste the opportunity.

**Claude prompt:**
> "Write confirmation and success copy for all actions in this flow that result in a significant outcome.
>
> For each:
> 1. **Confirmation dialog** (before irreversible actions): title, body, confirm CTA, cancel CTA
> 2. **Success message** (after completion): what happened, what comes next, any follow-on action
> 3. **Toast/snackbar** (for minor confirmations): one line, action confirmed
>
> Rules for confirmations:
> - The confirm button should say what happens: 'Delete project' not 'OK'
> - The cancel button should say what doesn't happen: 'Keep project' not 'Cancel'
> - Body copy must explain consequences clearly — especially for destructive actions
>
> Rules for success states:
> - Don't just say 'Success' — tell the user what was created, saved, or sent
> - If there's a next step, suggest it: 'Your report is ready — share it with your team'
> - Match the emotional register to the significance: saving a draft ≠ publishing a project
>
> Flow context: [paste]
> Product voice: [paste]"

---

## Copy Audit — Reviewing Existing Copy

Use Claude to audit existing product copy for clarity, consistency, and voice.

**Claude prompt:**
> "Audit the UX copy in this flow against these criteria:
>
> 1. **Clarity** — does every element communicate instantly? Flag anything that requires re-reading
> 2. **Consistency** — is terminology consistent? Flag any word used multiple ways or two words used for the same thing
> 3. **Voice** — does copy match the defined voice? Flag anything that sounds off-brand
> 4. **Completeness** — are any states missing copy? Flag any 'TBD', 'Lorem ipsum', or blank labels
> 5. **CTA quality** — do all CTAs start with a verb? Flag any that don't
> 6. **Error quality** — do all errors tell users what to do next? Flag any that only describe what went wrong
>
> For each issue found: state the problem, quote the current copy, and suggest a replacement.
>
> Flow copy to audit: [paste all current copy]
> Voice definition: [paste]"

---

## Quality Checklist

Before handing off to prototype build or engineering:
- [ ] Voice definition complete — three attributes with do/don't examples
- [ ] Copy inventory mapped — every screen and state enumerated before writing
- [ ] Every CTA starts with a verb — no 'Submit', 'OK', or 'Click here'
- [ ] Terminology consistent — one word per concept, used everywhere
- [ ] Error messages include recovery action — not just what went wrong
- [ ] Empty states have a CTA where appropriate — zero state ≠ dead end
- [ ] Onboarding leads with user value — not product features
- [ ] Confirmations use action-specific language — 'Delete project' not 'OK'
- [ ] Reading level appropriate for persona — not too formal, not too casual
- [ ] No Lorem ipsum or TBD remaining in prototype copy

---

## Phase Handoff Block

```
## Handoff: Prototype — UX Copy
### Project: [PROJECT NAME]
### Date: [DATE]

---

### What we completed
- Voice definition: [complete / partial]
- Copy inventory: [N screens / states documented]
- Core flow copy: [complete / partial]
- Error states: [N written]
- Empty states: [N written]
- Onboarding copy: [complete / partial]
- Confirmations/success: [complete / partial]

### Voice summary
[3 attributes — one sentence each]
Reading level: [target]

### Copy decisions made
- [Terminology choice]: use "[word]" not "[word]" — [rationale]
- [Tone decision]: [what context gets what tone]
- [Format decision]: [any specific formatting conventions]

### Open copy questions
- [State or screen where copy is still uncertain]
- [Terminology the team hasn't aligned on]

### For test script
When testing the prototype, watch for:
- [Copy element where user reaction will be most revealing]
- [Error state that needs real-world validation]
- [Onboarding moment that may be confusing]

---
*Paste this block when opening Test Script drafting.*
```
