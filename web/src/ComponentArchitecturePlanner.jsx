import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  proto: "#3B82F6", protoDim: "rgba(59,130,246,0.12)", protoBorder: "rgba(59,130,246,0.25)",
};

const STEPS = [
  { id: 1, label: "Screens",    short: "Screen inventory input"   },
  { id: 2, label: "Components", short: "Identify + group"         },
  { id: 3, label: "Variants",   short: "Variant matrix"           },
  { id: 4, label: "Tokens",     short: "Token assignment"         },
  { id: 5, label: "Brief",      short: "Build brief + handoff"    },
];

async function callClaude(system, user, onChunk) {
  const res = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-5-20250514", max_tokens: 1000, stream: true, system, messages: [{ role: "user", content: user }] }),
  });
  if (!res.ok) { onChunk("⚠️ Error " + res.status + ". Check your API key and try again."); return ""; }
  const reader = res.body.getReader(); const dec = new TextDecoder(); let full = "";
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    for (const line of dec.decode(value).split("\n").filter(l => l.startsWith("data: "))) {
      try { const j = JSON.parse(line.slice(6)); if (j.type === "content_block_delta" && j.delta?.text) { full += j.delta.text; onChunk(full); } } catch {}
    }
  }
  return full;
}

function Label({ children, sub }) {
  return <div style={{ marginBottom: sub ? 4 : 8 }}><span style={{ fontSize: sub ? 11 : 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: sub ? T.muted : T.proto }}>{children}</span></div>;
}

function Textarea({ value, onChange, placeholder, rows = 5, disabled }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", color: T.text, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", opacity: disabled ? 0.5 : 1, transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.proto} onBlur={e => e.target.style.borderColor = T.border} />;
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const p = variant === "primary";
  return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "7px 14px" : "10px 20px", fontSize: small ? 11 : 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 6, border: "1.5px solid", borderColor: p ? T.proto : T.border, background: p ? T.proto : "transparent", color: p ? "#fff" : T.muted, opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }} onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }} onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}>{children}</button>;
}

function CopyBtn({ text }) {
  const [c, setC] = useState(false);
  return <Btn small variant="ghost" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1800); }}>{c ? "✓ Copied" : "Copy"}</Btn>;
}

function OutputBlock({ content, streaming, maxH = 500 }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 18px", fontSize: 13, lineHeight: 1.7, color: T.text, fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: maxH, overflowY: "auto" }}>
      {content || <span style={{ color: T.dim, fontStyle: "italic" }}>Output will appear here…</span>}
      {streaming && <span style={{ display: "inline-block", width: 6, height: 14, background: T.proto, marginLeft: 2, animation: "blink 0.8s step-end infinite", verticalAlign: "middle" }} />}
    </div>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto, background: T.protoDim, border: `1px solid ${T.protoBorder}`, padding: "2px 8px", borderRadius: 4 }}>Step {step}</span>
        <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>{title}</span>
      </div>
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 600 }}>{desc}</p>}
    </div>
  );
}

