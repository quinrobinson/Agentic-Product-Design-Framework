---
name: design-delivery
phase: 06 — Deliver
description: >
  Create component specifications, developer handoff documentation, platform-specific delivery
  packages, design decision records, and release notes. Use this skill when preparing designs
  for engineering handoff, writing component specs, creating QA checklists, documenting design
  decisions, building platform-specific annotation guides (iOS, Android, Web), writing release
  notes or changelogs, or producing design system documentation. Also triggers for any mention
  of shipping, handoff, specs, annotations, tokens in code, developer questions, or ensuring
  what was designed actually gets built correctly.
ai_leverage: high
---

# Design Delivery & Documentation

Ship designs with precision and documentation that ensures what gets built matches what was designed.

---

## Component Specification

Write specs so a developer can build the component without asking questions:

```
# Component Spec: [Component Name]

## Overview
- Purpose: [What this component does]
- Context: [Where it's used in the product]
- Related components: [Components it's used with]

## API / Props

| Prop     | Type                        | Default   | Required | Description              |
|----------|-----------------------------|-----------|----------|--------------------------|
| variant  | "primary" | "secondary" | "primary" | No       | Visual style variant     |
| size     | "sm" | "md" | "lg"        | "md"      | No       | Size of the component    |
| disabled | boolean                     | false     | No       | Prevents interaction     |
| onClick  | () => void                  | —         | Yes      | Click handler            |
| children | ReactNode                   | —         | Yes      | Content to display       |

## Visual States

### Default — [Description]
### Hover — [Background/border/shadow/cursor changes] | Transition: [Xms ease-out]
### Active/Pressed — [What changes on press]
### Focus — [Focus ring: Xpx solid #color, offset Xpx] — must be keyboard-visible
### Disabled — [Opacity 0.38–0.5, cursor not-allowed, pointer-events: none]
### Loading — [Spinner / skeleton — still interactive? Y/N]
### Error — [Border color, icon, message — how it clears]

## Responsive Behavior

| Breakpoint  | Behavior                       |
|-------------|--------------------------------|
| < 375px     | [Full width, stacked]          |
| 375–768px   | [Mobile behavior]              |
| 768–1280px  | [Tablet behavior]              |
| > 1280px    | [Desktop behavior]             |

## Accessibility

### Keyboard
- Tab: [Focus behavior]
- Enter/Space: [Activation]
- Escape: [Dismiss / cancel if applicable]

### Screen Reader
- Role: [ARIA role or native element]
- Label: [How it announces — visible text / aria-label]
- State changes: [aria-live announcements — what fires and when]

### ARIA Attributes
- aria-label: [When needed]
- aria-describedby: [For additional context]
- aria-disabled: [For disabled state]

## Content Guidelines

| Element     | Min | Max | Truncation   |
|-------------|-----|-----|--------------|
| Label       | 1   | 30  | Ellipsis     |
| Description | 0   | 120 | Line clamp 2 |

## Usage: Do / Don't
- Do: [Correct usage]
- Don't: [Anti-pattern]

## Edge Cases
- Empty content: [How the component handles no data]
- Maximum content: [How it handles overflow]
- Nested instances: [Behavior when stacked/combined]
```

---

## Platform-Specific Handoff

### Web Handoff

```
# Web Handoff: [Feature/Screen]

## Breakpoints
- 375px (mobile): [layout behavior]
- 768px (tablet): [layout behavior]
- 1024px (laptop): [layout behavior]
- 1280px (desktop): [layout behavior]
- 1920px (wide): [max-width container behavior]

## Viewport
- <meta name="viewport" content="width=device-width, initial-scale=1"> — confirm zoom not disabled

## Performance Notes
- [ ] Images: WebP/AVIF with width/height declared (prevents CLS)
- [ ] Fonts: font-display: swap — list fonts to preload
- [ ] Code splitting: lazy-load routes listed here: [list]
- [ ] Lists with > 50 items: virtualization required
- [ ] Below-fold images: loading="lazy"

## CSS Architecture
- Color: semantic tokens only — no raw hex in components
- Spacing: 4pt grid — all values multiples of 4
- Z-index scale: [0 / 10 / 20 / 40 / 100 / 1000]
- Fixed elements: reserve [Xpx] top / bottom padding for underlying scroll content

## Animations
- Properties: transform and opacity only
- Timing: [list interactions with durations]
- prefers-reduced-motion: [list fallback behaviors]
```

