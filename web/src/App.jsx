import { useState, useEffect } from "react";
import DesignProcessSystem from "./DesignProcessSystem";
import AIBriefGenerator from "./AIBriefGenerator";
import ClientDeckBuilder from "./ClientDeckBuilder";
import FigmaSetupGuide from "./FigmaSetupGuide";
import SkillsLibrary from "./SkillsLibrary";
import DesignSystemBuilder from "./DesignSystemBuilder";
import ResearchSynthesizer from "./ResearchSynthesizer";
import ServiceBlueprintGenerator from "./ServiceBlueprintGenerator";
import CompetitiveSnapshotBuilder from "./CompetitiveSnapshotBuilder";
import ProblemFramingTool from "./ProblemFramingTool";
import JourneyMappingTool from "./JourneyMappingTool";

// ── Tokens ──────────────────────────────────────────────────────────────────
const T = {
  bg: "#0F0F0F",
  surface: "#161616",
  card: "#1A1A1A",
  border: "#2C2C2C",
  borderHover: "#404040",
  text: "#F2F2F2",
  muted: "#999999",
  dim: "#666666",
  white: "#FFFFFF",
  phases: {
    "01": { color: "#22C55E", label: "Discover" },
    "02": { color: "#8B5CF6", label: "Define" },
    "03": { color: "#F59E0B", label: "Ideate" },
    "04": { color: "#3B82F6", label: "Prototype" },
    "05": { color: "#EF4444", label: "Validate" },
    "06": { color: "#14B8A6", label: "Deliver" },
  },
};

const REPO = "https://github.com/quinrobinson/Agentic-Product-Design-Framework";
const FIGMA_URL = "https://www.figma.com/design/mrHuD7sY7h6uKSVndTSIQE";
const PPTX_URL = `${REPO}/raw/main/artifacts/onboarding-deck.pptx`;
const RAW = "https://raw.githubusercontent.com/quinrobinson/Agentic-Product-Design-Framework/main/skills";

// ── Tool registry ────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "process",            number: "01", phase: "01", name: "Design Process System",      subtitle: "Full six-phase framework with AI prompts and skill docs",                         component: DesignProcessSystem },
  { id: "brief",              number: "02", phase: "01", name: "AI Brief Generator",          subtitle: "Turn project context into a structured design brief",                             component: AIBriefGenerator },
  { id: "deck",               number: "03", phase: null, name: "Client Deck Builder",          subtitle: "Build the right presentation for any stage of a project",                        component: ClientDeckBuilder },
  { id: "design-system",      number: "04", phase: "03", name: "Design System Builder",       subtitle: "Upload, build, or bootstrap a design system for Claude",                         component: DesignSystemBuilder },
  { id: "research-synthesizer",number:"05", phase: "01", name: "Research Synthesizer",        subtitle: "Turn raw interviews into a structured Research Brief",                           component: ResearchSynthesizer },
  { id: "service-blueprint",  number: "06", phase: "01", name: "Service Blueprint Generator", subtitle: "Map current and future state experiences across five swim lanes",                component: ServiceBlueprintGenerator },
  { id: "competitive-snapshot", number: "07", phase: "01", name: "Competitive Snapshot Builder", subtitle: "Map the landscape, audit competitors, and find differentiation opportunities",    component: CompetitiveSnapshotBuilder },
  { id: "problem-framing",      number: "08", phase: "02", name: "Problem Framing",             subtitle: "Generate, pressure-test, and score problem statements + HMW questions",           component: ProblemFramingTool },
  { id: "journey-mapping",      number: "09", phase: "02", name: "Journey Mapping",             subtitle: "Generate research-grounded journey maps across six lanes with critical moments",  component: JourneyMappingTool },
];

// ── Skill registry ───────────────────────────────────────────────────────────
const SKILL_FILES = [
  { file: "research-planning.md",      phase: "01", leverage: "high", surface: "chat",           desc: "Turns a project brief or business goal into a complete research plan and discussion guide." },
  { file: "research-synthesis.md",     phase: "01", leverage: "high", surface: "chat",           desc: "Transforms raw transcripts and notes into structured themes, insights, and ranked pain points." },
  { file: "competitive-analysis.md",   phase: "01", leverage: "high", surface: "chat",           desc: "Maps your competitive landscape — UX conventions, gaps, patterns worth borrowing, and differentiation opportunities." },
  { file: "service-blueprint.md",      phase: "01", leverage: "high", surface: "chat",           desc: "Generates current-state and future-state service blueprints from research data across five swim lanes." },
  { file: "insight-framing.md",        phase: "01", leverage: "high", surface: "chat",           desc: "Sharpens research insights into prioritized HMW statements ready to open the Define phase." },
  { file: "problem-framing.md",        phase: "02", leverage: "high",   surface: "chat",         desc: "Transforms research outputs into a focused, pressure-tested problem frame — problem statement, HMW questions, and scope boundaries ready for ideation." },
  { file: "journey-mapping.md",        phase: "02", leverage: "high",   surface: "chat",         desc: "Generates research-grounded journey maps across six lanes — actions, thoughts, emotions, touchpoints, pain points, and opportunities — with critical moment analysis." },
  { file: "persona-creation.md",       phase: "02", leverage: "high",   surface: "chat",         desc: "Creates behavioral personas from research data with pain point rankings, workarounds, mental models, and design implications specific to your project." },
  { file: "assumption-mapping.md",     phase: "02", leverage: "high",   surface: "chat",         desc: "Surfaces and prioritizes implicit team assumptions across desirability, feasibility, viability, and usability — with validation plans for critical risks." },
  { file: "requirements-prioritization.md", phase: "02", leverage: "high", surface: "chat",     desc: "Applies MoSCoW, RICE, and Impact/Effort frameworks to produce a defensible MVP scope and phased delivery plan grounded in research." },
  { file: "concept-generation.md",    phase: "03", leverage: "high",   surface: "chat",         desc: "Generate a broad set of concept directions using structured brainstorming, multi-angle techniques, and outside-the-box thinking drawn from unrelated domains." },
  { file: "idea-clustering.md",        phase: "03", leverage: "high",   surface: "chat",         desc: "Transform 15–50 raw concepts into a navigable landscape of strategic directions — grouping by underlying approach, naming clusters, and mapping key tensions." },
  { file: "concept-critique.md",       phase: "03", leverage: "high",   surface: "chat",         desc: "Systematically evaluate promising concepts before prototyping across five lenses: user reality, assumption audit, adversarial review, competitive displacement, and failure modes." },
  { file: "storyboarding.md",          phase: "03", leverage: "high",   surface: "chat",         desc: "Translate a selected concept into a scene-by-scene narrative of the user experience — with emotional arc, forced design decisions, and a prototype brief." },
  { file: "visual-design-execution.md",phase: "03", leverage: "high", surface: "chat",           desc: "Selects a visual style, builds a color token architecture, defines type scale and spacing." },
  { file: "prototyping.md",            phase: "04", leverage: "high", surface: "chat + code",    desc: "Builds functional React or HTML prototypes with correct touch targets, timing, and a QA checklist." },
  { file: "accessibility-audit.md",    phase: "04", leverage: "high", surface: "chat",           desc: "Runs a WCAG 2.1 AA audit — contrast, keyboard nav, focus management, screen reader behavior." },
  { file: "usability-testing.md",      phase: "05", leverage: "high", surface: "chat",           desc: "Plans tests, writes task scenarios, and synthesizes session notes into a severity-ranked report." },
  { file: "design-delivery.md",        phase: "06", leverage: "high", surface: "chat + code",    desc: "Produces component specs, platform handoff packages, design decision records, and release notes." },
  { file: "design-systems.md",         phase: null, leverage: "high", surface: "chat + code",    desc: "Audits any product against Material Design 3, Atlassian, Carbon, and Apple HIG." },
  { file: "figma-playbook.md",         phase: null, leverage: "high", surface: "code + figma mcp",desc: "Step-by-step Figma MCP execution patterns for every phase — research boards through spec annotations." },
  { file: "phase-handoff.md",          phase: null, leverage: "high", surface: "chat",           desc: "Generates a structured handoff block at the close of each phase — full context for the next." },
];

