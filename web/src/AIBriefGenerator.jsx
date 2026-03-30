import { useState } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const DS = {
  dark: "#0F172A", darkCard: "#1E293B", darkBorder: "#334155",
  white: "#FFFFFF", bodyLight: "#94A3B8", bodyDark: "#64748B",
  light: "#F8FAFC", lightBorder: "#E2E8F0",
};

// ── Skill map by phase ────────────────────────────────────────────────────────
const PHASE_SKILLS = {
  discover:  { color: "#22C55E", label: "Discover",  skills: ["user-research.md", "competitive-analysis.md"] },
  define:    { color: "#8B5CF6", label: "Define",    skills: ["problem-framing.md"] },
  ideate:    { color: "#F59E0B", label: "Ideate",    skills: ["concept-generation.md", "visual-design-execution.md"] },
  prototype: { color: "#3B82F6", label: "Prototype", skills: ["prototyping.md", "accessibility-audit.md"] },
  validate:  { color: "#EF4444", label: "Validate",  skills: ["usability-testing.md"] },
  deliver:   { color: "#14B8A6", label: "Deliver",   skills: ["design-delivery.md", "design-system-audit.md"] },
  unsure:    { color: "#64748B", label: "Not sure",  skills: ["user-research.md", "problem-framing.md"] },
};

// ── Skill rationale ───────────────────────────────────────────────────────────
const SKILL_WHY = {
  "user-research.md":         "synthesise interviews, surveys, and analytics into a structured research brief",
  "competitive-analysis.md":  "map direct, indirect, and aspirational competitors — patterns, gaps, and differentiation opportunities",
  "problem-framing.md":       "convert research into a sharp HMW or JTBD problem statement with prioritised requirements",
  "concept-generation.md":    "generate multiple concept directions with UI pattern recommendations and visual scaffolding",
  "visual-design-execution.md": "build a full token system — colour, type, spacing, motion — ready for Figma",
  "prototyping.md":           "build functional React or HTML prototypes with correct interactions and a QA checklist",
  "accessibility-audit.md":   "run a WCAG 2.1 AA audit with severity-ranked issues and specific fixes",
  "usability-testing.md":     "plan test sessions, write task scenarios, and synthesise findings into ranked recommendations",
  "design-delivery.md":       "produce component specs, platform handoff packages, and decision records for engineering",
  "design-system-audit.md":   "audit your system against Material Design 3, Carbon, and Atlassian with token documentation",
};

// ── Phase-specific first instructions ────────────────────────────────────────
const PHASE_FIRST_ACTION = {
  discover:  "Start by asking me 3–5 targeted research questions based on my project context that would help frame the most important unknowns. Then propose a research plan: what methods to use, who to recruit, and what we most need to learn.",
  define:    "Review my project context and help me frame the core problem. Produce a sharp HMW statement, a JTBD framing, and a prioritised requirements list (must-have / should-have / out of scope). Flag any assumptions we should validate before moving forward.",
  ideate:    "Based on my context, generate 3–5 distinct concept directions ranging from conventional to ambitious. For each, describe the core interaction model, key screens, and the UX tradeoff it makes. Then recommend which direction to explore first and why.",
  prototype: "Review what I have and help me plan the prototype. Identify the 3–5 highest-risk flows to build first, suggest the right fidelity level, and outline the component list. Then ask me what success looks like so we can write test criteria before we build.",
  validate:  "Help me design a usability test for this project. Write 3–4 task scenarios, define success criteria for each, and suggest the right test format (moderated vs. unmoderated). Ask me what assumptions we most need to validate.",
  deliver:   "Review my project context and help me plan the handoff. Identify the components that need full specs, flag accessibility requirements to document, and ask me about the engineering environment so we can structure the delivery package correctly.",
  unsure:    "Based on my context, recommend which phase I should start in and explain why. Then ask me 3 questions that would help you confirm the recommendation and identify the most important first step.",
};

