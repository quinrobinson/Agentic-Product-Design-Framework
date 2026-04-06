import { useState, useRef } from "react";

// ─── Design tokens (aligned to SDS) ─────────────────────────────────────────
const T = {
  bg: "#0F0F0F",
  surface: "#161616",
  card: "#1C1C1C",
  border: "#2A2A2A",
  borderHover: "#3A3A3A",
  text: "#F2F2F2",
  muted: "#999999",
  dim: "#666666",
  discover: "#22C55E",
  discoverDim: "rgba(34,197,94,0.12)",
  discoverBorder: "rgba(34,197,94,0.25)",
  white: "#FFFFFF",
  error: "#EF4444",
  errorDim: "rgba(239,68,68,0.1)",
};

const STEPS = [
  { id: 1, label: "Setup",    short: "Research context"       },
  { id: 2, label: "Sessions", short: "Per-session summaries"  },
  { id: 3, label: "Patterns", short: "Find recurring patterns" },
  { id: 4, label: "Tag",      short: "Tag across sessions"    },
  { id: 5, label: "Themes",   short: "Synthesize themes"      },
  { id: 6, label: "Brief",    short: "Research brief"         },
];

// ─── API call ─────────────────────────────────────────────────────────────────
async function callClaude(systemPrompt, userMessage, onChunk) {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1000,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) { onChunk("⚠️ Error " + response.status + ". Check your API key and try again."); return ""; }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(l => l.startsWith("data: "));
    for (const line of lines) {
      try {
        const json = JSON.parse(line.slice(6));
        if (json.type === "content_block_delta" && json.delta?.text) {
          fullText += json.delta.text;
          onChunk(fullText);
        }
      } catch {}
    }
  }
  return fullText;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepIndicator({ current, completed }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((step, i) => {
        const done = completed.includes(step.id);
        const active = current === step.id;
        const accessible = step.id <= current;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              minWidth: 52,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                fontFamily: "'JetBrains Mono', monospace",
                background: done ? T.discover : active ? T.discoverDim : "transparent",
                border: `1.5px solid ${done ? T.discover : active ? T.discover : T.border}`,
                color: done ? "#000" : active ? T.discover : T.dim,
                transition: "all 0.2s",
              }}>
                {done ? "✓" : step.id}
              </div>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: active ? T.discover : done ? T.muted : T.dim,
                whiteSpace: "nowrap",
              }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4,
                background: done ? T.discover : T.border,
                transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 6, disabled }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        width: "100%", boxSizing: "border-box",
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "12px 14px",
        color: T.text, fontSize: 13, lineHeight: 1.6,
        fontFamily: "'DM Sans', sans-serif",
        resize: "vertical", outline: "none",
        transition: "border-color 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={e => e.target.style.borderColor = T.discover}
      onBlur={e => e.target.style.borderColor = T.border}
    />
  );
}

