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
  { id: 1, label: "Context",   short: "Problem + persona + HMW"     },
  { id: 2, label: "Generate",  short: "Multi-angle concepts"         },
  { id: 3, label: "Expand",    short: "Outside-the-box thinking"     },
  { id: 4, label: "Capture",   short: "Concept cards"                },
  { id: 5, label: "Handoff",   short: "Ideate handoff block"         },
];

const ANGLES = [
  {
    id: "hmw",
    label: "From the Problem",
    short: "Direct from HMW",
    desc: "Generate concepts directly from your HMW questions — the baseline solution space.",
    icon: "🎯",
  },
  {
    id: "firstprinciples",
    label: "First Principles",
    short: "Strip everything away",
    desc: "Forget how things are done today. Reason from what the user actually needs.",
    icon: "⚗️",
  },
  {
    id: "analogous",
    label: "Outside Your Domain",
    short: "Analogous inspiration",
    desc: "Pull structural principles from unrelated fields that solved a similar problem.",
    icon: "🌐",
  },
  {
    id: "constraint",
    label: "Constraint as Catalyst",
    short: "Use the limit as the idea",
    desc: "Take your biggest constraint and make it the core design driver.",
    icon: "🔧",
  },
  {
    id: "worst",
    label: "Worst Idea First",
    short: "Bad ideas → good ones",
    desc: "Generate terrible ideas, then reverse them. Unlocks what perfectionism suppresses.",
    icon: "💡",
  },
  {
    id: "persona",
    label: "Be the User",
    short: "Role-play the persona",
    desc: "Inhabit the persona. Generate from their emotional truth, not their functional needs.",
    icon: "👤",
  },
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
        color: sub ? T.muted : T.ideate,
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

function CopyBtn({ text, small = true }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn small={small} variant="ghost" onClick={() => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }}>{copied ? "✓ Copied" : "Copy"}</Btn>
  );
}

