---
name: visual-design-execution
phase: 03 — Ideate / 04 — Prototype
description: >
  Select visual styles, build color systems, pair typography, define spacing scales, and produce
  production-quality UI across web and mobile. Use this skill whenever the user asks to choose a
  visual direction, create a design system from scratch, apply a color palette, pick font pairings,
  set up dark/light mode, define animation timing, specify icon conventions, or make any decision
  about how a product looks, feels, or moves. Also triggers when a UI looks "not professional
  enough," when visual consistency needs fixing, or when building any page, component, or screen
  across React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, or HTML/CSS. Always use
  alongside concept-generation and design-systems for full ideation-to-delivery coverage.
claude_surface: chat
ai_leverage: high
---

# Visual Design Execution

Translate a product brief into a cohesive visual system — style, color, typography, spacing,
motion, and icons — then apply it consistently across every screen and component.

---


## Claude Surface

**Use Claude Chat** (`claude.ai`) for color system decisions, typography pairing, spacing
scale definition, and motion guidance.

Upload `visual-design-execution.md` with your concept direction brief. Claude generates
token names, hex values, type scales, and usage rules as structured text you can paste
directly into Figma or a tokens file.

> **Add Claude Code** if you want to write token output to a `tokens.css` or `tokens.json`
> file, or push the token set to your design system repo.

## Step 1 — Select the Visual Style

Match style to the product's domain, audience, and brand personality.

### Style Selection Framework

| Priority | Question | Answer → Direction |
|---|---|---|
| 1 | Who is the primary user? | Consumer → warmer/expressive; B2B/enterprise → restrained/data-dense |
| 2 | What industry/domain? | Fintech → trust (clean, dark, geometric); Health → calm (soft, light) |
| 3 | What device context? | Mobile-first → large touch targets; Desktop-first → information density OK |
| 4 | What's the brand personality? | Professional, playful, premium, minimal, bold |
| 5 | What are competitors doing? | Match to set expectations; deviate only where differentiation is intentional |

### Style → Product Mapping

| Style | Best For | Avoid When |
|---|---|---|
| **Glassmorphism** | Premium consumer apps, dashboards, landing pages | Data-heavy B2B, accessibility-critical, low-end devices |
| **Minimalism** | SaaS, productivity, documentation | Needs visual hierarchy through texture |
| **Bento Grid** | Portfolios, feature showcases, marketing sites | Mobile-primary; content-heavy flows |
| **Claymorphism** | Consumer apps, onboarding, playful brands | Enterprise, healthcare, fintech |
| **Brutalism** | Creative agencies, editorial, portfolio | E-commerce checkout, healthcare, financial services |
| **Dark mode** | Developer tools, media, productivity | Healthcare, consumer finance, accessibility-first |
| **Flat / Material** | Cross-platform apps, Android, broad audiences | Luxury, premium, highly differentiated brands |

**Anti-pattern:** Never mix style systems. Glassmorphism cards + flat nav + neumorphic buttons = incoherent.

---

## Step 2 — Build the Color System

### Palette Selection by Domain

| Domain | Primary Range | Mood | Avoid |
|---|---|---|---|
| Fintech / Banking | Navy, Deep Blue, Slate | Trust, stability | Bright primaries, pastels |
| Healthcare / Wellness | Soft Blue, Teal, Sage Green | Calm, care | High-contrast red/orange |
| SaaS / Productivity | Indigo, Violet, Cool Gray | Focused, modern | Warm yellows |
| E-commerce | Brand-driven + neutral base | Conversion-focused | Muted palettes |
| Creative / Agency | Bold, high-contrast | Confident, differentiated | Generic blues and grays |
| Developer Tools | Dark bg, code green, electric blue | Precise, technical | Pastels |

### Semantic Token Architecture

Always define color as semantic tokens — never raw hex in components:

```

## Color Tokens

### Brand
--color-brand-primary:     // Main CTA, active states, links
--color-brand-secondary:   // Supporting, hover variants
--color-brand-accent:      // Highlights, badges

### Semantic
--color-success:   // Confirmations, completed states
--color-warning:   // Caution, pending
--color-error:     // Destructive, failures, validation
--color-info:      // Informational, neutral alerts

### Surface (Light)
--color-surface-primary:   #FFFFFF   // Page background
--color-surface-secondary:           // Cards, panels
--color-surface-tertiary:            // Subtle sections, input fills

### Surface (Dark)
--color-surface-primary-dark:    // e.g. #0F172A
--color-surface-secondary-dark:  // e.g. #1E293B
--color-surface-tertiary-dark:   // e.g. #334155

### Text
--color-text-primary:    // Body copy, headings
--color-text-secondary:  // Labels, captions
--color-text-disabled:   // Disabled (opacity 0.38–0.5)
--color-text-inverse:    // Text on dark/brand backgrounds

### Border
--color-border-subtle:   // Light dividers
--color-border-default:  // Standard separators
--color-border-strong:   // Focus rings, emphasis
```

