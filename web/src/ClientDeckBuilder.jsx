import { useState, useRef, useEffect } from "react";

const DS = {
  dark: "#0F172A", darkCard: "#1E293B", darkBorder: "#334155",
  white: "#FFFFFF", bodyLight: "#94A3B8", bodyDark: "#64748B",
  light: "#F8FAFC", lightBorder: "#E2E8F0",
  phases: {
    "01": { color: "#22C55E", label: "Discover" },
    "02": { color: "#8B5CF6", label: "Define" },
    "03": { color: "#F59E0B", label: "Ideate" },
    "04": { color: "#3B82F6", label: "Prototype" },
    "05": { color: "#EF4444", label: "Validate" },
    "06": { color: "#14B8A6", label: "Deliver" },
  },
};

const DECK_GOALS = [
  { id: "align", icon: "◈", label: "Align on direction", desc: "Get stakeholders to agree on a path forward" },
  { id: "present-concepts", icon: "✦", label: "Present design concepts", desc: "Share initial ideas or directions for feedback" },
  { id: "share-research", icon: "◎", label: "Share research findings", desc: "Present what you learned from users" },
  { id: "approval", icon: "◆", label: "Get approval to proceed", desc: "Seek sign-off to move to the next phase" },
  { id: "handoff", icon: "◧", label: "Deliver final designs", desc: "Present the completed work for launch" },
  { id: "retrospective", icon: "◉", label: "Project retrospective", desc: "Recap the full project and outcomes" },
];

const AUDIENCE_OPTIONS = [
  { id: "exec", label: "Executive / C-suite", desc: "High level, business impact focused" },
  { id: "client-stakeholders", label: "Client stakeholders", desc: "Decision makers, not designers" },
  { id: "product-team", label: "Product & engineering", desc: "Technical audience, implementation focus" },
  { id: "design-team", label: "Design team", desc: "Craft, rationale, and process focused" },
  { id: "mixed", label: "Mixed audience", desc: "Designers + non-designers in the room" },
];

const PHASE_OPTIONS = [
  { id: "discover", label: "Discover", color: "#22C55E" },
  { id: "define", label: "Define", color: "#8B5CF6" },
  { id: "ideate", label: "Ideate", color: "#F59E0B" },
  { id: "prototype", label: "Prototype", color: "#3B82F6" },
  { id: "validate", label: "Validate", color: "#EF4444" },
  { id: "deliver", label: "Deliver", color: "#14B8A6" },
];

const TONE_OPTIONS = [
  { id: "strategic", label: "Strategic", desc: "Business outcomes, ROI, vision" },
  { id: "collaborative", label: "Collaborative", desc: "Invites feedback, frames open questions" },
  { id: "confident", label: "Confident", desc: "Strong point of view, clear recommendations" },
  { id: "educational", label: "Educational", desc: "Explains the process and reasoning" },
];

function buildPrompt(form) {
  return `You are an expert design strategist helping a UX designer build a client presentation deck using the AI × UX Product Design Framework.

Here is the context for this deck:

CLIENT / PROJECT NAME: ${form.projectName || "Not specified"}
DECK GOAL: ${form.deckGoal}
AUDIENCE: ${form.audience}
PHASES COMPLETED: ${form.phasesCompleted.length > 0 ? form.phasesCompleted.join(", ") : "Not specified"}
CURRENT PHASE / WHERE WE ARE: ${form.currentPhase || "Not specified"}
TONE: ${form.tone}
KEY DECISIONS MADE: ${form.keyDecisions || "Not specified"}
KEY FINDINGS OR INSIGHTS: ${form.keyFindings || "Not specified"}
WHAT APPROVAL OR ACTION IS NEEDED: ${form.desiredOutcome || "Not specified"}
ADDITIONAL CONTEXT: ${form.additionalContext || "None"}

Based on this, generate a complete client deck structure. Think carefully about the goal and audience — the deck type, narrative arc, and slide count should match exactly what this situation calls for.

Return ONLY valid JSON, no markdown, no backticks:

{
  "deckTitle": "Specific, compelling title for this deck (not generic)",
  "deckType": "Name for this type of deck (e.g. 'Research Readout', 'Concept Presentation', 'Design Review', 'Project Retrospective')",
  "deckTypeReason": "1 sentence: why this deck type fits this goal and audience",
  "narrativeArc": "2–3 sentences describing the story this deck tells from first slide to last",
  "estimatedSlides": 12,
  "slides": [
    {
      "slideNumber": 1,
      "slideType": "Cover",
      "title": "Specific slide title",
      "speakerNotes": "What to say on this slide — 2–4 sentences written as natural speech, not bullets. Address the audience directly.",
      "designerTip": "One practical tip for what to show visually on this slide",
      "keyMessage": "The one thing the audience should take away from this slide"
    }
  ],
  "openingHook": "The first sentence to say when you open the presentation — should immediately establish relevance for this specific audience",
  "closingStatement": "The last sentence to say — leaves the room with the right feeling and clear next step",
  "commonMistakesToAvoid": ["mistake 1 specific to this audience/goal", "mistake 2", "mistake 3"],
  "followUpActions": ["specific action 1 after presenting this deck", "action 2", "action 3"]
}

The slides array must contain ALL slides — aim for ${form.estimatedLength === "short" ? "8–10" : form.estimatedLength === "long" ? "16–20" : "12–15"} slides. Each slide must have a specific, non-generic title. Speaker notes should feel like coaching — tell the designer exactly what to say and how to land the point with this specific audience. The deck should have a clear beginning (context), middle (the work/findings), and end (next steps/ask).`;
}

