import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: "#0F0F0F",
  surface: "#161616",
  card: "#1C1C1C",
  border: "#2A2A2A",
  text: "#F2F2F2",
  muted: "#888888",
  dim: "#555555",
  discover: "#22C55E",
  discoverDim: "rgba(34,197,94,0.12)",
  discoverBorder: "rgba(34,197,94,0.25)",
};

const STEPS = [
  { id: 1, label: "Setup",       short: "Product + question"     },
  { id: 2, label: "Competitors", short: "Build competitive set"  },
  { id: 3, label: "Audit",       short: "Audit each competitor"  },
  { id: 4, label: "Synthesize",  short: "Landscape synthesis"    },
  { id: 5, label: "Handoff",     short: "Define handoff block"   },
];

const TIERS = [
  { id: "1", label: "Tier 1", desc: "Direct — same problem, same audience"         },
  { id: "2", label: "Tier 2", desc: "Indirect — same problem, different approach"  },
  { id: "3", label: "Tier 3", desc: "Aspirational — different category, relevant patterns" },
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
      tools: [{ type: "web_search_20250305", name: "web_search" }],
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
        color: sub ? T.muted : T.discover,
      }}>{children}</span>
    </div>
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
        color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
        outline: "none", transition: "border-color 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
      onFocus={e => e.target.style.borderColor = T.discover}
      onBlur={e => e.target.style.borderColor = T.border}
    />
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
      borderColor: isPrimary ? T.discover : T.border,
      background: isPrimary ? T.discover : "transparent",
      color: isPrimary ? "#000" : T.muted,
      opacity: disabled ? 0.4 : 1, transition: "all 0.15s",
    }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.target.style.opacity = "1"; }}
    >{children}</button>
  );
}

