/**
 * Design System Checklist
 * AI × UX Product Design Framework
 *
 * A comprehensive checklist synthesized from Google Material Design 3,
 * Atlassian Design System, IBM Carbon, and Apple HIG. Covers foundations,
 * core components, complex patterns, accessibility, documentation, and
 * AI acceleration — with Figma-ready prompts per item.
 *
 * Part of: github.com/quinrobinson/AI-x-UX-Product-Design-Framework
 * Figma:   figma.com/design/mrHuD7sY7h6uKSVndTSIQE
 */

import { useState, useCallback } from "react";

// ─── Token constants ──────────────────────────────────────────────────────────

const COLORS = {
  google:    { bg: "#E8F0FE", text: "#1A56DB", border: "#BFDBFE" },
  atlassian: { bg: "#E3FCEF", text: "#006644", border: "#ABF5D1" },
  carbon:    { bg: "#F2F4F8", text: "#21272A", border: "#DDE1E6" },
  apple:     { bg: "#FFF8E6", text: "#7D4E00", border: "#FFD580" },
  figma:     { bg: "#F0EFFE", text: "#4C3FB1", border: "#C4B5FD" },
  ai:        { bg: "#FEF0E7", text: "#7C2D12", border: "#FDC093" },
  a11y:      { bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7" },
};

const SYS_LABELS = { google: "Material", atlassian: "Atlassian", carbon: "Carbon", apple: "HIG" };

// ─── Checklist data ───────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "foundations",
    label: "Foundations",
    icon: "◆",
    items: [
      {
        label: "Design tokens defined",
        sub: "Color, spacing, radius, elevation, shadow — all expressed as named tokens, not hard-coded values.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "a11y"],
        prompt: "In Figma, list all design tokens for this component following Material Design 3 token naming conventions, including color roles, elevation, and shape.",
      },
      {
        label: "Color system documented",
        sub: "Primary, secondary, neutral, semantic palettes with light and dark mode variants.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["a11y"],
        prompt: "Generate a complete color system in Figma using Material You dynamic color with primary, secondary, tertiary, and surface roles for both light and dark mode.",
      },
      {
        label: "Typography scale established",
        sub: "Type ramp covers display, headline, title, body, label — each with size, weight, line-height, and letter-spacing.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma"],
        prompt: "Create a typography scale in Figma covering all levels: display large/medium/small, headline, title, body, label. Use Carbon or Material type tokens.",
      },
      {
        label: "Spacing & layout grid defined",
        sub: "4px or 8px base grid. Column, margin, and gutter values for each breakpoint.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma"],
        prompt: "Set up a responsive Figma layout grid: 4px base unit, 12-column desktop, 8-column tablet, 4-column mobile. Match IBM Carbon grid specs.",
      },
      {
        label: "Elevation & shadow system defined",
        sub: "Layering model — resting, raised, floating, overlay. Atlassian uses elevation tokens; Material uses tonal surface overlays.",
        systems: ["google", "atlassian", "carbon"],
        tags: ["atlassian", "google", "carbon"],
        prompt: "Define elevation tokens in Figma for 5 levels: flat, raised, sticky, overlay, dialog. Use Atlassian elevation model with shadow + surface color pairs.",
      },
      {
        label: "Motion & animation principles",
        sub: "Duration scales, easing curves, and principles for how elements enter, exit, and transition.",
        systems: ["google", "atlassian", "apple"],
        tags: ["google", "apple", "figma"],
        prompt: "Document the animation system in Figma: define 4 duration tokens (fast 100ms, standard 200ms, complex 400ms, gentle 600ms) and map them to easing presets.",
      },
      {
        label: "Iconography system established",
        sub: "Icon set defined, usage rules for size (16/20/24px), weight, style, and icon-only vs. icon+label patterns.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma"],
        prompt: "Create an icon usage guide in Figma: show icon-only, icon+label, and leading/trailing icon patterns for 16, 20, and 24px sizes using the active icon library.",
      },
    ],
  },
  {
    id: "core-components",
    label: "Core components",
    icon: "■",
    items: [
      {
        label: "Button hierarchy complete",
        sub: "Primary, secondary, tertiary, ghost, destructive, icon-only — all with hover, focus, disabled, and loading states.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "a11y"],
        prompt: "Build a Figma button component with variants: type (primary/secondary/tertiary/destructive), size (sm/md/lg), state (default/hover/focus/disabled/loading), and icon (none/leading/trailing).",
      },
      {
        label: "Form inputs fully specified",
        sub: "Text field, textarea, select, checkbox, radio, toggle — with label, helper text, validation states.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "a11y"],
        prompt: "Create a complete Figma form input component set: text input, textarea, select. Each with label, placeholder, helper text, and states: default, focus, error, success, disabled.",
      },
      {
        label: "Navigation patterns defined",
        sub: "Top nav, side nav, breadcrumbs, tabs, pagination. Responsive behavior and active/selected states documented.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma"],
        prompt: "Design a Figma navigation system: top nav bar, collapsible side nav, breadcrumbs, and bottom tab bar for mobile. Include active, hover, and collapsed states.",
      },
      {
        label: "Data display components",
        sub: "Tables, lists, cards, data grids — with sorting, filtering, empty states, and pagination behaviors.",
        systems: ["atlassian", "carbon", "google"],
        tags: ["atlassian", "carbon", "google", "figma"],
        prompt: "Build a Figma data table component with: sortable headers, row hover, row selection, empty state, and pagination controls. Follow Carbon data table patterns.",
      },
      {
        label: "Overlay patterns covered",
        sub: "Modal, drawer, tooltip, popover, toast — with opening/closing behavior and focus trap documentation.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "a11y"],
        prompt: "Create Figma components for: modal dialog, bottom sheet/drawer, tooltip (light/dark), and toast notification. Include sizes (sm/md/lg) and action slots.",
      },
      {
        label: "Status & feedback components",
        sub: "Alerts, banners, inline messages, progress indicators, badges, empty states.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "a11y"],
        prompt: "Design a Figma feedback component set: alert banner (info/warning/success/error), progress bar, circular spinner, badge counter, and inline validation message.",
      },
    ],
  },
  {
    id: "complex-patterns",
    label: "Complex patterns",
    icon: "▲",
    items: [
      {
        label: "Page-level layout patterns",
        sub: "Dashboard, detail page, settings, list/detail split-view — with responsive breakpoints and component placement logic.",
        systems: ["atlassian", "carbon"],
        tags: ["atlassian", "carbon", "figma"],
        prompt: "Generate a Figma dashboard layout: top nav + collapsible left sidebar + main content area with header, filter bar, data grid, and summary metric cards. 1440px desktop.",
      },
      {
        label: "Onboarding & empty state flows",
        sub: "First-run experience, zero-data states, and progressive disclosure patterns.",
        systems: ["google", "atlassian", "apple"],
        tags: ["figma", "ai"],
        prompt: "Design a Figma empty state component: illustration slot, headline, descriptive body text, and a primary CTA. Show populated vs. empty variants.",
      },
      {
        label: "Search & filter patterns",
        sub: "Global search, inline search, faceted filters — with typeahead, results, and no-results states.",
        systems: ["atlassian", "carbon"],
        tags: ["atlassian", "carbon", "figma"],
        prompt: "Build a Figma search component: search input with typeahead dropdown, filter chips row, and results list. Include loading and no-results states.",
      },
      {
        label: "Multi-step flows & wizards",
        sub: "Step indicator, progress stepper, form wizards with validation between steps.",
        systems: ["atlassian", "carbon", "google"],
        tags: ["figma"],
        prompt: "Create a Figma multi-step wizard pattern: horizontal step indicator (pending/current/complete/error), step content area, and back/continue button row.",
      },
      {
        label: "Responsive & adaptive patterns",
        sub: "How each pattern adapts from desktop → tablet → mobile. Documented per-component in the system.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "apple"],
        prompt: "Set up Figma responsive variants for a card component: auto layout with 3-column grid at 1440px, 2-column at 768px, and single-column stacked at 375px.",
      },
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: "●",
    items: [
      {
        label: "Color contrast meets WCAG AA",
        sub: "All text/background combos pass 4.5:1 (normal text) or 3:1 (large text). Checked across light and dark themes.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["a11y"],
        prompt: "Audit all color combinations in this Figma file for WCAG AA contrast compliance. Flag any text/background pairs that fail 4.5:1 and suggest token replacements.",
      },
      {
        label: "Focus states documented",
        sub: "Visible focus ring on every interactive element, meeting WCAG 2.4.11 (3:1 ratio against adjacent colors).",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["a11y", "figma"],
        prompt: "Add focus state variants to all interactive Figma components: 2px offset focus ring using the system focus color token. Show keyboard tab order annotation.",
      },
      {
        label: "Touch target minimums met",
        sub: "44×44px minimum touch target for mobile patterns (Apple HIG, Material M3).",
        systems: ["google", "apple"],
        tags: ["google", "apple", "a11y"],
        prompt: "Annotate all interactive elements in this Figma mobile screen for touch target size. Flag anything below 44×44px and suggest layout adjustments.",
      },
      {
        label: "Error messaging accessible",
        sub: "Errors not communicated by color alone. Icon + text label + aria-describedby annotations present.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["a11y", "figma"],
        prompt: "Create Figma error state annotations: show error icon + red border + error message text below input. Add redline spec for aria-describedby and role=alert.",
      },
      {
        label: "Screen reader annotations",
        sub: "Component specs include aria roles, labels, and keyboard interaction patterns (ARIA Authoring Practices).",
        systems: ["atlassian", "carbon"],
        tags: ["atlassian", "carbon", "a11y"],
        prompt: "Generate a Figma accessibility annotation set for this modal: include aria-modal, aria-labelledby, focus trap boundary, and keyboard pattern (Esc to close, Tab cycle).",
      },
    ],
  },
  {
    id: "documentation",
    label: "Documentation & handoff",
    icon: "◉",
    items: [
      {
        label: "Component usage guidelines",
        sub: "When to use, when not to use, do/don't examples — embedded in design system docs, not just the Figma file.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma", "ai"],
        prompt: "Write a component usage guideline for this button component: when to use (primary CTA, single action), when not to use (navigation, destructive without confirmation), and do/don't examples.",
      },
      {
        label: "Design tokens mapped to code",
        sub: "Token names in Figma match token names in code (CSS custom properties, JSON, Tailwind config).",
        systems: ["google", "atlassian", "carbon"],
        tags: ["google", "atlassian", "carbon", "figma"],
        prompt: "Generate a design token export spec for this Figma component: map each token to its CSS custom property name following the W3C Design Tokens Community Group format.",
      },
      {
        label: "Figma component anatomy annotated",
        sub: "Each component includes a redline/spec frame showing measurements, spacing, and token references for dev handoff.",
        systems: ["google", "atlassian", "carbon"],
        tags: ["figma"],
        prompt: "Create a Figma component anatomy frame: annotate padding (16px), corner radius (radius-md token), shadow level, and typography tokens. Use Figma Dev Mode annotation style.",
      },
      {
        label: "Variant & property matrix complete",
        sub: "All component variants exposed as Figma component properties (not hidden layers), with consistent naming.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["figma"],
        prompt: "Audit Figma component properties for this component. List all variants, boolean props, and instance-swap slots. Flag any states that are hidden layers instead of properties.",
      },
      {
        label: "Changelog maintained",
        sub: "Version history documents what changed, what was deprecated, and migration notes for each release.",
        systems: ["atlassian", "carbon"],
        tags: ["atlassian", "carbon"],
        prompt: "Write a changelog entry for this design system release: new components added, deprecated patterns, token renames, and migration steps for teams on the previous version.",
      },
    ],
  },
  {
    id: "ai-acceleration",
    label: "AI × design acceleration",
    icon: "✦",
    items: [
      {
        label: "AI prompt library per component",
        sub: "Each component in the system has validated prompts for generating variants in Figma or code.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["ai", "figma"],
        prompt: "Build a reusable prompt template for this component: generate Figma variants, write documentation, or scaffold production code — parameterized for different team needs.",
      },
      {
        label: "Component generation tested",
        sub: "Core components validated against AI generation pipelines (Figma AI, Claude, Cursor, v0) for token fidelity.",
        systems: ["google", "atlassian", "carbon"],
        tags: ["ai", "figma", "google", "atlassian", "carbon"],
        prompt: "Using Carbon Design System as reference, generate a product card component in React: image slot, title, metadata, price, and a primary CTA button with proper token usage.",
      },
      {
        label: "System prompt crafted for design context",
        sub: "A project-level system prompt defines which design system, token naming, and component patterns AI should follow.",
        systems: ["google", "atlassian", "carbon", "apple"],
        tags: ["ai"],
        prompt: "Write a system prompt for Claude that instructs it to generate Figma-ready UI specs following Material Design 3: include token references, component anatomy, and accessibility annotations in every response.",
      },
      {
        label: "Design-to-dev handoff accelerated",
        sub: "AI-assisted redlines, token extraction, and code snippet generation validated for accuracy against the component spec.",
        systems: ["atlassian", "carbon", "google"],
        tags: ["ai", "figma"],
        prompt: "Given the Figma component spec, generate a React component with TypeScript props, inline CSS tokens from IBM Carbon token set, and prop documentation in JSDoc format.",
      },
    ],
  },
];

