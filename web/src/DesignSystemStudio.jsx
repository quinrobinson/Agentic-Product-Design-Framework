import { useState, useCallback, useMemo, useEffect } from "react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function typeScale(base, ratio, step) {
  return Math.round(base * Math.pow(ratio, step) * 100) / 100;
}
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}
function contrastOn(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000" : "#fff";
}
function lighten(hex, amt) {
  let { r, g, b } = hexToRgb(hex);
  r = Math.min(255, r + Math.round((255 - r) * amt));
  g = Math.min(255, g + Math.round((255 - g) * amt));
  b = Math.min(255, b + Math.round((255 - b) * amt));
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}
function darken(hex, amt) {
  let { r, g, b } = hexToRgb(hex);
  r = Math.max(0, Math.round(r * (1 - amt)));
  g = Math.max(0, Math.round(g * (1 - amt)));
  b = Math.max(0, Math.round(b * (1 - amt)));
  return `#${r.toString(16).padStart(2,"0")}${g.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}`;
}
function alpha(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
function luminance(hex) {
  let { r, g, b } = hexToRgb(hex);
  [r, g, b] = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1), l2 = luminance(hex2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}
function wcagLevel(ratio) {
  if (ratio >= 7) return { label: "AAA", color: "#16A34A" };
  if (ratio >= 4.5) return { label: "AA", color: "#16A34A" };
  if (ratio >= 3) return { label: "AA Large", color: "#D97706" };
  return { label: "Fail", color: "#DC2626" };
}
function adaptPrimaryForDark(primary, accent) {
  // If primary is too dark for a #111111 surface, find a suitable alternative
  const darkSurface = "#111111";
  const ratio = contrastRatio(primary, darkSurface);
  if (ratio >= 4.5) return primary; // already passes AA
  // Try accent color
  if (contrastRatio(accent, darkSurface) >= 4.5) return accent;
  // Lighten primary until it passes
  for (let amt = 0.3; amt <= 0.8; amt += 0.1) {
    const lighter = lighten(primary, amt);
    if (contrastRatio(lighter, darkSurface) >= 4.5) return lighter;
  }
  return lighten(primary, 0.7); // fallback
}

// ── Theme Definitions ────────────────────────────────────────────────────────
const THEMES = {
  precision: {
    name: "Precision", desc: "SaaS, productivity, dev tools",
    archetype: "IBM",
    primary: "#0F62FE", secondary: "#393939", accent: "#4589FF",
    success: "#24A148", warning: "#F1C21B", error: "#DA1E28", info: "#0F62FE",
    surface: "#FFFFFF", surfaceSecondary: "#F4F4F4", border: "#E0E0E0",
    textPrimary: "#161616", textSecondary: "#525252", textTertiary: "#8D8D8D",
    fontHeading: "'IBM Plex Sans', sans-serif", fontBody: "'IBM Plex Sans', sans-serif", fontMono: "'IBM Plex Mono', monospace",
    headingWeight: 600, baseSize: 14, scaleRatio: 1.2, spaceUnit: 4,
    radiusSm: 0, radiusMd: 0, radiusLg: 0, radiusFull: 9999,
    shadowSm: "0 1px 2px rgba(0,0,0,0.05)", shadowMd: "0 4px 6px rgba(0,0,0,0.07)", shadowLg: "0 10px 15px rgba(0,0,0,0.1)",
    motionFast: "100ms", motionNormal: "200ms",
    fonts: "IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500",
  },
  enterprise: {
    name: "Enterprise", desc: "B2B, fintech, healthcare",
    archetype: "Salesforce",
    primary: "#00A1E0", secondary: "#032D60", accent: "#FF6B00",
    success: "#04844B", warning: "#FE9339", error: "#C23934", info: "#00A1E0",
    surface: "#FFFFFF", surfaceSecondary: "#F4F6F9", border: "#DDDBDA",
    textPrimary: "#032D60", textSecondary: "#444444", textTertiary: "#706E6B",
    fontHeading: "'Source Sans 3', sans-serif", fontBody: "'Source Sans 3', sans-serif", fontMono: "'Source Code Pro', monospace",
    headingWeight: 600, baseSize: 14, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 4, radiusMd: 8, radiusLg: 8, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(0,0,0,0.08)", shadowMd: "0 4px 12px rgba(0,0,0,0.1)", shadowLg: "0 10px 25px rgba(0,0,0,0.12)",
    motionFast: "150ms", motionNormal: "250ms",
    fonts: "Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500",
  },
  warmth: {
    name: "Warmth", desc: "Consumer, lifestyle, wellness",
    archetype: "Claude",
    primary: "#D97757", secondary: "#141413", accent: "#6A9BCC",
    success: "#788C5D", warning: "#D4A843", error: "#C4554D", info: "#6A9BCC",
    surface: "#FAF9F5", surfaceSecondary: "#F0EFE8", border: "#E8E6DC",
    textPrimary: "#141413", textSecondary: "#78756E", textTertiary: "#B0AEA5",
    fontHeading: "'Poppins', sans-serif", fontBody: "'Lora', serif", fontMono: "'Roboto Mono', monospace",
    headingWeight: 600, baseSize: 16, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 8, radiusMd: 12, radiusLg: 16, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(20,20,19,0.06)", shadowMd: "0 4px 12px rgba(20,20,19,0.08)", shadowLg: "0 10px 25px rgba(20,20,19,0.1)",
    motionFast: "200ms", motionNormal: "300ms",
    fonts: "Poppins:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Roboto+Mono:wght@400",
  },
  bold: {
    name: "Bold", desc: "Creative, media, entertainment",
    archetype: "Spotify",
    primary: "#1DB954", secondary: "#191414", accent: "#1ED760",
    success: "#1DB954", warning: "#F59E0B", error: "#EF4444", info: "#509BF5",
    surface: "#FFFFFF", surfaceSecondary: "#F5F5F5", border: "#E0E0E0",
    textPrimary: "#191414", textSecondary: "#535353", textTertiary: "#B3B3B3",
    fontHeading: "'Space Grotesk', sans-serif", fontBody: "'DM Sans', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.333, spaceUnit: 4,
    radiusSm: 8, radiusMd: 12, radiusLg: 24, radiusFull: 9999,
    shadowSm: "0 2px 4px rgba(0,0,0,0.06)", shadowMd: "0 4px 16px rgba(0,0,0,0.1)", shadowLg: "0 12px 32px rgba(0,0,0,0.15)",
    motionFast: "150ms", motionNormal: "250ms",
    fonts: "Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400",
  },
  clinical: {
    name: "Clinical", desc: "Data platforms, dashboards",
    archetype: "Stripe",
    primary: "#635BFF", secondary: "#0A2540", accent: "#00D4FF",
    success: "#3ECF8E", warning: "#EAB308", error: "#EF4444", info: "#635BFF",
    surface: "#FFFFFF", surfaceSecondary: "#F6F9FC", border: "#E6EBF1",
    textPrimary: "#0A2540", textSecondary: "#425466", textTertiary: "#8898AA",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 600, baseSize: 13, scaleRatio: 1.125, spaceUnit: 4,
    radiusSm: 4, radiusMd: 6, radiusLg: 8, radiusFull: 9999,
    shadowSm: "none", shadowMd: "0 1px 3px rgba(0,0,0,0.06)", shadowLg: "0 4px 8px rgba(0,0,0,0.08)",
    motionFast: "80ms", motionNormal: "150ms",
    fonts: "Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500",
  },
  soft: {
    name: "Soft", desc: "Education, social, consumer",
    archetype: "Slack",
    primary: "#4A154B", secondary: "#36C5F0", accent: "#ECB22E",
    success: "#2EB67D", warning: "#ECB22E", error: "#E01E5A", info: "#36C5F0",
    surface: "#FFFFFF", surfaceSecondary: "#F8F8F8", border: "#DDDDDD",
    textPrimary: "#1D1C1D", textSecondary: "#616061", textTertiary: "#ABABAD",
    fontHeading: "'Lato', sans-serif", fontBody: "'Lato', sans-serif", fontMono: "'Roboto Mono', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 8, radiusMd: 12, radiusLg: 16, radiusFull: 9999,
    shadowSm: "0 2px 8px rgba(74,21,75,0.06)", shadowMd: "0 4px 16px rgba(74,21,75,0.08)", shadowLg: "0 8px 24px rgba(74,21,75,0.12)",
    motionFast: "200ms", motionNormal: "300ms",
    fonts: "Lato:wght@400;700;900&family=Roboto+Mono:wght@400",
  },
  discord: {
    name: "Discord", desc: "Gaming, community, developer platforms",
    archetype: "Discord",
    primary: "#5865F2", secondary: "#313338", accent: "#EB459E",
    success: "#57F287", warning: "#FEE75C", error: "#ED4245", info: "#5865F2",
    surface: "#2B2D31", surfaceSecondary: "#1E1F22", border: "#3F4147",
    textPrimary: "#F2F3F5", textSecondary: "#B5BAC1", textTertiary: "#80848E",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 700, baseSize: 15, scaleRatio: 1.2, spaceUnit: 4,
    radiusSm: 4, radiusMd: 8, radiusLg: 16, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(0,0,0,0.3)", shadowMd: "0 4px 16px rgba(0,0,0,0.4)", shadowLg: "0 8px 32px rgba(0,0,0,0.5)",
    motionFast: "150ms", motionNormal: "200ms",
    fonts: "Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500",
  },
  apple: {
    name: "Apple", desc: "Luxury consumer, premium hardware and software",
    archetype: "Apple",
    primary: "#0071E3", secondary: "#1D1D1F", accent: "#FF375F",
    success: "#34C759", warning: "#FF9F0A", error: "#FF3B30", info: "#0071E3",
    surface: "#FFFFFF", surfaceSecondary: "#F5F5F7", border: "#D2D2D7",
    textPrimary: "#1D1D1F", textSecondary: "#515154", textTertiary: "#86868B",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 600, baseSize: 17, scaleRatio: 1.125, spaceUnit: 4,
    radiusSm: 10, radiusMd: 14, radiusLg: 20, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(0,0,0,0.04)", shadowMd: "0 4px 16px rgba(0,0,0,0.06)", shadowLg: "0 8px 32px rgba(0,0,0,0.08)",
    motionFast: "250ms", motionNormal: "450ms",
    fonts: "Inter:wght@300;400;500;600;700",
  },
  bloomberg: {
    name: "Bloomberg", desc: "Financial media, news, editorial publishing",
    archetype: "Bloomberg",
    primary: "#000000", secondary: "#1B1D21", accent: "#F26322",
    success: "#00A651", warning: "#F7B924", error: "#CC0000", info: "#0061D1",
    surface: "#FFFFFF", surfaceSecondary: "#F5F5F5", border: "#CCCCCC",
    textPrimary: "#000000", textSecondary: "#333333", textTertiary: "#767676",
    fontHeading: "'Playfair Display', serif", fontBody: "'Source Sans 3', sans-serif", fontMono: "'Source Code Pro', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.333, spaceUnit: 4,
    radiusSm: 0, radiusMd: 0, radiusLg: 2, radiusFull: 9999,
    shadowSm: "none", shadowMd: "0 2px 8px rgba(0,0,0,0.08)", shadowLg: "0 4px 16px rgba(0,0,0,0.12)",
    motionFast: "100ms", motionNormal: "200ms",
    fonts: "Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@400;600&family=Source+Code+Pro:wght@400",
  },
  shopify: {
    name: "Shopify", desc: "E-commerce, marketplace, retail",
    archetype: "Shopify",
    primary: "#008060", secondary: "#303030", accent: "#5C6AC4",
    success: "#008060", warning: "#FFC453", error: "#D82C0D", info: "#5C6AC4",
    surface: "#FFFFFF", surfaceSecondary: "#F6F6F7", border: "#E1E3E5",
    textPrimary: "#202223", textSecondary: "#6D7175", textTertiary: "#8C9196",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 600, baseSize: 14, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 4, radiusMd: 8, radiusLg: 12, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(0,0,0,0.06)", shadowMd: "0 2px 8px rgba(0,0,0,0.08)", shadowLg: "0 8px 24px rgba(0,0,0,0.1)",
    motionFast: "100ms", motionNormal: "200ms",
    fonts: "Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400",
  },
  figma: {
    name: "Figma", desc: "Design tools, creative B2B, developer-first products",
    archetype: "Figma",
    primary: "#1A1A1A", secondary: "#383838", accent: "#FF7262",
    success: "#14AE5C", warning: "#FFCD29", error: "#F24822", info: "#0ACF83",
    surface: "#FFFFFF", surfaceSecondary: "#F5F5F5", border: "#1A1A1A",
    textPrimary: "#1A1A1A", textSecondary: "#383838", textTertiary: "#737373",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 700, baseSize: 14, scaleRatio: 1.2, spaceUnit: 4,
    radiusSm: 2, radiusMd: 6, radiusLg: 10, radiusFull: 9999,
    shadowSm: "2px 2px 0px #1A1A1A", shadowMd: "3px 3px 0px #1A1A1A", shadowLg: "4px 4px 0px #1A1A1A",
    motionFast: "80ms", motionNormal: "150ms",
    fonts: "Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500",
  },
  netflix: {
    name: "Netflix", desc: "Streaming, entertainment, media consumption",
    archetype: "Netflix",
    primary: "#E50914", secondary: "#E50914", accent: "#F5F5F1",
    success: "#46D369", warning: "#F5C518", error: "#E50914", info: "#54B3D6",
    surface: "#141414", surfaceSecondary: "#1F1F1F", border: "#333333",
    textPrimary: "#FFFFFF", textSecondary: "#AAAAAA", textTertiary: "#666666",
    fontHeading: "'Inter', sans-serif", fontBody: "'DM Sans', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.333, spaceUnit: 4,
    radiusSm: 2, radiusMd: 4, radiusLg: 6, radiusFull: 9999,
    shadowSm: "0 2px 8px rgba(0,0,0,0.5)", shadowMd: "0 4px 24px rgba(0,0,0,0.7)", shadowLg: "0 8px 40px rgba(0,0,0,0.8)",
    motionFast: "200ms", motionNormal: "350ms",
    fonts: "Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400",
  },
};

// ── Component Categories ─────────────────────────────────────────────────────
const COMPONENTS = [
  // Tier 1 — Core
  {
    id: "button", name: "Button", cat: "Action", tier: 1,
    desc: "The primary interactive control for triggering actions — submitting forms, opening dialogs, confirming decisions.",
    use: ["Triggering a single, clear action", "Use filled for primary actions, outlined for secondary, ghost for tertiary"],
    avoid: ["Navigation — use a link instead", "More than one primary button per view"],
    variants: ["Filled", "Outlined", "Ghost", "Danger", "Disabled", "Loading"],
    a11y: "Use a descriptive label — 'Save changes' not 'Submit'. Disabled buttons should not receive focus.",
  },
  {
    id: "textinput", name: "Text input", cat: "Input", tier: 1,
    desc: "Single-line field for capturing short-form user input — names, emails, search terms, IDs.",
    use: ["Short single-line text responses", "Pair with a label above and helper text below when context is needed"],
    avoid: ["Responses longer than one line — use Textarea", "Selecting from a fixed set — use Select or Radio"],
    variants: ["Default", "Focus", "Filled", "Disabled", "Error", "With icon"],
    a11y: "Label is mandatory and must be programmatically associated. Error messages must be linked with aria-describedby.",
  },
  {
    id: "select", name: "Select", cat: "Input", tier: 1,
    desc: "Dropdown control for choosing one option from a predefined list — used when options are known and finite.",
    use: ["5 or more options that don't all need to be visible", "When vertical space is limited"],
    avoid: ["Fewer than 5 options — use Radio instead", "When users need to type or filter — use a combobox"],
    variants: ["Default", "Open", "Selected", "Disabled", "Error"],
    a11y: "Custom implementations must support keyboard navigation and ARIA combobox role.",
  },
  {
    id: "checkbox", name: "Checkbox", cat: "Input", tier: 1,
    desc: "Binary selection control for toggling an independent option on or off, or selecting items from a list.",
    use: ["Enabling or disabling a setting", "Selecting multiple items from a list", "Confirming agreement (terms of service)"],
    avoid: ["Mutually exclusive choices — use Radio", "Immediate actions — use Toggle"],
    variants: ["Unchecked", "Checked", "Indeterminate", "Disabled", "Error"],
    a11y: "Group related checkboxes with fieldset and legend. Indeterminate state requires aria-checked='mixed' set via JavaScript.",
  },
  {
    id: "radio", name: "Radio", cat: "Input", tier: 1,
    desc: "Selection control for choosing exactly one option from a mutually exclusive set.",
    use: ["2–5 options that can't be combined", "When all options need to be visible without interaction"],
    avoid: ["More than 6 options — use Select", "Independent options that can be toggled — use Checkbox"],
    variants: ["Unselected", "Selected", "Disabled", "Error", "With description"],
    a11y: "Always group radios with fieldset and legend. Arrow keys navigate within the group — Tab moves to the next form element.",
  },
  {
    id: "toggle", name: "Toggle", cat: "Input", tier: 1,
    desc: "Immediately applies a binary state change — on/off, enabled/disabled — without requiring confirmation.",
    use: ["Settings that take effect immediately without a save action", "Enabling or disabling features"],
    avoid: ["Multi-step processes that need confirmation — use Checkbox + Submit", "Destructive actions without a warning"],
    variants: ["Off", "On", "Disabled", "Loading"],
    a11y: "role='switch', aria-checked reflects current state. Label must describe the feature, not the action ('Notifications' not 'Enable notifications').",
  },
  {
    id: "textarea", name: "Textarea", cat: "Input", tier: 2,
    desc: "Multi-line text input for longer-form content — descriptions, messages, notes, and feedback.",
    use: ["Free-form text longer than one line", "Open-ended responses with no character constraint"],
    avoid: ["Short single-line inputs — use Text input", "Rich text formatting — use a dedicated rich text editor"],
    variants: ["Default", "Focus", "Filled", "Disabled", "Error", "With character count"],
    a11y: "If a character limit exists, use aria-describedby to link the count to the field.",
  },
  {
    id: "slider", name: "Slider", cat: "Input", tier: 2,
    desc: "Range input for selecting a value within a bounded set — volume, price range, opacity, brightness.",
    use: ["Approximate value selection where precision isn't critical", "Ranges with natural endpoints"],
    avoid: ["Exact numeric values — use a number input", "Data entry on mobile where precision is required"],
    variants: ["Default", "Active (dragging)", "Disabled", "Range (two handles)", "With value label"],
    a11y: "role='slider', aria-valuemin, aria-valuemax, aria-valuenow required. Arrow keys adjust value; keyboard step should be meaningful.",
  },
  {
    id: "card", name: "Card", cat: "Containment", tier: 1,
    desc: "Surface container for grouping related content and actions into a discrete, scannable unit.",
    use: ["Displaying collections — search results, product listings, user profiles", "Grouping related details with a clear boundary"],
    avoid: ["Page-level content areas — use the page layout", "Single fields that don't need visual grouping"],
    variants: ["Default", "Clickable", "Selected", "Disabled", "With media", "Horizontal"],
    a11y: "If the entire card is clickable, use a single anchor or button. Avoid nesting interactive elements inside a clickable card.",
  },
  {
    id: "accordion", name: "Accordion", cat: "Containment", tier: 2,
    desc: "Collapsible content sections that progressively reveal detail on demand, reducing initial cognitive load.",
    use: ["FAQs and long-form content not all users need", "Settings panels where space is limited"],
    avoid: ["Critical information users should always see", "Navigation — use Tabs or a sidebar"],
    variants: ["Collapsed", "Expanded", "Disabled", "Multiple open", "Single open (exclusive)"],
    a11y: "Use aria-expanded on the trigger button. Panel uses role='region' with aria-labelledby pointing to the trigger.",
  },
  {
    id: "tabs", name: "Tabs", cat: "Navigation", tier: 2,
    desc: "Horizontal control for switching between related views or content sections within the same context.",
    use: ["Parallel content categories at the same hierarchy level", "When all tabs need to be visible at once"],
    avoid: ["Sequential steps — use a stepper", "More than 6 tabs — use a dropdown or sidebar"],
    variants: ["Default", "Active", "Disabled", "Scrollable", "With count badge"],
    a11y: "role='tablist', role='tab', role='tabpanel'. Arrow keys navigate between tabs; Tab moves into the active panel.",
  },
  {
    id: "breadcrumb", name: "Breadcrumb", cat: "Navigation", tier: 2,
    desc: "Path indicator showing the user's location within a hierarchy, enabling navigation back to parent levels.",
    use: ["Hierarchical structures with 3 or more levels", "When users frequently navigate back to parent pages"],
    avoid: ["Flat navigation structures", "Mobile — breadcrumbs often collapse and lose utility"],
    variants: ["Default", "Truncated", "With current page", "With icons"],
    a11y: "Wrap in nav with aria-label='Breadcrumb'. Current page uses aria-current='page'. Separator is decorative (aria-hidden).",
  },
  {
    id: "pagination", name: "Pagination", cat: "Navigation", tier: 2,
    desc: "Navigation control for moving through segmented content — data tables, search results, image galleries.",
    use: ["Large data sets where loading all items at once isn't feasible", "When page position is meaningful to the user"],
    avoid: ["Small sets under 10 items — show all", "Continuous feeds — use infinite scroll or a Load more button"],
    variants: ["Default", "Active page", "First page", "Last page", "Condensed"],
    a11y: "Wrap in nav with aria-label='Pagination'. Current page uses aria-current='page'. Include screen-reader labels on prev/next icons.",
  },
  {
    id: "modal", name: "Modal", cat: "Overlay", tier: 1,
    desc: "Blocking overlay dialog that requires user acknowledgment before returning to the underlying page.",
    use: ["Confirming destructive actions", "Focused short workflows that must be completed before continuing"],
    avoid: ["Non-critical information — use Toast or Alert", "Complex multi-step workflows — use a dedicated page"],
    variants: ["Default", "Confirmation", "With form", "Danger/destructive", "Full screen (mobile)"],
    a11y: "Focus must move into modal on open and return to trigger on close. Focus trap required. role='dialog', aria-modal='true', aria-labelledby.",
  },
  {
    id: "tooltip", name: "Tooltip", cat: "Overlay", tier: 1,
    desc: "Short contextual label that appears on hover or focus to explain an unlabeled element or provide supplemental detail.",
    use: ["Explaining icon-only buttons", "Surfacing keyboard shortcuts", "Adding context to truncated text"],
    avoid: ["Essential information — if users need it, put it in the UI", "Touch-only interfaces — hover isn't available"],
    variants: ["Top", "Right", "Bottom", "Left", "Dark", "Light"],
    a11y: "Connected via aria-describedby to the trigger element. Must appear on keyboard focus, not only hover.",
  },
  {
    id: "toast", name: "Toast", cat: "Feedback", tier: 1,
    desc: "Transient notification that confirms an action, surfaces a non-critical status, or alerts about a background process.",
    use: ["Confirming a save, send, or delete action", "Background process updates like sync or upload"],
    avoid: ["Critical errors that block the user — use an inline error or Modal", "Information that requires a decision or action"],
    variants: ["Success", "Error", "Warning", "Info", "With action", "Loading"],
    a11y: "role='status' (polite) for confirmations, role='alert' (assertive) for errors. Auto-dismiss should pause on hover and focus.",
  },
  {
    id: "alert", name: "Alert", cat: "Feedback", tier: 1,
    desc: "Persistent inline notification that communicates status, warnings, or errors within the page flow — not as an overlay.",
    use: ["System status messages affecting a whole page or section", "Errors from a form submission", "Warnings before an irreversible action"],
    avoid: ["Transient confirmations — use Toast", "Blocking messages that require a decision — use Modal"],
    variants: ["Info", "Success", "Warning", "Error", "Dismissible", "With action"],
    a11y: "role='alert' for errors and warnings (announces immediately). role='status' for informational messages (announces when idle).",
  },
  {
    id: "progressbar", name: "Progress bar", cat: "Feedback", tier: 2,
    desc: "Visual indicator of completion for determinate operations — file uploads, multi-step processes, profile completeness.",
    use: ["Operations where progress can be measured", "Setting expectations on wait time"],
    avoid: ["Indeterminate operations — use Skeleton or a spinner", "Very short operations under 2 seconds"],
    variants: ["Default", "Success", "Error", "Animated", "With label", "Stacked segments"],
    a11y: "role='progressbar', aria-valuenow, aria-valuemin='0', aria-valuemax='100'. Include aria-label describing what is being measured.",
  },
  {
    id: "skeleton", name: "Skeleton", cat: "Feedback", tier: 2,
    desc: "Animated placeholder that mimics the shape of loading content — reduces perceived wait time and layout shift.",
    use: ["Loading states for content-heavy areas — cards, lists, feeds", "When content shape is predictable"],
    avoid: ["Short loads under 1 second — a skeleton flash is worse than nothing", "Indefinite loads — show an error after timeout instead"],
    variants: ["Text line", "Heading", "Avatar", "Card", "Table row", "Image placeholder"],
    a11y: "The loading container should use aria-busy='true'. Skeleton elements are decorative (aria-hidden='true').",
  },
  {
    id: "badge", name: "Badge", cat: "Data Display", tier: 1,
    desc: "Small count or status indicator overlaid on or adjacent to an element — notification counts, unread markers, status labels.",
    use: ["Unread notification counts", "Status labels on items", "Highlighting new or updated content"],
    avoid: ["Large numbers or long text — badges are compact by design", "Primary content — badges are supplementary only"],
    variants: ["Number", "Dot", "Status (success/warning/error)", "Max count (99+)", "On icon", "Standalone label"],
    a11y: "Badge counts must be readable by screen readers — use a visually hidden span or aria-label on the parent ('3 unread notifications').",
  },
  {
    id: "tag", name: "Tag / Chip", cat: "Data Display", tier: 1,
    desc: "Compact label for categorization, filtering, or attribute display — applied to items or used as filter criteria.",
    use: ["Displaying applied filters", "Category labels on cards", "Multi-select chip input", "Dismissible selections"],
    avoid: ["Primary actions — use Button", "Status indicators — use Badge"],
    variants: ["Default", "With icon", "Dismissible", "Selected (filter active)", "Disabled"],
    a11y: "Dismissible tags need a button with aria-label ('Remove Python tag'). Filter chips use role='checkbox' or aria-pressed.",
  },
  {
    id: "avatar", name: "Avatar", cat: "Data Display", tier: 1,
    desc: "Visual representation of a user, entity, or organization — using an image, initials, or fallback icon.",
    use: ["Identifying the current user", "Attribution in comments and activity feeds", "Contact lists"],
    avoid: ["Decorative purposes where no user is being represented", "Replacing meaningful content like product images"],
    variants: ["Image", "Initials", "Icon fallback", "SM/MD/LG/XL", "With status dot", "Group (stacked)"],
    a11y: "Images need alt text with the person's name. Initials-only avatars need an aria-label. Status dots need a visually hidden description.",
  },
  {
    id: "table", name: "Table", cat: "Data Display", tier: 2,
    desc: "Structured grid for displaying and comparing multi-attribute data — records, settings, pricing tiers, or logs.",
    use: ["Comparing multiple items across the same attributes", "Displaying structured records where column scanning is needed"],
    avoid: ["Small sets of 2–3 items — use a list", "Single-attribute data — a list or stack is cleaner"],
    variants: ["Basic", "With sorting", "With row selection", "With row actions", "Striped", "Compact"],
    a11y: "Use th with scope='col' or scope='row'. Sortable columns use aria-sort. Interactive rows need keyboard support.",
  },
  {
    id: "list", name: "List", cat: "Data Display", tier: 2,
    desc: "Structured collection of items in a scannable vertical format — action lists, settings menus, navigation, or content summaries.",
    use: ["Sequential or categorized items where order matters", "Navigation within a section", "Grouped settings"],
    avoid: ["Tabular data needing column comparison — use Table", "Unrelated items that aren't a true collection"],
    variants: ["Unordered", "Ordered", "With icons", "With metadata (secondary line)", "Selectable", "Divided"],
    a11y: "Use semantic ul/ol/li. Selectable items use role='listbox' and role='option'. Keyboard navigation should support arrow keys.",
  },
];

// ── Token Editor Inputs ──────────────────────────────────────────────────────
function ColorInput({ label, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        style={{ width: 28, height: 28, border: "none", borderRadius: 4, cursor: "pointer", padding: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "#888", marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 11, fontFamily: "monospace", color: "#555" }}>{value}</div>
      </div>
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step = 1, suffix = "" }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: "#888" }}>{label}</span>
        <span style={{ fontFamily: "monospace", color: "#555" }}>{value}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#2563EB" }} />
    </div>
  );
}

