import { useState, useRef, useEffect } from "react";

// ── Design tokens ────────────────────────────────────────────────────────────
const DS = {
  dark: "#0F172A", darkCard: "#1E293B", darkBorder: "#334155",
  white: "#FFFFFF", bodyLight: "#94A3B8", bodyDark: "#64748B",
  light: "#F8FAFC", lightBorder: "#E2E8F0",
};

// ── Form config ──────────────────────────────────────────────────────────────
const PROJECT_TYPES = [
  { id: "new-product",    label: "New Product",      icon: "✦", desc: "Building from scratch" },
  { id: "feature",        label: "Feature Addition", icon: "◈", desc: "Adding to an existing product" },
  { id: "redesign",       label: "Redesign",         icon: "◎", desc: "Rethinking what exists" },
  { id: "internal-tool",  label: "Internal Tool",    icon: "◧", desc: "Built for a team or ops" },
  { id: "client-work",    label: "Client Work",      icon: "◆", desc: "External engagement" },
];

const PHASE_OPTIONS = [
  { id: "discover",  label: "Discover",     color: "#22C55E", desc: "Research & insights" },
  { id: "define",    label: "Define",       color: "#8B5CF6", desc: "Problem framing" },
  { id: "ideate",    label: "Ideate",       color: "#F59E0B", desc: "Concepts & direction" },
  { id: "prototype", label: "Prototype",    color: "#3B82F6", desc: "Build & test" },
  { id: "validate",  label: "Validate",     color: "#EF4444", desc: "User testing" },
  { id: "deliver",   label: "Deliver",      color: "#14B8A6", desc: "Handoff & ship" },
  { id: "unsure",    label: "Not sure yet", color: "#64748B", desc: "Claude will recommend" },
];

const WHAT_YOU_HAVE = [
  { id: "nothing",          label: "Nothing yet",       desc: "Starting completely fresh" },
  { id: "brief",            label: "A project brief",   desc: "Some direction or goals" },
  { id: "brief-research",   label: "Brief + research",  desc: "Goals and user data" },
  { id: "existing-designs", label: "Existing designs",  desc: "Something to work from" },
];

const TEAM_OPTIONS = [
  { id: "solo",   label: "Solo",          desc: "Just me" },
  { id: "small",  label: "Small team",    desc: "2–5 people" },
  { id: "larger", label: "Larger team",   desc: "6+ cross-functional" },
  { id: "client", label: "With a client", desc: "External stakeholders involved" },
];

const TIMELINE_OPTIONS = [
  { id: "sprint",  label: "Sprint",  desc: "1–2 weeks" },
  { id: "month",   label: "Month",   desc: "3–4 weeks" },
  { id: "quarter", label: "Quarter", desc: "3 months" },
  { id: "ongoing", label: "Ongoing", desc: "No fixed end" },
];

