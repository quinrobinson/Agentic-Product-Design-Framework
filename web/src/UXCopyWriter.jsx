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

export default function UXCopyWriter() {
  const [voiceContext, setVoiceContext] = useState("");
  const [screensContext, setScreensContext] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior UX writer helping a designer write complete interface copy for a product.

Start by establishing the voice before writing any copy. Ask about:
- Who is the user — what's their mental model and vocabulary?
- What's the brand personality? (Ask for 3 adjectives if not provided)
- Are there any voice anti-patterns to avoid? (e.g. never be overly casual, never use jargon)
- What platform is this for — mobile, web, desktop?

Then produce copy across these areas:

1. **Voice Brief** — A short guide (1 page) capturing: personality, tone spectrum (formal ↔ casual), vocabulary rules, anti-patterns, and 3 "before/after" examples showing the voice in action

2. **Screen-by-Screen Copy** — For each screen or flow provided:
   - Headlines and subheadlines
   - Button labels and CTAs
   - Input labels and placeholder text
   - Helper text and inline guidance
   - Success messages

3. **Error States** — For each key action, write:
   - Validation errors (what went wrong, how to fix it)
   - System errors (what happened, what to do next)
   - Empty states (why it's empty, what to do)

4. **Microcopy** — Tooltips, confirmations, loading states, and notifications

If the designer has wireframes, screenshots, or a copy deck to share, ask them to upload the files.

Produce all copy in a clean markdown document organized by screen/flow, ready for Figma handoff.${voiceContext ? `\n\nProduct & voice context:\n${voiceContext}` : ""}${screensContext ? `\n\nScreens or flows to write copy for:\n${screensContext}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            PROTOTYPE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>UX Copy Writer</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Generate complete interface copy — voice brief, flow copy, error states, and empty states</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              PRODUCT & VOICE CONTEXT <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={voiceContext}
              onChange={setVoiceContext}
              placeholder="Describe the product, brand voice, and target user. What adjectives describe the voice? (e.g. warm, direct, expert, playful)"
              rows={4}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              SCREENS OR FLOWS <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={screensContext}
              onChange={setScreensContext}
              placeholder="Describe the screens or user flows you need copy for. Paste screen names, user actions, or wireframe notes. You can upload wireframes or screenshots in Claude.ai."
              rows={5}
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