function StepIndicator({ current, completed }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done = completed.includes(s.id), active = current === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 56 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: done ? T.proto : active ? T.protoDim : "transparent", border: `1.5px solid ${done ? T.proto : active ? T.proto : T.border}`, color: done ? "#fff" : active ? T.proto : T.dim, transition: "all 0.2s" }}>{done ? "✓" : s.id}</div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: active ? T.proto : done ? T.muted : T.dim, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4, background: done ? T.proto : T.border, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function ComponentArchitecturePlanner() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 inputs
  const [screenInventory, setScreenInventory] = useState("");
  const [platform, setPlatform] = useState("web");
  const [productContext, setProductContext] = useState("");
  const [tokenContext, setTokenContext] = useState("");

  // Step outputs
  const [components, setComponents] = useState("");
  const [variants, setVariants] = useState("");
  const [tokens, setTokens] = useState("");
  const [brief, setBrief] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleComponents() {
    setLoading(true); setStream("");
    const sys = `You are a senior design systems architect. Analyze a screen inventory and produce a structured component breakdown. Group components into three tiers:

ATOMIC — single-purpose primitives: Button, Input, Label, Badge, Icon, Avatar, Divider, Spinner, Tag, Toggle, Checkbox, Radio
MOLECULAR — composed of 2–4 atoms: Card, Form Group, Nav Item, List Item, Search Bar, Alert, Tooltip, Tab, Breadcrumb
ORGANISM — complex patterns: Header, Sidebar, Data Table, Modal, Form, Feed, Navigation Bar, Empty State, Page Header

For each component:
- State whether it LIKELY EXISTS in common UI libraries (flag as "existing") or needs to be BUILT from scratch ("custom")
- Note the platform constraints (${platform})
- Be specific about what makes each component unique to THIS product

Format output as clean markdown. Each tier is a section. Each component is a row: Component name | Tier | Existing/Custom | Notes.`;

    const user = `Screen inventory:
${screenInventory}

Product context: ${productContext || "Not specified"}
Platform: ${platform}
${tokenContext ? `Design tokens available:\n${tokenContext}` : "No custom token set provided — use --sds-* naming convention defaults."}

Analyze every screen, identify all unique UI patterns, and produce the full component breakdown grouped by tier. Flag anything that appears on 3+ screens as high-priority.`;

    const result = await callClaude(sys, user, setStream);
    setComponents(result); setStream(""); mark(1); setStep(2); setLoading(false);
  }

  async function handleVariants() {
    setLoading(true); setStream("");
    const sys = `You are a design systems architect defining variant matrices. For each component, define every axis of variation a designer needs to account for before building in Figma.

Variant axes to consider:
- Type/Kind: primary, secondary, destructive, ghost, outline, etc.
- Size: xs, sm, md, lg, xl — only include sizes actually needed
- State: default, hover, focus, active, disabled, loading, error, success, empty, skeleton
- Platform-specific: mobile touch targets, desktop hover states
- Content variants: with/without icon, with/without label, truncated

Rules:
- Only define variants that will actually be used — don't over-engineer
- Flag the DEFAULT variant clearly for each component
- Note which variants are HIGH PRIORITY for v1 vs DEFER to v2
- Format as a table per component: Axis | Values | Default | Priority`;

    const user = `Component list:
${components}

Platform: ${platform}
${tokenContext ? `Token context:\n${tokenContext}` : "Using --sds-* defaults."}

For each component in the list, produce the complete variant matrix. Be specific — a Button has different variant needs than a Data Table.`;

    const result = await callClaude(sys, user, setStream);
    setVariants(result); setStream(""); mark(2); setStep(3); setLoading(false);
  }

  async function handleTokens() {
    setLoading(true); setStream("");
    const tokenPrefix = tokenContext ? "Use the exact token names from the provided token set." : "Use --sds-* naming convention: --sds-color-*, --sds-size-space-*, --sds-size-radius-*, --sds-typography-*, --sds-shadow-*.";

    const sys = `You are a design systems architect mapping components to design tokens. Every visual property must map to a named token — no hardcoded values in specs.

Token categories:
- Color: background, text, border, icon colors — map to semantic color roles not raw hex
- Spacing: padding, gap, margin — map to space tokens (--sds-size-space-*)
- Typography: font-size, font-weight, line-height — map to typography tokens
- Radius: border-radius — map to radius tokens
- Elevation: box-shadow — map to shadow tokens
- Motion: transition duration and easing

${tokenPrefix}

Format: one section per component. For each component property: Property | Token name | Notes on state variations (e.g. hover changes --sds-color-primary-700 → --sds-color-primary-800).`;

    const user = `Components and variants:
${components}

Variant matrix:
${variants}

${tokenContext ? `Available tokens:\n${tokenContext}` : "Apply --sds-* naming convention defaults."}

Produce the token assignment map. Every property of every component should have a named token. Flag any properties where a token doesn't exist and a new token should be created.`;

    const result = await callClaude(sys, user, setStream);
    setTokens(result); setStream(""); mark(3); setStep(4); setLoading(false);
  }

  async function handleBrief() {
    setLoading(true); setStream("");
    const sys = `You are a senior design systems architect generating a build brief and phase handoff. The brief must be actionable — a designer should be able to open Figma and start building immediately.

The brief includes:
1. ORDERED BUILD LIST — foundation first, complex last. Format: Priority | Component | Why this order | Estimated Figma frames
2. FIGMA STRUCTURE — recommended page and frame organization for this component set
3. BUILD PRINCIPLES — token-first rules, naming conventions, auto-layout requirements specific to this product
4. OPEN QUESTIONS — decisions that need resolution before building (missing tokens, unclear interactions, platform edge cases)
5. HANDOFF BLOCK — a structured block for the Component State Specifier tool. Format it clearly so the designer can copy any single component row and paste it as input to the next tool.

Be specific and opinionated. Generic advice is not useful here.`;

    const user = `Component architecture:
${components}

Variant matrix:
${variants}

Token assignments:
${tokens}

Platform: ${platform}
Product context: ${productContext || "Not specified"}

Generate the complete build brief with ordered build list, Figma structure recommendation, build principles, open questions, and handoff block for the Component State Specifier.`;

    const result = await callClaude(sys, user, setStream);
    setBrief(result); setStream(""); mark(4); setStep(5); setLoading(false);
  }

  const fullDoc = `# Component Architecture Plan\n\n## Component Inventory\n${components}\n\n## Variant Matrix\n${variants}\n\n## Token Assignments\n${tokens}\n\n## Build Brief\n${brief}`;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto, background: T.protoDim, border: `1px solid ${T.protoBorder}`, padding: "3px 10px", borderRadius: 4 }}>Prototype · Tool 13</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, margin: "0 0 8px", color: T.text }}>Component Architecture Planner</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6, maxWidth: 560 }}>Define what to build before opening Figma. Takes your screen inventory and produces a complete component breakdown, variant matrix, token assignments, and an ordered build brief.</p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <StepIndicator current={step} completed={completed} />

        {/* STEP 1 — Screen Inventory */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Screen Inventory" desc="Paste the screen inventory from your User Flow Mapper output, or describe the screens you're building. Include every screen and state — the more complete the input, the more precise the component breakdown." />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div>
                <Label>Screen inventory</Label>
                <Textarea value={screenInventory} onChange={setScreenInventory} placeholder="Paste your screen list here. Example:&#10;- Home / Dashboard (default, empty, loading)&#10;- Login (default, error, forgot password)&#10;- Product List (default, filtered, empty)&#10;- Product Detail (default, out of stock)&#10;- Cart (items, empty, processing)&#10;- Checkout (address, payment, confirmation)&#10;- User Profile (view, edit)&#10;- Settings (notifications, privacy, account)" rows={10} />
              </div>

              <div>
                <Label>Platform</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["web", "iOS", "Android", "cross-platform"].map(p => (
                    <button key={p} onClick={() => setPlatform(p)} style={{ padding: "7px 16px", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: 6, border: `1.5px solid ${platform === p ? T.proto : T.border}`, background: platform === p ? T.protoDim : "transparent", color: platform === p ? T.proto : T.muted, cursor: "pointer", transition: "all 0.15s" }}>{p}</button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Product context <span style={{ color: T.dim, textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>(optional)</span></Label>
                <Textarea value={productContext} onChange={setProductContext} placeholder="Brief description of the product, user, and key interactions. Helps Claude make better decisions about component complexity and variant needs." rows={3} />
              </div>

              <div>
                <Label>Design tokens <span style={{ color: T.dim, textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>(optional — paste CSS custom properties)</span></Label>
                <Textarea value={tokenContext} onChange={setTokenContext} placeholder="Paste your CSS custom properties here if you have them. Example:&#10;--sds-color-primary-600: #2563EB;&#10;--sds-size-space-200: 8px;&#10;&#10;If left blank, Claude will use --sds-* naming convention defaults." rows={5} />
                <p style={{ fontSize: 11, color: T.dim, margin: "6px 0 0", lineHeight: 1.5 }}>Export from the Design System Builder → Copy CSS → paste above. If blank, output uses <code style={{ fontFamily: "'JetBrains Mono', monospace", color: T.proto }}>--sds-*</code> defaults.</p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleComponents} disabled={!screenInventory.trim() || loading}>
                  {loading ? "Identifying components…" : "Identify components →"}
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Component Identification */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Component Identification" desc="Every unique UI pattern across your screens, grouped into atomic, molecular, and organism tiers. Existing components are flagged separately from custom builds." />
            {loading ? (
              <div>
                <Label sub>Analyzing screens…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={components} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={components} />
                  <Btn onClick={handleVariants} disabled={loading}>Define variant matrix →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Variant Matrix */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Variant Matrix" desc="For each component: every axis of variation, the default state, and v1 vs v2 priority. No over-engineering — only variants that will actually be built." />
            {loading ? (
              <div>
                <Label sub>Mapping variants…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={variants} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={variants} />
                  <Btn onClick={handleTokens} disabled={loading}>Assign tokens →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Token Assignment */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Token Assignment" desc="Every visual property mapped to a named token. No hardcoded values. New tokens that need to be created are flagged explicitly." />
            {loading ? (
              <div>
                <Label sub>Mapping tokens…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={tokens} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={tokens} />
                  <Btn onClick={handleBrief} disabled={loading}>Generate build brief →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — Build Brief + Handoff */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Build Brief + Handoff" desc="Ordered build list, Figma structure, build principles, open questions, and a handoff block for the Component State Specifier. Copy any single component row to start speccing states." />
            {loading ? (
              <div>
                <Label sub>Generating build brief…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={brief} maxH={480} />

                {/* Callout */}
                <div style={{ background: T.card, border: `1px solid ${T.protoBorder}`, borderRadius: 8, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.proto, marginBottom: 8 }}>Next step</div>
                  <p style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.6 }}>Copy any component row from the handoff block above and paste it into the <strong style={{ color: T.text }}>Component State Specifier</strong> to document every state before building in Figma.</p>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <CopyBtn text={brief} />
                  <Btn variant="ghost" small onClick={() => dl(fullDoc, "component-architecture-plan.md")}>Download full plan (.md)</Btn>
                  <Btn variant="ghost" small onClick={() => dl(brief, "build-brief.md")}>Download build brief</Btn>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