function Chip({ selected, onClick, color, children }) {
  const [hovered, setHovered] = useState(false);
  const accent = color || "#14B8A6";
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px",
        borderRadius: 999, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: 500, outline: "none",
        border: selected ? `1.5px solid ${accent}` : `1px solid ${DS.lightBorder}`,
        background: selected ? `${accent}12` : DS.white,
        color: selected ? accent : DS.bodyDark,
        transition: "all 0.15s ease",
        transform: hovered && !selected ? "translateY(-1px)" : "none",
      }}
    >{children}</button>
  );
}

function Field({ label, hint, value, onChange, multiline, placeholder, required }) {
  const base = {
    width: "100%", boxSizing: "border-box", border: `1px solid ${DS.lightBorder}`,
    borderRadius: 10, padding: "11px 14px", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    color: "#0F172A", background: DS.white, outline: "none", lineHeight: 1.6, resize: "vertical",
    transition: "border-color 0.15s",
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 3 }}>*</span>}
      </label>
      {hint && <div style={{ fontSize: 11, color: DS.bodyDark, marginBottom: 8, lineHeight: 1.5 }}>{hint}</div>}
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base}
            onFocus={e => e.target.style.borderColor = "#14B8A6"} onBlur={e => e.target.style.borderColor = DS.lightBorder} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, resize: undefined }}
            onFocus={e => e.target.style.borderColor = "#14B8A6"} onBlur={e => e.target.style.borderColor = DS.lightBorder} />
      }
    </div>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
      background: done ? "#14B8A6" : active ? DS.dark : DS.light,
      border: active || done ? "none" : `1px solid ${DS.lightBorder}`,
      fontSize: 11, fontWeight: 700, color: done || active ? DS.white : DS.bodyDark,
      flexShrink: 0, transition: "all 0.2s",
    }}>{done ? "✓" : n}</div>
  );
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
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: DS.dark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <span style={{ fontSize: 22 }}>◆</span>
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#0F172A", marginBottom: 8 }}>Building your deck{".".repeat(dot)}</div>
      <div style={{ fontSize: 13, color: DS.bodyDark, marginBottom: 32 }}>Claude is tailoring a presentation for your audience and goal</div>
      <div style={{ maxWidth: 300, margin: "0 auto" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, opacity: i <= activeStep ? 1 : 0.3, transition: "opacity 0.4s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: i < activeStep ? "#14B8A6" : i === activeStep ? DS.dark : DS.light, border: i < activeStep ? "none" : `1px solid ${DS.lightBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 9, color: i < activeStep ? DS.white : DS.bodyDark, fontWeight: 700 }}>{i < activeStep ? "✓" : i + 1}</div>
            <span style={{ fontSize: 12, color: i <= activeStep ? "#0F172A" : DS.bodyDark, fontWeight: i === activeStep ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCard({ slide, isOpen, onToggle, accentColor }) {
  return (
    <div style={{ background: DS.white, border: `1px solid ${isOpen ? accentColor + "55" : DS.lightBorder}`, borderRadius: 12, marginBottom: 8, overflow: "hidden", transition: "border-color 0.2s" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: isOpen ? accentColor : DS.light, border: `1px solid ${isOpen ? "transparent" : DS.lightBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: isOpen ? DS.white : DS.bodyDark, fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s" }}>
          {String(slide.slideNumber).padStart(2, "0")}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{slide.title}</div>
          <div style={{ fontSize: 11, color: DS.bodyDark, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{slide.slideType}</div>
        </div>
        {slide.keyMessage && !isOpen && (
          <div style={{ fontSize: 11, color: DS.bodyDark, maxWidth: 280, textAlign: "right", lineHeight: 1.4, fontStyle: "italic" }}>"{slide.keyMessage}"</div>
        )}
        <span style={{ color: accentColor, fontSize: 14, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(90deg)" : "none" }}>→</span>
      </button>
      {isOpen && (
        <div style={{ borderTop: `1px solid ${DS.lightBorder}`, padding: "18px 18px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 8 }}>Speaker notes</div>
              <p style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.7, margin: 0 }}>{slide.speakerNotes}</p>
            </div>
            <div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 8 }}>Key message</div>
              <p style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.7, margin: "0 0 14px", fontWeight: 500 }}>{slide.keyMessage}</p>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: accentColor, marginBottom: 6 }}>Visual tip</div>
              <p style={{ fontSize: 12, color: DS.bodyDark, lineHeight: 1.6, margin: 0 }}>{slide.designerTip}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeckResult({ deck, onReset, onCopyHook, onCopyClose, copiedHook, copiedClose }) {
  const [openSlide, setOpenSlide] = useState(1);
  const accentColor = "#14B8A6";

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: DS.bodyDark, marginBottom: 10 }}>Deck Ready</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, fontWeight: 400, color: "#0F172A", margin: "0 0 6px", lineHeight: 1.1 }}>{deck.deckTitle}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 20, background: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}40`, fontWeight: 500 }}>{deck.deckType}</span>
              <span style={{ fontSize: 12, color: DS.bodyDark }}>{deck.estimatedSlides} slides</span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 13, color: DS.bodyDark, marginTop: 10, lineHeight: 1.7, maxWidth: 640 }}>{deck.deckTypeReason}</p>
      </div>

      {/* Narrative arc */}
      <div style={{ background: DS.dark, borderRadius: 12, padding: "18px 22px", marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: accentColor, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Narrative arc</div>
        <p style={{ fontSize: 13, color: DS.bodyLight, lineHeight: 1.75, margin: 0 }}>{deck.narrativeArc}</p>
      </div>

      {/* Opening hook + closing */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark }}>Opening hook</div>
            <button onClick={onCopyHook} style={{ background: copiedHook ? accentColor : "transparent", color: copiedHook ? DS.white : accentColor, border: `1px solid ${accentColor}55`, borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>{copiedHook ? "✓ Copied" : "Copy"}</button>
          </div>
          <p style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{deck.openingHook}"</p>
        </div>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark }}>Closing statement</div>
            <button onClick={onCopyClose} style={{ background: copiedClose ? accentColor : "transparent", color: copiedClose ? DS.white : accentColor, border: `1px solid ${accentColor}55`, borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>{copiedClose ? "✓ Copied" : "Copy"}</button>
          </div>
          <p style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>"{deck.closingStatement}"</p>
        </div>
      </div>

      {/* Slides */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 14 }}>Slide-by-slide — click to expand</div>
        {(deck.slides || []).map(slide => (
          <SlideCard key={slide.slideNumber} slide={slide} isOpen={openSlide === slide.slideNumber} onToggle={() => setOpenSlide(openSlide === slide.slideNumber ? null : slide.slideNumber)} accentColor={accentColor} />
        ))}
      </div>

      {/* Mistakes + Follow-ups */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: "#EF4444", marginBottom: 12 }}>Common mistakes to avoid</div>
          {(deck.commonMistakesToAvoid || []).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: "#0F172A", lineHeight: 1.55 }}>{m}</span>
            </div>
          ))}
        </div>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: accentColor, marginBottom: 12 }}>Follow-up actions</div>
          {(deck.followUpActions || []).map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: accentColor, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: "#0F172A", lineHeight: 1.55 }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onReset} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Build a new deck</button>
    </div>
  );
}

