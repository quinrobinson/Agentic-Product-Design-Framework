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
  ideate: "#F59E0B",
  ideateDim: "rgba(245,158,11,0.12)",
  ideateBorder: "rgba(245,158,11,0.25)",
};

const STEPS = [
  { id: 1, label: "Concepts",  short: "Paste concept set"          },
  { id: 2, label: "Cluster",   short: "Group by direction"         },
  { id: 3, label: "Name",      short: "Name + frame clusters"      },
  { id: 4, label: "Landscape", short: "Map strategic space"        },
  { id: 5, label: "Handoff",   short: "Concept Critique handoff"   },
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
        color: sub ? T.muted : T.ideate,
      }}>{children}</span>
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 6, disabled }) {
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
      onFocus={e => e.target.style.borderColor = T.ideate}
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
      onFocus={e => e.target.style.borderColor = T.ideate}
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
      borderColor: isPrimary ? T.ideate : T.border,
      background: isPrimary ? T.ideate : "transparent",
      color: isPrimary ? T.bg : T.muted,
      opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
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
        background: T.ideate, marginLeft: 2,
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
          color: T.ideate, background: T.ideateDim,
          border: `1px solid ${T.ideateBorder}`,
          padding: "2px 8px", borderRadius: 4,
        }}>Step {step}</span>
        <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>{title}</span>
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
                fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                background: done ? T.ideate : active ? T.ideateDim : "transparent",
                border: `1.5px solid ${done ? T.ideate : active ? T.ideate : T.border}`,
                color: done ? T.bg : active ? T.ideate : T.dim,
                transition: "all 0.2s",
              }}>{done ? "✓" : step.id}</div>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: active ? T.ideate : done ? T.muted : T.dim,
                whiteSpace: "nowrap",
              }}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4,
                background: done ? T.ideate : T.border, transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IdeaClusteringTool() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 — Input
  const [concepts, setConcepts] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [persona, setPersona] = useState("");

  // Step 2 — Raw clusters
  const [rawClusters, setRawClusters] = useState("");

  // Step 3 — Named clusters
  const [namedClusters, setNamedClusters] = useState("");

  // Step 4 — Landscape
  const [landscape, setLandscape] = useState("");

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

  // ── Step 2: Raw clustering ─────────────────────────────────────────────────
  async function handleCluster() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design strategist revealing the strategic landscape inside a raw idea set. Cluster by underlying approach and mechanism — not by surface similarity. Each cluster must represent a genuinely different bet about how to solve the problem.",
      `Group these concepts into 5–7 meaningful clusters.

Rules:
- Cluster by underlying approach or mechanism, not surface similarity
- Each cluster must be genuinely different from the others — if two feel similar, merge them
- Every concept must fit in exactly one cluster — no orphans
- Do not evaluate or score — just group

Problem statement: ${problemStatement}
Primary persona: ${persona}

All concepts:
${concepts}

For each cluster:

**CLUSTER [N]: [Working name — 3–5 words]**
Strategic bet: [One sentence — what approach this cluster takes to solving the problem]
Concepts included:
- [Concept name] — [one-liner]
- [Concept name] — [one-liner]

---

After all clusters:

**Outliers** (concepts that don't fit cleanly — list any):
- [Concept name] — [why it doesn't fit, whether it's worth keeping]

**Coverage gaps** (directions no concept addresses):
- [Gap description]`,
      setStream
    );
    setRawClusters(result);
    setLoading(false);
    markComplete(2);
  }

  // ── Step 3: Name + validate ────────────────────────────────────────────────
  async function handleName() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design strategist naming clusters so they communicate strategic direction to stakeholders who weren't in the ideation session. A good cluster name tells the team what bet they're making — not just what the solutions look like.",
      `Validate and name these clusters for strategic clarity.

Problem statement: ${problemStatement}
Persona: ${persona}

Raw clusters:
${rawClusters}

For each cluster, produce three naming options:

**CLUSTER [N]:**
- Descriptive: [explains what the solution does — functional]
- User-centric: [describes the outcome for the user — value-focused]
- Provocative: [captures the strategic bet or tension — decision-forcing]

Recommended name: [Choose one and explain in one sentence why it best communicates the direction to a stakeholder who wasn't in the room]

---

After naming all clusters:

**Distinctiveness check:**
Are all clusters genuinely different? Could any be merged without losing a meaningful design choice? [Yes all distinct / Recommend merging: X and Y because...]

**The wireframe test:**
For each cluster pair that feels similar — would they produce different wireframes? [Answer per pair]

**User fit:**
Which clusters most directly address ${persona}'s primary goal? Which are more tangential?`,
      setStream
    );
    setNamedClusters(result);
    setLoading(false);
    markComplete(3);
  }

  // ── Step 4: Landscape mapping ──────────────────────────────────────────────
  async function handleLandscape() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a design strategist mapping a solution landscape to enable real strategic decisions. Surface the tensions, the risks, and the coverage gaps. Make the implicit explicit.",
      `Map the strategic landscape from these clusters.

Problem statement: ${problemStatement}
Persona: ${persona}

Named clusters:
${namedClusters}

## Strategic Landscape Map

**Overall shape:**
[2–3 sentences describing the landscape — where most concepts cluster, what the dominant direction is, what's underrepresented]

---

For each cluster, analyze:

**[Cluster Name]**
- Strategic position: Safe/Incremental/Ambitious/Transformative — [1 sentence rationale]
- Core assumption: [The single belief that must be true for this direction to succeed]
- User value proposition: [What the user gets that they don't have today]
- Key trade-off: [What this direction gives up or makes harder]
- Risk level: Low / Medium / High — [why]

---

**Key tensions** (clusters that can't both be true):
1. **[Cluster A] vs [Cluster B]** — [describe the fundamental tension and what the team must decide]
2. [Add if another tension exists]

**Design implication:** [What must be resolved before prototyping can start]

---

**Recommended for further development** (based on coverage, distinctiveness, and user fit — not scoring):
1. [Cluster name] — [one-line rationale]
2. [Cluster name] — [one-line rationale]

**Rationale for not recommending the others:**
- [Cluster name]: [why it's lower priority]`,
      setStream
    );
    setLandscape(result);
    setLoading(false);
    markComplete(4);
    setStep(5);
  }

  // ── Step 5: Handoff ────────────────────────────────────────────────────────
  async function handleHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer generating a structured phase handoff. Extract real content — no placeholders. Be specific and actionable.",
      `Generate an Idea Clustering → Concept Critique Handoff Block.

Problem statement: ${problemStatement}
Persona: ${persona}
Raw clusters: ${rawClusters}
Named clusters: ${namedClusters}
Landscape: ${landscape}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Use this exact structure:

## Handoff: Ideate — Idea Clustering
### From: Idea Clustering Tool
### Date: [today's date]

---

### What we completed
- Concepts clustered: [count from input]
- Clusters identified: [N]
- Key tensions mapped: [N]
- Recommended for development: [N]

### Strategic landscape summary
[2–3 sentences — the overall shape of the solution space]

### All clusters
1. **[Name]** — [strategic bet in one sentence]
2. **[Name]** — [strategic bet in one sentence]
3. **[Name]** — [strategic bet in one sentence]
4. **[Name]** — [strategic bet in one sentence]
5. **[Name]** — [strategic bet in one sentence]

### Key tension
**[Cluster A] vs [Cluster B]** — [the fundamental trade-off]
**Decision needed before prototyping:** [what must be resolved]

### Recommended for Concept Critique
1. [Cluster name] — [rationale]
2. [Cluster name] — [rationale]

### Outliers worth preserving
- [Concept name] — [why it's interesting]

### Coverage gaps
- [Direction no concept addresses — decided to pursue / not pursue]

### What Concept Critique should stress-test
[Which cluster's core assumption is most uncertain and needs the most scrutiny]

---
Paste this block when opening Concept Critique.
Critique the recommended clusters first — not the full set.`,
      setStream
    );
    setHandoff(result);
    setLoading(false);
    markComplete(5);
  }

  // ─── Render ───────────────────────────────────────────────────────────────
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
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.ideate, boxShadow: `0 0 8px ${T.ideate}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.ideate }}>03 — Ideate</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Idea Clustering</span>
        </div>
        {rawClusters && (
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
            {step > 2 ? "clusters named" : "clustering in progress"}
          </span>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Input ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Concept Set Input"
              desc="Paste the full concept set from the Concept Generator or your own brainstorm. Include all concepts — don't pre-filter. Clustering works best with 15+ concepts." />

            {/* What clustering does */}
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "16px 20px", marginBottom: 24,
            }}>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[
                  { before: "40 sticky notes", after: "5–7 strategic directions", label: "Volume → Landscape" },
                  { before: "Which idea is best?", after: "Which direction to bet on?", label: "Idea → Direction" },
                  { before: "Team debate", after: "Team decision", label: "Confusion → Clarity" },
                ].map(item => (
                  <div key={item.label} style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.ideate, marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: T.dim, marginBottom: 3 }}>{item.before}</div>
                    <div style={{ fontSize: 11, color: T.dim }}>↓</div>
                    <div style={{ fontSize: 12, color: T.text, marginTop: 3 }}>{item.after}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <Label>All concepts — paste from Concept Generator or your own brainstorm</Label>
                <Textarea value={concepts} onChange={setConcepts} rows={10}
                  placeholder={"Paste concept cards, sticky note exports, or a bullet list of ideas.\nEach concept needs at least a name and one-liner.\n\nExample:\n- Zero-state onboarding: Detect when a designer has no synthesis in progress and prompt with a structure\n- Research inbox: A persistent triage view that holds raw notes until the designer is ready to process them\n- Theme radar: Visual map showing research themes emerging in real-time during note-taking"} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Problem statement</Label>
                  <Input value={problemStatement} onChange={setProblemStatement}
                    placeholder="e.g. How might we help designers synthesize research faster?" />
                </div>
                <div>
                  <Label>Primary persona</Label>
                  <Input value={persona} onChange={setPersona}
                    placeholder="e.g. Senior product designer, time-constrained" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!concepts.trim() || !problemStatement.trim()}
                  onClick={() => { markComplete(1); setStep(2); }}>
                  Cluster Concepts →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Cluster ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Group by Strategic Direction"
              desc="Claude groups concepts by underlying approach and mechanism — not surface similarity. Merges obvious duplicates. Flags outliers and coverage gaps." />

            {!rawClusters && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleCluster} disabled={loading}>
                  {loading ? "Clustering…" : "Generate Clusters"}
                </Btn>
              </div>
            )}

            {(stream || rawClusters) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Raw clusters — grouped by approach</Label>
                  {rawClusters && !loading && <CopyBtn text={rawClusters} />}
                </div>
                <OutputBlock content={loading ? stream : rawClusters} streaming={loading} maxH={500} />
                {rawClusters && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setRawClusters(""); setStream(""); }}>Re-cluster</Btn>
                    <Btn small onClick={() => { markComplete(2); setStep(3); }}>Name Clusters →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Name + validate ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Name and Validate Clusters"
              desc="Claude generates three naming options per cluster (descriptive, user-centric, provocative) and validates that clusters are genuinely distinct using the wireframe test." />

            {!namedClusters && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleName} disabled={loading}>
                  {loading ? "Naming…" : "Name Clusters"}
                </Btn>
              </div>
            )}

            {(stream || namedClusters) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>3 naming options per cluster · wireframe test · user fit</Label>
                  {namedClusters && !loading && <CopyBtn text={namedClusters} />}
                </div>
                <OutputBlock content={loading ? stream : namedClusters} streaming={loading} maxH={520} />
                {namedClusters && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setNamedClusters(""); setStream(""); }}>Re-name</Btn>
                    <Btn small onClick={() => { markComplete(3); setStep(4); }}>Map the Landscape →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Landscape ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Map the Strategic Landscape"
              desc="Positions each cluster from safe to transformative, surfaces core assumptions, identifies key tensions between clusters, and recommends which directions to develop further." />

            {!landscape && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleLandscape} disabled={loading}>
                  {loading ? "Mapping…" : "Map the Landscape"}
                </Btn>
              </div>
            )}

            {(stream || landscape) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Strategic positions · tensions · recommendations</Label>
                  {landscape && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={landscape} />
                      <Btn small variant="ghost" onClick={() => dl([rawClusters, namedClusters, landscape].join("\n\n---\n\n"), "cluster-map.md")}>↓ Full map .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : landscape} streaming={loading} maxH={540} />
                {landscape && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setLandscape(""); setStream(""); }}>Re-map</Btn>
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
            <SectionHeader step={5} title="Concept Critique Handoff"
              desc="Package the cluster map for Concept Critique. Identifies which clusters to scrutinize first and what the key tension is that must be resolved before prototyping." />

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
                  <Label sub>Idea Clustering → Concept Critique handoff</Label>
                  {handoff && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={handoff} />
                      <Btn small variant="ghost" onClick={() => dl(handoff, "idea-clustering-handoff.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : handoff} streaming={loading} maxH={520} />
                {handoff && !loading && (
                  <div style={{
                    marginTop: 20, padding: "14px 16px",
                    background: T.ideateDim, border: `1px solid ${T.ideateBorder}`,
                    borderRadius: 8,
                  }}>
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase", color: T.ideate,
                    }}>
                      ✓ Clustering complete — paste handoff into Concept Critique to continue
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
