import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  validate: "#EF4444", validateDim: "rgba(239,68,68,0.12)", validateBorder: "rgba(239,68,68,0.25)",
};

const STEPS = [
  { id: 1, label: "Setup",     short: "Tasks + questions"         },
  { id: 2, label: "Sessions",  short: "Structure each session"    },
  { id: 3, label: "Synthesize",short: "Cross-session patterns"    },
  { id: 4, label: "Severity",  short: "Rate + prioritize"         },
  { id: 5, label: "Decision",  short: "Go / No-Go"                },
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
  return <div style={{ marginBottom: sub ? 4 : 8 }}><span style={{ fontSize: sub ? 11 : 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: sub ? T.muted : T.validate }}>{children}</span></div>;
}

function Textarea({ value, onChange, placeholder, rows = 5, disabled }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", color: T.text, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", opacity: disabled ? 0.5 : 1, transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.validate} onBlur={e => e.target.style.borderColor = T.border} />;
}

function Input({ value, onChange, placeholder, disabled }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", opacity: disabled ? 0.5 : 1 }} onFocus={e => e.target.style.borderColor = T.validate} onBlur={e => e.target.style.borderColor = T.border} />;
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const p = variant === "primary";
  return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "7px 14px" : "10px 20px", fontSize: small ? 11 : 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 6, border: "1.5px solid", borderColor: p ? T.validate : T.border, background: p ? T.validate : "transparent", color: p ? "#fff" : T.muted, opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }} onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }} onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}>{children}</button>;
}

function CopyBtn({ text }) {
  const [c, setC] = useState(false);
  return <Btn small variant="ghost" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1800); }}>{c ? "✓ Copied" : "Copy"}</Btn>;
}

