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
  define: "#8B5CF6",
  defineDim: "rgba(139,92,246,0.12)",
  defineBorder: "rgba(139,92,246,0.25)",
};

const STEPS = [
  { id: 1, label: "Scenario", short: "Persona + situation"     },
  { id: 2, label: "Stages",   short: "Define journey stages"   },
  { id: 3, label: "Map",      short: "Generate six lanes"      },
  { id: 4, label: "Moments",  short: "Critical moments"        },
  { id: 5, label: "Handoff",  short: "Ideate handoff block"    },
];

const LANES = [
  { id: "actions",     label: "Actions",     desc: "What the user does — observed behaviors and workarounds" },
  { id: "thoughts",    label: "Thoughts",    desc: "What they're thinking — questions, doubts, mental models" },
  { id: "emotions",    label: "Emotions",    desc: "How they feel — emotional curve across the stage" },
  { id: "touchpoints", label: "Touchpoints", desc: "Every interface, person, or channel they interact with" },
  { id: "painpoints",  label: "Pain Points", desc: "Friction with severity rating and research citation" },
  { id: "opportunity", label: "Opportunity", desc: "Where design intervention has the most leverage" },
];

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
        fontSize: sub ? 11 : 12, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.07em", textTransform: "uppercase",
        color: sub ? T.muted : T.define,
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
      onFocus={e => e.target.style.borderColor = T.define}
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
      onFocus={e => e.target.style.borderColor = T.define}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  );
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const isPrimary = variant === "primary";
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: small ? "7px 14px" : "10px 20px",
      fontSize: small ? 11 : 13,
      fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.06em", textTransform: "uppercase",
      fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: 6, border: "1.5px solid",
      borderColor: isPrimary ? T.define : T.border,
      background: isPrimary ? T.define : "transparent",
      color: isPrimary ? "#fff" : T.muted,
      opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
    }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.target.style.opacity = "1"; }}
    >{children}</button>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn small variant="ghost" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }}>{copied ? "✓ Copied" : "Copy"}</Btn>
  );
}

function OutputBlock({ content, streaming, maxH = 480 }) {
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
        background: T.define, marginLeft: 2,
        animation: "blink 0.8s step-end infinite", verticalAlign: "middle",
      }} />}
    </div>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: T.define, background: T.defineDim,
          border: `1px solid ${T.defineBorder}`,
          padding: "2px 8px", borderRadius: 4,
        }}>Step {step}</span>
        <span style={{
          fontSize: 16, fontWeight: 600,
          fontFamily: "'DM Serif Display', serif", color: T.text,
        }}>{title}</span>
      </div>
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 600 }}>{desc}</p>}
    </div>
  );
}