function OutputBlock({ content, streaming, maxH = 460 }) {
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
export default function ConceptGenerator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [activeAngle, setActiveAngle] = useState(null);

  // Step 1 — Context
  const [problemStatement, setProblemStatement] = useState("");
  const [persona, setPersona] = useState("");
  const [hmwQuestions, setHmwQuestions] = useState("");
  const [constraints, setConstraints] = useState("");

  // Step 2 — Direct generation
  const [directConcepts, setDirectConcepts] = useState("");

  // Step 3 — Angle results (keyed by angle id)
  const [angleResults, setAngleResults] = useState({});

  // Step 4 — Concept cards
  const [conceptCards, setConceptCards] = useState("");

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

  const allAngleResults = Object.values(angleResults).filter(Boolean).join("\n\n---\n\n");

  // ── Step 2: Direct generation ─────────────────────────────────────────────
  async function handleDirect() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer running an ideation session. Generate concepts that are genuinely distinct from each other — not variations of the same idea. No two concepts should produce the same wireframe. Be specific and concrete.",
      `Generate 5 distinct concept directions from these HMW questions.

Problem statement: ${problemStatement}
Primary persona: ${persona}
HMW questions:
${hmwQuestions}
Key constraints: ${constraints || "None specified"}

For each concept:
- **Name:** [2–4 words, memorable and specific]
- **One-liner:** [What it does — from the user's perspective, one sentence]
- **Core mechanism:** [What makes it work — the key design or technical decision]
- **Which HMW it addresses:** [Reference the specific question]
- **Assumption it bets on:** [What must be true for this to succeed]

Rules:
- Each concept must represent a meaningfully different approach — not a variation
- Do not evaluate or score — generate all 5 first
- Be specific — avoid generic descriptions like "an AI-powered tool that helps users"`,
      setStream
    );
    setDirectConcepts(result);
    setLoading(false);
    markComplete(2);
  }

  // ── Step 3: Angle generation ──────────────────────────────────────────────
  async function handleAngle(angleId) {
    setActiveAngle(angleId);
    setLoading(true); setStream("");

    const prompts = {
      firstprinciples: `Generate 3 concepts using first principles thinking.

Forget how [the product domain] currently works. Strip everything away.

Starting from first principles:
- What does ${persona} fundamentally need to accomplish?
- What's the minimum mechanism that delivers that outcome?
- What would you build if no existing solution in this space existed as a reference?

Problem statement: ${problemStatement}
Persona: ${persona}
Constraints: ${constraints || "None specified"}

For each concept:
- **Name:** [2–4 words]
- **One-liner:** [User perspective]
- **Core mechanism:** [The fundamental design decision]
- **What it ignores:** [Which existing convention it throws away]`,

      analogous: `Generate 3 concepts using analogous inspiration from outside the product domain.

Problem statement: ${problemStatement}
Persona: ${persona}

Step 1: Identify 3 domains outside of software/digital products that have solved a structurally similar problem — the same underlying challenge, not the same surface topic.

Good domains to explore: emergency medicine, investigative journalism, aviation safety, military logistics, competitive sport coaching, architecture, legal discovery, supply chain management, game design, financial trading floors.

For each domain:
1. **Domain:** [Name it]
2. **How they solved the similar problem:** [Specific mechanism — be concrete]
3. **Underlying principle:** [The transferable idea — stripped of domain-specific details]
4. **Product concept:** [How this principle becomes a feature or product for ${persona}]

Rules:
- Transfer the principle, not the surface solution
- Be specific about what changes and what stays the same in the transfer
- The product concept must respond to the problem statement`,

      constraint: `Generate 3 concepts where the biggest constraint becomes the core design driver.

Problem statement: ${problemStatement}
Persona: ${persona}
Biggest constraint: ${constraints || "infer the most significant constraint from the problem context"}

For each concept, take the constraint and make it a feature — not something to work around, but the thing that makes the concept distinctive.

For each concept:
- **Name:** [2–4 words]
- **One-liner:** [User perspective]
- **How the constraint becomes the concept:** [The specific inversion]
- **What this unlocks:** [What becomes possible that wasn't before]`,

      worst: `Generate the 10 worst possible solutions to this problem — then reverse each one.

Problem statement: ${problemStatement}
Persona: ${persona}

Part 1 — WORST IDEAS:
Generate 10 genuinely terrible solutions. Ideas that would embarrass a designer, frustrate the user, or make the problem dramatically worse. Don't be polite — make them bad.

Part 2 — REVERSALS:
For each bad idea, identify its reversal: what does the opposite suggest? What useful concept direction emerges?

Then select the 3 most interesting reversals and develop them into full concepts:
- **Name:** [2–4 words]
- **One-liner:** [User perspective]
- **The bad idea it came from:** [Reference]
- **The reversal:** [What the inversion revealed]`,

      persona: `Generate 3 concepts by inhabiting the persona's perspective.

You are ${persona}. You have been struggling with: ${problemStatement.replace("How might we", "the problem of")}

A product designer asks you: "If you could wave a magic wand and have exactly the tool you need — with no technical constraints — what would it do? Walk me through a specific moment in your day where it would help and exactly what it does."

Answer in first person as this persona. Be specific about:
- The exact moment in your day (time, context, what you were just doing)
- The emotion you're feeling when you reach for this tool
- Step by step what the ideal experience feels like
- What you say to a colleague about it the next day

Then extract 3 distinct concepts that different people with this persona might imagine. Format each as:
- **Name:** [2–4 words]
- **One-liner:** [User perspective — what they'd tell a colleague]
- **Core mechanism:** [What makes it work]
- **The emotional job it does:** [What feeling it resolves]`,
    };

    const systemPrompts = {
      firstprinciples: "You are a product designer who thinks from first principles. Strip away convention. Reason from what users actually need, not from what already exists.",
      analogous: "You are a design strategist expert at cross-domain analogical thinking. Find structural parallels in unrelated domains and transfer the underlying principle — not the surface solution.",
      constraint: "You are a designer who treats constraints as creative catalysts. Every limit is a design opportunity. The tightest constraints produce the most distinctive concepts.",
      worst: "You are a creative facilitator running a 'worst possible idea' exercise. Generate genuinely terrible ideas — then find the gold in their reversals.",
      persona: "You are an empathy-driven designer who generates concepts by inhabiting the user's perspective. Speak as the user before speaking as the designer.",
    };

    const result = await callClaude(
      systemPrompts[angleId],
      prompts[angleId],
      (chunk) => setStream(chunk)
    );

    setAngleResults(prev => ({ ...prev, [angleId]: result }));
    setLoading(false);
    setActiveAngle(null);
  }

  // ── Step 4: Concept cards ─────────────────────────────────────────────────
  async function handleConceptCards() {
    setLoading(true); setStream("");
    const allConcepts = [directConcepts, allAngleResults].filter(Boolean).join("\n\n---\n\n");
    const result = await callClaude(
      "You are a design strategist organizing a concept set. Identify distinct concepts — not variations. Merge duplicates. Document each cleanly.",
      `Review all concepts generated across multiple angles and produce a clean concept card set.

Rules:
- Identify distinct concepts — if two are variations of the same idea, merge them into one
- Flag any concept that doesn't respond to the problem statement
- Target 12–20 concept cards — collapse obvious duplicates

All concepts:
${allConcepts}

Problem statement: ${problemStatement}
Persona: ${persona}

For each distinct concept, produce a concept card:

---
**[NAME]**
One-liner: [What it does — user perspective, one sentence]
Core mechanism: [What makes it work — the key design decision]
Angle: [Which generation method produced it — HMW direct / First Principles / Analogous / Constraint / Worst-then-reverse / Persona]
Assumption: [What must be true for this to succeed]

---

After all cards:

**Total concepts:** [N]
**Most unexpected concept:** [Name] — [why it's unexpected]
**Concepts that don't fit the problem:** [List any — explain why]`,
      setStream
    );
    setConceptCards(result);
    setLoading(false);
    markComplete(4);
    setStep(5);
  }

  // ── Step 5: Handoff ────────────────────────────────────────────────────────
  async function handleHandoff() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a senior product designer generating a structured ideation handoff. Extract real content — no placeholders. Be specific.",
      `Generate a Concept Generation → Ideate Handoff Block.

Problem statement: ${problemStatement}
Primary persona: ${persona}
HMW questions: ${hmwQuestions}
Concept cards: ${conceptCards}
Angles run: ${[directConcepts && "HMW Direct", ...Object.keys(angleResults).filter(k => angleResults[k])].filter(Boolean).join(", ")}

Generate using this exact structure:

## Handoff: Ideate — Concept Generation
### From: Concept Generator Tool
### Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

---

### What we completed
- Concepts generated: [count from concept cards]
- Angles run: [list the ones used]
- Analogous domains explored: [list if analogous angle was run]

### Problem statement
> ${problemStatement}

### Primary persona
[Name and one-line context from the persona input]

### Full concept set
[List all concept cards — name and one-liner only]

### Most unexpected concept
**[Name]** — [why it's unexpected, which angle produced it]

### Instinctively promising (no scoring — gut feeling only)
1. [Name] — [why]
2. [Name] — [why]
3. [Name] — [why]

### Instinctively risky but interesting
1. [Name] — [what the risk is]

### What's missing
[Directions that weren't explored — angles that weren't run, constraints not inverted, domains not tried]

---
Do not evaluate or rank. That happens in Idea Clustering.
Paste this block when opening Idea Clustering.`,
      setStream
    );
    setHandoff(result);
    setLoading(false);
    markComplete(5);
  }

  const anglesRun = Object.keys(angleResults).filter(k => angleResults[k]).length;

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
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>Concept Generator</span>
        </div>
        {anglesRun > 0 && (
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
            {anglesRun} angle{anglesRun !== 1 ? "s" : ""} run
          </span>
        )}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {/* ── Step 1: Context ── */}
        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Problem Context"
              desc="Provide the locked problem statement, primary persona, and HMW questions from Define. The more grounded the input, the more specific the concepts." />
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <Label>Problem statement</Label>
                <Input value={problemStatement} onChange={setProblemStatement}
                  placeholder="e.g. How might we help senior product designers synthesize 20+ hours of interview data into a shareable brief in under 2 hours?" />
              </div>
              <div>
                <Label>Primary persona</Label>
                <Input value={persona} onChange={setPersona}
                  placeholder="e.g. Senior product designer, 5+ years, works across 3–5 projects simultaneously, time-constrained" />
              </div>
              <div>
                <Label>Top HMW questions (from Define)</Label>
                <Textarea value={hmwQuestions} onChange={setHmwQuestions} rows={5}
                  placeholder={"1. HMW reduce the time between raw notes and shareable themes?\n2. HMW help designers see patterns they wouldn't spot alone?\n3. HMW make research synthesis a team activity rather than solo work?"} />
              </div>
              <div>
                <Label>Key constraints</Label>
                <Input value={constraints} onChange={setConstraints}
                  placeholder="e.g. Must work in Claude Chat, no new tooling budget, 5-min time window per synthesis session" />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!problemStatement.trim() || !persona.trim() || !hmwQuestions.trim()}
                  onClick={() => { markComplete(1); setStep(2); }}>
                  Start Generating →
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Direct generation ── */}
        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Generate From the Problem"
              desc="First pass: 5 distinct concepts directly from your HMW questions. This establishes the baseline solution space before expanding beyond it." />

            {!directConcepts && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleDirect} disabled={loading}>
                  {loading ? "Generating…" : "Generate 5 Concepts"}
                </Btn>
              </div>
            )}

            {(stream || directConcepts) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>5 concepts from HMW questions</Label>
                  {directConcepts && !loading && <CopyBtn text={directConcepts} />}
                </div>
                <OutputBlock content={loading ? stream : directConcepts} streaming={loading} />
                {directConcepts && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setDirectConcepts(""); setStream(""); }}>Re-generate</Btn>
                    <Btn small onClick={() => { markComplete(2); setStep(3); }}>Expand with Angles →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Angle expansion ── */}
        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Expand with Thinking Angles"
              desc="Run 1–3 additional angles to push beyond the obvious solution space. Each angle surfaces concepts the previous step wouldn't reach. Outside Your Domain is the most powerful for breaking expert fixedness." />

            {/* Angle cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10, marginBottom: 28 }}>
              {ANGLES.filter(a => a.id !== "hmw").map(angle => {
                const hasResult = !!angleResults[angle.id];
                const isRunning = loading && activeAngle === angle.id;
                return (
                  <div key={angle.id} style={{
                    background: hasResult ? T.ideateDim : T.surface,
                    border: `1px solid ${hasResult ? T.ideateBorder : T.border}`,
                    borderRadius: 10, padding: "16px 18px",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{angle.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{angle.label}</div>
                          <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.dim, letterSpacing: "0.05em" }}>{angle.short}</div>
                        </div>
                      </div>
                      {hasResult && (
                        <span style={{
                          fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          color: T.ideate, background: T.ideateDim,
                          border: `1px solid ${T.ideateBorder}`,
                          padding: "2px 7px", borderRadius: 4,
                        }}>✓ Done</span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, marginBottom: 12 }}>{angle.desc}</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn small disabled={loading} onClick={() => handleAngle(angle.id)}>
                        {isRunning ? "Running…" : hasResult ? "Re-run" : "Run this angle"}
                      </Btn>
                      {hasResult && <CopyBtn text={angleResults[angle.id]} />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live output while angle running */}
            {loading && stream && (
              <div style={{ marginBottom: 20 }}>
                <Label sub>Generating — {ANGLES.find(a => a.id === activeAngle)?.label}</Label>
                <OutputBlock content={stream} streaming={true} maxH={400} />
              </div>
            )}

            {/* Expanded results summary */}
            {anglesRun > 0 && (
              <div style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 8, padding: "14px 16px", marginBottom: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace', letterSpacing: '0.06em'", color: T.muted }}>
                    {anglesRun} angle{anglesRun !== 1 ? "s" : ""} complete · ready to capture concept cards
                  </span>
                  <CopyBtn text={allAngleResults} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <Btn variant="ghost" small onClick={() => setStep(2)}>← Back</Btn>
              <Btn small disabled={loading} onClick={() => { markComplete(3); setStep(4); }}>
                Capture Concept Cards →
              </Btn>
            </div>
          </div>
        )}

        {/* ── Step 4: Concept cards ── */}
        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Capture Concept Cards"
              desc={`Claude reviews all ${anglesRun + 1} angles of output, merges duplicates, and produces a clean concept card for each distinct direction — ready for clustering.`} />

            {!conceptCards && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn onClick={handleConceptCards} disabled={loading}>
                  {loading ? "Capturing…" : "Generate Concept Cards"}
                </Btn>
              </div>
            )}

            {(stream || conceptCards) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Concept cards — all distinct directions</Label>
                  {conceptCards && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={conceptCards} />
                      <Btn small variant="ghost" onClick={() => dl(conceptCards, "concept-cards.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : conceptCards} streaming={loading} maxH={540} />
                {conceptCards && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setConceptCards(""); setStream(""); }}>Re-capture</Btn>
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
              desc="Package the full concept set for Idea Clustering. Do not evaluate or rank — that happens in the next tool." />

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
                  <Label sub>Concept generation → Idea Clustering handoff</Label>
                  {handoff && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={handoff} />
                      <Btn small variant="ghost" onClick={() => dl(handoff, "concept-generation-handoff.md")}>↓ .md</Btn>
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
                      ✓ Concept generation complete — paste handoff into Idea Clustering to continue
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
