---
name: prototyping
phase: 04 — Prototype
description: >
  Build functional prototypes, write UX copy, and validate interaction quality across web and
  native mobile. Use this skill when creating working prototypes in React/HTML, generating
  complete UI copy for screens, specifying micro-interactions and component behavior, auditing
  touch target sizes, verifying animation timing, or checking mobile gesture safety. Also triggers
  for design QA, responsive design specs, translating wireframes into testable prototypes, or
  when any question arises about how a component should move, respond, or behave. Always use
  alongside visual-design-execution for visual system rules and accessibility-audit for a11y checks.
ai_leverage: high
---

# Prototyping & Production Design

Transform concepts into testable, accessible, production-quality prototypes.

---

## Prototype Specification

Before building, define:

```
# Prototype Spec: [Screen/Flow Name]

## Purpose
- [ ] User testing
- [ ] Stakeholder review
- [ ] Developer reference
- [ ] Concept validation

## Fidelity Level
- [ ] Low (structure + flow, no styling)
- [ ] Medium (styled, placeholder content)
- [ ] High (production-quality, real content, all states)

## Scope
Screens included: [List]
User flow: [Step 1 → Step 2 → Step 3]
Platform: [ ] Web  [ ] iOS  [ ] Android  [ ] Cross-platform

## Requirements
- Framework: [React / HTML / Figma prototype / SwiftUI / Flutter]
- Responsive: [Yes — breakpoints: 375, 768, 1280]
- Interactive elements: [List what needs to actually work]
- Data: [Static / Mock API / Real data]

## States to Build
- [ ] Default / loaded
- [ ] Empty state (no data / first use)
- [ ] Loading (skeleton / spinner)
- [ ] Error (inline / toast / full-page)
- [ ] Success (confirmation / next step)
- [ ] Edge cases: [Specify]
```

---

## Building the Prototype

1. **Start with structure** — Build the layout skeleton first
2. **Add real content** — Use realistic data, not "Lorem ipsum." Users react to content.
3. **Handle all states** — Empty, loading, error, and success states are where UX lives
4. **Add micro-interactions** — Hover states, transitions, and feedback that make it feel real
5. **Make it responsive** — Test at 375px (mobile), 768px (tablet), 1280px (desktop)

---

## Touch & Interaction Standards

### Touch Target Sizes

| Platform | Minimum | Recommended |
|---|---|---|
| iOS | 44 × 44pt | 48 × 48pt |
| Android | 48 × 48dp | 56 × 56dp |
| Web (mobile) | 44 × 44px | 48 × 48px |

- Extend hit area beyond visual bounds when icon is smaller than minimum
- Minimum **8px gap between adjacent touch targets** to prevent mis-taps
- Keep primary tap targets away from notch, Dynamic Island, gesture bar, and screen edges

### Interaction Timing

| Interaction | Duration | Easing | Platform Note |
|---|---|---|---|
| Press/tap feedback | 80–150ms | ease-out | Apple HIG / Material |
| Hover state (web) | 100–150ms | ease-out | — |
| Micro-interaction (toggle, checkbox) | 150–200ms | ease-out | — |
| Dropdown / panel open | 200–250ms | ease-out | — |
| Dropdown / panel close | 150–200ms | ease-in | — |
| Modal enter | 250–300ms | ease-out | — |
| Modal exit | 150–200ms | ease-in | — |
| Page / screen transition | 200–300ms | ease-in-out | Never > 300ms |
| Complex animations | ≤ 400ms | cubic-bezier | Never > 500ms |

**Animation rules:**
- Animate `transform` and `opacity` only — never `width`, `height`, `top`, `left`
- Ease-out for entering elements; ease-in for exiting elements
- Max 1–2 animated elements per view — no competing motion
- Use skeleton screens (not spinners) for loads > 300ms
- Always respect `prefers-reduced-motion` — provide instant or minimal-motion fallback

### Gesture Safety

- Avoid horizontal swipe on main scroll content — conflicts with iOS swipe-back
- Provide visible controls for all gesture-only actions (swipe to delete → delete button)
- Use a movement threshold before starting drag (prevents accidental drags)
- Do not override system gestures (iOS back swipe, Control Center, Android predictive back)
- For swipe actions: show clear affordance or hint (chevron, label, hint animation)

### Press Feedback Requirements

- Every tappable element must provide visual feedback within 80–150ms
- Web: `cursor: pointer` on all clickable elements
- iOS: opacity change, highlight, or scale (per component)
- Android: ripple effect at tap point
- Disabled state: reduced opacity (0.38–0.5) + semantic `disabled` attribute — no tap response
- Loading state: disable button and show spinner during async operations

### Haptic Feedback (Native Mobile)

- Use for: confirmations, important destructive actions, success completions
- Avoid overuse — haptics lose meaning if triggered constantly
- Never use for decorative/ambient triggers

---

## Micro-Interaction Specs

Document each interaction:

