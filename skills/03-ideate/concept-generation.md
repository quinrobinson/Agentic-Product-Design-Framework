---
name: concept-generation
phase: 03 — Ideate
description: >
  Generate diverse design concepts, wireframes, UI pattern recommendations, visual system
  directions, and chart type selections. Use this skill when brainstorming solutions, exploring
  different interaction models, creating wireframes, recommending UI patterns for specific user
  tasks, choosing a visual style, selecting chart types for data, or scaffolding a new design
  system. Triggers for ideation sessions, concept exploration, wireframing briefs, pattern library
  research, visual direction exploration, or any time the user needs ideas for how to solve a
  design problem visually or structurally. For detailed visual execution, pair with the
  visual-design-execution skill.
ai_leverage: high
---

# Concept Generation & Ideation

Generate a broad range of design solutions, then converge on the strongest direction.

---

## Concept Exploration

### The Five-Direction Method

For any design problem, generate concepts across this spectrum:

**1. Convention** — What most competitors do
- Study existing patterns; identify the "expected" solution users are familiar with
- Strength: Low learning curve. Risk: No differentiation.

**2. Improvement** — Better version of the existing pattern
- Take the conventional approach and refine the weakest parts
- Strength: Familiar but noticeably better. Risk: Incremental.

**3. Recombination** — Patterns borrowed from other domains
- How is this problem solved in other industries?
- Example: What if onboarding worked like a dating app? What if data entry was conversational?
- Strength: Fresh perspective. Risk: May not translate.

**4. Paradigm Shift** — Rethink the core interaction model
- Example: What if there was no dashboard? What if the interface was voice-first?
- Strength: Truly novel. Risk: High learning curve.

**5. Moonshot** — Zero constraints
- The ideal with unlimited technology, budget, and time — reveals the north star
- Strength: Reveals the aspiration. Risk: Not directly buildable.

### Concept Card Format

```
# Concept: [Name]

## Core Idea
[2–3 sentences describing the interaction model]

## Key Interaction
[The primary way users accomplish their goal]

## UX Pattern
[The foundational pattern — wizard, feed, canvas, chat, etc.]

## Visual Direction
[Style, mood, density — see visual system section below]

## Strengths
- [What makes this compelling]

## Risks
- [What could go wrong]

## Best For
[Which user segment or use case this serves]

## Open Questions
- [What needs validating before committing]
```

---

## UI Pattern Recommendations

### Pattern Selection Criteria

1. **Task complexity** — Simple task → simple pattern. Complex → progressive disclosure.
2. **Data volume** — Few items → cards. Many → table + filters. Huge → search-first.
3. **User expertise** — Novice → guided wizard. Expert → keyboard shortcuts.
4. **Frequency** — Rare → discoverability matters. Frequent → efficiency matters.
5. **Error cost** — High → confirmation, undo, preview. Low → inline, immediate.

### Pattern Reference

**Data Entry**
- Simple form: < 5 fields, single purpose
- Multi-step wizard: > 5 fields or requires guidance
- Inline editing: Frequent small updates to existing data
- Conversational: Context-dependent or unfamiliar to users

**Data Display**
- Cards: Visual content, scannable, variable length
- Tables: Structured data, comparison, sorting/filtering
- Lists: Sequential items, simple data, mobile-first
- Dashboard: Multiple metrics, overview + drill-down

**Navigation**
- Tabs: 2–7 parallel sections of equal weight
- Sidebar: Deep hierarchy, persistent navigation, desktop
- Bottom nav (mobile): 3–5 primary destinations (max 5)
- Breadcrumbs: Deep hierarchy with back-tracking needs (web, 3+ levels)

**Selection & Input**
- Dropdown: > 5 options, single select, familiar
- Radio/chips: 2–5 options, need to see all at once
- Combobox: Large option set, search + select
- Toggle: Binary on/off, immediate effect

**Navigation Anti-patterns:**
- Mixing Tab + Sidebar + Bottom Nav at the same hierarchy level
- Modals used for primary navigation flows — they break the back stack
- Bottom nav with > 5 items or nested sub-navigation
- Navigation that changes placement by page type

---

## Visual System Direction

When ideating visual direction alongside interaction concepts, evaluate these dimensions:

### Style × Product Fit

Match visual style to the product's domain and audience:

| Domain | Recommended Styles | Avoid |
|---|---|---|
| B2B SaaS | Minimalism, clean flat, subtle glassmorphism | Claymorphism, brutalism |
| Consumer / Lifestyle | Claymorphism, rounded, vibrant | Hard brutalism, dark-first |
| Fintech | Dark + deep blue, geometric, data-dense | Playful, rounded, pastel |
| Healthcare | Soft light, warm white, calm blue/teal | Dark mode, high-saturation primaries |
| Developer Tools | Dark mode, code-green, monospace elements | Soft pastels, rounded consumer styles |
| Creative / Portfolio | Brutalism, bento grid, typographic-led | Generic corporate blues |
| E-commerce | Brand-driven, warm, conversion-focused | Muted / cold / low-energy |

### Visual Concept Card

```
# Visual Direction: [Name]

## Style
[Glassmorphism / Minimalism / Claymorphism / Bento Grid / Dark / etc.]

## Color Mood
[Warm / Cool / Neutral / High-contrast / Pastel / Saturated]

## Primary Color Range
[e.g., Deep navy #0F172A with electric blue #3B82F6 accent]

## Typography Personality
[Geometric sans + humanist / Editorial serif + clean sans / Monospace-led]

## Density
[Information-dense / Airy / Balanced]

## Motion Personality
[Fluid + elastic / Crisp + instant / Subtle + purposeful]

## Strengths
[Why this direction fits this product]

## Risks
[What this direction trades off]
```