// ── Assemble the Claude prompt ────────────────────────────────────────────────
function buildClaudePrompt(form) {
  const projectTypeLabel = {
    "new-product": "a new product built from scratch",
    "feature": "a feature addition to an existing product",
    "redesign": "a redesign of an existing product",
    "internal-tool": "an internal tool built for a team or operational use",
    "client-work": "a client engagement with external stakeholders",
  }[form.projectType] || form.projectType;

  const whatYouHaveLabel = {
    "nothing": "nothing yet — starting completely from scratch",
    "brief": "a project brief with some direction and goals",
    "brief-research": "a project brief plus existing user research",
    "existing-designs": "existing designs to work from",
  }[form.whatYouHave] || form.whatYouHave;

  const teamLabel = {
    "solo": "working solo",
    "small": "working with a small team of 2–5 people",
    "larger": "working with a larger cross-functional team of 6 or more",
    "client": "working with a client with external stakeholders involved",
  }[form.team] || form.team;

  const timelineLabel = {
    "sprint": "a sprint (1–2 weeks)",
    "month": "roughly a month (3–4 weeks)",
    "quarter": "a quarter (approximately 3 months)",
    "ongoing": "an ongoing engagement with no fixed end date",
  }[form.timeline] || form.timeline;

  const phase = PHASE_SKILLS[form.phase] || PHASE_SKILLS.unsure;
  const firstSkill = phase.skills[0];
  const additionalSkills = phase.skills.slice(1);
  const firstAction = PHASE_FIRST_ACTION[form.phase] || PHASE_FIRST_ACTION.unsure;

  const lines = [];

  lines.push(`I am working on ${form.projectName || "a design project"} — ${projectTypeLabel}.`);
  lines.push(``);

  if (form.productDescription) {
    lines.push(`## What I'm designing`);
    lines.push(form.productDescription);
    lines.push(``);
  }

  lines.push(`## Project context`);
  lines.push(`- **Phase I'm entering:** ${phase.label}`);
  lines.push(`- **What I have:** ${whatYouHaveLabel}`);
  lines.push(`- **Team:** ${teamLabel}`);
  lines.push(`- **Timeline:** ${timelineLabel}`);
  if (form.goals) {
    lines.push(`- **Goals & success metrics:** ${form.goals}`);
  }
  if (form.constraints) {
    lines.push(`- **Known constraints:** ${form.constraints}`);
  }
  lines.push(``);

  lines.push(`## Skill file`);
  lines.push(`I have uploaded \`${firstSkill}\` — the ${phase.label} skill for this framework. Use it to guide your outputs, structure, and quality criteria for this phase.`);
  if (additionalSkills.length > 0) {
    lines.push(`After this session I will also upload: ${additionalSkills.map(s => `\`${s}\``).join(", ")}.`);
  }
  lines.push(``);

  lines.push(`## Framework`);
  lines.push(`We are using the Agentic Product Design Framework — a six-phase system (Discover → Define → Ideate → Prototype → Validate → Deliver). Each phase produces structured outputs that feed the next. At the end of this session I will ask you to generate a Phase Handoff Block to carry full context into the next conversation.`);
  lines.push(``);

  lines.push(`## What I need from you now`);
  lines.push(firstAction);

  return lines.join("\n");
}

// ── Shared UI primitives ──────────────────────────────────────────────────────
function Chip({ selected, onClick, children, color }) {
  const [hov, setHov] = useState(false);
  const c = color || "#22C55E";
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 16px", borderRadius: 999, cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        border: selected ? `1.5px solid ${c}` : `1px solid ${DS.lightBorder}`,
        background: selected ? `${c}12` : DS.white,
        color: selected ? c : DS.bodyDark,
        transition: "all 0.15s ease",
        transform: hov && !selected ? "translateY(-1px)" : "none",
        outline: "none",
      }}
    >{children}</button>
  );
}

