import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#F59E0B",
  font: { sans: "'DM Sans', sans-serif", mono: "'JetBrains Mono', monospace" },
};

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%", boxSizing: "border-box", background: T.surface,
        border: `1px solid ${T.border}`, borderRadius: 8, color: T.text,
        fontFamily: T.font.sans, fontSize: 14, padding: "10px 12px",
        resize: "vertical", outline: "none",
      }}
    />
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} disabled={!text} style={{
      background: text ? T.accent : T.border, color: text ? "#000" : T.muted,
      border: "none", borderRadius: 8, padding: "10px 20px",
      fontFamily: T.font.sans, fontSize: 14, fontWeight: 600,
      cursor: text ? "pointer" : "default",
    }}>
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

export default function ConceptGenerator() {
  const [problemFrame, setProblemFrame] = useState("");
  const [constraints, setConstraints] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior product designer running a structured ideation session. Your goal is to generate genuinely distinct concept directions — not variations of the same idea. No two concepts should produce the same wireframe.

Start by confirming the problem frame is clear and specific. If not, ask 1-2 targeted clarifying questions.

Generate concepts across 5 angles:

**Angle 1: From the HMW Questions**
Generate 3 concepts directly addressing the top HMW questions. Each concept must describe: the core interaction model, what makes it distinct, and which HMW question it addresses most strongly.

**Angle 2: First Principles**
Strip away how this problem is currently solved. What would you build if no existing solution existed? Generate 2 concepts built from first principles.

**Angle 3: Analogous Domains**
Find a structural parallel in an unrelated domain (e.g., how a hospital handles patient handoffs, how a bank handles fraud detection, how a hotel handles check-in). Transfer the underlying principle — not the surface solution. Generate 2 concepts.

**Angle 4: Constraint as Catalyst**
Pick the tightest constraint (technical, time, accessibility, budget). Let that constraint force a distinctive solution. Generate 2 concepts.

**Angle 5: Be the User**
Inhabit the user's perspective. What would feel magical? What would make them say "finally"? Generate 2 concepts from pure user empathy.

Then: **Consolidate** — Remove duplicates, merge similar ideas, and produce a clean concept card set of 5-8 distinct concepts.

Each concept card:
- Name (memorable, descriptive)
- One-line description
- Core interaction model
- Key user benefit
- Primary risk or assumption

Finally, produce an **Ideate Handoff Block**:
## Ideate Handoff
**Top Concept(s) to Prototype:** ...
**Why these were chosen:** ...
**Concepts to keep in reserve:** ...
**Key assumptions to test:** ...${problemFrame ? `\n\nProblem frame:\n${problemFrame}` : ""}${constraints ? `\n\nConstraints & persona:\n${constraints}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            IDEATE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Concept Generator</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Generate concepts across 5 angles including outside-the-box thinking from unrelated domains</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              PROBLEM FRAME <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea value={problemFrame} onChange={setProblemFrame} placeholder="Paste your problem statement and top HMW questions from the Define phase." rows={5} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              CONSTRAINTS &amp; PERSONA <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea value={constraints} onChange={setConstraints} placeholder="Who is the primary user? What constraints should concepts respect (technical, business, accessibility)?" rows={3} />
          </div>
        </div>

        <button
          onClick={() => setPrompt(buildPrompt())}
          style={{
            background: T.accent, color: "#000", border: "none", borderRadius: 8,
            padding: "12px 28px", fontFamily: T.font.sans, fontSize: 15, fontWeight: 600,
            cursor: "pointer", marginBottom: 36,
          }}
        >
          Generate Prompt →
        </button>

        {prompt && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 10, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              YOUR CLAUDE PROMPT
            </label>
            <pre style={{
              margin: "0 0 20px", color: T.text, fontSize: 13, fontFamily: T.font.mono,
              whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.65,
              background: T.surface, borderRadius: 8, padding: 16, maxHeight: 400, overflowY: "auto",
            }}>
              {prompt}
            </pre>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
              <CopyBtn text={prompt} />
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: T.accent, fontFamily: T.font.sans, fontSize: 14, fontWeight: 500,
                  textDecoration: "none", border: `1px solid ${T.accent}44`, borderRadius: 8, padding: "10px 20px",
                }}
              >
                Open Claude.ai ↗
              </a>
            </div>
            <p style={{ margin: 0, color: T.dim, fontSize: 13, lineHeight: 1.5 }}>
              Claude will ask follow-up questions to fill in any gaps. You can also upload documents, transcripts, or files directly in Claude.ai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