### iOS Handoff

```
# iOS Handoff: [Feature/Screen]

## Safe Areas
- Top: respect status bar and Dynamic Island
- Bottom: respect home indicator (typically 34pt on modern devices)
- All fixed headers, tab bars, and CTA bars must avoid these zones
- Use SafeAreaInsets or safeAreaLayoutGuide

## Navigation
- Primary navigation: Tab Bar (bottom) — max 5 items, icon + label required
- Back navigation: support swipe-back gesture — do NOT override UINavigationController default
- Modals: swipe-down to dismiss — include visual drag handle
- Deep links: list all screens that must support deep linking

## Typography
- Support Dynamic Type — avoid fixed-height containers that clip text at large sizes
- Preferred font: SF Pro (system font) — specify size in Dynamic Type categories:
  - Body: .body | Caption: .caption1 | Title: .title1 etc.
- Never truncate system-size text without tooltip access to full content

## Controls
- Touch target minimum: 44×44pt — use hitSlop if visual element is smaller
- Use native UIKit controls where possible before custom implementations
- Haptic feedback: UIImpactFeedbackGenerator for confirmations; UINotificationFeedbackGenerator for success/error

## Icons
- Use SF Symbols where appropriate (ensure they meet minimum weight at all sizes)
- Custom icons: SVG-based, consistent stroke weight

## Accessibility (VoiceOver)
- Every interactive element: accessibilityLabel + accessibilityTraits
- accessibilityHint for non-obvious actions
- Set accessibilityElements array if auto-order is incorrect
- Test reading order manually with VoiceOver enabled
```

### Android Handoff

```
# Android Handoff: [Feature/Screen]

## Safe Areas
- Status bar: respect height (varies by device — use WindowInsetsCompat)
- Navigation bar: respect gesture navigation area at bottom
- All sticky bars must add bottom inset padding

## Navigation
- Primary: Top App Bar with navigation icon for main structure
- Secondary destinations: Navigation Drawer
- Bottom Navigation: only for 3–5 top-level tabs with icon + label
- Predictive back: support Android 13+ predictive back gesture — do NOT intercept back stack
- Deep links: list all Activities/Fragments that must declare intent-filter

## Typography
- Minimum body: 14sp (16sp preferred)
- Follow Material Type scale roles: displayLarge, headlineMedium, bodyMedium, labelSmall
- Support font scale multiplier — test at 1.0× and 1.3× minimum

## Controls
- Touch target minimum: 48×48dp — extend with padding if icon is smaller
- State layers: use Material state overlays (hover, pressed, focused, dragged, selected) at correct opacities
- Ripple: default ripple on all interactive surfaces

## Color
- Use Material Color Roles: Primary, OnPrimary, PrimaryContainer, Surface, OnSurface, etc.
- Support both light and dark themes using MaterialTheme.colorScheme
- Never hardcode hex values in components

## Accessibility (TalkBack)
- contentDescription on all non-text interactive elements
- importantForAccessibility="no" for decorative elements
- traversalBefore/After for non-standard reading order
- Test with TalkBack enabled
```

---

## Developer Handoff Package

