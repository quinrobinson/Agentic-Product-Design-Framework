---
name: design-systems
title: "Design System Audit & Token Documentation"
phase: "03 — Ideate / 06 — Deliver"
description: >
  Audit a product against industry-leading design systems (Google Material,
  Atlassian, IBM Carbon, Apple HIG), document design tokens following M3
  naming conventions, and generate Figma-ready component specs and variable
  collections. Use when establishing a new design system, auditing an existing
  one, or accelerating component documentation with AI.
ai_leverage: high
figma_page: "07 — Design System"
artifacts:
  - artifacts/design-system-checklist.jsx
  - artifacts/m3-token-reference.jsx
reference_systems:
  - name: "Google Material Design 3"
    url: "https://m3.material.io"
  - name: "Atlassian Design System"
    url: "https://atlassian.design"
  - name: "IBM Carbon"
    url: "https://carbondesignsystem.com"
  - name: "Apple Human Interface Guidelines"
    url: "https://developer.apple.com/design/human-interface-guidelines"
---

# Design System Audit & Token Documentation

## Overview

The four industry-leading design systems — Google Material Design 3, Atlassian, IBM Carbon, and Apple HIG — share a common anatomy. Each covers:

- **Foundations**: tokens, color, typography, spacing, elevation, motion, iconography
- **Core components**: buttons, forms, navigation, overlays, data display, feedback
- **Complex patterns**: layouts, multi-step flows, search, empty states, responsive behavior
- **Accessibility**: contrast, focus, touch targets, screen reader annotations
- **Documentation**: usage guidelines, dev handoff, changelogs, Figma component anatomy
- **Integration**: Figma libraries, design tokens mapped to code, Dev Mode support

This skill provides structured workflows for auditing products against these systems and documenting components using M3-aligned token naming.

---

## Workflows

### 1. Design System Audit

Use the **Design System Checklist** artifact to run a full audit:

```
[PRODUCT / CLIENT NAME] needs a design system audit. Use the design-system-checklist
artifact to walk through each section — Foundations, Core Components, Complex Patterns,
Accessibility, Documentation, and AI Acceleration. Filter to [google | atlassian |
carbon | apple] as the reference system. Mark what exists, what's missing, and what
needs to be created from scratch.
```

**Output per section:**
- ✅ Exists and documented
- ⚠️ Partially complete — needs work
- ❌ Missing — needs to be created

---

### 2. Token Documentation (M3 Naming Conventions)

Use the **M3 Token Reference** artifact or the prompt below:

```
Document all design tokens for the [COMPONENT NAME] component following Material
Design 3 token naming conventions:

Component: [button | card | text-field | navigation-bar | dialog | chip | etc.]

For each token, provide:
- Token name (md.comp.[component].[element].[property])
- System token it maps to (md.sys.color.* | md.sys.elevation.* | md.sys.shape.*)
- Which states it applies to (default | hover | focus | pressed | disabled | error)
- Description of what it controls

Cover: color roles, elevation, shape/corner radius, typography, spacing.
```

#### M3 Token Name Structure

```
md.comp.[component].[element].[property]
    │       │          │         │
    │       │          │         └── color | elevation | shape | type | height
    │       │          └──────────── container | label-text | icon | outline | indicator
    │       └─────────────────────── filled-button | card | text-field | navigation-bar
    └─────────────────────────────── md = Material Design namespace
```

#### M3 System Token Roles (Color)

| Role | Token | Usage |
|------|-------|-------|
| Primary | `md.sys.color.primary` | Key actions, highlighted UI |
| On Primary | `md.sys.color.on-primary` | Text/icons on primary |
| Primary Container | `md.sys.color.primary-container` | Less prominent primary fills |
| Secondary Container | `md.sys.color.secondary-container` | Active indicator fills |
| Surface | `md.sys.color.surface` | Default backgrounds |
| Surface Container | `md.sys.color.surface-container` | Nav bars, cards |
| On Surface | `md.sys.color.on-surface` | Primary text/icons |
| On Surface Variant | `md.sys.color.on-surface-variant` | Secondary text, inactive icons |
| Outline | `md.sys.color.outline` | Borders, dividers |
| Outline Variant | `md.sys.color.outline-variant` | Subtle borders |
| Error | `md.sys.color.error` | Error states |

#### M3 Elevation Levels

| Level | Shadow dp | Surface Tint | Usage |
|-------|-----------|--------------|-------|
| Level 0 | 0dp | 0% | Flat surfaces, text fields |
| Level 1 | 1dp | 5% | Cards (elevated), menus |
| Level 2 | 3dp | 8% | Hovered cards, FABs |
| Level 3 | 6dp | 11% | Dialogs, drawers |
| Level 4 | 8dp | 12% | Dragged cards |
| Level 5 | 12dp | 14% | Navigation drawers |

#### M3 Shape Scale

