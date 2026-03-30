import { useState, useCallback } from "react";

const DEFAULT_TOKENS = {
  brandName: "SDS",
  // Colors — mapped from SDS Color Primitives
  primary: "#2c2c2c",       // Brand/800
  primaryLight: "#f5f5f5",  // Brand/100
  primaryDark: "#1e1e1e",   // Brand/900
  secondary: "#111111",     // Brand/1000
  accent: "#444444",        // Brand/600
  success: "#14ae5c",       // Green/500
  warning: "#ffb800",       // Yellow/400 (from SDS)
  error: "#e2483d",         // Red/500 (from SDS)
  info: "#0c8ce9",          // Blue/500 (from SDS)
  neutral50: "#ffffff",     // White/1000
  neutral100: "#f5f5f5",    // Gray/100
  neutral200: "#e6e6e6",    // Gray/200
  neutral300: "#d9d9d9",    // Gray/300
  neutral400: "#b3b3b3",    // Gray/400
  neutral500: "#757575",    // Gray/500
  neutral600: "#444444",    // Gray/600
  neutral700: "#383838",    // Gray/700
  neutral800: "#2c2c2c",    // Gray/800
  neutral900: "#1e1e1e",    // Gray/900
  // Typography — from Typography Primitives
  fontHeading: "'Inter', sans-serif",
  fontBody: "'Inter', sans-serif",
  fontMono: "'Roboto Mono', monospace",
  baseSize: 16,              // Scale 03
  scaleRatio: 1.25,          // Scale progression: 12, 14, 16, 20, 24, 32
  // Spacing — from Size/Space
  spaceUnit: 4,              // Space/100 = 4px base
  // Shape — from Size/Radius
  radiusSm: 4,               // Radius/100
  radiusMd: 8,               // Radius/200
  radiusLg: 16,              // Radius/400
  radiusFull: 9999,          // Radius/Full
  // Elevation — from Size/Depth + Black opacity scale
  shadowSm: "0 1px 4px rgba(12,12,13,0.05)",        // Depth/025 offset, Black/100
  shadowMd: "0 4px 16px rgba(12,12,13,0.1)",         // Depth/100 offset, Depth/400 blur, Black/200
  shadowLg: "0 16px 32px rgba(12,12,13,0.1), 0 4px 4px rgba(12,12,13,0.05)", // Drop Shadow/400
};

const PRESETS = {
  default: { ...DEFAULT_TOKENS, brandName: "SDS" },
  corporate: {
    ...DEFAULT_TOKENS,
    brandName: "CorpKit",
    primary: "#1B365D",
    primaryLight: "#E8EDF4",
    primaryDark: "#0F1F3D",
    secondary: "#2D3748",
    accent: "#C8102E",
    fontHeading: "'Noto Serif', serif",
    fontBody: "'Inter', sans-serif",
    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 8,
    scaleRatio: 1.2,
  },
  startup: {
    ...DEFAULT_TOKENS,
    brandName: "LaunchKit",
    primary: "#7C3AED",
    primaryLight: "#EDE9FE",
    primaryDark: "#5B21B6",
    secondary: "#111827",
    accent: "#06B6D4",
    fontHeading: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    radiusSm: 8,
    radiusMd: 16,
    radiusLg: 16,
    scaleRatio: 1.333,
  },
  minimal: {
    ...DEFAULT_TOKENS,
    brandName: "Mono",
    primary: "#1e1e1e",
    primaryLight: "#f5f5f5",
    primaryDark: "#111111",
    secondary: "#383838",
    accent: "#1e1e1e",
    fontHeading: "'Inter', sans-serif",
    fontBody: "'Inter', sans-serif",
    radiusSm: 0,
    radiusMd: 0,
    radiusLg: 0,
    scaleRatio: 1.2,
  },
  warm: {
    ...DEFAULT_TOKENS,
    brandName: "Hearth",
    primary: "#B45309",
    primaryLight: "#FEF3C7",
    primaryDark: "#92400E",
    secondary: "#44403C",
    accent: "#059669",
    fontHeading: "'Noto Serif', serif",
    fontBody: "'Inter', sans-serif",
    radiusSm: 8,
    radiusMd: 16,
    radiusLg: 16,
    scaleRatio: 1.25,
  },
};

const FONT_OPTIONS = [
  "'Inter', sans-serif",
  "'Noto Serif', serif",
  "'Roboto Mono', monospace",
  "'DM Sans', sans-serif",
  "'Source Sans 3', sans-serif",
  "'Space Grotesk', sans-serif",
  "'Libre Baskerville', serif",
  "'Source Serif 4', serif",
];

const SECTIONS = ["tokens", "typography", "components", "audit", "export"];

// ─── Audit Checklist Data ────────────────────────────────────────────────────

