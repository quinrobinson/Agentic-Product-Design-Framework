import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  deliver: "#14B8A6", deliverDim: "rgba(20,184,166,0.12)", deliverBorder: "rgba(20,184,166,0.25)",
};

const STEPS = [
  { id: 1, label: "Setup",      short: "Feature + screens"        },
  { id: 2, label: "Issues",     short: "Log discrepancies"        },
  { id: 3, label: "Prioritize", short: "Severity + fix list"      },
  { id: 4, label: "Report",     short: "QA log + sign-off"        },
];

const SEVERITY_COLORS = {
  "P0": "#EF4444",
  "P1": "#F59E0B",
  "P2": "#3B82F6",
  "P3": "#666666",
};

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

export default function DesignQALogger() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  const [feature, setFeature] = useState("");
  const [screens, setScreens] = useState("");
  const [environment, setEnvironment] = useState("");

  const [rawNotes, setRawNotes] = useState("");
  const [structuredIssues, setStructuredIssues] = useState("");
  const [prioritized, setPrioritized] = useState("");
  const [qaReport, setQaReport] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleStructure() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design QA specialist structuring implementation review notes. Be precise and consistent. Every issue needs a clear spec reference and a specific fix. Design QA is not subjective — it's comparing what was built against what was approved.",
      `Structure these design QA notes into a consistent issue log.

Feature: ${feature}
Screens reviewed: ${screens}
Environment: ${environment || "Staging"}

Raw QA notes:
${rawNotes}

For each issue, produce one entry in this format:

## Issue [N]: [Short title — what the problem is, 5–8 words]

**Screen:** [Screen name]
**Element:** [Specific component, section, or element — be precise]
**Severity:** P0 / P1 / P2 / P3 (assign in next step)
**Spec says:** [What the approved design specifies]
**Build has:** [What was actually implemented]
**Fix:** [Specific change required — concrete enough for a developer to action]
**Notes:** [Any context, edge case, or dependency worth flagging]

After all issues, add a summary:

## What's Correct
[List any screens or elements that match the spec perfectly — equal weight to issues]

## Unclear Scope
[Anything ambiguous — where the spec and implementation differ but it's unclear if it's intentional]`,
      setStream
    );
    setStructuredIssues(result); setLoading(false); mark(2);
  }

  async function handlePrioritize() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design QA lead prioritizing issues for a production release. Apply severity consistently. P0 = blocks launch (broken functionality or severe accessibility failure). P1 = must fix before launch (significant visual or UX deviation). P2 = fix soon post-launch. P3 = polish when time allows.",
      `Rate and prioritize every issue in this QA log.

Feature: ${feature}

Severity scale:
- P0: Blocks launch — broken functionality, severe accessibility failure, data loss risk, or complete deviation from approved design that breaks user task
- P1: Must fix before launch — significant visual deviation, wrong copy in prominent location, missing state, layout broken on any supported viewport
- P2: Fix post-launch (within one sprint) — minor visual discrepancy, spacing off by 4–8px, secondary state inconsistency
- P3: Polish — preference-level difference, minor spacing, low-visibility element

Issues:
${structuredIssues}

Produce:

## Severity-Rated Issue List

| Priority | # | Issue title | Screen | Element | Fix |
|---|---|---|---|---|---|
| P0 | [N] | [title] | [screen] | [element] | [fix] |
| P1 | [N] | [title] | [screen] | [element] | [fix] |

## Summary
- Total issues: [N]
- P0 (blocks launch): [N]
- P1 (before launch): [N]
- P2 (post-launch): [N]
- P3 (polish): [N]

## Launch recommendation
[Safe to launch if P0 = 0 / Hold: N P0 issues must resolve first / Launch with known issues: list P1s being deferred with rationale]`,
      setStream
    );
    setPrioritized(result); setLoading(false); mark(3);
  }

  async function handleReport() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design QA lead generating a final QA report for stakeholders and developers. Be clear about what needs to happen before launch. Sign-off is a real decision — state it explicitly.",
      `Generate a complete design QA report.

Feature: ${feature}
Environment: ${environment || "Staging"}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Structured issues: ${structuredIssues}
Prioritized list: ${prioritized}

## Design QA Report: ${feature}
Date: [date] | Environment: [environment] | Reviewed by: [Designer]

---

## Summary
- Screens reviewed: [N]
- Total issues found: [N]
- P0 (blocks launch): [N]
- P1 (before launch): [N]
- P2 (post-launch): [N]
- P3 (polish): [N]
- Elements passing spec: [list]

## Launch Recommendation
**[HOLD / APPROVED WITH CONDITIONS / APPROVED]**
[One sentence rationale]

---

## P0 Issues — Resolve Before Launch
For each P0:
### [Issue title]
Screen: [name] | Element: [name]
Spec: [what was approved]
Build: [what was implemented]
**Fix required:** [specific action]

## P1 Issues — Resolve Before Launch
[Same format, briefer]

## P2 Issues — Post-Launch (Sprint [N])
| # | Issue | Screen | Fix |
|---|---|---|---|

## P3 Issues — Polish Backlog
| # | Issue | Screen |
|---|---|---|

---

## What Passed
[Screens and elements that match spec — document to prevent unnecessary changes]

## Sign-Off Checklist
- [ ] All P0 issues resolved and verified
- [ ] All P1 issues resolved or formally deferred with PM sign-off
- [ ] Accessibility: keyboard nav tested
- [ ] Accessibility: screen reader tested on primary flow
- [ ] Responsive: tested on [smallest supported viewport]
- [ ] Dark mode: tested (if applicable)
- [ ] Design approved for production: [Designer] — [Date]`,
      setStream
    );
    setQaReport(result); setLoading(false); mark(4);
  }

  const issueCount = (structuredIssues.match(/^## Issue/gm) || []).length;
  const p0Count = (prioritized.match(/\| P0/g) || []).length;

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
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Design QA Logger</span>
        </div>
        {issueCount > 0 && (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {p0Count > 0 && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: "#EF4444" }}>{p0Count} P0</span>}
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>{issueCount} issues</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {step === 1 && (
          <div>
            <SectionHeader step={1} title="QA Setup"
              desc="Define the feature, screens under review, and environment. Then paste your raw notes — scattered, inconsistent, any format." />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                {[["Design QA ≠ Functional QA", "Functional QA: does it work? Design QA: does it match?"], ["Spec vs. actual", "Every issue compares what was approved to what was built"], ["Severity drives action", "P0 blocks launch. P1 must fix. P2 post-launch. P3 polish."]].map(([label, desc]) => (
                  <div key={label} style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.deliver, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: T.dim }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Feature name</Label>
                  <Input value={feature} onChange={setFeature} placeholder="e.g. File Upload Flow" />
                </div>
                <div>
                  <Label>Screens reviewed</Label>
                  <Input value={screens} onChange={setScreens} placeholder="e.g. Upload modal, Processing, Results" />
                </div>
                <div>
                  <Label>Environment</Label>
                  <Input value={environment} onChange={setEnvironment} placeholder="e.g. Staging — build 2.4.1" />
                </div>
              </div>
              <div>
                <Label>Raw QA notes — paste anything</Label>
                <Textarea value={rawNotes} onChange={setRawNotes} rows={12}
                  placeholder={"Paste your raw notes in any format:\n\n- Upload button wrong color — should be teal not blue\n- Drag area too small on mobile, hard to tap\n- Error message missing on invalid file type\n- Loading spinner doesn't match design — wrong size\n- 'Processing...' copy should be 'Analyzing your notes...'\n- Progress bar missing\n- Success state ✓ looks correct\n- File name truncation at 28 chars not 40 as specced\n- Typography on results screen — H2 is 24px not 28px"} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!feature.trim() || !rawNotes.trim()} onClick={() => { mark(1); setStep(2); }}>Log Issues →</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Structure Issues"
              desc="Claude converts scattered notes into consistent issue entries — each with screen, element, spec vs. actual, and specific fix." />
            {!structuredIssues && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleStructure} disabled={loading}>{loading ? "Structuring…" : "Structure All Issues"}</Btn></div>}
            {(stream || structuredIssues) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Screen · element · spec says · build has · fix</Label>
                  {structuredIssues && !loading && <CopyBtn text={structuredIssues} />}
                </div>
                <OutputBlock content={loading ? stream : structuredIssues} streaming={loading} maxH={540} />
                {structuredIssues && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setStructuredIssues(""); setStream(""); }}>Re-structure</Btn>
                    <Btn small onClick={() => { mark(2); setStep(3); }}>Prioritize Issues →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Severity + Priority"
              desc="Every issue rated P0–P3. P0 blocks launch. P1 must fix before launch. P2 post-launch. P3 polish backlog." />
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {[["P0", "Blocks launch", "#EF4444"], ["P1", "Before launch", "#F59E0B"], ["P2", "Post-launch", "#3B82F6"], ["P3", "Polish", "#666"]].map(([p, label, color]) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color }}>{p}</span>
                  <span style={{ fontSize: 11, color: T.muted }}>{label}</span>
                </div>
              ))}
            </div>
            {!prioritized && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handlePrioritize} disabled={loading}>{loading ? "Prioritizing…" : "Rate All Issues"}</Btn></div>}
            {(stream || prioritized) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Priority table · summary · launch recommendation</Label>
                  {prioritized && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={prioritized} />
                      <Btn small variant="ghost" onClick={() => dl([structuredIssues, prioritized].join("\n\n---\n\n"), "qa-log.md")}>↓ Issue log .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : prioritized} streaming={loading} maxH={500} />
                {prioritized && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setPrioritized(""); setStream(""); }}>Re-prioritize</Btn>
                    <Btn small onClick={() => { mark(3); setStep(4); }}>Generate QA Report →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <SectionHeader step={4} title="QA Report"
              desc="Complete QA report with launch recommendation, sign-off checklist, and P0/P1 fix list — ready to share with engineering and PM." />
            {!qaReport && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleReport} disabled={loading}>{loading ? "Generating…" : "Generate QA Report"}</Btn></div>}
            {(stream || qaReport) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Summary · launch decision · P0/P1 fixes · sign-off checklist</Label>
                  {qaReport && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={qaReport} />
                      <Btn small variant="ghost" onClick={() => dl(qaReport, `${feature.toLowerCase().replace(/\s+/g, "-")}-qa-report.md`)}>↓ Report .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : qaReport} streaming={loading} maxH={560} />
                {qaReport && !loading && (
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.deliverDim, border: `1px solid ${T.deliverBorder}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.deliver }}>
                      ✓ Share report with engineering — resolve P0s before any production deploy
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