function CopyBtn({ text, label = "Copy", small = true }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn small={small} variant="ghost" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }}>{copied ? "✓ Copied" : label}</Btn>
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
          fontFamily: "'DM Serif Display', serif", color: T.text,
        }}>{title}</span>
      </div>
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>{desc}</p>}
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
                fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
                fontFamily: "'JetBrains Mono', monospace",
                background: done ? T.discover : active ? T.discoverDim : "transparent",
                border: `1.5px solid ${done ? T.discover : active ? T.discover : T.border}`,
                color: done ? "#000" : active ? T.discover : T.dim,
                transition: "all 0.2s",
              }}>{done ? "✓" : step.id}</div>
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
                background: done ? T.discover : T.border, transition: "background 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TierPill({ tier }) {
  const colors = {
    "1": { color: T.discover, bg: T.discoverDim, border: T.discoverBorder },
    "2": { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
    "3": { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  };
  const c = colors[tier] || colors["1"];
  return (
    <span style={{
      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 3,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>Tier {tier}</span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CompetitiveSnapshotBuilder() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  // Step 1 — Setup
  const [product, setProduct] = useState("");
  const [designQuestion, setDesignQuestion] = useState("");
  const [focusArea, setFocusArea] = useState("all"); // "conventions" | "gaps" | "positioning" | "all"

  // Step 2 — Competitors
  const [knownCompetitors, setKnownCompetitors] = useState("");
  const [suggestedSet, setSuggestedSet] = useState("");
  const [competitors, setCompetitors] = useState([]); // [{ name, url, tier, notes }]
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTier, setNewTier] = useState("1");
  const [newNotes, setNewNotes] = useState("");

  // Step 3 — Audit
  const [currentAuditIdx, setCurrentAuditIdx] = useState(0);
  const [audits, setAudits] = useState({}); // { competitorName: auditText }
  const [currentAuditText, setCurrentAuditText] = useState("");

  // Step 4 — Synthesis
  const [synthesis, setSynthesis] = useState("");

  // Step 5 — Handoff
  const [handoff, setHandoff] = useState("");

  const markComplete = (id) => setCompleted(prev => [...new Set([...prev, id])]);

  function downloadMd(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Step 2: Suggest competitive set ────────────────────────────────────────
  async function handleSuggestSet() {
    if (!product.trim()) return;
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX strategist with deep knowledge of product markets. Use web search to find real competitors. Be specific and accurate.",
      `I'm designing: ${product}
My known competitors: ${knownCompetitors || "none listed yet"}
Design focus: ${designQuestion || "UX conventions, feature gaps, and differentiation opportunities"}

Search the web and suggest a competitive set of 6–8 products total across three tiers:

Tier 1 — Direct (same problem, same audience, similar solution) — suggest 3–4
Tier 2 — Indirect (same problem, different approach or audience) — suggest 2
Tier 3 — Aspirational (different category but relevant UX patterns) — suggest 1–2

For each suggestion:
- Product name and URL
- One sentence: why it belongs in this tier
- One sentence: what's most useful to study about it

Format as a clean numbered list grouped by tier. Be specific — no generic placeholder names.`,
      setStream
    );
    setSuggestedSet(result);
    setLoading(false);
  }

  function addCompetitor() {
    if (!newName.trim()) return;
    setCompetitors(prev => [...prev, {
      id: Date.now(),
      name: newName.trim(),
      url: newUrl.trim(),
      tier: newTier,
      notes: newNotes.trim(),
      audit: null,
    }]);
    setNewName(""); setNewUrl(""); setNewTier("1"); setNewNotes("");
  }

  function removeCompetitor(id) {
    setCompetitors(prev => prev.filter(c => c.id !== id));
  }

  function finishCompetitorSet() {
    if (competitors.length < 2) return;
    markComplete(2);
    setCurrentAuditIdx(0);
    setStep(3);
  }

  // ── Step 3: Audit competitors ───────────────────────────────────────────────
  async function handleAuditCompetitor() {
    const c = competitors[currentAuditIdx];
    if (!c) return;
    setLoading(true); setStream(""); setCurrentAuditText("");

    const result = await callClaude(
      "You are a senior UX researcher auditing a competitor product. Use web search to pull real user sentiment from G2, app store reviews, Reddit, and product blogs. Be specific — cite actual complaints and praise. Never make up quotes.",
      `Audit this competitor for a UX competitive analysis.

Product being designed: ${product}
Design question: ${designQuestion || "UX conventions, feature gaps, positioning"}

Competitor to audit:
- Name: ${c.name}
- URL: ${c.url || "search for it"}
- Tier: ${c.tier} (${TIERS.find(t => t.id === c.tier)?.desc})
- Notes: ${c.notes || "none"}

Use web search to research this product thoroughly, then generate a structured audit:

## Competitor Audit: ${c.name}
### Tier ${c.tier} | Audited: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}

### Value Proposition
- Core promise: [one sentence]
- Clarity test: [Clear / Partial / Unclear] — [why]

### Core UX Patterns
- Navigation model: [Tabs / Sidebar / Bottom nav / etc.]
- Information density: [Minimal / Balanced / Data-rich]
- Primary interaction: [List / Canvas / Feed / Dashboard / etc.]
- Onboarding approach: [Product tour / Empty state / Wizard / None]
- Mobile experience: [Native / Responsive / Mobile-first / Desktop-only]

### Strengths
- [Specific strength — what users praise]
- [Second strength]

### Weaknesses
- [Specific weakness — what users complain about, cite source]
- [Second weakness with source]

### Differentiator
- [What only they do — what can't be easily copied]

### User Sentiment
- Rating: [X/5 — source]
- Top praise: [most common positive theme from real reviews]
- Top complaints: [most common negative theme from real reviews]`,
      setStream
    );
    setCurrentAuditText(result);
    setLoading(false);
  }

  function acceptAudit() {
    const c = competitors[currentAuditIdx];
    setAudits(prev => ({ ...prev, [c.name]: currentAuditText }));
    setCurrentAuditText(""); setStream("");
    if (currentAuditIdx < competitors.length - 1) {
      setCurrentAuditIdx(i => i + 1);
    } else {
      markComplete(3);
      setStep(4);
    }
  }

  function skipAudit() {
    if (currentAuditIdx < competitors.length - 1) {
      setCurrentAuditIdx(i => i + 1);
      setCurrentAuditText(""); setStream("");
    } else {
      markComplete(3);
      setStep(4);
    }
  }

  // ── Step 4: Synthesize ──────────────────────────────────────────────────────
  async function handleSynthesize() {
    setLoading(true); setStream("");
    const allAudits = competitors
      .filter(c => audits[c.name])
      .map(c => `### ${c.name} (Tier ${c.tier})\n${audits[c.name]}`)
      .join("\n\n---\n\n");

    const result = await callClaude(
      "You are a senior UX strategist synthesizing a competitive landscape. Be sharp and specific — no generic observations. Every claim must trace to a specific competitor.",
      `Synthesize these ${competitors.length} competitor audits into a complete competitive landscape analysis.

Product being designed: ${product}
Design question: ${designQuestion || "UX conventions, feature gaps, positioning"}

Competitor audits:
${allAudits}

Generate:

# Competitive Landscape: ${product}
### Competitors analyzed: ${competitors.length} | Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

## Market State
[2–3 sentences on where the category stands — mature / fragmented / consolidating / emerging]

## Competitive Matrix

| Dimension | ${competitors.map(c => c.name).join(" | ")} |
|---|${competitors.map(() => "---").join("|")}|
| Core value prop | ${competitors.map(() => " ").join("|")} |
| Primary user | ${competitors.map(() => " ").join("|")} |
| Navigation model | ${competitors.map(() => " ").join("|")} |
| Info density | ${competitors.map(() => " ").join("|")} |
| Strongest feature | ${competitors.map(() => " ").join("|")} |
| Biggest weakness | ${competitors.map(() => " ").join("|")} |
| Mobile experience | ${competitors.map(() => " ").join("|")} |

## Convention Map
*Patterns used by 3+ competitors — users will expect these. Deviate only with strong justification.*
1. [Convention] — Used by: [names] — Why established: [reason]
2. [Convention] — Used by: [names]
3. [Convention] — Used by: [names]

## Patterns Worth Stealing
*Done well by 1–2 competitors — worth adopting or adapting.*
1. [Pattern] — From: [competitor] — Why it works: [reason] — How to adapt: [note]
2. [Pattern] — From: [competitor]

## Gaps No One Solves Well
*Where users are consistently underserved — backed by real review evidence.*
1. [Gap] — Evidence: [source / complaint theme]
2. [Gap] — Evidence: [source]
3. [Gap] — Evidence: [source]

## Patterns to Avoid
*Common approaches that frustrate users across the category.*
1. [Pattern] — Why: [user complaints]

## Primary Differentiation Opportunity
[One sharp sentence — the clearest gap + the angle to own it]

## Positioning Signal for Define
[1–2 sentences translating the competitive landscape into a problem statement direction]`,
      setStream
    );
    setSynthesis(result);
    setLoading(false);
    markComplete(4);
    setStep(5);
  }

  // ── Step 5: Handoff ─────────────────────────────────────────────────────────
  async function handleGenerateHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior UX designer generating a structured phase handoff block. Extract real content from the analysis — no placeholders.",
      `Generate a Discover → Define Phase Handoff Block from this competitive analysis.

Product: ${product}
Design question: ${designQuestion}
Competitors analyzed: ${competitors.map(c => `${c.name} (Tier ${c.tier})`).join(", ")}

Synthesis:
${synthesis}

Use this exact structure:

## → Handoff: Discover → Define
### From: Competitive Snapshot Builder
### Project: ${product}
### Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

### What we completed
- Competitors audited: ${Object.keys(audits).length} of ${competitors.length}
- Tiers covered: [list which tiers]
- User sentiment sourced: Yes (web search)

### What the next phase needs to know
- Category state: [one sentence on market maturity]
- Competitive set summary: [Tier 1: X, Y, Z | Tier 2: A, B | Tier 3: C]

### Dominant conventions — users will expect these
1. [Convention] — Used by [X of ${competitors.length}] competitors
2. [Convention] — Used by [X of ${competitors.length}] competitors
3. [Convention] — Used by [X of ${competitors.length}] competitors

### Gaps no one solves well
1. [Gap] — Evidence: [source]
2. [Gap] — Evidence: [source]

### Patterns worth adopting
- [Pattern] from [Competitor] — [Why]
- [Pattern] from [Competitor] — [Why]

### Primary differentiation opportunity
[One sentence — clearest gap + our angle]

### Positioning signal for Define
[What problem statement direction the competitive landscape points toward]

### Open questions carried forward
- [What competitive analysis couldn't determine — needs user research]
- [Assumptions about the market that need validation]

---
*Combine with Research Synthesis handoff when opening the Define phase.*`,
      setStream
    );
    setHandoff(result);
    setLoading(false);
    markComplete(5);
  }

  const currentCompetitor = competitors[currentAuditIdx];
  const auditedCount = Object.keys(audits).length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`, padding: "18px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.discover, boxShadow: `0 0 8px ${T.discover}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.discover }}>01 — Discover</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Competitive Snapshot Builder</span>
        </div>
        {competitors.length > 0 && (
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
            {competitors.length} competitor{competitors.length > 1 ? "s" : ""} · {auditedCount} audited
          </span>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}>

        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Setup ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Product + Design Question"
              desc="Define what you're designing and what you need to learn from the competitive landscape before building the competitor set." />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <Label>What are you designing?</Label>
                <Textarea value={product} onChange={setProduct} rows={3}
                  placeholder="e.g. A research synthesis tool for product designers — helps teams turn raw interview notes into structured themes and insights." />
              </div>
              <div>
                <Label>Design question — what do you need to learn?</Label>
                <Input value={designQuestion} onChange={setDesignQuestion}
                  placeholder="e.g. What UX conventions do users expect, and where is the market weakest?" />
              </div>
              <div>
                <Label sub>Focus area</Label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { id: "all",         label: "All three" },
                    { id: "conventions", label: "UX Conventions" },
                    { id: "gaps",        label: "Feature Gaps" },
                    { id: "positioning", label: "Positioning" },
                  ].map(f => (
                    <button key={f.id} onClick={() => setFocusArea(f.id)} style={{
                      padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      border: `1px solid ${focusArea === f.id ? T.discover : T.border}`,
                      background: focusArea === f.id ? T.discoverDim : "transparent",
                      color: focusArea === f.id ? T.discover : T.dim,
                      transition: "all 0.12s",
                    }}>{f.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={() => { markComplete(1); setStep(2); }}
                  disabled={!product.trim()}>
                  Build Competitor Set →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Competitors ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Build Competitive Set"
              desc="List your known competitors, get AI suggestions, then confirm which ones to audit. Aim for 4–8 total across three tiers." />

            {/* Known competitors + suggest */}
            {!suggestedSet && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
                <div>
                  <Label>Known competitors (optional — Claude will expand from here)</Label>
                  <Textarea value={knownCompetitors} onChange={setKnownCompetitors} rows={3}
                    placeholder="e.g. Dovetail, Maze, UserZoom, Notion" disabled={loading} />
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <Btn variant="ghost" onClick={() => { markComplete(2); setStep(3); }}
                    disabled={competitors.length < 2}>
                    Skip suggestions
                  </Btn>
                  <Btn onClick={handleSuggestSet} disabled={loading || !product.trim()}>
                    {loading ? "Searching…" : "Suggest Competitive Set"}
                  </Btn>
                </div>
              </div>
            )}

            {(stream || suggestedSet) && !loading && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Suggested set — review and add the ones you want</Label>
                  <Btn small variant="ghost" onClick={() => setSuggestedSet("")}>Re-generate</Btn>
                </div>
                <OutputBlock content={suggestedSet} streaming={false} maxH={320} />
              </div>
            )}
            {loading && <OutputBlock content={stream} streaming={true} maxH={320} />}

            {/* Tiers legend */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {TIERS.map(t => (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 10px", borderRadius: 20,
                  border: `1px solid ${T.border}`, background: T.card,
                }}>
                  <TierPill tier={t.id} />
                  <span style={{ fontSize: 11, color: T.muted }}>{t.desc}</span>
                </div>
              ))}
            </div>

            {/* Add competitor form */}
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "16px", marginBottom: 16,
            }}>
              <Label sub>Add a competitor</Label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <Input value={newName} onChange={setNewName} placeholder="Product name" />
                </div>
                <div>
                  <Input value={newUrl} onChange={setNewUrl} placeholder="URL (optional)" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {TIERS.map(t => (
                    <button key={t.id} onClick={() => setNewTier(t.id)} style={{
                      padding: "5px 10px", borderRadius: 5, cursor: "pointer",
                      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      border: `1px solid ${newTier === t.id ? T.discover : T.border}`,
                      background: newTier === t.id ? T.discoverDim : "transparent",
                      color: newTier === t.id ? T.discover : T.dim,
                      transition: "all 0.12s",
                    }}>Tier {t.id}</button>
                  ))}
                </div>
                <Input value={newNotes} onChange={setNewNotes} placeholder="Why include this one? (optional)" />
              </div>
              <Btn small onClick={addCompetitor} disabled={!newName.trim()}>+ Add Competitor</Btn>
            </div>

            {/* Competitor list */}
            {competitors.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                {competitors.map((c, i) => (
                  <div key={c.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px", background: T.card, borderRadius: 6,
                    border: `1px solid ${T.border}`,
                  }}>
                    <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace", minWidth: 20 }}>{i + 1}</span>
                    <TierPill tier={c.tier} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.text, flex: 1 }}>{c.name}</span>
                    {c.url && <span style={{ fontSize: 11, color: T.dim }}>{c.url}</span>}
                    <button onClick={() => removeCompetitor(c.id)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 14, color: T.dim, lineHeight: 1, padding: "0 4px",
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn disabled={competitors.length < 2} onClick={finishCompetitorSet}>
                Audit {competitors.length} Competitor{competitors.length !== 1 ? "s" : ""} →
              </Btn>
            </div>
          </div>
        )}

        {/* ── Step 3: Audit ── */}
        {step === 3 && currentCompetitor && (
          <div>
            <SectionHeader step={3} title={`Audit — ${currentCompetitor.name}`}
              desc={`${currentAuditIdx + 1} of ${competitors.length} competitors. Claude uses web search to pull real user sentiment — strengths, weaknesses, and review themes.`} />

            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
              {competitors.map((c, i) => (
                <div key={c.id} style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em",
                  background: audits[c.name] ? T.discoverDim : i === currentAuditIdx ? T.card : "transparent",
                  border: `1px solid ${audits[c.name] ? T.discover : i === currentAuditIdx ? T.border : T.border}`,
                  color: audits[c.name] ? T.discover : i === currentAuditIdx ? T.text : T.dim,
                }}>
                  {audits[c.name] ? "✓ " : ""}{c.name}
                </div>
              ))}
            </div>

            {/* Current competitor info */}
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 8, padding: "14px 16px", marginBottom: 20,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <TierPill tier={currentCompetitor.tier} />
              <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{currentCompetitor.name}</span>
              {currentCompetitor.url && <span style={{ fontSize: 11, color: T.dim }}>{currentCompetitor.url}</span>}
              {currentCompetitor.notes && <span style={{ fontSize: 11, color: T.muted }}>· {currentCompetitor.notes}</span>}
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16, justifyContent: "flex-end" }}>
              <Btn variant="ghost" small onClick={skipAudit} disabled={loading}>
                Skip this one
              </Btn>
              <Btn onClick={handleAuditCompetitor} disabled={loading}>
                {loading ? "Researching…" : `Audit ${currentCompetitor.name}`}
              </Btn>
            </div>

            {(stream || currentAuditText) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Audit — review before accepting</Label>
                  {currentAuditText && !loading && <CopyBtn text={currentAuditText} />}
                </div>
                <OutputBlock content={loading ? stream : currentAuditText} streaming={loading} maxH={480} />
                {currentAuditText && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setCurrentAuditText(""); setStream(""); }}>
                      Re-audit
                    </Btn>
                    <Btn small onClick={acceptAudit}>
                      {currentAuditIdx < competitors.length - 1 ? `Accept → Next (${competitors[currentAuditIdx + 1]?.name})` : "Accept → Synthesize"}
                    </Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 4: Synthesize ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Synthesize Landscape"
              desc={`Claude synthesizes ${auditedCount} competitor audits into a full landscape — convention map, competitive matrix, gaps, and differentiation opportunity.`} />

            {!synthesis && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleSynthesize} disabled={loading}>
                  {loading ? "Synthesizing…" : `Synthesize ${auditedCount} Audits`}
                </Btn>
              </div>
            )}

            {(stream || synthesis) && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Competitive landscape synthesis</Label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {synthesis && !loading && (
                      <>
                        <CopyBtn text={synthesis} />
                        <Btn small variant="ghost" onClick={() => downloadMd(synthesis, "competitive-landscape.md")}>↓ .md</Btn>
                      </>
                    )}
                  </div>
                </div>
                <OutputBlock content={loading ? stream : synthesis} streaming={loading} maxH={520} />
                {synthesis && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setSynthesis(""); setStream(""); }}>Re-synthesize</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: Handoff ── */}
        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Define Handoff"
              desc="A structured summary of the competitive analysis — paste it as the first message when opening the Define phase, alongside the Research Synthesis handoff." />

            {!handoff && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleGenerateHandoff} disabled={loading}>
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
                        <Btn small variant="ghost" onClick={() => downloadMd(handoff, "handoff-competitive-analysis.md")}>↓ .md</Btn>
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
                      ✓ Analysis complete — {competitors.length} competitors · {auditedCount} audited · handoff ready for Define
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
