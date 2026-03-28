---
name: accessibility-audit
phase: 04 — Prototype / 05 — Validate
description: >
  Audit designs, prototypes, and code for WCAG 2.1 AA compliance across web and native mobile.
  Use this skill whenever the user needs to check accessibility, run an a11y audit, verify
  contrast ratios, check keyboard navigation, evaluate screen reader behavior, assess touch targets,
  review focus management, check ARIA usage, or validate reduced-motion support. Also triggers for
  any request mentioning accessibility, a11y, WCAG, VoiceOver, TalkBack, screen readers, keyboard
  traps, focus rings, or color blindness. Use in tandem with the prototyping skill during build
  and with usability-testing during validate. Always run before design-delivery handoff.
ai_leverage: high
---

# Accessibility Audit

Systematically evaluate and fix accessibility issues before they ship. Covers WCAG 2.1 AA
for web and platform-specific standards for iOS (Apple HIG / VoiceOver) and Android (Material / TalkBack).

---

## Audit Scope

Determine scope before starting:

```
## Audit Scope

- Platform: [ ] Web  [ ] iOS  [ ] Android  [ ] Cross-platform
- WCAG level: [ ] A (minimum)  [ ] AA (standard)  [ ] AAA (enhanced)
- Components in scope: [List screens, flows, or components]
- Known assistive technology: [ ] Screen reader  [ ] Keyboard only  [ ] Switch access  [ ] Voice control
```

---

## 1. Visual Accessibility

### 1a. Color Contrast

Minimum ratios (WCAG AA):

| Element | Required |
|---|---|
| Normal body text (< 18px or < 14px bold) | 4.5:1 |
| Large text (≥ 18px or ≥ 14px bold) | 3:1 |
| UI components (inputs, buttons, icons) | 3:1 |
| Meaningful icons | 3:1 |
| Decorative elements | No requirement |

**How to check:**
- Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) or browser DevTools
- Check both light AND dark mode independently
- Check all interactive states: default, hover, focus, disabled, error

**Common failures:**
- Placeholder text (often < 3:1 — must meet 4.5:1)
- Secondary/muted text (gray-on-gray often fails)
- Disabled text using opacity alone (must still be readable in context)
- Error/success state colors on colored backgrounds

### 1b. Color as Sole Indicator

Color must never be the only way information is conveyed.

| Scenario | Fix |
|---|---|
| Red/green status indicators | Add icon + text label |
| Underline-only links | Add different color AND underline |
| Chart data series differentiated only by color | Add patterns, shapes, or direct labels |
| Required form fields marked only in red | Add asterisk + "Required" text |
| Active tab shown only by color | Add background, underline, or weight change |

### 1c. Text Resize and Reflow

- Content must remain usable at **200% browser zoom** without horizontal scrolling
- Text must scale with system font size settings (Dynamic Type on iOS, font scale on Android)
- Layout must not break when text size increases — test with largest accessibility size
- Avoid fixed-height containers that clip scaled text

---

## 2. Keyboard & Focus Accessibility

### 2a. Keyboard Navigation

Every interactive element must be reachable and operable via keyboard alone:

| Check | Pass Criteria |
|---|---|
| Tab order | Follows logical reading order (left→right, top→bottom) |
| All interactive elements reachable | No elements skipped by Tab |
| No keyboard traps | User can always Tab away from any element |
| Focus never lost | After modal close, dialog dismiss, or route change — focus moves to logical target |
| Modals trap focus correctly | Tab cycles within modal only; Escape closes |
| Tooltips on focus | Tooltip content accessible via keyboard, not hover-only |

### 2b. Visible Focus Indicators

- **Focus ring must be visible** on all interactive elements — never remove without providing a styled alternative
- Minimum contrast: 3:1 between focus indicator and adjacent color
- Recommended: 2–4px solid ring, offset 2px, using brand color or high-contrast neutral
- Never rely on `outline: none` alone — always add a custom style

