import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  proto: "#3B82F6", protoDim: "rgba(59,130,246,0.12)", protoBorder: "rgba(59,130,246,0.25)",
};

const STEPS = [
  { id: 1, label: "Context",  short: "Product + persona"      },
  { id: 2, label: "Voice",    short: "Tone + style brief"     },
  { id: 3, label: "Copy",     short: "Flow copy + CTAs"       },
  { id: 4, label: "States",   short: "Errors + empty states"  },
  { id: 5, label: "Handoff",  short: "Full copy document"     },
];

async function callClaude(system, user, onChunk) {
  const res = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250514", max_tokens: 1000, stream: true,
      system, messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) { onChunk("⚠️ Error " + res.status + ". Check your API key and try again."); return ""; }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of dec.decode(value).split("\n").filter(l => l.startsWith("data: "))) {
      try {
        const j = JSON.parse(line.slice(6));
        if (j.type === "content_block_delta" && j.delta?.text) { full += j.delta.text; onChunk(full); }
      } catch {}
    }
  }
  return full;
}

function Label({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? 4 : 8 }}>
      <span style={{ fontSize: sub ? 11 : 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: sub ? T.muted : T.proto }}>{children}</span>
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 5, disabled }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled}
      style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px", color: T.text, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", opacity: disabled ? 0.5 : 1, transition: "border-color 0.15s" }}
      onFocus={e => e.target.style.borderColor = T.proto} onBlur={e => e.target.style.borderColor = T.border} />
  );
}

function Input({ value, onChange, placeholder, disabled }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s", opacity: disabled ? 0.5 : 1 }}
      onFocus={e => e.target.style.borderColor = T.proto} onBlur={e => e.target.style.borderColor = T.border} />
  );
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const isPrimary = variant === "primary";
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding: small ? "7px 14px" : "10px 20px", fontSize: small ? 11 : 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 6, border: "1.5px solid", borderColor: isPrimary ? T.proto : T.border, background: isPrimary ? T.proto : "transparent", color: isPrimary ? "#fff" : T.muted, opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >{children}</button>
  );
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn small variant="ghost" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
      {copied ? "✓ Copied" : "Copy"}
    </Btn>
  );
}

function OutputBlock({ content, streaming, maxH = 480 }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 18px", fontSize: 13, lineHeight: 1.7, color: T.text, fontFamily: "'DM Sans', sans-serif", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: maxH, overflowY: "auto" }}>
      {content || <span style={{ color: T.dim, fontStyle: "italic" }}>Output will appear here…</span>}
      {streaming && <span style={{ display: "inline-block", width: 6, height: 14, background: T.proto, marginLeft: 2, animation: "blink 0.8s step-end infinite", verticalAlign: "middle" }} />}
    </div>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto, background: T.protoDim, border: `1px solid ${T.protoBorder}`, padding: "2px 8px", borderRadius: 4 }}>Step {step}</span>
        <span style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>{title}</span>
      </div>
      {desc && <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0, maxWidth: 600 }}>{desc}</p>}
    </div>
  );
}