// ── Prompts registry ─────────────────────────────────────────────────────────
const PROMPTS = [
  {
    id: "plan-research",
    name: "Plan Your Research",
    phase: "01",
    skill: "research-planning.md",
    when: "Start of any discovery effort — when you have a project brief but haven't yet defined how to learn about users.",
    text: `I'm starting discovery for a new project and need a complete research plan.

Project context:
- What we're designing: [product / feature / service]
- Who the likely users are: [role, context, or segment]
- Business decision this research will inform: [what the team needs to decide]
- Constraints: [timeline, budget, access to participants, existing knowledge]

Using the research-planning skill, generate:
1. A method recommendation with justification
2. A complete research plan (objectives, participants, screener, timeline)
3. Success criteria for when the research is done

Be specific — avoid generic advice.`,
  },
  {
    id: "interview-guide",
    name: "Build an Interview Guide",
    phase: "01",
    skill: "research-planning.md",
    when: "When you know who you're interviewing and what you need to learn, and need a discussion guide ready to run.",
    text: `I need a discussion guide for user interviews.

Interview context:
- Who I'm interviewing: [role, experience level, context]
- What I'm trying to learn: [primary research question]
- Session length: [45 / 60 / 90 min]
- Known pain points or topics to explore: [anything already known]

Using the research-planning skill, generate:
1. A full discussion guide with warm-up, context setting, core exploration,
   specific scenarios, and wrap-up sections
2. 3–5 follow-up probes for each core question
3. An observer notes template

Questions must be open-ended and ask about past behavior — no hypotheticals.`,
  },
  {
    id: "synthesize-notes",
    name: "Synthesize Interview Notes",
    phase: "01",
    skill: "research-synthesis.md",
    when: "After completing interviews — when you need to turn raw notes into structured themes and insights without spending days on manual analysis.",
    text: `I've completed [N] user interviews and need to synthesize the findings.

Research question: [what you set out to learn]
Method: [semi-structured interviews / contextual inquiry / etc.]

Session notes:
[PASTE RAW NOTES OR TRANSCRIPT SUMMARIES HERE — one session at a time]

Using the research-synthesis skill, process this session and generate:
1. A structured session summary with pain points, workarounds, and direct quotes
2. Thematic tags (3–5) for cross-session comparison

Important: quote directly from the notes — do not paraphrase quotes.
Flag anything that contradicts our research assumptions.

After I confirm this summary, I'll paste the next session.`,
  },
  {
    id: "competitive-landscape",
    name: "Map the Competitive Landscape",
    phase: "01",
    skill: "competitive-analysis.md",
    when: "At the start of discovery — to understand what already exists before designing something new.",
    text: `I need to map the competitive landscape for [product / feature / category].

Context:
- What we're designing: [description]
- Known competitors: [list what you know — direct and indirect]
- Design question: [UX conventions, feature gaps, positioning, or all three?]

Using the competitive-analysis skill:
1. Expand the competitive set — suggest 3–5 competitors I may have missed,
   including at least one indirect and one aspirational reference
2. Identify dominant UX conventions users will expect
3. Surface gaps no competitor solves well — backed by user evidence
4. Recommend 1–2 clear differentiation opportunities

Use web search to pull real user sentiment from G2, app stores, or Reddit
for at least 3 of the competitors. Reference actual products and real complaints.`,
  },
  {
    id: "hmw-statements",
    name: "Generate HMW Statements",
    phase: "01",
    skill: "insight-framing.md",
    when: "After research synthesis — to bridge findings into focused design opportunities ready for Define.",
    text: `I've completed discovery research and need to generate prioritized
How Might We statements.

Research context:
- Primary user: [persona / segment]
- Top insight: [User X does Y because Z, which means W]
- Top pain points (ranked): [list 3–5]
- Systemic gaps (if service blueprint done): [list any backstage disconnects]
- Competitive gaps (if analysis done): [list any market opportunities]

Using the insight-framing skill:
1. Sharpen my insight statements — flag any that are observations, not insights
2. Generate 5 HMW statements per insight, varying the angle:
   root cause / constraint reframe / emotional dimension / systemic / ambitious
3. Cluster overlapping statements into 3–5 themes
4. Score and rank the top 5 using: user impact, business value,
   design leverage, feasibility
5. Generate the primary problem statement in HMW, JTBD, and design brief formats

Every HMW must trace to a research finding, not an assumption.`,
  },
  {
    id: "frame-the-problem",
    name: "Frame the Problem",
    phase: "02",
    skill: "problem-framing.md",
    when: "After research synthesis — when you need to generate and compare multiple problem framings before committing to a direction.",
    text: `I have research outputs and need to frame the design problem.

Research summary:
[PASTE research synthesis themes, pain points, or Discover handoff block]

Primary user: [persona name, role, context]
Business goal: [the metric or outcome this design work should move]

Using the problem-framing skill, generate the problem statement in three formats:
1. HMW — How might we [action] for [user] so that [outcome]?
2. JTBD — When [situation], I want to [motivation], so I can [outcome].
3. User + Need + Insight — [User] needs a way to [need] because [surprising insight].

For each format:
- Apply the calibration test: can I think of 10 meaningfully different solutions?
- Flag if the framing is too broad, too narrow, or solution-embedded

Then recommend one framing and explain:
- Why this one over the alternatives
- What assumptions are baked into it
- Two alternative framings that would produce completely different solutions`,
  },
  {
    id: "pressure-test-framing",
    name: "Pressure-Test a Problem Statement",
    phase: "02",
    skill: "problem-framing.md",
    when: "When you already have a problem statement and want to challenge it before committing to ideation.",
    text: `Act as a skeptical senior PM reviewing this problem statement.
Do not validate it — find its weaknesses.

Problem statement: "[PASTE YOUR PROBLEM STATEMENT]"

Research context:
[PASTE research summary or key findings]

Challenge it on four fronts:

1. Calibration — is this too broad (any solution qualifies) or too narrow
   (solution is already embedded)? Give a specific failure mode example.

2. Hidden assumptions — list 3–5 beliefs baked into this framing that
   haven't been validated by research, ordered most to least risky.

3. Exclusions — what important user problems does this framing exclude
   that we might regret ignoring?

4. Alternatives — generate two framings that would produce completely
   different design solutions. Explain what each prioritizes.

Verdict: Proceed / Refine / Reframe?
If refine or reframe — provide the improved version.`,
  },
  {
    id: "map-user-journey",
    name: "Map the User Journey",
    phase: "02",
    skill: "journey-mapping.md",
    when: "When you need to synthesize research into a journey map without the interactive tool — or to generate a quick journey map from existing data.",
    text: `Generate a research-grounded journey map for this scenario.

Persona: [name — role / context]
Goal: [what they're trying to accomplish]
Trigger: [what initiates this experience]

Research data:
[PASTE session summaries, themes, or pain points]

Using the journey-mapping skill:
1. Suggest 5–7 stage names specific to this user and scenario
   (not generic "Awareness → Consideration" — use descriptive phrases
   grounded in what the research shows actually happens)
2. For each stage, populate all 6 lanes:
   - Actions (with 🔧 for workarounds)
   - Thoughts (use direct quotes where possible)
   - Emotions (📈/📉 with what drives each)
   - Touchpoints
   - Pain Points ⚠️ (with severity: Critical/Major/Minor + source)
   - Opportunities (leave [TBD] — generate after all pain points are mapped)
3. Mark anything not directly from research as [inferred] or [unknown]
4. After all stages: identify the moment of highest friction, highest
   opportunity, and the moment of truth`,
  },
  {
    id: "create-personas",
    name: "Create Research-Grounded Personas",
    phase: "02",
    skill: "persona-creation.md",
    when: "After research synthesis — when you need to create behavioral archetypes that anchor design decisions and brief collaborators.",
    text: `Create [N] research-grounded personas from this data.

Research data:
[PASTE session summaries, themes, or synthesis outputs]

Design context: [what product or feature these personas will be used to design]

Using the persona-creation skill:
1. Identify [N] meaningful user segments — segment by behavior, goal,
   or context. Not by demographics or job title.
2. For each segment, generate a full persona including:
   - Who they are (role, context, experience level)
   - Their primary goal and JTBD statement
   - Current workflow and tools (observed, not ideal)
   - Workarounds they've invented (each reveals an unmet need)
   - Top 3 pain points with severity and research source
   - Mental model and trust signals
   - One representative quote (direct, not paraphrased)
   - Design implications: what to design for and what to never do
3. Mark anything inferred rather than directly observed as [inferred]
4. Generate a persona set summary: overlapping needs, conflicting needs,
   and the primary persona for this project`,
  },
  {
    id: "map-assumptions",
    name: "Map Assumptions and Risks",
    phase: "02",
    skill: "assumption-mapping.md",
    when: "Before committing to a design direction — to surface what the team is betting on and identify what needs validation before proceeding.",
    text: `Surface and prioritize the assumptions behind this design direction.

Project context:
- What we're designing: [product / feature / solution]
- For whom: [primary user]
- Problem statement: [paste problem frame]
- Research context: [what Discover confirmed and what it left open]

Using the assumption-mapping skill:
1. Generate 5–8 assumptions per category:
   - Desirability: does the user want this? Do they have the problem we think?
   - Feasibility: can we build this? Do we have the capability?
   - Viability: is this good for the business? Regulatory fit?
   - Usability: can users accomplish their goals with this design?
   Focus especially on assumptions that seem obvious — these are often riskiest.

2. Score each on two axes:
   - Importance: High (product fails if wrong) / Low (recoverable)
   - Evidence: Known (validated) / Unknown (believed but untested)

3. Place in the 2×2 matrix:
   - Test First (High importance, Unknown) — list in priority order
   - Build On (High importance, Known) — with evidence sources
   - Monitor (Low importance, Unknown)
   - Deprioritize (Low importance, Known)

4. For each Test First assumption: design the cheapest, fastest validation method`,
  },
];