```
## Interaction: [Name]

### Trigger
[click / hover / scroll / load / swipe / gesture]

### Animation
- Property: [transform / opacity / color / background]
- Duration: [80–400ms — see timing table above]
- Easing: [ease-out (enter) / ease-in (exit) / ease-in-out (bidirectional)]
- Delay: [If staggered — 30–50ms per item]

### Feedback
[Visual / haptic / sound — what the user perceives]

### End State
[What the UI looks like after completion]

### Reduced Motion Fallback
[Instant change / opacity-only / no animation]

### Edge Cases
- Interrupted: [What if triggered again before completion?]
- Disabled: [What if element is disabled?]
```

---

## UX Copy System

### Screen Copy Audit

```
# UX Copy: [Screen Name]

## Headlines & Subheads
- H1: [Primary heading — one per screen]
- Subhead: [Supporting context — optional]

## Actions
- Primary CTA: [Verb-first, specific — "Save changes" not "Submit"]
- Secondary CTA: [Less prominent]
- Destructive CTA: [Uses danger color — "Delete account"]

## Form Labels & Help Text
- [Field]: Label | Placeholder | Help text | Error message

## Empty States
- Title: [What to say when nothing is here]
- Body: [Explain why and what to do next]
- CTA: [Action to get started]

## Error Messages (must state cause + fix)
- [Error type]: [Specific message — "Password must be at least 8 characters"]
- Avoid: "An error occurred" / "Invalid input"

## Success / Confirmation
- [Action]: [Brief confirmation + clear next step]

## Loading States
- [Context]: [Message if loading > 2 seconds]
```

### Copy Principles
- Verb-first CTAs: "Save changes" not "Changes"
- Specific errors: state what's wrong AND how to fix it
- No dead ends: every empty state + error has a next action
- Consistent voice: define tone (professional, casual, etc.) and maintain it
- Front-load key info: most important word comes first in every string

---

## Accessibility Audit (Quick)

For full audit workflow → use the **accessibility-audit** skill.

Quick checks during prototyping:

- [ ] Color contrast: text ≥ 4.5:1, large text ≥ 3:1
- [ ] Color not sole indicator (add icons or text)
- [ ] All images have descriptive alt text
- [ ] All interactive elements reachable by Tab
- [ ] Focus indicator visible on all interactive elements
- [ ] Touch targets ≥ 44×44px
- [ ] Skip links present (if nav before main content)
- [ ] `prefers-reduced-motion` respected

---

## Navigation Pattern Standards

| Pattern | Use When | Avoid |
|---|---|---|
| Bottom tab bar | iOS: top-level navigation, ≤ 5 items | Sub-navigation, > 5 items |
| Top app bar | Android: primary structure | iOS primary nav |
| Sidebar / drawer | Secondary navigation, desktop ≥ 1024px | Primary mobile actions |
| Breadcrumbs | 3+ level hierarchy (web) | Flat structures |

**Navigation rules:**
- Back navigation must be predictable — preserve scroll position and filter state
- Bottom nav is for top-level screens only — never nest sub-navigation inside it
- Navigation placement must be consistent across all screens — never change by page type
- Modals must offer a clear close affordance — swipe-down to dismiss on mobile
- After page transition: move focus to main content region for screen reader users
- Deep links: all key screens must be reachable via URL / deep link

---

## Pre-Delivery QA Checklist

### Visual Quality
- [ ] No emoji as icons — SVG only
- [ ] Consistent icon library and stroke width
- [ ] Semantic color tokens — no hardcoded hex in components
- [ ] Light and dark mode both verified

### Interaction
- [ ] All tappable elements have press feedback (≤ 150ms)
- [ ] Touch targets ≥ 44×44pt (iOS) / 48×48dp (Android)
- [ ] Animation timing 80–300ms range; complex ≤ 400ms
- [ ] `transform`/`opacity` only — no layout property animations
- [ ] Disabled states visually clear and non-interactive
- [ ] Loading states disable buttons and show progress

### Gesture & Platform
- [ ] No gesture conflicts with system swipes (back, Control Center)
- [ ] Gesture-only actions have visible control alternatives
- [ ] Safe areas respected (notch, Dynamic Island, gesture bar, home indicator)
- [ ] Horizontal scroll does not conflict with main scroll direction

### Light/Dark Mode
- [ ] Primary text ≥ 4.5:1 in both modes
- [ ] Secondary text ≥ 3:1 in dark mode
- [ ] Dividers and interaction states visible in both modes
- [ ] Modal scrims 40–60% opacity in both modes

### Layout
- [ ] Verified at 375px, 768px, 1280px (web)
- [ ] Verified on small phone, large phone, tablet portrait + landscape (native)
- [ ] Scroll content not hidden behind fixed/sticky bars
- [ ] 4/8dp spacing rhythm maintained throughout
- [ ] Long-form text readable on large devices (no edge-to-edge paragraphs)

### Accessibility
- [ ] All meaningful images/icons have labels
- [ ] Form fields: labels, hints, and error messages present
- [ ] Errors use `role="alert"` or `aria-live`
- [ ] Reduced motion and dynamic text size supported without layout breakage
- [ ] Keyboard navigation complete and logical

### Content & Copy
- [ ] No placeholder text remaining
- [ ] Strings handle long text (truncation, wrapping)
- [ ] Numbers handle extremes (0, 1, 999999)
- [ ] All states covered: default, empty, loading, error, success, disabled