---

## Chart Type Selection

Choosing the right chart type is a design decision. Match the chart to the data relationship being communicated.

### Chart Decision Matrix

| Question | Best Chart Types |
|---|---|
| How does a value change over time? | Line chart, area chart, sparkline |
| How do categories compare? | Bar chart (vertical), horizontal bar |
| What's the part-to-whole relationship? | Donut chart, stacked bar (≤ 5 categories) |
| How are two variables correlated? | Scatter plot, bubble chart |
| What's the distribution? | Histogram, box plot |
| What's the geographic spread? | Choropleth map, dot map |
| What are the flow/connections? | Sankey diagram, network graph |
| How does a value compare to a target? | Gauge, bullet chart, progress bar |
| What's the ranking? | Horizontal bar chart (sorted), lollipop chart |
| What's happening right now? | KPI card, big number, sparkline |

### Chart Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Pie chart with > 5 segments | Impossible to compare similar-sized slices | Use horizontal bar chart, sorted |
| 3D charts | Distorts data — angles misrepresent values | Use 2D always |
| Dual-axis charts | Misleading — scales suggest false correlation | Use two separate charts |
| Relying on color alone | Fails for colorblind users | Add patterns, labels, or shapes |
| No zero baseline on bar charts | Makes small differences appear huge | Start Y axis at 0 |
| Too many data series on one chart | Visual clutter — no signal | Limit to 5–6 series; provide toggle |

### Chart UX Standards

- **Legend**: Always visible, positioned near the chart (not below a scroll fold); interactive to toggle series
- **Tooltips**: On hover (web) / tap (mobile) — show exact values; must be keyboard-accessible
- **Axis labels**: Include units; readable at mobile scale; auto-skip when crowded
- **Empty state**: "No data yet" + guidance — never a blank or broken chart frame
- **Loading state**: Skeleton or shimmer placeholder — never empty axes
- **Color**: Use accessible palettes — avoid red/green only; supplement with patterns/labels
- **Responsive**: Charts must reflow on small screens (horizontal bar instead of vertical, fewer ticks)
- **Screen reader**: Provide text summary or `aria-label` describing the chart's key insight
- **Large datasets**: For 1000+ data points, aggregate; provide drill-down for detail

---

## Design System Scaffolding

When creating a design system foundation:

```
# Design System: [Name]

## Design Principles
1. [Principle]: [What it means in practice]
2. [Principle]: [What it means in practice]
3. [Principle]: [What it means in practice]

## Typography
- Display: [Font, weight] — hero headings
- Heading: [Font, weight] — section titles
- Body: [Font, weight, minimum 16px web] — paragraph text
- Mono: [Font, weight] — code, data
- Scale ratio: [1.25 Major Third / 1.333 Perfect Fourth]

## Color
- Primary: [Token] — brand, primary actions
- Secondary: [Token] — supporting elements
- Success / Warning / Error / Info: [Tokens] — semantic feedback
- Neutral scale: [50–900] — structure and hierarchy
- Surface: primary, secondary, tertiary (light + dark variants)

## Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96

## Shape
- Border radius philosophy: [Sharp = precision / Rounded = friendly]
- Scale: sm (4px) / md (8px) / lg (12px) / pill (9999px)

## Elevation
- Level 1: Cards, dropdowns
- Level 2: Modals, floating panels
- Level 3: Toasts, overlays
- Dark mode: border outlines instead of shadows

## Motion
- Duration: Fast 100ms / Normal 200ms / Slow 300ms
- Easing: ease-out (enter) / ease-in (exit)
- Principle: Functional, not decorative
- Always: prefers-reduced-motion fallback

## Component Inventory (v1 Checklist)
- [ ] Button (primary, secondary, outline, ghost, danger, loading)
- [ ] Input (text, select, checkbox, radio, toggle, combobox)
- [ ] Card
- [ ] Modal / Dialog
- [ ] Toast / Notification
- [ ] Navigation (header, sidebar, tabs, bottom nav)
- [ ] Table (with sort, filter, pagination)
- [ ] Badge / Tag / Chip
- [ ] Avatar
- [ ] Empty state
- [ ] Loading state / Skeleton
- [ ] Data visualization (chart components)
```

---

## Wireframe Brief Format

```
# Wireframe: [Screen Name]

## User Story
As a [user], I need to [action] because [reason].

## Entry Point
How does the user arrive? [Navigation path / trigger]

## Key Elements
1. [Element]: [Purpose] — Priority: High/Medium/Low
2. ...

## Primary Action
[The main thing the user should do on this screen]

## Content Requirements
[What content appears and where it comes from]

## States
- Default | Empty | Loading | Error | Success

## Edge Cases
- [0 items? 1000 items? No permissions? Very long content?]

## Responsive Notes
- Desktop: [Layout approach]
- Tablet: [What changes]
- Mobile: [What changes]

## Chart/Data Needs
[If this screen displays data: chart type + reasoning]
```

---

## Quality Checklist

- [ ] At least 3 concept directions explored (not variations of one idea)
- [ ] Each concept has strengths AND risks identified
- [ ] Visual direction considered alongside interaction model
- [ ] Chart type selection justified against the data relationship
- [ ] Pattern recommendations address accessibility
- [ ] Design system tokens are opinionated (not generic defaults)
- [ ] Wireframe briefs include all states and edge cases
- [ ] Concepts evaluated against the problem statement, not personal preference
