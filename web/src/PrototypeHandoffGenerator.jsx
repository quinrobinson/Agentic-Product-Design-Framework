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

export default function PrototypeHandoffGenerator() {
  const [protoOverview, setProtoOverview] = useState("");
  const [hypotheses, setHypotheses] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior product designer helping a team prepare their prototype for usability testing.

Start by understanding what was built and what's still unclear. Ask:
- What fidelity is the prototype — low, mid, or high? Click-through or interactive?
- What flows does it cover — does it represent the full user journey or specific scenarios?
- What did you have to leave out or stub? What are the known gaps?

Produce a complete prototype handoff document:

1. **Prototype Summary** — What was built, what it tests, and what it intentionally doesn't include

2. **Decision Log** — Key design decisions made during prototyping:
   - What was decided
   - Why (the rationale)
   - What was the alternative that was rejected
   - What assumption does this decision embed?

3. **Hypothesis Ranking** — Rate each hypothesis on:
   - Criticality: how much does this assumption matter to the concept's success?
   - Uncertainty: how confident are we it's right?
   - Testability: can a usability session actually test this?
   Rank from "must test now" to "can validate later"

4. **Known Gaps** — What's missing, stubbed, or not representative? What workarounds did you build in?

5. **Testing Recommendations** — Based on the hypothesis ranking:
   - Which tasks should the test script prioritize?
   - What to watch for (observable behaviors that confirm or refute each hypothesis)
   - What NOT to focus on in this round

6. **Handoff Block** for the Findings Synthesizer:
   ## Prototype → Validate Handoff
   **Concept being tested:** ...
   **Top hypotheses (ranked):** ...
   **Tasks to cover:** ...
   **Success signals:** ...
   **Failure signals:** ...

If the designer has prototype files, flow documentation, or design decisions to share, ask them to upload or paste the content.${protoOverview ? `\n\nPrototype overview:\n${protoOverview}` : ""}${hypotheses ? `\n\nHypotheses to test:\n${hypotheses}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            PROTOTYPE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Prototype Handoff Generator</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Document decisions, surface gaps, rank hypotheses, and generate a usability testing handoff</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              PROTOTYPE OVERVIEW <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={protoOverview}
              onChange={setProtoOverview}
              placeholder="Describe what you built — screens, key interactions, and the concept it represents. What decisions did you make and why?"
              rows={4}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              HYPOTHESES TO TEST <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={hypotheses}
              onChange={setHypotheses}
              placeholder="What are the key assumptions embedded in this prototype? What questions do you most need user testing to answer?"
              rows={4}
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
