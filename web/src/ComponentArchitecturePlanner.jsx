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

export default function ComponentArchitecturePlanner() {
  const [designContext, setDesignContext] = useState("");
  const [systemContext, setSystemContext] = useState("");
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    return `You are a senior design systems engineer helping a designer plan their component architecture before building in Figma.

Start by understanding the scope:
- How many screens or states are involved?
- Is this net-new design or are we extending an existing system?
- What's the delivery format — Figma components, React components, or both?

Produce a complete component architecture document:

1. **Component Inventory** — List every component needed. For each:
   - Component name (use the design system naming convention)
   - Type: atom / molecule / organism / template
   - Variants needed (e.g. size: sm/md/lg, state: default/hover/active/disabled/error)
   - Props or Figma properties
   - Which design tokens it consumes (color, spacing, typography, radius)

2. **Token Assignment** — Map every visual decision to a token:
   - Background colors → semantic tokens (e.g. \`surface/primary\`, \`surface/elevated\`)
   - Text colors → \`text/primary\`, \`text/secondary\`, \`text/disabled\`
   - Borders → \`border/default\`, \`border/focus\`, \`border/error\`
   - Spacing → spacing scale tokens
   - Border radius → radius tokens

3. **Component Hierarchy** — Show how components compose together (which organisms contain which molecules)

4. **Figma Setup Notes** — Recommended auto-layout settings, component naming, variant property names, and any tricky interactive states to plan for

If the designer has wireframes, existing Figma files, or a design brief to share, ask them to upload the files.

Output as clean markdown with tables for the component inventory and token assignments.${designContext ? `\n\nDesign context:\n${designContext}` : ""}${systemContext ? `\n\nDesign system context:\n${systemContext}` : ""}`;
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "32px 24px", fontFamily: T.font.sans, color: T.text }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ background: T.accent + "22", color: T.accent, padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600, letterSpacing: "0.05em" }}>
            PROTOTYPE
          </span>
        </div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>Component Architecture Planner</h1>
        <p style={{ margin: "0 0 32px", color: T.muted, fontSize: 16, lineHeight: 1.5 }}>Define every component, variant, and token assignment before opening Figma</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 28 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              DESIGN CONTEXT <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={designContext}
              onChange={setDesignContext}
              placeholder="Describe the feature or screen set you're designing. What components will you need? Paste any wireframes, flow maps, or screen inventories."
              rows={4}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: T.muted, marginBottom: 6, fontFamily: T.font.mono, letterSpacing: "0.08em" }}>
              DESIGN SYSTEM CONTEXT <span style={{ color: T.dim }}>(optional)</span>
            </label>
            <Textarea
              value={systemContext}
              onChange={setSystemContext}
              placeholder="What design system or component library exists? (e.g. custom, Material, Radix, shadcn). Any token or naming conventions to follow?"
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