// ── API prompt ───────────────────────────────────────────────────────────────
function buildPrompt(form) {
  return `You are an expert UX design strategist and AI workflow coach specialising in the Agentic Product Design Framework — a six-phase system: Discover → Define → Ideate → Prototype → Validate → Deliver.

Each phase has dedicated Claude skill files a designer can upload to activate structured AI workflows:
- Discover: user-research.md, competitive-analysis.md
- Define: problem-framing.md
- Ideate: concept-generation.md, visual-design-execution.md
- Prototype: prototyping.md, accessibility-audit.md
- Validate: usability-testing.md
- Deliver: design-delivery.md, design-system-audit.md
- Cross-phase (any phase): design-systems.md, figma-playbook.md, phase-handoff.md, skill-chaining.md

A designer has provided this project context:

PROJECT NAME: ${form.projectName || "Untitled Project"}
PROJECT TYPE: ${form.projectType}
STARTING PHASE: ${form.phase}
WHAT THEY HAVE: ${form.whatYouHave}
TEAM: ${form.team}
TIMELINE: ${form.timeline}
PRODUCT & AUDIENCE: ${form.productDescription || "Not specified"}
GOALS & SUCCESS METRICS: ${form.goals || "Not specified"}
KNOWN CONSTRAINTS: ${form.constraints || "None specified"}

Generate a response in the following exact JSON format. Be sharp, specific, and strategic — every field should feel written by a senior design strategist who deeply understands this exact project. No generic filler.

Return ONLY valid JSON, no markdown fences, no explanation:

{
  "projectName": "refined project name",
  "oneLiner": "one punchy sentence — what it is and who it is for, max 18 words",
  "recommendedPhase": {
    "id": "one of: discover | define | ideate | prototype | validate | deliver",
    "label": "phase label",
    "color": "exact hex for that phase",
    "reason": "2 sentences max on why this phase given what they have and where they are"
  },
  "problemStatement": "Sharp HMW or JTBD framing. 2 to 3 sentences. Specific to this project.",
  "targetUser": "Who this is designed for. Specific, not generic. 1 to 2 sentences.",
  "successMetrics": ["metric 1", "metric 2", "metric 3"],
  "constraints": ["constraint 1", "constraint 2"],
  "skillStack": [
    {
      "order": 1,
      "filename": "exact-skill-filename.md",
      "phase": "phase label this skill belongs to",
      "phaseColor": "hex color for that phase",
      "action": "Upload first",
      "why": "one sentence on why this skill for this project right now"
    },
    {
      "order": 2,
      "filename": "exact-skill-filename.md",
      "phase": "phase label",
      "phaseColor": "hex",
      "action": "Upload next",
      "why": "one sentence"
    },
    {
      "order": 3,
      "filename": "exact-skill-filename.md",
      "phase": "phase label",
      "phaseColor": "hex",
      "action": "Upload after",
      "why": "one sentence"
    }
  ],
  "phaseRoadmap": [
    { "phase": "Discover",  "color": "#22C55E", "focus": "specific focus for this project", "duration": "time estimate", "active": true },
    { "phase": "Define",    "color": "#8B5CF6", "focus": "specific focus", "duration": "time estimate", "active": false },
    { "phase": "Ideate",    "color": "#F59E0B", "focus": "specific focus", "duration": "time estimate", "active": false },
    { "phase": "Prototype", "color": "#3B82F6", "focus": "specific focus", "duration": "time estimate", "active": false },
    { "phase": "Validate",  "color": "#EF4444", "focus": "specific focus", "duration": "time estimate", "active": false },
    { "phase": "Deliver",   "color": "#14B8A6", "focus": "specific focus", "duration": "time estimate", "active": false }
  ],
  "claudeContextBlock": "Write a complete paste-ready context block the designer will use to open their first Claude conversation. Requirements: Open with I am working on [project name]. Weave in all project details naturally — type, product, audience, phase, what they have, team, timeline, goals, constraints — as flowing sentences not a list. State what phase they are entering and what they need from Claude in that phase. Close with a direct instruction to Claude: what to do first, what outputs to produce, and 2 to 3 specific questions to ask the designer to sharpen the work. Length: 200 to 280 words. Voice: first person as the designer speaking to Claude. No placeholders — every detail filled in from the form data."
}`;
}

// ── Shared primitives ────────────────────────────────────────────────────────
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
      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
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