function Input({ value, onChange, placeholder, disabled }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
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

function OutputBlock({ content, streaming }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: 8, padding: "16px 18px",
      fontSize: 13, lineHeight: 1.7, color: T.text,
      fontFamily: "'DM Sans', sans-serif",
      whiteSpace: "pre-wrap", wordBreak: "break-word",
      maxHeight: 400, overflowY: "auto",
      position: "relative",
    }}>
      {content || <span style={{ color: T.dim, fontStyle: "italic" }}>Output will appear here…</span>}
      {streaming && (
        <span style={{
          display: "inline-block", width: 6, height: 14,
          background: T.discover, marginLeft: 2,
          animation: "blink 0.8s step-end infinite",
          verticalAlign: "middle",
        }} />
      )}
    </div>
  );
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const isPrimary = variant === "primary";
  const isGhost = variant === "ghost";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? "7px 14px" : "10px 20px",
        fontSize: small ? 11 : 13,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.06em", textTransform: "uppercase",
        fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: 6, border: `1.5px solid`,
        borderColor: isPrimary ? T.discover : T.border,
        background: isPrimary ? T.discover : "transparent",
        color: isPrimary ? "#000" : T.muted,
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { if (!disabled) { e.target.style.opacity = "0.85"; }}}
      onMouseLeave={e => { if (!disabled) { e.target.style.opacity = "1"; }}}
    >
      {children}
    </button>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn small variant="ghost" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }}>
      {copied ? "✓ Copied" : "Copy"}
    </Btn>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: T.discover, background: T.discoverDim,
          border: `1px solid ${T.discoverBorder}`,
          padding: "2px 8px", borderRadius: 4,
        }}>Step {step}</span>
        <span style={{
          fontSize: 16, fontWeight: 600,
          fontFamily: "'DM Serif Display', serif",
          color: T.text,
        }}>{title}</span>
      </div>
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>{desc}</p>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ResearchSynthesizer() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamText, setStreamText] = useState("");

  // Step 1 — Setup
  const [researchQ, setResearchQ] = useState("");
  const [method, setMethod] = useState("");
  const [totalSessions, setTotalSessions] = useState("");
  const [setupConfirmed, setSetupConfirmed] = useState("");

  // Step 2 — Sessions
  const [sessions, setSessions] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentSummary, setCurrentSummary] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  // Step 3 — Codes
  const [codeProposal, setCodeProposal] = useState("");
  const [codesApproved, setCodesApproved] = useState("");

  // Step 4 — Apply
  const [codedData, setCodedData] = useState("");

  // Step 5 — Themes
  const [themes, setThemes] = useState("");

  // Step 6 — Brief
  const [brief, setBrief] = useState("");

  const markComplete = (id) => setCompleted(prev => [...new Set([...prev, id])]);

  // ─── Step handlers ──────────────────────────────────────────────────────────

  async function handleSetup() {
    if (!researchQ.trim() || !method.trim() || !totalSessions.trim()) return;
    setLoading(true); setStreamText("");
    const sys = "You are a senior UX research strategist. Respond in clean markdown. Be concise and precise.";
    const msg = `Confirm this research setup in 3–4 sentences. State back: the primary research question, the method being used, the number of planned sessions, and any immediate considerations for synthesis quality.

Research question: ${researchQ}
Method: ${method}
Total sessions planned: ${totalSessions}`;
    const result = await callClaude(sys, msg, setStreamText);
    setSetupConfirmed(result);
    setLoading(false);
    markComplete(1);
    setStep(2);
  }

  async function handleSummarizeSession() {
    if (!currentTranscript.trim()) return;
    setLoading(true); setStreamText("");
    const sessionNum = sessions.length + 1;
    const sys = "You are a senior UX researcher synthesizing interview data. Use the exact template provided. Quote directly from the transcript — never paraphrase quotes. Flag anything that contradicts research assumptions.";
    const msg = `Generate a structured session summary for Session ${sessionNum}.

Research question: ${researchQ}
Participant role: ${currentRole || "Not specified"}
Transcript / notes:
${currentTranscript}

Use this exact structure:
## Session Summary: ${currentRole || "Participant"} (Session ${sessionNum})

### Participant Context
[Role, experience level, key context]

### Primary Goal
[What they're trying to accomplish — in their words if possible]

### Current Workflow
[How they do the thing — step by step as described]

### Pain Points
| Pain Point | Direct Quote | Severity |
|---|---|---|

### Workarounds
[Compensating behaviors — note what unmet need each reveals]

### Mental Model Notes
[How they think about the problem space — their terminology]

### Surprises / Contradictions
[Anything unexpected or contradicting assumptions]

### Key Quote
> "[Most representative quote]"

### Tags
[3–5 thematic tags]`;
    const result = await callClaude(sys, msg, setStreamText);
    setCurrentSummary(result);
    setLoading(false);
  }

  function acceptSession() {
    setSessions(prev => [...prev, {
      id: prev.length + 1,
      role: currentRole || `Participant ${prev.length + 1}`,
      summary: currentSummary,
      transcript: currentTranscript,
    }]);
    setCurrentTranscript(""); setCurrentSummary(""); setCurrentRole(""); setStreamText("");
  }

  function finishSessions() {
    markComplete(2);
    setStep(3);
  }

  async function handleProposeCodes() {
    setLoading(true); setStreamText("");
    const summaries = sessions.map((s, i) => `### Session ${i + 1}: ${s.role}\n${s.summary}`).join("\n\n---\n\n");
    const sys = "You are a senior UX researcher performing qualitative analysis. Be systematic and rigorous. Only propose codes that appear in 3+ sessions.";
    const msg = `Here are ${sessions.length} research session summaries. Propose 8–12 thematic codes.

Rules:
- Only include codes appearing in 3+ sessions
- Name each code clearly (2–4 words)
- Define each in one sentence
- List which session numbers it appears in
- Note frequency as X of ${sessions.length}

Format as a clean markdown table:
| Code | Definition | Sessions | Frequency |
|---|---|---|---|

Then add a "Suggested Merges" section listing any codes that seem redundant.

Session summaries:
${summaries}`;
    const result = await callClaude(sys, msg, setStreamText);
    setCodeProposal(result);
    setLoading(false);
  }

  function approveCodes() {
    setCodesApproved(codeProposal);
    markComplete(3);
    setStep(4);
  }

  async function handleApplyCodes() {
    setLoading(true); setStreamText("");
    const summaries = sessions.map((s, i) => `### Session ${i + 1}: ${s.role}\n${s.summary}`).join("\n\n---\n\n");
    const sys = "You are a senior UX researcher applying a coding framework systematically. Use direct quotes only — never paraphrase. Be rigorous.";
    const msg = `Apply the approved coding framework to all session summaries. For each code:
- List sessions where it appears
- Pull the strongest direct quote from each session
- Assign a severity: Critical / Major / Minor
- Note any patterns in how the code clusters across sessions

Approved codes:
${codesApproved}

Session summaries:
${summaries}`;
    const result = await callClaude(sys, msg, setStreamText);
    setCodedData(result);
    setLoading(false);
    markComplete(4);
    setStep(5);
  }

  async function handleSynthesizeThemes() {
    setLoading(true); setStreamText("");
    const sys = "You are a senior UX researcher synthesizing cross-session patterns into design-actionable themes. Be sharp and specific — no generic insights.";
    const msg = `From the coded data below, identify 3–5 overarching themes.

For each theme:
- Name it (3–5 words, evocative)
- Summarize in 2–3 sentences — what users experience and why it matters
- List supporting codes (2–3 per theme)
- State frequency: X of ${sessions.length} participants
- Include 2 strongest evidence quotes (with session reference)
- State design implication: what this theme suggests we should solve for
- Generate 1 insight statement: "[User] [does/believes/feels X] because [root cause Y], which means [design implication Z]"

Then add:
### Contradictions and Tensions
[Findings that don't fit neatly into themes]

### What We Expected But Didn't Find
[Assumptions the research didn't confirm]

Coded data:
${codedData}`;
    const result = await callClaude(sys, msg, setStreamText);
    setThemes(result);
    setLoading(false);
    markComplete(5);
    setStep(6);
  }

  async function handleGenerateBrief() {
    setLoading(true); setStreamText("");
    const sys = "You are a senior UX researcher writing a stakeholder-ready research brief. Be clear and scannable. Executives read the Overview, designers read Themes and Insights, PMs read Pain Points and Recommendations.";
    const msg = `Generate a complete Research Brief using all synthesis outputs.

Research context:
- Primary question: ${researchQ}
- Method: ${method}
- Sessions: ${sessions.length}

Themes and insights:
${themes}

Structure:
# Research Brief: [derive a study name from the research question]
### Date: [today] | Sessions: ${sessions.length}

## Overview (60-second read)
[3–4 sentences — most important finding, who it affects, product implication]

## Research Objectives
[Primary and secondary questions]

## Method & Participants
[Method, N, segments, roles]

## Key Themes
[3–5 themes with summary and strongest quote]

## Insight Statements
[One per theme, formatted: User X does Y because Z, which means W]

## Pain Points (Ranked)
[Critical / Major / Minor with frequency]

## What We Expected But Didn't Find
[Unconfirmed assumptions]

## Limitations
[Sample, method, coverage gaps]

## Recommended Next Steps
[Top 3 actions — move to service blueprint, insight framing, or Define]

---

## → Handoff to Define

**Research question answered:** [Yes / Partial]
**Primary user segment:** [Who this research represents]
**Top 3 themes:** [Listed]
**Critical pain points:** [Listed]
**Strongest insight:** [One insight statement]
**Key user quote:** [Most representative quote]
**What Define should focus on first:** [1–2 sentences]
**Open questions carried forward:** [What we still don't know]`;
    const result = await callClaude(sys, msg, setStreamText);
    setBrief(result);
    setLoading(false);
    markComplete(6);
  }

  function downloadBrief() {
    const blob = new Blob([brief], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "research-brief.md"; a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'DM Sans', sans-serif",
      color: T.text,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        :focus-visible { outline: 2px solid #999999; outline-offset: 2px; border-radius: 4px; }
        button:focus:not(:focus-visible) { outline: none; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        padding: "0 clamp(24px, 5vw, 80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: T.discover, boxShadow: `0 0 8px ${T.discover}`,
          }} />
          <span style={{
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase", color: T.discover,
          }}>01 — Discover</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{
            fontSize: 15, fontWeight: 600,
            fontFamily: "'DM Serif Display', serif",
            color: T.text,
          }}>Research Synthesizer</span>
        </div>
        <span style={{
          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: T.dim,
        }}>
          {sessions.length > 0 ? `${sessions.length} session${sessions.length > 1 ? "s" : ""} loaded` : "No sessions yet"}
        </span>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px, 5vw, 80px) 96px" }}>

        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Setup ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Research Context"
              desc="Define the research question, method, and scope before processing any sessions. This context anchors every downstream synthesis decision." />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <Label>Primary research question</Label>
                <Textarea value={researchQ} onChange={setResearchQ} rows={3}
                  placeholder="What are the primary pain points product designers experience when synthesizing qualitative research data?" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Research method</Label>
                  <Input value={method} onChange={setMethod}
                    placeholder="Semi-structured user interviews" />
                </div>
                <div>
                  <Label>Total sessions planned</Label>
                  <Input value={totalSessions} onChange={setTotalSessions}
                    placeholder="8" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleSetup} disabled={loading || !researchQ.trim() || !method.trim() || !totalSessions.trim()}>
                  {loading ? "Confirming…" : "Confirm Setup →"}
                </Btn>
              </div>
            </div>
            {(streamText || setupConfirmed) && (
              <div style={{ marginTop: 24 }}>
                <Label sub>Context confirmed</Label>
                <OutputBlock content={streamText || setupConfirmed} streaming={loading} />
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Sessions ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Session Summaries"
              desc={`Process one session at a time. Paste the transcript or notes, generate a summary, review it, then accept it before moving to the next. Sessions completed: ${sessions.length} of ${totalSessions}.`} />

            {sessions.length > 0 && (
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24,
              }}>
                {sessions.map(s => (
                  <div key={s.id} style={{
                    padding: "4px 10px", borderRadius: 20,
                    background: T.discoverDim, border: `1px solid ${T.discoverBorder}`,
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    color: T.discover, letterSpacing: "0.05em",
                  }}>✓ S{s.id} — {s.role}</div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label>Participant role / ID</Label>
                <Input value={currentRole} onChange={setCurrentRole}
                  placeholder={`e.g. Senior Product Designer — Session ${sessions.length + 1}`}
                  disabled={loading} />
              </div>
              <div>
                <Label>Transcript or notes</Label>
                <Textarea value={currentTranscript} onChange={setCurrentTranscript} rows={10}
                  placeholder="Paste raw interview transcript or session notes here. The more detail, the richer the summary."
                  disabled={loading} />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                {sessions.length >= 3 && (
                  <Btn variant="ghost" onClick={finishSessions} disabled={loading}>
                    Finish Sessions ({sessions.length}) →
                  </Btn>
                )}
                <Btn onClick={handleSummarizeSession}
                  disabled={loading || !currentTranscript.trim()}>
                  {loading ? "Summarizing…" : "Summarize Session"}
                </Btn>
              </div>
            </div>

            {(streamText || currentSummary) && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Session summary — review before accepting</Label>
                  {currentSummary && !loading && <CopyBtn text={currentSummary} />}
                </div>
                <OutputBlock content={streamText || currentSummary} streaming={loading} />
                {currentSummary && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setCurrentSummary(""); setStreamText(""); }}>
                      Re-generate
                    </Btn>
                    <Btn small onClick={acceptSession}>
                      Accept & Add Session
                    </Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Find Patterns ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Find Patterns"
              desc={`Claude analyzes all ${sessions.length} session summaries and identifies recurring patterns — labeling each one so you can track it across every session. Review, rename, or remove any pattern before moving forward.`} />

            {!codeProposal && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleProposeCodes} disabled={loading}>
                  {loading ? "Analyzing…" : `Find Patterns across ${sessions.length} Sessions`}
                </Btn>
              </div>
            )}

            {(streamText || codeProposal) && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Patterns found — edit before confirming</Label>
                  {codeProposal && !loading && <CopyBtn text={codeProposal} />}
                </div>
                <OutputBlock content={streamText} streaming={loading} />
                {codeProposal && !loading && (
                  <>
                    <div style={{ marginTop: 16 }}>
                      <Label>Edit patterns (add, remove, rename, merge)</Label>
                      <Textarea value={codeProposal} onChange={setCodeProposal} rows={12} />
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                      <Btn variant="ghost" small onClick={() => { setCodeProposal(""); setStreamText(""); }}>
                        Re-generate
                      </Btn>
                      <Btn small onClick={approveCodes}>
                        Confirm Patterns →
                      </Btn>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Tag Sessions ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Tag Sessions"
              desc="Claude applies your confirmed patterns systematically across all sessions — pulling direct quotes and assigning severity for each pattern per session." />
            {!codedData && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleApplyCodes} disabled={loading}>
                  {loading ? "Tagging…" : "Tag All Sessions"}
                </Btn>
              </div>
            )}
            {(streamText || codedData) && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Coded data</Label>
                  {codedData && !loading && <CopyBtn text={codedData} />}
                </div>
                <OutputBlock content={streamText || codedData} streaming={loading} />
                {codedData && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn small onClick={() => { markComplete(4); setStep(5); }}>
                      Continue to Themes →
                    </Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Themes ── */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Synthesize Themes"
              desc="Claude identifies 3–5 overarching themes from the tagged sessions — with insight statements, evidence quotes, and design implications per theme." />
            {!themes && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleSynthesizeThemes} disabled={loading}>
                  {loading ? "Synthesizing…" : "Synthesize Themes"}
                </Btn>
              </div>
            )}
            {(streamText || themes) && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Themes + insight statements</Label>
                  {themes && !loading && <CopyBtn text={themes} />}
                </div>
                <OutputBlock content={streamText || themes} streaming={loading} />
                {themes && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setThemes(""); setStreamText(""); }}>
                      Re-generate
                    </Btn>
                    <Btn small onClick={() => { markComplete(5); setStep(6); }}>
                      Generate Brief →
                    </Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 6: Brief ── */}
        {step === 6 && (
          <div>
            <SectionHeader step={6} title="Research Brief"
              desc="The final output — a complete Research Brief with insight statements, ranked pain points, and a Phase Handoff Block ready to paste into the Define phase." />
            {!brief && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleGenerateBrief} disabled={loading}>
                  {loading ? "Generating brief…" : "Generate Research Brief"}
                </Btn>
              </div>
            )}
            {(streamText || brief) && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Research brief + handoff block</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {brief && !loading && <CopyBtn text={brief} />}
                    {brief && !loading && (
                      <Btn small variant="ghost" onClick={downloadBrief}>
                        ↓ Download .md
                      </Btn>
                    )}
                  </div>
                </div>
                <OutputBlock content={streamText || brief} streaming={loading} />
                {brief && !loading && (
                  <div style={{
                    marginTop: 20, padding: "14px 16px",
                    background: T.discoverDim, border: `1px solid ${T.discoverBorder}`,
                    borderRadius: 8,
                  }}>
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: T.discover,
                    }}>
                      ✓ Synthesis complete — {sessions.length} sessions → Research Brief + Handoff Block ready for Define
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