function OutputBlock({ content, streaming, maxH = 480 }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 18px", fontSize: 13, lineHeight: 1.7, color: T.text, fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: maxH, overflowY: "auto" }}>
      {content || <span style={{ color: T.dim, fontStyle: "italic" }}>Output will appear here…</span>}
      {streaming && <span style={{ display: "inline-block", width: 6, height: 14, background: T.validate, marginLeft: 2, animation: "blink 0.8s step-end infinite", verticalAlign: "middle" }} />}
    </div>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.validate, background: T.validateDim, border: `1px solid ${T.validateBorder}`, padding: "2px 8px", borderRadius: 4 }}>Step {step}</span>
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
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: done ? T.validate : active ? T.validateDim : "transparent", border: `1.5px solid ${done ? T.validate : active ? T.validate : T.border}`, color: done ? "#fff" : active ? T.validate : T.dim, transition: "all 0.2s" }}>{done ? "✓" : s.id}</div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: active ? T.validate : done ? T.muted : T.dim, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4, background: done ? T.validate : T.border, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function FindingsSynthesizer() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Setup
  const [tasks, setTasks] = useState("");
  const [protoQuestions, setProtoQuestions] = useState("");
  const [passFail, setPassFail] = useState("");
  const [sessionCount, setSessionCount] = useState("5");

  // Sessions — array of { raw, structured }
  const [sessions, setSessions] = useState([{ id: 1, raw: "", structured: "" }]);
  const [activeSession, setActiveSession] = useState(0);
  const [structuringIdx, setStructuringIdx] = useState(null);

  // Synthesis outputs
  const [synthesis, setSynthesis] = useState("");
  const [severity, setSeverity] = useState("");
  const [decision, setDecision] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function addSession() {
    setSessions(prev => [...prev, { id: prev.length + 1, raw: "", structured: "" }]);
  }

  function updateSession(idx, field, value) {
    setSessions(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }

  async function structureSession(idx) {
    const session = sessions[idx];
    if (!session.raw.trim()) return;
    setStructuringIdx(idx);
    const result = await callClaude(
      "You are a UX researcher organizing usability test session notes. Be systematic. Capture exact quotes verbatim — never paraphrase. Mark any inference with [inferred]. Use participant codes like P1, P2 — never real names.",
      `Structure these raw usability test session notes into a consistent format.

Tasks tested:
${tasks}

Raw session notes (Participant ${idx + 1}):
${session.raw}

Format as:

## Session P${idx + 1}

### Task completions
For each task:
- Task: [task name]
- Completion: Completed without help / Completed with prompting / Failed / Abandoned
- Time on task: [approximate]

### Key observations (per task)
- [Specific behavior — what they did, not interpretation]
- [Workaround or unexpected path taken]
- [Moment of hesitation or confusion — with timestamp if available]

### Direct quotes (verbatim — preserve exact wording)
- "[Quote]" — [which task]
- "[Quote]" — [which task]

### Friction points
- [Screen/element where friction occurred] — [what happened]

### Mental model notes
- [Vocabulary they used for product concepts]
- [Analogies or comparisons they made]
- [Expectations that were violated]

### Overall impression
"[Their most revealing debrief quote]"`,
      (chunk) => {
        setSessions(prev => prev.map((s, i) => i === idx ? { ...s, structured: chunk } : s));
      }
    );
    setSessions(prev => prev.map((s, i) => i === idx ? { ...s, structured: result } : s));
    setStructuringIdx(null);
  }

  const allStructured = sessions.map(s => s.structured).filter(Boolean).join("\n\n---\n\n");

  async function handleSynthesize() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX researcher synthesizing usability test findings. Be specific — cite participant codes and quote directly. Every finding must be grounded in observed behavior. Interpretations must be clearly labeled as such.",
      `Synthesize these ${sessions.length} usability test sessions into structured findings.

Tasks tested:
${tasks}

Prototype questions:
${protoQuestions}

All structured sessions:
${allStructured}

For each prototype question:

## Prototype Question [N]: [restate the question]

**What users did:** [observable behaviors — cite participants: "P1 and P3 navigated to…"]
**Success rate:** [N of ${sessions.length} participants completed successfully]
**Where they struggled:** [specific moments — with participant codes]
**Key quotes:** "[verbatim quote]" — P[N]
**Unexpected behaviors:** [anything not predicted]
**Answer:** Yes / No / Partial — [one sentence explanation]
**Confidence:** High (4-5 consistent) / Medium (3 consistent) / Low (mixed results)

---

After all questions, list every distinct usability issue observed:

## Issue List

| # | Issue | Task | Participants | Quote |
|---|---|---|---|---|
| 1 | [Specific, observable] | [Task name] | P[N], P[N] | "[quote]" |

---

## What Worked (don't change these)
| Element | Evidence | Participants |
|---|---|---|
| [What succeeded] | [How we know] | [N of ${sessions.length}] |`,
      setStream
    );
    setSynthesis(result); setLoading(false); mark(3);
  }

  async function handleSeverity() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX researcher rating usability issues by severity. Be consistent: Critical = task failure or abandonment. Major = significant friction, user recovers. Minor = noticeable, low impact. Cosmetic = preference only. Rank by severity first, then frequency.",
      `Rate every usability issue from this synthesis by severity and frequency.

Sessions: ${sessions.length} participants
Tasks: ${tasks}

Issues:
${synthesis}

For each issue, produce:

## Severity-Rated Issue List

| Priority | Issue | Severity | Frequency | Impact on prototype question | Fix required before |
|---|---|---|---|---|---|
| 1 | [Issue] | Critical | [N]/${sessions.length} | [which question] | Next test |
| 2 | [Issue] | Major | [N]/${sessions.length} | [which question] | Next iteration |

Severity definitions:
- Critical: prevents task completion or would cause abandonment in real use
- Major: significant friction or error, user eventually recovers
- Minor: noticeable, low impact on completion
- Cosmetic: preference or polish only

## Prioritized Fix List

### Fix before next test (Critical)
1. [Issue] — [specific change needed] — [effort: hours]

### Fix in next iteration (Major)
1. [Issue] — [specific change needed]

### Defer (Minor + Cosmetic)
1. [Issue] — [when to address]`,
      setStream
    );
    setSeverity(result); setLoading(false); mark(4);
  }

  async function handleDecision() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer making a go/no-go recommendation. Be direct. The recommendation must follow from the evidence — not from how much work the team wants to do.",
      `Generate a go/no-go assessment for this usability test.

Sessions: ${sessions.length} participants
Pass/fail criteria (defined before testing):
${passFail || "Not specified — assess based on severity of findings"}

Synthesis:
${synthesis}

Severity ratings:
${severity}

Produce:

## Go / No-Go Assessment

### Prototype questions answered
| Question | Answer | Evidence | Confidence |
|---|---|---|---|
| [Question] | Yes / No / Partial | [key supporting observation] | High/Med/Low |

### Pass/fail criteria results
For each criterion (if defined):
- Criterion: [restate]
- Result: Pass / Fail / Partial
- Evidence: [specific observation]

### Recommendation
**Decision: [Proceed to hi-fi / Iterate and re-test / Return to ideation]**

Rationale (2–3 sentences): [Which findings drive this recommendation. Be specific.]

### If iterating — minimum changes before next test
1. [Change] — [why it's blocking]
2. [Change] — [why it's blocking]

### If returning to ideation — what fundamental assumption failed
[The assumption that this test invalidated — and what that means for the concept]

### What to preserve regardless of decision
[Elements that tested well — don't change these in the next cycle]`,
      setStream
    );
    setDecision(result); setLoading(false); mark(5);
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.validate, boxShadow: `0 0 8px ${T.validate}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.validate }}>05 — Validate</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Findings Synthesizer</span>
        </div>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
          {sessions.filter(s => s.structured).length} of {sessions.length} sessions structured
        </span>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Setup ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Test Setup"
              desc="Define the tasks, prototype questions, and pass/fail criteria before structuring session notes. These shape how synthesis is interpreted." />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label>Tasks tested (one per line)</Label>
                <Textarea value={tasks} onChange={setTasks} rows={4}
                  placeholder={"Task 1: Upload a file and start a synthesis\nTask 2: Find and share results with a colleague\nTask 3: Export findings to Notion"} />
              </div>
              <div>
                <Label>Prototype questions (the 3 questions this test must answer)</Label>
                <Textarea value={protoQuestions} onChange={setProtoQuestions} rows={4}
                  placeholder={"1. Can users upload and process a file without assistance?\n2. Do users understand what 'synthesis' means in this product?\n3. Can users find and share results within 3 minutes?"} />
              </div>
              <div>
                <Label>Pass/fail criteria (from prototype-scoping.md — optional)</Label>
                <Textarea value={passFail} onChange={setPassFail} rows={3}
                  placeholder={"Proceed if: 4 of 5 users complete Task 1 without prompting\nIterate if: fewer than 3 complete Task 1\nReturn to ideation if: users don't understand the core concept after seeing it"} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Label sub>Number of sessions</Label>
                <select value={sessionCount} onChange={e => {
                  const n = parseInt(e.target.value);
                  setSessionCount(e.target.value);
                  const current = sessions.length;
                  if (n > current) {
                    setSessions(prev => [...prev, ...Array.from({ length: n - current }, (_, i) => ({ id: current + i + 1, raw: "", structured: "" }))]);
                  } else {
                    setSessions(prev => prev.slice(0, n));
                  }
                }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 12px", color: T.text, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", cursor: "pointer" }}>
                  {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} sessions</option>)}
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!tasks.trim() || !protoQuestions.trim()} onClick={() => { mark(1); setStep(2); }}>
                  Structure Sessions →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Sessions ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Structure Each Session"
              desc="Paste raw notes for each participant. Claude structures them into a consistent format — completions, observations, quotes, friction points, mental model notes." />

            {/* Session tabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
              {sessions.map((s, i) => (
                <button key={s.id} onClick={() => setActiveSession(i)} style={{
                  padding: "7px 14px", background: "none", border: "none",
                  borderBottom: `2px solid ${activeSession === i ? T.validate : "transparent"}`,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: activeSession === i ? T.validate : T.dim,
                  cursor: "pointer", marginBottom: -1, transition: "all 0.15s",
                }}>
                  P{s.id} {s.structured ? "✓" : ""}
                </button>
              ))}
            </div>

            {sessions[activeSession] && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label sub>Raw notes — Participant {sessions[activeSession].id}</Label>
                  <Textarea value={sessions[activeSession].raw} onChange={v => updateSession(activeSession, "raw", v)} rows={14}
                    placeholder="Paste raw session notes — anything goes. Stream of consciousness, timestamps, partial quotes, observations. Claude will structure it." />
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                    <Btn small disabled={!sessions[activeSession].raw.trim() || structuringIdx === activeSession}
                      onClick={() => structureSession(activeSession)}>
                      {structuringIdx === activeSession ? "Structuring…" : sessions[activeSession].structured ? "Re-structure" : "Structure Session"}
                    </Btn>
                  </div>
                </div>
                <div>
                  <Label sub>Structured output</Label>
                  <OutputBlock content={sessions[activeSession].structured} streaming={structuringIdx === activeSession} maxH={340} />
                  {sessions[activeSession].structured && structuringIdx !== activeSession && (
                    <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <CopyBtn text={sessions[activeSession].structured} />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <span style={{ fontSize: 12, color: T.dim, alignSelf: "center" }}>
                {sessions.filter(s => s.structured).length} of {sessions.length} sessions ready
              </span>
              <Btn small disabled={sessions.filter(s => s.structured).length < 2}
                onClick={() => { mark(2); setStep(3); }}>
                Synthesize Across Sessions →
              </Btn>
            </div>
          </div>
        )}

        {/* ── Step 3: Synthesize ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Cross-Session Synthesis"
              desc={`Claude synthesizes ${sessions.filter(s => s.structured).length} structured sessions — identifying patterns, answering prototype questions, and building the issue list.`} />
            {!synthesis && <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn onClick={handleSynthesize} disabled={loading}>{loading ? "Synthesizing…" : "Synthesize All Sessions"}</Btn>
            </div>}
            {(stream || synthesis) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Patterns · prototype question answers · issue list</Label>
                  {synthesis && !loading && <div style={{ display: "flex", gap: 8 }}><CopyBtn text={synthesis} /></div>}
                </div>
                <OutputBlock content={loading ? stream : synthesis} streaming={loading} maxH={540} />
                {synthesis && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setSynthesis(""); setStream(""); }}>Re-synthesize</Btn>
                    <Btn small onClick={() => { mark(3); setStep(4); }}>Rate Severity →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Severity ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Severity Rating"
              desc="Every issue rated Critical / Major / Minor / Cosmetic — with frequency count, prototype question impact, and a prioritized fix list." />
            {!severity && <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn onClick={handleSeverity} disabled={loading}>{loading ? "Rating…" : "Rate All Issues"}</Btn>
            </div>}
            {(stream || severity) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Priority-ranked issue list</Label>
                  {severity && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={severity} />
                      <Btn small variant="ghost" onClick={() => dl([synthesis, severity].join("\n\n---\n\n"), "findings-synthesis.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : severity} streaming={loading} maxH={500} />
                {severity && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setSeverity(""); setStream(""); }}>Re-rate</Btn>
                    <Btn small onClick={() => { mark(4); setStep(5); }}>Go / No-Go →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Decision ── */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Go / No-Go Decision"
              desc="Maps findings against prototype questions and pass/fail criteria — producing a clear recommendation: Proceed, Iterate, or Return to Ideation." />
            {!decision && <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn onClick={handleDecision} disabled={loading}>{loading ? "Assessing…" : "Generate Go / No-Go"}</Btn>
            </div>}
            {(stream || decision) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Prototype question answers · recommendation · rationale</Label>
                  {decision && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={decision} />
                      <Btn small variant="ghost" onClick={() => dl([synthesis, severity, decision].join("\n\n---\n\n"), "validate-findings-complete.md")}>↓ Full .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : decision} streaming={loading} maxH={520} />
                {decision && !loading && (
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.validateDim, border: `1px solid ${T.validateBorder}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.validate }}>
                      ✓ Synthesis complete — pass to Insight Report Generator to produce the shareable document
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