```
# Handoff Package: [Feature/Screen]

## Files
- [ ] Figma link: [URL — confirm all frames are finalized, no WIP]
- [ ] Components linked to design system library
- [ ] Responsive variants included (375 / 768 / 1280)
- [ ] Dark mode variants included

## Specifications
- [ ] Component specs written for all new/modified components
- [ ] Interaction specs for all animations and transitions
- [ ] Copy finalized and approved
- [ ] All states documented (default, hover, focus, disabled, error, loading, empty, success)

## Tokens
- [ ] Colors referenced by semantic token name, not hex
- [ ] Spacing annotated by token (space-4, not 16px)
- [ ] Typography referenced by scale name (text-lg, not 18px)
- [ ] Border radius by token name (radius-md, not 8px)

## Assets
- [ ] Icons exported (SVG, at design token sizes)
- [ ] Images exported (WebP + PNG fallback, 1× and 2×)
- [ ] Custom fonts listed with licenses and fallback stack

## Accessibility Package
- [ ] Heading hierarchy documented
- [ ] Tab order specified with numbered diagram
- [ ] Alt text written for all meaningful images
- [ ] ARIA requirements annotated on components
- [ ] Color contrast verified (with tool used noted)
- [ ] Platform-specific labels documented (accessibilityLabel / contentDescription)

## Implementation Notes
- [ ] Known technical constraints documented
- [ ] API data mapping (design field → API field)
- [ ] Error handling requirements
- [ ] Performance considerations (lazy loading, virtualization needs)
- [ ] Analytics events to implement
- [ ] Platform-specific behaviors noted (iOS vs Android differences)

## Review
- [ ] Design review completed with eng lead
- [ ] Open questions resolved
- [ ] Acceptance criteria defined
```

---

## Design Decision Records

Document significant design decisions so the team understands *why*, not just *what*:

```
# DDR-[NNN]: [Decision Title]

## Status: Accepted / Superseded by DDR-[NNN] / Deprecated
## Date: [YYYY-MM-DD]

## Context
[What prompted this decision? What problem were we solving?]

## Decision
[What we decided, stated clearly.]

## Options Considered

### Option A: [Name]
Pros: [Benefits] | Cons: [Drawbacks]

### Option B: [Name] ← Selected
Pros: [Benefits] | Cons: [Drawbacks]

## Rationale
[Why Option B. What tradeoffs we accepted and why.]

## Consequences
[What this enables / constrains / risks]

## Related: DDR-[NNN], [research link]
```

Write a DDR whenever: you chose between meaningful alternatives; a stakeholder might ask "why"; the decision constrains future options; you're reversing a previous decision.

---

## Release Notes

### Internal Changelog

```
# Changelog: [Version / Sprint]
Date: [YYYY-MM-DD]

## New
- [Feature]: [What it does and why]

## Improved
- [Feature]: [What changed and user impact]

## Fixed
- [Bug]: [What was broken and resolution]

## Design System Updates
- [Component]: [New variant / token change / deprecation]

## Metrics to Watch
- [Metric]: [Expected change and why]
```

### User-Facing Release Notes

Rules: lead with benefit (not feature), use the user's language, one line per item, skip internal refactors:

```
# What's New — [Version / Date]

## [Headline feature]
[1–2 sentences focused on the user benefit.]

## Improvements
- [Change]: [How it helps you]

## Bug Fixes
- [Fix]: [What you'll notice]
```

---

## Design System Documentation

```
# [Component Name]

## Description
[One sentence: what it is and when to use it]

## Variants
[Visual examples of each variant with labels]

## Props / Configuration
[Table from component spec]

## When to Use / When NOT to Use
[Guidelines + alternatives]

## Accessibility
[Key a11y requirements from the spec]

## Code Example
[Minimal implementation]

## Changelog
- [Date]: [What changed]
```

---

## Quality Checklist

- [ ] Component specs are complete — developer can build without asking questions
- [ ] Platform-specific rules addressed (iOS / Android / Web as applicable)
- [ ] All assets exported and organized with correct naming
- [ ] Design decisions documented with rationale, not just outcome
- [ ] Accessibility requirements included (not just visual specs)
- [ ] Token names used throughout — no raw values (colors, spacing, typography)
- [ ] Release notes written for the correct audience (internal vs external)
- [ ] Acceptance criteria defined for engineering review