// ── Component Previews ───────────────────────────────────────────────────────
function PreviewButton({ t }) {
  const s = (variant, label, extraStyle = {}) => (
    <button style={{
      fontFamily: t.fontBody, fontSize: t.baseSize - 1, fontWeight: 500,
      padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 5}px`,
      borderRadius: t.radiusMd, cursor: "pointer",
      transition: `all ${t.motionFast}`, ...extraStyle
    }}>{label}</button>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
      {s("filled", "Filled", { background: t.primary, color: contrastOn(t.primary), border: "none" })}
      {s("outlined", "Outlined", { background: "transparent", color: t.primary, border: `1.5px solid ${t.primary}` })}
      {s("ghost", "Ghost", { background: "transparent", color: t.primary, border: "1.5px solid transparent" })}
      {s("danger", "Danger", { background: t.error, color: contrastOn(t.error), border: "none" })}
      {s("disabled", "Disabled", { background: t.disabledBg || "#F3F4F6", color: t.disabledText || "#9CA3AF", border: `1px solid ${t.disabledBorder || "#E5E5E5"}`, cursor: "not-allowed", opacity: 0.7 })}
      {s("loading", "Loading…", { background: t.primary, color: contrastOn(t.primary), border: "none", opacity: 0.8 })}
    </div>
  );
}

function PreviewTextInput({ t }) {
  const inp = (label, state) => {
    const isError = state === "error";
    const isSuccess = state === "success";
    const isDisabled = state === "disabled";
    const isFocus = state === "focus";
    const bc = isError ? t.error : isSuccess ? t.success : isFocus ? t.primary : t.border;
    return (
      <div style={{ flex: "1 1 180px" }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSecondary, marginBottom: 4, fontFamily: t.fontBody }}>{label}</label>
        <div style={{
          border: `1.5px solid ${bc}`, borderRadius: t.radiusMd, padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 3}px`,
          fontSize: t.baseSize, fontFamily: t.fontBody, color: isDisabled ? (t.disabledText || "#aaa") : t.textPrimary,
          background: isDisabled ? (t.disabledBg || "#F3F4F6") : t.surface, transition: `border ${t.motionFast}`,
          boxShadow: isFocus ? `0 0 0 2px ${alpha(t.primary, 0.15)}` : "none",
        }}>
          <span style={{ color: isDisabled ? (t.disabledText || "#bbb") : (t.placeholder || "#999") }}>{isDisabled ? "Disabled" : "Placeholder"}</span>
        </div>
        {isError && <div style={{ fontSize: 11, color: t.error, marginTop: 3, fontFamily: t.fontBody }}>This field is required</div>}
        {isSuccess && <div style={{ fontSize: 11, color: t.success, marginTop: 3, fontFamily: t.fontBody }}>Looks good</div>}
        {!isError && !isSuccess && !isDisabled && !isFocus && <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 3, fontFamily: t.fontBody }}>Helper text</div>}
      </div>
    );
  };
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>{inp("Default", "default")}{inp("Focus", "focus")}{inp("Error", "error")}{inp("Success", "success")}{inp("Disabled", "disabled")}</div>;
}