export default function ClientDeckBuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectName: "", deckGoal: "", audience: "", phasesCompleted: [],
    currentPhase: "", tone: "", keyDecisions: "", keyFindings: "",
    desiredOutcome: "", additionalContext: "", estimatedLength: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState(null);
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedClose, setCopiedClose] = useState(false);
  const topRef = useRef(null);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function togglePhase(id) {
    setForm(f => ({
      ...f,
      phasesCompleted: f.phasesCompleted.includes(id)
        ? f.phasesCompleted.filter(p => p !== id)
        : [...f.phasesCompleted, id],
    }));
  }

  const canNext1 = form.deckGoal && form.audience;
  const canNext2 = form.tone;
  const canSubmit = form.projectName.trim().length > 0;

  async function generate() {
    setLoading(true);
    setError(null);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt(form) }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setDeck(parsed);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setDeck(null); setStep(1);
    setForm({ projectName: "", deckGoal: "", audience: "", phasesCompleted: [], currentPhase: "", tone: "", keyDecisions: "", keyFindings: "", desiredOutcome: "", additionalContext: "", estimatedLength: "medium" });
  }

  function copyHook() { if (deck?.openingHook) { navigator.clipboard.writeText(deck.openingHook); setCopiedHook(true); setTimeout(() => setCopiedHook(false), 2000); } }
  function copyClose() { if (deck?.closingStatement) { navigator.clipboard.writeText(deck.closingStatement); setCopiedClose(true); setTimeout(() => setCopiedClose(false), 2000); } }

  const progress = loading || deck ? 100 : ((step - 1) / 3) * 100;
  const accentColor = "#14B8A6";

  return (
    <div style={{ minHeight: "100vh", background: DS.light, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ background: DS.dark, borderBottom: `1px solid ${DS.darkBorder}`, padding: "16px 40px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, display: "block" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: accentColor, letterSpacing: 2, textTransform: "uppercase" }}>Deliver phase</span>
        </div>
        <div style={{ width: 1, height: 16, background: DS.darkBorder }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: DS.white }}>Client Deck Builder</span>
        <div style={{ marginLeft: "auto", fontSize: 11, color: DS.bodyLight, fontFamily: "'JetBrains Mono', monospace", opacity: 0.5 }}>AI × UX Product Design Framework</div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: DS.darkBorder }}>
        <div style={{ height: "100%", background: accentColor, width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 40px" }} ref={topRef}>

        {loading && <LoadingState />}

        {!loading && deck && (
          <DeckResult deck={deck} onReset={reset} onCopyHook={copyHook} onCopyClose={copyClose} copiedHook={copiedHook} copiedClose={copiedClose} />
        )}

        {!loading && !deck && (
          <>
            {/* Step indicators */}
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36 }}>
              {[{ n: 1, label: "Goal & audience" }, { n: 2, label: "Where you are" }, { n: 3, label: "Content & context" }].map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StepDot n={s.n} active={step === s.n} done={step > s.n} />
                    <span style={{ fontSize: 12, fontWeight: step === s.n ? 600 : 400, color: step === s.n ? "#0F172A" : DS.bodyDark }}>{s.label}</span>
                  </div>
                  {i < 2 && <div style={{ width: 32, height: 1, background: DS.lightBorder, margin: "0 12px" }} />}
                </div>
              ))}
            </div>

            <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>

            {/* Step 1 — Goal & audience */}
            {step === 1 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>What does this deck need to accomplish?</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 28px", lineHeight: 1.6 }}>The goal and audience shape everything — the deck type, narrative, slide count, and tone.</p>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>What's the goal of this presentation?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {DECK_GOALS.map(g => (
                      <Chip key={g.id} selected={form.deckGoal === g.id} onClick={() => set("deckGoal", g.id)} color={accentColor}>
                        <span style={{ fontSize: 14 }}>{g.icon}</span>
                        <div>
                          <div>{g.label}</div>
                          <div style={{ fontSize: 10, color: DS.bodyDark, fontWeight: 400 }}>{g.desc}</div>
                        </div>
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Who is in the room?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {AUDIENCE_OPTIONS.map(a => (
                      <Chip key={a.id} selected={form.audience === a.id} onClick={() => set("audience", a.id)} color={accentColor}>
                        <div>
                          <div>{a.label}</div>
                          <div style={{ fontSize: 10, color: DS.bodyDark, fontWeight: 400 }}>{a.desc}</div>
                        </div>
                      </Chip>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!canNext1} style={{ background: canNext1 ? "#0F172A" : DS.lightBorder, color: canNext1 ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canNext1 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>Continue →</button>
              </div>
            )}

            {/* Step 2 — Where you are */}
            {step === 2 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>Where are you in the project?</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 28px", lineHeight: 1.6 }}>This tells Claude what work exists to reference and what the narrative arc should cover.</p>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>Phases completed <span style={{ fontWeight: 400, color: DS.bodyDark }}>(select all that apply)</span></div>
                  <div style={{ fontSize: 11, color: DS.bodyDark, marginBottom: 12 }}>These become the substance of the deck — what you've done, what you found, what you decided.</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PHASE_OPTIONS.map(p => (
                      <Chip key={p.id} selected={form.phasesCompleted.includes(p.id)} onClick={() => togglePhase(p.id)} color={p.color}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "block" }} />
                        {p.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Presentation tone</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TONE_OPTIONS.map(t => (
                      <Chip key={t.id} selected={form.tone === t.id} onClick={() => set("tone", t.id)} color={accentColor}>
                        <div>
                          <div>{t.label}</div>
                          <div style={{ fontSize: 10, color: DS.bodyDark, fontWeight: 400 }}>{t.desc}</div>
                        </div>
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Deck length</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[{ id: "short", label: "Short", desc: "8–10 slides" }, { id: "medium", label: "Standard", desc: "12–15 slides" }, { id: "long", label: "Comprehensive", desc: "16–20 slides" }].map(l => (
                      <Chip key={l.id} selected={form.estimatedLength === l.id} onClick={() => set("estimatedLength", l.id)} color={accentColor}>
                        <div><div>{l.label}</div><div style={{ fontSize: 10, color: DS.bodyDark, fontWeight: 400 }}>{l.desc}</div></div>
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                  <button onClick={() => setStep(3)} disabled={!canNext2} style={{ background: canNext2 ? "#0F172A" : DS.lightBorder, color: canNext2 ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canNext2 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3 — Content & context */}
            {step === 3 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>Content & context</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 28px", lineHeight: 1.6 }}>The more specific you are, the more tailored the speaker notes and slide content will be.</p>

                <Field label="Client or project name" required placeholder="e.g. Meridian Health — Patient Portal Redesign" value={form.projectName} onChange={v => set("projectName", v)} />
                <Field label="Key decisions made so far" hint="What did you decide, and why? These become your rationale slides." placeholder="e.g. Chose a card-based layout over a list view based on user mental models. Dropped the dashboard in favor of task-focused navigation." value={form.keyDecisions} onChange={v => set("keyDecisions", v)} multiline />
                <Field label="Key findings or insights" hint="What did research or testing reveal? What surprised you?" placeholder="e.g. 78% of users abandoned the current onboarding at step 3. Caregivers, not patients, are the primary users of the appointment scheduling feature." value={form.keyFindings} onChange={v => set("keyFindings", v)} multiline />
                <Field label="What do you need from this meeting?" hint="Approval, feedback, a decision, alignment on next steps?" placeholder="e.g. Sign-off on the selected concept direction to move into high-fidelity design. Agreement on which user segment to prioritize." value={form.desiredOutcome} onChange={v => set("desiredOutcome", v)} multiline />
                <Field label="Anything else Claude should know?" hint="Stakeholder sensitivities, prior feedback, project history, political context." placeholder="e.g. The CTO is skeptical of a full redesign — lean on data. The PM previously pushed back on removing the legacy dashboard." value={form.additionalContext} onChange={v => set("additionalContext", v)} multiline />

                {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#991B1B" }}>{error}</div>}

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => setStep(2)} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                  <button onClick={generate} disabled={!canSubmit} style={{ background: canSubmit ? accentColor : DS.lightBorder, color: canSubmit ? DS.dark : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 700, cursor: canSubmit ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                    Build Deck ◆
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