### Light/Dark Pairing Rules

- Dark mode uses **desaturated, lighter tonal variants** — NOT inverted colors
- Brand primary in dark mode: 15–20% lighter than light mode variant
- Surface hierarchy: primary < secondary < tertiary (each step 5–8% lighter in dark)
- Test contrast **separately** in both modes — inversion does not preserve ratios
- Borders need higher opacity in dark mode (0.15 → 0.25) for the same visual weight
- Always design both modes in parallel, not dark as an afterthought

### Contrast Requirements (WCAG AA minimum)

| Text Type | Required Ratio |
|---|---|
| Body text (both modes) | ≥ 4.5:1 |
| Large text (18px+ or 14px+ bold) | ≥ 3:1 |
| Secondary/muted text | ≥ 4.5:1 (light) / ≥ 3:1 (dark minimum) |
| Meaningful icons | ≥ 3:1 |
| Error / success states | ≥ 4.5:1 |

---

## Step 3 — Define Typography

### Pairing Principles

- Heading should have personality; Body must prioritize readability
- Pair serif with sans-serif, or geometric with humanist sans
- Use **1.25 ratio** (Major Third) for most products; **1.333** for editorial
- Minimum body: **16px web** (prevents iOS auto-zoom); **14sp Android**

### Domain Pairings

| Domain | Heading | Body |
|---|---|---|
| SaaS / Productivity | Inter, DM Sans | Inter |
| Finance / Legal | Playfair Display | Source Sans Pro |
| Healthcare | Lato | Lato |
| Creative / Editorial | Fraunces, Cormorant | Plus Jakarta Sans |
| Developer Tools | JetBrains Mono | Inter |
| Enterprise B2B | IBM Plex Sans | IBM Plex Sans |
| Startup / Consumer | Cabinet Grotesk | Satoshi |

### Type Scale

```
--text-xs:    12px / 16px   // Captions, labels, badges
--text-sm:    14px / 20px   // Secondary copy, helper text
--text-base:  16px / 24px   // Body text (minimum on web)
--text-lg:    18px / 28px   // Lead paragraphs
--text-xl:    20px / 28px   // Card titles
--text-2xl:   24px / 32px   // Section headings
--text-3xl:   30px / 36px   // Page headings
--text-4xl:   36px / 40px   // Hero subheadings
--text-5xl:   48px / 52px   // Hero headlines

## Weights
--weight-regular:  400   // Body text
--weight-medium:   500   // Labels, navigation, UI elements
--weight-semibold: 600   // Subheadings
--weight-bold:     700   // Headings only

## Line length
--measure-md: 65ch   // Body paragraphs (optimal)
--measure-lg: 75ch   // Max desktop width
```

---

## Step 4 — Spacing Scale

Use a 4pt base unit. All values are multiples of 4.

```
--space-1:  4px    // Icon gaps, tight list items
--space-2:  8px    // Inline padding, close related elements
--space-3:  12px   // Button padding, compact layouts
--space-4:  16px   // Standard component padding (default)
--space-5:  20px   // Form field gaps
--space-6:  24px   // Card padding, subgroups
--space-8:  32px   // Between unrelated elements
--space-10: 40px   // Section breaks, mobile page padding
--space-12: 48px   // Large section dividers
--space-16: 64px   // Hero padding, top-level page sections
--space-24: 96px   // Maximum section spacing (desktop)
```

**Rule:** Related elements: small gap. Section breaks: 3–4× that gap.

---

## Step 5 — Shape & Elevation

### Border Radius Philosophy

| Range | Personality | Use For |
|---|---|---|
| 0–4px | Enterprise, finance, formal | Data tables, professional B2B |
| 6–12px | Most SaaS, productivity | Default — balances professional + friendly |
| 16–24px | Consumer, playful | Onboarding cards, lifestyle apps |
| 9999px | Pill shapes | Badges, tags, toggles (use sparingly) |

```
--radius-sm:   4px     // Inputs, small interactive elements
--radius-md:   8px     // Buttons, cards (most products)
--radius-lg:   12px    // Modals, panels
--radius-xl:   16px    // Full-bleed cards
--radius-pill: 9999px  // Badges, tags
```