function PreviewSelect({ t }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      {["Default", "Open"].map(state => (
        <div key={state} style={{ flex: "1 1 180px" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSecondary, marginBottom: 4, fontFamily: t.fontBody }}>{state}</label>
          <div style={{
            border: `1.5px solid ${state === "Open" ? t.primary : t.border}`, borderRadius: t.radiusMd,
            padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 3}px`, fontSize: t.baseSize, fontFamily: t.fontBody,
            background: t.surface, display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: state === "Open" ? `0 0 0 2px ${alpha(t.primary, 0.15)}` : "none",
          }}>
            <span style={{ color: t.placeholder || "#999" }}>Select option</span>
            <span style={{ color: t.textTertiary, fontSize: 10 }}>▼</span>
          </div>
          {state === "Open" && (
            <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radiusMd, marginTop: 4, boxShadow: t.shadowMd, background: t.surface, overflow: "hidden" }}>
              {["Option A", "Option B", "Option C"].map((o, i) => (
                <div key={o} style={{ padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 3}px`, fontSize: t.baseSize - 1, fontFamily: t.fontBody,
                  background: i === 0 ? alpha(t.primary, 0.06) : "transparent", color: i === 0 ? t.primary : t.textPrimary, cursor: "pointer" }}>{o}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PreviewCheckbox({ t }) {
  const box = (label, checked, indeterminate, disabled) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: t.fontBody, fontSize: t.baseSize - 1 }}>
      <div style={{
        width: 18, height: 18, borderRadius: t.radiusSm > 4 ? 4 : t.radiusSm, display: "flex", alignItems: "center", justifyContent: "center",
        border: checked || indeterminate ? "none" : `2px solid ${t.border}`,
        background: checked || indeterminate ? t.primary : t.surface,
      }}>
        {checked && <span style={{ color: contrastOn(t.primary), fontSize: 12, lineHeight: 1 }}>✓</span>}
        {indeterminate && <span style={{ color: contrastOn(t.primary), fontSize: 14, lineHeight: 1 }}>–</span>}
      </div>
      <span style={{ color: disabled ? t.textTertiary : t.textPrimary }}>{label}</span>
    </label>
  );
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>{box("Unchecked", false, false, false)}{box("Checked", true, false, false)}{box("Indeterminate", false, true, false)}{box("Disabled", false, false, true)}</div>;
}

function PreviewRadio({ t }) {
  const radio = (label, selected, disabled) => (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: t.fontBody, fontSize: t.baseSize - 1 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? t.primary : t.border}`, display: "flex", alignItems: "center", justifyContent: "center", background: t.surface }}>
        {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.primary }} />}
      </div>
      <span style={{ color: disabled ? t.textTertiary : t.textPrimary }}>{label}</span>
    </label>
  );
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>{radio("Unselected", false, false)}{radio("Selected", true, false)}{radio("Disabled", false, true)}</div>;
}

function PreviewToggle({ t }) {
  const tog = (label, on, disabled) => (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: t.fontBody, fontSize: t.baseSize - 1 }}>
      <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? t.primary : (t.toggleOff || "#D1D5DB"), position: "relative", transition: `background ${t.motionFast}` }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: t.toggleKnob || "#fff", position: "absolute", top: 2, left: on ? 22 : 2, transition: `left ${t.motionFast}`, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
      <span style={{ color: disabled ? t.textTertiary : t.textPrimary }}>{label}</span>
    </label>
  );
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>{tog("Off", false, false)}{tog("On", true, false)}{tog("Disabled", false, true)}</div>;
}

function PreviewCard({ t }) {
  const card = (variant, label) => {
    const styles = {
      elevated: { background: t.surface, boxShadow: t.shadowMd, border: "none" },
      outlined: { background: t.surface, boxShadow: "none", border: `1.5px solid ${t.border}` },
      filled: { background: t.surfaceSecondary, boxShadow: "none", border: "none" },
    };
    return (
      <div style={{ flex: "1 1 160px", borderRadius: t.radiusLg, padding: `${t.spaceUnit * 5}px`, ...styles[variant] }}>
        <div style={{ fontSize: t.baseSize + 1, fontWeight: t.headingWeight, fontFamily: t.fontHeading, color: t.textPrimary, marginBottom: 6 }}>{label}</div>
        <div style={{ fontSize: t.baseSize - 1, color: t.textSecondary, fontFamily: t.fontBody, lineHeight: 1.5 }}>Card content with descriptive text showing the {variant} variant.</div>
      </div>
    );
  };
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>{card("elevated", "Elevated")}{card("outlined", "Outlined")}{card("filled", "Filled")}</div>;
}

function PreviewModal({ t }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: t.radiusLg, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 180 }}>
      <div style={{ background: t.surface, borderRadius: t.radiusLg, padding: `${t.spaceUnit * 6}px`, maxWidth: 340, width: "100%", boxShadow: t.shadowLg }}>
        <div style={{ fontSize: t.baseSize + 3, fontWeight: t.headingWeight, fontFamily: t.fontHeading, color: t.textPrimary, marginBottom: 8 }}>Confirm action</div>
        <div style={{ fontSize: t.baseSize - 1, color: t.textSecondary, fontFamily: t.fontBody, marginBottom: 20, lineHeight: 1.5 }}>Are you sure you want to proceed? This action cannot be undone.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button style={{ padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 4}px`, borderRadius: t.radiusMd, border: `1.5px solid ${t.border}`, background: "transparent", color: t.textPrimary, fontSize: t.baseSize - 1, fontFamily: t.fontBody, cursor: "pointer" }}>Cancel</button>
          <button style={{ padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 4}px`, borderRadius: t.radiusMd, border: "none", background: t.primary, color: contrastOn(t.primary), fontSize: t.baseSize - 1, fontFamily: t.fontBody, fontWeight: 500, cursor: "pointer" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function PreviewToast({ t }) {
  const toast = (severity, msg) => {
    const colors = { info: t.info, success: t.success, warning: t.warning, error: t.error };
    const c = colors[severity];
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: `${t.spaceUnit * 3}px ${t.spaceUnit * 4}px`,
        borderRadius: t.radiusMd, background: t.surface, border: `1px solid ${t.border}`,
        borderLeft: `3px solid ${c}`, boxShadow: t.shadowMd, fontFamily: t.fontBody, fontSize: t.baseSize - 1,
      }}>
        <span style={{ color: c, fontWeight: 600, fontSize: 14 }}>{severity === "info" ? "ℹ" : severity === "success" ? "✓" : severity === "warning" ? "⚠" : "✕"}</span>
        <span style={{ color: t.textPrimary, flex: 1 }}>{msg}</span>
        <span style={{ color: t.textTertiary, cursor: "pointer", fontSize: 12 }}>✕</span>
      </div>
    );
  };
  return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{toast("info", "Information message")}{toast("success", "Action completed")}{toast("warning", "Please review")}{toast("error", "Something went wrong")}</div>;
}

function PreviewAlert({ t }) {
  const alert = (severity, msg) => {
    const colors = { info: t.info, success: t.success, warning: t.warning, error: t.error };
    const c = colors[severity];
    return (
      <div style={{
        padding: `${t.spaceUnit * 3}px ${t.spaceUnit * 4}px`, borderRadius: t.radiusMd,
        background: alpha(c, 0.08), border: `1px solid ${alpha(c, 0.2)}`,
        fontFamily: t.fontBody, fontSize: t.baseSize - 1, color: t.textPrimary,
        display: "flex", alignItems: "flex-start", gap: 8,
      }}>
        <span style={{ fontWeight: 600, fontSize: 14, flexShrink: 0 }}>{severity === "info" ? "ℹ" : severity === "success" ? "✓" : severity === "warning" ? "⚠" : "✕"}</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2, textTransform: "capitalize" }}>{severity}</div>
          <div style={{ opacity: 0.85 }}>{msg}</div>
        </div>
      </div>
    );
  };
  return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{alert("info", "This is an informational banner.")}{alert("success", "Your changes have been saved.")}{alert("warning", "Your session is about to expire.")}{alert("error", "Unable to process request.")}</div>;
}

function PreviewBadge({ t }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", fontFamily: t.fontBody }}>
      {[
        { label: "3", bg: t.primary, color: contrastOn(t.primary) },
        { label: "99+", bg: t.error, color: contrastOn(t.error) },
        { label: "", bg: t.success, color: t.success, dot: true },
        { label: "New", bg: alpha(t.primary, 0.1), color: t.primary },
      ].map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 32, height: 32, borderRadius: t.radiusMd, background: t.surfaceSecondary, position: "relative" }}>
            <div style={{
              position: "absolute", top: b.dot ? -2 : -6, right: b.dot ? -2 : -8,
              minWidth: b.dot ? 8 : 18, height: b.dot ? 8 : 18, borderRadius: 9999,
              background: b.bg, color: b.color, fontSize: 10, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", padding: b.dot ? 0 : "0 5px",
            }}>{b.label}</div>
          </div>
          <span style={{ fontSize: 11, color: t.textTertiary }}>{b.dot ? "Dot" : b.label === "New" ? "Label" : "Count"}</span>
        </div>
      ))}
    </div>
  );
}

function PreviewTag({ t }) {
  const tag = (label, variant) => {
    const styles = {
      default: { background: t.surfaceSecondary, color: t.textPrimary, border: `1px solid ${t.border}` },
      primary: { background: alpha(t.primary, 0.08), color: t.primary, border: `1px solid ${alpha(t.primary, 0.2)}` },
      dismissible: { background: t.surfaceSecondary, color: t.textPrimary, border: `1px solid ${t.border}` },
      selected: { background: t.primary, color: contrastOn(t.primary), border: `1px solid ${t.primary}` },
    };
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: `${t.spaceUnit}px ${t.spaceUnit * 3}px`, borderRadius: t.radiusFull,
        fontSize: t.baseSize - 2, fontFamily: t.fontBody, fontWeight: 500, ...styles[variant],
      }}>
        {label}
        {variant === "dismissible" && <span style={{ cursor: "pointer", opacity: 0.5, fontSize: 10, marginLeft: 2 }}>✕</span>}
      </span>
    );
  };
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tag("Default", "default")}{tag("Primary", "primary")}{tag("Dismissible", "dismissible")}{tag("Selected", "selected")}{tag("Disabled", "default")}</div>;
}

function PreviewAvatar({ t }) {
  const av = (content, size, type) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: type === "image" ? `linear-gradient(135deg, ${t.primary}, ${t.accent})` : alpha(t.primary, 0.15),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.4, fontWeight: 600, color: type === "image" ? contrastOn(t.primary) : t.primary,
        fontFamily: t.fontBody,
      }}>{content}</div>
      <span style={{ fontSize: 10, color: t.textTertiary, fontFamily: t.fontBody }}>{size}px</span>
    </div>
  );
  return <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>{av("JD", 28, "initials")}{av("QR", 36, "initials")}{av("AB", 48, "initials")}{av("✦", 36, "image")}</div>;
}

function PreviewTooltip({ t }) {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      {["dark", "light"].map(variant => (
        <div key={variant} style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            padding: `${t.spaceUnit * 1.5}px ${t.spaceUnit * 3}px`, borderRadius: t.radiusSm,
            background: variant === "dark" ? t.textPrimary : t.surface,
            color: variant === "dark" ? t.surface : t.textPrimary,
            fontSize: t.baseSize - 2, fontFamily: t.fontBody, boxShadow: t.shadowMd,
            border: variant === "light" ? `1px solid ${t.border}` : "none",
          }}>Tooltip text</div>
          <div style={{ width: 8, height: 8, transform: "rotate(45deg)", marginTop: -5,
            background: variant === "dark" ? t.textPrimary : t.surface,
            border: variant === "light" ? `1px solid ${t.border}` : "none",
            borderTop: "none", borderLeft: "none",
          }} />
          <span style={{ fontSize: 10, color: t.textTertiary, marginTop: 6, fontFamily: t.fontBody, textTransform: "capitalize" }}>{variant}</span>
        </div>
      ))}
    </div>
  );
}


function PreviewTextarea({ t }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      {["Default", "Focus", "Disabled"].map(state => (
        <div key={state} style={{ flex: "1 1 200px" }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSecondary, marginBottom: 4, fontFamily: t.fontBody }}>{state}</label>
          <div style={{
            border: `1.5px solid ${state === "Focus" ? t.primary : t.border}`, borderRadius: t.radiusMd,
            padding: `${t.spaceUnit * 2}px ${t.spaceUnit * 3}px`, fontSize: t.baseSize, fontFamily: t.fontBody,
            color: state === "Disabled" ? (t.disabledText || "#aaa") : t.textPrimary, background: state === "Disabled" ? (t.disabledBg || "#F3F4F6") : t.surface,
            minHeight: 80, lineHeight: 1.5,
            boxShadow: state === "Focus" ? `0 0 0 2px ${alpha(t.primary, 0.15)}` : "none",
          }}>
            <span style={{ color: state === "Disabled" ? (t.disabledText || "#bbb") : (t.placeholder || "#999") }}>Write something...</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewSlider({ t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[{ label: "Default", val: 40 }, { label: "Midpoint", val: 50 }, { label: "Disabled", val: 25 }].map(({ label, val }) => (
        <div key={label} style={{ opacity: label === "Disabled" ? 0.5 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: t.fontBody, color: t.textSecondary, marginBottom: 6 }}>
            <span>{label}</span><span style={{ fontFamily: t.fontMono }}>{val}%</span>
          </div>
          <div style={{ position: "relative", height: 6, borderRadius: 3, background: alpha(t.primary, 0.12) }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: 6, borderRadius: 3, background: t.primary, width: `${val}%` }} />
            <div style={{ position: "absolute", top: -5, left: `${val}%`, transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: t.primary, border: `2px solid ${t.surface}`, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewAccordion({ t }) {
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radiusMd, overflow: "hidden" }}>
      {[{ title: "Section one", open: true, content: "Content for the first section. Accordions reveal information progressively." },
        { title: "Section two", open: false },
        { title: "Section three", open: false }].map((item, i) => (
        <div key={i} style={{ borderTop: i > 0 ? `1px solid ${t.border}` : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${t.spaceUnit * 3}px ${t.spaceUnit * 4}px`, cursor: "pointer", background: t.surface, fontFamily: t.fontBody, fontSize: t.baseSize, fontWeight: 500, color: t.textPrimary }}>
            {item.title}
            <span style={{ fontSize: 12, color: t.textTertiary, transition: `transform ${t.motionFast}`, transform: item.open ? "rotate(180deg)" : "none" }}>▼</span>
          </div>
          {item.open && <div style={{ padding: `0 ${t.spaceUnit * 4}px ${t.spaceUnit * 4}px`, fontSize: t.baseSize - 1, color: t.textSecondary, fontFamily: t.fontBody, lineHeight: 1.5, background: t.surface }}>{item.content}</div>}
        </div>
      ))}
    </div>
  );
}

