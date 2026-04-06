import { useState, useRef, useEffect } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  accent: "#14B8A6", accentDim: "rgba(20,184,166,0.12)", accentBorder: "rgba(20,184,166,0.25)",
};

const STEPS = [
  { id: 1, label: "Goal",     short: "Goal + audience"   },
  { id: 2, label: "Context",  short: "Phase + tone"      },
  { id: 3, label: "Details",  short: "Content + context" },
  { id: 4, label: "Deck",     short: "Ready to present"  },
];

const DECK_GOALS = [
  { id: "align",            icon: "◈", label: "Align on direction",      desc: "Get stakeholders to agree on a path forward" },
  { id: "present-concepts", icon: "✦", label: "Present design concepts",  desc: "Share initial ideas or directions for feedback" },
  { id: "share-research",   icon: "◎", label: "Share research findings",  desc: "Present what you learned from users" },
  { id: "approval",         icon: "◆", label: "Get approval to proceed",  desc: "Seek sign-off to move to the next phase" },
  { id: "handoff",          icon: "◧", label: "Deliver final designs",    desc: "Present the completed work for launch" },
  { id: "retrospective",    icon: "◉", label: "Project retrospective",    desc: "Recap the full project and outcomes" },
];

const AUDIENCE_OPTIONS = [
  { id: "exec",               label: "Executive / C-suite",    desc: "High level, business impact focused" },
  { id: "client-stakeholders",label: "Client stakeholders",    desc: "Decision makers, not designers" },
  { id: "product-team",       label: "Product & engineering",  desc: "Technical audience, implementation focus" },
  { id: "design-team",        label: "Design team",            desc: "Craft, rationale, and process focused" },
  { id: "mixed",              label: "Mixed audience",         desc: "Designers + non-designers in the room" },
];

const PHASE_OPTIONS = [
  { id: "discover",  label: "Discover",  color: "#22C55E", dim: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)"  },
  { id: "define",    label: "Define",    color: "#8B5CF6", dim: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" },
  { id: "ideate",    label: "Ideate",    color: "#F59E0B", dim: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  { id: "prototype", label: "Prototype", color: "#3B82F6", dim: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)" },
  { id: "validate",  label: "Validate",  color: "#EF4444", dim: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)"  },
  { id: "deliver",   label: "Deliver",   color: "#14B8A6", dim: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)" },
];

const TONE_OPTIONS = [
  { id: "strategic",     label: "Strategic",     desc: "Business outcomes, ROI, vision" },
  { id: "collaborative", label: "Collaborative", desc: "Invites feedback, frames open questions" },
  { id: "confident",     label: "Confident",     desc: "Strong point of view, clear recommendations" },
  { id: "educational",   label: "Educational",   desc: "Explains the process and reasoning" },
];

function buildPrompt(form) {
  return `You are an expert design strategist helping a UX designer build a client presentation deck.

CONTEXT:
CLIENT / PROJECT NAME: ${form.projectName || "Not specified"}
DECK GOAL: ${form.deckGoal}
AUDIENCE: ${form.audience}
PHASES COMPLETED: ${form.phasesCompleted.length > 0 ? form.phasesCompleted.join(", ") : "Not specified"}
TONE: ${form.tone}
KEY DECISIONS MADE: ${form.keyDecisions || "Not specified"}
KEY FINDINGS OR INSIGHTS: ${form.keyFindings || "Not specified"}
WHAT APPROVAL OR ACTION IS NEEDED: ${form.desiredOutcome || "Not specified"}
ADDITIONAL CONTEXT: ${form.additionalContext || "None"}

Return ONLY valid JSON, no markdown, no backticks:

{
  "deckTitle": "Specific, compelling title for this deck",
  "deckType": "Name for this type of deck",
  "deckTypeReason": "1 sentence: why this deck type fits this goal and audience",
  "narrativeArc": "2-3 sentences describing the story this deck tells from first slide to last",
  "estimatedSlides": 12,
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "Cover",
      "title": "Specific slide title",
      "speakerNotes": "What to say on this slide -- 2-4 sentences as natural speech.",
      "designerTip": "One practical tip for what to show visually",
      "keyMessage": "The one thing the audience should take away"
    }
  ],
  "openingHook": "The first sentence to say when you open the presentation",
  "closingStatement": "The last sentence to say",
  "commonMistakesToAvoid": ["mistake 1", "mistake 2", "mistake 3"],
  "followUpActions": ["action 1", "action 2", "action 3"]
}

Aim for ${form.estimatedLength === "short" ? "8-10" : form.estimatedLength === "long" ? "16-20" : "12-15"} slides. Every slide must have a specific, non-generic title. Speaker notes should feel like coaching for this specific audience.`;
}

function Label({ children }) {
  return <div style={{ marginBottom: 8 }}><span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: T.accent }}>{children}</span></div>;
}

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const p = variant === "primary";
  return <button onClick={onClick} disabled={disabled} style={{ padding: small ? "7px 14px" : "10px 20px", fontSize: small ? 11 : 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 6, border: "1.5px solid", borderColor: p ? T.accent : T.border, background: p ? T.accent : "transparent", color: p ? T.bg : T.muted, opacity: disabled ? 0.4 : 1, transition: "all 0.15s" }} onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.85"; }} onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}>{children}</button>;
}

