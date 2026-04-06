import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#3B82F6",
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

export default function UserFlowMapper() {
  const [conceptContext, setConceptContext] = useState("");
  const [constraintsContext, setConstraintsContext] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior interaction designer helping a team map all the paths through a feature or concept before building a prototype.

Start by clarifying:
- Who is the primary user and what's their mental model going in?
- What's the single most important task this flow needs to support?
- Are there multiple user types with different paths?
- What does success look like — what's the desired end state?

Map the complete flow across three layers:

1. **Happy Path** — The ideal sequence from start to success. Name every screen. Describe the primary action on each screen and what triggers the next step.

2. **Branches** — Every decision point where the user's path splits. For each branch: what's the condition? what are the paths? which is the most common case?

3. **Error States** — For every action that can fail, map: what triggers the error, what the user sees, and how they recover.

4. **Edge Cases** — What happens with: empty state (no data), first-time user, returning user, incomplete data, slow connection?

Then produce:
- **Screen Inventory** — A numbered list of every screen/state in the flow, with a one-line description of what the user is doing there
- **Prototype Brief** — What screens to build for the minimum testable prototype, what to stub out, and what hypotheses each screen tests

If the designer has wireframes, existing flows, or a design brief to share, ask them to upload the files.

Output everything as clean markdown with flow diagrams represented as indented lists or ASCII trees.${conceptContext ? `\n\nConcept or feature being mapped:\n${conceptContext}` : ""}${constraintsContext ? `\n\nConstraints:\n${constraintsContext}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            PROTOTYPE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>User Flow Mapper</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Map happy paths, branches, and error states — producing a screen inventory and prototype brief</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              CONCEPT OR FEATURE <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={conceptContext}
              onChange={setConceptContext}
              placeholder="Describe the concept or feature you're mapping. What's the user's goal? What's the starting point and end state?"
              rows={4}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              CONSTRAINTS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={constraintsContext}
              onChange={setConstraintsContext}
              placeholder="Any technical constraints, platform rules, or out-of-scope scenarios to keep in mind?"
              rows={3}
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
