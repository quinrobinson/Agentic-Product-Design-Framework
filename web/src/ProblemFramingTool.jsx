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
  { id: 1, label: "Context",  short: "Research + user + goal"     },
  { id: 2, label: "Frame",    short: "Three-format statements"    },
  { id: 3, label: "Test",     short: "Pressure-test the frame"    },
  { id: 4, label: "HMW",      short: "How Might We questions"     },
  { id: 5, label: "Handoff",  short: "Ideate handoff block"       },
];

// ─── API ──────────────────────────────────────────────────────────────────────
async function callClaude(system, user, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      stream: true,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
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

function OutputBlock({ content, streaming, maxH = 440 }) {
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
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 580 }}>{desc}</p>}
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
export default function ProblemFramingTool() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 — Context
  const [researchData, setResearchData] = useState("");
  const [persona, setPersona] = useState("");
  const [businessGoal, setBusinessGoal] = useState("");

  // Step 2 — Frame
  const [framings, setFramings] = useState("");
  const [chosenFraming, setChosenFraming] = useState("");

  // Step 3 — Pressure test
  const [pressureTest, setPressureTest] = useState("");

  // Step 4 — HMW
  const [hmw, setHmw] = useState("");

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

  // ── Step 2: Generate three framings ─────────────────────────────────────────
  async function handleFrame() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer and design strategist. Generate sharp, specific problem framings grounded in the research provided. Never produce generic statements. Every framing must be specific enough that a designer could sketch 10 different solutions to it.",
      `Generate the problem statement in three formats, then evaluate and recommend one.

Research context:
${researchData}

Primary user: ${persona}
Business goal: ${businessGoal}

---

## Format 1 — How Might We (HMW)
How might we [specific action] for [user] so that [concrete outcome]?

Calibration check: Can a designer imagine 10 meaningfully different solutions to this? If yes, it's well-calibrated. If no — it's either too narrow (solutions all look the same) or too abstract (no solutions come to mind).

## Format 2 — Jobs to Be Done (JTBD)
When [specific situation/trigger], I want to [motivation], so I can [concrete outcome — user progress, not product usage].

## Format 3 — User + Need + Insight
[User] needs a way to [verb/need] because [surprising insight from research — not an obvious reason].

---

## Evaluation
For each format:
- Is it specific enough to guide design?
- Does it open creative space (multiple possible solutions)?
- Is it grounded in the research provided?
- What does it exclude that might matter?

## Recommendation
Which format best balances specificity and creative space? Why? What were the two strongest alternatives you didn't recommend?`,
      setStream
    );
    setFramings(result);
    setLoading(false);
  }

  // ── Step 3: Pressure-test ────────────────────────────────────────────────────
  async function handlePressureTest() {
    if (!chosenFraming.trim()) return;
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a skeptical senior PM reviewing a problem statement. Your job is to find its weaknesses, not validate it. Be direct and specific — not encouraging.",
      `Act as a skeptical PM reviewing this problem statement. Challenge it on four fronts.

Problem statement: "${chosenFraming}"

Research context:
${researchData}

---

## Challenge 1 — Calibration
Is this too broad (any solution qualifies) or too narrow (solution is already embedded)? Give a specific example of the failure mode if present.

## Challenge 2 — Assumptions
What beliefs are baked into this framing that haven't been validated by the research? List 3–5 specific assumptions, ordered from most to least risky.

## Challenge 3 — Exclusions
What important user problems or contexts does this framing exclude that we might regret ignoring? Be specific about what gets left out.

## Challenge 4 — Alternative framings
Generate two alternative framings that would produce completely different design solutions. Explain what each one prioritizes that the original doesn't.

---

## Verdict
Based on this analysis: Proceed with this framing / Refine it / Reframe entirely?
If refine or reframe — provide the improved version.`,
      setStream
    );
    setPressureTest(result);
    setLoading(false);
    markComplete(3);
  }

  // ── Step 4: Generate HMW questions ──────────────────────────────────────────
  async function handleHMW() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior design strategist running an ideation brief. Generate HMW questions that are specific, varied in angle, and grounded in research. Never generate generic HMW questions.",
      `Generate 10 How Might We questions from this problem frame, then score and rank the top 5.

Problem statement: "${chosenFraming || framings}"

Research context:
${researchData}

Primary user: ${persona}

---

Generate 2 HMW questions per angle:

**Angle 1 — Root cause:** Address why the problem exists, not just the symptom
**Angle 2 — Emotional dimension:** Address how users feel during the problem
**Angle 3 — Constraint reframe:** Use the constraint as an asset, not a barrier
**Angle 4 — Systemic:** Address an organizational, process, or ecosystem root cause
**Angle 5 — Ambitious:** What if we eliminated the problem entirely?

For each HMW:
- Start with "How might we"
- Name a user or context
- Point toward an outcome, not a feature
- Should generate at least 5 meaningfully different solutions

---

## Scoring (top 5 only)
Score each on:
- User impact: 1–3 (how directly this improves the user's core experience)
- Design leverage: 1–3 (how much creative space this opens)
- Feasibility signal: 1–3 (realistic within typical product constraints)

Rank the top 5 by total score. Explain in one sentence why each makes the shortlist.`,
      setStream
    );
    setHmw(result);
    setLoading(false);
    markComplete(4);
    setStep(5);
  }

  // ── Step 5: Generate handoff ─────────────────────────────────────────────────
  async function handleHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer generating a structured phase handoff. Extract real content — no placeholders. Be specific and actionable.",
      `Generate a Define → Ideate Phase Handoff Block.

Problem statement: "${chosenFraming || framings}"
Research context: ${researchData}
Primary user: ${persona}
Business goal: ${businessGoal}
Pressure test findings: ${pressureTest}
HMW questions: ${hmw}

Generate using this exact structure:

## Handoff: Define → Ideate
### From: Problem Framing Tool
### Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

### What we completed
- Problem statement formats generated: 3 (HMW / JTBD / User+Need+Insight)
- Pressure-tested: Yes
- HMW questions generated: 10, top 5 selected

### Primary Problem Statement
> [The recommended framing — one sentence]

### Why this framing
[1 sentence — what it captures that alternatives don't]

### Primary User
- Who: [persona + context]
- Goal: [what they're trying to accomplish]
- Key insight: [the surprising research finding that drives this framing]

### Validated assumptions (safe to build on)
- [What research confirmed]
- [What research confirmed]

### Open assumptions (test in prototyping)
- [What's believed but unvalidated]
- [What's believed but unvalidated]

### Top 5 HMW Questions (ranked)
1. HMW [statement] — Score: [X/9]
2. HMW [statement] — Score: [X/9]
3. HMW [statement] — Score: [X/9]
4. HMW [statement] — Score: [X/9]
5. HMW [statement] — Score: [X/9]

### Scope
- In: [what to solve]
- Out: [explicitly excluded — with rationale]

### Success criteria
1. [Measurable outcome]
2. [Measurable outcome]

### Provocation for Ideate
[One "what if" that pushes ideation beyond the obvious first solution]

---
Paste this block as your first message when opening Concept Generation.`,
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
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Problem Framing</span>
        </div>
        {completed.length > 0 && (
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
            {completed.length} of {STEPS.length} steps complete
          </span>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Context ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Research Context"
              desc="Provide the research data, primary user, and business goal. The more specific the input, the more grounded the problem frame." />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <Label>Research summary</Label>
                <Textarea value={researchData} onChange={setResearchData} rows={8}
                  placeholder="Paste your Research Synthesis handoff block, key themes, pain points, or session summaries. Include direct quotes where possible — they ground the framing in real user language." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Primary user</Label>
                  <Input value={persona} onChange={setPersona}
                    placeholder="e.g. Senior product designer, 5+ years, works across 3–5 projects simultaneously" />
                </div>
                <div>
                  <Label>Business goal</Label>
                  <Input value={businessGoal} onChange={setBusinessGoal}
                    placeholder="e.g. Reduce time from research to design handoff by 40%" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={() => { markComplete(1); setStep(2); }}
                  disabled={!researchData.trim() || !persona.trim() || !businessGoal.trim()}>
                  Generate Framings →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Frame ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Generate Problem Framings"
              desc="Claude generates the problem statement in three formats — HMW, JTBD, and User + Need + Insight — then evaluates and recommends one. Select or edit the framing before pressure-testing." />

            {!framings && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleFrame} disabled={loading}>
                  {loading ? "Generating…" : "Generate Three Framings"}
                </Btn>
              </div>
            )}

            {(stream || framings) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Three problem framings + recommendation</Label>
                  {framings && !loading && <CopyBtn text={framings} />}
                </div>
                <OutputBlock content={loading ? stream : framings} streaming={loading} maxH={480} />

                {framings && !loading && (
                  <div style={{ marginTop: 20 }}>
                    <Label>Selected framing — edit or paste the recommended statement</Label>
                    <Textarea value={chosenFraming} onChange={setChosenFraming} rows={3}
                      placeholder="Paste or type the framing you want to pressure-test. You can edit it here." />
                    <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                      <Btn variant="ghost" small onClick={() => { setFramings(""); setStream(""); }}>Re-generate</Btn>
                      <Btn small onClick={() => { markComplete(2); setStep(3); }}
                        disabled={!chosenFraming.trim()}>
                        Pressure-Test →
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Pressure Test ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Pressure-Test the Frame"
              desc="Claude acts as a skeptical PM — challenging the framing on calibration, hidden assumptions, exclusions, and alternative framings. The goal is to surface weaknesses before committing." />

            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "14px 16px", marginBottom: 20,
            }}>
              <Label sub>Framing under review</Label>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{chosenFraming}"</p>
            </div>

            {!pressureTest && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handlePressureTest} disabled={loading}>
                  {loading ? "Challenging…" : "Run Pressure Test"}
                </Btn>
              </div>
            )}

            {(stream || pressureTest) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Skeptical PM review</Label>
                  {pressureTest && !loading && <CopyBtn text={pressureTest} />}
                </div>
                <OutputBlock content={loading ? stream : pressureTest} streaming={loading} maxH={500} />

                {pressureTest && !loading && (
                  <div style={{ marginTop: 14 }}>
                    <Label sub>Refine framing based on test (optional)</Label>
                    <Textarea value={chosenFraming} onChange={setChosenFraming} rows={3} />
                    <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                      <Btn variant="ghost" small onClick={() => { setPressureTest(""); setStream(""); }}>Re-test</Btn>
                      <Btn small onClick={() => { markComplete(3); setStep(4); }}>Generate HMW →</Btn>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: HMW ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="How Might We Questions"
              desc="10 HMW questions across 5 angles — root cause, emotional, constraint reframe, systemic, ambitious — scored and ranked to the top 5 for ideation." />

            {!hmw && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleHMW} disabled={loading}>
                  {loading ? "Generating…" : "Generate HMW Questions"}
                </Btn>
              </div>
            )}

            {(stream || hmw) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>10 HMW questions · top 5 ranked</Label>
                  {hmw && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={hmw} />
                      <Btn small variant="ghost" onClick={() => { setHmw(""); setStream(""); setStep(4); markComplete(4) && setCompleted(c => c.filter(x => x !== 5)); }}>Re-generate</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : hmw} streaming={loading} maxH={520} />
                {hmw && !loading && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <Btn small onClick={() => setStep(5)}>Generate Handoff →</Btn>
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
              desc="A structured summary of the problem frame — paste it as the first message when opening Concept Generation to give Claude full Define context." />

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
                        <Btn small variant="ghost" onClick={() => dl(handoff, "problem-framing-handoff.md")}>↓ .md</Btn>
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
                      ✓ Problem frame complete — handoff ready for Concept Generation
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