function CopyBtn({ text, label = "Copy" }) {
  const [c, setC] = useState(false);
  return <Btn small variant="ghost" onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 1800); }}>{c ? "✓ Copied" : label}</Btn>;
}

function Chip({ children, selected, onClick, color, dim, border }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, border: `1.5px solid ${selected ? (border || T.accentBorder) : T.border}`, background: selected ? (dim || T.accentDim) : "transparent", color: selected ? (color || T.accent) : T.muted, transition: "all 0.15s", outline: "none" }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = color || T.accent; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = T.border; }}
    >{children}</button>
  );
}

function SectionHeader({ step, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBorder}`, padding: "2px 8px", borderRadius: 4 }}>Step {step}</span>
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
              <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: done ? T.accent : active ? T.accentDim : "transparent", border: `1.5px solid ${done ? T.accent : active ? T.accent : T.border}`, color: done ? T.bg : active ? T.accent : T.dim, transition: "all 0.2s" }}>{done ? "✓" : s.id}</div>
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: active ? T.accent : done ? T.muted : T.dim, whiteSpace: "nowrap" }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, marginBottom: 18, marginLeft: 4, marginRight: 4, background: done ? T.accent : T.border, transition: "background 0.3s" }} />}
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div style={{ marginBottom: hint ? 6 : 8 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: hint ? 3 : 0 }}>{children}</div>
      {hint && <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />;
}

function TextInput({ value, onChange, placeholder }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />;
}

function LoadingState() {
  const [dot, setDot] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const t1 = setInterval(() => setDot(d => d === 3 ? 1 : d + 1), 500);
    const t2 = setInterval(() => setActiveStep(s => Math.min(s + 1, 3)), 2000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);
  const steps = ["Identifying the right deck type", "Structuring the narrative arc", "Writing slide-by-slide content", "Crafting speaker notes & tips"];
  return (
    <div style={{ padding: "56px 0", textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: T.text, marginBottom: 8 }}>Building your deck{".".repeat(dot)}</div>
      <div style={{ fontSize: 13, color: T.dim, marginBottom: 32 }}>Tailoring a presentation for your audience and goal</div>
      <div style={{ maxWidth: 300, margin: "0 auto" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, opacity: i <= activeStep ? 1 : 0.3, transition: "opacity 0.4s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: i < activeStep ? T.accent : i === activeStep ? T.accentDim : "transparent", border: i < activeStep ? "none" : `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 9, color: i < activeStep ? T.bg : T.dim, fontWeight: 700 }}>{i < activeStep ? "✓" : i + 1}</div>
            <span style={{ fontSize: 12, color: i <= activeStep ? T.text : T.dim, fontWeight: i === activeStep ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCard({ slide, isOpen, onToggle }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${isOpen ? T.accentBorder : T.border}`, borderRadius: 8, marginBottom: 6, overflow: "hidden", transition: "border-color 0.15s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: isOpen ? T.accent : T.card, border: `1px solid ${isOpen ? "transparent" : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 700, color: isOpen ? T.bg : T.dim, fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s" }}>
          {String(slide.slideNumber).padStart(2, "0")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{slide.title}</div>
          <div style={{ fontSize: 10, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{slide.slideType}</div>
        </div>
        {slide.keyMessage && !isOpen && (
          <div style={{ fontSize: 11, color: T.dim, maxWidth: 260, textAlign: "right", lineHeight: 1.4, fontStyle: "italic" }}>"{slide.keyMessage}"</div>
        )}
        <span style={{ color: T.dim, fontSize: 12, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "none" }}>→</span>
      </button>
      {isOpen && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent, marginBottom: 8 }}>Speaker notes</div>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, margin: 0 }}>{slide.speakerNotes}</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: T.dim, marginBottom: 6 }}>Key message</div>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, margin: "0 0 14px", fontWeight: 500 }}>{slide.keyMessage}</p>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: T.dim, marginBottom: 6 }}>Visual tip</div>
              <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.6, margin: 0 }}>{slide.designerTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeckResult({ deck, onReset }) {
  const [openSlide, setOpenSlide] = useState(1);
  return (
    <div>
      <SectionHeader step={4} title="Deck ready" desc={`${deck.deckType} · ${deck.estimatedSlides} slides — ${deck.deckTypeReason}`} />

      {/* Narrative arc */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
        <Label>Narrative arc</Label>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.75, margin: 0 }}>{deck.narrativeArc}</p>
      </div>

      {/* Opening hook + closing */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[{ label: "Opening hook", text: deck.openingHook }, { label: "Closing statement", text: deck.closingStatement }].map(item => (
          <div key={item.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: T.dim }}>{item.label}</div>
              <CopyBtn text={item.text || ""} />
            </div>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{item.text}"</p>
          </div>
        ))}
      </div>

      {/* Slides */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: T.dim, marginBottom: 10 }}>Slides — click to expand</div>
        {(deck.slides || []).map(slide => (
          <SlideCard key={slide.slideNumber} slide={slide} isOpen={openSlide === slide.slideNumber} onToggle={() => setOpenSlide(openSlide === slide.slideNumber ? null : slide.slideNumber)} />
        ))}
      </div>

      {/* Mistakes + Follow-ups */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Mistakes to avoid", items: deck.commonMistakesToAvoid || [], color: "#EF4444" },
          { label: "Follow-up actions", items: deck.followUpActions || [], color: T.accent },
        ].map(section => (
          <div key={section.label} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: section.color, marginBottom: 12 }}>{section.label}</div>
            {section.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: section.color, flexShrink: 0, marginTop: 6 }} />
                <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.55 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Btn variant="ghost" onClick={onReset}>← Build a new deck</Btn>
    </div>
  );
}