| Token | Radius | Usage |
|-------|--------|-------|
| `shape.corner.none` | 0dp | Square (rare) |
| `shape.corner.extra-small` | 4dp | Text fields, chips |
| `shape.corner.small` | 8dp | Menus, snackbars |
| `shape.corner.medium` | 12dp | Cards |
| `shape.corner.large` | 16dp | Bottom sheets, dialogs |
| `shape.corner.extra-large` | 28dp | FABs |
| `shape.corner.full` | 9999dp | Buttons, badges, pills |

---

### 3. Figma Variable Collection Setup

```
Set up Figma local variable collections for [COMPONENT NAME] following M3 conventions:

Collection structure:
- Collection: "Reference" — raw hex values and numbers
- Collection: "System" — semantic roles (md.sys.color.*, md.sys.elevation.*)
- Collection: "Component" — component-scoped tokens (md.comp.*)

For each component token:
- Variable path: [Component]/[Element]/[Property]/[State]
- Variable type: COLOR | NUMBER | STRING
- Light mode value: [token value]
- Dark mode value: [dark variant token value]

Output as a structured table ready to enter into Figma's variable panel.
```

---

### 4. Component Anatomy Documentation

```
Create a Figma component anatomy specification for [COMPONENT NAME]:

Include:
1. Layer structure — how the component is built in Figma (frame, auto layout, nested components)
2. Component properties — variants, boolean props, instance swaps, text overrides
3. Spacing annotations — padding, gap, minimum width/height in dp
4. Token references — which system token applies to each layer property
5. State coverage — list all states with how each property changes per state
6. Accessibility notes — minimum touch target, focus ring spec, aria annotations

Format as a structured spec document for a Figma annotation frame.
```

---

### 5. Cross-System Comparison

```
Compare how [COMPONENT NAME] is handled across the four major design systems:

Google Material Design 3: [m3.material.io/components]
Atlassian Design System: [atlassian.design/components]
IBM Carbon: [carbondesignsystem.com/components]
Apple HIG: [developer.apple.com/design/human-interface-guidelines]

For each system, document:
- Component name and variants available
- Anatomy differences (structure, layers, sub-components)
- Token / variable approach
- Figma library availability
- Accessibility implementation
- Notable patterns we should adopt

Synthesize into: what to borrow from each, and what to do differently for [PROJECT NAME].
```

---

## Quality Checklist

### Foundations
- [ ] All design decisions expressed as named tokens (no hard-coded hex or pixel values)
- [ ] Color system covers semantic roles: primary, secondary, surface, error, neutral
- [ ] Light and dark mode variants for every color token
- [ ] Typography scale defined with M3 typescale names or equivalent
- [ ] Spacing follows 4px or 8px base unit grid
- [ ] Elevation levels documented with shadow + surface tint pairs
- [ ] Motion principles defined with duration and easing tokens
- [ ] Icon system established with usage rules per size

### Core Components
- [ ] Every button type documented (filled, outlined, text, tonal, elevated, icon)
- [ ] All form inputs covered with all validation states
- [ ] Navigation patterns defined with responsive behavior
- [ ] Data display components have empty states and loading states
- [ ] Overlays have documented focus trap and keyboard behavior
- [ ] Feedback components cover all severity levels (info / warning / success / error)

### Accessibility
- [ ] All color pairs pass WCAG AA (4.5:1 text, 3:1 large text)
- [ ] Focus states visible on every interactive element
- [ ] Touch targets meet 44×44px minimum
- [ ] Errors not communicated by color alone
- [ ] Screen reader annotations complete for interactive components

### Documentation & Handoff
- [ ] Usage guidelines include when to use / when not to use
- [ ] Figma token names match code token names
- [ ] Component anatomy annotated with spacing and token references
- [ ] All variants exposed as Figma component properties
- [ ] Changelog maintained per release

### AI Acceleration
- [ ] Prompt library created per component
- [ ] Component generation validated across AI tools (Claude, Figma AI, v0, Cursor)
- [ ] System prompt crafted for design context
- [ ] Dev handoff prompts validated for token accuracy

---

## Resources

| Resource | Link |
|----------|------|
| M3 Component tokens | https://m3.material.io/foundations/design-tokens/overview |
| M3 Color roles | https://m3.material.io/styles/color/roles |
| M3 Elevation | https://m3.material.io/styles/elevation/overview |
| M3 Shape | https://m3.material.io/styles/shape/overview |
| Atlassian tokens | https://atlassian.design/components/tokens |
| Carbon tokens | https://carbondesignsystem.com/elements/color/tokens |
| Apple HIG | https://developer.apple.com/design/human-interface-guidelines |
| W3C Design Tokens | https://www.w3.org/community/design-tokens |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22 |
| ARIA Authoring Practices | https://www.w3.org/WAI/ARIA/apg |