function StepIndicator({ current, completed }) {
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
                fontSize: 11, fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                background: done ? T.define : active ? T.defineDim : "transparent",
                border: `1.5px solid ${done ? T.define : active ? T.define : T.border}`,
                color: done ? "#fff" : active ? T.define : T.dim,
                transition: "all 0.2s",
              }}>{done ? "✓" : step.id}</div>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: active ? T.define : done ? T.muted : T.dim,
                whiteSpace: "nowrap",
              }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4,
                background: done ? T.define : T.border, transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function JourneyMappingTool() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 — Scenario
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [trigger, setTrigger] = useState("");
  const [researchData, setResearchData] = useState("");

  // Step 2 — Stages
  const [stagesSuggested, setStagesSuggested] = useState("");
  const [stagesRaw, setStagesRaw] = useState("");
  const [stagesApproved, setStagesApproved] = useState([]);

  // Step 3 — Map
  const [journeyMap, setJourneyMap] = useState("");

  // Step 4 — Moments
  const [moments, setMoments] = useState("");

  // Step 5 — Handoff
  const [handoff, setHandoff] = useState("");

  const markComplete = (id) => setCompleted(prev => [...new Set([...prev, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Step 2: Suggest stages ───────────────────────────────────────────────────
  async function handleSuggestStages() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX researcher designing a journey map. Stage names should be specific to this user and scenario — never generic like 'Awareness → Consideration → Purchase'. Ground stage names in what actually happens in the research.",
      `Suggest 5–7 journey stage names for this scenario.

Persona: ${persona}
Goal: ${goal}
Trigger (what starts the experience): ${trigger}
Research data: ${researchData || "Not provided — infer from persona and goal"}

Rules:
- Stage names should be specific to THIS user and scenario
- Use active, descriptive phrases (e.g. "Realizes the problem exists", "Tries to make sense of the data") not generic nouns
- Each stage should be meaningfully distinct from the others
- Stages should cover start to end of the experience

Return ONLY a numbered list of stage names. No descriptions. No extra text.`,
      setStream
    );
    setStagesSuggested(result);
    setStagesRaw(result);
    setLoading(false);
  }

  function approveStages() {
    const lines = stagesRaw.split("\n").filter(l => l.trim());
    const parsed = lines.map((l, i) => ({
      id: i + 1,
      name: l.replace(/^\d+[\.\)]\s*/, "").trim(),
    })).filter(s => s.name);
    setStagesApproved(parsed);
    markComplete(2);
    setStep(3);
  }

  // ── Step 3: Generate journey map ─────────────────────────────────────────────
  async function handleGenerateMap() {
    setLoading(true); setStream("");
    const stages = stagesApproved.map(s => s.name).join(", ");
    const result = await callClaude(
      "You are a senior UX researcher generating a detailed, research-grounded journey map. Mark pain points with ⚠️ and cite research source. Mark workarounds with 🔧. Mark emotional high points with 📈 and low points with 📉. Flag anything not directly from research as [inferred] or [unknown]. Never invent data.",
      `Generate a complete journey map across all 6 lanes for each stage.

Persona: ${persona}
Goal: ${goal}
Trigger: ${trigger}
Stages: ${stages}
Research data:
${researchData}

For each stage, populate all 6 lanes:

1. **Actions** — What the user actually does (specific behaviors, not what they should do). Mark workarounds with 🔧
2. **Thoughts** — What they're thinking — questions, doubts, mental model assumptions. Use direct quotes where possible.
3. **Emotions** 📈/📉 — Emotional state and intensity. What specifically drives it. Show the curve rising and falling.
4. **Touchpoints** — Every interface, person, channel, or tool they interact with at this stage.
5. **Pain Points** ⚠️ — Table format: | Pain | Severity (Critical/Major/Minor) | Source (session ref or [inferred]) |
6. **Opportunities** — Leave for Step 4. Mark as [TBD — generated after critical moments analysis]

Use this structure per stage:

## Stage [N]: [Name]

**Actions**
[content]

**Thoughts**
[content]

**Emotions** [📈/📉]
[content]

**Touchpoints**
[content]

**Pain Points** ⚠️
| Pain | Severity | Source |
|---|---|---|
| [pain] | [level] | [ref] |

**Opportunities**
[TBD — generated after critical moments analysis]

---

After all stages, add:

## Emotional Arc Summary
Brief narrative (2–3 sentences) describing the shape of the emotional journey — where it starts, where it bottoms out, and whether/where it recovers.`,
      setStream
    );
    setJourneyMap(result);
    setLoading(false);
    markComplete(3);
    setStep(4);
  }

  // ── Step 4: Critical moments ─────────────────────────────────────────────────
  async function handleMoments() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX strategist synthesizing a journey map into design priorities. Be specific — cite stages and research evidence. Generate opportunities as HMW questions, not feature ideas.",
      `Analyze this journey map and identify critical moments, then generate design opportunities.

Journey map:
${journeyMap}

Persona: ${persona}
Goal: ${goal}

## Part 1 — Critical Moments

### Moment of Highest Friction
- Stage: [which stage]
- What happens: [specific description]
- Evidence: [research citations from the map]
- Design implication: [what ideation needs to address here]

### Moment of Highest Opportunity
- Stage: [which stage]
- What happens: [where design intervention creates the most user value]
- Evidence: [research citations]
- Design implication: [where to focus creative energy]

### Moment of Truth
- Stage: [which stage]
- The decision: [what the user decides — commit or abandon — and what makes the difference]
- Evidence: [research citations]
- Design implication: [what must be true here for the user to continue]

### Systemic Gap (if present)
- Stage: [which stage]
- What happens: [disconnect between frontstage experience and backstage cause]
- Evidence: [research citations]
- Design implication: [organizational or process change required, not just UI]

---

## Part 2 — Top 8 Opportunities

Generate 8 design opportunities as HMW questions. Each must:
- Start with "How might we"
- Reference a specific stage or pain point from the map
- Point toward a user outcome, not a feature
- Generate at least 5 meaningfully different solutions

Then rank by design leverage:
- **High** — addresses a critical moment or systemic gap
- **Medium** — addresses a major pain point
- **Low** — addresses a minor friction

Select the top 3 highest-leverage opportunities. Explain in one sentence each why they make the shortlist.`,
      setStream
    );
    setMoments(result);
    setLoading(false);
    markComplete(4);
    setStep(5);
  }

  // ── Step 5: Generate handoff ─────────────────────────────────────────────────
  async function handleHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer generating a structured phase handoff. Extract real content — no placeholders. Be specific and actionable.",
      `Generate a Define → Ideate Phase Handoff Block from this journey map.

Persona: ${persona}
Goal: ${goal}
Trigger: ${trigger}
Stages: ${stagesApproved.map(s => s.name).join(", ")}

Journey map:
${journeyMap}

Critical moments:
${moments}

Use this exact structure:

## Handoff: Define → Ideate
### From: Journey Mapping Tool
### Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

### What we completed
- Scenario: ${persona} — ${goal}
- Stages mapped: ${stagesApproved.length} (${stagesApproved.map(s => s.name).join(", ")})
- Research basis: [summarize research coverage]
- Critical moments identified: Yes

### Persona
- Who: [name + context]
- Goal: [what they're trying to accomplish]
- Trigger: ${trigger}

### Moment of highest friction
- Stage: [name]
- What happens: [one sentence]
- Design implication: [what ideation must address]

### Moment of highest opportunity
- Stage: [name]
- What happens: [one sentence]
- Design implication: [where to focus creative energy]

### Moment of truth
- Stage: [name]
- The decision: [what makes the user commit or abandon]

### Top 3 opportunities (ranked by design leverage)
1. HMW [statement] — Leverage: High
2. HMW [statement] — Leverage: High/Medium
3. HMW [statement] — Leverage: Medium

### Emotional arc
[2–3 sentence narrative — where it starts, where it breaks down, where it recovers]

### Open questions for Ideate
- [What the map surfaced but couldn't resolve]
- [Moments marked [unknown] that need more research]
- [Systemic gaps that may require organizational change]

---
Combine with Problem Framing handoff when opening Concept Generation.`,
      setStream
    );
    setHandoff(result);
    setLoading(false);
    markComplete(5);
  }

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        :focus-visible { outline: 2px solid #999; outline-offset: 2px; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        padding: "0 clamp(24px,5vw,80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.define, boxShadow: `0 0 8px ${T.define}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.define }}>02 — Define</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Journey Mapping</span>
        </div>
        {stagesApproved.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {stagesApproved.map(s => (
              <span key={s.id} style={{
                fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.05em", padding: "2px 8px", borderRadius: 20,
                background: T.defineDim, border: `1px solid ${T.defineBorder}`,
                color: T.define,
              }}>{s.id}. {s.name}</span>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Scenario ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Scenario Setup"
              desc="One journey map = one persona + one goal + one context. Lock the scenario before generating anything." />

            {/* Lane reference */}
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "16px 20px", marginBottom: 24,
            }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>Six lanes — every journey map</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {LANES.map(lane => (
                  <div key={lane.id} style={{ padding: "8px 12px", background: T.card, borderRadius: 6, border: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: T.text, marginBottom: 3 }}>{lane.label}</div>
                    <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.4 }}>{lane.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Persona</Label>
                  <Input value={persona} onChange={setPersona} placeholder="e.g. Senior Product Designer — 5+ yrs, multi-project context" />
                </div>
                <div>
                  <Label>Their goal in this scenario</Label>
                  <Input value={goal} onChange={setGoal} placeholder="e.g. Synthesize 8 interviews into a shareable brief" />
                </div>
              </div>
              <div>
                <Label>Trigger — what starts this experience</Label>
                <Input value={trigger} onChange={setTrigger} placeholder="e.g. Finishes conducting the last user interview" />
              </div>
              <div>
                <Label>Research data (paste session summaries, themes, or pain points)</Label>
                <Textarea value={researchData} onChange={setResearchData} rows={7}
                  placeholder="Paste research synthesis outputs — themes, pain points, session summaries, direct quotes. The more grounded the input, the more accurate the map." />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={() => { markComplete(1); setStep(2); }}
                  disabled={!persona.trim() || !goal.trim()}>
                  Define Stages →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Stages ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Define Journey Stages"
              desc="Stages are the backbone of the map. Get Claude to suggest them from your research, then edit before confirming. Aim for 5–7 specific, descriptive stage names." />

            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "14px 16px", marginBottom: 20,
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <span style={{ fontSize: 18 }}>👤</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{persona}</span>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{goal}</div>
                {trigger && <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>Starts: {trigger}</div>}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn variant="ghost" small onClick={handleSuggestStages} disabled={loading}>
                  {loading ? "Suggesting…" : "Suggest Stages from Research"}
                </Btn>
              </div>

              {(stream || stagesSuggested) && !stagesApproved.length && (
                <OutputBlock content={stream} streaming={loading} maxH={180} />
              )}

              <div>
                <Label>Stages — edit or write your own (one per line, numbered)</Label>
                <Textarea value={stagesRaw} onChange={setStagesRaw} rows={8}
                  placeholder={"1. Realizes the backlog is unmanageable\n2. Tries to prioritize manually\n3. Looks for a pattern across tickets\n4. Gets stuck on conflicting priorities\n5. Escalates to PM for guidance\n6. Commits to a scope"}
                  disabled={loading} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!stagesRaw.trim() || loading} onClick={approveStages}>
                  Confirm Stages →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Map ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Generate Journey Map"
              desc={`Claude populates all 6 lanes across ${stagesApproved.length} stages using your research data. Pain points are cited and severity-rated. Workarounds are flagged. Opportunities are held for the next step.`} />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {stagesApproved.map(s => (
                <span key={s.id} style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em",
                  background: T.defineDim, border: `1px solid ${T.defineBorder}`, color: T.define,
                }}>{s.id}. {s.name}</span>
              ))}
            </div>

            {!journeyMap && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleGenerateMap} disabled={loading}>
                  {loading ? "Mapping…" : `Generate ${stagesApproved.length}-Stage Journey Map`}
                </Btn>
              </div>
            )}

            {(stream || journeyMap) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Journey map — all 6 lanes</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {journeyMap && !loading && (
                      <>
                        <CopyBtn text={journeyMap} />
                        <Btn small variant="ghost" onClick={() => dl(journeyMap, "journey-map.md")}>↓ .md</Btn>
                      </>
                    )}
                  </div>
                </div>
                <OutputBlock content={loading ? stream : journeyMap} streaming={loading} maxH={560} />
                {journeyMap && !loading && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setJourneyMap(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => setStep(4)}>Identify Critical Moments →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Moments ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Critical Moments + Opportunities"
              desc="Claude identifies the four critical moments — friction, opportunity, truth, systemic gap — then generates 8 HMW opportunities ranked by design leverage." />

            {!moments && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleMoments} disabled={loading}>
                  {loading ? "Analyzing…" : "Identify Critical Moments"}
                </Btn>
              </div>
            )}

            {(stream || moments) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Critical moments · top 3 opportunities</Label>
                  {moments && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={moments} />
                      <Btn small variant="ghost" onClick={() => { setMoments(""); setStream(""); }}>Re-analyze</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : moments} streaming={loading} maxH={520} />
                {moments && !loading && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <Btn small onClick={() => { markComplete(4); setStep(5); }}>Generate Handoff →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Handoff ── */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Ideate Handoff"
              desc="A structured summary of the journey map — paste it alongside the Problem Framing handoff when opening Concept Generation." />

            {!handoff && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleHandoff} disabled={loading}>
                  {loading ? "Generating…" : "Generate Handoff Block"}
                </Btn>
              </div>
            )}

            {(stream || handoff) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Define → Ideate handoff block</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {handoff && !loading && (
                      <>
                        <CopyBtn text={handoff} />
                        <Btn small variant="ghost" onClick={() => dl(handoff, "journey-map-handoff.md")}>↓ .md</Btn>
                      </>
                    )}
                  </div>
                </div>
                <OutputBlock content={loading ? stream : handoff} streaming={loading} maxH={520} />
                {handoff && !loading && (
                  <div style={{
                    marginTop: 20, padding: "14px 16px",
                    background: T.defineDim, border: `1px solid ${T.defineBorder}`,
                    borderRadius: 8,
                  }}>
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase", color: T.define,
                    }}>
                      ✓ Journey map complete — combine handoff with Problem Framing when opening Concept Generation
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