function StepDot({ n, active, done }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: done ? "#22C55E" : active ? DS.dark : DS.light,
      border: active || done ? "none" : `1px solid ${DS.lightBorder}`,
      fontSize: 11, fontWeight: 700,
      color: done || active ? DS.white : DS.bodyDark,
      flexShrink: 0, transition: "all 0.2s",
    }}>{done ? "✓" : n}</div>
  );
}

function Field({ label, hint, value, onChange, multiline, placeholder }) {
  const base = {
    width: "100%", boxSizing: "border-box",
    border: `1px solid ${DS.lightBorder}`, borderRadius: 10,
    padding: "11px 14px", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    color: "#0F172A", background: DS.white, outline: "none",
    lineHeight: 1.6, resize: "vertical", transition: "border-color 0.15s",
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{label}</label>
      {hint && <div style={{ fontSize: 11, color: DS.bodyDark, marginBottom: 8, lineHeight: 1.5 }}>{hint}</div>}
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base}
            onFocus={e => e.target.style.borderColor = "#22C55E"} onBlur={e => e.target.style.borderColor = DS.lightBorder} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, resize: undefined }}
            onFocus={e => e.target.style.borderColor = "#22C55E"} onBlur={e => e.target.style.borderColor = DS.lightBorder} />
      }
    </div>
  );
}

