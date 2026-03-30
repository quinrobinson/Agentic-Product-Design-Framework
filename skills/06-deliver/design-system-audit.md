---
name: design-system-audit
phase: 06 — Deliver
description: >
  Audit a product's design system before handoff against four industry standards —
  Google Material Design 3, Atlassian, IBM Carbon, and Apple HIG. Covers foundations,
  core components, complex patterns, accessibility, documentation, and AI acceleration.
  Use at the end of a project cycle when preparing for engineering handoff, design system
  release, or cross-team documentation. Not a discovery or ideation tool — run this when
  the system is built and needs to be validated before shipping.
ai_leverage: high
figma_page: 07 — Design System
when_to_use: >
  Run this audit at the Deliver phase — after components are built and before handoff.
  Pair with design-delivery.md for the full Deliver phase workflow.
---

# Design System Audit

Validate your design system is complete, accessible, and documented before it ships.
Run this checklist when you are preparing for engineering handoff or a design system release.

---

## How to Use This Skill

Upload this file to Claude at the start of a Deliver phase audit session.

**Prompt to start:**
```
I'm auditing [PRODUCT NAME]'s design system before handoff. Use this skill file to walk me through each section — Foundations, Core Components, Complex Patterns, Accessibility, Documentation, and AI Acceleration. For each item, ask me to confirm whether it exists, is partial, or is missing. At the end, generate a gap report and a prioritized action list.
```

**Status markers:**
- ✅ Exists and documented
- ⚠️ Partially complete — needs work
- ❌ Missing — needs to be created

---

## Section 1 — Foundations

### Design tokens defined
Color, spacing, radius, elevation, shadow — all expressed as named tokens, not hard-coded values.
**Reference:** Material Design 3, Atlassian, Carbon, Apple HIG

**Figma prompt:**
```
In Figma, list all design tokens for this component following Material Design 3 token naming conventions, including color roles, elevation, and shape.
```

---

### Color system documented
Primary, secondary, neutral, semantic palettes with light and dark mode variants.
**Reference:** Material Design 3, Atlassian, Carbon, Apple HIG

**Figma prompt:**
```
Generate a complete color system in Figma using Material You dynamic color with primary, secondary, tertiary, and surface roles for both light and dark mode.
```

---

### Typography scale established
Type ramp covers display, headline, title, body, label — each with size, weight, line-height, and letter-spacing.
**Reference:** Material Design 3, Atlassian, Carbon, Apple HIG

**Figma prompt:**
```
Create a typography scale in Figma covering all levels: display large/medium/small, headline, title, body, label. Use Carbon or Material type tokens.
```

---

### Spacing & layout grid defined
4px or 8px base grid. Column, margin, and gutter values for each breakpoint.
**Reference:** Material Design 3, Atlassian, Carbon, Apple HIG

**Figma prompt:**
```
Set up a responsive Figma layout grid: 4px base unit, 12-column desktop, 8-column tablet, 4-column mobile. Match IBM Carbon grid specs.
```

---

### Elevation & shadow system defined
Layering model — resting, raised, floating, overlay. Atlassian uses elevation tokens; Material uses tonal surface overlays.
**Reference:** Material Design 3, Atlassian, Carbon

**Figma prompt:**
```
Define elevation tokens in Figma for 5 levels: flat, raised, sticky, overlay, dialog. Use Atlassian elevation model with shadow + surface color pairs.
```

---

### Motion & animation principles
Duration scales, easing curves, and principles for how elements enter, exit, and transition.
**Reference:** Material Design 3, Atlassian, Apple HIG

**Figma prompt:**
```
Document the animation system in Figma: define 4 duration tokens (fast 100ms, standard 200ms, complex 400ms, gentle 600ms) and map them to easing presets.
```

---

### Iconography system established
Icon library selected, sizing scale defined (16/20/24/32px), usage rules documented.
**Reference:** Material Design 3, Atlassian, Carbon, Apple HIG

**Figma prompt:**
```
Create an icon usage guide in Figma: show icon-only, icon+label, and leading/trailing icon patterns for 16, 20, and 24px sizes using the active icon library.
```

---

## Section 2 — Core Components

### Button hierarchy complete
Primary, secondary, tertiary, ghost, destructive. All sizes and states (default, hover, focus, disabled, loading).
**Reference:** All four systems

