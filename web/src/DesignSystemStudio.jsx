import { useState, useCallback, useMemo } from "react";

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

// ── Theme Definitions ────────────────────────────────────────────────────────
const THEMES = {
  precision: {
    name: "Precision", desc: "SaaS, productivity, dev tools",
    archetype: "Linear, Notion, Vercel",
    primary: "#171717", secondary: "#525252", accent: "#2563EB",
    success: "#16A34A", warning: "#D97706", error: "#DC2626", info: "#2563EB",
    surface: "#FFFFFF", surfaceSecondary: "#F9FAFB", border: "#E5E7EB",
    textPrimary: "#111827", textSecondary: "#6B7280", textTertiary: "#9CA3AF",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 500, baseSize: 14, scaleRatio: 1.2, spaceUnit: 4,
    radiusSm: 4, radiusMd: 6, radiusLg: 8, radiusFull: 9999,
    shadowSm: "0 1px 2px rgba(0,0,0,0.05)", shadowMd: "0 4px 6px rgba(0,0,0,0.07)", shadowLg: "0 10px 15px rgba(0,0,0,0.1)",
    motionFast: "100ms", motionNormal: "200ms",
    fonts: "Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500",
  },
  enterprise: {
    name: "Enterprise", desc: "B2B, fintech, healthcare",
    archetype: "Salesforce, Bloomberg",
    primary: "#1D4ED8", secondary: "#1E3A5F", accent: "#059669",
    success: "#059669", warning: "#D97706", error: "#DC2626", info: "#2563EB",
    surface: "#FFFFFF", surfaceSecondary: "#F8FAFC", border: "#E2E8F0",
    textPrimary: "#0F172A", textSecondary: "#475569", textTertiary: "#94A3B8",
    fontHeading: "'Source Sans 3', sans-serif", fontBody: "'Source Sans 3', sans-serif", fontMono: "'Source Code Pro', monospace",
    headingWeight: 600, baseSize: 14, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 4, radiusMd: 8, radiusLg: 8, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(0,0,0,0.08)", shadowMd: "0 4px 12px rgba(0,0,0,0.1)", shadowLg: "0 10px 25px rgba(0,0,0,0.12)",
    motionFast: "150ms", motionNormal: "250ms",
    fonts: "Source+Sans+3:wght@400;600;700&family=Source+Code+Pro:wght@400;500",
  },
  warmth: {
    name: "Warmth", desc: "Consumer, lifestyle, wellness",
    archetype: "Airbnb, Headspace",
    primary: "#B45309", secondary: "#78716C", accent: "#059669",
    success: "#16A34A", warning: "#F59E0B", error: "#E11D48", info: "#0EA5E9",
    surface: "#FFFBF5", surfaceSecondary: "#FFF7ED", border: "#E7E5E4",
    textPrimary: "#1C1917", textSecondary: "#78716C", textTertiary: "#A8A29E",
    fontHeading: "'Libre Baskerville', serif", fontBody: "'DM Sans', sans-serif", fontMono: "'Roboto Mono', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 8, radiusMd: 12, radiusLg: 16, radiusFull: 9999,
    shadowSm: "0 1px 3px rgba(120,113,108,0.08)", shadowMd: "0 4px 12px rgba(120,113,108,0.1)", shadowLg: "0 10px 25px rgba(120,113,108,0.12)",
    motionFast: "200ms", motionNormal: "300ms",
    fonts: "Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;700&family=Roboto+Mono:wght@400",
  },
  bold: {
    name: "Bold", desc: "Creative, media, entertainment",
    archetype: "Spotify, Figma",
    primary: "#7C3AED", secondary: "#1E1B4B", accent: "#F59E0B",
    success: "#10B981", warning: "#F59E0B", error: "#EF4444", info: "#6366F1",
    surface: "#FFFFFF", surfaceSecondary: "#F5F3FF", border: "#E9E5FF",
    textPrimary: "#1E1B4B", textSecondary: "#6D6A85", textTertiary: "#A5A3B5",
    fontHeading: "'Space Grotesk', sans-serif", fontBody: "'DM Sans', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.333, spaceUnit: 4,
    radiusSm: 8, radiusMd: 12, radiusLg: 24, radiusFull: 9999,
    shadowSm: "0 2px 4px rgba(124,58,237,0.06)", shadowMd: "0 4px 16px rgba(124,58,237,0.1)", shadowLg: "0 12px 32px rgba(124,58,237,0.15)",
    motionFast: "150ms", motionNormal: "250ms",
    fonts: "Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400",
  },
  clinical: {
    name: "Clinical", desc: "Data platforms, dashboards",
    archetype: "Datadog, Stripe Dashboard",
    primary: "#0F172A", secondary: "#475569", accent: "#3B82F6",
    success: "#22C55E", warning: "#EAB308", error: "#EF4444", info: "#3B82F6",
    surface: "#FFFFFF", surfaceSecondary: "#F8FAFC", border: "#E2E8F0",
    textPrimary: "#0F172A", textSecondary: "#475569", textTertiary: "#94A3B8",
    fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif", fontMono: "'JetBrains Mono', monospace",
    headingWeight: 600, baseSize: 13, scaleRatio: 1.125, spaceUnit: 4,
    radiusSm: 3, radiusMd: 4, radiusLg: 6, radiusFull: 9999,
    shadowSm: "none", shadowMd: "0 1px 3px rgba(0,0,0,0.06)", shadowLg: "0 4px 8px rgba(0,0,0,0.08)",
    motionFast: "80ms", motionNormal: "150ms",
    fonts: "Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500",
  },
  soft: {
    name: "Soft", desc: "Education, social, consumer",
    archetype: "Duolingo, Slack, Calm",
    primary: "#2563EB", secondary: "#64748B", accent: "#F97316",
    success: "#22C55E", warning: "#F59E0B", error: "#EF4444", info: "#3B82F6",
    surface: "#FFFFFF", surfaceSecondary: "#F0F9FF", border: "#E0F2FE",
    textPrimary: "#0C4A6E", textSecondary: "#64748B", textTertiary: "#94A3B8",
    fontHeading: "'DM Sans', sans-serif", fontBody: "'DM Sans', sans-serif", fontMono: "'Roboto Mono', monospace",
    headingWeight: 700, baseSize: 16, scaleRatio: 1.25, spaceUnit: 4,
    radiusSm: 12, radiusMd: 16, radiusLg: 24, radiusFull: 9999,
    shadowSm: "0 2px 8px rgba(37,99,235,0.06)", shadowMd: "0 4px 16px rgba(37,99,235,0.08)", shadowLg: "0 8px 24px rgba(37,99,235,0.12)",
    motionFast: "200ms", motionNormal: "300ms",
    fonts: "DM+Sans:wght@400;500;700&family=Roboto+Mono:wght@400",
  },
};