### Elevation Scale (max 3 levels per screen)

```
--elevation-0: none                                      // Flat, page bg
--elevation-1: 0 1px 3px rgba(0,0,0,0.08)              // Cards, dropdowns
--elevation-2: 0 4px 12px rgba(0,0,0,0.12)             // Modals, floating panels
--elevation-3: 0 8px 24px rgba(0,0,0,0.16)             // Toasts, overlays

// Dark mode: replace shadows with borders
--elevation-1-dark: 0 0 0 1px rgba(255,255,255,0.10)
--elevation-2-dark: 0 0 0 1px rgba(255,255,255,0.15)
```

---

## Step 6 — Motion Timing

| Interaction | Duration | Easing |
|---|---|---|
| Hover / color change | 100–150ms | ease-out |
| Button press | 80–100ms | ease-out |
| Toggle / checkbox | 150–200ms | ease-out |
| Dropdown / panel | 200–250ms | ease-out (in) / ease-in (out) |
| Modal enter | 250–300ms | ease-out |
| Modal exit | 150–200ms | ease-in |
| Page transition | 200–300ms | ease-in-out |

**Animation rules:**
- Animate `transform` and `opacity` only — never `width`, `height`, `top`, `left` (causes layout reflow)
- Ease-out for entering; ease-in for exiting
- Max 1–2 animated elements per view
- Skeleton screens for loads > 300ms (not spinners for determinate waits)
- Always respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## Step 7 — Icon Standards

- **One icon library** — never mix Lucide, Heroicons, and Material Icons in the same product
- **SVG only** — no raster PNG, no emoji as structural icons
- **Consistent stroke width** — 1.5px or 2px, never mixed
- **One style per hierarchy level** — filled (active/selected) or outlined (inactive)
- **Touch targets**: ≥ 44×44pt (iOS) / ≥ 48×48dp (Android)
- **Contrast**: ≥ 3:1 minimum; 4.5:1 for small/complex icons
- **Size tokens**: icon-sm: 16px | icon-md: 20px | icon-lg: 24px | icon-xl: 32px

---

## Step 8 — Design System Instantiation (Figma Make + Claude Code MCP)

After the full token set is defined (Steps 1–7), generate a living design system reference using Figma Make — with both token values *and* components rendered against them. This closes the manual copy-paste loop and validates the visual language as a working system before any screen is built.

### Why components, not just tokens

Tokens alone are abstract — a hex value doesn't tell you if the primary button reads correctly against the surface color, or if the error state has enough contrast in dark mode. Components make the token system tangible. If a component looks wrong here, you catch it now — not mid-prototype.

### Step 8a: Generate the Figma Make Design System Reference

Use this prompt to generate a design system reference page in Figma Make:

**Claude prompt:**
> "Generate a Figma Make prompt that creates a design system reference page for this visual system.
>
> The reference page should include:
> 1. **Color palette** — swatches for all brand, semantic, surface, and text tokens with token names as labels
> 2. **Typography scale** — text specimens for every size token (xs through 5xl) showing the heading and body fonts
> 3. **Spacing scale** — a visual ruler showing each spacing step (space-1 through space-24) with labels
> 4. **Core components** rendered using the token values:
>    - Primary button (default, hover, disabled states)
>    - Secondary/outline button
>    - Text input (default, focused, error states)
>    - Card with body text and a CTA
>    - Navigation item (active and inactive)
>    - Badge/tag
>    - Alert (success, warning, error variants)
> 5. **Light and dark mode** side by side for each component
>
> Format the output as a single Figma Make prompt under 250 words.
>
> Token set: [paste complete token output from Steps 1–7]
> Style: [selected visual style — e.g. Minimalism, Glassmorphism]
> Heading font: [name] | Body font: [name]"

After generating in Figma Make, record the reference page URL:

```
Design system reference (Figma Make): [URL]
Components validated: [list — button / input / card / nav / badge / alert]
Dark mode: [validated yes/no]
Issues found: [any token combination that looked wrong — fix before prototyping]
```

---

### Step 8b: Push Tokens to Figma Variables (Claude Code MCP)

After validating the token system visually, push the token values into your Figma file as Variables using Claude Code with the Figma MCP.

**Requirements:**
- Claude Code installed locally (`npm install -g @anthropic-ai/claude-code`)
- Figma desktop app open (not browser)
- Figma personal access token configured in MCP settings
- Your project Figma file open

