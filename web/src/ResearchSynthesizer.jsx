import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#22C55E",
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

export default function ResearchSynthesizer() {
  const [researchContext, setResearchContext] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior UX researcher helping a design team synthesize qualitative research into actionable insights.

Start by understanding the research context. Ask about anything missing:
- What decisions will this research inform?
- Who are the participants — what role, background, or context do they represent?
- Are there any assumptions the team held going in that you want to test?

Then guide the synthesis process:

1. **Session Summaries** — For each session or data source, identify: key observations, direct quotes (verbatim), notable moments, and surprises
2. **Code the Data** — Identify 8–12 thematic codes that appear across multiple sessions. Only include codes present in 3+ sessions.
3. **Identify Themes** — Group codes into 3–5 overarching themes with insight statements
4. **Insight Statements** — For each theme, write: "[User] [does/believes/feels X] because [root cause Y], which means [design implication Z]"
5. **Pain Point Ranking** — Rank the top pain points by frequency and severity
6. **Recommendations** — What should the design team explore in the Define phase?

If the researcher has transcripts, recordings, or notes to share, ask them to upload the files — you can review them directly.

At the end, produce a complete **Research Brief** in clean markdown:
## Research Brief
**Research Question:** ...
**Method & Participants:** ...
**Key Themes:** ...
**Top Insights:** ...
**Pain Points (ranked):** ...
**Recommended Next Steps:** ...
**Handoff to Define Phase:** ...${researchContext ? `\n\n---\nResearch context:\n${researchContext}` : ""}${sessionNotes ? `\n\nSession notes / transcripts:\n${sessionNotes}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            DISCOVER
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Research Synthesizer</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Turn raw interviews into a structured Research Brief</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              RESEARCH CONTEXT <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={researchContext}
              onChange={setResearchContext}
              placeholder="What's the research question? What method did you use (interviews, surveys, observation)? How many participants?"
              rows={4}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              SESSION NOTES OR TRANSCRIPTS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={sessionNotes}
              onChange={setSessionNotes}
              placeholder="Paste session notes, transcripts, or key quotes here. You can also upload files directly in Claude.ai..."
              rows={6}
            />
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
