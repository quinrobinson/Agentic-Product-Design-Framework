/**
 * Material Design 3 — Token Reference
 * AI × UX Product Design Framework
 *
 * Interactive token documentation for four core M3 components:
 * Button, Card, Text Field, and Navigation Bar.
 * Covers color roles, elevation, shape, typography, and spacing.
 * Each category includes a Figma variable spec generator prompt.
 *
 * Part of: github.com/quinrobinson/AI-x-UX-Product-Design-Framework
 * Figma:   figma.com/design/mrHuD7sY7h6uKSVndTSIQE
 */

import { useState } from "react";

// ─── Token data ───────────────────────────────────────────────────────────────

const STATE_META = {
  all:      { label: "All states",  bg: "#EFF6FF", color: "#1E40AF" },
  hover:    { label: "Hover",       bg: "#F5F3FF", color: "#5B21B6" },
  focus:    { label: "Focus",       bg: "#ECFDF5", color: "#065F46" },
  pressed:  { label: "Pressed",     bg: "#FFF8E6", color: "#7D4E00" },
  disabled: { label: "Disabled",    bg: "#F3F4F6", color: "#374151" },
  error:    { label: "Error",       bg: "#FEF2F2", color: "#991B1B" },
};

const CATS = ["color", "elevation", "shape", "typography", "spacing"];
const CAT_LABELS = {
  color: "Color roles",
  elevation: "Elevation",
  shape: "Shape",
  typography: "Typography",
  spacing: "Spacing & size",
};

