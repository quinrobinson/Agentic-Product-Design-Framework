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
ai_leverage: high
---

# Visual Design Execution

Translate a product brief into a cohesive visual system — style, color, typography, spacing,
motion, and icons — then apply it consistently across every screen and component.

---

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
