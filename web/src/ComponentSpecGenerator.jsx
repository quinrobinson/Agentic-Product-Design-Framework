import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  deliver: "#14B8A6", deliverDim: "rgba(20,184,166,0.12)", deliverBorder: "rgba(20,184,166,0.25)",
};

const STEPS = [
  { id: 1, label: "Component",  short: "Name + anatomy"           },
  { id: 2, label: "States",     short: "All interactive states"   },
  { id: 3, label: "Behavior",   short: "Interactions + timing"    },
  { id: 4, label: "Spacing",    short: "Tokens + edge cases"      },
  { id: 5, label: "Handoff",    short: "Complete spec document"   },
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
  return <div style={{ marginBottom: sub ? 4 : 8 }}><span style={{ fontSize: sub ? 11 : 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: sub ? T.muted : T.deliver }}>{children}</span></div>;
}

function Textarea({ value, onChange, placeholder, rows = 5, disabled }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", color: T.text, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", opacity: disabled ? 0.5 : 1, transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.deliver} onBlur={e => e.target.style.borderColor = T.border} />;
}

function Input({ value, onChange, placeholder, disabled }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", opacity: disabled ? 0.5 : 1 }} onFocus={e => e.target.style.borderColor = T.deliver} onBlur={e => e.target.style.borderColor = T.border} />;
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const p = variant === "primary";
  return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "7px 14px" : "10px 20px", fontSize: small ? 11 : 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 6, border: "1.5px solid", borderColor: p ? T.deliver : T.border, background: p ? T.deliver : "transparent", color: p ? T.bg : T.muted, opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }} onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }} onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}>{children}</button>;
}

function CopyBtn({ text }) {
  const [c, setC] = useState(false);
  return <Btn small variant="ghost" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1800); }}>{c ? "✓ Copied" : "Copy"}</Btn>;
}