```css
/* Minimum acceptable focus style */
:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

### 2c. Skip Links

Required when there is repetitive navigation before main content:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

Skip link must be visible on focus (can be visually hidden at rest).

### 2d. Keyboard Shortcuts

- Do not override standard browser/system shortcuts
- Custom shortcuts must be documented and escapable
- Drag-and-drop interactions must have keyboard alternatives

---

## 3. Screen Reader Accessibility

### 3a. Semantic HTML (Web)

Use native HTML elements before reaching for ARIA:

| Pattern | Correct Approach |
|---|---|
| Page navigation | `<nav>` with `aria-label` |
| Main content | `<main>` |
| Page regions | `<header>`, `<footer>`, `<aside>` |
| Headings | `<h1>` through `<h6>` — sequential, no skips |
| Buttons | `<button>` not `<div onclick>` |
| Links | `<a href>` not `<span onclick>` |
| Lists | `<ul>/<ol>/<li>` |
| Tables | `<table>` with `<th scope>` and `<caption>` |
| Forms | `<label for>` associated with every input |

### 3b. Heading Hierarchy

- Every page has exactly one `<h1>` (page title)
- Headings nest sequentially: h1 → h2 → h3 (no skipping h2 to h3)
- Headings describe the content below — not used for styling only
- Screen readers use headings to navigate — every section needs one

### 3c. ARIA Usage

ARIA supplements HTML — only use when native HTML doesn't provide the semantics:

**Common correct ARIA patterns:**
```html
<!-- Icon-only button -->
<button aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Loading state -->
<div aria-live="polite" aria-atomic="true">
  <span>Loading results...</span>
</div>

<!-- Error message linked to field -->
<input aria-describedby="email-error" aria-invalid="true">
<span id="email-error" role="alert">Enter a valid email address</span>

<!-- Expanded state -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" hidden>...</ul>

<!-- Progress -->
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">65%</div>
```

**ARIA anti-patterns to avoid:**
- `aria-label` on elements that have visible text (redundant, can confuse)
- `role="button"` on `<div>` without also adding `tabindex="0"` and keyboard handlers
- `aria-hidden="true"` on focusable elements (makes keyboard-only users skip invisible elements)
- Overusing `aria-live` — triggers screen reader interruptions on every change

### 3d. Images and Icons

- **Meaningful images**: `alt="[descriptive text]"` — describe what the image communicates, not what it depicts literally
- **Decorative images**: `alt=""` (empty — screen reader skips it)
- **Icon-only buttons**: `aria-label` on the button itself; `aria-hidden="true"` on the icon SVG
- **Charts/graphs**: Provide a text summary or `aria-label` describing the key insight; offer a table alternative

### 3e. Native Mobile (iOS / Android)

**iOS VoiceOver:**
- `accessibilityLabel` — what VoiceOver reads (overrides the visible text if set)
- `accessibilityHint` — describes what happens when activated ("Double tap to open")
- `accessibilityTraits` — button, header, selected, disabled, etc.
- Focus order: set `accessibilityElements` array if default order is wrong

**Android TalkBack:**
- `contentDescription` — replaces label for non-text elements
- `importantForAccessibility="no"` — hides decorative elements
- Focus order: use `accessibilityTraversalBefore/After` when needed

---

## 4. Touch & Interaction Accessibility

### 4a. Touch Targets

| Platform | Minimum Size | Recommendation |
|---|---|---|
| iOS | 44 × 44pt | 48 × 48pt |
| Android | 48 × 48dp | 56 × 56dp |
| Web (mobile) | 44 × 44px | 48 × 48px |

If a visual element is smaller, extend the hit area beyond visible bounds:
```jsx
// React Native — use hitSlop
<Pressable hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}>
```

### 4b. Gesture Alternatives

All gesture-only interactions must have a visible control alternative:
- Swipe to delete → visible delete button in row
- Long press for context menu → overflow button (⋯)
- Drag to reorder → accessible drag handles with keyboard equivalent
- Pinch to zoom → zoom controls

### 4c. Motion & Vestibular

- Auto-playing animations must be pausable
- Parallax and large-motion effects must respond to `prefers-reduced-motion`
- Never use rapid flashing (> 3 times per second) — seizure risk

---

## 5. Forms & Error Handling

| Check | Requirement |
|---|---|
| Labels | Visible `<label>` for every field — never placeholder-only |
| Error placement | Error message adjacent to the field, not only at top of form |
| Error description | States what's wrong AND how to fix it ("Enter at least 8 characters") |
| Error announcement | `role="alert"` or `aria-live="assertive"` on error messages |
| Focus on error | After submit failure, focus moves to first invalid field |
| Required fields | Marked visually AND with `aria-required="true"` |
| Input type | Semantic `type` (email, tel, number) triggers correct mobile keyboard |
| Autocomplete | `autocomplete` attribute set to help password managers and autofill |

---

## 6. Navigation Patterns

| Check | Requirement |
|---|---|
| Page title | Unique, descriptive `<title>` per page |
| Focus on route change | After SPA navigation, focus moves to page heading or main content |
| Modal focus | Opening modal traps focus within; closing returns focus to trigger |
| Skip navigation | Present when nav precedes main content |
| Breadcrumbs | Use `<nav aria-label="Breadcrumb">` with structured list |
| Active page in nav | `aria-current="page"` on current nav item |

---

## Audit Report Format

```
# Accessibility Audit: [Screen / Flow / Component]
Date: [YYYY-MM-DD]
Platform: [Web / iOS / Android]
Standard: WCAG 2.1 [A / AA]

