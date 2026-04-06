import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1A1A1A",
  border: "#2C2C2C", text: "#F2F2F2", muted: "#999999", dim: "#787878",
  accent: "#14B8A6",
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

export default function DesignQALogger() {
  const [qaObservations, setQaObservations] = useState("");
  const [launchContext, setLaunchContext] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior design engineer running a final design QA review before launch, helping a team structure their observations into an actionable issue log.

Start by understanding the QA context:
- What's being QA'd — a new feature, a redesign, or a bug fix?
- What's the agreed design spec? (Figma link, Zeplin, or component spec document)
- What platform and devices were tested?
- Is this a pre-launch QA or a post-launch audit?

Guide the QA process systematically:

**1. Issue Log**
For every observation, document:
- **ID**: QA-001, QA-002...
- **Screen / Component**: Where the issue appears
- **Description**: What's wrong (be specific — not "button looks off")
- **Expected**: What the design spec says
- **Actual**: What was implemented
- **Severity**:
  - P0: Blocking launch (accessibility failure, data loss, broken core flow)
  - P1: Must fix before launch (visual regression from spec, broken interaction)
  - P2: Should fix in follow-up sprint (minor spec deviation, polish)
  - P3: Nice to have (preference, not a spec violation)
- **Screenshot needed**: Yes / No

**2. Summary Dashboard**
- Total issues by severity
- Screens or components with most issues
- % spec compliance (rough estimate)

**3. Launch Recommendation**
Based on P0/P1 counts:
- LAUNCH READY: No blockers, all P0/P1 resolved
- CONDITIONAL LAUNCH: Ship with P2/P3 tracked, P0/P1 resolved
- NOT READY: P0/P1 issues must be fixed first

**4. Developer Sign-Off Checklist**
A checklist of P0/P1 items for the developer to confirm fixed before launch, with space for sign-off initials and date.

If the designer has screenshots, recordings, or a Figma spec to share, ask them to upload the files.

Output as clean markdown with a table for the issue log and the checklist at the end.${qaObservations ? `\n\nQA observations provided:\n${qaObservations}` : ""}${launchContext ? `\n\nLaunch context:\n${launchContext}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            DELIVER
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Design QA Logger</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>
          Structure QA notes into a severity-rated issue log with launch recommendation and developer sign-off checklist
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              QA OBSERVATIONS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={qaObservations}
              onChange={setQaObservations}
              placeholder="Paste your QA notes — screen by screen, interaction by interaction. Raw notes are fine. You can also upload screenshots or screen recordings in Claude.ai."
              rows={7}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              LAUNCH CONTEXT <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={launchContext}
              onChange={setLaunchContext}
              placeholder="What's the launch scope? Any known constraints (hard deadline, partial rollout, feature flag)? What was the agreed spec?"
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
