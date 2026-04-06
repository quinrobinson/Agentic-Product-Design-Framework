import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#8B5CF6",
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
      background: text ? T.accent : T.border, color: text ? "#fff" : T.muted,
      border: "none", borderRadius: 8, padding: "10px 20px",
      fontFamily: T.font.sans, fontSize: 14, fontWeight: 600,
      cursor: text ? "pointer" : "default",
    }}>
      {copied ? "Copied!" : "Copy Prompt"}
    </button>
  );
}

export default function ProblemFramingTool() {
  const [research, setResearch] = useState("");
  const [userContext, setUserContext] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior product designer and design strategist helping a team frame their design problem clearly before moving into ideation.

Start by asking about anything missing:
- What decisions does this problem frame need to enable?
- Are there business constraints or non-negotiables to keep in mind?
- What has the team already tried or ruled out?

Guide the team through four outputs:

1. **Problem Statements (×3)** — Generate three distinct problem statement formats:
   - User-centered: "[User] needs [goal] because [insight]"
   - Tension-based: "How do we balance [X] while ensuring [Y]?"
   - Opportunity-based: "The opportunity is to [change] so that [user outcome]"
   Then evaluate each and recommend one. Be specific — every statement must be concrete enough that a designer could sketch 10 different solutions to it.

2. **Pressure Test** — Challenge the recommended statement on four fronts:
   - Is the user real and specific enough?
   - Is the insight grounded in research, not assumption?
   - Is the scope achievable within this project?
   - Does it leave room for creative solutions?

3. **HMW Questions** — Generate 10 How Might We questions from the problem frame. Score and rank the top 5 on: specificity, actionability, and creative potential.

4. **Handoff Block** — Produce a Define → Ideate Phase Handoff Block:
   ## Define → Ideate Handoff
   **Chosen Problem Statement:** ...
   **Top HMW Questions:** ...
   **Key Constraints:** ...
   **What NOT to explore:** ...
   **Recommended first concept angle:** ...

If the designer has a Research Brief or other documents to share, ask them to upload the files.${research ? `\n\nResearch insights:\n${research}` : ""}${userContext ? `\n\nTarget user & context:\n${userContext}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            DEFINE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Problem Framing</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Generate, pressure-test, and score problem statements + HMW questions</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              RESEARCH INSIGHTS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea value={research} onChange={setResearch} placeholder="Paste key research findings, themes, or insights from the Discover phase. You can also upload your Research Brief." rows={5} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              TARGET USER &amp; CONTEXT <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea value={userContext} onChange={setUserContext} placeholder="Who is the primary user? What's their context, goal, and biggest pain point?" rows={3} />
          </div>
        </div>

        <button
          onClick={() => setPrompt(buildPrompt())}
          style={{
            background: T.accent, color: "#fff", border: "none", borderRadius: 8,
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
