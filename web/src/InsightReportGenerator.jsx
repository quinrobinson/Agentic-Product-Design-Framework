import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  validate: "#EF4444", validateDim: "rgba(239,68,68,0.12)", validateBorder: "rgba(239,68,68,0.25)",
};

const STEPS = [
  { id: 1, label: "Input",      short: "Synthesis + decision"     },
  { id: 2, label: "Report",     short: "Full findings report"     },
  { id: 3, label: "Audiences",  short: "Stakeholder versions"     },
  { id: 4, label: "Iteration",  short: "What to fix next"         },
];

const AUDIENCES = [
  { id: "exec", label: "Executive", desc: "1-page summary — decision + business impact", icon: "🎯" },
  { id: "pm", label: "Product Manager", desc: "Assumption validation + roadmap impact", icon: "📋" },
  { id: "eng", label: "Engineering", desc: "Specific changes — component names, no narrative", icon: "⚙️" },
  { id: "design", label: "Design Team", desc: "Full debrief — mental models, behavioral detail", icon: "✏️" },
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

function Textarea({ value, onChange, placeholder, rows = 6, disabled }) {
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

function OutputBlock({ content, streaming, maxH = 500 }) {
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

export default function InsightReportGenerator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [activeAudience, setActiveAudience] = useState(null);
  const [streamingAudience, setStreamingAudience] = useState(null);

  const [prototype, setPrototype] = useState("");
  const [participants, setParticipants] = useState("5");
  const [synthesis, setSynthesis] = useState("");
  const [decision, setDecision] = useState("");
  const [protoQuestions, setProtoQuestions] = useState("");

  const [report, setReport] = useState("");
  const [audienceVersions, setAudienceVersions] = useState({});
  const [iterationBrief, setIterationBrief] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleReport() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX researcher writing a usability test findings report. Every finding must be specific and observable — no vague generalities. Every Critical and Major finding needs a participant count and a direct quote. Separate findings (what happened) from recommendations (what to do about it). This report must be specific enough to act on.",
      `Generate a complete usability test findings report.

Prototype: ${prototype}
Participants: ${participants}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
Prototype questions: ${protoQuestions}

Findings synthesis + decision:
${synthesis}
${decision}

## Executive Summary
3–5 sentences: what was tested, with whom, the single most important finding, and the decision.

## Test Setup
- Prototype: [name + fidelity]
- Participants: ${participants} — [brief segment description]
- Tasks: [list]
- Prototype questions: [list]

## Answers to Prototype Questions
For each question:
**Q[N]: [Question]**
Answer: Yes / No / Partial
Evidence: [N of ${participants} participants + key observation]
Confidence: High / Medium / Low
Representative quote: "[verbatim]" — P[N]

## Critical Findings (task failures — fix before next test)
For each Critical finding:

### Finding [N]: [Title — 5–8 words describing the problem]
**Observation:** [What users did — specific, observable]
"[Representative direct quote]" — P[N]
**Frequency:** [N] of ${participants} participants
**Severity:** Critical
**Why it matters:** [What this means for task completion]
**Recommendation:** [Specific change — not "improve X" but "change X to Y because Z"]

## Major Findings (significant friction — fix in next iteration)
[Same format, less detail]

## What Worked (don't change these)
For each success:
- **[Element]:** [N] of ${participants} participants [what they did successfully] — preserve this.

## Decision: [Proceed / Iterate / Return to ideation]
[2–3 sentences of rationale]

## Recommended Next Steps (ordered by priority)
1. [Specific action — who owns it]
2. [Action]
3. [Action]`,
      setStream
    );
    setReport(result); setLoading(false); mark(2);
  }

  async function handleAudience(audienceId) {
    setActiveAudience(audienceId);
    setStreamingAudience(audienceId);

    const prompts = {
      exec: `Reframe this findings report as a 1-page executive summary.

Format:
**The test:** [one sentence — what and with whom]
**Key finding:** [one sentence — the most important thing learned]  
**Business implication:** [one sentence — what this means for product success or timeline]
**Decision:** [Proceed / Iterate / Return to ideation]
**What we need:** [one sentence — the specific approval or input required]

No methodology. No minor findings. No design specifics. Decision and business impact only.

Report:`,
      pm: `Reframe this for the product manager. 10-minute readout format.

**What we tested:** [prototype + questions]
**Assumptions validated:** [list each with Yes/No/Partial + evidence]
**Assumptions invalidated:** [list with evidence — these affect the roadmap]
**Scope impact of required changes:** High / Medium / Low — [brief rationale]
**Recommendation:** [Proceed / Iterate / Reprioritize]
**Minimum changes before shipping:** [numbered list]
**Timeline impact:** [honest estimate]

Report:`,
      eng: `Reframe for the engineering lead. Structured list — no narrative.

**Critical changes (blocks ship):**
For each:
- Component/screen: [exact name]
- Current: [what it does now]
- Required: [what it must do]
- User impact: [what fails without this]

**Major changes (significant friction):**
[Same format, briefer]

**No changes needed (tested well):**
[List — prevents unnecessary churn]

**Questions for engineering:**
[Anything with architectural implications]

Report:`,
      design: `Reframe for the design team who will do the iteration. Full debrief — they need the behavioral detail.

**Mental model findings:**
[Vocabulary users used, expectations brought, analogies made]

**Critical failures — with behavioral root cause:**
For each: what we observed → why it happened (mental model / IA / copy / interaction) → direct quotes → what the design should do differently

**What worked and why:**
[Be as specific as failures — explain the design decision that produced the success]

**Surprising observations:**
[Things users did that weren't predicted]

**Open questions:**
[What this test raised that remains unknown — inputs for the next round]

Report:`,
    };

    const result = await callClaude(
      "You are a senior UX researcher translating findings for different stakeholder audiences. Match the depth, format, and terminology to the audience. Engineering gets components. Executives get decisions and risk. Design teams get behavioral detail.",
      `${prompts[audienceId]}
${report}

Prototype questions: ${protoQuestions}`,
      (chunk) => {
        setAudienceVersions(prev => ({ ...prev, [audienceId]: chunk }));
      }
    );
    setAudienceVersions(prev => ({ ...prev, [audienceId]: result }));
    setStreamingAudience(null);
  }

  async function handleIterationBrief() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer converting test findings into a precise iteration brief. Be specific enough that a wireframer can start without asking questions. Explicitly protect what worked — over-iteration wastes as much time as under-iteration.",
      `Generate an iteration brief from these usability test findings.

Report:
${report}

Decision:
${decision}

## Iteration Brief

### Why we're iterating
[1–2 sentences: which finding drove the iterate decision]

---

### PRESERVE — Do not change (tested well)
| Element | Evidence | Why it matters |
|---|---|---|
| [Component/copy/interaction] | [N/${participants} users succeeded] | [What this accomplishes] |

---

### CHANGE — Required fixes

#### Tier 1 (fix before next test — affects prototype questions)
| # | Element | Change required | Evidence | Effort |
|---|---|---|---|---|
| 1 | [Specific] | [What to do differently] | [N/${participants} + finding] | [~hours] |

#### Tier 2 (fix in this iteration, don't re-test)
| # | Element | Change required |
|---|---|---|

#### Tier 3 (defer)
- [Change] — defer because: [reason]

---

### Next prototype questions
1. [Does the fix work? — linked to Tier 1 change]
2. [Remaining question from this round]

### What's stable (doesn't need re-testing)
[Elements validated in this round]

### Estimated iteration effort
Tier 1: [N hours] | Tier 2: [N hours] | Target date: [N days from now]`,
      setStream
    );
    setIterationBrief(result); setLoading(false); mark(4);
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
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Insight Report Generator</span>
        </div>
        {report && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>report ready</span>}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Input ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Synthesis Input"
              desc="Paste the findings synthesis and go/no-go decision from the Findings Synthesizer — or from your own notes. Claude generates the full report from this input." />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Prototype name</Label>
                  <Input value={prototype} onChange={setPrototype} placeholder="e.g. Research Synthesis — mid-fi prototype v1" />
                </div>
                <div>
                  <Label>Number of participants</Label>
                  <Input value={participants} onChange={setParticipants} placeholder="5" />
                </div>
              </div>
              <div>
                <Label>Prototype questions</Label>
                <Textarea value={protoQuestions} onChange={setProtoQuestions} rows={3}
                  placeholder={"1. Can users upload and process a file without assistance?\n2. Do users understand what 'synthesis' means in this product?\n3. Can users find and share results within 3 minutes?"} />
              </div>
              <div>
                <Label>Findings synthesis (from Findings Synthesizer or your notes)</Label>
                <Textarea value={synthesis} onChange={setSynthesis} rows={10}
                  placeholder="Paste the findings synthesis here — issue list, prototype question answers, what worked, patterns across sessions." />
              </div>
              <div>
                <Label>Go / No-Go decision</Label>
                <Textarea value={decision} onChange={setDecision} rows={4}
                  placeholder="Paste the decision and rationale — proceed / iterate / return to ideation, with the reasoning." />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!synthesis.trim() || !prototype.trim()} onClick={() => { mark(1); setStep(2); }}>Generate Report →</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Report ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Full Findings Report"
              desc="Complete report with executive summary, prototype question answers, critical and major findings (each with participant count + direct quote + specific recommendation), and what worked." />
            {!report && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleReport} disabled={loading}>{loading ? "Generating…" : "Generate Full Report"}</Btn></div>}
            {(stream || report) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Complete findings report</Label>
                  {report && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={report} />
                      <Btn small variant="ghost" onClick={() => dl(report, "findings-report.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : report} streaming={loading} maxH={560} />
                {report && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setReport(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => { mark(2); setStep(3); }}>Audience Versions →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Audience versions ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Stakeholder Versions"
              desc="The same findings — reframed for four different audiences. Each gets the depth, terminology, and decision framing they actually need." />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginBottom: 24 }}>
              {AUDIENCES.map(a => {
                const hasResult = !!audienceVersions[a.id];
                const isRunning = streamingAudience === a.id;
                return (
                  <div key={a.id} style={{ background: hasResult ? T.validateDim : T.surface, border: `1px solid ${hasResult ? T.validateBorder : T.border}`, borderRadius: 10, padding: "16px 18px", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.label}</div>
                        </div>
                      </div>
                      {hasResult && <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.validate, background: T.validateDim, border: `1px solid ${T.validateBorder}`, padding: "2px 7px", borderRadius: 4 }}>✓ Done</span>}
                    </div>
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: 12 }}>{a.desc}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small disabled={streamingAudience !== null} onClick={() => handleAudience(a.id)}>
                        {isRunning ? "Generating…" : hasResult ? "Re-generate" : "Generate"}
                      </Btn>
                      {hasResult && <CopyBtn text={audienceVersions[a.id]} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active audience output */}
            {activeAudience && audienceVersions[activeAudience] && (
              <div style={{ marginBottom: 20 }}>
                <Label sub>{AUDIENCES.find(a => a.id === activeAudience)?.label} version</Label>
                <OutputBlock content={audienceVersions[activeAudience]} streaming={streamingAudience === activeAudience} maxH={400} />
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" small onClick={() => setStep(2)}>← Back</Btn>
              <Btn small onClick={() => { mark(3); setStep(4); }}>Build Iteration Brief →</Btn>
            </div>
          </div>
        )}

        {/* ── Step 4: Iteration brief ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Iteration Brief"
              desc="What to change, what to preserve, and what the next prototype must answer — so the next design cycle starts with a scope, not a blank page." />
            {!iterationBrief && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleIterationBrief} disabled={loading}>{loading ? "Building…" : "Generate Iteration Brief"}</Btn></div>}
            {(stream || iterationBrief) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>PRESERVE · CHANGE tiers · next prototype questions</Label>
                  {iterationBrief && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={iterationBrief} />
                      <Btn small variant="ghost" onClick={() => {
                        const all = [report, ...Object.values(audienceVersions), iterationBrief].filter(Boolean).join("\n\n---\n\n");
                        dl(all, "validate-complete.md");
                      }}>↓ Full package .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : iterationBrief} streaming={loading} maxH={520} />
                {iterationBrief && !loading && (
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.validateDim, border: `1px solid ${T.validateBorder}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.validate }}>
                      ✓ Validate phase complete — share report with stakeholders, then start next Prototype cycle with the iteration brief
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