function PreviewTabs({ t }) {
  return (
    <div>
      <div style={{ display: "flex", borderBottom: `2px solid ${t.border}` }}>
        {["Overview", "Details", "Settings", "Disabled"].map((tab, i) => {
          const isActive = i === 0;
          const isDisabled = i === 3;
          return (
            <div key={tab} style={{
              padding: `${t.spaceUnit * 2.5}px ${t.spaceUnit * 4}px`, fontSize: t.baseSize - 1, fontFamily: t.fontBody,
              fontWeight: isActive ? 600 : 400, color: isDisabled ? t.textTertiary : isActive ? t.primary : t.textSecondary,
              borderBottom: isActive ? `2px solid ${t.primary}` : "2px solid transparent", marginBottom: -2,
              cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.5 : 1,
            }}>{tab}</div>
          );
        })}
      </div>
      <div style={{ padding: `${t.spaceUnit * 4}px 0`, fontSize: t.baseSize - 1, color: t.textSecondary, fontFamily: t.fontBody }}>Tab content area for the active tab.</div>
    </div>
  );
}

function PreviewBreadcrumb({ t }) {
  const items = ["Home", "Products", "Category", "Current page"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            fontSize: t.baseSize - 1, fontFamily: t.fontBody,
            color: i === items.length - 1 ? t.textPrimary : t.primary,
            fontWeight: i === items.length - 1 ? 500 : 400,
            textDecoration: i < items.length - 1 ? "underline" : "none",
            textUnderlineOffset: 2, cursor: i < items.length - 1 ? "pointer" : "default",
          }}>{item}</span>
          {i < items.length - 1 && <span style={{ color: t.textTertiary, fontSize: 10 }}>/</span>}
        </div>
      ))}
    </div>
  );
}

function PreviewPagination({ t }) {
  const pages = [1, 2, 3, "...", 12];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <button style={{ padding: `${t.spaceUnit * 1.5}px ${t.spaceUnit * 2.5}px`, borderRadius: t.radiusMd, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontSize: t.baseSize - 2, cursor: "pointer", fontFamily: t.fontBody }}>Prev</button>
      {pages.map((p, i) => (
        <button key={i} style={{
          width: 32, height: 32, borderRadius: t.radiusMd, border: p === 1 ? "none" : `1px solid ${t.border}`,
          background: p === 1 ? t.primary : "transparent", color: p === 1 ? contrastOn(t.primary) : p === "..." ? t.textTertiary : t.textPrimary,
          fontSize: t.baseSize - 2, fontFamily: t.fontBody, fontWeight: p === 1 ? 600 : 400,
          cursor: p === "..." ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>{p}</button>
      ))}
      <button style={{ padding: `${t.spaceUnit * 1.5}px ${t.spaceUnit * 2.5}px`, borderRadius: t.radiusMd, border: `1px solid ${t.border}`, background: "transparent", color: t.textSecondary, fontSize: t.baseSize - 2, cursor: "pointer", fontFamily: t.fontBody }}>Next</button>
    </div>
  );
}

function PreviewProgressBar({ t }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[{ label: "Determinate", pct: 65 }, { label: "Complete", pct: 100 }, { label: "Indeterminate", pct: -1 }].map(({ label, pct }) => (
        <div key={label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: t.fontBody, color: t.textSecondary, marginBottom: 6 }}>
            <span>{label}</span>{pct >= 0 && <span style={{ fontFamily: t.fontMono }}>{pct}%</span>}
          </div>
          <div style={{ height: 6, borderRadius: 3, background: alpha(t.primary, 0.12), overflow: "hidden", position: "relative" }}>
            {pct >= 0 ? (
              <div style={{ height: 6, borderRadius: 3, background: pct === 100 ? t.success : t.primary, width: `${pct}%`, transition: `width ${t.motionNormal}` }} />
            ) : (
              <div style={{ height: 6, borderRadius: 3, background: t.primary, width: "30%", position: "absolute", animation: "indeterminate 1.5s infinite ease-in-out" }} />
            )}
          </div>
        </div>
      ))}
      <style>{"@keyframes indeterminate{0%{left:-30%}100%{left:100%}}"}</style>
    </div>
  );
}

function PreviewSkeleton({ t }) {
  const shimmer = { background: `linear-gradient(90deg, ${alpha(t.textTertiary, 0.08)} 25%, ${alpha(t.textTertiary, 0.15)} 50%, ${alpha(t.textTertiary, 0.08)} 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: t.radiusMd };
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: "1 1 200px", padding: 16, border: `1px solid ${t.border}`, borderRadius: t.radiusLg, background: t.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", ...shimmer }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 12, width: "60%", marginBottom: 6, ...shimmer }} />
            <div style={{ height: 10, width: "40%", ...shimmer }} />
          </div>
        </div>
        <div style={{ height: 10, width: "100%", marginBottom: 8, ...shimmer }} />
        <div style={{ height: 10, width: "90%", marginBottom: 8, ...shimmer }} />
        <div style={{ height: 10, width: "75%", ...shimmer }} />
      </div>
      <style>{"@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}"}</style>
    </div>
  );
}

function PreviewTable({ t }) {
  const cols = ["Name", "Role", "Status"];
  const rows = [
    ["Alex Chen", "Designer", "Active"],
    ["Jordan Lee", "Engineer", "Active"],
    ["Sam Patel", "PM", "Away"],
  ];
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radiusMd, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: t.fontBody, fontSize: t.baseSize - 1 }}>
        <thead>
          <tr style={{ background: t.surfaceSecondary }}>
            {cols.map(c => <th key={c} style={{ textAlign: "left", padding: `${t.spaceUnit * 2.5}px ${t.spaceUnit * 4}px`, fontWeight: 600, color: t.textPrimary, borderBottom: `1px solid ${t.border}`, fontSize: t.baseSize - 2 }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${t.border}` : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: `${t.spaceUnit * 2.5}px ${t.spaceUnit * 4}px`, color: j === 2 ? (cell === "Active" ? t.success : t.warning) : t.textPrimary }}>
                  {j === 2 ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: cell === "Active" ? t.success : t.warning }} />{cell}</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PreviewList({ t }) {
  const items = [
    { icon: "◆", title: "Design review", desc: "Scheduled for Friday" },
    { icon: "●", title: "Sprint planning", desc: "Next Monday at 10am" },
    { icon: "▲", title: "Component audit", desc: "In progress — 60% complete" },
  ];
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radiusMd, overflow: "hidden" }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 12, padding: `${t.spaceUnit * 3}px ${t.spaceUnit * 4}px`,
          borderTop: i > 0 ? `1px solid ${t.border}` : "none", background: t.surface, cursor: "pointer",
        }}>
          <span style={{ color: t.primary, fontSize: 10, flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: t.baseSize - 1, fontWeight: 500, color: t.textPrimary, fontFamily: t.fontBody }}>{item.title}</div>
            <div style={{ fontSize: t.baseSize - 2, color: t.textSecondary, fontFamily: t.fontBody }}>{item.desc}</div>
          </div>
          <span style={{ color: t.textTertiary, fontSize: 12 }}>›</span>
        </div>
      ))}
    </div>
  );
}

const PREVIEW_MAP = {
  button: PreviewButton, textinput: PreviewTextInput, select: PreviewSelect,
  checkbox: PreviewCheckbox, radio: PreviewRadio, toggle: PreviewToggle,
  textarea: PreviewTextarea, slider: PreviewSlider,
  card: PreviewCard, accordion: PreviewAccordion,
  tabs: PreviewTabs, breadcrumb: PreviewBreadcrumb, pagination: PreviewPagination,
  modal: PreviewModal, tooltip: PreviewTooltip,
  toast: PreviewToast, alert: PreviewAlert, progressbar: PreviewProgressBar, skeleton: PreviewSkeleton,
  badge: PreviewBadge, tag: PreviewTag, avatar: PreviewAvatar,
  table: PreviewTable, list: PreviewList,
};

// ── CSS Export Generator ─────────────────────────────────────────────────────
function generateCSS(t) {
  const sp = n => t.spaceUnit * n;
  const sz = {};
  for (let i = -2; i <= 5; i++) sz[i] = typeScale(t.baseSize, t.scaleRatio, i);

  return `/* Design System Studio — ${t.name} Theme */
/* Token convention: --apdf-{layer}-{category}-{name} */

:root {
  /* ── Reference: Color Palette ─────────────────────────── */
  --apdf-ref-color-primary: ${t.primary};
  --apdf-ref-color-secondary: ${t.secondary};
  --apdf-ref-color-accent: ${t.accent};

  /* ── System: Surfaces ─────────────────────────────────── */
  --apdf-sys-color-surface: ${t.surface};
  --apdf-sys-color-surface-container: ${t.surfaceSecondary};
  --apdf-sys-color-on-surface: ${t.textPrimary};
  --apdf-sys-color-on-surface-variant: ${t.textSecondary};
  --apdf-sys-color-on-surface-subtle: ${t.textTertiary};
  --apdf-sys-color-outline: ${t.border};

  /* ── System: Brand ────────────────────────────────────── */
  --apdf-sys-color-primary: ${t.primary};
  --apdf-sys-color-primary-container: ${alpha(t.primary, 0.08)};
  --apdf-sys-color-on-primary: ${contrastOn(t.primary)};
  --apdf-sys-color-secondary: ${t.secondary};
  --apdf-sys-color-on-secondary: ${contrastOn(t.secondary)};

  /* ── System: Semantic ─────────────────────────────────── */
  --apdf-sys-color-success: ${t.success};
  --apdf-sys-color-success-container: ${alpha(t.success, 0.08)};
  --apdf-sys-color-warning: ${t.warning};
  --apdf-sys-color-warning-container: ${alpha(t.warning, 0.08)};
  --apdf-sys-color-error: ${t.error};
  --apdf-sys-color-error-container: ${alpha(t.error, 0.08)};
  --apdf-sys-color-info: ${t.info};
  --apdf-sys-color-info-container: ${alpha(t.info, 0.08)};

  /* ── System: Typography ───────────────────────────────── */
  --apdf-sys-typescale-font-heading: ${t.fontHeading};
  --apdf-sys-typescale-font-body: ${t.fontBody};
  --apdf-sys-typescale-font-mono: ${t.fontMono};
  --apdf-sys-typescale-display-large: ${Math.round(sz[5])}px;
  --apdf-sys-typescale-display-medium: ${Math.round(sz[4])}px;
  --apdf-sys-typescale-headline-large: ${Math.round(sz[3])}px;
  --apdf-sys-typescale-headline-medium: ${Math.round(sz[2])}px;
  --apdf-sys-typescale-title-large: ${Math.round(sz[1])}px;
  --apdf-sys-typescale-title-medium: ${Math.round(sz[0])}px;
  --apdf-sys-typescale-body-large: ${Math.round(sz[0])}px;
  --apdf-sys-typescale-body-medium: ${Math.round(sz[-1])}px;
  --apdf-sys-typescale-body-small: ${Math.round(sz[-2])}px;
  --apdf-sys-typescale-label-large: ${Math.round(sz[-1])}px;
  --apdf-sys-typescale-label-medium: ${Math.round(sz[-2])}px;

  /* ── System: Spacing ──────────────────────────────────── */
  --apdf-sys-spacing-050: ${sp(0.5)}px;
  --apdf-sys-spacing-100: ${sp(1)}px;
  --apdf-sys-spacing-200: ${sp(2)}px;
  --apdf-sys-spacing-300: ${sp(3)}px;
  --apdf-sys-spacing-400: ${sp(4)}px;
  --apdf-sys-spacing-600: ${sp(6)}px;
  --apdf-sys-spacing-800: ${sp(8)}px;
  --apdf-sys-spacing-1200: ${sp(12)}px;
  --apdf-sys-spacing-1600: ${sp(16)}px;

  /* ── System: Shape ────────────────────────────────────── */
  --apdf-sys-shape-small: ${t.radiusSm}px;
  --apdf-sys-shape-medium: ${t.radiusMd}px;
  --apdf-sys-shape-large: ${t.radiusLg}px;
  --apdf-sys-shape-full: ${t.radiusFull}px;

  /* ── System: Elevation ────────────────────────────────── */
  --apdf-sys-elevation-level1: ${t.shadowSm};
  --apdf-sys-elevation-level2: ${t.shadowMd};
  --apdf-sys-elevation-level3: ${t.shadowLg};

  /* ── System: Motion ───────────────────────────────────── */
  --apdf-sys-motion-duration-short: ${t.motionFast};
  --apdf-sys-motion-duration-medium: ${t.motionNormal};
  --apdf-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
}`;
}

// ── App Chrome ───────────────────────────────────────────────────────────────
const APP = {
  topbar: 52,
  sidebar: 220,
  inspector: 320,
  sidebarBg: "#111111",
  sidebarBorder: "#232323",
  sidebarText: "#E5E5E5",
  sidebarDim: "#666666",
  sidebarActive: "#1E1E1E",
  canvasBg: "#FFFFFF",
  canvasBgSub: "#FAFAFA",
  canvasBorder: "#E5E5E5",
  canvasText: "#171717",
  canvasSub: "#525252",
  canvasDim: "#A3A3A3",
  topbarBg: "#0A0A0A",
  topbarBorder: "#232323",
  topbarText: "#F5F5F5",
  topbarDim: "#666666",
  mono: "'JetBrains Mono', monospace",
  sans: "'DM Sans', sans-serif",
};