// ── Result ────────────────────────────────────────────────────────────────────
function PromptResult({ prompt, form, onReset }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const phase = PHASE_SKILLS[form.phase] || PHASE_SKILLS.unsure;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: DS.bodyDark, marginBottom: 10 }}>Prompt ready</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, fontWeight: 400, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.1 }}>{form.projectName || "Your project"}</h2>
        <p style={{ fontSize: 14, color: DS.bodyDark, margin: 0, lineHeight: 1.6 }}>
          Starting in <span style={{ color: phase.color, fontWeight: 600 }}>{phase.label}</span> · {phase.skills.length} skill {phase.skills.length === 1 ? "file" : "files"} recommended
        </p>
      </div>

      {/* How to use */}
      <div style={{ background: DS.darkCard, border: `1px solid ${DS.darkBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 12, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: DS.bodyLight, lineHeight: 1.6, flex: 1 }}>
          {[
            { n: "1", text: `Download and upload ${phase.skills.map(s => `\`${s}\``).join(" and ")} in Claude via Settings → Customize → Skills` },
            { n: "2", text: "Open a new Claude conversation" },
            { n: "3", text: "Paste the prompt below as your first message" },
          ].map(step => (
            <div key={step.n} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: phase.color, marginTop: 2, flexShrink: 0, minWidth: 14 }}>{step.n}.</span>
              <span dangerouslySetInnerHTML={{ __html: step.text.replace(/`([^`]+)`/g, `<code style="font-family:'JetBrains Mono',monospace;font-size:11px;background:#0F172A;color:#22C55E;padding:1px 6px;border-radius:4px">$1</code>`) }} />
            </div>
          ))}
        </div>
      </div>

      {/* The prompt — hero */}
      <div style={{ background: DS.dark, borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${DS.darkBorder}` }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: phase.color }}>
            Your Claude prompt
          </div>
          <button onClick={copy} style={{
            background: copied ? "#0D9488" : "#14B8A6", color: DS.dark,
            border: "none", borderRadius: 7, padding: "8px 18px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}>{copied ? "✓ Copied" : "Copy prompt"}</button>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "#CBD5E1", lineHeight: 1.9, margin: 0,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>{prompt}</pre>
        </div>
      </div>

      {/* Skill stack */}
      <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 16 }}>
          Skills for this phase
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase.skills.map((skill, i) => (
            <div key={skill} style={{
              display: "grid", gridTemplateColumns: "auto 1fr",
              alignItems: "center", gap: 14,
              background: DS.light, borderRadius: 10, padding: "12px 16px",
              border: `1px solid ${DS.lightBorder}`,
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: phase.color, background: `${phase.color}12`,
                border: `1px solid ${phase.color}44`,
                padding: "4px 12px", borderRadius: 6, whiteSpace: "nowrap",
              }}>{skill}</div>
              <div style={{ fontSize: 12, color: DS.bodyDark, lineHeight: 1.5 }}>
                <span style={{ color: "#0F172A", fontWeight: 500 }}>
                  {i === 0 ? "Upload first — " : "Upload after — "}
                </span>
                {SKILL_WHY[skill] || "activate the structured workflow for this phase"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onReset} style={{
          background: DS.white, border: `1px solid ${DS.lightBorder}`,
          borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 500,
          color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>← New brief</button>
        <button onClick={copy} style={{
          background: copied ? "#0D9488" : "#14B8A6", color: DS.dark,
          border: "none", borderRadius: 8, padding: "10px 20px",
          fontSize: 13, fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
        }}>{copied ? "✓ Copied" : "Copy prompt"}</button>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AIBriefGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectName: "", projectType: "", phase: "", whatYouHave: "",
    team: "", timeline: "", productDescription: "", goals: "", constraints: "",
  });
  const [prompt, setPrompt] = useState(null);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const canNext1 = form.projectType && form.phase;
  const canNext2 = form.whatYouHave && form.team && form.timeline;
  const canSubmit = form.projectName.trim().length > 0;

  function generate() {
    setPrompt(buildClaudePrompt(form));
  }

  function reset() {
    setPrompt(null); setStep(1);
    setForm({ projectName: "", projectType: "", phase: "", whatYouHave: "", team: "", timeline: "", productDescription: "", goals: "", constraints: "" });
  }

  const progress = prompt ? 100 : ((step - 1) / 3) * 100;

  return (
    <div style={{ minHeight: "100vh", background: DS.light, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ background: DS.dark, borderBottom: `1px solid ${DS.darkBorder}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 14, height: 56, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", display: "block" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#3B82F6", letterSpacing: 2, textTransform: "uppercase" }}>AI Brief Generator</span>
        </div>
        <div style={{ width: 1, height: 16, background: DS.darkBorder }} />
        <span style={{ fontSize: 13, color: DS.bodyLight }}>
          {prompt ? "Prompt ready — copy and paste into Claude" : "Answer 3 questions. Get a Claude-ready project prompt."}
        </span>
        <div style={{ marginLeft: "auto", fontSize: 11, color: DS.bodyDark, fontFamily: "'JetBrains Mono', monospace" }}>Agentic Product Design Framework</div>
      </div>

      {/* Progress */}
      <div style={{ height: 2, background: DS.darkBorder }}>
        <div style={{ height: "100%", background: "#3B82F6", width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      {/* Body */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 40px 80px" }}>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>

        {prompt && <PromptResult prompt={prompt} form={form} onReset={reset} />}

        {!prompt && (
          <>
            {/* Step indicators */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
              {[{ n: 1, label: "Project type" }, { n: 2, label: "Your context" }, { n: 3, label: "Goals & details" }].map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StepDot n={s.n} active={step === s.n} done={step > s.n} />
                    <span style={{ fontSize: 12, fontWeight: step === s.n ? 600 : 400, color: step === s.n ? "#0F172A" : DS.bodyDark }}>{s.label}</span>
                  </div>
                  {i < 2 && <div style={{ width: 32, height: 1, background: DS.lightBorder, margin: "0 12px" }} />}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>What kind of project is this?</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 32px", lineHeight: 1.6 }}>This shapes how Claude frames the problem and what it focuses on first.</p>

                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Project type</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      { id: "new-product",   label: "New Product",      icon: "✦" },
                      { id: "feature",       label: "Feature Addition", icon: "◈" },
                      { id: "redesign",      label: "Redesign",         icon: "◎" },
                      { id: "internal-tool", label: "Internal Tool",    icon: "◧" },
                      { id: "client-work",   label: "Client Work",      icon: "◆" },
                    ].map(t => (
                      <Chip key={t.id} selected={form.projectType === t.id} onClick={() => set("projectType", t.id)} color="#3B82F6">
                        <span style={{ fontSize: 14 }}>{t.icon}</span> {t.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>Which phase are you entering?</div>
                  <div style={{ fontSize: 11, color: DS.bodyDark, marginBottom: 12 }}>Pick your starting point — or "Not sure yet" and Claude will recommend.</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {Object.entries(PHASE_SKILLS).map(([id, p]) => (
                      <Chip key={id} selected={form.phase === id} onClick={() => set("phase", id)} color={p.color}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "block" }} />
                        {p.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!canNext1}
                  style={{ background: canNext1 ? "#0F172A" : DS.lightBorder, color: canNext1 ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canNext1 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>What's your context?</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 32px", lineHeight: 1.6 }}>A few quick details so Claude knows exactly where you are and what you're working with.</p>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>What do you have so far?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      { id: "nothing",          label: "Nothing yet" },
                      { id: "brief",            label: "A project brief" },
                      { id: "brief-research",   label: "Brief + research" },
                      { id: "existing-designs", label: "Existing designs" },
                    ].map(w => (
                      <Chip key={w.id} selected={form.whatYouHave === w.id} onClick={() => set("whatYouHave", w.id)} color="#8B5CF6">{w.label}</Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Team setup</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      { id: "solo",   label: "Solo",          desc: "Just me" },
                      { id: "small",  label: "Small team",    desc: "2–5 people" },
                      { id: "larger", label: "Larger team",   desc: "6+ cross-functional" },
                      { id: "client", label: "With a client", desc: "External stakeholders" },
                    ].map(t => (
                      <Chip key={t.id} selected={form.team === t.id} onClick={() => set("team", t.id)} color="#F59E0B">
                        {t.label}<span style={{ fontSize: 11, color: DS.bodyDark, fontWeight: 400 }}> — {t.desc}</span>
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Timeline</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[
                      { id: "sprint",  label: "Sprint",  desc: "1–2 weeks" },
                      { id: "month",   label: "Month",   desc: "3–4 weeks" },
                      { id: "quarter", label: "Quarter", desc: "3 months" },
                      { id: "ongoing", label: "Ongoing", desc: "No fixed end" },
                    ].map(t => (
                      <Chip key={t.id} selected={form.timeline === t.id} onClick={() => set("timeline", t.id)} color="#EF4444">
                        {t.label}<span style={{ fontSize: 11, color: DS.bodyDark, fontWeight: 400 }}> — {t.desc}</span>
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                  <button onClick={() => setStep(3)} disabled={!canNext2}
                    style={{ background: canNext2 ? "#0F172A" : DS.lightBorder, color: canNext2 ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canNext2 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>Goals & details</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 28px", lineHeight: 1.6 }}>The more specific you are here, the sharper Claude's first response will be.</p>

                <Field label="Project name *" placeholder="e.g. Healthtrack Mobile Redesign" value={form.projectName} onChange={v => set("projectName", v)} />
                <Field label="What are you designing? Who is it for?" hint="Describe the product or feature and the people who will use it." placeholder="e.g. A mobile app for nurses to track patient vitals during shift handoff" value={form.productDescription} onChange={v => set("productDescription", v)} multiline />
                <Field label="Goals & success metrics" hint="What does success look like? Include both business and user outcomes." placeholder="e.g. Reduce handoff errors by 30%, nurses complete check-ins in under 2 minutes" value={form.goals} onChange={v => set("goals", v)} multiline />
                <Field label="Known constraints" hint="Technical limitations, timeline pressure, stakeholder requirements." placeholder="e.g. Must work on hospital-issued iPads, integrate with Epic EHR, ship by Q3" value={form.constraints} onChange={v => set("constraints", v)} multiline />

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => setStep(2)} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                  <button onClick={generate} disabled={!canSubmit}
                    style={{ background: canSubmit ? "#3B82F6" : DS.lightBorder, color: canSubmit ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canSubmit ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                    Build prompt ✦
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