## Summary
- Critical issues (must fix before launch): [N]
- Major issues (fix in current sprint): [N]
- Minor issues (fix in next sprint): [N]
- Overall: [ ] Pass  [ ] Fail  [ ] Conditional pass

## Issues

### [A-001]: [Issue title]
- Severity: Critical / Major / Minor
- WCAG Criterion: [e.g., 1.4.3 Contrast (Minimum)]
- Location: [Screen name, component, line number if code]
- Who is affected: [Screen reader users / Keyboard users / Low-vision / Motor impaired]
- Problem: [What is wrong]
- Current behavior: [What happens now]
- Required behavior: [What should happen]
- Fix: [Specific change — include code snippet if applicable]

### [A-002]: [Issue title]
...

## Passed Checks
- [Category]: [What was verified and confirmed compliant]

## Recommendations (beyond AA compliance)
1. [Enhancement that improves experience beyond the minimum requirement]
2. ...
```

---

## Quick Reference — Severity Levels

| Severity | Definition | Action |
|---|---|---|
| **Critical** | Blocks assistive technology users entirely | Fix before launch — no exceptions |
| **Major** | Significantly impairs experience for AT users | Fix in current sprint |
| **Minor** | Degrades experience but doesn't block task completion | Fix in next sprint |
| **Enhancement** | Beyond AA — improves experience above minimum | Backlog |

---

## Pre-Delivery Checklist

### Visual
- [ ] All body text ≥ 4.5:1 contrast (light and dark mode)
- [ ] Large text ≥ 3:1 contrast
- [ ] UI components and icons ≥ 3:1 contrast
- [ ] Color is not sole indicator of meaning (add icons, text, or patterns)
- [ ] Layout usable at 200% zoom without horizontal scroll

### Keyboard & Focus
- [ ] All interactive elements reachable by Tab
- [ ] Tab order matches visual reading order
- [ ] Visible focus indicator on every interactive element
- [ ] No keyboard traps
- [ ] Modals trap focus correctly; Escape closes them
- [ ] After route change or modal close, focus moves to correct target
- [ ] Skip link present (if nav before main content)

### Screen Reader
- [ ] One `<h1>` per page; heading hierarchy is sequential
- [ ] Semantic HTML used throughout (no `<div>` buttons)
- [ ] All images have descriptive `alt` (or `alt=""` if decorative)
- [ ] Icon-only buttons have `aria-label`
- [ ] Form fields have associated `<label>` elements
- [ ] Error messages use `role="alert"` or `aria-live`
- [ ] ARIA attributes used correctly and sparingly

### Touch & Motion
- [ ] Touch targets ≥ 44×44pt (iOS) / 48×48dp (Android)
- [ ] Gesture-only interactions have visible alternatives
- [ ] `prefers-reduced-motion` respected
- [ ] No auto-playing animations without pause control

### Forms
- [ ] No placeholder-only labels
- [ ] Errors adjacent to fields with descriptive copy
- [ ] Focus moves to first error field on submit failure
- [ ] Required fields marked semantically (`aria-required`)