// ── Main Component ───────────────────────────────────────────────────────────
export default function DesignSystemStudio() {
  const [activeTheme, setActiveTheme] = useState("precision");
  const [tokens, setTokens] = useState({ ...THEMES.precision });
  const [activeNav, setActiveNav] = useState({ type: "overview", id: null });
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [promptCopied, setPromptCopied] = useState(null);
  const [figmaPath, setFigmaPath] = useState("export");
  const [previewType, setPreviewType] = useState("website");
  const [tokenPanelOpen, setTokenPanelOpen] = useState({ color: true, typography: false, spacing: false, shapes: false });
  const toggleAccordion = (key) => setTokenPanelOpen(prev => ({ ...prev, [key]: !prev[key] }));
  const [tokenPanelCollapsed, setTokenPanelCollapsed] = useState(false);
  useEffect(() => { setTokenPanelCollapsed(activeNav.type === "preview"); }, [activeNav.type]);

  const applyTheme = useCallback((key) => {
    setActiveTheme(key);
    setTokens({ ...THEMES[key] });
  }, []);
  const update = useCallback((key, val) => {
    setTokens(prev => ({ ...prev, [key]: val }));
  }, []);
  const cssOutput = useMemo(() => generateCSS(tokens), [tokens]);
  const sizes = useMemo(() => {
    const s = {};
    for (let i = -2; i <= 5; i++) s[i] = typeScale(tokens.baseSize, tokens.scaleRatio, i);
    return s;
  }, [tokens.baseSize, tokens.scaleRatio]);
  const copyCSS = () => { navigator.clipboard.writeText(cssOutput); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const go = (type, id = null) => setActiveNav({ type, id });
  const activeComp = COMPONENTS.find(c => c.id === activeNav.id);
  const PreviewComp = PREVIEW_MAP[activeNav.id];
  const C = { bg: APP.canvasBg, bgSub: APP.canvasBgSub, border: APP.canvasBorder, text: APP.canvasText, sub: APP.canvasSub, dim: APP.canvasDim, card: APP.canvasBg };
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${tokens.fonts}&display=swap`;

  // ── Topbar ────────────────────────────────────────────────────────────────
  function renderTopbar() {
    return (
      <div style={{ height: APP.topbar, background: APP.topbarBg, borderBottom: `1px solid ${APP.topbarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 0, borderRadius: 2, overflow: "hidden" }}>
            {["#2563EB","#8B5CF6","#EC4899","#F97316","#14B8A6","#EF4444"].map((c, i) => (
              <div key={i} style={{ width: 6, height: 3, background: c }} />
            ))}
          </div>
          <button onClick={() => go("overview")} style={{ fontSize: 11, fontFamily: APP.mono, color: APP.topbarDim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Design System Studio</button>
          {activeNav.type === "component" && activeComp && (
            <>
              <span style={{ color: APP.topbarBorder, fontSize: 14 }}>/</span>
              <span style={{ fontSize: 11, fontFamily: APP.mono, color: APP.topbarText }}>Components</span>
              <span style={{ color: APP.topbarBorder, fontSize: 14 }}>/</span>
              <span style={{ fontSize: 11, fontFamily: APP.mono, color: APP.topbarDim }}>{activeComp.name}</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {activeNav.type === "component" && (
            <button onClick={() => setDarkMode(!darkMode)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6, border: `1px solid ${APP.topbarBorder}`, background: darkMode ? "#1A1A1A" : "transparent", color: darkMode ? "#ccc" : APP.topbarDim, fontSize: 11, cursor: "pointer", fontFamily: APP.mono }}>
              {darkMode ? "◐ Dark" : "○ Light"}
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, border: `1px solid ${APP.topbarBorder}` }}>
            <span style={{ fontSize: 10, fontFamily: APP.mono, color: APP.topbarDim }}>Theme</span>
            <select value={activeTheme} onChange={e => applyTheme(e.target.value)} style={{ fontSize: 11, fontFamily: APP.mono, color: APP.topbarText, background: "transparent", border: "none", cursor: "pointer", outline: "none" }}>
              {Object.entries(THEMES).map(([key, th]) => <option key={key} value={key} style={{ background: "#1A1A1A", color: "#F5F5F5" }}>{th.name}</option>)}
            </select>
          </div>
          <button onClick={() => go("export")} style={{ padding: "5px 14px", borderRadius: 6, border: "none", background: "#2563EB", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: APP.mono, fontWeight: 500 }}>
            Export CSS
          </button>
        </div>
      </div>
    );
  }

  // ── Primary Nav Bar ───────────────────────────────────────────────────────
  function renderNavbar() {
    const navItems = [
      { type: "overview", label: "Overview", icon: null },
      { type: "themes", label: "Themes", icon: null },
      { type: "preview", label: "Preview", icon: null },
      { type: "figma", label: "Figma MCP", icon: (
        <svg width="13" height="13" viewBox="0 0 38 57" fill="none" style={{ display: "block", flexShrink: 0 }}>
          <path d="M19 28.5C19 22.7 23.7 18 29.5 18S40 22.7 40 28.5 35.3 39 29.5 39 19 34.3 19 28.5z" fill="#1ABCFE"/>
          <path d="M0 47C0 41.2 4.7 36.5 10.5 36.5H19V47c0 5.8-4.7 10.5-10.5 10.5A10.5 10.5 0 0 1 0 47z" fill="#0ACF83"/>
          <path d="M19 0v18.5h9.5C34.3 18.5 39 13.8 39 8A9.5 9.5 0 0 0 28.5 0H19z" fill="#FF7262"/>
          <path d="M0 8c0 5.8 4.7 10.5 10.5 10.5H19V0H10.5A10.5 10.5 0 0 0 0 8z" fill="#F24E1E"/>
          <path d="M0 28.5C0 34.3 4.7 39 10.5 39H19V18H10.5C4.7 18 0 22.7 0 28.5z" fill="#A259FF"/>
        </svg>
      )},
    ];
    return (
      <div style={{ height: 44, background: APP.topbarBg, borderBottom: `1px solid ${APP.topbarBorder}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexShrink: 0 }}>
        {navItems.map(({ type, label, icon }) => {
          const isActive = activeNav.type === type || (type === "overview" && activeNav.type === "overview");
          return (
            <button key={type} onClick={() => go(type)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 0, border: "none",
              background: "transparent",
              color: isActive ? "#FFFFFF" : APP.topbarDim,
              fontSize: 12, fontFamily: APP.sans, cursor: "pointer",
              fontWeight: isActive ? 500 : 400,
              borderBottom: isActive ? "2px solid #FFFFFF" : "2px solid transparent",
              transition: "color 0.1s",
            }}>
              {icon}
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────
  function renderSidebar() {
    const navBtn = (type, id, label, indent = false) => {
      const isActive = activeNav.type === type && activeNav.id === id;
      return (
        <button key={`${type}-${id}`} onClick={() => go(type, id)} style={{
          display: "block", width: "100%", textAlign: "left",
          padding: indent ? "5px 14px 5px 26px" : "5px 14px",
          background: isActive ? APP.sidebarActive : "transparent",
          border: "none", borderLeft: isActive ? "2px solid #2563EB" : "2px solid transparent",
          color: isActive ? "#FFFFFF" : APP.sidebarDim,
          fontSize: 12, fontFamily: APP.sans, cursor: "pointer", transition: "color 0.1s",
          lineHeight: 1.6,
        }}>{label}</button>
      );
    };
    const sectionHead = (label) => (
      <div style={{ fontSize: 10, fontFamily: APP.mono, color: "#888", textTransform: "uppercase", letterSpacing: 2, padding: "14px 14px 5px", fontWeight: 600 }}>{label}</div>
    );
    const cats = [...new Set(COMPONENTS.map(c => c.cat))];
    return (
      <div style={{ width: APP.sidebar, background: APP.sidebarBg, borderRight: `1px solid ${APP.sidebarBorder}`, overflowY: "auto", flexShrink: 0 }}>
        <div style={{ padding: "8px 0" }}>
          {sectionHead("Components")}
          {cats.map(cat => (
            <div key={cat}>
              <div style={{ fontSize: 9, fontFamily: APP.mono, color: "#3A3A3A", textTransform: "uppercase", letterSpacing: 1.2, padding: "7px 14px 2px 14px" }}>{cat}</div>
              {COMPONENTS.filter(c => c.cat === cat).map(c => navBtn("component", c.id, c.name, true))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Right Token Panel ─────────────────────────────────────────────────────
  function renderTokensPanel() {
    const panelBg = "#F4F4F5";
    const panelBorder = "#E4E4E7";
    const labelCol = "#71717A";
    const textCol = "#18181B";

    const AccordionSection = ({ id, title, children }) => {
      const isOpen = tokenPanelOpen[id];
      return (
        <div style={{ borderBottom: `1px solid ${panelBorder}` }}>
          <button
            onClick={() => toggleAccordion(id)}
            style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
          >
            <span style={{ fontSize: 11, fontFamily: APP.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.3, color: textCol }}>{title}</span>
            <span style={{ fontSize: 10, color: labelCol, transition: "transform 0.15s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
          </button>
          {isOpen && (
            <div style={{ padding: "4px 16px 16px" }}>
              {children}
            </div>
          )}
        </div>
      );
    };

    const Swatch = ({ color, label }) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
        <input type="color" value={color.startsWith("rgba") ? "#888888" : color} onChange={e => {
          const key = Object.keys(tokens).find(k => tokens[k] === color);
          if (key) update(key, e.target.value);
        }} style={{ width: 24, height: 24, border: "none", borderRadius: 4, cursor: "pointer", padding: 0, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: labelCol, marginBottom: 1 }}>{label}</div>
          <div style={{ fontSize: 10, fontFamily: APP.mono, color: "#52525B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{color}</div>
        </div>
      </div>
    );

    const sp = n => tokens.spaceUnit * n;
    const sizes = {};
    for (let i = -2; i <= 5; i++) sizes[i] = typeScale(tokens.baseSize, tokens.scaleRatio, i);

    if (tokenPanelCollapsed) {
      return (
        <div style={{ width: 36, borderLeft: `1px solid ${panelBorder}`, background: panelBg, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12 }}>
          <button onClick={() => setTokenPanelCollapsed(false)} title="Expand token panel" style={{ background: "none", border: "none", cursor: "pointer", color: labelCol, fontSize: 14, padding: "6px 0", lineHeight: 1 }}>‹</button>
          <div style={{ marginTop: 12, writingMode: "vertical-rl", textOrientation: "mixed", fontSize: 9, fontFamily: APP.mono, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, color: "#A1A1AA", userSelect: "none" }}>Tokens</div>
        </div>
      );
    }

    return (
      <div style={{ width: APP.inspector, borderLeft: `1px solid ${panelBorder}`, background: panelBg, overflowY: "auto", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        {/* Panel header */}
        <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${panelBorder}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, fontFamily: APP.mono, color: textCol, textTransform: "uppercase", letterSpacing: 1.5 }}>Tokens</div>
            <button onClick={() => setTokenPanelCollapsed(true)} title="Collapse token panel" style={{ background: "none", border: "none", cursor: "pointer", color: labelCol, fontSize: 14, padding: "0 2px", lineHeight: 1 }}>›</button>
          </div>
          <button onClick={() => go("themes")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#E4E4E7", border: "none", borderRadius: 6, padding: "8px 10px", cursor: "pointer", width: "100%", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: textCol, fontFamily: APP.sans, textAlign: "left", lineHeight: 1.2 }}>{tokens.name}</div>
              <div style={{ fontSize: 11, color: labelCol, fontFamily: APP.mono, textAlign: "left", marginTop: 2 }}>{THEMES[activeTheme]?.archetype}</div>
            </div>
            <span style={{ fontSize: 12, color: labelCol }}>→</span>
          </button>
          <p style={{ fontSize: 11, color: labelCol, lineHeight: 1.55, margin: 0 }}>
            Edit tokens below to customize your theme. Changes update all component previews live.
          </p>
        </div>

        {/* Color accordion */}
        <AccordionSection id="color" title="Color">
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontFamily: APP.mono, color: labelCol, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Brand</div>
            <ColorInput label="Primary" value={tokens.primary} onChange={v => update("primary", v)} />
            <ColorInput label="Secondary" value={tokens.secondary} onChange={v => update("secondary", v)} />
            <ColorInput label="Accent" value={tokens.accent} onChange={v => update("accent", v)} />
          </div>
          <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 9, fontFamily: APP.mono, color: labelCol, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Semantic</div>
            <ColorInput label="Success" value={tokens.success} onChange={v => update("success", v)} />
            <ColorInput label="Warning" value={tokens.warning} onChange={v => update("warning", v)} />
            <ColorInput label="Error" value={tokens.error} onChange={v => update("error", v)} />
          </div>
          <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: 10 }}>
            <div style={{ fontSize: 9, fontFamily: APP.mono, color: labelCol, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Surface</div>
            <ColorInput label="Surface" value={tokens.surface} onChange={v => update("surface", v)} />
            <ColorInput label="Surface 2" value={tokens.surfaceSecondary} onChange={v => update("surfaceSecondary", v)} />
            <ColorInput label="Text" value={tokens.textPrimary} onChange={v => update("textPrimary", v)} />
            <ColorInput label="Text dim" value={tokens.textSecondary} onChange={v => update("textSecondary", v)} />
          </div>
          {/* Swatch row */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 10 }}>
            {[tokens.primary, tokens.secondary, tokens.accent, tokens.success, tokens.warning, tokens.error].map((c, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: 5, background: c, border: `1px solid ${panelBorder}` }} title={c} />
            ))}
          </div>
        </AccordionSection>

        {/* Typography accordion */}
        <AccordionSection id="typography" title="Typography">
          <SliderInput label="Base size" value={tokens.baseSize} onChange={v => update("baseSize", v)} min={12} max={20} suffix="px" />
          <SliderInput label="Scale ratio" value={tokens.scaleRatio} onChange={v => update("scaleRatio", v)} min={1.1} max={1.5} step={0.01} />
          <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: 10, marginTop: 4 }}>
            <div style={{ fontSize: 9, fontFamily: APP.mono, color: labelCol, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Type scale</div>
            {[
              { label: "Display", step: 4, weight: tokens.headingWeight, font: tokens.fontHeading },
              { label: "Headline", step: 3, weight: tokens.headingWeight, font: tokens.fontHeading },
              { label: "Title", step: 1, weight: tokens.headingWeight, font: tokens.fontHeading },
              { label: "Body", step: 0, weight: 400, font: tokens.fontBody },
              { label: "Small", step: -1, weight: 400, font: tokens.fontBody },
            ].map(({ label, step, weight, font }) => (
              <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 9, fontFamily: APP.mono, color: labelCol, width: 36, flexShrink: 0 }}>{Math.round(sizes[step])}px</span>
                <span style={{ fontSize: Math.min(sizes[step], 18), fontWeight: weight, fontFamily: font, color: textCol, lineHeight: 1.2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${panelBorder}`, paddingTop: 10, marginTop: 6, fontSize: 11, color: labelCol, lineHeight: 1.8 }}>
            <div><span style={{ color: "#A1A1AA" }}>Heading:</span> {tokens.fontHeading.split("'")[1] || "System"}</div>
            <div><span style={{ color: "#A1A1AA" }}>Body:</span> {tokens.fontBody.split("'")[1] || "System"}</div>
            <div><span style={{ color: "#A1A1AA" }}>Mono:</span> {tokens.fontMono.split("'")[1] || "Monospace"}</div>
          </div>
        </AccordionSection>

        {/* Spacing accordion */}
        <AccordionSection id="spacing" title="Spacing">
          <div style={{ fontSize: 9, fontFamily: APP.mono, color: labelCol, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Base unit: {tokens.spaceUnit}px</div>
          <div style={{ display: "flex", gap: 5, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 10 }}>
            {[1, 2, 3, 4, 6, 8, 12].map(n => (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ width: Math.min(tokens.spaceUnit * n, 40), height: Math.min(tokens.spaceUnit * n, 40), background: alpha(tokens.primary, 0.18), borderRadius: 2 }} />
                <span style={{ fontSize: 8, fontFamily: APP.mono, color: labelCol }}>{tokens.spaceUnit * n}</span>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Shapes accordion */}
        <AccordionSection id="shapes" title="Shape">
          <SliderInput label="Radius sm" value={tokens.radiusSm} onChange={v => update("radiusSm", v)} min={0} max={16} suffix="px" />
          <SliderInput label="Radius md" value={tokens.radiusMd} onChange={v => update("radiusMd", v)} min={0} max={24} suffix="px" />
          <SliderInput label="Radius lg" value={tokens.radiusLg} onChange={v => update("radiusLg", v)} min={0} max={32} suffix="px" />
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10 }}>
            {[{ label: "sm", radius: tokens.radiusSm }, { label: "md", radius: tokens.radiusMd }, { label: "lg", radius: tokens.radiusLg }].map(({ label, radius }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ width: 48, height: 30, borderRadius: radius, background: alpha(tokens.primary, 0.1), border: `1.5px solid ${tokens.primary}`, marginBottom: 4 }} />
                <div style={{ fontSize: 9, color: labelCol, fontFamily: APP.mono }}>{label} · {radius}px</div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Bottom spacer */}
        <div style={{ flex: 1 }} />
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${panelBorder}` }}>
          <button onClick={() => go("export")} style={{ width: "100%", padding: "8px 0", borderRadius: 6, border: "none", background: "#18181B", color: "#fff", fontSize: 11, cursor: "pointer", fontFamily: APP.mono, fontWeight: 500 }}>Export CSS →</button>
        </div>
      </div>
    );
  }

  // ── Canvas: Overview ──────────────────────────────────────────────────────
  function renderOverview() {
    return (
      <div style={{ background: "#0F0F0F", minHeight: "100%", padding: "52px 48px 64px", color: "#F5F5F5" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: "#555", textTransform: "uppercase", letterSpacing: 3, marginBottom: 14 }}>Agentic Product Design Framework</div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 38, fontWeight: 600, margin: "0 0 14px", color: "#F5F5F5", lineHeight: 1.15 }}>Design System Studio</h1>
            <p style={{ fontSize: 15, color: "#888", lineHeight: 1.65, margin: 0, maxWidth: 540 }}>Build a token-based design system with live component previews. Choose a theme, customize every token, and export to CSS or Figma.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 44 }}>
            <div onClick={() => go("themes")} style={{ background: "#161616", borderRadius: 12, padding: 28, border: "1px solid #242424", cursor: "pointer", transition: "border-color 0.15s" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#F5F5F5", marginBottom: 12 }}>I need a design system</div>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.55, margin: "0 0 18px" }}>Choose a theme, customize tokens, preview 24 components live, and export to CSS or push to Figma.</p>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#C8C8C8", fontFamily: APP.mono }}>Start building →</span>
            </div>
            <div onClick={() => go("figma")} style={{ background: "#161616", borderRadius: 12, padding: 28, border: "1px solid #242424", cursor: "pointer", transition: "border-color 0.15s" }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#F5F5F5", marginBottom: 12 }}>I already have one</div>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.55, margin: "0 0 18px" }}>Connect your Figma file via MCP. Claude reads your system and scores it against industry standards.</p>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#C8C8C8", fontFamily: APP.mono }}>Run an audit →</span>
            </div>
          </div>
          <div style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>How it works</div>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { nav: ["themes", null], step: "01", label: "Themes", desc: "Choose a foundation" },
                { nav: ["tokens", "color"], step: "02", label: "Tokens", desc: "Customize every detail" },
                { nav: ["component", "button"], step: "03", label: "Components", desc: "Preview 24 live" },
                { nav: ["preview", null], step: "04", label: "Preview", desc: "See in context" },
                { nav: ["export", null], step: "05", label: "Export", desc: "Copy CSS variables" },
                { nav: ["figma", null], step: "06", label: "Figma", desc: "Push via MCP" },
              ].map((s, i) => (
                <div key={s.step} onClick={() => go(s.nav[0], s.nav[1])} style={{ flex: 1, background: "#161616", borderRadius: 8, padding: "16px 12px", border: "1px solid #242424", cursor: "pointer", textAlign: "center", position: "relative" }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: "#555", fontFamily: APP.mono, marginBottom: 8 }}>{s.step}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "#777", lineHeight: 1.3 }}>{s.desc}</div>
                  {i < 5 && <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "#444" }}>›</div>}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: "#555", textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>What's included</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              {[
                { value: "6", label: "Themes", desc: "Precision, Enterprise, Warmth, Bold, Clinical, Soft" },
                { value: "24", label: "Components", desc: "14 core + 10 extended with full state coverage" },
                { value: "apdf-*", label: "Tokens", desc: "Three-layer architecture — ref, sys, comp" },
                { value: "MCP", label: "Figma", desc: "Variables, text styles, and component scaffolds" },
              ].map((item, i) => (
                <div key={i} style={{ borderRadius: 8, padding: "18px 16px", border: "1px solid #242424" }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: "#F5F5F5", fontFamily: APP.mono, marginBottom: 6 }}>{item.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#777", lineHeight: 1.4 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Canvas: Themes ────────────────────────────────────────────────────────
  function renderThemes() {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Choose a theme</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.5 }}>Each theme defines colors, typography, shape, and motion — not just a palette swap.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, marginBottom: 22 }}>
          {Object.entries(THEMES).map(([key, theme]) => {
            const isActive = activeTheme === key;
            return (
              <div key={key} onClick={() => applyTheme(key)} style={{ background: C.bg, borderRadius: 10, padding: 20, cursor: "pointer", border: `1.5px solid ${isActive ? C.text : C.border}`, boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s", position: "relative" }}>
                {isActive && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 10, padding: "2px 8px", borderRadius: 99, background: C.bgSub, color: C.sub, fontFamily: APP.mono, border: `1px solid ${C.border}` }}>Active</div>}
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: C.text }}>{theme.name}</div>
                <div style={{ fontSize: 13, color: C.sub, marginBottom: 14, lineHeight: 1.4 }}>{theme.desc}</div>
                <div style={{ display: "flex", gap: 4, alignItems: "flex-end", marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: theme.primary }} />
                  <div style={{ width: 36, height: 36, borderRadius: 6, background: theme.secondary }} />
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: theme.accent }} />
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: theme.success }} />
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: theme.error }} />
                </div>
                <div style={{ marginBottom: 12, padding: "10px 12px", background: theme.surface, borderRadius: theme.radiusMd, border: `1px solid ${theme.border}` }}>
                  <div style={{ fontFamily: theme.fontHeading, fontWeight: theme.headingWeight, fontSize: 15, color: theme.textPrimary, marginBottom: 3 }}>Heading text</div>
                  <div style={{ fontFamily: theme.fontBody, fontSize: 12, color: theme.textSecondary, lineHeight: 1.4 }}>Body in {theme.fontBody.split("'")[1] || "system"}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: C.dim }}>{theme.archetype}</span>
                  <span style={{ fontSize: 11, color: C.dim, fontFamily: APP.mono }}>radius: {theme.radiusMd}px</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => go("tokens", "color")} style={{ padding: "9px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.text, fontSize: 12, cursor: "pointer", fontFamily: APP.mono }}>Customize tokens →</button>
          <button onClick={() => go("component", "button")} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: C.text, color: C.bg, fontSize: 12, cursor: "pointer", fontFamily: APP.mono }}>Preview components →</button>
        </div>
      </div>
    );
  }

  // ── Canvas: Token Color ───────────────────────────────────────────────────
  function renderTokenColor() {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Color tokens</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>Edit color values. Changes update all component previews in real time.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
          <div style={{ background: C.bgSub, borderRadius: 10, padding: 18, border: `1px solid ${C.border}`, alignSelf: "start" }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Brand</div>
            <ColorInput label="Primary" value={tokens.primary} onChange={v => update("primary", v)} />
            <ColorInput label="Secondary" value={tokens.secondary} onChange={v => update("secondary", v)} />
            <ColorInput label="Accent" value={tokens.accent} onChange={v => update("accent", v)} />
            <div style={{ borderTop: `1px solid ${C.border}`, margin: "14px 0", paddingTop: 14 }}>
              <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Semantic</div>
              <ColorInput label="Success" value={tokens.success} onChange={v => update("success", v)} />
              <ColorInput label="Warning" value={tokens.warning} onChange={v => update("warning", v)} />
              <ColorInput label="Error" value={tokens.error} onChange={v => update("error", v)} />
            </div>
          </div>
          <div>
            <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Palette preview</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                {[{ label: "Primary", color: tokens.primary }, { label: "Secondary", color: tokens.secondary }, { label: "Accent", color: tokens.accent }, { label: "Success", color: tokens.success }, { label: "Warning", color: tokens.warning }, { label: "Error", color: tokens.error }].map(({ label, color }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ height: 56, borderRadius: 8, background: color, marginBottom: 6 }} />
                    <div style={{ fontSize: 9, color: C.sub, fontFamily: APP.mono, wordBreak: "break-all" }}>{color}</div>
                    <div style={{ fontSize: 10, color: C.dim, marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>WCAG contrast checker</div>
              {[
                { label: "Primary on surface", fg: tokens.primary, bg: tokens.surface },
                { label: "Text on surface", fg: tokens.textPrimary, bg: tokens.surface },
                { label: "Secondary text", fg: tokens.textSecondary, bg: tokens.surface },
                { label: "On primary", fg: contrastOn(tokens.primary), bg: tokens.primary },
                { label: "Success on surface", fg: tokens.success, bg: tokens.surface },
                { label: "Error on surface", fg: tokens.error, bg: tokens.surface },
              ].map(({ label, fg, bg }) => {
                const ratio = contrastRatio(fg, bg);
                const level = wcagLevel(ratio);
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7, padding: "7px 10px", background: C.bg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 4, background: bg, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: fg }} />
                      </div>
                      <span style={{ fontSize: 12, color: C.sub }}>{label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, fontFamily: APP.mono, color: C.dim }}>{ratio}:1</span>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: alpha(level.color, 0.1), color: level.color }}>{level.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Canvas: Token Typography ──────────────────────────────────────────────
  function renderTokenTypography() {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Typography tokens</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>Adjust base size and scale ratio. The full type scale updates live.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
          <div style={{ background: C.bgSub, borderRadius: 10, padding: 18, border: `1px solid ${C.border}`, alignSelf: "start" }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Scale</div>
            <SliderInput label="Base size" value={tokens.baseSize} onChange={v => update("baseSize", v)} min={12} max={20} suffix="px" />
            <SliderInput label="Scale ratio" value={tokens.scaleRatio} onChange={v => update("scaleRatio", v)} min={1.1} max={1.5} step={0.01} />
            <div style={{ borderTop: `1px solid ${C.border}`, margin: "14px 0", paddingTop: 14 }}>
              <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.5 }}>Fonts — {tokens.name}</div>
              <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.8 }}>
                <div><span style={{ color: C.dim }}>Heading: </span>{tokens.fontHeading.split("'")[1] || "System"}</div>
                <div><span style={{ color: C.dim }}>Body: </span>{tokens.fontBody.split("'")[1] || "System"}</div>
                <div><span style={{ color: C.dim }}>Mono: </span>{tokens.fontMono.split("'")[1] || "Monospace"}</div>
              </div>
            </div>
          </div>
          <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Type scale preview — {tokens.name}</div>
            <div style={{ background: tokens.surface, borderRadius: tokens.radiusLg, padding: 24, border: `1px solid ${tokens.border}` }}>
              {[
                { label: "Display", step: 4, weight: tokens.headingWeight, font: tokens.fontHeading },
                { label: "Headline", step: 3, weight: tokens.headingWeight, font: tokens.fontHeading },
                { label: "Title", step: 1, weight: tokens.headingWeight, font: tokens.fontHeading },
                { label: "Body", step: 0, weight: 400, font: tokens.fontBody },
                { label: "Small", step: -1, weight: 400, font: tokens.fontBody },
                { label: "Label", step: -2, weight: 500, font: tokens.fontBody },
              ].map(({ label, step, weight, font }) => (
                <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontFamily: APP.mono, color: tokens.textTertiary, width: 60, flexShrink: 0 }}>{Math.round(sizes[step])}px</span>
                  <span style={{ fontSize: sizes[step], fontWeight: weight, fontFamily: font, color: tokens.textPrimary, lineHeight: 1.3 }}>{label} — {tokens.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Canvas: Token Spacing ─────────────────────────────────────────────────
  function renderTokenSpacing() {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Spacing & shape tokens</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>Adjust border radii. The spacing unit is {tokens.spaceUnit}px for the active theme.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
          <div style={{ background: C.bgSub, borderRadius: 10, padding: 18, border: `1px solid ${C.border}`, alignSelf: "start" }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Shape</div>
            <SliderInput label="Radius sm" value={tokens.radiusSm} onChange={v => update("radiusSm", v)} min={0} max={16} suffix="px" />
            <SliderInput label="Radius md" value={tokens.radiusMd} onChange={v => update("radiusMd", v)} min={0} max={24} suffix="px" />
            <SliderInput label="Radius lg" value={tokens.radiusLg} onChange={v => update("radiusLg", v)} min={0} max={32} suffix="px" />
          </div>
          <div>
            <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Spacing scale · {tokens.spaceUnit}px base</div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 6, 8, 12, 16].map(n => (
                  <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: tokens.spaceUnit * n, height: tokens.spaceUnit * n, maxWidth: 64, maxHeight: 64, background: alpha(tokens.primary, 0.15), borderRadius: 2 }} />
                    <span style={{ fontSize: 9, fontFamily: APP.mono, color: C.dim }}>{tokens.spaceUnit * n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Radius preview</div>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                {[{ label: "sm", radius: tokens.radiusSm }, { label: "md", radius: tokens.radiusMd }, { label: "lg", radius: tokens.radiusLg }].map(({ label, radius }) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ width: 72, height: 44, borderRadius: radius, background: alpha(tokens.primary, 0.08), border: `1.5px solid ${tokens.primary}`, marginBottom: 6 }} />
                    <div style={{ fontSize: 10, color: C.dim, fontFamily: APP.mono }}>{label} · {radius}px</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Canvas: Component Preview ─────────────────────────────────────────────
  function renderComponent() {
    if (!PreviewComp || !activeComp) return null;
    const t = darkMode ? (() => {
      const dp = adaptPrimaryForDark(tokens.primary, tokens.accent);
      const ds = adaptPrimaryForDark(tokens.secondary, tokens.accent);
      return { ...tokens, primary: dp, secondary: ds, surface: "#111111", surfaceSecondary: "#1A1A1A", textPrimary: "#F5F5F5", textSecondary: "#A3A3A3", textTertiary: "#737373", border: "#2A2A2A", disabledBg: "#1A1A1A", disabledText: "#525252", disabledBorder: "#2A2A2A", placeholder: "#737373", toggleOff: "#404040", toggleKnob: "#E5E5E5" };
    })() : { ...tokens, disabledBg: "#F3F4F6", disabledText: "#9CA3AF", disabledBorder: "#E5E5E5", placeholder: "#9CA3AF", toggleOff: "#D1D5DB", toggleKnob: "#FFFFFF" };
    const labelStyle = { fontSize: 10, fontFamily: APP.mono, textTransform: "uppercase", letterSpacing: 1.4, color: C.dim, marginBottom: 10, fontWeight: 600 };
    return (
      <div style={{ padding: "32px 36px 56px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: -0.3 }}>{activeComp.name}</h2>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, fontFamily: APP.mono, color: C.dim, background: C.bgSub, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 8px" }}>{activeComp.cat}</span>
              <span style={{ fontSize: 11, fontFamily: APP.mono, color: activeComp.tier === 1 ? tokens.primary : C.dim, background: activeComp.tier === 1 ? alpha(tokens.primary, 0.07) : C.bgSub, border: `1px solid ${activeComp.tier === 1 ? alpha(tokens.primary, 0.2) : C.border}`, borderRadius: 4, padding: "2px 8px" }}>Tier {activeComp.tier}</span>
              <span style={{ fontSize: 11, fontFamily: APP.mono, color: C.sub, background: alpha(tokens.primary, 0.05), padding: "2px 8px", borderRadius: 4, border: `1px solid ${alpha(tokens.primary, 0.12)}` }}>{tokens.name}</span>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div style={{ background: darkMode ? "#111111" : tokens.surface, borderRadius: tokens.radiusLg, padding: "32px 36px", border: `1px solid ${darkMode ? "#2A2A2A" : tokens.border}`, transition: "all 0.2s", marginBottom: 40 }}>
          <PreviewComp t={t} />
        </div>

        {/* Description */}
        <p style={{ fontSize: 16, color: C.sub, lineHeight: 1.75, margin: "0 0 40px", maxWidth: 640 }}>{activeComp.desc}</p>

        {/* Use when / Avoid when */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
          <div>
            <div style={labelStyle}>Use when</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {activeComp.use.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, fontSize: 14, color: C.sub, lineHeight: 1.6 }}>
                  <span style={{ color: tokens.primary, flexShrink: 0, marginTop: 3, fontSize: 10 }}>↳</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div style={labelStyle}>Avoid when</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {activeComp.avoid.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, fontSize: 14, color: C.sub, lineHeight: 1.6 }}>
                  <span style={{ color: C.dim, flexShrink: 0, marginTop: 3 }}>—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Variants */}
        <div style={{ marginBottom: 36 }}>
          <div style={labelStyle}>Variants</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {activeComp.variants.map((v, i) => (
              <span key={i} style={{ fontSize: 12, color: C.sub, background: C.bgSub, border: `1px solid ${C.border}`, borderRadius: 5, padding: "4px 10px", fontFamily: APP.mono }}>{v}</span>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div style={{ marginBottom: 32 }}>
          <div style={labelStyle}>Accessibility</div>
          <p style={{ fontSize: 14, color: C.sub, lineHeight: 1.7, margin: 0, maxWidth: 620 }}>{activeComp.a11y}</p>
        </div>

        {/* Token reference */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.bgSub, borderRadius: 7, padding: "10px 14px", border: `1px solid ${C.border}`, fontSize: 11, fontFamily: APP.mono }}>
          <span style={{ color: C.sub }}>--apdf-comp-{activeComp.id}-*</span>
          <span style={{ color: C.dim }}>→</span>
          <span style={{ color: tokens.primary }}>--apdf-sys-*</span>
        </div>
      </div>
    );
  }

  // ── Canvas: In-Context Preview ────────────────────────────────────────────
  function renderPreview() {
    const t = tokens;
    const sp = n => t.spaceUnit * n;
    const ts = step => Math.round(typeScale(t.baseSize, t.scaleRatio, step));
    const Btn = ({ label, filled, small, ghost, invert }) => (
      <button style={{ padding: small ? `${sp(1.5)}px ${sp(3)}px` : `${sp(2.5)}px ${sp(5)}px`, borderRadius: t.radiusMd, fontSize: small ? t.baseSize - 2 : t.baseSize - 1, fontWeight: 500, fontFamily: t.fontBody, cursor: "pointer", transition: `all ${t.motionFast}`, background: invert ? contrastOn(t.primary) : filled ? t.primary : "transparent", color: invert ? t.primary : filled ? contrastOn(t.primary) : ghost ? t.textSecondary : t.primary, border: filled || invert ? "none" : ghost ? "1.5px solid transparent" : `1.5px solid ${t.primary}` }}>{label}</button>
    );
    const Av = ({ initials, size = 32, color }) => (
      <div style={{ width: size, height: size, borderRadius: "50%", background: alpha(color || t.primary, 0.12), display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 600, color: color || t.primary, fontFamily: t.fontBody, flexShrink: 0 }}>{initials}</div>
    );
    const Spark = ({ data, color, w = 80, h = 28 }) => {
      const max = Math.max(...data), min = Math.min(...data);
      const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
      return (<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><polyline points={`${pts} ${w},${h} 0,${h}`} fill={alpha(color, 0.08)} stroke="none" /></svg>);
    };
    const ImgPlaceholder = ({ w, h, radius, label }) => (
      <div style={{ width: w || "100%", height: h || 120, borderRadius: radius || t.radiusMd, background: `linear-gradient(135deg, ${alpha(t.primary, 0.08)}, ${alpha(t.accent, 0.12)})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {label && <span style={{ fontSize: t.baseSize - 2, color: t.textTertiary, fontFamily: t.fontBody }}>{label}</span>}
      </div>
    );
    const BarChart = ({ data, color, h = 120 }) => {
      const max = Math.max(...data.map(d => d.v));
      return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: h, padding: `0 ${sp(1)}px` }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: `${(d.v / max) * (h - 20)}px`, borderRadius: `${t.radiusSm}px ${t.radiusSm}px 0 0`, background: d.highlight ? color : alpha(color, 0.2), transition: `height ${t.motionNormal}` }} />
              <span style={{ fontSize: 9, color: t.textTertiary, fontFamily: t.fontMono }}>{d.l}</span>
            </div>
          ))}
        </div>
      );
    };
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>In-context preview</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0, lineHeight: 1.5 }}>See how your design system looks applied to real UI. All elements use your active tokens.</p>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {[{ id: "website", label: "Website" }, { id: "dashboard", label: "Dashboard" }, { id: "mobile", label: "Mobile app" }].map(opt => (
            <button key={opt.id} onClick={() => setPreviewType(opt.id)} style={{ padding: "6px 16px", borderRadius: 99, fontSize: 12, cursor: "pointer", fontFamily: APP.mono, border: `1px solid ${previewType === opt.id ? C.text : C.border}`, background: previewType === opt.id ? C.text : "transparent", color: previewType === opt.id ? C.bg : C.sub, transition: "all 0.15s" }}>{opt.label}</button>
          ))}
        </div>

        {/* ── Website ── */}
        {previewType === "website" && (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: `${sp(3.5)}px ${sp(8)}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: sp(2) }}>
                <div style={{ width: 28, height: 28, borderRadius: t.radiusMd, background: t.primary, display: "flex", alignItems: "center", justifyContent: "center", color: contrastOn(t.primary), fontSize: 12, fontWeight: 700 }}>A</div>
                <span style={{ fontFamily: t.fontHeading, fontWeight: t.headingWeight, fontSize: t.baseSize + 1, color: t.textPrimary }}>Acme</span>
              </div>
              <div style={{ display: "flex", gap: sp(6), alignItems: "center" }}>
                {["Product", "Solutions", "Pricing", "Docs"].map(l => <span key={l} style={{ fontSize: t.baseSize - 1, color: t.textSecondary, fontFamily: t.fontBody, cursor: "pointer" }}>{l}</span>)}
                <Btn label="Sign in" ghost small />
                <Btn label="Start free" filled small />
              </div>
            </div>
            <div style={{ background: t.surface, padding: `${sp(16)}px ${sp(8)}px ${sp(10)}px` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: sp(10), alignItems: "center" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: sp(2), padding: `${sp(1)}px ${sp(3)}px`, borderRadius: t.radiusFull, background: alpha(t.success, 0.08), border: `1px solid ${alpha(t.success, 0.15)}`, marginBottom: sp(5) }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.success }} />
                    <span style={{ fontSize: t.baseSize - 3, color: t.success, fontWeight: 500, fontFamily: t.fontBody }}>2,400+ teams building with Acme</span>
                  </div>
                  <h1 style={{ fontFamily: t.fontHeading, fontWeight: t.headingWeight, fontSize: ts(5), color: t.textPrimary, margin: `0 0 ${sp(4)}px`, lineHeight: 1.1 }}>Ship products faster, together</h1>
                  <p style={{ fontFamily: t.fontBody, fontSize: t.baseSize + 1, color: t.textSecondary, margin: `0 0 ${sp(6)}px`, lineHeight: 1.6 }}>The all-in-one platform for design, prototyping, and handoff. Built for teams who care about craft.</p>
                  <div style={{ display: "flex", gap: sp(3), marginBottom: sp(5) }}>
                    <Btn label="Start building — free" filled />
                    <Btn label="Book a demo" />
                  </div>
                </div>
                <div style={{ background: t.surfaceSecondary, borderRadius: t.radiusLg, border: `1px solid ${t.border}`, overflow: "hidden", boxShadow: t.shadowLg }}>
                  <div style={{ padding: `${sp(2)}px ${sp(3)}px`, borderBottom: `1px solid ${t.border}`, display: "flex", gap: 4, alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.error, opacity: 0.7 }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.warning, opacity: 0.7 }} />
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.success, opacity: 0.7 }} />
                    <div style={{ flex: 1, height: 16, borderRadius: t.radiusSm, background: t.surface, marginLeft: 8 }} />
                  </div>
                  <div style={{ padding: sp(3) }}>
                    <div style={{ display: "flex", gap: sp(2), marginBottom: sp(3) }}>
                      {[65, 42, 88, 71].map((v, i) => (
                        <div key={i} style={{ flex: 1, background: t.surface, borderRadius: t.radiusSm, padding: sp(2) }}>
                          <div style={{ width: "50%", height: 6, borderRadius: 3, background: alpha(t.textTertiary, 0.15), marginBottom: 6 }} />
                          <div style={{ fontSize: 14, fontWeight: t.headingWeight, color: t.textPrimary, fontFamily: t.fontHeading }}>{v}%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: t.surface, borderRadius: t.radiusSm, padding: sp(2), marginBottom: sp(2) }}>
                      <BarChart data={[{l:"M",v:35},{l:"T",v:52},{l:"W",v:41},{l:"T",v:68,highlight:true},{l:"F",v:55},{l:"S",v:30},{l:"S",v:22}]} color={t.primary} h={60} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: t.surfaceSecondary, padding: `${sp(12)}px ${sp(8)}px` }}>
              <div style={{ textAlign: "center", marginBottom: sp(8) }}>
                <h2 style={{ fontFamily: t.fontHeading, fontWeight: t.headingWeight, fontSize: ts(3), color: t.textPrimary, margin: 0 }}>Loved by design teams</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: sp(4) }}>
                {[
                  { quote: "Replaced three tools and saved us two weeks on every project. The token architecture is exactly right.", name: "Sarah Jensen", role: "Design Lead, Meridian", initials: "SJ" },
                  { quote: "The Figma export alone justified switching. Variables, modes, aliases — all set up in under a minute.", name: "Alex Chen", role: "Staff Designer, Lattice", initials: "AC" },
                  { quote: "Finally, a design system tool that understands the difference between reference and semantic tokens.", name: "Jordan Lee", role: "Design Systems, Stripe", initials: "JL" },
                ].map((t2, i) => (
                  <div key={i} style={{ background: t.surface, borderRadius: t.radiusLg, padding: sp(5), border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: sp(3) }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color: t.warning, fontSize: 12 }}>★</span>)}</div>
                    <p style={{ fontFamily: t.fontBody, fontSize: t.baseSize - 1, color: t.textSecondary, lineHeight: 1.6, margin: `0 0 ${sp(4)}px` }}>"{t2.quote}"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: sp(2.5) }}>
                      <Av initials={t2.initials} size={36} />
                      <div>
                        <div style={{ fontSize: t.baseSize - 1, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontBody }}>{t2.name}</div>
                        <div style={{ fontSize: t.baseSize - 2, color: t.textTertiary, fontFamily: t.fontBody }}>{t2.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: t.primary, padding: `${sp(12)}px ${sp(8)}px`, textAlign: "center" }}>
              <h3 style={{ fontFamily: t.fontHeading, fontWeight: t.headingWeight, fontSize: ts(4), color: contrastOn(t.primary), margin: `0 0 ${sp(3)}px` }}>Ready to build?</h3>
              <div style={{ display: "flex", gap: sp(3), justifyContent: "center" }}>
                <Btn label="Start free trial" invert />
                <button style={{ padding: `${sp(2.5)}px ${sp(5)}px`, borderRadius: t.radiusMd, border: `1.5px solid ${alpha(contrastOn(t.primary), 0.3)}`, background: "transparent", color: contrastOn(t.primary), fontSize: t.baseSize - 1, fontFamily: t.fontBody, cursor: "pointer" }}>Talk to sales</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Dashboard ── */}
        {previewType === "dashboard" && (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: "210px 1fr", minHeight: 640 }}>
            <div style={{ background: t.surface, borderRight: `1px solid ${t.border}`, padding: `${sp(5)}px 0`, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: `0 ${sp(4)}px ${sp(5)}px`, display: "flex", alignItems: "center", gap: sp(2), borderBottom: `1px solid ${t.border}`, marginBottom: sp(2) }}>
                <div style={{ width: 26, height: 26, borderRadius: t.radiusSm, background: t.primary, display: "flex", alignItems: "center", justifyContent: "center", color: contrastOn(t.primary), fontSize: 10, fontWeight: 700 }}>A</div>
                <div>
                  <div style={{ fontFamily: t.fontHeading, fontWeight: t.headingWeight, fontSize: t.baseSize - 1, color: t.textPrimary }}>Acme Workspace</div>
                  <div style={{ fontSize: t.baseSize - 3, color: t.textTertiary, fontFamily: t.fontBody }}>Pro plan</div>
                </div>
              </div>
              {[{ icon: "◆", label: "Overview", active: true }, { icon: "◎", label: "Analytics" }, { icon: "▤", label: "Projects", badge: "6" }, { icon: "▦", label: "Components" }, { icon: "⬡", label: "Tokens" }].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: sp(2.5), padding: `${sp(2)}px ${sp(4)}px`, cursor: "pointer", margin: `0 ${sp(2)}px`, borderRadius: t.radiusMd, background: item.active ? alpha(t.primary, 0.06) : "transparent" }}>
                  <span style={{ fontSize: 12, color: item.active ? t.primary : t.textTertiary, width: 16, textAlign: "center" }}>{item.icon}</span>
                  <span style={{ fontSize: t.baseSize - 2, fontFamily: t.fontBody, fontWeight: item.active ? 600 : 400, color: item.active ? t.primary : t.textSecondary, flex: 1 }}>{item.label}</span>
                  {item.badge && <span style={{ fontSize: 9, fontWeight: 600, padding: "1px 6px", borderRadius: 99, background: alpha(t.primary, 0.08), color: t.primary }}>{item.badge}</span>}
                </div>
              ))}
              <div style={{ flex: 1 }} />
              <div style={{ borderTop: `1px solid ${t.border}`, padding: `${sp(3)}px ${sp(4)}px 0`, margin: `${sp(3)}px ${sp(2)}px 0` }}>
                <div style={{ display: "flex", alignItems: "center", gap: sp(2.5), padding: `${sp(2)}px`, borderRadius: t.radiusMd, cursor: "pointer" }}>
                  <Av initials="QR" size={30} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: t.baseSize - 2, fontWeight: 500, color: t.textPrimary, fontFamily: t.fontBody }}>Quin Robinson</div>
                    <div style={{ fontSize: t.baseSize - 4, color: t.textTertiary, fontFamily: t.fontBody }}>quin@acme.co</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: t.surfaceSecondary, display: "flex", flexDirection: "column" }}>
              <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: `${sp(3)}px ${sp(5)}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: ts(1), fontWeight: t.headingWeight, fontFamily: t.fontHeading, color: t.textPrimary }}>Overview</div>
                  <div style={{ fontSize: t.baseSize - 2, color: t.textTertiary, fontFamily: t.fontBody }}>Monday, April 6, 2026</div>
                </div>
                <div style={{ display: "flex", gap: sp(2), alignItems: "center" }}>
                  <Btn label="New project" filled small />
                </div>
              </div>
              <div style={{ padding: sp(5), flex: 1 }}>
                <div style={{ background: alpha(t.success, 0.06), border: `1px solid ${alpha(t.success, 0.15)}`, borderRadius: t.radiusMd, padding: `${sp(2.5)}px ${sp(4)}px`, marginBottom: sp(4), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: sp(2), fontSize: t.baseSize - 1, fontFamily: t.fontBody, color: t.textPrimary }}>
                    <span style={{ color: t.success, fontWeight: 600 }}>✓</span> Design system exported — 94 variables, 11 text styles created
                  </div>
                  <span style={{ color: t.textTertiary, cursor: "pointer", fontSize: 12 }}>✕</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: sp(3), marginBottom: sp(5) }}>
                  {[
                    { label: "Active projects", value: "24", spark: [12,15,14,18,22,19,24], color: t.primary },
                    { label: "Components", value: "147", spark: [100,108,112,120,130,140,147], color: t.accent },
                    { label: "Team members", value: "8", spark: [4,5,5,6,6,7,8], color: t.success },
                    { label: "Issues open", value: "3", spark: [8,7,6,5,4,4,3], color: t.warning },
                  ].map((m, i) => (
                    <div key={i} style={{ background: t.surface, borderRadius: t.radiusMd, padding: sp(3), border: `1px solid ${t.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: sp(2) }}>
                        <div style={{ fontSize: t.baseSize - 2, color: t.textSecondary, fontFamily: t.fontBody }}>{m.label}</div>
                        <Spark data={m.spark} color={m.color} />
                      </div>
                      <div style={{ fontSize: ts(2), fontWeight: t.headingWeight, fontFamily: t.fontHeading, color: t.textPrimary }}>{m.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: sp(3) }}>
                  <div style={{ background: t.surface, borderRadius: t.radiusMd, padding: sp(4), border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp(3) }}>
                      <div style={{ fontSize: t.baseSize, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontBody }}>Recent activity</div>
                    </div>
                    {[
                      { icon: "◆", text: "Button component updated — 3 variants", time: "2 min ago", color: t.primary },
                      { icon: "▦", text: "Design tokens exported to Figma", time: "1 hr ago", color: t.success },
                      { icon: "◎", text: "QA review complete — 2 issues filed", time: "3 hr ago", color: t.warning },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: sp(3), padding: `${sp(2.5)}px 0`, borderBottom: i < 2 ? `1px solid ${t.border}` : "none", alignItems: "flex-start" }}>
                        <div style={{ width: 28, height: 28, borderRadius: t.radiusSm, background: alpha(item.color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", color: item.color, fontSize: 11, flexShrink: 0 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: t.baseSize - 1, color: t.textPrimary, fontFamily: t.fontBody, marginBottom: 2 }}>{item.text}</div>
                          <div style={{ fontSize: t.baseSize - 3, color: t.textTertiary, fontFamily: t.fontBody }}>{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: t.surface, borderRadius: t.radiusMd, padding: sp(4), border: `1px solid ${t.border}` }}>
                    <div style={{ fontSize: t.baseSize, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontBody, marginBottom: sp(3) }}>Health score</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: sp(3) }}>
                      <div style={{ position: "relative", width: 80, height: 80 }}>
                        <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="none" stroke={alpha(t.primary, 0.1)} strokeWidth="8"/><circle cx="40" cy="40" r="30" fill="none" stroke={t.primary} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 30 * 0.87} ${2 * Math.PI * 30 * 0.13}`} strokeDashoffset={2 * Math.PI * 30 * 0.25} strokeLinecap="round"/></svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: t.textPrimary, fontFamily: t.fontHeading }}>87</div>
                      </div>
                    </div>
                    {[{ label: "Accessibility", pct: 94 }, { label: "Consistency", pct: 88 }, { label: "Coverage", pct: 79 }].map(({ label, pct }) => (
                      <div key={label} style={{ marginBottom: sp(2) }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: t.baseSize - 2, color: t.textSecondary, fontFamily: t.fontBody, marginBottom: 4 }}><span>{label}</span><span style={{ fontFamily: t.fontMono }}>{pct}%</span></div>
                        <div style={{ height: 4, borderRadius: 2, background: alpha(t.primary, 0.1) }}><div style={{ height: 4, borderRadius: 2, background: t.primary, width: `${pct}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Mobile ── */}
        {previewType === "mobile" && (
          <div style={{ display: "flex", justifyContent: "center", padding: `${sp(2)}px 0` }}>
            <div style={{ width: 390, height: 844, borderRadius: 44, border: "3px solid #1A1A1A", overflow: "hidden", boxShadow: "0 16px 64px rgba(0,0,0,0.12)", background: "#1A1A1A", padding: "8px", display: "flex", flexDirection: "column" }}>
              <div style={{ borderRadius: 36, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", background: t.surface }}>
                <div style={{ background: t.surface, padding: `${sp(2)}px ${sp(6)}px ${sp(1)}px`, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontMono, flexShrink: 0 }}>
                  <span>9:41</span>
                  <div style={{ display: "flex", gap: 5, alignItems: "center", fontSize: 12 }}><span style={{ letterSpacing: 1 }}>●●●●</span><span style={{ fontSize: 15 }}>▮</span></div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                  <div style={{ background: t.surface, padding: `${sp(2)}px ${sp(5)}px ${sp(4)}px` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp(4) }}>
                      <div>
                        <div style={{ fontSize: t.baseSize - 1, color: t.textTertiary, fontFamily: t.fontBody }}>Good morning, Quin</div>
                        <div style={{ fontFamily: t.fontHeading, fontWeight: t.headingWeight, fontSize: ts(3), color: t.textPrimary }}>Projects</div>
                      </div>
                      <Av initials="QR" size={44} />
                    </div>
                    <div style={{ background: t.surfaceSecondary, borderRadius: t.radiusMd, padding: `${sp(2.5)}px ${sp(3.5)}px`, display: "flex", alignItems: "center", gap: sp(2.5) }}>
                      <span style={{ fontSize: 15, color: t.textTertiary }}>◎</span>
                      <span style={{ fontSize: t.baseSize - 1, color: t.textTertiary, fontFamily: t.fontBody }}>Search projects...</span>
                    </div>
                  </div>
                  <div style={{ background: t.surface, padding: `${sp(1)}px ${sp(5)}px ${sp(4)}px`, display: "flex", gap: sp(2.5) }}>
                    {[{ label: "Active", count: "6", color: t.primary }, { label: "Review", count: "2", color: t.warning }, { label: "Complete", count: "12", color: t.success }].map((s, i) => (
                      <div key={i} style={{ flex: 1, padding: sp(3), borderRadius: t.radiusMd, background: alpha(s.color, 0.06), border: `1px solid ${alpha(s.color, 0.1)}` }}>
                        <div style={{ fontSize: ts(1), fontWeight: t.headingWeight, color: s.color, fontFamily: t.fontHeading, marginBottom: 2 }}>{s.count}</div>
                        <div style={{ fontSize: t.baseSize - 2, color: t.textSecondary, fontFamily: t.fontBody }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: t.surfaceSecondary, padding: `${sp(4)}px ${sp(5)}px` }}>
                    {[
                      { name: "Brand redesign", tag: "Active", tagColor: t.primary, progress: 68 },
                      { name: "Mobile app v3", tag: "Review", tagColor: t.warning, progress: 92 },
                      { name: "Design system", tag: "Active", tagColor: t.primary, progress: 45 },
                    ].map((item, i) => (
                      <div key={i} style={{ background: t.surface, borderRadius: t.radiusLg, marginBottom: sp(3), border: `1px solid ${t.border}`, overflow: "hidden", padding: sp(4) }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sp(2) }}>
                          <div style={{ fontSize: t.baseSize, fontWeight: 600, color: t.textPrimary, fontFamily: t.fontBody }}>{item.name}</div>
                          <span style={{ fontSize: t.baseSize - 3, padding: `${sp(0.5)}px ${sp(2)}px`, borderRadius: t.radiusFull, background: alpha(item.tagColor, 0.08), color: item.tagColor, fontFamily: t.fontBody }}>{item.tag}</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 3, background: alpha(t.primary, 0.08), marginBottom: 6 }}>
                          <div style={{ height: 5, borderRadius: 3, background: item.tagColor, width: `${item.progress}%` }} />
                        </div>
                        <div style={{ fontSize: t.baseSize - 3, color: t.textTertiary, fontFamily: t.fontMono }}>{item.progress}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ flexShrink: 0, background: t.surface, borderTop: `1px solid ${t.border}`, padding: `${sp(2.5)}px 0 ${sp(1.5)}px`, display: "flex", justifyContent: "space-around" }}>
                  {[{ icon: "◆", label: "Home", active: true }, { icon: "◎", label: "Explore" }, { icon: "▤", label: "Library" }, { icon: "●", label: "Profile" }].map((nav, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: `0 ${sp(3)}px` }}>
                      <span style={{ fontSize: 20, color: nav.active ? t.primary : t.textTertiary }}>{nav.icon}</span>
                      <span style={{ fontSize: 10, fontFamily: t.fontBody, fontWeight: nav.active ? 600 : 400, color: nav.active ? t.primary : t.textTertiary }}>{nav.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Canvas: Export CSS ────────────────────────────────────────────────────
  function renderExport() {
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Export CSS custom properties</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>Copy and paste into your project's root stylesheet. All values reflect your current token settings.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.dim, fontFamily: APP.mono }}>Theme: {tokens.name}</div>
          <button onClick={copyCSS} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: copied ? alpha("#22C55E", 0.08) : "transparent", color: copied ? "#22C55E" : C.text, fontSize: 12, cursor: "pointer", fontFamily: APP.mono, transition: "all 0.15s" }}>{copied ? "Copied ✓" : "Copy CSS"}</button>
        </div>
        <pre style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, fontSize: 11, fontFamily: APP.mono, color: C.sub, overflow: "auto", maxHeight: 600, lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>{cssOutput}</pre>
      </div>
    );
  }

  // ── Canvas: Figma MCP ─────────────────────────────────────────────────────
  function renderFigma() {
    const exportPrompt = `Export my Design System Studio tokens to Figma.

File: [PASTE YOUR FIGMA FILE URL]
Target page: "Design System" (create it if it doesn't exist)

Theme: ${tokens.name}
Token convention: --apdf-* (Reference → System → Component)

Here are the tokens:

${cssOutput}

Create:
1. Three variable collections (Reference, System, Component)
2. System collection with Light and Dark modes
3. Text styles for the full type scale
4. All color variables use aliases — System references Reference, Component references System`;

    const auditPrompt = `Run a complete design system audit on this Figma file:
[PASTE YOUR FIGMA FILE URL]

Read all variable collections, text styles, color styles, effect styles,
and component sets. Score against the APDF audit criteria:

- Foundations: token architecture, naming, light/dark modes
- Typography: scale coverage, consistency, naming
- Components: coverage against 24-component inventory (14 Tier 1 + 10 Tier 2)
- Accessibility: contrast ratios, touch targets, focus states
- Documentation: component descriptions, usage guidelines

Produce a gap analysis with severity levels (Critical / Major / Minor)
and a copy-paste remediation prompt for each finding.`;

    const copyPrompt = (id, text) => { navigator.clipboard.writeText(text); setPromptCopied(id); setTimeout(() => setPromptCopied(null), 2000); };
    const Step = ({ num, title, desc }) => (
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.bgSub, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: C.sub, flexShrink: 0 }}>{num}</div>
        <div><div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{title}</div><div style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{desc}</div></div>
      </div>
    );
    return (
      <div style={{ padding: 28 }}>
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>Figma MCP integration</h2>
          <p style={{ fontSize: 13, color: C.sub, margin: 0 }}>Export your design system to Figma or audit an existing one — all via Claude + MCP.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>Prerequisites</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["Claude Code installed", "Figma desktop app open", "Figma MCP connected", "Edit access to your file"].map(l => (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.sub }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${C.border}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.dim }}>✓</span>{l}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.dim, marginTop: 12, lineHeight: 1.5 }}>Not set up yet? Run <span style={{ fontFamily: APP.mono, background: C.bgSub, padding: "1px 6px", borderRadius: 4, border: `1px solid ${C.border}` }}>claude mcp add figma-developer-mcp</span> in your terminal.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ id: "export", label: "Export to Figma", desc: "Bring what you built in the Studio into your Figma file" }, { id: "audit", label: "Audit your Figma system", desc: "Evaluate an existing Figma design system against industry standards" }].map(opt => {
              const isActive = figmaPath === opt.id;
              return (
                <button key={opt.id} onClick={() => setFigmaPath(opt.id)} style={{ padding: "16px 18px", borderRadius: 10, cursor: "pointer", textAlign: "left", border: `1.5px solid ${isActive ? C.text : C.border}`, background: isActive ? C.bgSub : C.bg, transition: "all 0.15s" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{opt.label}</div>
                  <div style={{ fontSize: 13, color: C.sub, lineHeight: 1.4 }}>{opt.desc}</div>
                </button>
              );
            })}
          </div>
          {figmaPath === "export" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, fontFamily: APP.mono, color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Your system — {tokens.name} theme</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>Colors</div>
                    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                      {[tokens.primary, tokens.secondary, tokens.accent, tokens.success, tokens.warning, tokens.error].map((c, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: c }} />)}
                    </div>
                    <div style={{ fontSize: 11, color: C.sub }}>6 semantic colors + neutrals</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>Typography</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: tokens.fontHeading, marginBottom: 2 }}>{tokens.fontHeading.split("'")[1] || "System"}</div>
                    <div style={{ fontSize: 11, color: C.sub }}>{tokens.baseSize}px base · {tokens.scaleRatio} ratio</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: C.dim, marginBottom: 6 }}>Shape & spacing</div>
                    <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 2 }}>
                      <div style={{ width: 20, height: 14, borderRadius: tokens.radiusSm, border: `1.5px solid ${C.text}` }} />
                      <div style={{ width: 20, height: 14, borderRadius: tokens.radiusMd, border: `1.5px solid ${C.text}` }} />
                      <div style={{ width: 20, height: 14, borderRadius: tokens.radiusLg, border: `1.5px solid ${C.text}` }} />
                    </div>
                    <div style={{ fontSize: 11, color: C.sub }}>{tokens.spaceUnit}px grid · r{tokens.radiusSm}/{tokens.radiusMd}/{tokens.radiusLg}</div>
                  </div>
                </div>
              </div>
              <Step num="1" title="Configure your system" desc="Use the Tokens section to set your colors, typography, and shape. Preview components to verify everything looks right." />
              <Step num="2" title="Copy the export prompt below" desc="It includes your active theme's token values. Paste it into a Claude Code session with your Figma file URL." />
              <Step num="3" title="Claude creates your Figma variables" desc="Three variable collections (Reference, System, Component), text styles, and optionally component scaffolds — all linked by aliases." />
              <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Export prompt — {tokens.name} theme</div>
                  <button onClick={() => copyPrompt("export", exportPrompt)} style={{ padding: "5px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: promptCopied === "export" ? alpha("#22C55E", 0.08) : "transparent", color: promptCopied === "export" ? "#22C55E" : C.text, fontSize: 11, cursor: "pointer", fontFamily: APP.mono, transition: "all 0.15s" }}>{promptCopied === "export" ? "Copied ✓" : "Copy prompt"}</button>
                </div>
                <pre style={{ padding: 16, fontSize: 11, fontFamily: APP.mono, color: C.sub, lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 260, overflow: "auto", margin: 0 }}>{exportPrompt}</pre>
              </div>
            </div>
          )}
          {figmaPath === "audit" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Step num="1" title="Open your Figma file" desc="The file should contain your design system — variables, text styles, color styles, and component sets. Have the desktop app running." />
              <Step num="2" title="Copy the audit prompt below" desc="Paste it into Claude Code with your Figma file URL. Claude reads your system via MCP — you don't need to export anything." />
              <Step num="3" title="Review the gap analysis" desc="Claude scores your system across foundations, typography, components, accessibility, and documentation. Each gap includes a severity level and a remediation prompt." />
              <div style={{ background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>Audit prompt</div>
                  <button onClick={() => copyPrompt("audit", auditPrompt)} style={{ padding: "5px 14px", borderRadius: 6, border: `1px solid ${C.border}`, background: promptCopied === "audit" ? alpha("#22C55E", 0.08) : "transparent", color: promptCopied === "audit" ? "#22C55E" : C.text, fontSize: 11, cursor: "pointer", fontFamily: APP.mono, transition: "all 0.15s" }}>{promptCopied === "audit" ? "Copied ✓" : "Copy prompt"}</button>
                </div>
                <pre style={{ padding: 16, fontSize: 11, fontFamily: APP.mono, color: C.sub, lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 260, overflow: "auto", margin: 0 }}>{auditPrompt}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Root render ───────────────────────────────────────────────────────────
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: APP.sans }}>
      <link href={fontsUrl} rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      {renderTopbar()}
      {renderNavbar()}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {renderSidebar()}
        <main style={{ flex: 1, overflowY: "auto", background: activeNav.type === "overview" ? "#0F0F0F" : APP.canvasBg }}>
          {activeNav.type === "overview" && renderOverview()}
          {activeNav.type === "themes" && renderThemes()}
          {activeNav.type === "tokens" && activeNav.id === "color" && renderTokenColor()}
          {activeNav.type === "tokens" && activeNav.id === "typography" && renderTokenTypography()}
          {activeNav.type === "tokens" && activeNav.id === "spacing" && renderTokenSpacing()}
          {activeNav.type === "component" && renderComponent()}
          {activeNav.type === "preview" && renderPreview()}
          {activeNav.type === "export" && renderExport()}
          {activeNav.type === "figma" && renderFigma()}
        </main>
        {activeNav.type !== "overview" && activeNav.type !== "themes" && renderTokensPanel()}
      </div>
    </div>
  );
}
