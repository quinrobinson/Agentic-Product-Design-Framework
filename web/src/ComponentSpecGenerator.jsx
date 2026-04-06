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

export default function ComponentSpecGenerator() {
  const [componentDesign, setComponentDesign] = useState("");
  const [techStack, setTechStack] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior design engineer helping a team create production-ready component specifications for developer handoff.

Start by understanding what's being specified:
- Is this a new component or an update to an existing one?
- What's the design system context — does a token system exist?
- What's the primary use case and what are the edge cases?

Produce a complete component spec document:

**1. Component Overview**
- Name, purpose, and usage guidance
- When to use / when NOT to use
- Relationship to other components (contains, is contained by, composable with)

**2. Anatomy**
- Label every element in the component (e.g. container, icon, label, trailing action)
- For each element: element type, role, required vs. optional

**3. Visual Specifications**
- Spacing (internal padding, gap between elements) mapped to design tokens
- Size variants with exact dimensions
- Color tokens for each element in each state
- Typography tokens
- Border, shadow, and radius tokens

**4. States**
Document every state with visual diff from default:
default / hover / focus / active / disabled / error / loading / success / selected

**5. Behavior & Interactions**
- Click/tap behavior
- Keyboard interactions
- Focus management
- Animation/transition specs (duration, easing, properties)

**6. Accessibility**
- ARIA role and required attributes
- Keyboard navigation
- Screen reader copy for each state

**7. Edge Cases & Content Guidelines**
- Min/max content length
- Truncation behavior
- RTL layout behavior
- Responsive behavior

**8. Implementation Notes**
- Any performance considerations
- Known gotchas for the target tech stack

If the designer has Figma exports, screenshots, or existing specs to share, ask them to upload the files.

Output as clean markdown with code examples in the target framework where relevant.${componentDesign ? `\n\nComponent design provided:\n${componentDesign}` : ""}${techStack ? `\n\nTech stack:\n${techStack}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            DELIVER
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Component Spec Generator</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>
          Generate complete component specs — anatomy, all states, behavior, spacing, and edge cases — ready for developer handoff
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              COMPONENT DESIGN <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={componentDesign}
              onChange={setComponentDesign}
              placeholder="Describe the component — what it does, what interactions it supports, and any relevant design decisions. Paste screenshots, Figma URLs, or design notes. You can also upload Figma exports or screenshots directly in Claude.ai."
              rows={5}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              TECH STACK <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={techStack}
              onChange={setTechStack}
              placeholder="What framework and design system are you delivering to? (e.g. React + Tailwind, iOS SwiftUI, Android Compose, Vue + custom CSS)"
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