export default function ClientDeckBuilder() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [form, setForm] = useState({ projectName: "", deckGoal: "", audience: "", phasesCompleted: [], currentPhase: "", tone: "", keyDecisions: "", keyFindings: "", desiredOutcome: "", additionalContext: "", estimatedLength: "medium" });
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function mark(id) { setCompleted(p => [...new Set([...p, id])]); }
  function togglePhase(id) { setForm(f => ({ ...f, phasesCompleted: f.phasesCompleted.includes(id) ? f.phasesCompleted.filter(p => p !== id) : [...f.phasesCompleted, id] })); }

  const canNext1 = form.deckGoal && form.audience;
  const canNext2 = form.tone;
  const canSubmit = form.projectName.trim().length > 0;

  async function generate() {
    setLoading(true); setError(null);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-5-20250514", max_tokens: 1000, messages: [{ role: "user", content: buildPrompt(form) }] }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setDeck(JSON.parse(clean));
      mark(3);
    } catch (e) { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  function reset() { setDeck(null); setStep(1); setCompleted([]); setForm({ projectName: "", deckGoal: "", audience: "", phasesCompleted: [], currentPhase: "", tone: "", keyDecisions: "", keyFindings: "", desiredOutcome: "", additionalContext: "", estimatedLength: "medium" }); }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBorder}`, padding: "3px 10px", borderRadius: 4 }}>All phases · Tool 02</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, margin: "0 0 8px", color: T.text }}>Client Deck Builder</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6, maxWidth: 520 }}>Tell Claude your goal, audience, and where you are in the project — it builds a slide-by-slide structure with speaker notes, talking points, and an opening hook tailored to your room.</p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto" }} ref={topRef}>
        <StepIndicator current={deck ? 4 : step} completed={deck ? [1,2,3,4] : completed} />

        {loading && <LoadingState />}

        {!loading && deck && <DeckResult deck={deck} onReset={reset} />}

        {!loading && !deck && (
          <>
            {step === 1 && (
              <div>
                <SectionHeader step={1} title="Goal + audience" desc="The goal and audience shape everything — the deck type, narrative, slide count, and tone." />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <Label>What does this deck need to accomplish?</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {DECK_GOALS.map(g => (
                        <Chip key={g.id} selected={form.deckGoal === g.id} onClick={() => set("deckGoal", g.id)}>
                          <span style={{ fontSize: 13 }}>{g.icon}</span>
                          <div><div>{g.label}</div><div style={{ fontSize: 10, color: T.dim, fontWeight: 400 }}>{g.desc}</div></div>
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Who is in the room?</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {AUDIENCE_OPTIONS.map(a => (
                        <Chip key={a.id} selected={form.audience === a.id} onClick={() => set("audience", a.id)}>
                          <div><div>{a.label}</div><div style={{ fontSize: 10, color: T.dim, fontWeight: 400 }}>{a.desc}</div></div>
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Btn onClick={() => { mark(1); setStep(2); }} disabled={!canNext1}>Context →</Btn>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <SectionHeader step={2} title="Phase + tone" desc="This tells Claude what work exists to reference and what narrative arc to build." />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <Label>Phases completed</Label>
                    <p style={{ fontSize: 12, color: T.dim, margin: "0 0 10px", lineHeight: 1.5 }}>Select all that apply — these become the substance of the deck.</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {PHASE_OPTIONS.map(p => (
                        <Chip key={p.id} selected={form.phasesCompleted.includes(p.id)} onClick={() => togglePhase(p.id)} color={p.color} dim={p.dim} border={p.border}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "block", flexShrink: 0 }} />{p.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Tone</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {TONE_OPTIONS.map(t => (
                        <Chip key={t.id} selected={form.tone === t.id} onClick={() => set("tone", t.id)}>
                          <div><div>{t.label}</div><div style={{ fontSize: 10, color: T.dim, fontWeight: 400 }}>{t.desc}</div></div>
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Deck length</Label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ id: "short", label: "Short", desc: "8-10 slides" }, { id: "medium", label: "Standard", desc: "12-15 slides" }, { id: "long", label: "Comprehensive", desc: "16-20 slides" }].map(l => (
                        <Chip key={l.id} selected={form.estimatedLength === l.id} onClick={() => set("estimatedLength", l.id)}>
                          <div><div>{l.label}</div><div style={{ fontSize: 10, color: T.dim, fontWeight: 400 }}>{l.desc}</div></div>
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
                    <Btn onClick={() => { mark(2); setStep(3); }} disabled={!canNext2}>Details →</Btn>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <SectionHeader step={3} title="Content + context" desc="The more specific you are, the more tailored the speaker notes and slide content will be." />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <FieldLabel>Client or project name</FieldLabel>
                    <TextInput value={form.projectName} onChange={v => set("projectName", v)} placeholder="e.g. Meridian Health — Patient Portal Redesign" />
                  </div>
                  <div>
                    <FieldLabel hint="What did you decide, and why? These become your rationale slides.">Key decisions made so far</FieldLabel>
                    <TextArea value={form.keyDecisions} onChange={v => set("keyDecisions", v)} placeholder="e.g. Chose a card-based layout over a list view based on user mental models." />
                  </div>
                  <div>
                    <FieldLabel hint="What did research or testing reveal? What surprised you?">Key findings or insights</FieldLabel>
                    <TextArea value={form.keyFindings} onChange={v => set("keyFindings", v)} placeholder="e.g. 78% of users abandoned onboarding at step 3." />
                  </div>
                  <div>
                    <FieldLabel hint="Approval, feedback, a decision, alignment on next steps?">What do you need from this meeting?</FieldLabel>
                    <TextArea value={form.desiredOutcome} onChange={v => set("desiredOutcome", v)} placeholder="e.g. Sign-off on the selected concept direction to move into high-fidelity design." />
                  </div>
                  <div>
                    <FieldLabel hint="Stakeholder sensitivities, prior feedback, project history. (optional)">Anything else Claude should know?</FieldLabel>
                    <TextArea value={form.additionalContext} onChange={v => set("additionalContext", v)} placeholder="e.g. The CTO is skeptical of a full redesign — lean on data." />
                  </div>
                  {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#EF4444" }}>{error}</div>}
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
                    <Btn onClick={generate} disabled={!canSubmit}>Build deck →</Btn>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
