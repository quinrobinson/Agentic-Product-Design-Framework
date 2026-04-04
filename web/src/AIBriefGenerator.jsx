import { useState } from "react";

const T = {
  bg: "#0F0F0F", surface: "#161616", card: "#1C1C1C", border: "#2A2A2A",
  text: "#F2F2F2", muted: "#999999", dim: "#666666",
  accent: "#3B82F6", accentDim: "rgba(59,130,246,0.12)", accentBorder: "rgba(59,130,246,0.25)",
};

const PHASE_SKILLS = {
  discover:  { color: "#22C55E", dim: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  label: "Discover",  skills: ["user-research.md", "competitive-analysis.md"] },
  define:    { color: "#8B5CF6", dim: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)", label: "Define",    skills: ["problem-framing.md"] },
  ideate:    { color: "#F59E0B", dim: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", label: "Ideate",    skills: ["concept-generation.md", "visual-design-execution.md"] },
  prototype: { color: "#3B82F6", dim: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", label: "Prototype", skills: ["prototyping.md", "accessibility-audit.md"] },
  validate:  { color: "#EF4444", dim: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)",  label: "Validate",  skills: ["usability-testing.md"] },
  deliver:   { color: "#14B8A6", dim: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)", label: "Deliver",   skills: ["design-delivery.md", "design-system-audit.md"] },
  unsure:    { color: "#64748B", dim: "rgba(100,116,139,0.12)",border: "rgba(100,116,139,0.25)",label: "Not sure",  skills: ["user-research.md", "problem-framing.md"] },
};

const SKILL_WHY = {
  "user-research.md":           "synthesise interviews, surveys, and analytics into a structured research brief",
  "competitive-analysis.md":    "map direct, indirect, and aspirational competitors — patterns, gaps, and opportunities",
  "problem-framing.md":         "convert research into a sharp HMW or JTBD problem statement with prioritised requirements",
  "concept-generation.md":      "generate multiple concept directions with UI pattern recommendations and visual scaffolding",
  "visual-design-execution.md": "build a full token system — colour, type, spacing, motion — ready for Figma",
  "prototyping.md":             "build functional React or HTML prototypes with correct interactions and a QA checklist",
  "accessibility-audit.md":     "run a WCAG 2.1 AA audit with severity-ranked issues and specific fixes",
  "usability-testing.md":       "plan test sessions, write task scenarios, and synthesise findings into ranked recommendations",
  "design-delivery.md":         "produce component specs, platform handoff packages, and decision records for engineering",
  "design-system-audit.md":     "audit your system against Material Design 3, Carbon, and Atlassian with token documentation",
};

const PHASE_FIRST_ACTION = {
  discover:  "Start by asking me 3–5 targeted research questions based on my project context that would help frame the most important unknowns. Then propose a research plan: what methods to use, who to recruit, and what we most need to learn.",
  define:    "Review my project context and help me frame the core problem. Produce a sharp HMW statement, a JTBD framing, and a prioritised requirements list (must-have / should-have / out of scope). Flag any assumptions we should validate before moving forward.",
  ideate:    "Based on my context, generate 3–5 distinct concept directions ranging from conventional to ambitious. For each, describe the core interaction model, key screens, and the UX tradeoff it makes. Then recommend which direction to explore first and why.",
  prototype: "Review what I have and help me plan the prototype. Identify the 3–5 highest-risk flows to build first, suggest the right fidelity level, and outline the component list. Then ask me what success looks like so we can write test criteria before we build.",
  validate:  "Help me design a usability test for this project. Write 3–4 task scenarios, define success criteria for each, and suggest the right test format (moderated vs. unmoderated). Ask me what assumptions we most need to validate.",
  deliver:   "Review my project context and help me plan the handoff. Identify the components that need full specs, flag accessibility requirements to document, and ask me about the engineering environment so we can structure the delivery package correctly.",
  unsure:    "Based on my context, recommend which phase I should start in and explain why. Then ask me 3 questions that would help you confirm the recommendation and identify the most important first step.",
};

function buildPrompt(form) {
  const phase = PHASE_SKILLS[form.phase] || PHASE_SKILLS.unsure;
  const projectTypeLabel = { "new-product": "a new product built from scratch", "feature": "a feature addition to an existing product", "redesign": "a redesign of an existing product", "internal-tool": "an internal tool built for a team", "client-work": "a client engagement with external stakeholders" }[form.projectType] || form.projectType;
  const whatYouHaveLabel = { "nothing": "nothing yet", "brief": "a project brief", "brief-research": "a project brief plus existing research", "existing-designs": "existing designs to work from" }[form.whatYouHave] || form.whatYouHave;
  const teamLabel = { "solo": "working solo", "small": "a small team (2-5)", "larger": "a larger cross-functional team (6+)", "client": "working with a client / external stakeholders" }[form.team] || form.team;
  const timelineLabel = { "sprint": "1-2 weeks", "month": "3-4 weeks", "quarter": "~3 months", "ongoing": "ongoing / no fixed end" }[form.timeline] || form.timeline;
  const lines = [];
  lines.push(`I am working on ${form.projectName || "a design project"} -- ${projectTypeLabel}.`);
  lines.push("");
  if (form.productDescription) { lines.push("## What I'm designing"); lines.push(form.productDescription); lines.push(""); }
  lines.push("## Project context");
  lines.push(`- **Phase I'm entering:** ${phase.label}`);
  lines.push(`- **What I have:** ${whatYouHaveLabel}`);
  lines.push(`- **Team:** ${teamLabel}`);
  lines.push(`- **Timeline:** ${timelineLabel}`);
  if (form.goals) lines.push(`- **Goals & success metrics:** ${form.goals}`);
  if (form.constraints) lines.push(`- **Known constraints:** ${form.constraints}`);
  lines.push("");
  lines.push("## Skill file");
  lines.push(`I have uploaded ${phase.skills[0]} -- the ${phase.label} skill for this framework. Use it to guide your outputs, structure, and quality criteria for this phase.`);
  if (phase.skills.length > 1) lines.push(`After this session I will also upload: ${phase.skills.slice(1).join(", ")}.`);
  lines.push("");
  lines.push("## Framework");
  lines.push("We are using the Agentic Product Design Framework -- a six-phase system (Discover to Define to Ideate to Prototype to Validate to Deliver). Each phase produces structured outputs that feed the next.");
  lines.push("");
  lines.push("## What I need from you now");
  lines.push(PHASE_FIRST_ACTION[form.phase] || PHASE_FIRST_ACTION.unsure);
  return lines.join("\n");
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

const STEPS = [
  { id: 1, label: "Project",  short: "Type + phase"    },
  { id: 2, label: "Context",  short: "Team + timeline" },
  { id: 3, label: "Goals",    short: "Details + name"  },
  { id: 4, label: "Prompt",   short: "Ready to paste"  },
];

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

function TextInput({ value, onChange, placeholder }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />;
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ width: "100%", boxSizing: "border-box", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", color: T.text, fontSize: 13, lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", resize: "vertical", outline: "none", transition: "border-color 0.15s" }} onFocus={e => e.target.style.borderColor = T.accent} onBlur={e => e.target.style.borderColor = T.border} />;
}

function PromptResult({ prompt, form, onReset }) {
  const phase = PHASE_SKILLS[form.phase] || PHASE_SKILLS.unsure;
  return (
    <div>
      <SectionHeader step={4} title="Prompt ready" desc={`Starting in ${phase.label} · ${phase.skills.length} skill file${phase.skills.length > 1 ? "s" : ""} recommended. Paste this as your first message in Claude.`} />
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
        <Label>How to use</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            `Download and attach ${phase.skills.join(" and ")} to your Claude project or conversation`,
            "Open a new Claude Chat",
            "Paste the prompt below as your first message",
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: T.accent, marginTop: 2, flexShrink: 0 }}>0{i + 1}</span>
              <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: phase.color }}>Your Claude prompt</span>
          <CopyBtn text={prompt} label="Copy prompt" />
        </div>
        <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.muted, lineHeight: 1.9, margin: 0, padding: "18px 20px", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 400, overflowY: "auto" }}>{prompt}</pre>
      </div>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
        <Label>Skills for this phase</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.skills.map((skill, i) => (
            <div key={skill} style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", gap: 12, background: T.surface, borderRadius: 6, padding: "10px 14px", border: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: phase.color, background: phase.dim, border: `1px solid ${phase.border}`, padding: "3px 10px", borderRadius: 4, whiteSpace: "nowrap" }}>{skill}</span>
              <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.5 }}><span style={{ color: T.text, fontWeight: 500 }}>{i === 0 ? "Upload first — " : "Upload after — "}</span>{SKILL_WHY[skill] || "activate the structured workflow for this phase"}</span>
            </div>
          ))}
        </div>
      </div>
      <Btn variant="ghost" onClick={onReset}>← New brief</Btn>
    </div>
  );
}