**Claude Code prompt:**
> "Using the Figma MCP, create a Variables collection in the current Figma file for this token set.
>
> Create collections:
> - **Colors** — all color tokens as Color variables, organized into groups: Brand / Semantic / Surface / Text / Border
> - **Typography** — text size and weight tokens as Number variables
> - **Spacing** — all spacing step tokens as Number variables
> - **Radius** — border radius tokens as Number variables
> - **Motion** — duration tokens as Number variables
>
> For each token: name it using the CSS custom property name (e.g. `color/brand/primary`), set the light mode value, and where dark mode values are defined, set up a dark mode mode toggle.
>
> Token set: [paste complete token output]"

**What this produces:** Every token from Steps 1–7 lives in Figma Variables. Designers use them from the fill/stroke picker. No copy-paste. No drift between the token spec and the Figma file.

---

### Step 8c: Validate Component Rendering

After the reference page generates and tokens are pushed, do a quick visual validation pass before marking Visual Design complete.

**Claude prompt:**
> "Review the design system reference page screenshot and identify any token combination that needs adjustment.
>
> Check specifically:
> - Primary button text contrast against brand primary background
> - Input border visibility against surface secondary background
> - Error state text and icon visibility in both light and dark mode
> - Card content legibility against surface secondary
> - Navigation active state distinguishability from inactive
>
> For each issue found: name the tokens involved, the contrast ratio (if measurable), and the fix.
>
> Reference page: [paste screenshot or describe what you see]
> Token set: [paste]"

Fix any issues in the token set before moving to Prototype. The Prototype phase opens with a validated, populated Figma component library — not a blank file.

---

## Pre-Delivery Visual QA

- [ ] One style system applied throughout (no mixing)
- [ ] All colors reference semantic tokens — no raw hex in components
- [ ] Light and dark mode both tested (not assumed from one mode)
- [ ] Body text ≥ 4.5:1 contrast in both modes
- [ ] Secondary text meets minimum contrast in dark mode
- [ ] Body text ≥ 16px web / 14sp Android
- [ ] All spacing is a multiple of 4
- [ ] No horizontal scroll at 375px (mobile breakpoint)
- [ ] Fixed elements respect safe areas (notch, gesture bar)
- [ ] Animations ≤ 300ms, transform/opacity only
- [ ] `prefers-reduced-motion` handled
- [ ] Single icon library, consistent stroke width
- [ ] Touch targets ≥ 44pt / 48dp
- [ ] No emoji as icons

---

## Phase Handoff Block

At the close of Visual Design Execution, generate this block. Combine it with the Concept Generation handoff, or use standalone when the visual system is defined separately before prototyping.

```

## Handoff: Visual Design → Prototype
### From: Visual Design Execution
### Project: [PROJECT NAME]
### Date: [DATE]

---

### Design System Tokens (copy into prototype)

#### Color
- Brand primary: [hex] — [token name]
- Brand secondary: [hex] — [token name]
- Surface primary (light): [hex] | (dark): [hex]
- Surface secondary (light): [hex] | (dark): [hex]
- Text primary: [hex] | secondary: [hex]
- Border default: [hex]
- Success: [hex] | Warning: [hex] | Error: [hex]

#### Typography
- Heading font: [Font name] — weights: [600, 700]
- Body font: [Font name] — weight: 400 (body), 500 (labels)
- Base size: [16px web / 14sp Android]
- Scale: xs [12] / sm [14] / base [16] / lg [18] / xl [20] / 2xl [24] / 3xl [30]

#### Spacing & Shape
- Base unit: 4px — scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Border radius: sm [4px] / md [8px] / lg [12px] / pill [9999px]
- Elevation: L1 [shadow value] / L2 [shadow value]

#### Motion
- Fast: 100ms | Normal: 200ms | Slow: 300ms
- Easing: ease-out (enter) / ease-in (exit)

### Style Rules for Prototype
- Visual style: [Chosen style]
- Icon library: [Library name + stroke width]
- Dark mode: [Supported yes/no — tokens defined yes/no]

### Design system instantiation (Figma Make + Claude Code MCP)
- **Reference page URL:** [Figma Make design system reference — or "not generated"]
- **Components validated:** [button / input / card / nav / badge / alert — or "pending"]
- **Figma Variables pushed:** [yes / no / partial]
- **Issues resolved:** [list any token adjustments made after reference page review — or "none"]

### What Prototype Should Enforce
[1–2 sentences on the most important visual rules to get right in the prototype]

---
*Paste these tokens as context when opening the Prototyping skill.*
*If Figma Variables were pushed, the Prototype phase can use tokens directly from the Figma Variables picker.*
*Claude will apply them consistently across all screens and components.*
```