const COMPONENTS = {
  button: {
    label: "Button",
    cats: {
      color: [
        { name: "md.comp.filled-button.container.color", val: "md.sys.color.primary", desc: "Container fill — default state", states: ["all"] },
        { name: "md.comp.filled-button.label-text.color", val: "md.sys.color.on-primary", desc: "Label text color", states: ["all"] },
        { name: "md.comp.filled-button.icon.color", val: "md.sys.color.on-primary", desc: "Leading/trailing icon color", states: ["all"] },
        { name: "md.comp.filled-button.container.color", val: "md.sys.color.on-surface (8%)", desc: "State layer — hover", states: ["hover"] },
        { name: "md.comp.filled-button.container.color", val: "md.sys.color.on-surface (12%)", desc: "State layer — focus", states: ["focus"] },
        { name: "md.comp.filled-button.container.color", val: "md.sys.color.on-surface (12%)", desc: "State layer — pressed", states: ["pressed"] },
        { name: "md.comp.filled-button.container.color", val: "md.sys.color.on-surface (12%)", desc: "Disabled container fill", states: ["disabled"] },
        { name: "md.comp.filled-button.label-text.color", val: "md.sys.color.on-surface (38%)", desc: "Disabled label color", states: ["disabled"] },
        { name: "md.comp.outlined-button.outline.color", val: "md.sys.color.outline", desc: "Outlined variant — border color", states: ["all"] },
        { name: "md.comp.text-button.label-text.color", val: "md.sys.color.primary", desc: "Text variant — label color", states: ["all"] },
        { name: "md.comp.tonal-button.container.color", val: "md.sys.color.secondary-container", desc: "Tonal variant — container fill", states: ["all"] },
        { name: "md.comp.tonal-button.label-text.color", val: "md.sys.color.on-secondary-container", desc: "Tonal variant — label color", states: ["all"] },
      ],
      elevation: [
        { name: "md.comp.filled-button.container.elevation", val: "md.sys.elevation.level0", desc: "Resting elevation (filled)", states: ["all"] },
        { name: "md.comp.filled-button.container.elevation", val: "md.sys.elevation.level1", desc: "Hovered elevation", states: ["hover"] },
        { name: "md.comp.filled-button.container.shadow-color", val: "md.sys.color.shadow", desc: "Shadow color token", states: ["all"] },
        { name: "md.comp.elevated-button.container.elevation", val: "md.sys.elevation.level1", desc: "Elevated variant — resting", states: ["all"] },
        { name: "md.comp.elevated-button.container.elevation", val: "md.sys.elevation.level2", desc: "Elevated variant — hovered", states: ["hover"] },
        { name: "md.comp.elevated-button.container.color", val: "md.sys.color.surface-container-low", desc: "Elevated variant — surface tint", states: ["all"] },
      ],
      shape: [
        { name: "md.comp.filled-button.container.shape", val: "md.sys.shape.corner.full", desc: "Full pill shape (9999px) — applies to all button variants", states: ["all"] },
      ],
      typography: [
        { name: "md.comp.filled-button.label-text.type", val: "md.sys.typescale.label-large", desc: "14sp, weight 500, tracking +0.1", states: ["all"] },
      ],
      spacing: [
        { name: "md.comp.filled-button.container.height", val: "40dp", desc: "Default height", states: ["all"] },
        { name: "md.comp.filled-button.with-icon.icon.size", val: "18dp", desc: "Icon size", states: ["all"] },
        { name: "md.comp.filled-button.container.leading-space", val: "24dp", desc: "Leading padding (no icon)", states: ["all"] },
        { name: "md.comp.filled-button.container.trailing-space", val: "24dp", desc: "Trailing padding (no icon)", states: ["all"] },
        { name: "md.comp.filled-button.with-icon.icon-label-space", val: "8dp", desc: "Gap between icon and label", states: ["all"] },
      ],
    },
  },
  card: {
    label: "Card",
    cats: {
      color: [
        { name: "md.comp.elevated-card.container.color", val: "md.sys.color.surface-container-low", desc: "Elevated card — container surface", states: ["all"] },
        { name: "md.comp.filled-card.container.color", val: "md.sys.color.surface-container-highest", desc: "Filled card — container surface", states: ["all"] },
        { name: "md.comp.outlined-card.container.color", val: "md.sys.color.surface", desc: "Outlined card — container surface", states: ["all"] },
        { name: "md.comp.outlined-card.outline.color", val: "md.sys.color.outline-variant", desc: "Outlined card — border color", states: ["all"] },
        { name: "md.comp.elevated-card.container.color", val: "md.sys.color.on-surface (8%)", desc: "State layer — hover", states: ["hover"] },
        { name: "md.comp.elevated-card.container.color", val: "md.sys.color.on-surface (12%)", desc: "State layer — pressed/dragged", states: ["pressed"] },
      ],
      elevation: [
        { name: "md.comp.elevated-card.container.elevation", val: "md.sys.elevation.level1", desc: "Elevated card — resting", states: ["all"] },
        { name: "md.comp.elevated-card.container.elevation", val: "md.sys.elevation.level2", desc: "Elevated card — hovered", states: ["hover"] },
        { name: "md.comp.elevated-card.container.elevation", val: "md.sys.elevation.level4", desc: "Elevated card — dragged", states: ["pressed"] },
        { name: "md.comp.filled-card.container.elevation", val: "md.sys.elevation.level0", desc: "Filled card — flat (no shadow)", states: ["all"] },
        { name: "md.comp.outlined-card.container.elevation", val: "md.sys.elevation.level0", desc: "Outlined card — flat (no shadow)", states: ["all"] },
        { name: "md.comp.elevated-card.container.shadow-color", val: "md.sys.color.shadow", desc: "Shadow color for tonal overlay", states: ["all"] },
      ],
      shape: [
        { name: "md.comp.elevated-card.container.shape", val: "md.sys.shape.corner.medium", desc: "12dp corner radius — all card variants", states: ["all"] },
      ],
      spacing: [
        { name: "md.comp.card.content.padding", val: "16dp", desc: "Inner content padding (all sides)", states: ["all"] },
        { name: "md.comp.card.action-area.padding", val: "8dp 16dp", desc: "Action row padding", states: ["all"] },
      ],
    },
  },
  textfield: {
    label: "Text field",
    cats: {
      color: [
        { name: "md.comp.filled-text-field.container.color", val: "md.sys.color.surface-container-highest", desc: "Filled variant — container fill", states: ["all"] },
        { name: "md.comp.filled-text-field.input-text.color", val: "md.sys.color.on-surface", desc: "Input text color", states: ["all"] },
        { name: "md.comp.filled-text-field.label-text.color", val: "md.sys.color.on-surface-variant", desc: "Floating label — default", states: ["all"] },
        { name: "md.comp.filled-text-field.label-text.color", val: "md.sys.color.primary", desc: "Floating label — focused", states: ["focus"] },
        { name: "md.comp.filled-text-field.active-indicator.color", val: "md.sys.color.on-surface-variant", desc: "Bottom indicator — default", states: ["all"] },
        { name: "md.comp.filled-text-field.active-indicator.color", val: "md.sys.color.primary", desc: "Bottom indicator — focused", states: ["focus"] },
        { name: "md.comp.filled-text-field.error.active-indicator.color", val: "md.sys.color.error", desc: "Bottom indicator — error", states: ["error"] },
        { name: "md.comp.filled-text-field.error.label-text.color", val: "md.sys.color.error", desc: "Label color — error state", states: ["error"] },
        { name: "md.comp.filled-text-field.supporting-text.color", val: "md.sys.color.on-surface-variant", desc: "Helper/supporting text color", states: ["all"] },
        { name: "md.comp.filled-text-field.error.supporting-text.color", val: "md.sys.color.error", desc: "Error message text color", states: ["error"] },
        { name: "md.comp.outlined-text-field.outline.color", val: "md.sys.color.outline", desc: "Outlined variant — border default", states: ["all"] },
        { name: "md.comp.outlined-text-field.outline.color", val: "md.sys.color.primary", desc: "Outlined variant — border focused", states: ["focus"] },
        { name: "md.comp.filled-text-field.input-text.color", val: "md.sys.color.on-surface (38%)", desc: "Disabled input text", states: ["disabled"] },
      ],
      elevation: [
        { name: "md.comp.filled-text-field.container.elevation", val: "md.sys.elevation.level0", desc: "Text fields carry no elevation — flat surface only", states: ["all"] },
      ],
      shape: [
        { name: "md.comp.filled-text-field.container.shape", val: "md.sys.shape.corner.extra-small (top)", desc: "Filled — top corners 4dp, bottom flat", states: ["all"] },
        { name: "md.comp.outlined-text-field.container.shape", val: "md.sys.shape.corner.extra-small", desc: "Outlined — all corners 4dp", states: ["all"] },
      ],
      typography: [
        { name: "md.comp.filled-text-field.input-text.type", val: "md.sys.typescale.body-large", desc: "Input text — 16sp weight 400", states: ["all"] },
        { name: "md.comp.filled-text-field.label-text.type", val: "md.sys.typescale.body-large → body-small", desc: "Label — 16sp default, 12sp when floating", states: ["all"] },
        { name: "md.comp.filled-text-field.supporting-text.type", val: "md.sys.typescale.body-small", desc: "Helper text — 12sp", states: ["all"] },
      ],
      spacing: [
        { name: "md.comp.filled-text-field.container.height", val: "56dp", desc: "Default container height", states: ["all"] },
        { name: "md.comp.filled-text-field.content.padding", val: "16dp horizontal", desc: "Horizontal inner padding", states: ["all"] },
        { name: "md.comp.filled-text-field.active-indicator.height", val: "1dp → 2dp (focused)", desc: "Bottom indicator thickness", states: ["all"] },
      ],
    },
  },
  navbar: {
    label: "Navigation bar",
    cats: {
      color: [
        { name: "md.comp.navigation-bar.container.color", val: "md.sys.color.surface-container", desc: "Bar background surface", states: ["all"] },
        { name: "md.comp.navigation-bar.icon.color", val: "md.sys.color.on-surface-variant", desc: "Inactive icon color", states: ["all"] },
        { name: "md.comp.navigation-bar.active-icon.color", val: "md.sys.color.on-secondary-container", desc: "Active icon color", states: ["all"] },
        { name: "md.comp.navigation-bar.active-indicator.color", val: "md.sys.color.secondary-container", desc: "Active indicator pill fill", states: ["all"] },
        { name: "md.comp.navigation-bar.label-text.color", val: "md.sys.color.on-surface-variant", desc: "Inactive label color", states: ["all"] },
        { name: "md.comp.navigation-bar.active.label-text.color", val: "md.sys.color.on-surface", desc: "Active label color", states: ["all"] },
        { name: "md.comp.navigation-bar.icon.color", val: "md.sys.color.on-surface (8%)", desc: "State layer — hover", states: ["hover"] },
        { name: "md.comp.navigation-bar.icon.color", val: "md.sys.color.on-surface (12%)", desc: "State layer — pressed", states: ["pressed"] },
      ],
      elevation: [
        { name: "md.comp.navigation-bar.container.elevation", val: "md.sys.elevation.level2", desc: "Bar resting elevation (floats above content)", states: ["all"] },
        { name: "md.comp.navigation-bar.container.shadow-color", val: "md.sys.color.shadow", desc: "Shadow color token", states: ["all"] },
      ],
      shape: [
        { name: "md.comp.navigation-bar.active-indicator.shape", val: "md.sys.shape.corner.full", desc: "Active indicator pill — full radius", states: ["all"] },
      ],
      typography: [
        { name: "md.comp.navigation-bar.label-text.type", val: "md.sys.typescale.label-medium", desc: "Item label — 12sp weight 500, tracking +0.5", states: ["all"] },
      ],
      spacing: [
        { name: "md.comp.navigation-bar.container.height", val: "80dp", desc: "Bar height", states: ["all"] },
        { name: "md.comp.navigation-bar.active-indicator.width", val: "64dp", desc: "Active indicator pill width", states: ["all"] },
        { name: "md.comp.navigation-bar.active-indicator.height", val: "32dp", desc: "Active indicator pill height", states: ["all"] },
        { name: "md.comp.navigation-bar.icon.size", val: "24dp", desc: "Icon size (all states)", states: ["all"] },
      ],
    },
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StateBadge({ state }) {
  const m = STATE_META[state] || STATE_META.all;
  return (
    <span style={{
      display: "inline-block",
      fontSize: 10,
      padding: "1px 7px",
      borderRadius: 8,
      fontWeight: 500,
      background: m.bg,
      color: m.color,
      marginLeft: 5,
    }}>
      {m.label}
    </span>
  );
}

function TokenRow({ token }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(token.name).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
      <td style={{ padding: "9px 12px", verticalAlign: "top" }}>
        <code style={{ fontSize: 11, color: "#374151", background: "#F9FAFB", padding: "1px 5px", borderRadius: 4 }}>
          {token.name}
        </code>
        {token.states.map(s => <StateBadge key={s} state={s} />)}
        <button
          onClick={copy}
          style={{
            marginLeft: 6,
            fontSize: 9,
            padding: "1px 5px",
            borderRadius: 6,
            border: "1px solid #E5E7EB",
            background: "white",
            color: "#9CA3AF",
            cursor: "pointer",
          }}
        >
          {copied ? "✓" : "copy"}
        </button>
      </td>
      <td style={{ padding: "9px 12px", verticalAlign: "top" }}>
        <code style={{ fontSize: 11, color: "#6366F1" }}>{token.val}</code>
      </td>
      <td style={{ padding: "9px 12px", fontSize: 11, color: "#6B7280", verticalAlign: "top", lineHeight: 1.4 }}>
        {token.desc}
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function M3TokenReference() {
  const [activeComp, setActiveComp] = useState("button");
  const [activeCat, setActiveCat] = useState("color");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const comp = COMPONENTS[activeComp];
  const tokens = comp.cats[activeCat] || [];

  const figmaPrompt = `Generate a Figma local variable collection spec for the ${comp.label} component, ${CAT_LABELS[activeCat]} tokens, following M3 naming conventions. For each token, provide: variable collection name, variable group path, variable name, value type (color/number/string), and the M3 system token it references. Format as a table ready to import into Figma.`;

  const copyFigmaPrompt = () => {
    navigator.clipboard.writeText(figmaPrompt).catch(() => {});
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          Material Design 3 — Token reference
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280" }}>
          Component tokens for Button, Card, Text Field, and Navigation Bar.
          Color roles, elevation, shape, typography, and spacing — all states.
        </p>
      </div>

      {/* Component tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {Object.entries(COMPONENTS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setActiveComp(k); setActiveCat("color"); }}
            style={{
              fontSize: 12,
              padding: "5px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: activeComp === k ? "#4F46E5" : "#E5E7EB",
              background: activeComp === k ? "#EEF2FF" : "white",
              color: activeComp === k ? "#4338CA" : "#6B7280",
              cursor: "pointer",
              fontWeight: activeComp === k ? 600 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {CATS.map(c => {
          const items = comp.cats[c];
          if (!items || items.length === 0) return null;
          return (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 10,
                border: "1px solid",
                borderColor: activeCat === c ? "#374151" : "#E5E7EB",
                background: activeCat === c ? "#F9FAFB" : "white",
                color: activeCat === c ? "#111827" : "#6B7280",
                cursor: "pointer",
                fontWeight: activeCat === c ? 600 : 400,
              }}
            >
              {CAT_LABELS[c]} ({items.length})
            </button>
          );
        })}
      </div>

      {/* Token table */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "38%", fontSize: 11 }}>Token name</th>
              <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", width: "28%", fontSize: 11 }}>Value / role</th>
              <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 11 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => <TokenRow key={i} token={t} />)}
          </tbody>
        </table>
      </div>

      {/* Figma prompt button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={copyFigmaPrompt}
          style={{
            fontSize: 11,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: copiedPrompt ? "#F0FDF4" : "white",
            color: copiedPrompt ? "#16A34A" : "#6B7280",
            cursor: "pointer",
          }}
        >
          {copiedPrompt ? "✓ Figma variable spec prompt copied" : "Generate Figma variable spec →"}
        </button>
      </div>
    </div>
  );
}