function OutputBlock({ content, streaming, maxH = 480 }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 18px", fontSize: 13, lineHeight: 1.7, color: T.text, fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: maxH, overflowY: "auto" }}>
      {content || <span style={{ color: T.dim, fontStyle: "italic" }}>Output will appear here…</span>}
      {streaming && <span style={{ display: "inline-block", width: 6, height: 14, background: T.deliver, marginLeft: 2, animation: "blink 0.8s step-end infinite", verticalAlign: "middle" }} />}
    </div>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.deliver, background: T.deliverDim, border: `1px solid ${T.deliverBorder}`, padding: "2px 8px", borderRadius: 4 }}>Step {step}</span>
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
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: done ? T.deliver : active ? T.deliverDim : "transparent", border: `1.5px solid ${done ? T.deliver : active ? T.deliver : T.border}`, color: done ? T.bg : active ? T.deliver : T.dim, transition: "all 0.2s" }}>{done ? "✓" : s.id}</div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: active ? T.deliver : done ? T.muted : T.dim, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4, background: done ? T.deliver : T.border, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function ComponentSpecGenerator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [variants, setVariants] = useState("");
  const [tokens, setTokens] = useState("");

  const [anatomy, setAnatomy] = useState("");
  const [states, setStates] = useState("");
  const [behavior, setBehavior] = useState("");
  const [spacing, setSpacing] = useState("");
  const [fullSpec, setFullSpec] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleAnatomy() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design systems expert generating component documentation. Be precise and systematic. Use consistent naming. Flag anything that's missing or ambiguous.",
      `Generate the complete anatomy for this component.

Component: ${name}
Description: ${description}
Variants: ${variants || "None specified — infer from context"}
Design tokens available: ${tokens || "Not specified"}

Produce:

## Purpose
[One sentence: what job this component does and when to use it vs. alternatives]

## When to use / When not to use
✓ Use when: [condition]
✗ Don't use when: [condition — alternative to use instead]

## Anatomy
For every element that makes up this component (including optional ones, containers, and invisible structure):

| Element | Type | Required | Notes |
|---|---|---|---|
| [Name] | [text/icon/container/interactive/decorative] | Yes/No | [constraints or behavior] |

## Variants
| Variant | Differs from default in | Use when |
|---|---|---|
| [Name] | [what changes visually or functionally] | [context] |

Flag any element or variant that needs a design decision before this spec is complete.`,
      setStream
    );
    setAnatomy(result); setLoading(false); mark(1);
  }

  async function handleStates() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design systems expert. Document every interactive state completely — developers build from these specs. Default and hover are not enough. Every state needs a trigger, visual change, and functional change. Be specific about timing and transitions.",
      `Generate complete state documentation for this component.

Component: ${name}
Description: ${description}
Variants: ${variants}
Anatomy: ${anatomy}
Design tokens: ${tokens || "Not specified"}

For each state that applies to this component:

**[State Name]**
Trigger: [what causes this state]
Visual change: [exactly what changes from default — color token, opacity, border, icon, scale]
Functional change: [what the component can/can't do]
Transition: [duration + easing — e.g. 150ms ease-out / none]
Screen reader: [what gets announced when this state activates]

States to cover (apply all that are relevant):
- Default — the resting state, no interaction
- Hover — cursor over component (desktop only)
- Focus — keyboard focus (tab navigation)
- Active / Pressed — during click/tap
- Disabled — not interactive
- Loading — async operation in progress
- Error — validation or system failure
- Success — positive confirmation
- Empty — no content to display

For each state, flag if it's missing from the current design.`,
      setStream
    );
    setStates(result); setLoading(false); mark(2);
  }

  async function handleBehavior() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design systems expert documenting interaction behavior for developers. Be specific about timing, easing, keyboard bindings, and focus management. These are the details that get wrong most often in implementation.",
      `Document all interactive behaviors for this component.

Component: ${name}
Description: ${description}
States: ${states}

## Interactions

For each user action that triggers a response:
| Trigger | Response | Duration | Easing |
|---|---|---|---|
| [Click/tap/hover/key] | [what happens] | [ms] | [ease type] |

## Keyboard Navigation
| Key | Action |
|---|---|
| Tab | [what receives focus / what is skipped] |
| Enter | [action] |
| Space | [action] |
| Arrow keys | [action — if applicable] |
| Escape | [dismiss / cancel / nothing] |

## Focus Management
After [action]: focus moves to [element]
After [action]: focus returns to [trigger element]
[Document every focus transition the component causes]

## Touch Behavior
- Tap target: [minimum size — should be 44×44px minimum]
- Swipe: [if applicable]
- Long press: [if applicable]

## Animation and Motion
- Entrance: [how the component appears — fade, slide, scale, none]
- Exit: [how it leaves]
- State transitions: [specific easing for state changes]
- prefers-reduced-motion: [what happens when user has reduced motion enabled]

## Open Questions
[Any behavior that hasn't been designed or decided yet]`,
      setStream
    );
    setBehavior(result); setLoading(false); mark(3);
  }

  async function handleSpacing() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design systems expert generating spacing, typography, and edge case documentation. Use design token names where provided. Be systematic about edge cases — think about content at extremes.",
      `Generate spacing, typography, sizing, and edge case documentation.

Component: ${name}
Description: ${description}
Anatomy: ${anatomy}
Design tokens: ${tokens || "Use descriptive values if tokens not specified"}

## Spacing
External (component margins — relative to its container):
[Context-determined / specify if the component has built-in margin]

Internal (padding and gaps inside the component):
- Padding: [top / right / bottom / left — use token names]
- Gap between [element A] and [element B]: [token or px value]
[List all internal spacing relationships]

## Typography
For each text element:
| Element | Font | Weight | Size | Line height | Color token | Truncation |
|---|---|---|---|---|---|---|
| [Name] | [family] | [weight] | [size] | [lh] | [token] | [wrap/clip/ellipsis at N lines] |

## Sizing
- Default: [width × height or auto/content-driven]
- Minimum: [min-width / min-height]
- Maximum: [max-width / max-height]
- Responsive: [how it adapts at mobile / tablet breakpoints]

## Edge Cases
For each scenario:

**Long content:** What happens when [text element] reaches 80+ characters?
**Short/empty content:** What shows when there's no content to display?
**Special characters:** Emoji, RTL text, numbers-only — does the layout hold?
**Dark mode:** Are all states and tokens designed for dark mode?
**High contrast:** Do focus indicators and borders survive forced colors?
**Reduced motion:** Do transitions respect prefers-reduced-motion?
**Nested usage:** Inside a disabled container — does the component inherit disabled state?`,
      setStream
    );
    setSpacing(result); setLoading(false); mark(4);
  }

  async function handleFullSpec() {
    setLoading(true); setStream("");
    const allContent = [anatomy, states, behavior, spacing].filter(Boolean).join("\n\n---\n\n");
    const result = await callClaude(
      "You are a design systems expert assembling a complete component specification document. Organize all generated content into a clean, navigable spec that a developer can use as their single source of truth.",
      `Assemble a complete component specification document from this content.

Component: ${name}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

All generated content:
${allContent}

Assemble into this structure:

# Component Spec: ${name}
Date: [date] | Phase: Deliver

---

## Purpose and Usage
[From anatomy — purpose, when to use, when not to use]

## Anatomy
[Full anatomy table]

## Variants
[Variant table]

## States
[All states — formatted consistently]

## Behavior
[Interactions, keyboard, focus management, animation]

## Spacing and Typography
[All spacing, typography, sizing specs]

## Accessibility Summary
- ARIA role: [infer from component type]
- Keyboard: [summary of key bindings]
- Focus indicator: [specification]
- Screen reader: [key announcements]
- WCAG level: AA (target)

## Edge Cases
[All edge cases]

## Open Questions
[ ] [Any unresolved design decisions flagged during spec generation]

---
*Validate this spec against the Figma file before handoff.*
*Add Figma frame links to each section.*`,
      setStream
    );
    setFullSpec(result); setLoading(false); mark(5);
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        :focus-visible { outline: 2px solid #999; outline-offset: 2px; border-radius: 4px; }
      `}</style>

      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 clamp(24px,5vw,80px)", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.deliver, boxShadow: `0 0 8px ${T.deliver}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.deliver }}>06 — Deliver</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Component Spec Generator</span>
        </div>
        {name && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>{name}</span>}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Component Definition"
              desc="Describe the component and Claude generates the complete anatomy — every element, variant, and usage rule." />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Component name</Label>
                  <Input value={name} onChange={setName} placeholder="e.g. Primary Button" />
                </div>
                <div>
                  <Label>Design tokens (optional)</Label>
                  <Input value={tokens} onChange={setTokens} placeholder="e.g. --color-primary-500, --spacing-4, --radius-md" />
                </div>
              </div>
              <div>
                <Label>Component description</Label>
                <Textarea value={description} onChange={setDescription} rows={3}
                  placeholder="e.g. The primary action button. Appears in forms, dialogs, and page headers. Triggers the most important action on a screen. Always one per screen section." />
              </div>
              <div>
                <Label>Variants</Label>
                <Textarea value={variants} onChange={setVariants} rows={3}
                  placeholder={"e.g.\n- Size: Small (32px), Default (40px), Large (48px)\n- Style: Filled (primary), Outlined (secondary), Ghost (tertiary)\n- With/without icon"} />
              </div>
              {anatomy && (
                <div>
                  <Label sub>Anatomy (editable)</Label>
                  <Textarea value={anatomy} onChange={setAnatomy} rows={6} />
                </div>
              )}
              {!anatomy ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Btn disabled={!name.trim() || !description.trim() || loading} onClick={handleAnatomy}>
                    {loading ? "Generating…" : "Generate Anatomy →"}
                  </Btn>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <Btn variant="ghost" small onClick={() => { setAnatomy(""); setStream(""); }}>Re-generate</Btn>
                  <Btn small onClick={() => { mark(1); setStep(2); }}>Document States →</Btn>
                </div>
              )}
              {!anatomy && stream && <OutputBlock content={stream} streaming={loading} />}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Interactive States"
              desc="Every state this component can be in — Default through Error — with triggers, visual changes, timing, and screen reader announcements." />
            {!states && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleStates} disabled={loading}>{loading ? "Generating…" : "Generate All States"}</Btn></div>}
            {(stream || states) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Default · Hover · Focus · Active · Disabled · Loading · Error · Success · Empty</Label>
                  {states && !loading && <CopyBtn text={states} />}
                </div>
                <OutputBlock content={loading ? stream : states} streaming={loading} maxH={520} />
                {states && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setStates(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => { mark(2); setStep(3); }}>Document Behavior →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Behavior and Interactions"
              desc="What happens on every click, key press, and touch — with timing, easing, keyboard navigation, and focus management." />
            {!behavior && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleBehavior} disabled={loading}>{loading ? "Generating…" : "Generate Behavior Docs"}</Btn></div>}
            {(stream || behavior) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Interactions · keyboard · focus management · animation</Label>
                  {behavior && !loading && <CopyBtn text={behavior} />}
                </div>
                <OutputBlock content={loading ? stream : behavior} streaming={loading} maxH={500} />
                {behavior && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setBehavior(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => { mark(3); setStep(4); }}>Spacing + Edge Cases →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Spacing, Typography + Edge Cases"
              desc="Token-mapped spacing and typography values, sizing rules, and systematic edge cases — content extremes, responsive behavior, accessibility modes." />
            {!spacing && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleSpacing} disabled={loading}>{loading ? "Generating…" : "Generate Spacing + Edge Cases"}</Btn></div>}
            {(stream || spacing) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Spacing · typography · sizing · edge cases</Label>
                  {spacing && !loading && <CopyBtn text={spacing} />}
                </div>
                <OutputBlock content={loading ? stream : spacing} streaming={loading} maxH={500} />
                {spacing && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setSpacing(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => { mark(4); setStep(5); }}>Assemble Full Spec →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Complete Spec Document"
              desc="All four sections assembled into a single, navigable spec. Validate against the Figma file before handoff." />
            {!fullSpec && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleFullSpec} disabled={loading}>{loading ? "Assembling…" : "Generate Full Spec"}</Btn></div>}
            {(stream || fullSpec) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Complete component specification — ready for handoff review</Label>
                  {fullSpec && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={fullSpec} />
                      <Btn small variant="ghost" onClick={() => dl(fullSpec, `${name.toLowerCase().replace(/\s+/g, "-")}-spec.md`)}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : fullSpec} streaming={loading} maxH={560} />
                {fullSpec && !loading && (
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.deliverDim, border: `1px solid ${T.deliverBorder}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.deliver }}>
                      ✓ Validate against Figma before sharing — Claude generates, designer confirms
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