const ALL_SYSTEMS = ["google", "atlassian", "carbon", "apple"];
const FILTERS = [
  { id: "all", label: "All items" },
  { id: "figma", label: "Figma prompts" },
  { id: "a11y", label: "Accessibility" },
  { id: "ai", label: "AI acceleration" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ type, children }) {
  const c = COLORS[type] || COLORS.carbon;
  return (
    <span style={{
      display: "inline-block",
      fontSize: 10,
      padding: "2px 7px",
      borderRadius: 10,
      fontWeight: 500,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

function CheckItem({ item, checked, onToggle, onPrompt }) {
  const isChecked = checked;
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "10px 16px",
      borderBottom: "1px solid #F3F4F6",
      background: isChecked ? "#FAFAFA" : "white",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: 17,
          height: 17,
          borderRadius: 4,
          border: isChecked ? "none" : "1.5px solid #D1D5DB",
          background: isChecked ? "#22C55E" : "white",
          flexShrink: 0,
          marginTop: 2,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {isChecked ? "✓" : ""}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13,
          fontWeight: 500,
          color: isChecked ? "#9CA3AF" : "#111827",
          textDecoration: isChecked ? "line-through" : "none",
          marginBottom: 2,
          lineHeight: 1.4,
        }}>
          {item.label}
        </div>
        <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4, marginBottom: 5 }}>
          {item.sub}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          {item.systems.map(s => <Tag key={s} type={s}>{SYS_LABELS[s]}</Tag>)}
          {item.tags.includes("figma") && <Tag type="figma">Figma prompt</Tag>}
          {item.tags.includes("ai") && <Tag type="ai">AI accelerated</Tag>}
          {item.tags.includes("a11y") && <Tag type="a11y">Accessibility</Tag>}
          {item.prompt && (
            <button
              onClick={() => onPrompt(item.prompt)}
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 10,
                border: "1px solid #E5E7EB",
                background: "white",
                color: "#6B7280",
                cursor: "pointer",
                marginLeft: 2,
              }}
            >
              Use AI prompt →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ section, checked, onToggle, onPrompt, activeSystems, activeFilter }) {
  const [open, setOpen] = useState(true);

  const visible = section.items.filter(item => {
    const sysMatch = item.systems.some(s => activeSystems.has(s));
    if (!sysMatch) return false;
    if (activeFilter === "all") return true;
    return item.tags.includes(activeFilter);
  });

  if (visible.length === 0) return null;

  const done = visible.filter(it => checked.has(it.label)).length;

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 10 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "12px 16px",
          background: "#F9FAFB",
          border: "none",
          borderBottom: "1px solid #E5E7EB",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 13, color: "#9CA3AF" }}>{section.icon}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", flex: 1 }}>{section.label}</span>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{done}/{visible.length}</span>
        <span style={{ fontSize: 11, color: "#9CA3AF", transform: open ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▶</span>
      </button>
      {open && visible.map(item => (
        <CheckItem
          key={item.label}
          item={item}
          checked={checked.has(item.label)}
          onToggle={() => onToggle(item.label)}
          onPrompt={onPrompt}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DesignSystemChecklist() {
  const [activeSystems, setActiveSystems] = useState(new Set(ALL_SYSTEMS));
  const [activeFilter, setActiveFilter] = useState("all");
  const [checked, setChecked] = useState(new Set());
  const [copiedPrompt, setCopiedPrompt] = useState(null);

  const toggleSystem = useCallback((s) => {
    setActiveSystems(prev => {
      if (prev.size === 1 && prev.has(s)) return prev;
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  }, []);

  const toggleCheck = useCallback((label) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }, []);

  const handlePrompt = useCallback((prompt) => {
    navigator.clipboard.writeText(prompt).catch(() => {});
    setCopiedPrompt(prompt);
    setTimeout(() => setCopiedPrompt(null), 2000);
  }, []);

  // Compute progress
  const allVisible = SECTIONS.flatMap(sec =>
    sec.items.filter(item => {
      const sysMatch = item.systems.some(s => activeSystems.has(s));
      if (!sysMatch) return false;
      return activeFilter === "all" || item.tags.includes(activeFilter);
    })
  );
  const total = allVisible.length;
  const done = allVisible.filter(it => checked.has(it.label)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Design system checklist
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          Synthesized from Google Material, Atlassian, IBM Carbon, and Apple HIG.
          Integrated with the AI × UX Product Design Framework.
        </p>
      </div>

      {/* System toggles */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {ALL_SYSTEMS.map(s => {
          const active = activeSystems.has(s);
          const c = COLORS[s];
          return (
            <button
              key={s}
              onClick={() => toggleSystem(s)}
              style={{
                fontSize: 11,
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${active ? c.border : "#E5E7EB"}`,
                background: active ? c.bg : "white",
                color: active ? c.text : "#9CA3AF",
                cursor: "pointer",
                fontWeight: active ? 600 : 400,
                transition: "all .15s",
              }}
            >
              {s === "google" ? "Material (Google)" : s === "apple" ? "HIG (Apple)" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            style={{
              fontSize: 11,
              padding: "4px 12px",
              borderRadius: 20,
              border: `1px solid ${activeFilter === f.id ? "#6B7280" : "#E5E7EB"}`,
              background: activeFilter === f.id ? "#111827" : "white",
              color: activeFilter === f.id ? "white" : "#6B7280",
              cursor: "pointer",
              fontWeight: activeFilter === f.id ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: "#6B7280" }}>{done} of {total} complete</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#22C55E" }}>{pct}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#22C55E", borderRadius: 3, transition: "width .3s" }} />
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(sec => (
        <Section
          key={sec.id}
          section={sec}
          checked={checked}
          onToggle={toggleCheck}
          onPrompt={handlePrompt}
          activeSystems={activeSystems}
          activeFilter={activeFilter}
        />
      ))}

      {/* Copied toast */}
      {copiedPrompt && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#111827",
          color: "white",
          fontSize: 12,
          padding: "8px 16px",
          borderRadius: 8,
          zIndex: 999,
        }}>
          Prompt copied to clipboard
        </div>
      )}
    </div>
  );
}