// ── Deliverables map ─────────────────────────────────────────────────────────
const DELIVERABLES = [
  { name: "Research Brief",       type: "tool",   ref: "research-synthesizer",  label: "Research Synthesizer"         },
  { name: "Service Blueprint",    type: "tool",   ref: "service-blueprint",     label: "Blueprint Generator"          },
  { name: "Design Brief",         type: "tool",   ref: "brief",                 label: "AI Brief Generator"           },
  { name: "Client Deck",          type: "tool",   ref: "deck",                  label: "Client Deck Builder"          },
  { name: "Design System",        type: "tool",   ref: "design-system",         label: "Design System Builder"        },
  { name: "Research Plan",        type: "prompt", ref: "plan-research",         label: "Plan Your Research"           },
  { name: "Interview Guide",      type: "prompt", ref: "interview-guide",       label: "Build an Interview Guide"     },
  { name: "Competitive Analysis", type: "prompt", ref: "competitive-landscape", label: "Map the Competitive Landscape"},
  { name: "HMW Statements",       type: "prompt", ref: "hmw-statements",        label: "Generate HMW Statements"      },
  { name: "Competitive Analysis",  type: "tool",   ref: "competitive-snapshot",   label: "Competitive Snapshot Builder"  },
  { name: "Problem Statement",       type: "tool",   ref: "problem-framing",        label: "Problem Framing"               },
  { name: "Journey Map",             type: "tool",   ref: "journey-mapping",        label: "Journey Mapping"               },
];

// ── Phase data ────────────────────────────────────────────────────────────────
const PHASES = [
  { id: "01", label: "Discover", desc: "Understand users, map the landscape, frame the problem",   skills: 5, tools: 2, prompts: 5 },
  { id: "02", label: "Define",   desc: "Synthesize findings into a focused problem statement",      skills: 1, tools: 1, prompts: 0 },
  { id: "03", label: "Ideate",   desc: "Generate concepts, explore visual directions",              skills: 2, tools: 1, prompts: 0 },
  { id: "04", label: "Prototype",desc: "Build working prototypes and run accessibility audits",     skills: 2, tools: 0, prompts: 0 },
  { id: "05", label: "Validate", desc: "Test with users, synthesize findings, iterate",             skills: 1, tools: 0, prompts: 0 },
  { id: "06", label: "Deliver",  desc: "Hand off specs, documentation, and design decisions",       skills: 2, tools: 0, prompts: 0 },
];

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Mono({ children, color, size = 11 }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: size, letterSpacing: "0.07em",
      textTransform: "uppercase", color: color || T.muted,
    }}>{children}</span>
  );
}

function PhaseTag({ phaseId, small }) {
  const p = T.phases[phaseId];
  if (!p) return <Mono color={T.dim}>{small ? "Cross-phase" : "All phases"}</Mono>;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: small ? 10 : 11, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.06em", textTransform: "uppercase",
      color: p.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
      {phaseId} — {p.label}
    </span>
  );
}

function CopyBtn({ text, label = "Copy Prompt" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{
        padding: "8px 16px", borderRadius: 6,
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
        cursor: "pointer", border: `1.5px solid ${T.border}`,
        background: "transparent", color: copied ? "#22C55E" : T.muted,
        borderColor: copied ? "#22C55E" : T.border,
        transition: "all 0.15s",
      }}
    >{copied ? "✓ Copied" : label}</button>
  );
}

function SkillBadge({ surface }) {
  const colors = {
    "chat": { bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", color: "#22C55E", label: "Chat" },
    "chat + code": { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", color: "#3B82F6", label: "Chat + Code" },
    "code + figma mcp": { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", color: "#F59E0B", label: "Figma MCP" },
  };
  const s = colors[surface] || colors["chat"];
  return (
    <span style={{
      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 3,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>{s.label}</span>
  );
}

// ── Home pill ─────────────────────────────────────────────────────────────────
function HomePill({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "6px 14px", borderRadius: 20,
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.06em", textTransform: "uppercase",
        background: "transparent",
        border: `1px solid ${hovered ? T.borderHover : T.border}`,
        color: hovered ? T.text : T.muted,
        cursor: "pointer", transition: "all 0.15s",
        marginBottom: 32,
      }}
    >
      ← Framework Home
    </button>
  );
}

// ── Path card ─────────────────────────────────────────────────────────────────
function PathCard({ title, desc, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, padding: "24px 22px", borderRadius: 10,
        textAlign: "left", cursor: "pointer",
        background: isActive ? T.surface : "transparent",
        border: `1.5px solid ${isActive ? "#22C55E" : hovered ? T.borderHover : T.border}`,
        transition: "all 0.15s", outline: "none",
      }}
    >
      <div style={{
        fontSize: 14, fontWeight: 600,
        fontFamily: "'DM Serif Display', serif",
        color: isActive ? T.text : hovered ? T.text : T.muted,
        marginBottom: 6, transition: "color 0.15s",
      }}>{title}</div>
      <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55 }}>{desc}</div>
    </button>
  );
}