**Figma prompt:**
```
Build a Figma button component with variants: type (primary/secondary/tertiary/destructive), size (sm/md/lg), state (default/hover/focus/disabled/loading), and icon (none/leading/trailing).
```

---

### Form inputs fully specified
Text input, textarea, select, checkbox, radio, toggle — each with all validation states.
**Reference:** All four systems

**Figma prompt:**
```
Create a complete Figma form input component set: text input, textarea, select. Each with label, placeholder, helper text, and states: default, focus, error, success, disabled.
```

---

### Navigation patterns defined
Top nav, side nav, breadcrumbs, tabs, bottom bar — with active, hover, and collapsed states.
**Reference:** All four systems

**Figma prompt:**
```
Design a Figma navigation system: top nav bar, collapsible side nav, breadcrumbs, and bottom tab bar for mobile. Include active, hover, and collapsed states.
```

---

### Data display components
Tables, lists, cards — with empty states, loading states, and pagination.
**Reference:** Material Design 3, Atlassian, Carbon

**Figma prompt:**
```
Build a Figma data table component with: sortable headers, row hover, row selection, empty state, and pagination controls. Follow Carbon data table patterns.
```

---

### Overlay patterns covered
Modal, bottom sheet, tooltip, popover, toast notification — all sizes and dismiss behaviors.
**Reference:** All four systems

**Figma prompt:**
```
Create Figma components for: modal dialog, bottom sheet/drawer, tooltip (light/dark), and toast notification. Include sizes (sm/md/lg) and action slots.
```

---

### Status & feedback components
Alert banners, progress indicators, badges, inline validation — all severity levels.
**Reference:** All four systems

**Figma prompt:**
```
Design a Figma feedback component set: alert banner (info/warning/success/error), progress bar, circular spinner, badge counter, and inline validation message.
```

---

## Section 3 — Complex Patterns

### Page-level layout patterns
Dashboard shell, detail page, list/grid views — responsive at all breakpoints.
**Reference:** Material Design 3, Atlassian, Carbon

**Figma prompt:**
```
Generate a Figma dashboard layout: top nav + collapsible left sidebar + main content area with header, filter bar, data grid, and summary metric cards. 1440px desktop.
```

---

### Onboarding & empty state flows
Empty states with illustration, headline, body, and CTA. First-run onboarding patterns.
**Reference:** All four systems

**Figma prompt:**
```
Design a Figma empty state component: illustration slot, headline, descriptive body text, and a primary CTA. Show populated vs. empty variants.
```

---

### Search & filter patterns
Search input, typeahead, filter chips, active filter display, results count, no-results state.
**Reference:** Material Design 3, Atlassian, Carbon

**Figma prompt:**
```
Build a Figma search component: search input with typeahead dropdown, filter chips row, and results list. Include loading and no-results states.
```

---

### Multi-step flows & wizards
Step indicator, progress tracking, back/forward navigation, validation per step.
**Reference:** Atlassian, Carbon

**Figma prompt:**
```
Create a Figma multi-step wizard pattern: horizontal step indicator (pending/current/complete/error), step content area, and back/continue button row.
```

---

### Responsive & adaptive patterns
Components and layouts tested at mobile (375px), tablet (768px), and desktop (1440px).
**Reference:** All four systems

**Figma prompt:**
```
Set up Figma responsive variants for a card component: auto layout with 3-column grid at 1440px, 2-column at 768px, and single-column stacked at 375px.
```

---

## Section 4 — Accessibility

### Color contrast meets WCAG AA
All text/background combinations pass 4.5:1 (text) and 3:1 (large text and UI elements).

**Figma prompt:**
```
Audit all color combinations in this Figma file for WCAG AA contrast compliance. Flag any text/background pairs that fail 4.5:1 and suggest token replacements.
```

---

### Focus states documented
Every interactive element has a visible focus ring. Keyboard tab order annotated.

**Figma prompt:**
```
Add focus state variants to all interactive Figma components: 2px offset focus ring using the system focus color token. Show keyboard tab order annotation.
```

---

### Touch target minimums met
All interactive elements are at least 44×44px touch target, even if the visual is smaller.

**Figma prompt:**
```
Audit all interactive elements in this Figma file for touch target compliance. Flag any targets smaller than 44×44px and show the invisible hit area layer technique.
```

---