// ── Loading ──────────────────────────────────────────────────────────────────
function LoadingState() {
  const [dot, setDot] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Reading your project context", "Identifying the right starting phase", "Sequencing your skill stack", "Writing your Claude context block"];
  useEffect(() => {
    const a = setInterval(() => setDot(d => d === 3 ? 1 : d + 1), 500);
    const b = setInterval(() => setActiveStep(s => Math.min(s + 1, steps.length - 1)), 1600);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);
  return (
    <div style={{ padding: "56px 0", textAlign: "center" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: DS.dark, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <span style={{ fontSize: 22, color: DS.white }}>◈</span>
      </div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#0F172A", marginBottom: 8 }}>
        Building your brief{".".repeat(dot)}
      </div>
      <div style={{ fontSize: 13, color: DS.bodyDark, marginBottom: 36 }}>Claude is reading your context and crafting a tailored starting point</div>
      <div style={{ maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, opacity: i <= activeStep ? 1 : 0.25, transition: "opacity 0.4s" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              background: i < activeStep ? "#22C55E" : i === activeStep ? DS.dark : DS.light,
              border: i < activeStep || i === activeStep ? "none" : `1px solid ${DS.lightBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 9, fontWeight: 700, color: i < activeStep || i === activeStep ? DS.white : DS.bodyDark,
            }}>{i < activeStep ? "✓" : i + 1}</div>
            <span style={{ fontSize: 12, color: i <= activeStep ? "#0F172A" : DS.bodyDark, fontWeight: i === activeStep ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────────────────────
function BriefResult({ brief, onReset }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(brief.claudeContextBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }
  const phase = brief.recommendedPhase;

  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: DS.bodyDark, marginBottom: 10 }}>Brief ready</div>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 34, fontWeight: 400, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.1 }}>{brief.projectName}</h2>
        <p style={{ fontSize: 14, color: DS.bodyDark, margin: 0, lineHeight: 1.6, maxWidth: 560 }}>{brief.oneLiner}</p>
      </div>

      {/* HERO — Claude context block */}
      <div style={{ background: DS.dark, borderRadius: 16, padding: "24px 28px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: "#22C55E", marginBottom: 8 }}>
              Step 1 — Paste this into Claude
            </div>
            <div style={{ fontSize: 13, color: DS.bodyLight, lineHeight: 1.6, maxWidth: 440 }}>
              Open a new Claude conversation, upload your first skill file, then paste this as your opening message. Claude will be fully oriented from message one.
            </div>
          </div>
          <button onClick={copy} style={{
            background: copied ? "#0D9488" : "#14B8A6", color: DS.dark,
            border: "none", borderRadius: 8, padding: "10px 20px",
            fontSize: 12, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>{copied ? "✓ Copied" : "Copy context block"}</button>
        </div>
        <div style={{ background: "#080E1A", borderRadius: 10, padding: "20px 22px", border: "1px solid #1E293B" }}>
          <pre style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: "#CBD5E1", lineHeight: 1.85, margin: 0,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>{brief.claudeContextBlock}</pre>
        </div>
      </div>

      {/* Skill stack */}
      <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 16, padding: "22px 24px", marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 18 }}>
          Step 2 — Upload skills in this order
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {brief.skillStack?.map((skill, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "28px auto 1fr auto",
              alignItems: "center", gap: 14,
              background: DS.light, borderRadius: 10, padding: "12px 16px",
              border: `1px solid ${DS.lightBorder}`,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: DS.dark, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: DS.bodyLight, flexShrink: 0,
              }}>{skill.order}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: skill.phaseColor,
                background: `${skill.phaseColor}12`,
                border: `1px solid ${skill.phaseColor}44`,
                padding: "4px 12px", borderRadius: 6, whiteSpace: "nowrap",
              }}>{skill.filename}</div>
              <div style={{ fontSize: 12, color: DS.bodyDark, lineHeight: 1.5 }}>
                <span style={{ color: "#0F172A", fontWeight: 500 }}>{skill.phase} · </span>{skill.why}
              </div>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: DS.bodyDark, opacity: 0.45, whiteSpace: "nowrap" }}>
                {skill.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended phase */}
      <div style={{
        background: `${phase.color}0e`, border: `1px solid ${phase.color}33`,
        borderRadius: 16, padding: "20px 24px", marginBottom: 12,
        display: "flex", gap: 18, alignItems: "flex-start",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: `${phase.color}18`, border: `1px solid ${phase.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ width: 12, height: 12, borderRadius: "50%", background: phase.color, display: "block" }} />
        </div>
        <div>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: phase.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            Recommended starting phase → {phase.label}
          </div>
          <div style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.65 }}>{phase.reason}</div>
        </div>
      </div>

      {/* Problem + User */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 10 }}>Problem Statement</div>
          <p style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.7, margin: 0 }}>{brief.problemStatement}</p>
        </div>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 10 }}>Target User</div>
          <p style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.7, margin: 0 }}>{brief.targetUser}</p>
        </div>
      </div>

      {/* Metrics + Constraints */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 12 }}>Success Metrics</div>
          {brief.successMetrics?.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: "#0F172A", lineHeight: 1.55 }}>{m}</span>
            </div>
          ))}
        </div>
        <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 12 }}>Constraints</div>
          {brief.constraints?.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#EF4444", flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 12, color: "#0F172A", lineHeight: 1.55 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phase roadmap */}
      <div style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12, padding: "18px 20px", marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 2, color: DS.bodyDark, marginBottom: 16 }}>Phase Roadmap</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {brief.phaseRoadmap?.map((p, i) => (
            <div key={i} style={{ borderTop: `2px solid ${p.active ? p.color : `${p.color}40`}`, paddingTop: 10, opacity: p.active ? 1 : 0.5 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: p.color, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{p.phase}</div>
              <div style={{ fontSize: 11, color: "#0F172A", lineHeight: 1.5, marginBottom: 6 }}>{p.focus}</div>
              <div style={{ fontSize: 10, color: DS.bodyDark, fontFamily: "'JetBrains Mono', monospace" }}>{p.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onReset} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          ← New brief
        </button>
        <button onClick={copy} style={{ background: copied ? "#0D9488" : "#14B8A6", color: DS.dark, border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "background 0.2s" }}>
          {copied ? "✓ Copied" : "Copy context block"}
        </button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function AIBriefGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    projectName: "", projectType: "", phase: "", whatYouHave: "",
    team: "", timeline: "", productDescription: "", goals: "", constraints: "",
  });
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);
  const topRef = useRef(null);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const canNext1 = form.projectType && form.phase;
  const canNext2 = form.whatYouHave && form.team && form.timeline;
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
          max_tokens: 4000,
          messages: [{ role: "user", content: buildPrompt(form) }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setBrief(parsed);
    } catch (e) {
      console.error("Brief generation error:", e);
      setError("Something went wrong: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setBrief(null); setStep(1);
    setForm({ projectName: "", projectType: "", phase: "", whatYouHave: "", team: "", timeline: "", productDescription: "", goals: "", constraints: "" });
  }

  const progress = loading || brief ? 100 : ((step - 1) / 3) * 100;

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
          {brief ? "Brief ready — copy your context block and open Claude" : "Answer 3 questions. Get a Claude-ready project brief."}
        </span>
        <div style={{ marginLeft: "auto", fontSize: 11, color: DS.bodyDark, fontFamily: "'JetBrains Mono', monospace" }}>Agentic Product Design Framework</div>
      </div>

      {/* Progress */}
      <div style={{ height: 2, background: DS.darkBorder }}>
        <div style={{ height: "100%", background: "#3B82F6", width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      {/* Body */}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 40px 80px" }} ref={topRef}>
        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>

        {loading && <LoadingState />}
        {!loading && brief && <BriefResult brief={brief} onReset={reset} />}

        {!loading && !brief && (
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
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 32px", lineHeight: 1.6 }}>This helps Claude frame the right problem and recommend where to start.</p>

                <div style={{ marginBottom: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Project type</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PROJECT_TYPES.map(t => (
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
                    {PHASE_OPTIONS.map(p => (
                      <Chip key={p.id} selected={form.phase === p.id} onClick={() => set("phase", p.id)} color={p.color}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: p.color, display: "block" }} />
                        {p.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(2)} disabled={!canNext1} style={{ background: canNext1 ? "#0F172A" : DS.lightBorder, color: canNext1 ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canNext1 ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>What's your context?</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 32px", lineHeight: 1.6 }}>A few quick details help Claude give you a more specific, useful brief.</p>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>What do you have so far?</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {WHAT_YOU_HAVE.map(w => (
                      <Chip key={w.id} selected={form.whatYouHave === w.id} onClick={() => set("whatYouHave", w.id)} color="#8B5CF6">{w.label}</Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Team setup</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TEAM_OPTIONS.map(t => (
                      <Chip key={t.id} selected={form.team === t.id} onClick={() => set("team", t.id)} color="#F59E0B">
                        {t.label}<span style={{ fontSize: 11, color: DS.bodyDark, fontWeight: 400 }}> — {t.desc}</span>
                      </Chip>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>Timeline</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {TIMELINE_OPTIONS.map(t => (
                      <Chip key={t.id} selected={form.timeline === t.id} onClick={() => set("timeline", t.id)} color="#EF4444">
                        {t.label}<span style={{ fontSize: 11, color: DS.bodyDark, fontWeight: 400 }}> — {t.desc}</span>
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

            {/* Step 3 */}
            {step === 3 && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, color: "#0F172A", margin: "0 0 6px" }}>Goals & details</h2>
                <p style={{ fontSize: 14, color: DS.bodyDark, margin: "0 0 28px", lineHeight: 1.6 }}>The more specific you are, the sharper your Claude context block will be.</p>

                <Field label="Project name *" placeholder="e.g. Healthtrack Mobile Redesign" value={form.projectName} onChange={v => set("projectName", v)} />
                <Field label="What are you designing? Who is it for?" hint="Describe the product or feature and the people who will use it." placeholder="e.g. A mobile app for nurses to track patient vitals during shift handoff" value={form.productDescription} onChange={v => set("productDescription", v)} multiline />
                <Field label="Goals & success metrics" hint="What does success look like? Include business and user outcomes." placeholder="e.g. Reduce handoff errors by 30%, nurses complete check-ins in under 2 minutes" value={form.goals} onChange={v => set("goals", v)} multiline />
                <Field label="Known constraints" hint="Technical limitations, timeline pressure, stakeholder requirements." placeholder="e.g. Must work on hospital-issued iPads, integrate with Epic EHR, ship by Q3" value={form.constraints} onChange={v => set("constraints", v)} multiline />

                {error && (
                  <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#991B1B" }}>{error}</div>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button onClick={() => setStep(2)} style={{ background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 500, color: DS.bodyDark, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
                  <button onClick={generate} disabled={!canSubmit} style={{ background: canSubmit ? "#3B82F6" : DS.lightBorder, color: canSubmit ? DS.white : DS.bodyDark, border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: canSubmit ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}>
                    Generate Brief ✦
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