function StepIndicator({ current, completed }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const done = completed.includes(s.id), active = current === s.id;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 56 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: done ? T.proto : active ? T.protoDim : "transparent", border: `1.5px solid ${done ? T.proto : active ? T.proto : T.border}`, color: done ? "#fff" : active ? T.proto : T.dim, transition: "all 0.2s" }}>{done ? "✓" : s.id}</div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: active ? T.proto : done ? T.muted : T.dim, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4, background: done ? T.proto : T.border, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function UXCopyWriter() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");

  const [product, setProduct] = useState("");
  const [persona, setPersona] = useState("");
  const [flow, setFlow] = useState("");
  const [existingVoice, setExistingVoice] = useState("");

  const [voiceBrief, setVoiceBrief] = useState("");
  const [flowCopy, setFlowCopy] = useState("");
  const [errorCopy, setErrorCopy] = useState("");
  const [handoff, setHandoff] = useState("");

  const mark = (id) => setCompleted(p => [...new Set([...p, id])]);

  function dl(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleVoice() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX content strategist. Define a precise, usable voice brief — not aspirational brand fluff. Every element must be actionable: a writer should be able to apply it immediately.",
      `Define the voice and tone for this product.

Product: ${product}
Primary user: ${persona}
Existing voice guidance: ${existingVoice || "None — infer from product and user context"}

Produce a voice reference card:

## Voice (4 adjectives — what we always sound like)
[Adjective 1] — [one sentence: what this means in practice]
[Adjective 2] — [one sentence]
[Adjective 3] — [one sentence]
[Adjective 4] — [one sentence]

## Tone shifts (how we adjust by moment)
| Moment | Tone adjustment | Example phrase |
|---|---|---|
| First use / onboarding | [tone] | [example] |
| Mid-flow (task in progress) | [tone] | [example] |
| Error (something failed) | [tone] | [example] |
| Success (task complete) | [tone] | [example] |
| Empty state (nothing yet) | [tone] | [example] |

## We sound like → We don't sound like
✓ [Phrase they'd use] | ✗ [Phrase they'd never use]
✓ [Phrase] | ✗ [Phrase]
✓ [Phrase] | ✗ [Phrase]

## Words we use / avoid
✓ [Word] — [why] | ✗ [Word] — [why]
✓ [Word] — [why] | ✗ [Word] — [why]

## Reading level: [target — and why for this user]`,
      setStream
    );
    setVoiceBrief(result); setLoading(false); mark(2);
  }

  async function handleFlowCopy() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX writer generating complete interface copy. Every element of the copy must be grounded in the voice brief. Apply the copy quality standards: headlines lead with user benefit, CTAs are verb+noun, body copy earns every word.",
      `Write complete UX copy for every screen in this flow.

Product: ${product}
Primary persona: ${persona}
Voice brief: ${voiceBrief}

Flow to write copy for:
${flow}

For each screen, write:

## Screen: [Screen name]
**Headline:** [Primary message — user benefit, ≤7 words, present tense]
**Body:** [Supporting context — only if needed. 1–2 sentences max. Skip if headline is sufficient.]
**Primary CTA:** [Verb + noun — specific, not generic. Never just "Continue" or "Next"]
**Secondary actions:** [Back button, skip link, or alternative path text — if applicable]
**Form labels:** [Every field label — sentence case, noun phrase]
**Helper text:** [What user needs to know — what it does for them, not system constraints]
**Placeholder text:** [Example data, not re-stated label — e.g. "e.g. jane@work.com"]

Quality checks per screen:
- CTA uses verb + noun? ✓/✗
- Headline leads with user benefit? ✓/✗  
- Body copy earns every word? ✓/✗`,
      setStream
    );
    setFlowCopy(result); setLoading(false); mark(3);
  }

  async function handleErrorCopy() {
    setLoading(true); setStream("");
    const result = await callClaude(
      "You are a UX writer. Write error and empty state copy that is honest, helpful, and never blames the user. Apply the formula: [What happened] + [Why, if actionable] + [What to do]. Match severity to tone — minor errors stay light, data loss errors are serious.",
      `Write complete error state and empty state copy.

Product: ${product}
Voice brief: ${voiceBrief}
Flow context: ${flow}

## Error States

For each error, write:
- Headline (what happened — not just "Error")  
- Body (why + what to do — if user can act on it)
- Primary action (most helpful next step)
- Secondary action (escape route)

**1. Network / connection failure**
**2. Form validation — field level** (inline, adjacent to the field)
**3. Form validation — form level** (summary, top of form)
**4. Permission denied** (user lacks access)
**5. Not found** (content or resource doesn't exist)
**6. Timeout** (async operation too slow)
**7. [Infer 2 product-specific errors from the flow]**

---

## Empty States

For each empty state:
- Headline (what will appear here when there's content)
- Body (why it's empty + the first action to take)
- Primary CTA (to add the first item)

**1. First use** (most important — user has never added anything)
**2. Search returned no results**
**3. Filtered results are empty**
**4. User cleared everything** (intentional empty)

---

## Confirmation Dialogs (destructive actions)
For each irreversible action in the flow:
- Headline (what's about to happen — not "Are you sure?")
- Body (consequence in plain language)  
- Confirm CTA (the action, not "Yes")
- Cancel CTA (always "Cancel" or "Keep [thing]")`,
      setStream
    );
    setErrorCopy(result); setLoading(false); mark(4); setStep(5);
  }

  async function handleHandoff() {
    setLoading(true); setStream("");
    const allCopy = [flowCopy, errorCopy].filter(Boolean).join("\n\n---\n\n");
    const result = await callClaude(
      "You are a senior UX writer generating a complete copy handoff document. Organize the copy clearly for a developer or prototyper who wasn't in this session.",
      `Generate a complete UX copy handoff document.

Product: ${product}
Persona: ${persona}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Voice brief: ${voiceBrief}

All copy generated: ${allCopy}

Structure the handoff as:

# UX Copy Handoff: [Product/Feature Name]
Date: [date] | Phase: Prototype

---

## Voice Reference (3 sentences — key rules for this product)
[Distill the voice brief to 3 rules a developer can apply when encountering copy decisions]

## Complete Copy Inventory
[Organize all copy by screen — clearly labeled, easy to find]

## Error State Library
[All error and empty state copy — organized by error type]

## Copy Still Needed
[Any screens or states identified during this session that still need copy]

## Test Script Notes
[3–5 specific copy elements to observe closely during usability testing — labels that might be misread, CTAs that might be ambiguous, error messages to watch users react to]`,
      setStream
    );
    setHandoff(result); setLoading(false); mark(5);
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        :focus-visible { outline: 2px solid #999; outline-offset: 2px; border-radius: 4px; }
      `}</style>

      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 clamp(24px,5vw,80px)", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.proto, boxShadow: `0 0 8px ${T.proto}` }} />
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.proto }}>04 — Prototype</span>
          <span style={{ color: T.dim }}>·</span>
          <span style={{ fontSize: 15, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: T.text }}>UX Copy Writer</span>
        </div>
        {voiceBrief && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>voice locked</span>}
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px clamp(24px,5vw,80px) 96px" }}>
        <StepIndicator current={step} completed={completed} />

        {step === 1 && (
          <div>
            <SectionHeader step={1} title="Product Context" desc="Describe the product, the user, and the feature or flow needing copy. The more specific the input, the more grounded the copy." />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <Label>Product</Label>
                  <Input value={product} onChange={setProduct} placeholder="e.g. AI research synthesis tool for product designers" />
                </div>
                <div>
                  <Label>Primary persona</Label>
                  <Input value={persona} onChange={setPersona} placeholder="e.g. Senior product designer, time-constrained, uses Figma daily" />
                </div>
              </div>
              <div>
                <Label>Flow or screens to write copy for</Label>
                <Textarea value={flow} onChange={setFlow} rows={6} placeholder={"Describe each screen in the flow:\n\nScreen 1: Onboarding — user has just signed up, needs to connect their first project\nScreen 2: Upload — user uploads interview notes (PDF, doc, or text)\nScreen 3: Processing — system is analyzing the notes\nScreen 4: Results — themes and insights displayed\nScreen 5: Export — user sends results to Notion or Figma"} />
              </div>
              <div>
                <Label>Existing voice guidance (optional)</Label>
                <Input value={existingVoice} onChange={setExistingVoice} placeholder="e.g. Clear, confident, human. We say 'you' not 'users'. We avoid jargon. Comparable to Linear or Notion." />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn disabled={!product.trim() || !persona.trim() || !flow.trim()} onClick={() => { mark(1); setStep(2); }}>Define Voice →</Btn>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <SectionHeader step={2} title="Voice and Tone Brief" desc="Before writing a word of copy, lock the voice. Copy written without a voice brief produces generic, corporate-sounding text." />
            {!voiceBrief && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleVoice} disabled={loading}>{loading ? "Generating…" : "Generate Voice Brief"}</Btn></div>}
            {(stream || voiceBrief) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Voice reference card</Label>
                  {voiceBrief && !loading && <CopyBtn text={voiceBrief} />}
                </div>
                <OutputBlock content={loading ? stream : voiceBrief} streaming={loading} />
                {voiceBrief && !loading && (
                  <div style={{ marginTop: 12 }}>
                    <Label sub>Edit voice brief before locking (optional)</Label>
                    <Textarea value={voiceBrief} onChange={setVoiceBrief} rows={4} />
                    <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                      <Btn variant="ghost" small onClick={() => { setVoiceBrief(""); setStream(""); }}>Re-generate</Btn>
                      <Btn small onClick={() => { mark(2); setStep(3); }}>Write Flow Copy →</Btn>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <SectionHeader step={3} title="Flow Copy" desc="Complete copy for every screen — headlines, CTAs, labels, helper text, placeholders. Grounded in the voice brief." />
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
              <Label sub>Voice brief (locked)</Label>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0 }}>{voiceBrief.split("\n").slice(0, 3).join(" · ")}</p>
            </div>
            {!flowCopy && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleFlowCopy} disabled={loading}>{loading ? "Writing…" : "Write All Flow Copy"}</Btn></div>}
            {(stream || flowCopy) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Headlines · CTAs · labels · helper text per screen</Label>
                  {flowCopy && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={flowCopy} />
                      <Btn small variant="ghost" onClick={() => dl(flowCopy, "flow-copy.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : flowCopy} streaming={loading} maxH={520} />
                {flowCopy && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setFlowCopy(""); setStream(""); }}>Re-write</Btn>
                    <Btn small onClick={() => { mark(3); setStep(4); }}>Write Error States →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <SectionHeader step={4} title="Error States + Empty States" desc="The most under-written copy in most products. Complete error library, empty states, and confirmation dialogs." />
            {!errorCopy && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleErrorCopy} disabled={loading}>{loading ? "Writing…" : "Write Error + Empty States"}</Btn></div>}
            {(stream || errorCopy) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Error states · empty states · confirmations</Label>
                  {errorCopy && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={errorCopy} />
                      <Btn small variant="ghost" onClick={() => dl(errorCopy, "error-empty-states.md")}>↓ .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : errorCopy} streaming={loading} maxH={520} />
                {errorCopy && !loading && (
                  <div style={{ display: "flex", gap: 10, marginTop: 12, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" small onClick={() => { setErrorCopy(""); setStream(""); }}>Re-write</Btn>
                    <Btn small onClick={() => setStep(5)}>Generate Handoff →</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <SectionHeader step={5} title="Copy Handoff" desc="Complete copy document — organized for a developer or prototyper, with test script notes for the usability session." />
            {!handoff && <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn onClick={handleHandoff} disabled={loading}>{loading ? "Generating…" : "Generate Handoff Document"}</Btn></div>}
            {(stream || handoff) && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Label sub>Complete copy handoff document</Label>
                  {handoff && !loading && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <CopyBtn text={handoff} />
                      <Btn small variant="ghost" onClick={() => dl([voiceBrief, flowCopy, errorCopy, handoff].filter(Boolean).join("\n\n---\n\n"), "ux-copy-handoff.md")}>↓ Full .md</Btn>
                    </div>
                  )}
                </div>
                <OutputBlock content={loading ? stream : handoff} streaming={loading} maxH={520} />
                {handoff && !loading && (
                  <div style={{ marginTop: 20, padding: "14px 16px", background: T.protoDim, border: `1px solid ${T.protoBorder}`, borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.proto }}>
                      ✓ Copy complete — attach to prototype before usability testing
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