// ── Component Categories ─────────────────────────────────────────────────────
const COMPONENTS = [
  { id: "button", name: "Button", cat: "Action" },
  { id: "textinput", name: "Text input", cat: "Input" },
  { id: "select", name: "Select", cat: "Input" },
  { id: "checkbox", name: "Checkbox", cat: "Input" },
  { id: "radio", name: "Radio", cat: "Input" },
  { id: "toggle", name: "Toggle", cat: "Input" },
  { id: "card", name: "Card", cat: "Containment" },
  { id: "modal", name: "Modal", cat: "Overlay" },
  { id: "toast", name: "Toast", cat: "Feedback" },
  { id: "alert", name: "Alert", cat: "Feedback" },
  { id: "badge", name: "Badge", cat: "Data Display" },
  { id: "tag", name: "Tag / Chip", cat: "Data Display" },
  { id: "avatar", name: "Avatar", cat: "Data Display" },
  { id: "tooltip", name: "Tooltip", cat: "Overlay" },
];

const SECTIONS = ["themes", "tokens", "components", "export"];

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
      {s("danger", "Danger", { background: t.error, color: "#fff", border: "none" })}
      {s("disabled", "Disabled", { background: "#E5E7EB", color: "#9CA3AF", border: "none", cursor: "not-allowed", opacity: 0.7 })}
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
          fontSize: t.baseSize, fontFamily: t.fontBody, color: isDisabled ? "#aaa" : t.textPrimary,
          background: isDisabled ? "#F3F4F6" : t.surface, transition: `border ${t.motionFast}`,
          boxShadow: isFocus ? `0 0 0 2px ${alpha(t.primary, 0.15)}` : "none",
        }}>
          <span style={{ color: isDisabled ? "#bbb" : "#999" }}>{isDisabled ? "Disabled" : "Placeholder"}</span>
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
            <span style={{ color: "#999" }}>Select option</span>
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
      <div style={{ width: 44, height: 24, borderRadius: 12, background: on ? t.primary : "#D1D5DB", position: "relative", transition: `background ${t.motionFast}` }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: on ? 22 : 2, transition: `left ${t.motionFast}`, boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
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
        fontFamily: t.fontBody, fontSize: t.baseSize - 1, color: darken(c, 0.3),
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
        { label: "99+", bg: t.error, color: "#fff" },
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
        background: type === "image" ? `linear-gradient(135deg, ${t.primary}, ${t.accent})` : alpha(t.primary, 0.1),
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

const PREVIEW_MAP = {
  button: PreviewButton, textinput: PreviewTextInput, select: PreviewSelect,
  checkbox: PreviewCheckbox, radio: PreviewRadio, toggle: PreviewToggle,
  card: PreviewCard, modal: PreviewModal, toast: PreviewToast, alert: PreviewAlert,
  badge: PreviewBadge, tag: PreviewTag, avatar: PreviewAvatar, tooltip: PreviewTooltip,
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

// ── Main Component ───────────────────────────────────────────────────────────
export default function DesignSystemStudio() {
  const [activeTheme, setActiveTheme] = useState("precision");
  const [tokens, setTokens] = useState({ ...THEMES.precision });
  const [section, setSection] = useState("themes");
  const [activeComponent, setActiveComponent] = useState("button");
  const [copied, setCopied] = useState(false);

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

  const copyCSS = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const PreviewComp = PREVIEW_MAP[activeComponent];

  // T = dark header/tabs, C = light content area
  const T = {
    dark: "#000000", card: "#1E293B", border: "#222222",
    text: "#F8FAFC", dim: "#94A3B8", dimmer: "#64748B",
  };
  const C = {
    bg: "#FFFFFF", bgSub: "#F8FAFC", card: "#FFFFFF",
    border: "#E2E8F0", borderLight: "#F1F5F9",
    text: "#0F172A", sub: "#475569", dim: "#94A3B8",
  };

  const fontsUrl = `https://fonts.googleapis.com/css2?family=${tokens.fonts}&display=swap`;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <link href={fontsUrl} rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: T.dark, borderBottom: `1px solid ${T.border}`, padding: "20px 24px", color: T.text }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: T.dim, opacity: 0.6, marginBottom: 4 }}>
              Agentic Product Design Framework
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, margin: 0 }}>Design System Studio</h1>
          </div>
          <div style={{ fontSize: 11, color: T.dimmer, fontFamily: "'JetBrains Mono', monospace" }}>
            {tokens.name} theme
          </div>
        </div>
      </div>

      {/* Section Nav */}
      <div style={{ background: T.dark, borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0 }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setSection(s)} style={{
              padding: "12px 20px", fontSize: 12, fontWeight: section === s ? 500 : 400,
              fontFamily: "'JetBrains Mono', monospace", textTransform: "capitalize",
              color: section === s ? T.text : T.dimmer, background: "transparent", border: "none",
              borderBottom: section === s ? `2px solid ${T.text}` : "2px solid transparent",
              cursor: "pointer", transition: "all 0.12s",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* ─── THEMES ─── */}
        {section === "themes" && (
          <div>
            <p style={{ fontSize: 14, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
              Choose a starting point. Each theme defines colors, typography, shape, and motion — not just a palette swap.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
              {Object.entries(THEMES).map(([key, theme]) => {
                const isActive = activeTheme === key;
                return (
                  <div key={key} onClick={() => applyTheme(key)} style={{
                    background: C.card, borderRadius: 10, padding: 20, cursor: "pointer",
                    border: `1.5px solid ${isActive ? C.text : C.border}`,
                    boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "all 0.15s", position: "relative",
                  }}>
                    {isActive && <div style={{ position: "absolute", top: 12, right: 12, fontSize: 12, padding: "3px 10px", borderRadius: 99, background: C.bgSub, color: C.sub, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500, border: `1px solid ${C.border}` }}>Active</div>}
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: C.text }}>{theme.name}</div>
                    <div style={{ fontSize: 14, color: C.sub, marginBottom: 14, lineHeight: 1.4 }}>{theme.desc}</div>
                    {/* Color swatches */}
                    <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
                      {[theme.primary, theme.secondary, theme.accent, theme.success, theme.error].map((c, i) => (
                        <div key={i} style={{ width: 28, height: 28, borderRadius: 6, background: c }} />
                      ))}
                    </div>
                    {/* Font + Radius preview */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: C.sub, fontFamily: "'JetBrains Mono', monospace" }}>
                        {theme.fontHeading.split("'")[1] || "Inter"} · r{theme.radiusMd}
                      </span>
                      <div style={{ display: "flex", gap: 3 }}>
                        <div style={{ width: 46, height: 22, borderRadius: theme.radiusMd, background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: contrastOn(theme.primary), fontWeight: 500 }}>Aa</div>
                        <div style={{ width: 22, height: 22, borderRadius: theme.radiusMd, border: `1.5px solid ${theme.primary}` }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.dim, marginTop: 10 }}>{theme.archetype}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button onClick={() => setSection("tokens")} style={{
                padding: "10px 24px", borderRadius: 8, border: `1px solid ${C.border}`,
                background: "transparent", color: C.text, fontSize: 12, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
              }}>Customize tokens →</button>
            </div>
          </div>
        )}

        {/* ─── TOKENS ─── */}
        {section === "tokens" && (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
            {/* Token Controls */}
            <div style={{ background: C.bgSub, borderRadius: 10, padding: 18, border: `1px solid ${C.border}`, alignSelf: "start" }}>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Color</div>
              <ColorInput label="Primary" value={tokens.primary} onChange={v => update("primary", v)} />
              <ColorInput label="Secondary" value={tokens.secondary} onChange={v => update("secondary", v)} />
              <ColorInput label="Accent" value={tokens.accent} onChange={v => update("accent", v)} />
              <ColorInput label="Success" value={tokens.success} onChange={v => update("success", v)} />
              <ColorInput label="Warning" value={tokens.warning} onChange={v => update("warning", v)} />
              <ColorInput label="Error" value={tokens.error} onChange={v => update("error", v)} />

              <div style={{ borderTop: `1px solid ${C.border}`, margin: "14px 0", paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Typography</div>
                <SliderInput label="Base size" value={tokens.baseSize} onChange={v => update("baseSize", v)} min={12} max={20} suffix="px" />
                <SliderInput label="Scale ratio" value={tokens.scaleRatio} onChange={v => update("scaleRatio", v)} min={1.1} max={1.5} step={0.01} />
              </div>

              <div style={{ borderTop: `1px solid ${C.border}`, margin: "14px 0", paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Shape</div>
                <SliderInput label="Radius sm" value={tokens.radiusSm} onChange={v => update("radiusSm", v)} min={0} max={16} suffix="px" />
                <SliderInput label="Radius md" value={tokens.radiusMd} onChange={v => update("radiusMd", v)} min={0} max={24} suffix="px" />
                <SliderInput label="Radius lg" value={tokens.radiusLg} onChange={v => update("radiusLg", v)} min={0} max={32} suffix="px" />
              </div>
            </div>

            {/* Type Scale Preview */}
            <div>
              <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Type scale preview</div>
                <div style={{ background: tokens.surface, borderRadius: tokens.radiusLg, padding: 24 }}>
                  {[
                    { label: "Display", step: 4, weight: tokens.headingWeight, font: tokens.fontHeading },
                    { label: "Headline", step: 3, weight: tokens.headingWeight, font: tokens.fontHeading },
                    { label: "Title", step: 1, weight: tokens.headingWeight, font: tokens.fontHeading },
                    { label: "Body", step: 0, weight: 400, font: tokens.fontBody },
                    { label: "Small", step: -1, weight: 400, font: tokens.fontBody },
                    { label: "Label", step: -2, weight: 500, font: tokens.fontBody },
                  ].map(({ label, step, weight, font }) => (
                    <div key={label} style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: tokens.textTertiary, width: 60, flexShrink: 0 }}>{Math.round(sizes[step])}px</span>
                      <span style={{ fontSize: sizes[step], fontWeight: weight, fontFamily: font, color: tokens.textPrimary, lineHeight: 1.3 }}>
                        {label} — {tokens.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spacing Preview */}
              <div style={{ background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.dim, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1.5 }}>Spacing · {tokens.spaceUnit}px base</div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
                  {[1, 2, 3, 4, 6, 8, 12, 16].map(n => (
                    <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: tokens.spaceUnit * n, height: tokens.spaceUnit * n, maxWidth: 64, maxHeight: 64, background: alpha(tokens.primary, 0.15), borderRadius: 2 }} />
                      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: C.dim }}>{tokens.spaceUnit * n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── COMPONENTS ─── */}
        {section === "components" && (
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 20 }}>
            {/* Component List */}
            <div style={{ background: C.bgSub, borderRadius: 10, border: `1px solid ${C.border}`, padding: "8px 0", alignSelf: "start" }}>
              {(() => {
                let lastCat = "";
                return COMPONENTS.map(c => {
                  const showCat = c.cat !== lastCat;
                  lastCat = c.cat;
                  return (
                    <div key={c.id}>
                      {showCat && <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: C.dim, padding: "10px 14px 4px", textTransform: "uppercase", letterSpacing: 1.5 }}>{c.cat}</div>}
                      <button onClick={() => setActiveComponent(c.id)} style={{
                        display: "block", width: "100%", textAlign: "left", padding: "7px 14px", fontSize: 12,
                        fontFamily: "'DM Sans', sans-serif", color: activeComponent === c.id ? C.text : C.sub,
                        background: activeComponent === c.id ? alpha(tokens.primary, 0.06) : "transparent",
                        border: "none", cursor: "pointer", borderLeft: activeComponent === c.id ? `2px solid ${tokens.primary}` : "2px solid transparent",
                      }}>{c.name}</button>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Preview */}
            <div>
              <div style={{ background: C.card, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{COMPONENTS.find(c => c.id === activeComponent)?.name}</div>
                    <div style={{ fontSize: 11, color: C.dim }}>{COMPONENTS.find(c => c.id === activeComponent)?.cat} · Tier 1</div>
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: C.sub, background: alpha(tokens.primary, 0.06), padding: "3px 10px", borderRadius: 99 }}>
                    {tokens.name}
                  </div>
                </div>
                {/* Live preview on surface */}
                <div style={{ background: tokens.surface, borderRadius: tokens.radiusLg, padding: 24, border: `1px solid ${tokens.border}` }}>
                  {PreviewComp && <PreviewComp t={tokens} />}
                </div>
              </div>

              {/* Token usage hint */}
              <div style={{ background: C.bgSub, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.dim }}>
                <span style={{ color: C.sub }}>--apdf-comp-{activeComponent}-*</span> → inherits from <span style={{ color: tokens.primary }}>--apdf-sys-*</span> tokens
              </div>
            </div>
          </div>
        )}

        {/* ─── EXPORT ─── */}
        {section === "export" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>CSS custom properties</div>
                <div style={{ fontSize: 11, color: C.sub }}>Copy and paste into your project's root stylesheet</div>
              </div>
              <button onClick={copyCSS} style={{
                padding: "8px 20px", borderRadius: 8, border: `1px solid ${C.border}`,
                background: copied ? alpha("#22C55E", 0.08) : "transparent",
                color: copied ? "#22C55E" : C.text, fontSize: 12, cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s",
              }}>{copied ? "Copied ✓" : "Copy CSS"}</button>
            </div>
            <pre style={{
              background: C.bgSub, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`,
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: C.sub,
              overflow: "auto", maxHeight: 500, lineHeight: 1.6, whiteSpace: "pre-wrap",
            }}>{cssOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
