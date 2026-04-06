import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  proto: "#3B82F6", protoDim: "rgba(59,130,246,0.12)", protoBorder: "rgba(59,130,246,0.25)",
};

const STEPS = [
  { id: 1, label: "Setup",     short: "Entry + goal + persona"   },
  { id: 2, label: "Happy",     short: "Optimistic path"          },
  { id: 3, label: "Branches",  short: "Errors + alternatives"    },
  { id: 4, label: "Inventory", short: "Screen list + scope"      },
  { id: 5, label: "Handoff",   short: "Prototype brief"          },
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

export default function UserFlowMapper() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  const [entry, setEntry] = useState("");
  const [goal, setGoal] = useState("");
  const [persona, setPersona] = useState("");
  const [constraints, setConstraints] = useState("");
  const [protoQuestion, setProtoQuestion] = useState("");

  const [happyPath, setHappyPath] = useState("");
  const [branches, setBranches] = useState("");
  const [inventory, setInventory] = useState("");
  const [handoff, setHandoff] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleHappyPath() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX designer mapping user flows. Be systematic and specific — list every step as a discrete action or response. Flag every decision point explicitly. Your output becomes the wireframing scope.",
      `Map the happy path for this user flow.

Entry point: ${entry}
User's goal: ${goal}
Persona: ${persona}
Constraints: ${constraints || "None specified"}

List every step from entry to success. For each step:

**[Step N]:** [User or System] — [Action or Response]

After each USER step, flag if there's a decision point (→ Decision):
After each SYSTEM step, flag if the response could vary (→ Variable):

At the end, add:

## Decision Points Summary
List each decision point from above:
- Step [N]: [The decision] → [Possible outcomes]

## Steps requiring a screen or state change
List only the steps that need a distinct UI state:
- Step [N]: [Screen name] — [What it shows/does]`,
      setStream
    );
    setHappyPath(result); setLoading(false); mark(2);
  }

  async function handleBranches() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX designer mapping every path through a feature — not just the optimistic one. Be systematic. Every decision point branches. Every async step can fail. Every form field can be wrong. Your output determines prototype completeness.",
      `Map all alternative paths, errors, and edge cases for this flow.

User's goal: ${goal}
Persona: ${persona}
Constraints: ${constraints || "None specified"}

Happy path:
${happyPath}

## Part 1 — Alternative Paths
For each decision point from the happy path, map all branches:

**Decision at Step [N]: [The decision]**
Branch A: [Condition] → [Steps] → [Outcome]
Branch B: [Condition] → [Steps] → [Outcome]

## Part 2 — Error States
For each async operation or user input, map the failure path:

**Error: [Error name]**
- Triggered by: [Cause]
- Occurs at: Step [N]
- User sees: [Error state description]
- User can: [Available actions — retry, back, contact support]
- Progress preserved: Yes / No

Cover: network failure, validation errors, permission denied, not found, timeout, conflict

## Part 3 — Edge Cases
Map these systematically:
- Already done: User tries to complete something they've already done
- Partial state: User returns to a partially completed flow
- Slow connection: Async operations take 10× longer than expected
- Double-tap: User submits the same action twice quickly
- Session timeout: User is idle and their session expires mid-flow`,
      setStream
    );
    setBranches(result); setLoading(false); mark(3);
  }

  async function handleInventory() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX designer building the wireframing scope from a user flow. Every branch and every state becomes a screen. Be complete and systematic. This inventory is what gets built.",
      `Generate a complete screen inventory from this user flow.

User's goal: ${goal}
Core prototype question: ${protoQuestion || "Not specified"}

Happy path:
${happyPath}

Alternative paths + errors:
${branches}

For every unique screen or UI state, produce one inventory entry:

## Screen Inventory

### Happy Path Screens
| # | Screen Name | Type | Triggered By | Primary Action | Leads To |
|---|---|---|---|---|---|
| 1 | [Name] | [Page/Modal/Sheet/Toast] | [What shows it] | [CTA] | [Next] |

### Alternative Path Screens
| # | Screen Name | Type | Condition | Primary Action | Leads To |
|---|---|---|---|---|---|

### Error States
| # | Error Name | Trigger | User Can Fix? | Primary Action |
|---|---|---|---|---|

### Empty States
| # | State Name | When Shown | First-Use? | Primary Action |
|---|---|---|---|---|

---

**Total screens:** [N]

## Prototype Scope Recommendation
Given the core prototype question "${protoQuestion || "answer the riskiest assumption"}", which screens are:

**Essential (must be in v1 prototype):** [List — with rationale]
**Defer to v2:** [List — with rationale]
**Can stub (show as placeholder):** [List]

**Prototype screen count (v1):** [N of N total]`,
      setStream
    );
    setInventory(result); setLoading(false); mark(4); setStep(5);
  }

  async function handleHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX designer generating a prototype brief. Be specific and actionable — the person receiving this brief should be able to start wireframing immediately without asking any clarifying questions.",
      `Generate a prototype brief from this user flow mapping session.

Entry: ${entry}
Goal: ${goal}
Persona: ${persona}
Core prototype question: ${protoQuestion || "Validate the primary user flow"}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Flow summary: ${happyPath}
Branches + errors: ${branches}
Screen inventory: ${inventory}

## Prototype Brief: [Feature/Flow Name]

**What we're building:** [One sentence — the flow and its purpose]
**What we're testing:** [The core prototype question]
**Fidelity:** [Recommended: Lo-fi / Mid-fi — with rationale]

---

### In scope (build this)
[List each v1 screen with what it must contain — not the design, the content and function]

### Out of scope (do not build)
[List deferred screens with one-line rationale each]

### The critical path
[The 3–4 screens that MUST work perfectly to test the prototype question]

### What to watch during testing
[The specific moments in the flow where the prototype question gets answered]

### Open questions for the wireframer
[Design decisions the flow raised but didn't resolve]

---
**Estimated build time:** [Hours based on scope and fidelity]
**Screen count (v1):** [N]`,
      setStream
    );
    setHandoff(result); setLoading(false); mark(5);
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.proto, boxShadow: `0 0 8px ${T.proto}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto }}>04 — Prototype</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>User Flow Mapper</span>
        </div>
        {inventory && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>inventory ready</span>}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Flow Setup" desc="Define the entry point, user goal, and what question this prototype needs to answer. Every branch in the flow becomes a screen." />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 18px", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 32 }}>
                {[["Happy path", "The optimistic route to success"], ["+ Decision points", "Every choice the user makes"], ["+ Error paths", "Every way the system can fail"], ["= Screen inventory", "Everything that needs to be built"]].map(([label, desc]) => (
                  <div key={label} style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.proto, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 11, color: T.dim }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Entry point</Label>
                  <Input value={entry} onChange={setEntry} placeholder="e.g. User taps 'New synthesis' button on the dashboard" />
                </div>
                <div>
                  <Label>User's goal</Label>
                  <Input value={goal} onChange={setGoal} placeholder="e.g. Upload and synthesize 5 interview transcripts into a shareable brief" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Persona</Label>
                  <Input value={persona} onChange={setPersona} placeholder="e.g. Senior designer, familiar with research but new to this tool" />
                </div>
                <div>
                  <Label>Core prototype question</Label>
                  <Input value={protoQuestion} onChange={setProtoQuestion} placeholder="e.g. Can designers upload and process files without guidance?" />
                </div>
              </div>
              <div>
                <Label>Constraints (technical, permissions, system limits)</Label>
                <Input value={constraints} onChange={setConstraints} placeholder="e.g. Files must be PDF/doc/txt under 50MB. Free tier limited to 3 uploads. Auth required." />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!entry.trim() || !goal.trim()} onClick={() => { mark(1); setStep(2); }}>Map Happy Path →</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Happy Path" desc="Map every step from entry to success — user actions and system responses. Decision points get flagged as branches to map next." />
            {!happyPath && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleHappyPath} disabled={loading}>{loading ? "Mapping…" : "Map the Happy Path"}</Btn></div>}
            {(stream || happyPath) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Step-by-step happy path + decision points</Label>
                  {happyPath && !loading && <CopyBtn text={happyPath} />}
                </div>
                <OutputBlock content={loading ? stream : happyPath} streaming={loading} />
                {happyPath && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setHappyPath(""); setStream(""); }}>Re-map</Btn>
                    <Btn small onClick={() => { mark(2); setStep(3); }}>Map Branches + Errors →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Branches + Errors" desc="Every decision point branches. Every async step can fail. This step maps all alternative paths, error states, and edge cases." />
            {!branches && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleBranches} disabled={loading}>{loading ? "Mapping…" : "Map Branches + Errors"}</Btn></div>}
            {(stream || branches) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Alternative paths · error states · edge cases</Label>
                  {branches && !loading && <CopyBtn text={branches} />}
                </div>
                <OutputBlock content={loading ? stream : branches} streaming={loading} maxH={520} />
                {branches && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setBranches(""); setStream(""); }}>Re-map</Btn>
                    <Btn small onClick={() => { mark(3); setStep(4); }}>Generate Screen Inventory →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Screen Inventory" desc="Every state from the flow becomes a screen entry. Claude generates the complete inventory and recommends v1 prototype scope." />
            {!inventory && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleInventory} disabled={loading}>{loading ? "Building…" : "Generate Screen Inventory"}</Btn></div>}
            {(stream || inventory) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Complete screen list · v1 prototype scope</Label>
                  {inventory && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={inventory} />
                      <Btn small variant="ghost" onClick={() => dl([happyPath, branches, inventory].join("\n\n---\n\n"), "user-flow-map.md")}>↓ Full flow .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : inventory} streaming={loading} maxH={540} />
                {inventory && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setInventory(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => setStep(5)}>Generate Prototype Brief →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Prototype Brief" desc="A complete wireframing brief — scope, critical path, open questions, and estimated build time. Ready to hand to the wireframer." />
            {!handoff && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleHandoff} disabled={loading}>{loading ? "Generating…" : "Generate Prototype Brief"}</Btn></div>}
            {(stream || handoff) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Wireframing scope + prototype brief</Label>
                  {handoff && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={handoff} />
                      <Btn small variant="ghost" onClick={() => dl(handoff, "prototype-brief.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : handoff} streaming={loading} maxH={520} />
                {handoff && !loading && (
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.protoDim, border: `1px solid ${T.protoBorder}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.proto }}>
                      ✓ Flow mapped — prototype brief ready for wireframing
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