export default function AIBriefGenerator() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [form, setForm] = useState({ projectName: "", projectType: "", phase: "", whatYouHave: "", team: "", timeline: "", productDescription: "", goals: "", constraints: "" });
  const [prompt, setPrompt] = useState(null);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function mark(id) { setCompleted(p => [...new Set([...p, id])]); }

  const canNext1 = form.projectType && form.phase;
  const canNext2 = form.whatYouHave && form.team && form.timeline;
  const canSubmit = form.projectName.trim().length > 0;

  function generate() { mark(3); setPrompt(buildPrompt(form)); }
  function reset() { setPrompt(null); setStep(1); setCompleted([]); setForm({ projectName: "", projectType: "", phase: "", whatYouHave: "", team: "", timeline: "", productDescription: "", goals: "", constraints: "" }); }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", padding: "40px 32px", fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 760, margin: "0 auto 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBorder}`, padding: "3px 10px", borderRadius: 4 }}>Cross-phase · Tool 01</span>
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 400, margin: "0 0 8px", color: T.text }}>AI Brief Generator</h1>
        <p style={{ fontSize: 14, color: T.muted, margin: 0, lineHeight: 1.6, maxWidth: 520 }}>Answer three questions about your project and get a Claude-ready prompt — with the right skill files, phase context, and a first action tailored to where you are.</p>
      </div>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <StepIndicator current={prompt ? 4 : step} completed={prompt ? [1,2,3,4] : completed} />
        {prompt && <PromptResult prompt={prompt} form={form} onReset={reset} />}
        {!prompt && (
          <>
            {step === 1 && (
              <div>
                <SectionHeader step={1} title="Project type + phase" desc="What kind of project is this and which phase are you entering? This shapes how Claude frames the problem and what it focuses on first." />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <Label>Project type</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[{ id: "new-product", label: "New product", icon: "✦" }, { id: "feature", label: "Feature addition", icon: "◈" }, { id: "redesign", label: "Redesign", icon: "◎" }, { id: "internal-tool", label: "Internal tool", icon: "◧" }, { id: "client-work", label: "Client work", icon: "◆" }].map(t => (
                        <Chip key={t.id} selected={form.projectType === t.id} onClick={() => set("projectType", t.id)}><span style={{ fontSize: 13 }}>{t.icon}</span> {t.label}</Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Phase entering</Label>
                    <p style={{ fontSize: 12, color: T.dim, margin: "0 0 10px", lineHeight: 1.5 }}>Pick your starting point — or "Not sure" and Claude will recommend.</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {Object.entries(PHASE_SKILLS).map(([id, p]) => (
                        <Chip key={id} selected={form.phase === id} onClick={() => set("phase", id)} color={p.color} dim={p.dim} border={p.border}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "block", flexShrink: 0 }} />{p.label}
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
                <SectionHeader step={2} title="Your context" desc="A few quick details so Claude knows exactly where you are and what you're working with." />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <Label>What do you have so far?</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[{ id: "nothing", label: "Nothing yet" }, { id: "brief", label: "A project brief" }, { id: "brief-research", label: "Brief + research" }, { id: "existing-designs", label: "Existing designs" }].map(w => (
                        <Chip key={w.id} selected={form.whatYouHave === w.id} onClick={() => set("whatYouHave", w.id)}>{w.label}</Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Team setup</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[{ id: "solo", label: "Solo", desc: "Just me" }, { id: "small", label: "Small team", desc: "2-5 people" }, { id: "larger", label: "Larger team", desc: "6+ cross-functional" }, { id: "client", label: "With a client", desc: "External stakeholders" }].map(t => (
                        <Chip key={t.id} selected={form.team === t.id} onClick={() => set("team", t.id)}>{t.label}<span style={{ fontSize: 11, color: T.dim, fontWeight: 400 }}> — {t.desc}</span></Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Timeline</Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[{ id: "sprint", label: "Sprint", desc: "1-2 weeks" }, { id: "month", label: "Month", desc: "3-4 weeks" }, { id: "quarter", label: "Quarter", desc: "3 months" }, { id: "ongoing", label: "Ongoing", desc: "No fixed end" }].map(t => (
                        <Chip key={t.id} selected={form.timeline === t.id} onClick={() => set("timeline", t.id)}>{t.label}<span style={{ fontSize: 11, color: T.dim, fontWeight: 400 }}> — {t.desc}</span></Chip>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" onClick={() => setStep(1)}>← Back</Btn>
                    <Btn onClick={() => { mark(2); setStep(3); }} disabled={!canNext2}>Goals →</Btn>
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <SectionHeader step={3} title="Goals + details" desc="The more specific you are here, the sharper Claude's first response will be." />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div><FieldLabel>Project name</FieldLabel><TextInput value={form.projectName} onChange={v => set("projectName", v)} placeholder="e.g. Healthtrack Mobile Redesign" /></div>
                  <div><FieldLabel hint="Describe the product or feature and the people who will use it.">What are you designing? Who is it for?</FieldLabel><TextArea value={form.productDescription} onChange={v => set("productDescription", v)} placeholder="e.g. A mobile app for nurses to track patient vitals during shift handoff" /></div>
                  <div><FieldLabel hint="What does success look like? Include both business and user outcomes.">Goals + success metrics</FieldLabel><TextArea value={form.goals} onChange={v => set("goals", v)} placeholder="e.g. Reduce handoff errors by 30%, nurses complete check-ins in under 2 minutes" /></div>
                  <div><FieldLabel hint="Technical limitations, timeline pressure, stakeholder requirements.">Known constraints (optional)</FieldLabel><TextArea value={form.constraints} onChange={v => set("constraints", v)} placeholder="e.g. Must work on hospital-issued iPads, integrate with Epic EHR, ship by Q3" /></div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                    <Btn variant="ghost" onClick={() => setStep(2)}>← Back</Btn>
                    <Btn onClick={generate} disabled={!canSubmit}>Build prompt →</Btn>
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