// ── Setup block ───────────────────────────────────────────────────────────────
function SetupBlock({ onOpenFigmaGuide }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(() => {
    try { return localStorage.getItem("apdf-setup-done") === "true"; } catch { return false; }
  });
  const [copied, setCopied] = useState(false);

  const cloneCmd = `git clone ${REPO}.git`;

  function toggleDone() {
    const next = !done;
    setDone(next);
    try { localStorage.setItem("apdf-setup-done", String(next)); } catch {}
  }

  return (
    <div style={{
      border: `1px solid ${T.border}`, borderRadius: 10,
      overflow: "hidden", marginBottom: 40,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "14px 20px",
          background: "transparent", border: "none", cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {done
            ? <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: "#22C55E" }}>✓ Setup complete</span>
            : <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: T.muted }}>First time? Complete setup before starting</span>
          }
        </div>
        <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "20px 20px 24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {[
              {
                n: "①", label: "Set up Claude",
                desc: "You need Claude Pro or a Teams account to use claude.ai with projects. For Figma MCP, you also need Claude Desktop.",
                action: <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.muted, letterSpacing: "0.06em", textDecoration: "none" }}>claude.ai →</a>
              },
              {
                n: "②", label: "Connect Figma MCP (optional)",
                desc: "Enables Claude to execute design work directly in Figma. Requires Claude Desktop + Figma desktop app.",
                action: <button onClick={onOpenFigmaGuide} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.muted, letterSpacing: "0.06em", background: "none", border: "none", cursor: "pointer", padding: 0, textTransform: "uppercase" }}>Setup guide →</button>
              },
              {
                n: "③", label: "Pull skill files from the repo",
                desc: "Clone the repo to get all skill files locally — paste them into Claude projects or conversations.",
                action: (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <code style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono', monospace", background: T.card, padding: "3px 8px", borderRadius: 4 }}>{cloneCmd}</code>
                    <button onClick={() => { navigator.clipboard.writeText(cloneCmd); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
                      style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: copied ? "#22C55E" : T.dim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {copied ? "✓" : "Copy"}
                    </button>
                  </div>
                )
              },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: T.dim, flexShrink: 0, marginTop: 1 }}>{step.n}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 3 }}>{step.label}</div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, marginBottom: 6 }}>{step.desc}</div>
                  {step.action}
                </div>
              </div>
            ))}

            <div style={{ paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={done} onChange={toggleDone}
                  style={{ width: 14, height: 14, accentColor: "#22C55E", cursor: "pointer" }} />
                <span style={{ fontSize: 12, color: T.muted, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>I've completed setup</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Path: Phase ───────────────────────────────────────────────────────────────
function PhasePath({ onOpenTool, onOpenSkill }) {
  const [selected, setSelected] = useState(null);

  const phase = selected ? PHASES.find(p => p.id === selected) : null;
  const p = phase ? T.phases[phase.id] : null;
  const phaseTools = phase ? TOOLS.filter(t => t.phase === phase.id) : [];
  const phaseSkills = phase ? SKILL_FILES.filter(s => s.phase === phase.id) : [];

  // Build correct download URL per phase
  function skillUrl(skill) {
    const phaseLabel = T.phases[skill.phase]?.label?.toLowerCase() || "";
    const dir = skill.phase ? `${skill.phase}-${phaseLabel}` : "";
    return dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
  }

  return (
    <div>
      {/* Horizontal phase strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        border: `1px solid ${T.border}`, borderRadius: 10,
        overflow: "hidden", marginBottom: 1,
      }}>
        {PHASES.map((ph, i) => {
          const phColor = T.phases[ph.id].color;
          const isActive = selected === ph.id;
          return (
            <button
              key={ph.id}
              onClick={() => setSelected(selected === ph.id ? null : ph.id)}
              style={{
                padding: "14px 10px 12px", border: "none",
                borderRight: i < 5 ? `1px solid ${T.border}` : "none",
                borderBottom: isActive ? `2px solid ${phColor}` : "2px solid transparent",
                background: isActive ? T.surface : "transparent",
                cursor: "pointer", textAlign: "center",
                transition: "all 0.15s", outline: "none",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.card; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{
                width: 6, height: 6, borderRadius: "50%", background: phColor,
                margin: "0 auto 8px",
                boxShadow: isActive ? `0 0 8px ${phColor}` : "none",
                transition: "box-shadow 0.15s",
              }} />
              <div style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: isActive ? phColor : T.dim,
                marginBottom: 2, transition: "color 0.15s",
              }}>{ph.id}</div>
              <div style={{
                fontSize: 11, fontWeight: 500,
                color: isActive ? T.text : T.muted,
                transition: "color 0.15s", lineHeight: 1.2,
              }}>{ph.label}</div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div style={{
        border: `1px solid ${T.border}`, borderTop: "none",
        borderRadius: "0 0 10px 10px", overflow: "hidden",
        minHeight: 280,
      }}>
        {!selected ? (
          /* Default state — no phase selected */
          <div style={{ padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 20 }}>
                {PHASES.map(ph => (
                  <div key={ph.id} style={{ width: 20, height: 2, background: T.phases[ph.id].color, borderRadius: 1 }} />
                ))}
              </div>
              <p style={{ fontSize: 14, color: T.muted, textAlign: "center", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 8px" }}>
                Select a phase above to see its tools, skills, and prompts.
              </p>
              <p style={{ fontSize: 12, color: T.dim, textAlign: "center", lineHeight: 1.6, maxWidth: 380, margin: "0 auto" }}>
                Each phase builds on the last — from understanding users in Discover through handing off specs in Deliver.
              </p>
            </div>
          </div>
        ) : (
          /* Phase detail panel */
          <div style={{ padding: "28px 28px 32px" }}>

            {/* Phase header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: p.color }}>
                    {phase.id} — {phase.label}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, maxWidth: 640 }}>{phase.desc}</p>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                {phase.tools > 0 && <Mono color={T.dim}>{phase.tools} tool{phase.tools > 1 ? "s" : ""}</Mono>}
                {phase.skills > 0 && <Mono color={T.dim}>{phase.skills} skill{phase.skills > 1 ? "s" : ""}</Mono>}
                {phase.prompts > 0 && <Mono color={T.dim}>{phase.prompts} prompt{phase.prompts > 1 ? "s" : ""}</Mono>}
              </div>
            </div>

            {/* Tools section */}
            {phaseTools.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 10 }}>
                  <Mono color={T.dim} size={10}>Tools</Mono>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: phaseTools.length > 2 ? "1fr 1fr" : "1fr 1fr", gap: 8 }}>
                  {phaseTools.map(tool => (
                    <div key={tool.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", background: T.card, borderRadius: 8,
                      border: `1px solid ${T.border}`,
                    }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 3 }}>{tool.name}</div>
                        <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{tool.subtitle}</div>
                      </div>
                      <button onClick={() => onOpenTool(tool.id)} style={{
                        padding: "6px 12px", borderRadius: 5, flexShrink: 0,
                        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        background: "transparent", border: `1px solid ${p.color}55`,
                        color: p.color, cursor: "pointer", whiteSpace: "nowrap",
                        transition: "border-color 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
                        onMouseLeave={e => e.currentTarget.style.borderColor = p.color + "55"}
                      >Open →</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills section */}
            {phaseSkills.length > 0 && (
              <div>
                <div style={{ marginBottom: 10 }}>
                  <Mono color={T.dim} size={10}>Skills</Mono>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {phaseSkills.map(skill => (
                    <div key={skill.file} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 14px", background: T.card, borderRadius: 6,
                      border: `1px solid ${T.border}`,
                    }}>
                      <div style={{ flex: 1, marginRight: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <Mono color={T.muted} size={11}>{skill.file}</Mono>
                          <SkillBadge surface={skill.surface} />
                        </div>
                        <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{skill.desc}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => onOpenSkill(skill)} style={{
                          padding: "5px 10px", borderRadius: 5,
                          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          background: "transparent", border: `1px solid ${T.border}`,
                          color: T.muted, cursor: "pointer", whiteSpace: "nowrap",
                          transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "55"; e.currentTarget.style.color = p.color; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                        >Preview →</button>
                        <a href={skillUrl(skill)} download style={{
                          padding: "5px 10px", borderRadius: 5,
                          fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          background: "transparent", border: `1px solid ${T.border}`,
                          color: T.muted, textDecoration: "none", whiteSpace: "nowrap",
                          transition: "all 0.15s",
                        }}>↓</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state for phases with no tools/guides yet */}
            {phaseTools.length === 0 && phaseSkills.length === 0 && (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <Mono color={T.dim}>Tools and guides coming soon for this phase</Mono>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Path: Ways to Work ────────────────────────────────────────────────────────
function WaysToWorkPath({ onOpenTool }) {
  const [tab, setTab] = useState("tools");
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [surfaceFilter, setSurfaceFilter] = useState("all");

  const PHASE_FILTERS = [
    { id: "all", label: "All" },
    { id: "01",  label: "Discover" },
    { id: "02",  label: "Define" },
    { id: "03",  label: "Ideate" },
    { id: "04",  label: "Prototype" },
    { id: "05",  label: "Validate" },
    { id: "06",  label: "Deliver" },
    { id: "cross", label: "Cross-phase" },
  ];

  const SURFACE_FILTERS = [
    { id: "all",           label: "All" },
    { id: "chat",          label: "Chat" },
    { id: "chat + code",   label: "Chat + Code" },
    { id: "code + figma mcp", label: "Figma MCP" },
  ];

  const filteredSkills = SKILL_FILES.filter(s => {
    const phaseMatch = phaseFilter === "all"
      ? true
      : phaseFilter === "cross"
      ? s.phase === null
      : s.phase === phaseFilter;
    const surfaceMatch = surfaceFilter === "all" ? true : s.surface === surfaceFilter;
    return phaseMatch && surfaceMatch;
  });

  function FilterPills({ options, active, onChange }) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {options.map(opt => {
          const isActive = active === opt.id;
          return (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{
              padding: "4px 10px", borderRadius: 20, cursor: "pointer",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.07em", textTransform: "uppercase",
              border: `1px solid ${isActive ? T.borderHover : T.border}`,
              background: isActive ? T.card : "transparent",
              color: isActive ? T.text : T.dim,
              transition: "all 0.12s",
            }}>{opt.label}</button>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T.border}`, paddingBottom: 0 }}>
        {[
          { id: "tools", label: "Tools" },
          { id: "prompts", label: "Prompts" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 16px", background: "none", border: "none",
            borderBottom: `2px solid ${tab === t.id ? T.text : "transparent"}`,
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.07em", textTransform: "uppercase",
            color: tab === t.id ? T.text : T.muted,
            cursor: "pointer", transition: "all 0.15s", marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Tools tab */}
      {tab === "tools" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TOOLS.map(tool => (
            <div key={tool.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 18px", background: T.surface, borderRadius: 8,
              border: `1px solid ${T.border}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <Mono color={T.dim}>{tool.number}</Mono>
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{tool.name}</span>
                  <PhaseTag phaseId={tool.phase} small />
                </div>
                <div style={{ fontSize: 12, color: T.muted }}>{tool.subtitle}</div>
              </div>
              <button onClick={() => onOpenTool(tool.id)} style={{
                marginLeft: 20, padding: "7px 16px", borderRadius: 5, flexShrink: 0,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: "transparent", border: `1px solid ${T.border}`,
                color: T.muted, cursor: "pointer", whiteSpace: "nowrap",
              }}>Open →</button>
            </div>
          ))}
        </div>
      )}

      {/* Prompts tab */}
      {tab === "prompts" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {PROMPTS.map(prompt => {
            const isOpen = expandedPrompt === prompt.id;
            return (
              <div key={prompt.id} style={{
                border: `1px solid ${isOpen ? "#22C55E44" : T.border}`,
                borderRadius: 8, overflow: "hidden", transition: "border-color 0.15s",
              }}>
                <button
                  onClick={() => setExpandedPrompt(isOpen ? null : prompt.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 18px", background: isOpen ? T.surface : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left", gap: 12,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{prompt.name}</span>
                      <PhaseTag phaseId={prompt.phase} small />
                    </div>
                    <Mono color={T.dim} size={10}>{prompt.skill}</Mono>
                  </div>
                  <span style={{ fontSize: 11, color: T.dim, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
                </button>
                {isOpen && (
                  <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 18px 18px" }}>
                    <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, marginBottom: 14 }}>
                      <span style={{ color: T.dim, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>When to use · </span>
                      {prompt.when}
                    </div>
                    <pre style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      color: T.muted, lineHeight: 1.7, whiteSpace: "pre-wrap",
                      background: T.card, border: `1px solid ${T.border}`,
                      borderRadius: 6, padding: "14px 16px", margin: "0 0 14px",
                      overflowX: "auto",
                    }}>{prompt.text}</pre>
                    <CopyBtn text={prompt.text} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Skills tab */}
      {tab === "skills" && (
        <div>
          {/* Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mono color={T.dim} size={10}>Phase</Mono>
              <FilterPills options={PHASE_FILTERS} active={phaseFilter} onChange={setPhaseFilter} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Mono color={T.dim} size={10}>Surface</Mono>
              <FilterPills options={SURFACE_FILTERS} active={surfaceFilter} onChange={setSurfaceFilter} />
            </div>
          </div>

          {/* Result count */}
          <div style={{ marginBottom: 12 }}>
            <Mono color={T.dim} size={10}>{filteredSkills.length} skill{filteredSkills.length !== 1 ? "s" : ""}</Mono>
          </div>

          {/* Skill rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {filteredSkills.length === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <Mono color={T.dim}>No skills match these filters</Mono>
              </div>
            ) : filteredSkills.map(skill => {
              const dir = skill.phase ? `${skill.phase}-${T.phases[skill.phase]?.label.toLowerCase()}` : "";
              const url = dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
              return (
                <div key={skill.file} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", background: T.surface, borderRadius: 8,
                  border: `1px solid ${T.border}`,
                }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Mono color={T.muted} size={11}>{skill.file}</Mono>
                      <PhaseTag phaseId={skill.phase} small />
                      <SkillBadge surface={skill.surface} />
                    </div>
                    <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{skill.desc}</div>
                  </div>
                  <a href={url} download style={{
                    padding: "5px 12px", borderRadius: 5, flexShrink: 0,
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    background: "transparent", border: `1px solid ${T.border}`,
                    color: T.muted, textDecoration: "none", whiteSpace: "nowrap",
                  }}>↓ .md</a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Path: Deliverable ─────────────────────────────────────────────────────────
const DELIVERABLE_GUIDE_PROMPT = `I'm working on a product design project and need help figuring out the right deliverable for my situation.

Please ask me these three questions one at a time — wait for my answer before asking the next:

1. What phase of the project are you in?
   (Discovery, Definition, Ideation, Prototyping, Validation, or Delivery — or "not sure")

2. Who is the primary audience for what you need to produce?
   (Client / Stakeholder / Engineering team / Design team / Myself)

3. What decision does this deliverable need to support?
   (e.g. align the team, get sign-off, guide development, understand users)

Based on my answers, recommend the most appropriate deliverable and tell me:
- Whether to use a Tool, a Prompt, or a Skill file to produce it
- The exact name of the tool, prompt, or skill to use
- One sentence on why this is the right choice for my situation`;

function DeliverablePath({ onOpenTool }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideCopied, setGuideCopied] = useState(false);

  const filtered = DELIVERABLES.filter(d =>
    typeFilter === "all" ? true : d.type === typeFilter
  );

  const typeColor = { tool: "#22C55E", prompt: "#8B5CF6" };

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {[
          { id: "all", label: "All" },
          { id: "tool", label: "Tool" },
          { id: "prompt", label: "Prompt" },
        ].map(f => {
          const isActive = typeFilter === f.id;
          return (
            <button key={f.id} onClick={() => setTypeFilter(f.id)} style={{
              padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.07em", textTransform: "uppercase",
              border: `1px solid ${isActive ? T.borderHover : T.border}`,
              background: isActive ? T.card : "transparent",
              color: isActive ? T.text : T.dim,
              transition: "all 0.12s",
            }}>{f.label}</button>
          );
        })}
        <div style={{ marginLeft: "auto" }}>
          <Mono color={T.dim} size={10}>{filtered.length} deliverable{filtered.length !== 1 ? "s" : ""}</Mono>
        </div>
      </div>

      {/* Deliverable rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
        {filtered.map(d => (
          <div key={d.name} style={{
            display: "flex", alignItems: "center", padding: "13px 16px",
            background: T.surface, borderRadius: 8, border: `1px solid ${T.border}`,
            gap: 14,
          }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: T.text, flex: "0 0 190px" }}>{d.name}</span>
            <span style={{ color: T.border, flexShrink: 0, fontSize: 12 }}>→</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "2px 7px", borderRadius: 3,
                background: `${typeColor[d.type]}18`,
                border: `1px solid ${typeColor[d.type]}40`,
                color: typeColor[d.type], flexShrink: 0,
              }}>{d.type}</span>
              <span style={{ fontSize: 12, color: T.muted }}>{d.label}</span>
            </div>
            {d.type === "tool" && (
              <button onClick={() => onOpenTool(d.ref)} style={{
                padding: "5px 14px", borderRadius: 5, flexShrink: 0,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: "transparent", border: `1px solid ${T.border}`,
                color: T.muted, cursor: "pointer",
              }}>Open Tool</button>
            )}
            {d.type === "prompt" && (
              <CopyBtn text={PROMPTS.find(p => p.id === d.ref)?.text || ""} label="Copy Prompt" />
            )}
          </div>
        ))}
      </div>

      {/* Don't see what you need? */}
      <div style={{
        border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden",
      }}>
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 16px", background: "transparent", border: "none",
            cursor: "pointer", textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: T.muted }}>Don't see the deliverable you need?</span>
          </div>
          <span style={{
            fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace",
            transform: guideOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s",
          }}>▾</span>
        </button>

        {guideOpen && (
          <div style={{ borderTop: `1px solid ${T.border}`, padding: "16px 16px 18px" }}>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, marginBottom: 14 }}>
              Copy this prompt into Claude Chat. Claude will ask you three questions and recommend the right deliverable, method, and tool for your situation.
            </p>
            <pre style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: T.muted, lineHeight: 1.7, whiteSpace: "pre-wrap",
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 6, padding: "14px 16px", margin: "0 0 14px",
              overflowX: "auto",
            }}>{DELIVERABLE_GUIDE_PROMPT}</pre>
            <button
              onClick={() => {
                navigator.clipboard.writeText(DELIVERABLE_GUIDE_PROMPT);
                setGuideCopied(true);
                setTimeout(() => setGuideCopied(false), 1800);
              }}
              style={{
                padding: "8px 16px", borderRadius: 6,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer",
                border: `1.5px solid ${guideCopied ? "#22C55E" : T.border}`,
                background: "transparent",
                color: guideCopied ? "#22C55E" : T.muted,
                transition: "all 0.15s",
              }}
            >{guideCopied ? "✓ Copied" : "Copy Prompt"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tool shell ────────────────────────────────────────────────────────────────
function ToolShell({ tool, onHome }) {
  const ToolComponent = tool.component;
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${T.bg}ee`, backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        padding: "0 28px", display: "flex", alignItems: "center", gap: 12, height: 52,
      }}>
        <button onClick={onHome} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "transparent", border: `1px solid ${T.border}`,
          borderRadius: 6, padding: "5px 12px", cursor: "pointer",
          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.06em", textTransform: "uppercase",
          color: T.muted, transition: "all 0.15s",
        }}>← Home</button>
        <div style={{ width: 1, height: 16, background: T.border }} />
        <PhaseTag phaseId={tool.phase} small />
        <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>{tool.name}</span>
      </div>
      <ToolComponent />
    </div>
  );
}


// ── Zip download button ───────────────────────────────────────────────────────
function ZipDownloadBtn({ skills }) {
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  async function handleZip() {
    setStatus("loading");
    try {
      // Load JSZip dynamically
      if (!window.JSZip) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const zip = new window.JSZip();
      const folder = zip.folder("agentic-design-framework-skills");

      // Fetch all visible skill files in parallel
      const results = await Promise.allSettled(
        skills.map(async skill => {
          const phaseLabel = skill.phase ? T.phases[skill.phase]?.label?.toLowerCase() : "";
          const dir = skill.phase ? `${skill.phase}-${phaseLabel}` : "";
          const url = dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed: ${skill.file}`);
          const text = await res.text();
          return { file: skill.file, text };
        })
      );

      results.forEach(r => {
        if (r.status === "fulfilled") {
          folder.file(r.value.file, r.value.text);
        }
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "agentic-design-framework-skills.zip";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (e) {
      console.error(e);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const label = status === "loading" ? "Zipping…"
    : status === "done" ? "✓ Downloaded"
    : status === "error" ? "Failed"
    : `↓ All ${skills.length} as .zip`;

  return (
    <button onClick={handleZip} disabled={status === "loading"} style={{
      padding: "5px 12px", borderRadius: 5,
      fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.06em", textTransform: "uppercase",
      background: "transparent",
      border: `1px solid ${status === "done" ? "#22C55E" : status === "error" ? "#EF4444" : T.border}`,
      color: status === "done" ? "#22C55E" : status === "error" ? "#EF4444" : T.muted,
      cursor: status === "loading" ? "not-allowed" : "pointer",
      whiteSpace: "nowrap", transition: "all 0.15s",
      opacity: status === "loading" ? 0.6 : 1,
    }}
      onMouseEnter={e => { if (status === "idle") { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}}
      onMouseLeave={e => { if (status === "idle") { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}}
    >{label}</button>
  );
}

// ── Skills Library Overlay ───────────────────────────────────────────────────
function SkillsLibraryOverlay({ onBack, onOpenSkill }) {
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [surfaceFilter, setSurfaceFilter] = useState("all");

  const PHASE_FILTERS = [
    { id: "all",   label: "All" },
    { id: "01",    label: "Discover" },
    { id: "02",    label: "Define" },
    { id: "03",    label: "Ideate" },
    { id: "04",    label: "Prototype" },
    { id: "05",    label: "Validate" },
    { id: "06",    label: "Deliver" },
    { id: "cross", label: "Cross-phase" },
  ];

  const SURFACE_FILTERS = [
    { id: "all",              label: "All" },
    { id: "chat",             label: "Chat" },
    { id: "chat + code",      label: "Chat + Code" },
    { id: "code + figma mcp", label: "Figma MCP" },
  ];

  const filtered = SKILL_FILES.filter(s => {
    const phaseMatch = phaseFilter === "all" ? true
      : phaseFilter === "cross" ? s.phase === null
      : s.phase === phaseFilter;
    const surfaceMatch = surfaceFilter === "all" ? true : s.surface === surfaceFilter;
    return phaseMatch && surfaceMatch;
  });

  function FilterPills({ options, active, onChange }) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {options.map(opt => {
          const isActive = active === opt.id;
          const phaseColor = opt.id !== "all" && opt.id !== "cross" && T.phases[opt.id]
            ? T.phases[opt.id].color : "#3B82F6";
          const activeColor = opt.id === "all" || opt.id === "cross" ? "#3B82F6" : phaseColor;
          return (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{
              padding: "4px 10px", borderRadius: 20, cursor: "pointer",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.07em", textTransform: "uppercase",
              border: `1px solid ${isActive ? T.borderHover : T.border}`,
              background: isActive ? T.card : "transparent",
              color: isActive ? T.text : T.dim,
              transition: "all 0.12s",
            }}>{opt.label}</button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`, padding: "0 clamp(24px, 5vw, 80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        background: `${T.bg}f0`, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
            color: T.muted, transition: "all 0.15s",
          }}>← Home</button>
          <div style={{ width: 1, height: 16, background: T.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>Skills Library</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
            {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
          </span>
          <ZipDownloadBtn skills={filtered} />
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px clamp(24px, 5vw, 80px) 80px" }}>

        {/* What is a Skill */}
        <div style={{
          background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)",
          borderRadius: 10, padding: "20px 24px", marginBottom: 32,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 14 }}>📎</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 6 }}>What is a Skill file?</div>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.65, marginBottom: 8 }}>
                Skill files are <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, background: T.card, padding: "1px 5px", borderRadius: 3 }}>.md</code> files you attach to a Claude Chat conversation before starting work. They give Claude the full context, methods, templates, and quality standards for a specific design phase — so every response is grounded in the framework rather than generic advice.
              </p>
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  "Download the .md file",
                  "Attach it to a new Claude Chat",
                  "Start working — Claude has full context",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#3B82F6", fontWeight: 700 }}>0{i + 1}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: T.dim, minWidth: 52 }}>Phase</span>
            <FilterPills options={PHASE_FILTERS} active={phaseFilter} onChange={setPhaseFilter} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: T.dim, minWidth: 52 }}>Surface</span>
            <FilterPills options={SURFACE_FILTERS} active={surfaceFilter} onChange={setSurfaceFilter} />
          </div>
        </div>

        {/* Skill list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "32px 0", textAlign: "center" }}>
              <span style={{ fontSize: 12, color: T.dim, fontFamily: "'JetBrains Mono', monospace" }}>No guides match these filters</span>
            </div>
          ) : filtered.map(skill => {
            const dir = skill.phase ? `${skill.phase}-${T.phases[skill.phase]?.label.toLowerCase()}` : "";
            const url = dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
            const surfaceColors = {
              "chat": { color: "#22C55E", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
              "chat + code": { color: "#3B82F6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)" },
              "code + figma mcp": { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
            };
            const sc = surfaceColors[skill.surface] || surfaceColors["chat"];
            const phaseColor = skill.phase ? T.phases[skill.phase]?.color : T.dim;

            return (
              <div key={skill.file} style={{
                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                padding: "14px 16px", background: T.surface, borderRadius: 8,
                border: `1px solid ${T.border}`, gap: 16,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
                onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
              >
                <div style={{ flex: 1 }}>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: T.muted }}>{skill.file}</span>
                    {skill.phase && (
                      <span style={{
                        fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: phaseColor,
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: phaseColor, display: "inline-block" }} />
                        {skill.phase} — {T.phases[skill.phase]?.label}
                      </span>
                    )}
                    {!skill.phase && (
                      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>Cross-phase</span>
                    )}
                    <span style={{
                      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "2px 7px", borderRadius: 3,
                      background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                    }}>{sc.color === "#22C55E" ? "Chat" : sc.color === "#3B82F6" ? "Chat + Code" : "Figma MCP"}</span>
                  </div>
                  {/* Description */}
                  <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, margin: 0 }}>{skill.desc}</p>
                </div>
                {/* Actions */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                  <button onClick={() => onOpenSkill(skill)} style={{
                    padding: "5px 12px", borderRadius: 5,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    background: "transparent", border: `1px solid ${T.border}`,
                    color: T.muted, cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                  >Preview →</button>
                  <a href={url} download style={{
                    padding: "5px 10px", borderRadius: 5,
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    background: "transparent", border: `1px solid ${T.border}`,
                    color: T.muted, textDecoration: "none", whiteSpace: "nowrap",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                  >↓</a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


// ── Markdown renderer ─────────────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return [];
  const lines = text.split("\n");
  const elements = [];
  let i = 0;
  let inCode = false;
  let codeLines = [];
  let codeLang = "";
  let inTable = false;
  let tableRows = [];

  function flushTable() {
    if (!tableRows.length) return;
    const header = tableRows[0];
    const body = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={`table-${i}`} style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr>{header.split("|").filter((_, ci) => ci > 0 && ci < header.split("|").length - 1).map((cell, ci) => (
              <th key={ci} style={{ padding: "8px 14px", borderBottom: `1px solid #2A2A2A`, textAlign: "left", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase", color: "#888", whiteSpace: "nowrap" }}>{cell.trim()}</th>
            ))}</tr>
          </thead>
          <tbody>
            {body.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: `1px solid #1A1A1A` }}>
                {row.split("|").filter((_, ci) => ci > 0 && ci < row.split("|").length - 1).map((cell, ci) => (
                  <td key={ci} style={{ padding: "8px 14px", color: "#888", verticalAlign: "top", lineHeight: 1.5 }}>{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  }

  function inlineFormat(text) {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    // Inline code
    text = text.replace(/`([^`]+)`/g, (_, m) => `<code style="font-family:'JetBrains Mono',monospace;font-size:11px;background:#1C1C1C;padding:2px 6px;border-radius:3px;color:#F2F2F2">${m}</code>`);
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${href}" target="_blank" style="color:#888;text-decoration:underline">${label}</a>`);
    return text;
  }

  while (i < lines.length) {
    const line = lines[i];

    // Code fence
    if (line.startsWith("```")) {
      if (inCode) {
        elements.push(
          <pre key={`code-${i}`} style={{
            background: "#1C1C1C", border: "1px solid #2A2A2A", borderRadius: 6,
            padding: "14px 16px", marginBottom: 20, overflowX: "auto",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            lineHeight: 1.7, color: "#888", whiteSpace: "pre",
          }}>{codeLines.join("\n")}</pre>
        );
        codeLines = []; inCode = false; codeLang = "";
      } else {
        inCode = true; codeLang = line.slice(3).trim();
      }
      i++; continue;
    }
    if (inCode) { codeLines.push(line); i++; continue; }

    // Table
    if (line.includes("|")) {
      if (!inTable) inTable = true;
      tableRows.push(line);
      i++; continue;
    } else if (inTable) {
      flushTable();
    }

    // Skip YAML frontmatter
    if (line === "---" && i === 0) { i++; while (i < lines.length && lines[i] !== "---") i++; i++; continue; }
    if (line === "---") { elements.push(<hr key={`hr-${i}`} style={{ border: "none", borderTop: "1px solid #2A2A2A", margin: "24px 0" }} />); i++; continue; }

    // H1
    if (line.startsWith("# ")) {
      elements.push(<h1 key={`h1-${i}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 400, color: "#F2F2F2", marginBottom: 10, marginTop: 8, lineHeight: 1.15 }} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />);
      i++; continue;
    }
    // H2
    if (line.startsWith("## ")) {
      elements.push(<h2 key={`h2-${i}`} style={{ fontSize: "clamp(15px, 1.5vw, 19px)", fontWeight: 600, color: "#F2F2F2", marginBottom: 10, marginTop: 32, paddingBottom: 10, borderBottom: "1px solid #2A2A2A" }} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(3)) }} />);
      i++; continue;
    }
    // H3
    if (line.startsWith("### ")) {
      elements.push(<h3 key={`h3-${i}`} style={{ fontSize: 13, fontWeight: 600, color: "#F2F2F2", marginBottom: 8, marginTop: 20 }} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(4)) }} />);
      i++; continue;
    }
    // H4
    if (line.startsWith("#### ")) {
      elements.push(<h4 key={`h4-${i}`} style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 6, marginTop: 16, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase" }} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(5)) }} />);
      i++; continue;
    }
    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={`bq-${i}`} style={{ borderLeft: "3px solid #444", paddingLeft: 16, margin: "12px 0", color: "#888", fontStyle: "italic", fontSize: 13, lineHeight: 1.65 }} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />
      );
      i++; continue;
    }
    // Unordered list
    if (line.match(/^(- |\* )/)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^(- |\* )/)) {
        listItems.push(lines[i].replace(/^(- |\* )/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 20, marginBottom: 16, listStyle: "none" }}>
          {listItems.map((item, li) => (
            <li key={li} style={{ fontSize: 13, color: "#888", lineHeight: 1.65, marginBottom: 4, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#444", flexShrink: 0, marginTop: 2 }}>—</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }
    // Ordered list
    if (line.match(/^\d+\. /)) {
      const listItems = [];
      let startNum = 1;
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: 20, marginBottom: 16, listStyle: "none", counterReset: "list" }}>
          {listItems.map((item, li) => (
            <li key={li} style={{ fontSize: 13, color: "#888", lineHeight: 1.65, marginBottom: 6, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#555", flexShrink: 0, marginTop: 3, minWidth: 16 }}>{li + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }
    // Checkbox list
    if (line.match(/^- \[[ x]\]/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^- \[[ x]\]/)) {
        const checked = lines[i].includes("[x]");
        items.push({ checked, text: lines[i].replace(/^- \[[ x]\] /, "") });
        i++;
      }
      elements.push(
        <ul key={`check-${i}`} style={{ paddingLeft: 4, marginBottom: 16, listStyle: "none" }}>
          {items.map((item, li) => (
            <li key={li} style={{ fontSize: 13, color: "#888", lineHeight: 1.65, marginBottom: 4, display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ fontSize: 12, color: item.checked ? "#22C55E" : "#444", flexShrink: 0, marginTop: 1 }}>{item.checked ? "☑" : "☐"}</span>
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item.text) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }
    // Empty line
    if (line.trim() === "") { elements.push(<div key={`space-${i}`} style={{ height: 8 }} />); i++; continue; }

    // Paragraph
    elements.push(
      <p key={`p-${i}`} style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
    );
    i++;
  }

  if (inTable) flushTable();
  return elements;
}

// ── Skill Detail Page ─────────────────────────────────────────────────────────
function SkillDetailPage({ skill, onBack }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const phaseLabel = skill.phase ? T.phases[skill.phase]?.label?.toLowerCase() : "";
  const dir = skill.phase ? `${skill.phase}-${phaseLabel}` : "";
  const url = dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
  const phaseColor = skill.phase ? T.phases[skill.phase]?.color : T.dim;

  useState(() => {
    fetch(url)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(text => { setContent(text); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  });

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: `1px solid ${T.border}`,
        padding: "0 clamp(24px, 5vw, 80px)", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: `${T.bg}f0`, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: `1px solid ${T.border}`,
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
            color: T.muted, transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >← Skills Library</button>
          <div style={{ width: 1, height: 16, background: T.border }} />
          {skill.phase && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: phaseColor }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: phaseColor }} />
              {skill.phase} — {T.phases[skill.phase]?.label}
            </span>
          )}
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: T.muted }}>{skill.file}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SkillBadge surface={skill.surface} />
          <a href={url} download style={{
            padding: "5px 14px", borderRadius: 5,
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
            background: "transparent", border: `1px solid ${T.border}`,
            color: T.muted, textDecoration: "none",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >↓ Download</a>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px clamp(24px, 5vw, 80px) 96px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: T.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading skill…</span>
          </div>
        )}
        {error && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <span style={{ fontSize: 13, color: T.dim }}>Couldn't load this skill file. </span>
            <a href={url} download style={{ fontSize: 13, color: T.muted, textDecoration: "underline" }}>Download it instead</a>
          </div>
        )}
        {content && (
          <div>{renderMarkdown(content)}</div>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activePath, setActivePath] = useState(null);  // "phase" | "ways" | "deliverable"
  const [activeTool, setActiveTool] = useState(null);
  const [showFigmaGuide, setShowFigmaGuide] = useState(false);
  const [showSkillsLibrary, setShowSkillsLibrary] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => { setTimeout(() => setMounted(true), 60); }, []);

  // Figma guide
  if (showFigmaGuide) return <FigmaSetupGuide onBack={() => setShowFigmaGuide(false)} />;

  // Skills Library overlay
  if (activeSkill) return <SkillDetailPage skill={activeSkill} onBack={() => setActiveSkill(null)} />;
  if (showSkillsLibrary) return <SkillsLibraryOverlay onBack={() => setShowSkillsLibrary(false)} onOpenSkill={setActiveSkill} />;

  // Active tool
  if (activeTool) {
    const tool = TOOLS.find(t => t.id === activeTool);
    if (tool) return <ToolShell tool={tool} onHome={() => setActiveTool(null)} />;
  }

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'DM Sans', sans-serif", color: T.text,
      opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        a { color: inherit; }
        img, video { max-width: 100%; height: auto; }
        :focus-visible { outline: 2px solid #999999; outline-offset: 2px; border-radius: 4px; }
        button:focus:not(:focus-visible), a:focus:not(:focus-visible) { outline: none; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        padding: "0 40px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        background: `${T.bg}f0`, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 3 }}>
            {Object.values(T.phases).map(p => (
              <div key={p.label} style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }} />
            ))}
          </div>
          <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
            Agentic Product Design Framework
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => setShowSkillsLibrary(true)} style={{
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
            color: T.dim, background: "none", border: "none",
            cursor: "pointer", transition: "color 0.15s", padding: 0,
          }}
            onMouseEnter={e => e.target.style.color = T.muted}
            onMouseLeave={e => e.target.style.color = T.dim}
          >Skills Library</button>
          <div style={{ width: 1, height: 12, background: T.border }} />
          {[["GitHub", REPO], ["Figma", FIGMA_URL], ["Deck", PPTX_URL]].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em", textTransform: "uppercase",
              color: T.dim, textDecoration: "none", transition: "color 0.15s",
            }}
              onMouseEnter={e => e.target.style.color = T.muted}
              onMouseLeave={e => e.target.style.color = T.dim}
            >{label}</a>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "72px clamp(24px, 5vw, 80px) 96px" }}>

        {/* Home pill — only when a path is active */}
        {activePath && <HomePill onClick={() => setActivePath(null)} />}

        {/* What it is */}
        {!activePath && (
          <div style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 20 }}>
              <Mono color={T.dim} size={13}>Framework</Mono>
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 400, lineHeight: 1.05,
              color: T.text, marginBottom: 16, letterSpacing: "-0.3px",
            }}>
              A system for using Claude<br />
              <em style={{ fontStyle: "italic", color: T.muted }}>across every phase of product design.</em>
            </h1>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, maxWidth: 600, marginBottom: 0 }}>
              From research through delivery — skills, tools, and prompts that integrate Claude into how your team already works.
            </p>
          </div>
        )}

        {/* Setup block — always visible on home, hidden once a path is chosen */}
        {!activePath && <SetupBlock onOpenFigmaGuide={() => setShowFigmaGuide(true)} />}

        {/* Path chooser — styled strip, doubles as entry point */}
        {!activePath && (
          <div style={{ marginBottom: 20 }}>
            <Mono color={T.dim} size={12}>How do you want to start?</Mono>
          </div>
        )}

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 1, marginBottom: activePath ? 32 : 0,
          border: `1px solid ${activePath ? T.border : T.border}`,
          borderRadius: 10, overflow: "hidden",
        }}>
          {[
            {
              id: "phase",
              label: "Start with a Phase",
              color: "#22C55E",
              desc: "I know where I am in the project. Show me tools and guides for that phase.",
              cta: "Choose a phase →",
            },
            {
              id: "ways",
              label: "Ways to Work",
              color: "#8B5CF6",
              desc: "I know what I need to do. Show me tools, prompts, and guides by method.",
              cta: "Browse methods →",
            },
            {
              id: "deliverable",
              label: "Start with a Deliverable",
              color: "#F59E0B",
              desc: "I know what I need to hand off. Find the fastest path to that output.",
              cta: "Find a deliverable →",
            },
          ].map((item, i) => {
            const isActive = activePath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePath(activePath === item.id ? null : item.id)}
                style={{
                  background: T.surface,
                  border: "none",
                  padding: "20px 20px 18px", textAlign: "left",
                  cursor: "pointer", transition: "background 0.15s",
                  borderRight: i < 2 ? `1px solid ${T.border}` : "none",
                  borderBottom: isActive ? `1px solid ${T.borderHover}` : "1px solid transparent",
                  outline: "none",
                  display: "flex", flexDirection: "column",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.card; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = T.surface; }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: isActive ? T.text : T.dim,
                    transition: "background 0.15s",
                  }} />
                  <span style={{
                    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: isActive ? T.text : T.muted,
                    transition: "color 0.15s",
                  }}>{item.label}</span>
                </div>
                <p style={{ fontSize: 12, color: isActive ? T.muted : T.dim, lineHeight: 1.6, margin: 0, flex: 1, transition: "color 0.15s" }}>
                  {item.desc}
                </p>
                <span style={{
                  fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: isActive ? T.muted : T.dim,
                  transition: "color 0.15s",
                  marginTop: 14, display: "block",
                }}>{item.cta}</span>
              </button>
            );
          })}
        </div>

        {/* Path content */}
        {activePath === "phase" && (
          <div style={{ marginTop: 8 }}>
            <PhasePath
              onOpenTool={setActiveTool}
              onOpenSkill={setActiveSkill}
            />
          </div>
        )}

        {activePath === "ways" && (
          <div style={{ marginTop: 8 }}>
            <WaysToWorkPath onOpenTool={setActiveTool} />
          </div>
        )}

        {activePath === "deliverable" && (
          <div style={{ marginTop: 8 }}>
            <DeliverablePath
              onOpenTool={setActiveTool}
              onOpenPrompt={() => {}}
            />
          </div>
        )}

        {/* Footer — only on home */}
        {!activePath && (
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono color={T.dim} size={10}>Agentic Product Design Framework</Mono>
            <div style={{ display: "flex", gap: 4 }}>
              {Object.values(T.phases).map(p => (
                <div key={p.label} style={{ width: 24, height: 2, background: p.color, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
