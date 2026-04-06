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

export default function ComponentStateSpecifier() {
  const [componentDescription, setComponentDescription] = useState("");
  const [platformConstraints, setPlatformConstraints] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior interaction designer helping a team fully specify a component — every state, transition, and Figma property — before it goes into production.

Start by clarifying:
- What's the component's primary job — what action does it enable or communicate?
- Who interacts with it — mouse users, keyboard users, touch users, screen reader users?
- Does it have persistent state (e.g. selected, saved) or is every interaction transient?

Produce a complete component specification:

1. **State Map** — Document every state the component can be in:
   - Default / Rest
   - Hover (mouse)
   - Focus (keyboard)
   - Active / Pressed
   - Disabled
   - Error / Invalid
   - Loading
   - Success
   - Selected / Checked / On
   - Empty (if applicable)
   For each state: visual description, token changes from default, cursor/pointer behavior

2. **Transitions** — For each state change:
   - Trigger (user action or system event)
   - Duration and easing
   - What changes (opacity, transform, color, size)
   - Any intermediate states

3. **Figma Properties** — The complete set of variant properties and their values. Format as:
   \`Property name: value1, value2, value3\`

4. **Accessibility Spec**
   - ARIA role and required attributes
   - Keyboard interactions (tab, enter, space, arrow keys)
   - Focus visible treatment
   - Screen reader announcements for state changes

5. **Edge Cases**
   - What happens with very long text?
   - What happens with RTL layout?
   - What if the action fails?

Output as a clean markdown spec document, ready for developer handoff.${componentDescription ? `\n\nComponent description:\n${componentDescription}` : ""}${platformConstraints ? `\n\nPlatform & constraints:\n${platformConstraints}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            PROTOTYPE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Component State Specifier</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Document every state, transition, and Figma property for one component at a time</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              COMPONENT DESCRIPTION <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={componentDescription}
              onChange={setComponentDescription}
              placeholder="What component are you specifying? Describe what it does, what interactions it supports, and any existing design context."
              rows={4}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              PLATFORM & CONSTRAINTS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={platformConstraints}
              onChange={setPlatformConstraints}
              placeholder="Web, iOS, Android? Any motion/animation constraints? Accessibility requirements to document?"
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
