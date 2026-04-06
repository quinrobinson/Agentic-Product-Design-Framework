import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0F0F0F",
  surface: "#161616",
  card: "#1C1C1C",
  border: "#2A2A2A",
  text: "#F2F2F2",
  muted: "#999999",
  dim: "#666666",
  discover: "#22C55E",
  discoverDim: "rgba(34,197,94,0.12)",
  discoverBorder: "rgba(34,197,94,0.25)",
  amber: "#F59E0B",
  amberDim: "rgba(245,158,11,0.12)",
  amberBorder: "rgba(245,158,11,0.25)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.1)",
};

const LANES = [
  { id: "user",    label: "User Actions",      desc: "What the user does — steps, decisions, behaviors",             visible: true  },
  { id: "front",   label: "Frontstage",         desc: "What the user sees — interfaces, touchpoints, interactions",   visible: true  },
  { id: "back",    label: "Backstage",           desc: "Behind the scenes — staff actions, internal processes",       visible: false },
  { id: "support", label: "Support Processes",  desc: "Systems, tools, infrastructure enabling backstage",           visible: false },
  { id: "evidence",label: "Evidence",           desc: "Proof delivered to user — emails, receipts, notifications",   visible: true  },
];

const STEPS = [
  { id: 1, label: "Mode",      short: "Choose mode"        },
  { id: 2, label: "Context",   short: "Scenario setup"     },
  { id: 3, label: "Stages",    short: "Define stages"      },
  { id: 4, label: "Blueprint", short: "Generate blueprint" },
  { id: 5, label: "Handoff",   short: "Define handoff"     },
];

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(system, user, onChunk) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1000,
      stream: true,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) { onChunk("⚠️ Error " + res.status + ". Check your API key and try again."); return ""; }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n").filter(l => l.startsWith("data: "))) {
      try {
        const j = JSON.parse(line.slice(6));
        if (j.type === "content_block_delta" && j.delta?.text) {
          full += j.delta.text;
          onChunk(full);
        }
      } catch {}
    }
  }
  return full;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? 4 : 8 }}>
      <span style={{
        fontSize: sub ? 11 : 12,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.07em", textTransform: "uppercase",
        color: sub ? T.muted : T.discover,
      }}>{children}</span>
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 5, disabled }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} disabled={disabled}
      style={{
        width: "100%", boxSizing: "border-box",
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "12px 14px",
        color: T.text, fontSize: 13, lineHeight: 1.6,
        fontFamily: "'DM Sans', sans-serif",
        resize: "vertical", outline: "none",
        opacity: disabled ? 0.5 : 1, transition: "border-color 0.15s",
      }}
      onFocus={e => e.target.style.borderColor = T.discover}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  );
}

function Input({ value, onChange, placeholder, disabled }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} disabled={disabled}
      style={{
        width: "100%", boxSizing: "border-box",
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "10px 14px",
        color: T.text, fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
        outline: "none", transition: "border-color 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={e => e.target.style.borderColor = T.discover}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  );
}

function Btn({ children, onClick, disabled, variant = "primary", small, color }) {
  const isPrimary = variant === "primary";
  const accent = color || T.discover;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "7px 14px" : "10px 20px",
      fontSize: small ? 11 : 13,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.06em", textTransform: "uppercase",
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: 6, border: `1.5px solid`,
      borderColor: isPrimary ? accent : T.border,
      background: isPrimary ? accent : "transparent",
      color: isPrimary ? "#000" : T.muted,
      opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
    }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.target.style.opacity = "1"; }}
    >{children}</button>
  );
}

function CopyBtn({ text, small }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn small={small !== false} variant="ghost" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }}>{copied ? "✓ Copied" : "Copy"}</Btn>
  );
}

function OutputBlock({ content, streaming, maxH = 400 }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 8, padding: "16px 18px",
      fontSize: 13, lineHeight: 1.7, color: T.text,
      fontFamily: "'DM Sans', sans-serif",
      whiteSpace: "pre-wrap", wordBreak: "break-word",
      maxHeight: maxH, overflowY: "auto",
    }}>
      {content || <span style={{ color: T.dim, fontStyle: "italic" }}>Output will appear here…</span>}
      {streaming && <span style={{
        display: "inline-block", width: 6, height: 14,
        background: T.discover, marginLeft: 2,
        animation: "blink 0.8s step-end infinite", verticalAlign: "middle",
      }} />}
    </div>
  );
}

