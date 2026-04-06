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

export default function IdeaClusteringTool() {
  const [concepts, setConcepts] = useState("");
  const [criteria, setCriteria] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a design strategist helping a team make sense of a large set of concepts and identify the strongest directions to pursue.

If the designer hasn't pasted their concepts yet, ask them to share the raw ideation output — even rough notes and fragments are useful.

Work through three stages:

**Stage 1: Cluster**
Group concepts by the underlying approach or interaction model — not by surface similarity. Name each cluster in a way that captures the strategic direction. Aim for 4-7 clusters from 15-50 concepts.

**Stage 2: Map the Landscape**
For each cluster:
- What's the core bet? (The key assumption this approach depends on)
- What user need does it primarily serve?
- What's the key trade-off vs. other clusters?

Identify 2-3 key tensions in the landscape (e.g. "guided vs. open-ended", "fast vs. thorough", "individual vs. collaborative").

**Stage 3: Recommend**
Using the decision criteria provided, recommend:
- 1-2 clusters to pursue in prototyping
- 1 cluster to keep as a backup direction
- Clusters to set aside (and why)

Produce the output as:
1. A cluster overview table (cluster name, # of ideas, core bet, primary user benefit)
2. A tension map (the 2-3 strategic tensions, with which clusters sit on which side)
3. A recommendation section with rationale
4. A short **Ideate → Prototype Handoff Block**:
   ## Ideate → Prototype Handoff
   **Recommended concept direction(s):** ...
   **Core hypothesis to test:** ...
   **What the prototype must demonstrate:** ...
   **What to leave out of v1:** ...${concepts ? `\n\nRaw concepts:\n${concepts}` : ""}${criteria ? `\n\nDecision criteria:\n${criteria}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            IDEATE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Idea Clustering</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Transform raw concepts into a strategic landscape — clusters, tensions, and recommendations</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              RAW CONCEPTS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea value={concepts} onChange={setConcepts} placeholder="Paste all concepts generated in your ideation session — rough ideas, notes, fragments. More is better." rows={8} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              DECISION CRITERIA <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea value={criteria} onChange={setCriteria} placeholder="What matters most when evaluating these concepts? (e.g. technical feasibility, user delight, business impact, speed to ship)" rows={3} />
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