const AUDIT_COLORS = {
  google:    { bg: "#E8F0FE", text: "#1A56DB", border: "#BFDBFE" },
  atlassian: { bg: "#E3FCEF", text: "#006644", border: "#ABF5D1" },
  carbon:    { bg: "#F2F4F8", text: "#21272A", border: "#DDE1E6" },
  apple:     { bg: "#FFF8E6", text: "#7D4E00", border: "#FFD580" },
  figma:     { bg: "#F0EFFE", text: "#4C3FB1", border: "#C4B5FD" },
  ai:        { bg: "#FEF0E7", text: "#7C2D12", border: "#FDC093" },
  a11y:      { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7" },
};

const AUDIT_SECTIONS = [
  { id: "foundations", label: "Foundations", icon: "◆", items: [
    { label: "Design tokens defined", sub: "Color, spacing, radius, elevation, shadow — all expressed as named tokens, not hard-coded values.", systems: ["google","atlassian","carbon","apple"], tags: ["figma","a11y"], prompt: "List all design tokens following Material Design 3 naming conventions, including color roles, elevation, and shape." },
    { label: "Color system documented", sub: "Primary, secondary, neutral, semantic palettes with light and dark mode variants.", systems: ["google","atlassian","carbon","apple"], tags: ["a11y"], prompt: "Generate a complete color system using Material You dynamic color with primary, secondary, tertiary, and surface roles for both light and dark mode." },
    { label: "Typography scale established", sub: "Type ramp covers display, headline, title, body, label — each with size, weight, line-height, and letter-spacing.", systems: ["google","atlassian","carbon","apple"], tags: ["figma"], prompt: "Create a typography scale covering all levels: display large/medium/small, headline, title, body, label." },
    { label: "Spacing & layout grid defined", sub: "4px or 8px base grid. Column, margin, and gutter values for each breakpoint.", systems: ["google","atlassian","carbon","apple"], tags: ["figma"], prompt: "Set up a responsive layout grid: 4px base unit, 12-column desktop, 8-column tablet, 4-column mobile." },
    { label: "Elevation & shadow system defined", sub: "Layering model — resting, raised, floating, overlay.", systems: ["google","atlassian","carbon"], tags: [], prompt: "Define elevation tokens for 5 levels: flat, raised, sticky, overlay, dialog." },
    { label: "Motion & animation principles", sub: "Duration scales, easing curves, and principles for how elements enter, exit, and transition.", systems: ["google","atlassian","apple"], tags: ["figma"], prompt: "Document the animation system: define 4 duration tokens (fast 100ms, standard 200ms, complex 400ms, gentle 600ms) and map them to easing presets." },
    { label: "Iconography system established", sub: "Icon set defined, usage rules for size (16/20/24px), weight, style, and icon-only vs. icon+label patterns.", systems: ["google","atlassian","carbon","apple"], tags: ["figma"], prompt: "Create an icon usage guide: show icon-only, icon+label, and leading/trailing icon patterns for 16, 20, and 24px sizes." },
  ]},
  { id: "core-components", label: "Core Components", icon: "■", items: [
    { label: "Button hierarchy complete", sub: "Primary, secondary, tertiary, ghost, destructive, icon-only — all with hover, focus, disabled, and loading states.", systems: ["google","atlassian","carbon","apple"], tags: ["figma","a11y"], prompt: "Build a button component with variants: type (primary/secondary/tertiary/destructive), size (sm/md/lg), state (default/hover/focus/disabled/loading)." },
    { label: "Form inputs fully specified", sub: "Text field, textarea, select, checkbox, radio, toggle — with label, helper text, validation states.", systems: ["google","atlassian","carbon","apple"], tags: ["figma","a11y"], prompt: "Create a complete form input set: text input, textarea, select — each with label, placeholder, helper text, and states: default, focus, error, success, disabled." },
    { label: "Navigation patterns defined", sub: "Top nav, side nav, breadcrumbs, tabs, pagination. Responsive behavior and active/selected states documented.", systems: ["google","atlassian","carbon","apple"], tags: ["figma"], prompt: "Design a navigation system: top nav bar, collapsible side nav, breadcrumbs, and bottom tab bar for mobile." },
    { label: "Data display components", sub: "Tables, lists, cards, data grids — with sorting, filtering, empty states, and pagination.", systems: ["atlassian","carbon","google"], tags: ["figma"], prompt: "Build a data table component with: sortable headers, row hover, row selection, empty state, and pagination controls." },
    { label: "Overlay patterns covered", sub: "Modal, drawer, tooltip, popover, toast — with opening/closing behavior and focus trap documentation.", systems: ["google","atlassian","carbon","apple"], tags: ["figma","a11y"], prompt: "Create components for: modal dialog, bottom sheet/drawer, tooltip (light/dark), and toast notification." },
    { label: "Status & feedback components", sub: "Alerts, banners, inline messages, progress indicators, badges, empty states.", systems: ["google","atlassian","carbon","apple"], tags: ["figma","a11y"], prompt: "Design a feedback set: alert banner (info/warning/success/error), progress bar, circular spinner, badge counter, and inline validation message." },
  ]},
  { id: "accessibility", label: "Accessibility", icon: "●", items: [
    { label: "Color contrast meets WCAG AA", sub: "All text/background combos pass 4.5:1 (normal text) or 3:1 (large text).", systems: ["google","atlassian","carbon","apple"], tags: ["a11y"], prompt: "Audit all color combinations for WCAG AA contrast compliance. Flag any text/background pairs that fail 4.5:1." },
    { label: "Focus states documented", sub: "Visible focus ring on every interactive element, meeting WCAG 2.4.11.", systems: ["google","atlassian","carbon","apple"], tags: ["a11y","figma"], prompt: "Add focus state variants to all interactive components: 2px offset focus ring using the system focus color token." },
    { label: "Touch target minimums met", sub: "44×44px minimum touch target for mobile patterns.", systems: ["google","apple"], tags: ["a11y"], prompt: "Annotate all interactive elements for touch target size. Flag anything below 44×44px." },
    { label: "Error messaging accessible", sub: "Errors not communicated by color alone. Icon + text label + aria-describedby annotations present.", systems: ["google","atlassian","carbon","apple"], tags: ["a11y","figma"], prompt: "Create error state annotations: error icon + red border + error message text below input. Add aria-describedby spec." },
    { label: "Screen reader annotations", sub: "Component specs include aria roles, labels, and keyboard interaction patterns.", systems: ["atlassian","carbon"], tags: ["a11y"], prompt: "Generate accessibility annotations for this modal: include aria-modal, aria-labelledby, focus trap boundary, and keyboard pattern." },
  ]},
  { id: "documentation", label: "Documentation & Handoff", icon: "◉", items: [
    { label: "Component usage guidelines", sub: "When to use, when not to use, do/don't examples.", systems: ["google","atlassian","carbon","apple"], tags: ["figma","ai"], prompt: "Write component usage guidelines: when to use, when not to use, and do/don't examples." },
    { label: "Design tokens mapped to code", sub: "Token names in Figma match token names in code (CSS custom properties, JSON, Tailwind).", systems: ["google","atlassian","carbon"], tags: ["figma"], prompt: "Generate a design token export spec: map each token to its CSS custom property name following W3C Design Tokens format." },
    { label: "Figma component anatomy annotated", sub: "Each component includes a spec frame showing measurements, spacing, and token references.", systems: ["google","atlassian","carbon"], tags: ["figma"], prompt: "Create a component anatomy frame: annotate padding, corner radius token, shadow level, and typography tokens." },
    { label: "Variant & property matrix complete", sub: "All component variants exposed as Figma component properties with consistent naming.", systems: ["google","atlassian","carbon","apple"], tags: ["figma"], prompt: "Audit component properties: list all variants, boolean props, and instance-swap slots. Flag hidden layers that should be properties." },
    { label: "Changelog maintained", sub: "Version history documents what changed, what was deprecated, and migration notes.", systems: ["atlassian","carbon"], tags: [], prompt: "Write a changelog entry: new components, deprecated patterns, token renames, and migration steps." },
  ]},
  { id: "ai-acceleration", label: "AI Acceleration", icon: "✦", items: [
    { label: "AI prompt library per component", sub: "Each component has validated prompts for generating variants in Figma or code.", systems: ["google","atlassian","carbon","apple"], tags: ["ai","figma"], prompt: "Build a reusable prompt template for this component: generate Figma variants, write docs, or scaffold production code." },
    { label: "Component generation tested", sub: "Core components validated against AI generation pipelines for token fidelity.", systems: ["google","atlassian","carbon"], tags: ["ai","figma"], prompt: "Using the design system as reference, generate a product card component in React with proper token usage." },
    { label: "System prompt crafted", sub: "A project-level system prompt defines which design system, token naming, and component patterns AI should follow.", systems: ["google","atlassian","carbon","apple"], tags: ["ai"], prompt: "Write a system prompt that instructs AI to generate UI specs following the design system: include token references, component anatomy, and accessibility annotations." },
    { label: "Design-to-dev handoff accelerated", sub: "AI-assisted redlines, token extraction, and code snippet generation validated for accuracy.", systems: ["atlassian","carbon","google"], tags: ["ai","figma"], prompt: "Given the component spec, generate a React component with TypeScript props, inline CSS tokens, and JSDoc prop documentation." },
  ]},
];

function typeScale(base, ratio, step) {
  return Math.round(base * Math.pow(ratio, step) * 100) / 100;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function contrastOn(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000" : "#fff";
}

export default function UniversalDesignSystem() {
  const [tokens, setTokens] = useState({ ...DEFAULT_TOKENS });
  const [activeSection, setActiveSection] = useState("tokens");
  const [showPanel, setShowPanel] = useState(true);
  const [aiPromptCopied, setAiPromptCopied] = useState(false);
  const [auditChecked, setAuditChecked] = useState({});
  const [auditFilter, setAuditFilter] = useState("all");
  const [expandedAuditPrompt, setExpandedAuditPrompt] = useState(null);
  const [copiedAuditPrompt, setCopiedAuditPrompt] = useState(null);

  const update = useCallback((key, val) => {
    setTokens((prev) => ({ ...prev, [key]: val }));
  }, []);

  const applyPreset = (name) => setTokens({ ...PRESETS[name] });

  const sizes = {
    xs: typeScale(tokens.baseSize, tokens.scaleRatio, -2),
    sm: typeScale(tokens.baseSize, tokens.scaleRatio, -1),
    base: tokens.baseSize,
    lg: typeScale(tokens.baseSize, tokens.scaleRatio, 1),
    xl: typeScale(tokens.baseSize, tokens.scaleRatio, 2),
    "2xl": typeScale(tokens.baseSize, tokens.scaleRatio, 3),
    "3xl": typeScale(tokens.baseSize, tokens.scaleRatio, 4),
    "4xl": typeScale(tokens.baseSize, tokens.scaleRatio, 5),
  };

  const space = (n) => tokens.spaceUnit * n;

  const cssVarsOutput = `/* ${tokens.brandName} — Design Tokens (SDS Convention) */
:root {
  /* sds-color — Background */
  --sds-color-background-brand-default: ${tokens.primary};
  --sds-color-background-brand-secondary: ${tokens.primaryLight};
  --sds-color-background-brand-hover: ${tokens.primaryDark};
  --sds-color-background-default-default: ${tokens.neutral50};
  --sds-color-background-default-secondary: ${tokens.neutral100};
  --sds-color-background-neutral-tertiary: ${tokens.neutral200};

  /* sds-color — Text */
  --sds-color-text-default-default: ${tokens.neutral900};
  --sds-color-text-default-secondary: ${tokens.neutral500};
  --sds-color-text-default-tertiary: ${tokens.neutral400};
  --sds-color-text-brand-default: ${tokens.primary};
  --sds-color-text-brand-on-brand: ${tokens.primaryLight};

  /* sds-color — Border */
  --sds-color-border-default-default: ${tokens.neutral300};
  --sds-color-border-brand-default: ${tokens.primary};
  --sds-color-border-neutral-secondary: ${tokens.neutral500};

  /* sds-color — Semantic */
  --sds-color-background-positive-default: ${tokens.success};
  --sds-color-background-warning-default: ${tokens.warning};
  --sds-color-background-danger-default: ${tokens.error};

  /* sds-color — Neutral Scale (Gray Primitives) */
  --sds-color-gray-100: ${tokens.neutral100};
  --sds-color-gray-200: ${tokens.neutral200};
  --sds-color-gray-300: ${tokens.neutral300};
  --sds-color-gray-400: ${tokens.neutral400};
  --sds-color-gray-500: ${tokens.neutral500};
  --sds-color-gray-600: ${tokens.neutral600};
  --sds-color-gray-700: ${tokens.neutral700};
  --sds-color-gray-800: ${tokens.neutral800};
  --sds-color-gray-900: ${tokens.neutral900};

  /* sds-typography */
  --sds-typography-heading-font-family: ${tokens.fontHeading};
  --sds-typography-body-font-family: ${tokens.fontBody};
  --sds-typography-code-font-family: ${tokens.fontMono};
  --sds-typography-body-size-small: ${sizes.sm}px;
  --sds-typography-body-size-medium: ${sizes.base}px;
  --sds-typography-body-size-large: ${sizes.lg}px;
  --sds-typography-heading-size-small: ${sizes.xl}px;
  --sds-typography-heading-size-base: ${sizes["2xl"]}px;
  --sds-typography-heading-size-large: ${sizes["3xl"]}px;
  --sds-typography-title-page-size: ${sizes["4xl"]}px;

  /* sds-size — Space (${tokens.spaceUnit}px base) */
  --sds-size-space-050: ${space(0.5)}px;
  --sds-size-space-100: ${space(1)}px;
  --sds-size-space-150: ${space(1.5)}px;
  --sds-size-space-200: ${space(2)}px;
  --sds-size-space-300: ${space(3)}px;
  --sds-size-space-400: ${space(4)}px;
  --sds-size-space-600: ${space(6)}px;
  --sds-size-space-800: ${space(8)}px;
  --sds-size-space-1200: ${space(12)}px;
  --sds-size-space-1600: ${space(16)}px;

  /* sds-size — Radius */
  --sds-size-radius-100: ${tokens.radiusSm}px;
  --sds-size-radius-200: ${tokens.radiusMd}px;
  --sds-size-radius-400: ${tokens.radiusLg}px;
  --sds-size-radius-full: ${tokens.radiusFull}px;

  /* sds-size — Depth / Elevation */
  --sds-shadow-sm: ${tokens.shadowSm};
  --sds-shadow-md: ${tokens.shadowMd};
  --sds-shadow-lg: ${tokens.shadowLg};
  --sds-size-stroke-border: 1px;
  --sds-size-stroke-focus-ring: 2px;
}`;

  const aiCustomizationPrompt = `You are a design system architect. I have a universal starter design system with the following current tokens:

${cssVarsOutput}

I need you to customize this for a client with the following brand:
- Brand name: [CLIENT NAME]
- Industry: [INDUSTRY]
- Brand personality: [DESCRIBE: e.g., professional yet approachable, bold and disruptive, warm and trustworthy]
- Existing brand colors (if any): [HEX VALUES]
- Existing brand fonts (if any): [FONT NAMES]
- Target audience: [DESCRIBE]

Generate a complete replacement set of CSS custom properties that:
1. Maps their brand colors into the primary/secondary/accent system
2. Recommends a type scale and font pairing appropriate for their industry
3. Adjusts border-radius to match their brand personality (sharp = corporate, round = friendly)
4. Keeps semantic colors (success/warning/error/info) accessible and conventional
5. Adjusts elevation/shadow style to match overall aesthetic

Return ONLY the updated :root {} block with comments explaining each choice.`;

  const ColorSwatch = ({ color, label, size = 48 }) => (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: tokens.radiusSm,
          background: color,
          border: "1px solid rgba(0,0,0,0.08)",
          marginBottom: 6,
        }}
      />
      <div style={{ fontSize: 10, fontFamily: tokens.fontMono, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 9, fontFamily: tokens.fontMono, color: "#bbb" }}>{color}</div>
    </div>
  );

  const SectionNav = () => (
    <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: 24 }}>
      {[
        { id: "tokens", label: "Design Tokens" },
        { id: "typography", label: "Type Scale" },
        { id: "components", label: "Components" },
        { id: "audit", label: "System Audit" },
        { id: "export", label: "Export & AI" },
      ].map((s) => (
        <button
          key={s.id}
          onClick={() => setActiveSection(s.id)}
          style={{
            background: "none",
            border: "none",
            borderBottom: activeSection === s.id ? `2px solid ${tokens.primary}` : "2px solid transparent",
            color: activeSection === s.id ? tokens.primary : "#888",
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: activeSection === s.id ? 600 : 400,
            cursor: "pointer",
            fontFamily: tokens.fontBody,
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: tokens.fontBody, background: "#FAFAF8", minHeight: "100vh", color: tokens.neutral900 }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400&family=Roboto+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;700&family=Source+Sans+3:wght@300;400;600;700&family=Source+Serif+4:wght@400;600;700&family=Space+Grotesk:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ background: tokens.secondary, color: "#fff", padding: "32px 28px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
              Simple Design System
            </div>
            <h1 style={{ fontFamily: tokens.fontHeading, fontSize: 32, fontWeight: 700, margin: "0 0 6px" }}>{tokens.brandName}</h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0 }}>Tune the knobs. Preview live. Export for your client.</p>
          </div>
          <button
            onClick={() => setShowPanel(!showPanel)}
            style={{
              background: "rgba(255,255,255,0.1)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              padding: "8px 16px",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: tokens.fontMono,
            }}
          >
            {showPanel ? "Hide" : "Show"} Controls
          </button>
        </div>
      </div>

      {/* Onboarding Guide Banner */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 28px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, padding: "14px 20px", border: "1px solid #eee", borderLeft: `4px solid ${tokens.primary}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 20 }}>📘</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Onboarding Guide</div>
              <div style={{ fontSize: 12, color: "#888" }}>New to the framework? Download the 18-slide team onboarding deck — covers the AI × UX philosophy, 6-phase framework, Figma setup, and Claude integration.</div>
              <a href="https://github.com/quinrobinson/AI-x-UX-Product-Design-Framework#quick-start--kickoff-prompt"
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: "#14B8A6", textDecoration: "none", fontWeight: 500, display: "inline-block", marginTop: 4 }}>
                Not sure where to start? Use the Kickoff Prompt →
              </a>
            </div>
          </div>
          <a href="https://github.com/quinrobinson/AI-x-UX-Product-Design-Framework/raw/main/artifacts/onboarding-deck.pptx"
            style={{ background: tokens.primary, color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, marginLeft: 16, fontFamily: tokens.fontBody }}>
            Download PPTX
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 28px 48px", display: "grid", gridTemplateColumns: showPanel ? "280px 1fr" : "1fr", gap: 24 }}>
        {/* Control Panel */}
        {showPanel && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Presets */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Presets</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    style={{
                      background: tokens.brandName === preset.brandName ? tokens.primary : "#f5f5f5",
                      color: tokens.brandName === preset.brandName ? "#fff" : "#555",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 12px",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Name */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 10 }}>Brand Name</div>
              <input
                value={tokens.brandName}
                onChange={(e) => update("brandName", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, fontFamily: tokens.fontBody, boxSizing: "border-box" }}
              />
            </div>

            {/* Colors */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Colors</div>
              {[
                ["primary", "Primary"],
                ["primaryLight", "Primary Light"],
                ["primaryDark", "Primary Dark"],
                ["secondary", "Secondary"],
                ["accent", "Accent"],
              ].map(([key, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <input type="color" value={tokens[key]} onChange={(e) => update(key, e.target.value)} style={{ width: 32, height: 24, border: "none", padding: 0, cursor: "pointer", borderRadius: 4 }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{label}</span>
                  <span style={{ fontSize: 10, fontFamily: tokens.fontMono, color: "#bbb" }}>{tokens[key]}</span>
                </div>
              ))}
            </div>

            {/* Typography */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Typography</div>
              {[
                ["fontHeading", "Heading Font"],
                ["fontBody", "Body Font"],
              ].map(([key, label]) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{label}</div>
                  <select
                    value={tokens[key]}
                    onChange={(e) => update(key, e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 12, fontFamily: tokens[key], boxSizing: "border-box" }}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f} style={{ fontFamily: f }}>{f.split("'")[1]}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Base Size: {tokens.baseSize}px</div>
                <input type="range" min={14} max={20} value={tokens.baseSize} onChange={(e) => update("baseSize", Number(e.target.value))} style={{ width: "100%" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Scale Ratio: {tokens.scaleRatio}</div>
                <input type="range" min={1.125} max={1.5} step={0.025} value={tokens.scaleRatio} onChange={(e) => update("scaleRatio", Number(e.target.value))} style={{ width: "100%" }} />
              </div>
            </div>

            {/* Shape */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Shape</div>
              {[
                ["radiusSm", "Small", 0, 16],
                ["radiusMd", "Medium", 0, 24],
                ["radiusLg", "Large", 0, 32],
              ].map(([key, label, min, max]) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 2 }}>
                    <span>{label}</span>
                    <span>{tokens[key]}px</span>
                  </div>
                  <input type="range" min={min} max={max} value={tokens[key]} onChange={(e) => update(key, Number(e.target.value))} style={{ width: "100%" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div>
          <SectionNav />

          {/* TOKENS SECTION */}
          {activeSection === "tokens" && (
            <div>
              {/* Color Palette */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Color Palette</div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Brand</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <ColorSwatch color={tokens.primary} label="Primary" />
                    <ColorSwatch color={tokens.primaryLight} label="Primary Light" />
                    <ColorSwatch color={tokens.primaryDark} label="Primary Dark" />
                    <ColorSwatch color={tokens.secondary} label="Secondary" />
                    <ColorSwatch color={tokens.accent} label="Accent" />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Semantic</div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <ColorSwatch color={tokens.success} label="Success" />
                    <ColorSwatch color={tokens.warning} label="Warning" />
                    <ColorSwatch color={tokens.error} label="Error" />
                    <ColorSwatch color={tokens.info} label="Info" />
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 12 }}>Neutrals</div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => (
                      <div key={n} style={{ flex: 1, textAlign: "center" }}>
                        <div style={{ height: 40, background: tokens[`neutral${n}`], borderRadius: 4, border: "1px solid rgba(0,0,0,0.06)" }} />
                        <div style={{ fontSize: 9, fontFamily: tokens.fontMono, color: "#aaa", marginTop: 4 }}>{n}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee", marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>
                  Spacing Scale — {tokens.spaceUnit}px base
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map((n) => (
                    <div key={n} style={{ textAlign: "center" }}>
                      <div style={{ width: 32, height: space(n), background: tokens.primaryLight, borderRadius: 3, border: `1px solid ${tokens.primary}33` }} />
                      <div style={{ fontSize: 9, fontFamily: tokens.fontMono, color: "#aaa", marginTop: 6 }}>{space(n)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shape */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Border Radius</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    ["Radius/100", tokens.radiusSm],
                    ["Radius/200", tokens.radiusMd],
                    ["Radius/400", tokens.radiusLg],
                    ["Radius/Full", tokens.radiusFull],
                  ].map(([label, val]) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ width: 56, height: 56, background: tokens.primaryLight, border: `2px solid ${tokens.primary}`, borderRadius: val }} />
                      <div style={{ fontSize: 10, fontFamily: tokens.fontMono, color: "#aaa", marginTop: 8 }}>{label} — {val === 9999 ? "full" : val + "px"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TYPOGRAPHY SECTION */}
          {activeSection === "typography" && (
            <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
              <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 24 }}>
                Type Scale — ratio {tokens.scaleRatio}
              </div>
              {Object.entries(sizes).reverse().map(([label, size]) => (
                <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 50, fontSize: 10, fontFamily: tokens.fontMono, color: "#bbb", textAlign: "right", flexShrink: 0 }}>{label}</div>
                  <div style={{ width: 50, fontSize: 10, fontFamily: tokens.fontMono, color: "#bbb", flexShrink: 0 }}>{Math.round(size)}px</div>
                  <div style={{ fontFamily: label.includes("x") || label === "sm" || label === "base" ? tokens.fontBody : tokens.fontHeading, fontSize: size, fontWeight: size > 20 ? 700 : 400, lineHeight: 1.3 }}>
                    {tokens.brandName}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 16 }}>Font Pairing Preview</div>
                <div style={{ padding: 24, background: tokens.neutral50, borderRadius: tokens.radiusMd }}>
                  <h2 style={{ fontFamily: tokens.fontHeading, fontSize: sizes["2xl"], fontWeight: 700, margin: "0 0 8px", lineHeight: 1.2 }}>The quick brown fox jumps over the lazy dog</h2>
                  <p style={{ fontFamily: tokens.fontBody, fontSize: sizes.base, lineHeight: 1.7, color: tokens.neutral600, margin: "0 0 12px" }}>
                    Typography is the voice of your interface. A strong type system creates hierarchy, guides attention, and establishes brand personality without a single pixel of color.
                  </p>
                  <code style={{ fontFamily: tokens.fontMono, fontSize: sizes.sm, background: tokens.neutral200, padding: "3px 8px", borderRadius: 4 }}>
                    const designSystem = true;
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* COMPONENTS SECTION */}
          {activeSection === "components" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Buttons */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Buttons</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  {[
                    { label: "Brand", bg: tokens.primary, color: tokens.primaryLight, border: `1px solid ${tokens.primary}` },
                    { label: "Neutral", bg: tokens.neutral200, color: tokens.neutral900, border: `1px solid ${tokens.neutral500}` },
                    { label: "Outline", bg: "transparent", color: tokens.neutral900, border: `1px solid ${tokens.neutral300}` },
                    { label: "Ghost", bg: "transparent", color: tokens.neutral700, border: "1px solid transparent" },
                    { label: "Danger", bg: tokens.error, color: "#fff", border: `1px solid ${tokens.error}` },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      style={{
                        background: btn.bg,
                        color: btn.color,
                        border: btn.border,
                        borderRadius: tokens.radiusMd,
                        padding: "12px 24px",
                        fontSize: 16,
                        fontWeight: 400,
                        fontFamily: tokens.fontBody,
                        cursor: "pointer",
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  {["sm", "md", "lg"].map((size) => (
                    <button
                      key={size}
                      style={{
                        background: tokens.primary,
                        color: contrastOn(tokens.primary),
                        border: "none",
                        borderRadius: tokens.radiusMd,
                        padding: size === "sm" ? "6px 14px" : size === "md" ? "10px 22px" : "14px 30px",
                        fontSize: size === "sm" ? 12 : size === "md" ? 14 : 16,
                        fontWeight: 600,
                        fontFamily: tokens.fontBody,
                        cursor: "pointer",
                      }}
                    >
                      Size {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Elements */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Inputs & Forms</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 400, display: "block", marginBottom: 8, color: tokens.neutral900 }}>Default Input</label>
                    <input
                      placeholder="Enter text..."
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: tokens.radiusMd,
                        border: `1px solid ${tokens.neutral300}`,
                        fontSize: 16,
                        fontFamily: tokens.fontBody,
                        boxSizing: "border-box",
                        outline: "none",
                        color: tokens.neutral900,
                        background: tokens.neutral50,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 14, fontWeight: 400, display: "block", marginBottom: 8, color: tokens.error }}>Error State</label>
                    <input
                      defaultValue="Invalid entry"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: tokens.radiusMd,
                        border: `1px solid ${tokens.error}`,
                        fontSize: 16,
                        fontFamily: tokens.fontBody,
                        boxSizing: "border-box",
                        outline: "none",
                        color: tokens.neutral900,
                        background: tokens.neutral50,
                      }}
                    />
                    <div style={{ fontSize: 14, color: tokens.error, marginTop: 6 }}>This field is required</div>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Cards</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {[
                    { title: "Flat", shadow: "none", border: `1px solid ${tokens.neutral300}` },
                    { title: "Elevated", shadow: tokens.shadowMd, border: `1px solid ${tokens.neutral300}` },
                    { title: "Prominent", shadow: tokens.shadowLg, border: "1px solid transparent" },
                  ].map((card) => (
                    <div
                      key={card.title}
                      style={{
                        padding: 32,
                        borderRadius: tokens.radiusMd,
                        background: tokens.neutral50,
                        border: card.border,
                        boxShadow: card.shadow,
                      }}
                    >
                      <div style={{ fontFamily: tokens.fontHeading, fontWeight: 600, fontSize: 24, marginBottom: 12, lineHeight: 1.2, letterSpacing: "-0.48px" }}>{card.title}</div>
                      <p style={{ fontSize: 16, color: tokens.neutral500, lineHeight: 1.4, margin: 0, fontFamily: tokens.fontBody }}>Card component with {card.title.toLowerCase()} treatment for content hierarchy.</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges & Tags */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Badges & Status</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { label: "Positive", bg: "#ebffee", color: "#02542d" },
                    { label: "Warning", bg: "#fff8e6", color: "#7d4e00" },
                    { label: "Danger", bg: "#ffebeb", color: "#c62828" },
                    { label: "Default", bg: tokens.neutral100, color: tokens.neutral600 },
                    { label: "Brand", bg: tokens.primaryLight, color: tokens.primary },
                    { label: "Neutral", bg: tokens.neutral200, color: tokens.neutral900 },
                  ].map((b) => (
                    <span
                      key={b.label}
                      style={{
                        background: b.bg,
                        color: b.color,
                        padding: "5px 14px",
                        borderRadius: tokens.radiusFull,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: tokens.fontBody,
                      }}
                    >
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Alert */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 20 }}>Alerts</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { type: "Positive", bg: "#ebffee", border: "#14ae5c", color: "#02542d", msg: "Your changes have been saved successfully." },
                    { type: "Warning", bg: "#fff8e6", border: "#ffb800", color: "#7d4e00", msg: "Please review your entries before continuing." },
                    { type: "Danger", bg: "#ffebeb", border: tokens.error, color: "#c62828", msg: "Something went wrong. Please try again." },
                  ].map((a) => (
                    <div
                      key={a.type}
                      style={{
                        padding: "14px 18px",
                        borderRadius: tokens.radiusMd,
                        background: a.bg,
                        borderLeft: `4px solid ${a.border}`,
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13, color: a.color, marginBottom: 2 }}>{a.type}</div>
                      <div style={{ fontSize: 13, color: tokens.neutral700 }}>{a.msg}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AUDIT SECTION */}
          {activeSection === "audit" && (
            <div>
              {/* Intro */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 24, border: "1px solid #eee", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999", marginBottom: 6 }}>Design System Audit</div>
                    <div style={{ fontSize: 14, color: "#666" }}>Check your system against Material Design 3, Atlassian, IBM Carbon, and Apple HIG.</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: tokens.primary }}>
                      {Math.round((Object.values(auditChecked).filter(Boolean).length / AUDIT_SECTIONS.reduce((a, s) => a + s.items.length, 0)) * 100)}%
                    </div>
                    <div style={{ fontSize: 11, color: "#999" }}>
                      {Object.values(auditChecked).filter(Boolean).length} / {AUDIT_SECTIONS.reduce((a, s) => a + s.items.length, 0)} items
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, background: "#eee", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: tokens.primary, borderRadius: 3, transition: "width 0.3s", width: `${(Object.values(auditChecked).filter(Boolean).length / AUDIT_SECTIONS.reduce((a, s) => a + s.items.length, 0)) * 100}%` }} />
                </div>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[
                  { id: "all", label: "All items" },
                  { id: "figma", label: "Figma" },
                  { id: "a11y", label: "Accessibility" },
                  { id: "ai", label: "AI Acceleration" },
                ].map((f) => (
                  <button key={f.id} onClick={() => setAuditFilter(f.id)} style={{
                    background: auditFilter === f.id ? tokens.primary : "#f5f5f5",
                    color: auditFilter === f.id ? "#fff" : "#666",
                    border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}>{f.label}</button>
                ))}
              </div>

              {/* Sections */}
              {AUDIT_SECTIONS.map((section) => {
                const filteredItems = auditFilter === "all" ? section.items : section.items.filter((item) => item.tags.includes(auditFilter));
                if (filteredItems.length === 0) return null;
                const sectionComplete = filteredItems.filter((_, i) => auditChecked[`${section.id}-${i}`]).length;

                return (
                  <div key={section.id} style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 24, border: "1px solid #eee", marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>{section.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{section.label}</span>
                      </div>
                      <span style={{ fontSize: 11, fontFamily: tokens.fontMono, color: "#999" }}>
                        {sectionComplete}/{filteredItems.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {filteredItems.map((item, i) => {
                        const key = `${section.id}-${i}`;
                        const checked = auditChecked[key] || false;
                        const promptKey = `${section.id}-${i}`;
                        return (
                          <div key={i} style={{ borderRadius: 10, border: "1px solid #eee", overflow: "hidden", opacity: checked ? 0.6 : 1 }}>
                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", cursor: "pointer" }}
                              onClick={() => setAuditChecked((prev) => ({ ...prev, [key]: !prev[key] }))}>
                              <div style={{
                                width: 20, height: 20, borderRadius: 6, border: checked ? "none" : "2px solid #ccc",
                                background: checked ? tokens.primary : "transparent", flexShrink: 0, marginTop: 2,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#fff", fontSize: 12, fontWeight: 700,
                              }}>{checked ? "✓" : ""}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, textDecoration: checked ? "line-through" : "none" }}>{item.label}</div>
                                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4 }}>{item.sub}</div>
                                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                                  {item.systems.map((sys) => (
                                    <span key={sys} style={{
                                      fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 500,
                                      background: AUDIT_COLORS[sys]?.bg || "#f5f5f5",
                                      color: AUDIT_COLORS[sys]?.text || "#555",
                                    }}>{sys === "google" ? "Material" : sys === "apple" ? "HIG" : sys.charAt(0).toUpperCase() + sys.slice(1)}</span>
                                  ))}
                                  {item.tags.map((tag) => (
                                    <span key={tag} style={{
                                      fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 500,
                                      background: AUDIT_COLORS[tag]?.bg || "#f5f5f5",
                                      color: AUDIT_COLORS[tag]?.text || "#555",
                                    }}>{tag === "a11y" ? "A11y" : tag === "ai" ? "AI" : tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                                  ))}
                                </div>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); setExpandedAuditPrompt(expandedAuditPrompt === promptKey ? null : promptKey); }}
                                style={{ background: "#f5f5f5", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", color: "#888", flexShrink: 0 }}>
                                {expandedAuditPrompt === promptKey ? "Hide" : "Prompt"}
                              </button>
                            </div>
                            {expandedAuditPrompt === promptKey && (
                              <div style={{ padding: "0 16px 14px" }}>
                                <pre style={{
                                  fontFamily: tokens.fontMono, fontSize: 11, background: "#1a1a1a", color: "#e0e0e0",
                                  padding: 14, borderRadius: 8, whiteSpace: "pre-wrap", lineHeight: 1.6, margin: "0 0 8px",
                                }}>{item.prompt}</pre>
                                <button onClick={() => { navigator.clipboard.writeText(item.prompt); setCopiedAuditPrompt(promptKey); setTimeout(() => setCopiedAuditPrompt(null), 2000); }}
                                  style={{ background: copiedAuditPrompt === promptKey ? "#16A34A" : tokens.primary, color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", fontSize: 11, fontWeight: 500, cursor: "pointer" }}>
                                  {copiedAuditPrompt === promptKey ? "✓ Copied" : "Copy prompt"}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EXPORT SECTION */}
          {activeSection === "export" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* CSS Variables */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999" }}>CSS Custom Properties</div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(cssVarsOutput); }}
                    style={{ background: tokens.primary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Copy CSS
                  </button>
                </div>
                <pre style={{
                  fontFamily: tokens.fontMono,
                  fontSize: 11,
                  background: "#1a1a1a",
                  color: "#e0e0e0",
                  padding: 20,
                  borderRadius: 10,
                  overflow: "auto",
                  maxHeight: 400,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {cssVarsOutput}
                </pre>
              </div>

              {/* AI Customization Prompt */}
              <div style={{ background: "#fff", borderRadius: tokens.radiusLg, padding: 28, border: "1px solid #eee" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "#999" }}>AI Customization Prompt</div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(aiCustomizationPrompt); setAiPromptCopied(true); setTimeout(() => setAiPromptCopied(false), 2000); }}
                    style={{ background: aiPromptCopied ? "#16A34A" : tokens.secondary, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    {aiPromptCopied ? "✓ Copied" : "Copy Prompt"}
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "#888", lineHeight: 1.6, margin: "0 0 16px" }}>
                  Paste this prompt into Claude along with your client's brand guidelines. It will generate a complete set of customized tokens you can paste back into this system.
                </p>
                <pre style={{
                  fontFamily: tokens.fontMono,
                  fontSize: 11,
                  background: "#1a1a1a",
                  color: "#e0e0e0",
                  padding: 20,
                  borderRadius: 10,
                  overflow: "auto",
                  maxHeight: 300,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {aiCustomizationPrompt}
                </pre>
              </div>

              {/* Packaging Guide */}
              <div style={{ background: tokens.secondary, borderRadius: tokens.radiusLg, padding: 28, color: "#fff" }}>
                <div style={{ fontSize: 10, fontFamily: tokens.fontMono, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Client Delivery Checklist</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[
                    { title: "Token File", desc: "Export CSS custom properties or JSON tokens for their tech stack (Tailwind config, Style Dictionary, Figma tokens)" },
                    { title: "Component Library", desc: "Document each component with props, states, accessibility notes, and usage guidelines" },
                    { title: "Brand Application", desc: "Show tokens applied to 3-5 real screens from their product as proof of concept" },
                    { title: "Governance Guide", desc: "Define who can modify tokens, how to request changes, and versioning strategy" },
                  ].map((item) => (
                    <div key={item.title}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