### Error messaging accessible
Errors use icon + text, not color alone. Error messages are associated with the relevant field.

**Figma prompt:**
```
Review all form error states in this Figma file. Ensure each error uses an icon + text (not color alone) and annotate the aria-describedby relationship between field and error.
```

---

### Screen reader annotations complete
Interactive components have aria-label, aria-role, and state annotations for all variants.

**Figma prompt:**
```
Add screen reader annotations to all interactive components in this Figma file: aria-label for icon-only buttons, aria-expanded for accordions/dropdowns, aria-live for dynamic content zones.
```

---

## Section 5 — Documentation & Handoff

### Component usage guidelines
Each component has: when to use, when not to use, dos and don'ts.

**Figma prompt:**
```
Write usage guidelines for the [COMPONENT NAME] component: a one-sentence description, 3 when-to-use cases, 3 when-not-to-use cases, and a do/don't comparison frame.
```

---

### Design tokens mapped to code
Token names in Figma match token names in the codebase. CSS variables or style-dictionary config exists.

**Figma prompt:**
```
Generate a CSS custom property token file from the Figma variable collection. Match variable names exactly — no renaming. Output as :root { --token-name: value; } blocks by category.
```

---

### Figma component anatomy annotated
Each component frame has layer annotations showing spacing, token names, and state logic.

**Figma prompt:**
```
Create a component anatomy annotation frame for [COMPONENT NAME] in Figma: label each layer with its token reference, show spacing values with dimension annotations, and mark each variant trigger.
```

---

### Variant & property matrix complete
All component variants are exposed as Figma properties (variant, boolean, instance swap, text).

**Figma prompt:**
```
Audit the [COMPONENT NAME] Figma component for missing property coverage. List every visual state and variant, then identify which ones are not yet exposed as component properties.
```

---

### Changelog maintained
A changelog exists documenting what changed between design system versions.

**Prompt:**
```
Write a changelog entry for this design system release. Format: version number, release date, sections for Added / Changed / Fixed / Deprecated. Pull from our recent Figma changes and component updates.
```

---

## Section 6 — AI Acceleration

### AI prompt library per component
Each component has tested Claude prompts for generation, audit, and documentation.

**Prompt:**
```
Create a prompt library for [COMPONENT NAME]: one prompt to generate the component in Figma via MCP, one to audit an existing implementation against the design system, and one to write the component spec for developer handoff.
```

---

### Component generation tested
AI-generated components have been validated against the design system for token accuracy.

**Prompt:**
```
Generate [COMPONENT NAME] in Figma using the design system variable collections. After generating, audit the result: check every fill, stroke, spacing value, and typography style against the token library and list any deviations.
```

---

### System prompt crafted for design context
A CLAUDE.md or system prompt exists that gives Claude full design system context for this project.

**Prompt:**
```
Based on this design system, write a CLAUDE.md system prompt that gives an AI agent full context: token names and values, component rules, spacing scale, typography scale, accessibility requirements, and Figma MCP binding instructions.
```

---

### Design-to-dev handoff accelerated
Claude has been used to generate component specs, QA checklists, and handoff documentation.

**Prompt:**
```
Generate a complete developer handoff spec for [COMPONENT NAME]: props table, state matrix, token reference, accessibility notes, and a QA checklist. Format for Notion or a GitHub markdown file.
```

---

## Audit Output — Gap Report

Run this prompt at the end of your audit session to generate a prioritized action plan:

```
Based on the audit we just completed, generate a gap report for [PRODUCT NAME]'s design system:

1. Summary — what % of items are complete, partial, or missing
2. Critical gaps — items that will block engineering handoff
3. Nice-to-have — items that improve quality but won't block shipping
4. Recommended order of completion — prioritized by impact and effort
5. Suggested owners — which gaps are design vs. engineering responsibilities

Format as a structured Markdown document I can paste into Notion or a GitHub issue.
```

---

## Phase Handoff Block

```
DESIGN_SYSTEM_AUDIT_COMPLETE
system_name: [SYSTEM NAME]
audit_date: [DATE]
foundations_status: [complete | partial | incomplete]
components_status: [complete | partial | incomplete]
accessibility_status: [complete | partial | incomplete]
documentation_status: [complete | partial | incomplete]
critical_gaps: [list any blocking items]
handoff_ready: [yes | no | conditional]
next_skill: design-delivery.md
```