function SectionHeader({ step, title, desc, color }) {
  const accent = color || T.discover;
  const accentDim = color ? T.amberDim : T.discoverDim;
  const accentBorder = color ? T.amberBorder : T.discoverBorder;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: accent, background: accentDim,
          border: `1px solid ${accentBorder}`,
          padding: "2px 8px", borderRadius: 4,
        }}>Step {step}</span>
        <span style={{
          fontSize: "clamp(16px, 1.5vw, 22px)", fontWeight: 600,
          fontFamily: "'DM Serif Display', serif", color: T.text,
        }}>{title}</span>
      </div>
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 580 }}>{desc}</p>}
    </div>
  );
}

function StepIndicator({ current, completed, mode }) {
  const accent = mode === "future" ? T.amber : T.discover;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((step, i) => {
        const done = completed.includes(step.id);
        const active = current === step.id;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 56 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                fontFamily: "'JetBrains Mono', monospace",
                background: done ? accent : active ? (mode === "future" ? T.amberDim : T.discoverDim) : "transparent",
                border: `1.5px solid ${done ? accent : active ? accent : T.border}`,
                color: done ? "#000" : active ? accent : T.dim,
                transition: "all 0.2s",
              }}>{done ? "✓" : step.id}</div>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: active ? accent : done ? T.muted : T.dim,
                whiteSpace: "nowrap",
              }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4,
                background: done ? accent : T.border, transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function LaneTag({ visible }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "2px 6px", borderRadius: 3,
      background: visible ? T.discoverDim : T.amberDim,
      border: `1px solid ${visible ? T.discoverBorder : T.amberBorder}`,
      color: visible ? T.discover : T.amber,
    }}>{visible ? "Visible" : "Hidden"}</span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ServiceBlueprintGenerator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Mode
  const [mode, setMode] = useState(null); // "current" | "future" | "both"

  // Step 2 — Context
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [trigger, setTrigger] = useState("");
  const [researchData, setResearchData] = useState("");
  const [hmwData, setHmwData] = useState(""); // future state only

  // Step 3 — Stages
  const [stagesRaw, setStagesRaw] = useState("");
  const [stagesApproved, setStagesApproved] = useState([]);
  const [stagesGenerated, setStagesGenerated] = useState("");

  // Step 4 — Blueprint
  const [blueprintCurrent, setBlueprintCurrent] = useState("");
  const [blueprintFuture, setBlueprintFuture] = useState("");
  const [activeBlueprint, setActiveBlueprint] = useState("current"); // which to show

  // Step 5 — Handoff
  const [handoff, setHandoff] = useState("");

  const isFuture = mode === "future";
  const isBoth = mode === "both";
  const accent = isFuture ? T.amber : T.discover;
  const accentColor = isFuture ? T.amber : undefined;

  const markComplete = (id) => setCompleted(prev => [...new Set([...prev, id])]);

  // ── Step 3: Suggest stages ────────────────────────────────────────────────
  async function handleSuggestStages() {
    if (!persona.trim() || !goal.trim()) return;
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior service designer. Suggest clear, sequential journey stages for a service blueprint. Be concise and specific.",
      `Suggest 5–7 journey stages for this service blueprint scenario.

Persona: ${persona}
Goal: ${goal}
Trigger (what starts the experience): ${trigger}
${researchData ? `Research context:\n${researchData}` : ""}

Return ONLY a numbered list of stage names (2–4 words each). No descriptions. No extra text.
Example format:
1. Awareness
2. Onboarding
3. Core task
4. Review
5. Exit`,
      setStream
    );
    setStagesGenerated(result);
    setStagesRaw(result);
    setLoading(false);
  }

  function approveStages() {
    const lines = stagesRaw.split("\n").filter(l => l.trim());
    const parsed = lines.map((l, i) => {
      const cleaned = l.replace(/^\d+[\.\)]\s*/, "").trim();
      return { id: i + 1, name: cleaned };
    }).filter(s => s.name);
    setStagesApproved(parsed);
    markComplete(3);
    setStep(4);
  }

  // ── Step 4: Generate blueprint ────────────────────────────────────────────
  async function handleGenerateBlueprint(bpMode) {
    setLoading(true); setStream("");
    const stages = stagesApproved.map(s => s.name).join(", ");
    const isFutureMode = bpMode === "future";

    const sys = `You are a senior service designer generating a detailed service blueprint. 
For each stage, populate all five swim lanes precisely.
${isFutureMode ? "Mark NEW elements with ✦ and IMPROVED elements with ↑. Every change must trace to a pain point or opportunity." : "Mark PAIN POINTS with ⚠️ and WORKAROUNDS with 🔧."}
Use direct, specific language. No generic filler.`;

    const msg = isFutureMode
      ? `Generate a FUTURE STATE service blueprint.

Persona: ${persona}
Goal: ${goal}
Stages: ${stages}

Current state blueprint:
${blueprintCurrent}

HMW statements and insights:
${hmwData || "Not provided — use research data to infer opportunities."}

For each stage, cover all five swim lanes:
1. User Actions — what the user does (note improvements with ↑ or new behaviors with ✦)
2. Frontstage — new or improved touchpoints (mark with ✦ or ↑)
3. Backstage — process changes required (mark with ✦ or ↑)
4. Support Processes — new systems or integrations needed (mark with ✦ or ↑)
5. Evidence — new or improved proof delivered to user (mark with ✦ or ↑)

After each stage add:
**Design Decision:** [which principle this serves + which pain point it addresses]
**Assumption:** [what must be true for this to work]

After all stages, add:
## Future State Summary
### What Changes Most (table: Stage | Change | Type | Rationale)
### What Stays the Same
### Organizational Changes Required
### Riskiest Assumptions`
      : `Generate a CURRENT STATE service blueprint.

Persona: ${persona}
Goal: ${goal}
Stages: ${stages}
Research data: ${researchData || "Not provided — infer from context."}

For each stage, cover all five swim lanes:
1. User Actions — specific steps, decisions, behaviors (observed or inferred)
2. Frontstage — what they see and interact with (screens, people, touchpoints)
3. Backstage — what happens behind the scenes to enable this stage
4. Support Processes — systems, tools, data flows enabling backstage
5. Evidence — what the user receives as proof (emails, confirmations, receipts)

Mark pain points with ⚠️ and cite where observed (e.g. "S3 — Research session").
Mark workarounds with 🔧 and note what unmet need each reveals.

After all stages, add:
## Current State Summary
### Moments of Highest Friction (table: Stage | Pain Point | Severity | Notes)
### Systemic Gaps (disconnects between frontstage and backstage)
### Workarounds That Reveal Unmet Needs
### Emotional Journey (one sentence per stage)`;

    const result = await callClaude(sys, msg, setStream);
    if (isFutureMode) {
      setBlueprintFuture(result);
      setActiveBlueprint("future");
    } else {
      setBlueprintCurrent(result);
      setActiveBlueprint("current");
    }
    setLoading(false);
  }

  function finishBlueprint() {
    markComplete(4);
    setStep(5);
  }

  // ── Step 5: Generate handoff ──────────────────────────────────────────────
  async function handleGenerateHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX designer generating a structured phase handoff block. Be specific and actionable. Extract real content from the blueprint — no placeholders.",
      `Generate a Discover → Define Phase Handoff Block from this service blueprint.

Mode: ${mode === "both" ? "Current + Future State" : mode === "future" ? "Future State only" : "Current State only"}
Persona: ${persona}
Goal: ${goal}
Stages: ${stagesApproved.map(s => s.name).join(", ")}

Current State Blueprint:
${blueprintCurrent || "Not generated."}

Future State Blueprint:
${blueprintFuture || "Not generated."}

Generate the handoff block using this exact structure:

## → Handoff: Discover → Define
### From: Service Blueprint Generator
### Project: [derive from persona + goal]
### Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

### What we completed
- Mode: [current / future / both]
- Stages mapped: [N — list names]
- Persona: [name/role]
- Scenario: [goal in one sentence]

### What the next phase needs to know
- Most critical current state failure: [one sentence — worst systemic gap]
- Most important future state direction: [one sentence — clearest opportunity]
- Organizational change required: [hardest backstage change needed]

### Top frontstage pain points (what users feel)
1. [Stage] — [Pain point] — Severity: [Critical / Major / Minor]
2. [Stage] — [Pain point] — Severity: [Critical / Major / Minor]
3. [Stage] — [Pain point] — Severity: [Critical / Major / Minor]

### Top systemic gaps (root causes)
1. [Disconnect between frontstage and backstage]
2. [Disconnect between frontstage and backstage]

### Riskiest assumptions in the future state
1. [Assumption] — Risk if wrong: [impact]
2. [Assumption] — Risk if wrong: [impact]

### Design principles established
1. [Principle name] — [one sentence]
2. [Principle name] — [one sentence]
3. [Principle name] — [one sentence]

### Open questions for Define
- [What the blueprint raised but didn't resolve]
- [Design decisions needing alignment]

### Recommended Define focus
[1–2 sentences — which problem to frame first and why]`,
      setStream
    );
    setHandoff(result);
    setLoading(false);
    markComplete(5);
  }

  function downloadMd(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        :focus-visible { outline: 2px solid #999999; outline-offset: 2px; border-radius: 4px; }
        button:focus:not(:focus-visible) { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`, padding: "0 clamp(24px, 5vw, 80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.discover, boxShadow: `0 0 8px ${T.discover}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.discover }}>01 — Discover</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Service Blueprint Generator</span>
        </div>
        {mode && (
          <span style={{
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em", textTransform: "uppercase",
            padding: "3px 10px", borderRadius: 4,
            background: isFuture ? T.amberDim : T.discoverDim,
            border: `1px solid ${isFuture ? T.amberBorder : T.discoverBorder}`,
            color: isFuture ? T.amber : T.discover,
          }}>
            {mode === "both" ? "Current + Future State" : mode === "future" ? "Future State" : "Current State"}
          </span>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>

        <StepIndicator current={step} completed={completed} mode={isFuture ? "future" : "current"} />

        {/* ── Step 1: Mode ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Choose Mode"
              desc="A service blueprint maps one persona doing one thing. Decide which state you're mapping before setting up the scenario." />

            {/* Swim lane anatomy */}
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "20px 24px", marginBottom: 28,
            }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
                  Five swim lanes — every blueprint
                </span>
              </div>
              {LANES.map((lane, i) => (
                <div key={lane.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "10px 0",
                  borderBottom: i < LANES.length - 1 ? `1px solid ${T.border}` : "none",
                }}>
                  {i === 2 && (
                    <div style={{
                      width: "100%", height: 1, background: T.border,
                      position: "absolute", left: 0,
                    }} />
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{lane.label}</span>
                  </div>
                  <span style={{ fontSize: 12, color: T.muted, flex: 1, lineHeight: 1.5 }}>{lane.desc}</span>
                  <LaneTag visible={lane.visible} />
                </div>
              ))}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>
                  Line of Visibility separates Frontstage (visible) from Backstage (hidden)
                </span>
              </div>
            </div>

            {/* Mode cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[
                { id: "current", label: "Current State", desc: "Map what actually happens today — friction, gaps, and workarounds.", color: T.discover, dimColor: T.discoverDim, borderColor: T.discoverBorder },
                { id: "future",  label: "Future State",  desc: "Map the aspirational experience — what should change and why.", color: T.amber, dimColor: T.amberDim, borderColor: T.amberBorder },
                { id: "both",    label: "Both",          desc: "Current first, then future. Your team's standard approach.", color: T.discover, dimColor: T.discoverDim, borderColor: T.discoverBorder },
              ].map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); markComplete(1); setStep(2); }}
                  style={{
                    background: T.card, border: `1.5px solid ${T.border}`,
                    borderRadius: 10, padding: "18px 16px",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.background = m.dimColor; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 8 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.5 }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 2: Context ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Scenario Setup"
              desc="One blueprint = one persona + one goal + one context. Lock the scenario before generating anything."
              color={accentColor} />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Primary persona</Label>
                  <Input value={persona} onChange={setPersona} placeholder="e.g. Senior Product Designer" />
                </div>
                <div>
                  <Label>Their goal</Label>
                  <Input value={goal} onChange={setGoal} placeholder="e.g. Synthesize user research into insights" />
                </div>
              </div>
              <div>
                <Label>Trigger — what starts this experience</Label>
                <Input value={trigger} onChange={setTrigger} placeholder="e.g. Finishes conducting 8 user interviews" />
              </div>
              {!isFuture && (
                <div>
                  <Label>Research data (optional — paste themes, pain points, or session notes)</Label>
                  <Textarea value={researchData} onChange={setResearchData} rows={6}
                    placeholder="Paste research synthesis, pain points, or session summaries. The more context, the more accurate the blueprint." />
                </div>
              )}
              {(isFuture || isBoth) && (
                <div>
                  <Label>HMW statements + insights (for future state)</Label>
                  <Textarea value={hmwData} onChange={setHmwData} rows={5}
                    placeholder="Paste prioritized HMW statements and insight statements from Insight Framing. These anchor the future state design." />
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!persona.trim() || !goal.trim()}
                  color={accentColor}
                  onClick={() => { markComplete(2); setStep(3); }}>
                  Set Scenario →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Stages ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Define Stages"
              desc="Stages are the backbone of the blueprint — everything else hangs off them. Generate suggestions or write your own. Aim for 5–7."
              color={accentColor} />

            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "14px 16px", marginBottom: 20,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>👤</span>
              <div>
                <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{persona}</span>
                <span style={{ fontSize: 12, color: T.muted }}> · {goal}</span>
                {trigger && <div style={{ fontSize: 11, color: T.dim, marginTop: 3 }}>Starts: {trigger}</div>}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="ghost" small onClick={handleSuggestStages} disabled={loading}>
                  {loading ? "Suggesting…" : "Suggest Stages"}
                </Btn>
              </div>

              {(stream || stagesGenerated) && !stagesApproved.length && (
                <div>
                  <OutputBlock content={stream} streaming={loading} maxH={200} />
                </div>
              )}

              <div>
                <Label>Stages — edit or write your own (one per line, numbered)</Label>
                <Textarea value={stagesRaw} onChange={setStagesRaw} rows={8}
                  placeholder={"1. Awareness\n2. Onboarding\n3. Core task\n4. Review\n5. Exit"}
                  disabled={loading} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!stagesRaw.trim() || loading} color={accentColor} onClick={approveStages}>
                  Confirm Stages →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Blueprint ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Generate Blueprint"
              desc={isBoth ? "Generate current state first, review it, then generate future state." : `Generating ${mode} state blueprint across ${stagesApproved.length} stages and 5 swim lanes.`}
              color={accentColor} />

            {/* Stage pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {stagesApproved.map(s => (
                <span key={s.id} style={{
                  padding: "3px 10px", borderRadius: 20,
                  background: T.discoverDim, border: `1px solid ${T.discoverBorder}`,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  color: T.discover, letterSpacing: "0.04em",
                }}>{s.id}. {s.name}</span>
              ))}
            </div>

            {/* Mode tabs for "both" */}
            {isBoth && (blueprintCurrent || blueprintFuture) && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[
                  { id: "current", label: "Current State", has: !!blueprintCurrent },
                  { id: "future",  label: "Future State",  has: !!blueprintFuture  },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveBlueprint(tab.id)}
                    style={{
                      padding: "6px 14px", borderRadius: 6,
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      cursor: "pointer",
                      background: activeBlueprint === tab.id ? (tab.id === "future" ? T.amberDim : T.discoverDim) : "transparent",
                      border: `1.5px solid ${activeBlueprint === tab.id ? (tab.id === "future" ? T.amber : T.discover) : T.border}`,
                      color: activeBlueprint === tab.id ? (tab.id === "future" ? T.amber : T.discover) : T.muted,
                      opacity: tab.has ? 1 : 0.5,
                    }}>
                    {tab.label} {tab.has ? "✓" : ""}
                  </button>
                ))}
              </div>
            )}

            {/* Generate buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {(mode === "current" || isBoth) && !blueprintCurrent && (
                <Btn onClick={() => handleGenerateBlueprint("current")} disabled={loading}>
                  {loading ? "Generating…" : "Generate Current State"}
                </Btn>
              )}
              {(isFuture || isBoth) && !blueprintFuture && (
                <Btn onClick={() => handleGenerateBlueprint("future")} disabled={loading || (isBoth && !blueprintCurrent)}
                  color={T.amber}>
                  {loading ? "Generating…" : isBoth && !blueprintCurrent ? "Generate Current First" : "Generate Future State"}
                </Btn>
              )}
              {blueprintCurrent && !blueprintFuture && mode === "current" && (
                <Btn variant="ghost" small onClick={() => setBlueprintCurrent("")}>Re-generate</Btn>
              )}
            </div>

            {/* Output */}
            {(stream || blueprintCurrent || blueprintFuture) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>
                    {isBoth
                      ? activeBlueprint === "future" ? "Future state blueprint" : "Current state blueprint"
                      : `${mode} state blueprint`}
                  </Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {(blueprintCurrent || blueprintFuture) && !loading && (
                      <>
                        <CopyBtn text={activeBlueprint === "future" ? blueprintFuture : blueprintCurrent} />
                        <Btn small variant="ghost"
                          onClick={() => downloadMd(
                            activeBlueprint === "future" ? blueprintFuture : blueprintCurrent,
                            `blueprint-${activeBlueprint}-state.md`
                          )}>↓ .md</Btn>
                      </>
                    )}
                  </div>
                </div>
                <OutputBlock
                  content={loading ? stream : (activeBlueprint === "future" ? blueprintFuture : blueprintCurrent) || stream}
                  streaming={loading}
                  maxH={500}
                />
              </div>
            )}

            {/* Re-generate regenerated states */}
            {!loading && blueprintCurrent && mode !== "current" && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <Btn variant="ghost" small onClick={() => { setBlueprintCurrent(""); setActiveBlueprint("current"); }}>
                  Re-gen Current
                </Btn>
                {blueprintFuture && (
                  <Btn variant="ghost" small onClick={() => { setBlueprintFuture(""); setActiveBlueprint("future"); }}>
                    Re-gen Future
                  </Btn>
                )}
              </div>
            )}

            {/* Continue */}
            {!loading && (blueprintCurrent || blueprintFuture) &&
              ((mode === "current" && blueprintCurrent) ||
               (isFuture && blueprintFuture) ||
               (isBoth && blueprintCurrent && blueprintFuture)) && (
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <Btn color={accentColor} onClick={finishBlueprint}>Generate Handoff →</Btn>
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Handoff ── */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Define Handoff"
              desc="A structured summary that carries the blueprint's key findings into the Define phase — paste it as the first message when opening Define."
              color={accentColor} />

            {!handoff && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleGenerateHandoff} disabled={loading} color={accentColor}>
                  {loading ? "Generating…" : "Generate Handoff Block"}
                </Btn>
              </div>
            )}

            {(stream || handoff) && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Discover → Define handoff block</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {handoff && !loading && (
                      <>
                        <CopyBtn text={handoff} />
                        <Btn small variant="ghost" onClick={() => downloadMd(handoff, "handoff-discover-define.md")}>↓ .md</Btn>
                      </>
                    )}
                  </div>
                </div>
                <OutputBlock content={loading ? stream : handoff} streaming={loading} maxH={500} />

                {handoff && !loading && (
                  <div style={{
                    marginTop: 20, padding: "14px 16px",
                    background: T.discoverDim, border: `1px solid ${T.discoverBorder}`,
                    borderRadius: 8,
                  }}>
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase", color: T.discover,
                    }}>
                      ✓ Blueprint complete — copy handoff block and paste it as the first message in Define
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
