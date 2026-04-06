import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  proto: "#3B82F6", protoDim: "rgba(59,130,246,0.12)", protoBorder: "rgba(59,130,246,0.25)",
};

const STEPS = [
  { id: 1, label: "Component",   short: "Name + type + platform"     },
  { id: 2, label: "States",      short: "Complete state inventory"    },
  { id: 3, label: "Spec",        short: "Per-state specification"     },
  { id: 4, label: "Transitions", short: "Interaction choreography"    },
  { id: 5, label: "Handoff",     short: "Figma property spec"         },
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

function Input({ value, onChange, placeholder, disabled }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", opacity: disabled ? 0.5 : 1 }} onFocus={e => e.target.style.borderColor = T.proto} onBlur={e => e.target.style.borderColor = T.border} />;
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

export default function ComponentStateSpecifier() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 inputs
  const [componentName, setComponentName] = useState("");
  const [componentType, setComponentType] = useState("atomic");
  const [platform, setPlatform] = useState("web");
  const [variantMatrix, setVariantMatrix] = useState("");
  const [tokenContext, setTokenContext] = useState("");
  const [usageContext, setUsageContext] = useState("");

  // Step outputs
  const [stateInventory, setStateInventory] = useState("");
  const [stateSpec, setStateSpec] = useState("");
  const [transitions, setTransitions] = useState("");
  const [figmaSpec, setFigmaSpec] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleStateInventory() {
    setLoading(true); setStream("");
    const sys = `You are a senior design systems engineer generating a complete state inventory for a UI component. Your job is to identify every state this component can be in — nothing implied, everything explicit.

State categories to consider:
INTERACTION STATES: default, hover, focus-visible, active/pressed, visited (links only)
VALIDATION STATES: error, warning, success, info
LOAD STATES: loading/pending, skeleton, refreshing
CONTENT STATES: empty, populated, truncated, overflowing
AVAILABILITY STATES: disabled, read-only, locked
SELECTION STATES: selected, checked, indeterminate, expanded, collapsed
FEEDBACK STATES: dragging, dropped, copying, pasting

Rules:
- Only include states that are RELEVANT to this specific component — not every component has every state
- For each state: name, trigger (what causes this state), visual category (color change / layout change / content change / motion)
- Flag PLATFORM-SPECIFIC states (e.g. iOS pressed vs web hover, Android ripple)
- Mark ACCESSIBILITY-CRITICAL states that must have distinct visual treatment for WCAG compliance
- Format as a clean table: State | Trigger | Visual category | A11y critical | Platform notes`;

    const user = `Component: ${componentName}
Type: ${componentType}
Platform: ${platform}
${variantMatrix ? `Variant matrix:\n${variantMatrix}` : ""}
${usageContext ? `Usage context: ${usageContext}` : ""}
${tokenContext ? `Token set available:\n${tokenContext}` : "Using --sds-* defaults."}

Generate the complete state inventory for this component. Be thorough — missing a state here means it won't get built.`;

    const result = await callClaude(sys, user, setStream);
    setStateInventory(result); setStream(""); mark(1); setStep(2); setLoading(false);
  }

  async function handleStateSpec() {
    setLoading(true); setStream("");
    const tokenPrefix = tokenContext
      ? "Use exact token names from the provided token set."
      : "Use --sds-* naming convention: --sds-color-*, --sds-size-space-*, --sds-size-radius-*, --sds-typography-*, --sds-shadow-*.";

    const sys = `You are a design systems engineer writing per-state specifications. For each state, document exactly what changes visually, what the behavior is, and what the accessibility requirements are. Developers build from these specs — they must be unambiguous.

For each state, document:
VISUAL CHANGES — every token that changes from the default state. Format: property: token-name (state value). If the default is --sds-color-primary-600 and hover is --sds-color-primary-700, write that explicitly.
FUNCTIONAL BEHAVIOR — what the component does in this state (accepts input? triggers action? shows feedback?)
TRANSITION — how does the component enter and exit this state? (duration, easing, property animated)
ACCESSIBILITY — ARIA attributes, keyboard behavior, screen reader announcement for this state

${tokenPrefix}

Format: one section per state. Use the exact state names from the inventory.`;

    const user = `Component: ${componentName}
Platform: ${platform}

State inventory:
${stateInventory}

${tokenContext ? `Token set:\n${tokenContext}` : "Using --sds-* defaults."}
${variantMatrix ? `Variant matrix:\n${variantMatrix}` : ""}

Write the complete per-state specification. Every state in the inventory must be fully documented. Default and hover are not enough — cover all states.`;

    const result = await callClaude(sys, user, setStream);
    setStateSpec(result); setStream(""); mark(2); setStep(3); setLoading(false);
  }

  async function handleTransitions() {
    setLoading(true); setStream("");
    const sys = `You are a senior interaction designer mapping the state transition choreography for a UI component. Your job is to define exactly how this component moves between states — what triggers each transition, what state it returns to, and whether any intermediate states exist.

Produce:
1. STATE TRANSITION MAP — a table showing: From state → Trigger → To state → Intermediate state (if any) → Duration
2. COMPLEX FLOWS — any multi-step transitions (e.g. loading → success → default after 2s, error → shake animation → remains error)
3. INTERRUPTED TRANSITIONS — what happens if a transition is triggered mid-animation?
4. MOTION SPEC — for each unique transition type: property animated (opacity/transform/color), duration (ms), easing curve, CSS transition or animation value
5. PLATFORM NOTES — any platform-specific choreography differences (iOS spring physics vs web cubic-bezier, Android ripple timing)

Use specific ms values. "Fast" is not a spec. "150ms ease-out" is a spec.`;

    const user = `Component: ${componentName}
Platform: ${platform}

State inventory:
${stateInventory}

Per-state specification:
${stateSpec}

Map the complete interaction choreography. Be specific about timing and easing for every transition.`;

    const result = await callClaude(sys, user, setStream);
    setTransitions(result); setStream(""); mark(3); setStep(4); setLoading(false);
  }

  async function handleFigmaSpec() {
    setLoading(true); setStream("");
    const sys = `You are a design systems specialist generating a Figma component property specification and handoff block. This output is used to set up the component in Figma and to hand it to the Component Spec Generator for delivery documentation.

Produce:
1. FIGMA COMPONENT PROPERTIES — every property that should be exposed in Figma's component panel:
   - Variant properties (type, size, etc.) — list all values
   - Boolean properties (hasIcon, isLoading, etc.) — default value
   - Instance swap slots (iconSlot, prefixSlot, etc.)
   - Text layer overrides
   Format: Property name | Type (Variant/Boolean/Instance swap/Text) | Values | Default

2. LAYER NAMING — recommended layer names following the design system naming convention. Use kebab-case.

3. AUTO-LAYOUT SPEC — padding, gap, min-width, resizing behavior for each size variant

4. HANDOFF BLOCK — a structured block formatted for pasting into the Component Spec Generator (Deliver phase):
   Component name, type, all states, all variants, token list, platform, key interactions, edge cases to document`;

    const user = `Component: ${componentName}
Type: ${componentType}
Platform: ${platform}

State inventory:
${stateInventory}

Per-state specification:
${stateSpec}

Transition choreography:
${transitions}

${variantMatrix ? `Variant matrix:\n${variantMatrix}` : ""}
${tokenContext ? `Token set:\n${tokenContext}` : "Using --sds-* defaults."}

Generate the complete Figma property specification and Component Spec Generator handoff block.`;

    const result = await callClaude(sys, user, setStream);
    setFigmaSpec(result); setStream(""); mark(4); setStep(5); setLoading(false);
  }

  const componentSlug = componentName.toLowerCase().replace(/\s+/g, "-") || "component";
  const fullDoc = `# ${componentName} — State Specification\n\n## State Inventory\n${stateInventory}\n\n## Per-State Specification\n${stateSpec}\n\n## Transition Choreography\n${transitions}\n\n## Figma Property Spec + Handoff\n${figmaSpec}`;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto, background: T.protoDim, border: `1px solid ${T.protoBorder}`, padding: "3px 10px", borderRadius: 4 }}>Prototype · Tool 14</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, margin: "0 0 8px", color: T.text }}>Component State Specifier</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6, maxWidth: 560 }}>Document every state before a single variant is built. One component at a time — complete state inventory, per-state token specs, transition choreography, and Figma property setup.</p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <StepIndicator current={step} completed={completed} />

        {/* STEP 1 — Component Definition */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Component Definition" desc="Define the component you're speccing. Paste the row from your Component Architecture Planner handoff block, or describe it from scratch." />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div>
                <Label>Component name</Label>
                <Input value={componentName} onChange={setComponentName} placeholder="e.g. Primary Button, Search Input, Product Card, Data Table Row" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Component type</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { id: "atomic", label: "Atomic", desc: "Button, Input, Badge, Icon" },
                      { id: "molecular", label: "Molecular", desc: "Card, Form Group, Nav Item" },
                      { id: "organism", label: "Organism", desc: "Header, Data Table, Modal" },
                    ].map(t => (
                      <button key={t.id} onClick={() => setComponentType(t.id)} style={{ padding: "8px 12px", textAlign: "left", borderRadius: 6, border: `1.5px solid ${componentType === t.id ? T.proto : T.border}`, background: componentType === t.id ? T.protoDim : T.surface, cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: componentType === t.id ? T.proto : T.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Platform</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {["web", "iOS", "Android", "cross-platform"].map(p => (
                      <button key={p} onClick={() => setPlatform(p)} style={{ padding: "8px 12px", textAlign: "left", borderRadius: 6, border: `1.5px solid ${platform === p ? T.proto : T.border}`, background: platform === p ? T.protoDim : T.surface, cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: platform === p ? T.proto : T.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{p}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Variant matrix <span style={{ color: T.dim, textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>(optional — paste from Component Architecture Planner)</span></Label>
                <Textarea value={variantMatrix} onChange={setVariantMatrix} placeholder="Paste the variant matrix for this component from the Architecture Planner output. If blank, Claude will infer variants from the component type." rows={4} />
              </div>

              <div>
                <Label>Usage context <span style={{ color: T.dim, textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>(optional)</span></Label>
                <Textarea value={usageContext} onChange={setUsageContext} placeholder="Where and how is this component used? e.g. 'Primary action button used in forms, modals, and page headers. Never used for destructive actions.' Context improves state accuracy." rows={3} />
              </div>

              <div>
                <Label>Design tokens <span style={{ color: T.dim, textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>(optional)</span></Label>
                <Textarea value={tokenContext} onChange={setTokenContext} placeholder="Paste CSS custom properties or token assignments from the Architecture Planner. If blank, --sds-* defaults are used." rows={4} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleStateInventory} disabled={!componentName.trim() || loading}>
                  {loading ? "Generating state inventory…" : "Generate state inventory →"}
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — State Inventory */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="State Inventory" desc={`Every state ${componentName} can be in — with trigger, visual category, a11y criticality, and platform notes. Nothing implied, everything explicit.`} />
            {loading ? (
              <div>
                <Label sub>Identifying states…</Label>
                <OutputBlock content={stream} streaming={true} maxH={440} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={stateInventory} maxH={440} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={stateInventory} />
                  <Btn onClick={handleStateSpec} disabled={loading}>Write per-state spec →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Per-State Specification */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Per-State Specification" desc="For every state: exact token changes from default, functional behavior, transition details, and accessibility requirements. Precise enough for a developer to build from." />
            {loading ? (
              <div>
                <Label sub>Specifying each state…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={stateSpec} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={stateSpec} />
                  <Btn onClick={handleTransitions} disabled={loading}>Map transition choreography →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Transition Choreography */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Transition Choreography" desc="How this component moves between states — triggers, intermediate states, timing, easing, and platform-specific motion rules. Specific ms values, not vague descriptions." />
            {loading ? (
              <div>
                <Label sub>Mapping transitions…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={transitions} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={transitions} />
                  <Btn onClick={handleFigmaSpec} disabled={loading}>Generate Figma spec + handoff →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — Figma Property Spec + Handoff */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Figma Property Spec + Handoff" desc="Component properties for Figma's panel, layer naming, auto-layout spec, and a handoff block for the Component Spec Generator at delivery." />
            {loading ? (
              <div>
                <Label sub>Generating Figma spec…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={figmaSpec} maxH={480} />

                {/* Next steps callout */}
                <div style={{ background: T.card, border: `1px solid ${T.protoBorder}`, borderRadius: 8, padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.proto, marginBottom: 6 }}>Build in Figma</div>
                    <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 }}>Use the Figma property spec above to set up component properties. Build each variant using the token assignments from the Architecture Planner.</p>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.proto, marginBottom: 6 }}>At delivery</div>
                    <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 }}>Copy the handoff block and paste it into the <strong style={{ color: T.text }}>Component Spec Generator</strong> to produce the full engineering handoff doc.</p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <CopyBtn text={figmaSpec} />
                  <Btn variant="ghost" small onClick={() => dl(fullDoc, `${componentSlug}-state-spec.md`)}>Download full spec (.md)</Btn>
                  <Btn variant="ghost" small onClick={() => { setStep(1); setCompleted([]); setComponentName(""); setComponentType("atomic"); setPlatform("web"); setVariantMatrix(""); setTokenContext(""); setUsageContext(""); setStateInventory(""); setStateSpec(""); setTransitions(""); setFigmaSpec(""); }}>Spec another component</Btn>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
