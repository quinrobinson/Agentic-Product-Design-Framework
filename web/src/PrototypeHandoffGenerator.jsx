import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  proto: "#3B82F6", protoDim: "rgba(59,130,246,0.12)", protoBorder: "rgba(59,130,246,0.25)",
};

const STEPS = [
  { id: 1, label: "Prototype",    short: "Summary + screens built"   },
  { id: 2, label: "Decisions",    short: "Design decisions log"      },
  { id: 3, label: "Gaps",         short: "Known gaps + shortcuts"    },
  { id: 4, label: "Hypotheses",   short: "Ranked assumptions"        },
  { id: 5, label: "Handoff",      short: "Validate handoff block"    },
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

function CopyBtn({ text, label = "Copy" }) {
  const [c, setC] = useState(false);
  return <Btn small variant="ghost" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1800); }}>{c ? "✓ Copied" : label}</Btn>;
}

function OutputBlock({ content, streaming, maxH = 480 }) {
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

export default function PrototypeHandoffGenerator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 — Prototype summary
  const [protoLink, setProtoLink] = useState("");
  const [fidelity, setFidelity] = useState("mid-fi");
  const [platform, setPlatform] = useState("web");
  const [screensBuilt, setScreensBuilt] = useState("");
  const [flowsCovered, setFlowsCovered] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [conceptName, setConceptName] = useState("");

  // Step outputs
  const [decisions, setDecisions] = useState("");
  const [gaps, setGaps] = useState("");
  const [hypotheses, setHypotheses] = useState("");
  const [handoff, setHandoff] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  const protoContext = `Prototype: ${conceptName || "Unnamed concept"}
Fidelity: ${fidelity} | Platform: ${platform}
Link: ${protoLink || "Not specified"}
Screens built: ${screensBuilt}
Flows covered: ${flowsCovered}
Problem statement: ${problemStatement || "Not specified"}`;

  async function handleDecisions() {
    setLoading(true); setStream("");
    const sys = `You are a senior product designer documenting design decisions made during a prototype build. Your job is to surface and structure the decisions that were made — not to invent them, but to help the designer articulate what they actually did and why.

For each decision document:
- DECISION: What was decided (specific, not vague)
- CONTEXT: What prompted this decision — user need, constraint, or tradeoff
- ALTERNATIVES REJECTED: What other approaches were considered and why they were ruled out
- RATIONALE: Why this approach was chosen
- CONSEQUENCE: What this decision means for future work — what it enables, what it constrains

Format each as a numbered DDR (Design Decision Record). Be specific — "used a bottom sheet instead of a modal" is a decision. "made it look good" is not.

Also flag any decisions that are TEMPORARY — made for the prototype but will need to be revisited before engineering handoff.`;

    const user = `${protoContext}

Based on the prototype description above, help me document the key design decisions that were made during the build. 

For the screens and flows described, identify and document:
1. Navigation and layout decisions
2. Interaction pattern choices
3. Component and UI pattern decisions
4. Content and copy decisions
5. Scope decisions (what was included vs deferred)

Generate the design decision log. Flag any that are prototype-only/temporary.`;

    const result = await callClaude(sys, user, setStream);
    setDecisions(result); setStream(""); mark(1); setStep(2); setLoading(false);
  }

  async function handleGaps() {
    setLoading(true); setStream("");
    const sys = `You are a senior UX designer documenting the gaps and shortcuts in a prototype before usability testing. This is critical information for test facilitators — they need to know what's real vs placeholder so they don't accidentally test the wrong thing or get derailed by incomplete areas.

Document gaps in three categories:

MOCKED/SIMPLIFIED — things that look real but aren't functional or accurate:
- Placeholder data, fake content, static states that should be dynamic
- Simplified flows (e.g. "payment form skips validation")
- Approximated layouts that don't reflect the real constraint

NOT BUILT — screens or states that exist in the flow but weren't prototyped:
- Error states, edge cases, empty states
- Secondary flows that branch off the happy path
- Settings, account, or admin screens

DEFERRED DECISIONS — design questions left open that testing might answer:
- Copy that's placeholder
- Visual design choices not finalized
- Interactions that could go multiple ways

For each gap: what's missing, why it was deferred, and what a test facilitator should tell participants if they encounter it.`;

    const user = `${protoContext}

Design decisions made:
${decisions}

Document the gaps and shortcuts in this prototype. Based on the screens and flows built, identify what's missing, what's mocked, and what test facilitators need to know before running sessions.`;

    const result = await callClaude(sys, user, setStream);
    setGaps(result); setStream(""); mark(2); setStep(3); setLoading(false);
  }

  async function handleHypotheses() {
    setLoading(true); setStream("");
    const sys = `You are a senior product designer converting a prototype and its design decisions into testable hypotheses ranked by risk. The goal is to walk into usability testing knowing exactly what you're trying to learn — and what's most likely to fail.

For each hypothesis:
- ASSUMPTION: What we believe to be true about users, behavior, or the design
- TEST: What observable behavior would confirm or refute this assumption
- SUCCESS CRITERIA: Specific, measurable — "4 of 5 participants complete the task without assistance"
- RISK LEVEL: High / Medium / Low — based on how likely we are to be wrong AND how costly it would be if we are
- WHY THIS MATTERS: What happens to the product if this assumption is wrong

Order hypotheses from highest risk to lowest.

Also generate:
TASK SCENARIOS (draft) — 3–5 realistic task scenarios for the usability test. Scenario-based, not instruction-based. "Imagine you've just received an invoice from a client. Show me what you'd do." Not "Click the invoice button."

PASS/FAIL CRITERIA — for each task, what does success look like? What does failure look like?`;

    const user = `${protoContext}

Design decisions:
${decisions}

Known gaps:
${gaps}

Generate the ranked hypotheses and draft usability test tasks. Focus on the riskiest assumptions — the things most likely to fail with real users and most costly if they do.`;

    const result = await callClaude(sys, user, setStream);
    setHypotheses(result); setStream(""); mark(3); setStep(4); setLoading(false);
  }

  async function handleHandoff() {
    setLoading(true); setStream("");
    const sys = `You are a senior product designer generating a structured phase handoff block from Prototype to Validate. This block will be pasted as the opening message in the Findings Synthesizer tool — it must contain everything the test facilitator needs to set up the session correctly.

The handoff block must be formatted exactly as follows — use these headers verbatim so the Findings Synthesizer can parse them:

## Handoff: Prototype → Validate
### Project: [name]
### Date: [today]

---

### Prototype Summary
- Concept: [name + one sentence]
- Problem statement: [one sentence]
- Primary user: [persona/segment]
- Fidelity: [lo-fi / mid-fi / hi-fi]
- Platform: [web / iOS / Android]
- Link: [URL or file path]

### Screens Built
[bullet list of every screen]

### Flows Covered
[bullet list of key user flows]

### Key Design Decisions
[numbered list: decision + one-line rationale]

### Known Gaps + Shortcuts
[bullet list: what's missing or mocked, with facilitator notes]

### Hypotheses to Test (ranked by risk)
[numbered list: assumption → success criteria]

### Riskiest Assumptions
1. [Most likely to be wrong + most costly if it is]
2. [Second riskiest]

### Task Scenarios (draft)
[numbered scenario-based tasks]

### Pass / Fail Criteria
[per task: what success and failure look like]

### Accessibility Notes for Testers
[any a11y gaps testers should be aware of]

---
*Paste this block as your first message in the Findings Synthesizer.*
*Claude will use it to structure sessions and synthesize across participants.*

Be complete and specific. No placeholders — extract real content from everything provided.`;

    const user = `${protoContext}

Design decisions:
${decisions}

Known gaps:
${gaps}

Hypotheses and task scenarios:
${hypotheses}

Generate the complete Prototype → Validate handoff block. Extract real content — no placeholders. This block gets pasted directly into the Findings Synthesizer as the first message.`;

    const result = await callClaude(sys, user, setStream);
    setHandoff(result); setStream(""); mark(4); setStep(5); setLoading(false);
  }

  const fullDoc = `# Prototype Handoff\n\n## Prototype Summary\n${protoContext}\n\n## Design Decisions Log\n${decisions}\n\n## Known Gaps + Shortcuts\n${gaps}\n\n## Hypotheses + Task Scenarios\n${hypotheses}\n\n## Validate Handoff Block\n${handoff}`;

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto, background: T.protoDim, border: `1px solid ${T.protoBorder}`, padding: "3px 10px", borderRadius: 4 }}>Prototype · Tool 15</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, margin: "0 0 8px", color: T.text }}>Prototype Handoff Generator</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6, maxWidth: 560 }}>Close the prototype phase cleanly. Documents design decisions, surfaces gaps testers need to know about, converts assumptions into ranked hypotheses, and generates a complete handoff block for the Findings Synthesizer.</p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <StepIndicator current={step} completed={completed} />

        {/* STEP 1 — Prototype Summary */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Prototype Summary" desc="Describe what was built. The more specific the input, the more useful the decisions log, gaps analysis, and hypotheses will be." />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Concept name</Label>
                  <Input value={conceptName} onChange={setConceptName} placeholder="e.g. Streamlined onboarding, Unified inbox" />
                </div>
                <div>
                  <Label>Prototype link <span style={{ color: T.dim, textTransform: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>(optional)</span></Label>
                  <Input value={protoLink} onChange={setProtoLink} placeholder="Figma URL, hosted link, or file path" />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Fidelity</Label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {[
                      { id: "lo-fi", label: "Lo-fi", desc: "Wireframes, rough flows" },
                      { id: "mid-fi", label: "Mid-fi", desc: "Structured, no visual polish" },
                      { id: "hi-fi", label: "Hi-fi", desc: "Visual design applied" },
                    ].map(f => (
                      <button key={f.id} onClick={() => setFidelity(f.id)} style={{ padding: "8px 12px", textAlign: "left", borderRadius: 6, border: `1.5px solid ${fidelity === f.id ? T.proto : T.border}`, background: fidelity === f.id ? T.protoDim : T.surface, cursor: "pointer", transition: "all 0.15s" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: fidelity === f.id ? T.proto : T.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{f.label}</div>
                        <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>{f.desc}</div>
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
                <Label>Problem statement</Label>
                <Textarea value={problemStatement} onChange={setProblemStatement} placeholder="The problem statement this prototype is designed to solve. e.g. 'New users drop off during onboarding because the value proposition isn't clear before they hit the paywall.'" rows={3} />
              </div>

              <div>
                <Label>Screens built</Label>
                <Textarea value={screensBuilt} onChange={setScreensBuilt} placeholder="List every screen that was built, including states. e.g.:&#10;- Home (default, empty, loading)&#10;- Onboarding step 1 (default, error)&#10;- Onboarding step 2&#10;- Dashboard (populated)&#10;- Settings (not built)" rows={7} />
              </div>

              <div>
                <Label>Flows covered</Label>
                <Textarea value={flowsCovered} onChange={setFlowsCovered} placeholder="List the key user flows that are complete and testable. e.g.:&#10;- New user onboarding (happy path only)&#10;- Core task: creating a project&#10;- Returning user login" rows={4} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleDecisions} disabled={!screensBuilt.trim() || !flowsCovered.trim() || loading}>
                  {loading ? "Documenting decisions…" : "Document design decisions →"}
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 — Design Decisions Log */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Design Decisions Log" desc="Every significant decision made during the build — with context, alternatives rejected, and rationale. Temporary prototype-only decisions are flagged." />
            {loading ? (
              <div>
                <Label sub>Documenting decisions…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={decisions} maxH={480} />
                <p style={{ fontSize: 12, color: T.dim, margin: 0, lineHeight: 1.5 }}>Review and edit above if any decisions are missing or need clarification before proceeding.</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={decisions} />
                  <Btn onClick={handleGaps} disabled={loading}>Document gaps + shortcuts →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Known Gaps */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Known Gaps + Shortcuts" desc="What's mocked, what's missing, and what test facilitators need to know before running sessions. Prevents tests from going off-track on incomplete areas." />
            {loading ? (
              <div>
                <Label sub>Surfacing gaps…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={gaps} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={gaps} />
                  <Btn onClick={handleHypotheses} disabled={loading}>Generate hypotheses + tasks →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4 — Hypotheses */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Hypotheses + Task Scenarios" desc="Assumptions ranked by risk, with success criteria and draft task scenarios for the usability test. Highest-risk assumptions tested first." />
            {loading ? (
              <div>
                <Label sub>Ranking assumptions…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={hypotheses} maxH={480} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <CopyBtn text={hypotheses} />
                  <Btn onClick={handleHandoff} disabled={loading}>Generate validate handoff block →</Btn>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — Handoff Block */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Validate Handoff Block" desc="Everything the Findings Synthesizer needs, formatted to paste as the opening message. Includes prototype summary, decisions, gaps, hypotheses, task scenarios, and pass/fail criteria." />
            {loading ? (
              <div>
                <Label sub>Generating handoff block…</Label>
                <OutputBlock content={stream} streaming={true} maxH={480} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <OutputBlock content={handoff} maxH={480} />

                {/* How to use callout */}
                <div style={{ background: T.card, border: `1px solid ${T.protoBorder}`, borderRadius: 8, padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.proto, marginBottom: 10 }}>How to use this handoff block</div>
                  <div style={{ display: "grid", gridTemplateColumns: "24px 1fr", gap: "8px 12px", fontSize: 13, color: T.muted, lineHeight: 1.5 }}>
                    <span style={{ color: T.proto, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>01</span>
                    <span>Copy the handoff block above</span>
                    <span style={{ color: T.proto, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>02</span>
                    <span>Open the <strong style={{ color: T.text }}>Findings Synthesizer</strong> tool</span>
                    <span style={{ color: T.proto, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>03</span>
                    <span>Paste as your very first message — Claude will use it to structure every session and synthesize across participants</span>
                    <span style={{ color: T.proto, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>04</span>
                    <span>The task scenarios and pass/fail criteria pre-fill the test setup — no need to write them again</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <CopyBtn text={handoff} label="Copy handoff block" />
                  <Btn variant="ghost" small onClick={() => dl(fullDoc, "prototype-handoff.md")}>Download full handoff (.md)</Btn>
                  <Btn variant="ghost" small onClick={() => dl(handoff, "validate-handoff-block.md")}>Download handoff block</Btn>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
