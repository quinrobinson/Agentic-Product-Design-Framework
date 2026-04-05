import { useState, useEffect } from "react";
import AIBriefGenerator from "./AIBriefGenerator";
import ClientDeckBuilder from "./ClientDeckBuilder";
import FigmaSetupGuide from "./FigmaSetupGuide";
import SkillsLibrary from "./SkillsLibrary";
import DesignSystemStudio from "./DesignSystemStudio";
import ResearchSynthesizer from "./ResearchSynthesizer";
import ServiceBlueprintGenerator from "./ServiceBlueprintGenerator";
import CompetitiveSnapshotBuilder from "./CompetitiveSnapshotBuilder";
import ProblemFramingTool from "./ProblemFramingTool";
import JourneyMappingTool from "./JourneyMappingTool";
import ConceptGenerator from "./ConceptGenerator";
import IdeaClusteringTool from "./IdeaClusteringTool";
import UXCopyWriter from "./UXCopyWriter";
import UserFlowMapper from "./UserFlowMapper";
import ComponentArchitecturePlanner from "./ComponentArchitecturePlanner";
import ComponentStateSpecifier from "./ComponentStateSpecifier";
import PrototypeHandoffGenerator from "./PrototypeHandoffGenerator";
import FindingsSynthesizer from "./FindingsSynthesizer";
import InsightReportGenerator from "./InsightReportGenerator";
import ComponentSpecGenerator from "./ComponentSpecGenerator";
import DesignQALogger from "./DesignQALogger";

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
  { id: "brief",              number: "01", phase: null, name: "Design Brief Generator",      subtitle: "Turn project context into a Claude-ready design brief",                          component: AIBriefGenerator },
  { id: "deck",               number: "02", phase: null, name: "Client Deck Builder",          subtitle: "Build the right presentation for any stage of a project",                        component: ClientDeckBuilder },
  { id: "design-system",      number: "03", phase: null, name: "Design System Studio",        subtitle: "Build or audit a complete design system with live previews",                     component: DesignSystemStudio },
  { id: "research-synthesizer",number:"05", phase: "01", name: "Research Synthesizer",        subtitle: "Turn raw interviews into a structured Research Brief",                           component: ResearchSynthesizer },
  { id: "service-blueprint",  number: "05", phase: "01", name: "Service Blueprint Generator", subtitle: "Map current and future state experiences across five swim lanes",                component: ServiceBlueprintGenerator },
  { id: "competitive-snapshot", number: "06", phase: "01", name: "Competitive Snapshot Builder", subtitle: "Map the landscape, audit competitors, and find differentiation opportunities",    component: CompetitiveSnapshotBuilder },
  { id: "problem-framing",      number: "07", phase: "02", name: "Problem Framing",             subtitle: "Generate, pressure-test, and score problem statements + HMW questions",           component: ProblemFramingTool },
  { id: "journey-mapping",      number: "08", phase: "02", name: "Journey Mapping",             subtitle: "Generate research-grounded journey maps across six lanes with critical moments",  component: JourneyMappingTool },
  { id: "concept-generator",    number: "09", phase: "03", name: "Concept Generator",          subtitle: "Generate concepts across 5 angles including outside-the-box thinking from unrelated domains", component: ConceptGenerator },
  { id: "idea-clustering",      number: "10", phase: "03", name: "Idea Clustering",             subtitle: "Transform raw concepts into a strategic landscape — clusters, tensions, and recommendations", component: IdeaClusteringTool },
  { id: "ux-copy-writer",       number: "11", phase: "04", name: "UX Copy Writer",              subtitle: "Generate complete interface copy — voice brief, flow copy, error states, and empty states",      component: UXCopyWriter },
  { id: "user-flow-mapper",     number: "12", phase: "04", name: "User Flow Mapper",            subtitle: "Map happy paths, branches, and error states — producing a screen inventory and prototype brief", component: UserFlowMapper },
  { id: "component-architecture", number: "13", phase: "04", name: "Component Architecture Planner", subtitle: "Define every component, variant, and token assignment before opening Figma", component: ComponentArchitecturePlanner },
  { id: "component-state",      number: "14", phase: "04", name: "Component State Specifier",    subtitle: "Document every state, transition, and Figma property for one component at a time", component: ComponentStateSpecifier },
  { id: "proto-handoff",        number: "15", phase: "04", name: "Prototype Handoff Generator",   subtitle: "Document decisions, surface gaps, rank hypotheses, and generate a Findings Synthesizer handoff block", component: PrototypeHandoffGenerator },
  { id: "findings-synthesizer",  number: "13", phase: "05", name: "Findings Synthesizer",        subtitle: "Structure session notes, synthesize across participants, rate severity, and generate a go/no-go decision", component: FindingsSynthesizer },
  { id: "insight-report",        number: "14", phase: "05", name: "Insight Report Generator",     subtitle: "Generate findings reports for four stakeholder audiences plus an iteration brief for the next prototype cycle", component: InsightReportGenerator },
  { id: "component-spec",        number: "15", phase: "06", name: "Component Spec Generator",     subtitle: "Generate complete component specs — anatomy, all states, behavior, spacing, and edge cases — ready for developer handoff", component: ComponentSpecGenerator },
  { id: "design-qa",             number: "16", phase: "06", name: "Design QA Logger",             subtitle: "Structure QA notes into a severity-rated issue log with launch recommendation and developer sign-off checklist", component: DesignQALogger },
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
  { file: "user-flow-mapping.md",     phase: "04", leverage: "high",      surface: "chat",         desc: "Map every path a user can take — happy path, branches, error states, and edge cases — before wireframing begins." },
  { file: "ux-copy-writing.md",       phase: "04", leverage: "very high",  surface: "chat",         desc: "Write all interface text for a prototype — labels, CTAs, errors, empty states, onboarding, and confirmations — grounded in the product voice." },
  { file: "prototype-scoping.md",     phase: "04", leverage: "high",      surface: "chat",         desc: "Define what to build and what to leave out — translate concept risks into prototype questions and scope the minimum viable prototype." },
  { file: "heuristic-review.md",      phase: "04", leverage: "high",      surface: "chat",         desc: "Evaluate a prototype against Nielsen's 10 usability heuristics before user testing — with severity ratings and specific fixes." },
  { file: "test-script-drafting.md",  phase: "04", leverage: "high",      surface: "chat",         desc: "Write a complete usability test script — tasks, probing questions, and debrief — that directly tests the prototype's highest-risk assumptions." },
  { file: "prototyping.md",           phase: "04", leverage: "high",      surface: "chat + code",  desc: "Builds functional React or HTML prototypes with correct touch targets, timing, and a QA checklist." },
  { file: "accessibility-audit.md",    phase: "04", leverage: "high", surface: "chat",           desc: "Runs a WCAG 2.1 AA audit — contrast, keyboard nav, focus management, screen reader behavior." },
  { file: "usability-findings-synthesis.md", phase: "05", leverage: "high", surface: "chat",   desc: "Synthesize raw usability test session notes into themes, frequency counts, severity ratings, and design recommendations across 5+ sessions." },
  { file: "insight-report.md",         phase: "05", leverage: "high",   surface: "chat",           desc: "Generate a complete usability test findings report — specific observations, direct quotes, recommendations, and a go/no-go decision." },
  { file: "recruitment-screener.md",   phase: "05", leverage: "high",   surface: "chat",           desc: "Generate participant recruitment criteria and screener questions from a persona — ensuring test participants match the user being designed for." },
  { file: "stakeholder-presentation.md", phase: "05", leverage: "high", surface: "chat",           desc: "Reframe usability findings for three audiences: executive summary, engineering change list, and design team debrief." },
  { file: "iteration-brief.md",        phase: "05", leverage: "high",   surface: "chat",           desc: "Convert test findings into a precise iteration brief — what to change, what to preserve, and what the next prototype must answer." },
  { file: "usability-testing.md",      phase: "05", leverage: "high", surface: "chat",           desc: "Plans tests, writes task scenarios, and synthesizes session notes into a severity-ranked report." },
  { file: "component-specs.md",         phase: "06", leverage: "high", surface: "chat",           desc: "Generate complete component specifications — every state, variant, spacing value, interaction, and edge case — ready for developer handoff." },
  { file: "design-qa.md",               phase: "06", leverage: "high", surface: "chat",           desc: "Structure, prioritize, and document design QA issues — comparing implementation against spec and producing a severity-rated issue log." },
  { file: "handoff-annotation.md",      phase: "06", leverage: "high", surface: "chat",           desc: "Generate screen-by-screen annotation text — behavior notes, edge cases, and interaction explanations — that prevent implementation errors before they happen." },
  { file: "design-decision-record.md",  phase: "06", leverage: "high", surface: "chat",           desc: "Document why specific design choices were made — context, alternatives, rationale, and tradeoffs — as a permanent record that prevents relitigating decisions." },
  { file: "accessibility-annotation.md",phase: "06", leverage: "high", surface: "chat",           desc: "Generate ARIA roles, keyboard navigation, focus management, and screen reader behavior specs for WCAG 2.1 AA compliant developer handoff." },
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
  {
    id: "generate-concepts",
    name: "Generate Concepts",
    phase: "03",
    skill: "concept-generation.md",
    when: "After locking a problem statement — when you need a broad set of concept directions before committing to one. Use when not running the interactive tool.",
    text: `Generate a broad set of concept directions from this problem frame.

Problem statement: [paste HMW / JTBD / User + Need + Insight]
Primary persona: [name, role, context, goal]
Top HMW questions:
1. [HMW statement]
2. [HMW statement]
3. [HMW statement]
Key constraints: [technical, business, user constraints]

Using the concept-generation skill, generate across three angles:

ANGLE 1 — From the problem (baseline)
5 distinct concepts directly from the HMW questions.
Each needs: 2–4 word name / one-liner (user perspective) /
core mechanism / assumption it bets on.
No two concepts should produce the same wireframe.

ANGLE 2 — First principles
Forget how [product category] works today. What does [persona]
fundamentally need? Generate 3 concepts that don't resemble any
current product in this space.

ANGLE 3 — Worst idea first
Generate the 8 worst possible solutions — terrible, embarrassing,
user-frustrating. Then reverse each: what does the opposite suggest?
Develop the 3 most interesting reversals into full concepts.

Do not evaluate during generation. All ideas stay alive until clustering.`,
  },
  {
    id: "outside-the-box",
    name: "Think Outside Your Domain",
    phase: "03",
    skill: "concept-generation.md",
    when: "When ideas all feel like variations of the same solution. Use to break expert fixedness by importing structural principles from unrelated fields.",
    text: `Find structural parallels in unrelated domains — then transfer the underlying principle.

Problem statement: [paste]
Primary persona: [name, role, context, goal]

Step 1 — Find analogous domains
Identify 5 domains outside [product category] that solved a structurally similar problem.
Look in: emergency medicine, investigative journalism, aviation safety,
military logistics, competitive sport coaching, architecture,
legal discovery, supply chain, game design, financial trading, education.

For each domain:
1. Name the domain
2. How they solved the structurally similar problem (be specific)
3. The underlying principle — stripped of domain-specific details

Step 2 — Transfer the principle
For the 3 most transferable principles:
- Translate into a concrete product concept for [persona]
- Describe what changes in the transfer and what stays the same
- 2–4 word name + one-liner from the user's perspective

The test: are these concepts different from what you'd generate inside
the domain? If not — go deeper on the principle extraction.`,
  },
  {
    id: "cluster-ideas",
    name: "Cluster Ideas into Directions",
    phase: "03",
    skill: "idea-clustering.md",
    when: "After generating 15+ concepts — to see the strategic landscape before deciding what to develop. Use when not running the Idea Clustering tool.",
    text: `Cluster this concept set into strategic directions.

Problem statement: [paste]
Primary persona: [paste]

All concepts:
[PASTE full list — names + one-liners minimum]

Using the idea-clustering skill:

Step 1 — Group by underlying approach
5–7 clusters. Cluster by mechanism, not surface similarity.
Each cluster = a different bet about how to solve the problem.
Every concept in exactly one cluster. Merge variations. Flag outliers.

For each cluster:
- Working name (3–5 words, action-oriented)
- Strategic bet (one sentence)
- Concepts included (names + one-liners)

Step 2 — Name each cluster three ways
- Descriptive: what the solution does
- User-centric: the outcome for the user
- Provocative: the strategic bet or tension
Recommend one name per cluster — why does it best communicate the
direction to a stakeholder who wasn't in the session?

Step 3 — Map the landscape
For each cluster: strategic position (safe/incremental/ambitious/
transformative), core assumption, key trade-off.
Which two clusters are most directly in tension?
What must be decided before prototyping can start?`,
  },
  {
    id: "critique-concept",
    name: "Critique a Concept",
    phase: "03",
    skill: "concept-critique.md",
    when: "Before committing to prototyping — to surface weaknesses, hidden assumptions, and user risks that enthusiasm obscures. Run before any wireframes exist.",
    text: `Act as an adversarial reviewer. Find what's wrong before it goes into prototyping.

Concept:
- Name: [concept name]
- One-liner: [what it does from the user's perspective]
- Core mechanism: [what makes it work]
- Key assumption: [what must be true for this to succeed]

Problem statement: [paste]
Primary persona: [paste — include current tools and workarounds]
Research context: [paste key findings]

Using the concept-critique skill, run all five lenses:

LENS 1 — User reality check
Act as [persona]. Challenge on: mental model fit, workflow integration,
trust signals, and a realistic scenario where it breaks.

LENS 2 — Assumption audit
Every assumption across desirability / feasibility / viability / usability.
For each: state it, rate risk (Critical/Major/Minor),
evidence (Validated/Partial/None). Rank top 3.

LENS 3 — Adversarial review (make each objection as strong as possible)
1. Skeptical engineer — technical feasibility and maintenance
2. Risk-averse PM — scope, timeline, failure scenarios
3. Resistant user — busiest, most change-averse version of [persona]

LENS 4 — Competitive displacement
Why would [persona] switch? What's the switching cost?
At what point does value outweigh cost?

LENS 5 — Failure modes in normal use
Include: "works as designed but user still doesn't get value."

Verdict: Proceed / Refine / Reframe? If refine — provide the improvement.`,
  },
  {
    id: "write-storyboard",
    name: "Write a Concept Storyboard",
    phase: "03",
    skill: "storyboarding.md",
    when: "After selecting a concept — to visualize the experience step by step before wireframing. Surfaces forced design decisions and prototype questions before any screens are built.",
    text: `Generate a scene-by-scene storyboard for this concept.

Selected concept:
- Name: [concept name]
- One-liner: [what it does from the user's perspective]
- Core mechanism: [what makes it work]

Persona: [name, role, context, goal]
Scenario trigger: [the specific event that starts this experience]
Goal: [what they need to accomplish]
Top risk from critique: [the assumption most likely to fail]

Using the storyboarding skill, generate a 6–8 scene storyboard.

For each scene:
**Scene [N]: [Specific title — e.g. "The realization hits at 4pm"]**
What happens: [Observable action — what a camera would capture]
[Persona] thinks: "[First-person internal monologue — specific to their situation]"
[Persona] feels: [Specific emotion + intensity]
The interface: [What they see/interact with — functional, not visual]

Rules:
- Ground every scene in research pain points
- Scene 3–4 is the highest-risk moment — detail it more than others
- Final scene shows emotional resolution, not just task completion
- No visual design — describe function and experience

After all scenes:
1. Emotional arc table (scene / title / emotional state)
2. Arc narrative (2–3 sentences)
3. Forced design decisions — choices the storyboard requires but doesn't make
4. Three questions for the prototype to answer`,
  },
  {
    id: "write-ux-copy",
    name: "Write UX Copy",
    phase: "04",
    skill: "ux-copy-writing.md",
    when: "When a prototype or feature needs real copy before testing — or when placeholder text is blocking meaningful stakeholder feedback.",
    text: `Write complete UX copy for this flow.

Product: [description — what it does and for whom]
Primary persona: [name, role, context, emotional state when using this]

Voice brief:
[4 adjectives describing the product voice]
[Example of what it sounds like — one phrase]
[Example of what it doesn't sound like — one phrase]

Flow to write copy for:
[List each screen — name + what happens on it]

For each screen, write:

**Screen: [Name]**
Headline: [primary message — user benefit, ≤7 words, present tense, active voice]
Body: [supporting context — 1–2 sentences max, only if headline needs it]
Primary CTA: [verb + noun — specific, not "Continue" or "Next"]
Secondary actions: [back, skip, or alternative path text]
Form labels: [every field — sentence case, noun phrase, no colons]
Helper text: [what user needs to know — what it does for them]
Placeholder text: [example data, not re-stated label]

Quality rules to apply:
— Every CTA must be verb + noun (never standalone "Submit")
— Headlines lead with user benefit, not system action
— No passive voice, no hedging words (may, might, possibly)
— Plain language — readable by a non-expert in this domain
— Challenge every word — if it doesn't change behavior, cut it`,
  },
  {
    id: "write-error-states",
    name: "Write Error + Empty States",
    phase: "04",
    skill: "ux-copy-writing.md",
    when: "When a prototype needs a complete failure mode library — before usability testing, before dev handoff, or when error copy has been deferred and needs to be written quickly.",
    text: `Write complete error state and empty state copy for this product.

Product: [description]
Voice brief: [adjectives + tone in error states — e.g. "Direct but never alarming. We explain what happened and what to do. We never blame the user."]
Flow context: [which screens / features this covers]

Apply the error message formula: [What happened] + [Why, if actionable] + [What to do]

## Error States
For each error — headline + body + primary action + secondary action:

1. Network / connection failure
2. Form validation — field level (inline, next to the field)
3. Form validation — form level (summary at top of form)
4. Permission denied (user doesn't have access)
5. Not found (the thing they're looking for doesn't exist)
6. Timeout (async operation took too long)
7. [Infer 2 product-specific errors from the flow context]

Rules:
— Never say just "Error" — say what happened
— Never blame the user ("You entered…" → "That doesn't look right…")
— Always give a next step — retry, contact support, or when it resolves

## Empty States
For each state — headline + body + primary CTA:

1. First use (most important — nothing has been created yet)
2. Search returned no results
3. Filtered list is empty
4. User cleared / deleted everything

## Confirmation Dialogs (destructive actions)
For each irreversible action in the flow:
— Headline (what's about to happen — never "Are you sure?")
— Body (consequence in plain language)
— Confirm CTA (the action — not "Yes")
— Cancel (always "Cancel" or "Keep [thing]")`,
  },
  {
    id: "map-user-flow",
    name: "Map a User Flow",
    phase: "04",
    skill: "user-flow-mapping.md",
    when: "Before wireframing a new feature — to define what screens need to exist, including error states and edge cases, before building any of them.",
    text: `Map this user flow completely — happy path, branches, errors, and screen inventory.

Entry point: [where this flow starts — specific trigger]
User's goal: [what they're trying to accomplish]
Persona: [who — context and what they already know]
Constraints: [technical, permission, or system limits]

Using the user-flow-mapping skill:

STEP 1 — Happy path
List every step as: [Step N]: [User or System] — [Action or Response]
Flag every decision point with → Decision
Flag every variable system response with → Variable

STEP 2 — Decision points + branches
For each decision point, map all branches:
Branch A: [condition] → [steps] → [outcome]
Branch B: [condition] → [steps] → [outcome]

STEP 3 — Error states
For each async operation or user input:
- What can go wrong
- What triggers it
- What the user sees
- What they can do (retry / back / support)
- Whether their progress is preserved

Cover: network failure, validation, permission denied, not found, timeout

STEP 4 — Screen inventory
For every unique state:
| Screen name | Type | Triggered by | Primary action | Leads to |

Group by: Happy path / Alternative paths / Error states / Empty states

At the end:
- Total screen count
- Recommended v1 prototype scope (which to build first and why)`,
  },
  {
    id: "heuristic-review",
    name: "Run a Heuristic Review",
    phase: "04",
    skill: "heuristic-review.md",
    when: "Before a usability test — to fix obvious problems so testing surfaces deeper insights. Also useful before a stakeholder review or dev handoff.",
    text: `Run a heuristic evaluation of this prototype against Nielsen's 10 usability heuristics.

User context: [persona — what they know, what they expect, their goals]
Task: [what the user is trying to accomplish in this flow]

Describe each screen (for each one):
[Screen name]: [What it contains, what actions are available, what the user is trying to do here]

For each of the 10 heuristics, evaluate:
1. Visibility of system status — does the user always know what's happening?
2. Match between system and real world — does it speak the user's language?
3. User control and freedom — can they undo, go back, or escape?
4. Consistency and standards — is the same thing always called the same thing?
5. Error prevention — does the design prevent errors before they happen?
6. Recognition over recall — do users see options rather than remember them?
7. Flexibility and efficiency — can experienced users find shortcuts?
8. Aesthetic and minimalist design — does every element earn its place?
9. Error recovery — do error messages explain what happened and what to do?
10. Help and documentation — is help available when needed?

For each heuristic:
- Rating: Pass / Partial / Fail
- Evidence: specific screen and element
- Severity: Critical (blocks task) / Major (significant friction) / Minor
- Fix: specific, actionable change

At the end, produce a prioritized fix list:
Fix before testing (Critical) → Fix before stakeholder review (Major) → Fix before handoff (Minor)`,
  },
  {
    id: "draft-test-script",
    name: "Draft a Test Script",
    phase: "04",
    skill: "test-script-drafting.md",
    when: "At the end of Prototype — before usability testing begins. Write the script before the prototype is done so testing starts the moment it's ready.",
    text: `Write a complete usability test script for this prototype.

Prototype: [what it tests — feature + concept name]
Persona: [who to recruit — role, context, experience level]
Session length: [N minutes — typically 45–60]
Prototype questions (from scoping):
1. [Question this prototype must answer]
2. [Question]
3. [Question]

Using the test-script-drafting skill, write:

INTRODUCTION (read aloud to every participant)
Include: what we're testing (the prototype, not them), think-aloud instructions,
"we didn't build this" framing, no wrong answers, recording consent, time commitment

WARM-UP QUESTIONS (3–5, before showing prototype)
About past behavior in this domain — not opinions about what they're about to see
Format: "Walk me through how you currently..."

TASKS (one per prototype question)
Each task needs:
- Scenario: realistic context that explains WHY they'd do this
- Task statement: in the user's language, not the product's
- Starting screen
- Success criteria (observable behavior — not "when they say done")
- 2–3 probing prompts for when they're silent or stuck

Rules for tasks:
— Never name what you want them to find
— Give them a realistic motivation
— One task per prototype question

PROBING QUESTIONS (after tasks, not during)
8–10 questions about reasoning, violated expectations, and copy comprehension

DEBRIEF (5 minutes)
Overall impression, comparison to current behavior, top 3 things that worked/didn't

OBSERVATION GUIDE (for note-takers)
What to watch for at each critical moment, note-taking codes, timing column`,
  },
  {
    id: "synthesize-findings",
    name: "Synthesize Usability Findings",
    phase: "05",
    skill: "usability-findings-synthesis.md",
    when: "After completing usability test sessions — to identify patterns, severity, and answers to prototype questions across participants. Use when not running the interactive Findings Synthesizer tool.",
    text: `Synthesize these usability test session notes into structured findings.

Sessions: [N participants]
Tasks tested:
1. [Task name]
2. [Task name]

Prototype questions:
1. [Question this test must answer]
2. [Question]
3. [Question]

Session notes (paste one per participant — use P1, P2 codes):

P1: [Raw or structured notes]
P2: [Raw or structured notes]
P3: [Raw or structured notes]

Using the usability-findings-synthesis skill:

Step 1 — For each prototype question:
- What did users do? (observable behaviors — cite participant codes)
- Success rate: [N of N completed]
- Where they struggled: (specific moments with P codes)
- Key quotes: (verbatim, with P codes)
- Answer: Yes / No / Partial + confidence (High/Medium/Low)

Step 2 — Issue list
For every distinct usability issue observed:
| Issue | Task | Participants affected | Representative quote |

Step 3 — Severity rating
Rate each issue:
- Critical: prevents task completion
- Major: significant friction, user recovers
- Minor: noticeable, low impact
- Cosmetic: preference only

Produce a prioritized fix list:
Fix before next test (Critical) → Fix in next iteration (Major) → Defer (Minor/Cosmetic)

Step 4 — What worked
List elements that tested well — these must not change in the next iteration.

Step 5 — Go / No-Go
Based on the findings, recommend: Proceed / Iterate / Return to ideation
State which finding drives the recommendation.`,
  },
  {
    id: "write-findings-report",
    name: "Write a Findings Report",
    phase: "05",
    skill: "insight-report.md",
    when: "After synthesizing usability findings — to produce a shareable document that drives design decisions and stakeholder alignment.",
    text: `Generate a complete usability test findings report.

Prototype: [name + fidelity]
Participants: [N]
Tasks: [list]
Prototype questions: [list]
Decision: [Proceed / Iterate / Return to ideation]

Findings synthesis:
[PASTE findings from synthesis — issue list, prototype question answers, severity ratings, what worked]

Using the insight-report skill, write:

EXECUTIVE SUMMARY (3–5 sentences)
What was tested, with whom, the single most important finding, and the decision.

PROTOTYPE QUESTION ANSWERS
For each question:
- Answer: Yes / No / Partial
- Evidence: [N of N participants + key observation]
- Confidence: High / Medium / Low
- Representative quote: "[verbatim]" — P[N]

CRITICAL FINDINGS (one section per finding)
Format per finding:
### Finding [N]: [Title — 5–8 words]
Observation: [What users did — specific, observable]
"[Direct quote]" — P[N]
Frequency: [N] of [N] participants
Severity: Critical
Why it matters: [effect on task completion]
Recommendation: [Specific change — not "improve X" but "change X to Y because Z"]

MAJOR FINDINGS (same format, briefer)

WHAT WORKED (equal importance to failures)
For each success: element + N/N success rate + why it matters to preserve

DECISION + NEXT STEPS
[Rationale + 3 ordered next steps]

Rules:
— Every Critical and Major finding needs a participant count and a direct quote
— Separate findings (what happened) from recommendations (what to do)
— Recommendations must be specific enough to wireframe from`,
  },
  {
    id: "write-screener",
    name: "Write a Recruitment Screener",
    phase: "05",
    skill: "recruitment-screener.md",
    when: "Before scheduling usability test sessions — to define who qualifies and write screening questions that find the right participants without revealing what qualifies.",
    text: `Write a participant recruitment screener for this usability test.

Product: [description]
Primary persona: [paste from persona-creation.md — behavioral segment, context, goals, current tools]
Test focus: [which tasks or scenarios will be tested]
Target participants: [N — typically 5 for qualitative usability testing]
Session format: [moderated remote / in-person / unmoderated]
Session length: [N minutes]
Compensation: [amount/format]

Using the recruitment-screener skill:

Step 1 — Inclusion and exclusion criteria
Define criteria in plain language before translating to questions:
Must be true (all): [behavioral and contextual — not demographic unless directly relevant]
Must not be true (any disqualifies): [competitor employees, researchers, internal team]

Step 2 — Screener questions
Write 5–8 questions that don't reveal which answer qualifies.
Rules:
— Use multiple choice — never open-ended for screening at scale
— Never reveal which answer qualifies
— Disguise disqualifying answers among plausible options
— Ask about behavior frequency with ranges, not absolutes
— Never ask "Are you a [persona label]?" — ask about what they do

Format each question:
Q[N]: [Question text]
Options: [A / B / C / D]
Qualifies if: [options] — INTERNAL NOTE
Disqualifies if: [options] — INTERNAL NOTE

Step 3 — Complete screener
Include: intro paragraph (vague enough not to prime participants),
all questions, qualified close, disqualified close`,
  },
  {
    id: "present-findings",
    name: "Present Findings to Stakeholders",
    phase: "05",
    skill: "stakeholder-presentation.md",
    when: "After writing the findings report — to reframe findings for audiences who weren't in the sessions and need different emphasis, depth, and decision framing.",
    text: `Reframe these usability test findings for [audience: Executive / Product Manager / Engineering / Design Team].

Findings report:
[PASTE complete findings report]

Decision: [Proceed / Iterate / Return to ideation]

Using the stakeholder-presentation skill, generate the [audience] version:

FOR EXECUTIVE (1 page max):
- The test: [one sentence]
- Key finding: [one sentence — the most important thing learned]
- Business implication: [one sentence — risk or opportunity]
- Decision: [one word + one sentence rationale]
- What we need: [the specific approval or input required]
No methodology, no minor findings, no design specifics.

FOR PRODUCT MANAGER:
- What we tested and what we were validating
- Which assumptions were confirmed vs. invalidated (each with evidence)
- Roadmap implications: scope impact of required changes
- Recommendation + minimum changes before shipping
- Timeline impact

FOR ENGINEERING LEAD:
Structured list only — no narrative.
Critical changes: component + current behavior + required behavior + user impact
Major changes: same format
What doesn't need to change (tested well)
Questions with architectural implications

FOR DESIGN TEAM:
Mental model findings: vocabulary users used, expectations brought, analogies made
Critical failures with behavioral root cause (not just symptoms)
What worked and why — specific design decisions that succeeded
Surprising observations
Open questions for the next round`,
  },
  {
    id: "write-iteration-brief",
    name: "Write an Iteration Brief",
    phase: "05",
    skill: "iteration-brief.md",
    when: "When the go/no-go decision is 'iterate' — to define exactly what changes to make, what to preserve, and what questions the next prototype must answer before starting any design work.",
    text: `Write an iteration brief from these usability test findings.

Prototype: [name]
Participants: [N]
Decision: Iterate

Findings:
[PASTE Critical and Major findings with recommendations]

What worked (must preserve):
[PASTE from findings report — what tested well]

Using the iteration-brief skill:

PRESERVE — Do not change (tested well)
For each element that worked:
| Element | Evidence (N/N succeeded) | Why it matters to keep |

CHANGE — Required fixes

Tier 1 (fix before next test — affects prototype questions):
| # | Element | Change required | Evidence | Effort |
Rules for Tier 1:
— Specific enough to wireframe without interpretation
— Too vague: "improve navigation" | Right level: "rename 'Account' to 'Files' — 4/5 users looked there for export"
— Links directly to a prototype question or Critical finding

Tier 2 (fix in this iteration, don't re-test):
Major findings that don't affect the core prototype questions
Copy and label changes

Tier 3 (defer):
Minor findings + cosmetic issues + changes requiring architectural rework

NEXT PROTOTYPE QUESTIONS
1. Does the Tier 1 fix work? — [what the next test will observe]
2. [Any question this round didn't fully answer]

WHAT'S STABLE (doesn't need re-testing)
[Elements validated in this round — treat as fixed in next iteration]`,
  },
  {
    id: "generate-component-spec",
    name: "Generate a Component Spec",
    phase: "06",
    skill: "component-specs.md",
    when: "Before any developer handoff — when Figma has the visual design but behavioral documentation is missing. Use when not running the interactive Component Spec Generator tool.",
    text: `Generate a complete component specification for developer handoff.

Component: [name — e.g. Primary Button]
Description: [what it does and where it appears]
Variants: [list all versions — size, style, type]
Design tokens: [token names if available — e.g. --color-primary-500, --spacing-4]

Using the component-specs skill, document all 8 categories:

1. PURPOSE + USAGE
One sentence: what job this component does.
When to use: [condition]
When not to use: [condition — what to use instead]

2. ANATOMY
Table of every element (including optional and invisible structure):
| Element | Type | Required | Notes |
Every element needs a name, type (text/icon/container/interactive/decorative), required status, and any constraints.

3. VARIANTS
| Variant | Differs from default in | Use when |

4. STATES (document all that apply)
For each: Default / Hover / Focus / Active / Disabled / Loading / Error / Success / Empty
- Trigger: [what causes this state]
- Visual change: [exactly what changes — color token, opacity, border]
- Functional change: [what the component can/can't do]
- Transition: [duration + easing — e.g. 150ms ease-out]
- Screen reader: [what gets announced]

5. BEHAVIOR
Interaction table: trigger → response → duration → easing
Keyboard: Tab / Enter / Space / Arrow keys / Escape — what each does
Focus management: where does focus go after each action?
prefers-reduced-motion: what happens when enabled?

6. SPACING + TYPOGRAPHY
Internal padding and gaps (use token names)
Typography per text element: font / weight / size / line-height / color token / truncation

7. ACCESSIBILITY
ARIA role, keyboard bindings, focus ring spec, key screen reader announcements

8. EDGE CASES
Long content, empty/no content, dark mode, high contrast, nested usage`,
  },
  {
    id: "write-handoff-annotations",
    name: "Write Handoff Annotations",
    phase: "06",
    skill: "handoff-annotation.md",
    when: "Before the developer handoff meeting — to annotate prototype screens with behavior notes, edge cases, and interaction explanations that aren't visible in the static design.",
    text: `Write handoff annotation content for these prototype screens.

Feature: [feature name]
Screens to annotate: [list each screen]

For each screen, generate annotation content a developer needs that isn't visible in the Figma file:

## Screen: [Name]

### Behavior notes
- [What happens when user taps/clicks [element]]
- [How [interaction] works — trigger, response, timing]
- [What state the screen is in when the user arrives here]

### Edge cases
- [What shows when [content element] is empty]
- [What happens when [text element] is very long — truncation rule]
- [How this screen behaves on the smallest supported viewport]
- [Dark mode — any elements that need special treatment]

### Interaction specifications
- [Animation: entrance/exit — duration and easing]
- [Scroll behavior — if applicable]
- [Touch targets — minimum sizes for interactive elements]

### Open questions for developer
- [ ] [Design decision not yet made that affects implementation]
- [ ] [Technical question the designer needs the developer's input on]

### What's NOT in scope
[Elements or interactions explicitly excluded from this build — to prevent scope creep]

Rules:
— Annotations describe behavior, not visual design (the Figma file handles visuals)
— Every open question is a checkbox — trackable, resolvable
— Flag anything that requires developer input before or during build`,
  },
  {
    id: "log-design-qa",
    name: "Log Design QA Issues",
    phase: "06",
    skill: "design-qa.md",
    when: "After engineering builds a feature and it's deployed to staging — to structure scattered QA notes into a severity-rated issue log that developers can action directly.",
    text: `Structure these design QA notes into a prioritized issue log.

Feature: [name]
Screens reviewed: [list]
Environment: [e.g. Staging — build 2.4.1]

Raw QA notes:
[PASTE raw notes in any format — scattered observations, Figma comments, screenshots descriptions, Slack messages]

Using the design-qa skill:

STEP 1 — Structure each issue
For every discrepancy between spec and implementation:

Issue [N]: [Short title — 5–8 words]
Screen: [screen name]
Element: [specific component or element]
Spec says: [what the approved design specifies]
Build has: [what was actually implemented]
Fix: [specific change required — concrete enough to action]

STEP 2 — Rate severity
P0: Blocks launch — broken functionality, severe a11y failure, or complete deviation that breaks user task
P1: Must fix before launch — significant visual deviation, wrong copy, missing state, layout broken on supported viewport
P2: Fix post-launch (within one sprint) — minor visual discrepancy, spacing off by 4–8px
P3: Polish backlog — preference-level difference, low-visibility element

STEP 3 — Launch recommendation
Based on P0 count: HOLD / APPROVED WITH CONDITIONS / APPROVED

STEP 4 — What passed
List screens and elements that correctly match spec — to prevent unnecessary changes

Severity summary at end: P0: [N] / P1: [N] / P2: [N] / P3: [N]`,
  },
  {
    id: "design-decision-record",
    name: "Write a Design Decision Record",
    phase: "06",
    skill: "design-decision-record.md",
    when: "At handoff and after major design reviews — to permanently document why key design choices were made. Almost never written under time pressure; Claude generates it from a conversation about the decisions.",
    text: `Generate a design decision record (DDR) for these design choices.

Feature: [name]
Date: [today's date]
Designer: [name]
Stakeholders involved: [list]

For each significant design decision made during this feature:

DECISION [N]: [Short title — what was decided]

Context:
[Why this decision needed to be made — what problem or constraint forced it]

Alternatives considered:
1. [Option A] — [brief description] — Rejected because: [reason]
2. [Option B] — [brief description] — Rejected because: [reason]
3. [Option C — what was chosen] — [brief description]

Decision: [What was decided — specific and unambiguous]

Rationale: [Why this option over the others — reference user research, technical constraints, or business requirements where relevant]

Tradeoffs accepted: [What this decision gives up — be honest about the downsides]

Future considerations: [When this decision should be revisited — what would trigger a change]

---

After all decisions:

ANTI-PATTERNS DOCUMENTED
[Design directions explicitly rejected — so future designers don't revisit them without new information]
- [Pattern] — rejected because: [reason] — would reconsider if: [condition]

OPEN DECISIONS
[ ] [Design question that was intentionally deferred — what information is needed to resolve it]

Rules:
— Document why, not what (the Figma file documents what)
— Be honest about tradeoffs — "we chose speed over completeness" is valid
— Flag anything that was decided under constraint that should be revisited later`,
  },
  {
    id: "write-accessibility-annotations",
    name: "Write Accessibility Annotations",
    phase: "06",
    skill: "accessibility-annotation.md",
    when: "Before developer handoff — to document ARIA roles, keyboard navigation, focus order, and screen reader behavior for WCAG 2.1 AA compliance. Systematic application of known standards; Claude generates the annotation content.",
    text: `Generate WCAG 2.1 AA accessibility annotations for these components and screens.

Feature: [name]
Components to annotate: [list]
Target: WCAG 2.1 AA

For each component, document:

COMPONENT: [Name]

ARIA role: [role — e.g. button, combobox, dialog, listbox, menu, navigation, region]
ARIA label: [if the visible label is insufficient or absent — e.g. aria-label="Close dialog"]
ARIA described-by: [if additional context is needed — e.g. aria-describedby="error-message-id"]
ARIA live: [if content updates dynamically — e.g. aria-live="polite" for status messages]

Keyboard behavior:
| Key | Action |
| Tab | [what receives focus / what is skipped — not interactive elements] |
| Enter | [primary action] |
| Space | [secondary action or toggle] |
| Arrow keys | [navigation within component — if applicable] |
| Escape | [dismiss / cancel / return focus] |

Focus management:
- Focus receives: [visual indicator — e.g. 2px solid #0066CC, 2px offset]
- After [action]: focus moves to [element]
- Focus trap: [Yes/No — if modal or dialog, focus must be trapped]
- Focus restoration: [after dismissal, focus returns to [trigger element]]

Screen reader announcements:
- On focus: "[what gets read — role + name + state]"
- On action: "[what gets announced — e.g. 'Dialog opened. Press Escape to close.']"
- On state change: "[e.g. 'Checkbox checked' / 'Loading' / 'Error: [message]']"
- On error: "[error message text + how to fix]"

Color and contrast:
- Text contrast: [minimum 4.5:1 for normal text, 3:1 for large text]
- UI component contrast: [minimum 3:1 for interactive elements and focus indicators]
- Information not conveyed by color alone: [confirm — if color is used to convey state, add icon or label]

Touch targets:
- Minimum size: 44×44px — [confirm or flag if smaller]
- Spacing between targets: [minimum 8px — flag if closer]`,
  },
];

// ── Deliverables map ─────────────────────────────────────────────────────────
const DELIVERABLES = [
  // Discover
  { phase: "01", name: "Research Brief",          type: "tool",   ref: "research-synthesizer",    label: "Research Synthesizer",           desc: "Turns raw interview notes and surveys into a structured brief with themes, pain points, and unmet needs.", output: "Shareable research brief" },
  { phase: "01", name: "Service Blueprint",       type: "tool",   ref: "service-blueprint",       label: "Service Blueprint Generator",    desc: "Maps the full experience across five swim lanes — exposing backstage failures invisible in a journey map.", output: "Current and/or future-state blueprint" },
  { phase: "01", name: "Competitive Analysis",    type: "tool",   ref: "competitive-snapshot",    label: "Competitive Snapshot Builder",   desc: "Audits competitors one by one using real web search, then synthesizes the landscape with differentiation opportunities.", output: "Competitive landscape + opportunity map" },
  { phase: "01", name: "Research Plan",           type: "prompt", ref: "plan-research",           label: "Plan Your Research",             desc: "Generates a complete research plan from a project brief — method recommendation, screener, timeline, and success criteria.", output: "Research plan ready to execute" },
  { phase: "01", name: "Interview Guide",         type: "prompt", ref: "interview-guide",         label: "Build an Interview Guide",       desc: "Writes a full discussion guide with warm-up, core questions, probes, and an observer notes template.", output: "Discussion guide + observer template" },
  { phase: "01", name: "HMW Statements",          type: "prompt", ref: "hmw-statements",          label: "Generate HMW Statements",        desc: "Converts research findings into ranked How Might We statements across five angles — ready to brief ideation.", output: "Prioritised HMW statement set" },
  // Define
  { phase: "02", name: "Problem Statement",       type: "tool",   ref: "problem-framing",         label: "Problem Framing",                desc: "Generates three framings (HMW / JTBD / User+Need+Insight), pressure-tests each, and recommends the strongest.", output: "Chosen, tested problem statement" },
  { phase: "02", name: "Journey Map",             type: "tool",   ref: "journey-mapping",         label: "Journey Mapping",                desc: "Produces a six-lane research-grounded journey map — actions, thoughts, emotions, pain points, workarounds, opportunities.", output: "Journey map with critical moments flagged" },
  // Ideate
  { phase: "03", name: "Concept Set",             type: "tool",   ref: "concept-generator",       label: "Concept Generator",              desc: "Generates concepts across five thinking angles including First Principles, Analogous, and Worst Idea First — breaking out of obvious directions.", output: "Named concept cards with strengths and risks" },
  { phase: "03", name: "Cluster Map",             type: "tool",   ref: "idea-clustering",         label: "Idea Clustering",                desc: "Groups a raw concept set by underlying strategic mechanism — not surface similarity — and maps tensions and gaps.", output: "Strategic landscape with recommended directions" },
  { phase: null, name: "Design System",           type: "tool",   ref: "design-system",           label: "Design System Studio",           desc: "Choose a theme, customize tokens, preview 14 core components live — export CSS with --apdf-* naming ready for Figma.", output: "Complete design system tokens + component previews" },
  // Prototype
  { phase: "04", name: "UX Copy",                 type: "tool",   ref: "ux-copy-writer",          label: "UX Copy Writer",                 desc: "Locks voice and tone first, then writes all flow copy, error states, empty states, and confirmations — grounded in the brief.", output: "Complete copy document for prototyping" },
  { phase: "04", name: "User Flow",               type: "tool",   ref: "user-flow-mapper",        label: "User Flow Mapper",               desc: "Maps the happy path, every branch, and every error state — producing a screen inventory and scoped prototype brief.", output: "Screen inventory + prototype brief" },
  { phase: "04", name: "Component Architecture",  type: "tool",   ref: "component-architecture",  label: "Component Architecture Planner", desc: "Takes your screen inventory and identifies every component, defines the variant matrix, and assigns design tokens before Figma opens.", output: "Ordered build list + token assignments" },
  { phase: "04", name: "Component State Spec",    type: "tool",   ref: "component-state",         label: "Component State Specifier",      desc: "Documents every state for one component — triggers, token deltas, transition timing, and Figma property setup.", output: "State spec + Figma property configuration" },
  { phase: "04", name: "Prototype Handoff",       type: "tool",   ref: "proto-handoff",           label: "Prototype Handoff Generator",    desc: "Documents decisions, surfaces gaps testers need to know about, ranks hypotheses by risk, and generates a Findings Synthesizer handoff block.", output: "Validate handoff block + ranked hypotheses" },
  // Validate
  { phase: "05", name: "Test Findings",           type: "tool",   ref: "findings-synthesizer",    label: "Findings Synthesizer",           desc: "Structures raw session notes, synthesizes patterns across participants, rates severity, and produces a Go/No-Go decision.", output: "Severity-rated issue list + Go/No-Go" },
  { phase: "05", name: "Findings Report",         type: "tool",   ref: "insight-report",          label: "Insight Report Generator",       desc: "Generates audience-specific versions of findings — engineering, executive, design team — plus an iteration brief for the next cycle.", output: "Three stakeholder reports + iteration brief" },
  // Deliver
  { phase: null, name: "Design Brief",            type: "tool",   ref: "brief",                   label: "Design Brief Generator",         desc: "Answers a few questions about your project and generates a Claude-ready brief — problem statement, phase roadmap, skill files, and a first prompt.", output: "Claude-ready project brief" },
  { phase: null, name: "Client Deck",             type: "tool",   ref: "deck",                    label: "Client Deck Builder",            desc: "Identifies the right deck type for your situation, then writes slide-by-slide structure with speaker notes and opening hook.", output: "Slide structure + speaker notes" },
  { phase: "06", name: "Component Spec",          type: "tool",   ref: "component-spec",          label: "Component Spec Generator",       desc: "Documents component anatomy, all interactive states, behavior, spacing, edge cases — complete enough for a developer to build without questions.", output: "Full component spec document" },
  { phase: "06", name: "QA Issue Log",            type: "tool",   ref: "design-qa",               label: "Design QA Logger",               desc: "Structures implementation review notes into a P0–P3 severity-rated issue log with an explicit launch recommendation.", output: "QA report + launch sign-off decision" },
];

// ── Phase data ────────────────────────────────────────────────────────────────
const PHASES = [
  {
    id: "01", label: "Discover", desc: "Research users, map the competitive landscape, and frame the opportunity space — before any design decisions are made.",
    skills: 5, tools: 3, prompts: 5,
    howToUse: {
      goal: "Understand users deeply enough to define the right problem.",
      comesIn: "A project brief, stakeholder hypothesis, or a feeling that something needs to change.",
      sequence: ["Plan research → Build an interview guide → Run sessions", "Synthesize notes → Competitive snapshot → Service blueprint (if needed)", "Frame insights as HMW statements → Pass to Define"],
      handoff: "Research synthesis, HMW questions, and a framed problem space ready for Define.",
      figma: "Use Figma MCP to organize research findings, affinity maps, and service blueprints in your project template.",
    },
  },
  {
    id: "02", label: "Define", desc: "Synthesize discovery findings into a locked problem statement, persona, journey map, and assumption map — the foundation everything else builds on.",
    skills: 5, tools: 2, prompts: 5,
    howToUse: {
      goal: "Lock the problem before generating solutions. Define is the phase most teams skip — and pay for later.",
      comesIn: "Research synthesis, HMW questions, and competitive insights from Discover.",
      sequence: ["Problem framing → Pressure-test the frame", "Persona creation → Journey mapping", "Assumption mapping → Prioritize what needs validation"],
      handoff: "Locked problem statement, primary persona, journey map, and ranked assumption list ready for Ideate.",
      figma: "Use Figma MCP to build persona and journey map frames in your project file.",
    },
  },
  {
    id: "03", label: "Ideate", desc: "Generate concepts across multiple angles, cluster them into strategic directions, critique the most promising ones, and storyboard before wireframing.",
    skills: 4, tools: 2, prompts: 5,
    howToUse: {
      goal: "Generate more concepts than you think you need — then cut ruthlessly.",
      comesIn: "Locked problem statement, persona, and HMW questions from Define.",
      sequence: ["Concept Generator → 5 angles of concepts", "Idea Clustering → Strategic landscape", "Concept Critique → Adversarial review", "Storyboard → Scenes before screens"],
      handoff: "Selected concept with storyboard and critique findings ready for Prototype.",
      figma: "Use Figma MCP to build concept boards and storyboard frames.",
    },
  },
  {
    id: "04", label: "Prototype", desc: "Translate a selected concept into a testable prototype — defining scope, mapping flows, writing copy, reviewing heuristics, and drafting the test script.",
    skills: 5, tools: 2, prompts: 5,
    howToUse: {
      goal: "Build the minimum representation needed to answer the 3 riskiest questions — no more.",
      comesIn: "Selected concept, storyboard, and critique findings from Ideate.",
      sequence: ["Prototype scoping → 3 questions + fidelity decision", "User flow mapping → Screen inventory", "UX copy writing → Voice brief + all states", "Heuristic review → Fix critical issues", "Test script drafting → Ready for Validate"],
      handoff: "Prototype file, copy document, heuristic fix list, and test script ready for Validate.",
      figma: "Wireframing and prototyping happen in Figma. Use Figma MCP to organize frames and apply your design system.",
    },
  },
  {
    id: "05", label: "Validate", desc: "Test the prototype with real users, synthesize findings, rate severity, write the report, and decide: proceed, iterate, or return to ideation.",
    skills: 5, tools: 2, prompts: 5,
    howToUse: {
      goal: "Get answers to the 3 prototype questions — then make a clear decision.",
      comesIn: "Prototype, test script, and pass/fail criteria from Prototype.",
      sequence: ["Recruitment screener → Find the right participants", "Run 5 sessions (human-facilitated — AI does not moderate)", "Findings Synthesizer → Structure + severity rate", "Insight Report → Stakeholder versions", "Iteration brief → Scope the next cycle"],
      handoff: "Findings report, iteration brief, and go/no-go decision ready for next Prototype cycle or Deliver.",
      figma: "Document findings in Figma. Use MCP to update journey maps and personas with validated insights.",
    },
  },
  {
    id: "06", label: "Deliver", desc: "Generate component specs, annotate prototype screens, document design decisions, write accessibility specs, and run design QA on the engineering build.",
    skills: 5, tools: 2, prompts: 5,
    howToUse: {
      goal: "Ensure what ships matches what was designed — and that developers have everything they need to build correctly.",
      comesIn: "Validated, approved designs from the Prototype/Validate cycle.",
      sequence: ["Component specs → States, behavior, spacing, edge cases", "Handoff annotations → Screen-by-screen behavior notes", "Accessibility annotations → ARIA, keyboard, focus", "Design decision record → Why, not what", "Design QA → After engineering builds, before launch"],
      handoff: "Spec document, QA report, and sign-off checklist. The design phase is complete.",
      figma: "Most Deliver work lives in Figma — annotations, specs, and asset export. Use MCP to generate and place spec content.",
    },
  },
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
function PromptCard({ prompt, phaseColor }) {
  const [open, setOpen] = useState(false);
  const color = phaseColor || "#22C55E";
  return (
    <div style={{ border: `1px solid ${open ? color + "44" : T.border}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.15s" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: open ? T.surface : "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 2 }}>{prompt.name}</div>
          <Mono color={T.dim} size={10}>{prompt.skill}</Mono>
        </div>
        <span style={{ fontSize: 11, color: T.dim, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▾</span>
      </button>
      {open && (
        <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 16px 16px" }}>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, marginBottom: 12 }}>
            <span style={{ color: T.dim, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>When · </span>
            {prompt.when}
          </div>
          <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.muted, lineHeight: 1.7, whiteSpace: "pre-wrap", background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "12px 14px", margin: "0 0 12px", overflowX: "auto" }}>{prompt.text}</pre>
          <CopyBtn text={prompt.text} />
        </div>
      )}
    </div>
  );
}

// ── Figma MCP Callout ─────────────────────────────────────────────────────────
const FIGMA_MCP_PHASES = ["03", "04", "06"];

const FIGMA_MCP_COPY = {
  "03": "Claude can build concept boards, storyboard frames, and FigJam ideation boards directly in your file.",
  "04": "Claude can scaffold wireframe frames, organize flows, and apply design system components in your file.",
  "06": "Claude can generate and place spec annotations, accessibility notes, and decision records directly in your file.",
};

function FigmaMCPCallout({ phaseId, onOpenSkill }) {
  if (!FIGMA_MCP_PHASES.includes(phaseId)) return null;
  const figmaSkill = { file: "figma-playbook.md", phase: null, surface: "code + figma mcp", desc: "Step-by-step Figma MCP execution patterns for every phase — research boards through spec annotations." };
  return (
    <div style={{
      padding: "10px 14px", marginBottom: 16,
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 8,
    }}>
      <span style={{
        fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.08em", textTransform: "uppercase",
        padding: "2px 7px", borderRadius: 3,
        background: T.card, border: `1px solid ${T.border}`, color: T.muted,
        display: "inline-block", marginBottom: 8,
      }}>Figma MCP</span>
      <div className="figma-callout-inner">
        <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, flex: 1 }}>{FIGMA_MCP_COPY[phaseId]}</span>
        <button
          onClick={() => onOpenSkill(figmaSkill)}
          style={{
            padding: "4px 12px", borderRadius: 5, flexShrink: 0,
            fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
            background: "transparent", border: `1px solid ${T.border}`,
            color: T.muted, cursor: "pointer", whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
        >View skill →</button>
      </div>
    </div>
  );
}

function PhasePath({ onOpenTool }) {
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("prompts");
  const [activeSkill, setActiveSkill] = useState(null);

  const phase = selected ? PHASES.find(p => p.id === selected) : null;
  const p = phase ? T.phases[phase.id] : null;
  const phaseTools = phase ? TOOLS.filter(t => t.phase === phase.id) : [];
  const phaseSkills = phase ? SKILL_FILES.filter(s => s.phase === phase.id) : [];
  const phasePrompts = phase ? PROMPTS.filter(pr => pr.phase === phase.id) : [];

  function skillUrl(skill) {
    const phaseLabel = T.phases[skill.phase]?.label?.toLowerCase() || "";
    const dir = skill.phase ? `${skill.phase}-${phaseLabel}` : "";
    return dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
  }

  return (
    <div>
      {/* Phase strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        border: `1px solid ${T.border}`, borderRadius: 10,
        overflow: "hidden", marginBottom: 1,
      }}>
        {PHASES.map((ph, i) => {
          const phColor = T.phases[ph.id].color;
          const isActive = selected === ph.id;
          return (
            <button key={ph.id}
              onClick={() => { setSelected(selected === ph.id ? null : ph.id); setTab("prompts"); }}
              style={{
                padding: "14px 10px 12px", border: "none",
                borderRight: i < 5 ? `1px solid ${T.border}` : "none",
                borderBottom: isActive ? `2px solid ${phColor}` : "2px solid transparent",
                background: isActive ? T.surface : "transparent",
                cursor: "pointer", textAlign: "center", transition: "all 0.15s", outline: "none",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.card; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: phColor, margin: "0 auto 8px", boxShadow: isActive ? `0 0 8px ${phColor}` : "none", transition: "box-shadow 0.15s" }} />
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: isActive ? phColor : T.dim, marginBottom: 2 }}>{ph.id}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: isActive ? T.text : T.muted, lineHeight: 1.2 }}>{ph.label}</div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div style={{ overflow: "hidden", minHeight: 280 }}>
        {!selected ? (
          /* ── Default: How to Use ── */
          <div style={{ padding: "28px 0 32px" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1, marginBottom: 6, whiteSpace: "nowrap" }}>Six phases. Three artifact types. One continuous workflow.</p>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: "0 0 20px" }}>Each phase produces artifacts that feed the next. Select any phase above to see its tools, skills, prompts, and how to use it.</p>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>Three ways to work with Claude</div>
            <div className="ways-explainer-grid">
              {[
                { label: "Tools", badge: "Interactive", desc: "Guided multi-step tools with real-time AI generation. Run a complete workflow in one session." },
                { label: "Prompts", badge: "Copy + Paste", desc: "Phase-specific prompts engineered for Claude Chat. Paste into a conversation and provide your context." },
                { label: "Skills", badge: "Attach to Claude", desc: "Attach .md files to a Claude project or conversation. Claude follows the methodology automatically." },
              ].map(item => (
                <div key={item.label} style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim, marginBottom: 6 }}>{item.badge}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ── Phase detail panel ── */
          <div style={{ padding: "24px 0 32px" }}>

            {/* Phase header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: p.color }}>{phase.id} — {phase.label}</span>
                </div>
                <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 600, margin: 0 }}>{phase.desc}</p>
              </div>
              <div className="phase-counts">
                {phase.tools > 0 && <Mono color={T.dim}>{phase.tools} tool{phase.tools !== 1 ? "s" : ""}</Mono>}
                {phase.skills > 0 && <Mono color={T.dim}>{phase.skills} skill{phase.skills !== 1 ? "s" : ""}</Mono>}
                {phase.prompts > 0 && <Mono color={T.dim}>{phase.prompts} prompt{phase.prompts !== 1 ? "s" : ""}</Mono>}
              </div>
            </div>

            {/* Figma MCP callout — Ideate, Prototype, Deliver only */}
            <FigmaMCPCallout phaseId={selected} onOpenSkill={setActiveSkill} />

            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
              {[
                { id: "prompts", label: "Prompts", count: phasePrompts.length },
                { id: "skills", label: "Skills", count: phaseSkills.length },
                { id: "tools", label: "Tools", count: phaseTools.length },
                { id: "how", label: "How to Use", count: null },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "8px 14px", background: "none", border: "none",
                  borderBottom: `2px solid ${tab === t.id ? p.color : "transparent"}`,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: tab === t.id ? p.color : T.dim,
                  cursor: "pointer", marginBottom: -1, transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {t.label}
                  {t.count !== null && t.count > 0 && (
                    <span style={{ fontSize: 9, background: tab === t.id ? p.color + "22" : T.card, color: tab === t.id ? p.color : T.dim, padding: "1px 5px", borderRadius: 3 }}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab: Prompts */}
            {tab === "prompts" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {phasePrompts.length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center" }}><Mono color={T.dim}>No prompts yet for this phase</Mono></div>
                ) : phasePrompts.map(prompt => (
                  <PromptCard key={prompt.id} prompt={prompt} phaseColor={p.color} />
                ))}
              </div>
            )}

            {/* Tab: Skills */}
            {tab === "skills" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {phaseSkills.length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center" }}><Mono color={T.dim}>No skills yet for this phase</Mono></div>
                ) : phaseSkills.map(skill => (
                  <div key={skill.file} className="skill-row" style={{ background: T.card, borderRadius: 6, border: `1px solid ${T.border}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <Mono color={T.muted} size={11}>{skill.file}</Mono>
                        <SkillBadge surface={skill.surface} />
                      </div>
                      <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.5 }}>{skill.desc}</div>
                    </div>
                    <div className="skill-actions">
                      <button onClick={() => setActiveSkill(skill)} style={{ padding: "5px 10px", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "55"; e.currentTarget.style.color = p.color; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                      >Preview →</button>
                      <a href={skillUrl(skill)} download style={{ padding: "5px 10px", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, textDecoration: "none", whiteSpace: "nowrap" }}>↓</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSkill && <SkillDrawer skill={activeSkill} onClose={() => setActiveSkill(null)} />}

      {/* Tab: Tools */}
            {tab === "tools" && (
              <div style={{ display: "grid", gridTemplateColumns: phaseTools.length > 1 ? "1fr 1fr" : "1fr", gap: 8 }}>
                {phaseTools.length === 0 ? (
                  <div style={{ padding: "20px 0", textAlign: "center" }}><Mono color={T.dim}>No tools yet for this phase</Mono></div>
                ) : phaseTools.map(tool => (
                  <div key={tool.id} className="tool-row" style={{ background: T.card, borderRadius: 8, border: `1px solid ${T.border}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 3 }}>{tool.name}</div>
                      <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>{tool.subtitle}</div>
                    </div>
                    <button onClick={() => onOpenTool(tool.id)} style={{ padding: "6px 12px", borderRadius: 5, flexShrink: 0, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${p.color}55`, color: p.color, cursor: "pointer", whiteSpace: "nowrap", transition: "border-color 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = p.color + "55"}
                    >Open →</button>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: How to Use */}
            {tab === "how" && phase.howToUse && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Goal */}
                <div style={{ padding: "14px 16px", background: p.color + "0f", border: `1px solid ${p.color}25`, borderRadius: 8 }}>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: p.color, marginBottom: 6 }}>Goal</div>
                  <p style={{ fontSize: 13, color: T.text, lineHeight: 1.6, margin: 0 }}>{phase.howToUse.goal}</p>
                </div>

                <div className="how-grid">
                  {/* What comes in */}
                  <div>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 8 }}>What comes in</div>
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: 0 }}>{phase.howToUse.comesIn}</p>
                  </div>
                  {/* Handoff */}
                  <div>
                    <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 8 }}>What hands off</div>
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: 0 }}>{phase.howToUse.handoff}</p>
                  </div>
                </div>

                {/* Recommended sequence */}
                <div>
                  <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>Recommended sequence</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {phase.howToUse.sequence.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: p.color, flexShrink: 0, paddingTop: 2, minWidth: 16 }}>{i + 1}.</span>
                        <span style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Figma */}
                <div className="how-figma" style={{ padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, background: T.surface, border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 3, flexShrink: 0, display: "inline-block", marginBottom: 4 }}>Figma MCP</span>
                  <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.5, margin: 0 }}>{phase.howToUse.figma}</p>
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}


// ── Path: Ways to Work ────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id: 1, type: "general",
    title: "Current state audit",
    mission: "Evaluate an existing product or experience — heuristics, analytics, competitive benchmarking — and frame what needs to change.",
    when: ["You've inherited a product and need to understand what's broken", "Leadership wants a baseline before committing to a redesign", "You need to justify a design investment with evidence"],
    phases: [
      { key: "01", note: "Heuristic eval, analytics review, competitive audit, stakeholder interviews" },
      { key: "02", note: "Synthesize findings into prioritized problem areas and a design brief" },
    ],
    deliverables: ["Heuristic evaluation report", "Analytics findings summary", "Competitive benchmark", "Prioritized issue list", "Design brief"],
    skills: ["user-research.md", "competitive-analysis.md", "problem-framing.md"],
    time: "1–2 weeks",
    prompt: `I'm conducting a current state audit of [PRODUCT/FEATURE]. Help me run a structured evaluation covering:
- Heuristic review against Nielsen's 10 principles
- Key analytics patterns to investigate (I have access to [TOOL])
- Competitive benchmarking against [2–3 COMPETITORS]

My goal is to produce a prioritized issue list and design brief for a redesign. Start by helping me set up an evaluation framework.`,
  },
  {
    id: 2, type: "general",
    title: "Research study end-to-end",
    mission: "Run a complete generative or evaluative study — from planning and recruiting through synthesis and insight delivery.",
    when: ["You need to understand users before designing anything", "Stakeholders are making assumptions you want to validate or challenge", "You're kicking off a new product area with no prior research"],
    phases: [
      { key: "01", note: "Research planning, guide writing, recruitment screener, data collection" },
      { key: "02", note: "Synthesis, affinity mapping, insight framing, opportunity identification" },
    ],
    deliverables: ["Research plan", "Discussion guide or survey", "Recruitment screener", "Synthesis board", "Insights report", "Opportunity areas"],
    skills: ["user-research.md", "problem-framing.md", "figma-playbook.md"],
    time: "2–4 weeks",
    prompt: `I need to run a [generative/evaluative] research study for [PRODUCT/FEATURE AREA]. Help me plan end-to-end:
- Research questions I'm trying to answer: [LIST]
- Target participants: [DESCRIPTION]
- Methods I'm considering: [e.g. interviews, surveys, usability test]
- Timeline: [WEEKS AVAILABLE]

Start by helping me write a research plan with objectives, method rationale, and a recruitment screener.`,
  },
  {
    id: 3, type: "general",
    title: "Design thinking workshop",
    mission: "Plan and run a full workshop — from framing the challenge to facilitating ideation and capturing outputs for follow-through.",
    when: ["You need to align a cross-functional team around a problem", "You're kicking off a new initiative and need shared direction", "Leadership wants visible collaborative progress on a strategic challenge"],
    phases: [
      { key: "01", note: "Challenge framing, pre-work, stakeholder input gathering" },
      { key: "02", note: "HMW statements, problem framing, constraint mapping" },
      { key: "03", note: "Brainstorming, concept voting, prioritization" },
    ],
    deliverables: ["Workshop brief", "Facilitation guide", "HMW statement set", "Ideation session outputs", "Concept shortlist", "Follow-up action plan"],
    skills: ["problem-framing.md", "concept-generation.md", "figma-playbook.md"],
    time: "1–2 weeks including prep",
    prompt: `I'm planning a design thinking workshop for [TEAM/STAKEHOLDERS] on the topic of [CHALLENGE AREA]. Help me design the full session:
- Duration: [HALF DAY / FULL DAY / MULTI-DAY]
- Participants: [N people, roles]
- Goal: [what we want to leave with]
- Tools available: [Miro / FigJam / physical]

Start by helping me frame the core challenge as a set of HMW statements and outline a facilitation arc.`,
  },
  {
    id: 4, type: "general",
    title: "Concept to stakeholder pitch",
    mission: "Turn an early idea into a presentable concept — framed problem, design rationale, lo-fi prototype, and supporting narrative.",
    when: ["You have a concept but need buy-in before investing in full design", "You're pitching to leadership and need more than a verbal idea", "You need to align stakeholders before a sprint or project kickoff"],
    phases: [
      { key: "02", note: "Frame the problem, write the brief, define success criteria" },
      { key: "03", note: "Generate and evaluate concept directions" },
      { key: "04", note: "Build a lo-fi or narrative prototype to make the concept tangible" },
    ],
    deliverables: ["Problem statement", "Design brief", "Concept sketches or wireframes", "Lo-fi prototype or storyboard", "Pitch narrative"],
    skills: ["problem-framing.md", "concept-generation.md", "prototyping.md"],
    time: "3–5 days",
    prompt: `I need to turn a rough concept into a stakeholder pitch. The idea is [DESCRIBE CONCEPT]. Help me structure this into a compelling presentation:
- Problem it solves: [DESCRIPTION]
- Target user: [DESCRIPTION]
- Key constraints: [TIME / TECH / BUDGET]
- Audience for the pitch: [STAKEHOLDERS]

Start by helping me write a crisp problem statement and a pitch narrative structure.`,
  },
  {
    id: 5, type: "ai",
    title: "AI maturity assessment",
    mission: "Evaluate how ready a team or org is to design with AI — current tools, workflows, skill gaps, and a prioritized roadmap for adoption.",
    when: ["A design team wants to start using AI but doesn't know where to begin", "Leadership wants to understand the team's AI capability before investing", "You're an IC designer assessing your own practice to level up"],
    phases: [
      { key: "01", note: "Audit current tools, workflows, and team AI usage patterns" },
      { key: "02", note: "Gap analysis, maturity scoring, roadmap framing" },
    ],
    deliverables: ["AI tool inventory", "Workflow audit", "Maturity scorecard", "Gap analysis", "Adoption roadmap"],
    skills: ["user-research.md", "problem-framing.md"],
    time: "1–2 weeks",
    prompt: `I want to assess AI maturity for [MY DESIGN PRACTICE / MY TEAM / OUR ORG]. Help me run a structured assessment:
- Who I'm assessing: [solo designer / team of N / org-wide]
- Current AI usage: [none / ad hoc / some tools / integrated]
- Goal: [personal development / team enablement / leadership report]

Start by helping me build an AI maturity scorecard with dimensions, rating criteria, and a gap analysis template.`,
  },
  {
    id: 6, type: "general",
    title: "Future state vision",
    mission: "Build a compelling vision of where the product or experience could go — grounded in research, current state analysis, and forward-looking design concepts.",
    when: ["You need to show leadership where the product should go in 1–3 years", "You're making the case for a significant redesign or strategic pivot", "Your team needs a north star to align near-term decisions against"],
    phases: [
      { key: "01", note: "Current state audit, user research, market signals" },
      { key: "02", note: "Gap analysis, opportunity framing, vision criteria" },
      { key: "03", note: "Future state concepts, scenario planning" },
      { key: "04", note: "Vision prototype or experience concept for presentation" },
    ],
    deliverables: ["Current vs future state comparison", "Opportunity map", "Vision narrative", "Future state concept designs", "Presentation deck"],
    skills: ["user-research.md", "competitive-analysis.md", "problem-framing.md", "concept-generation.md", "prototyping.md"],
    time: "2–4 weeks",
    prompt: `I'm building a future state vision for [PRODUCT/AREA]. Help me structure this project from current state through a compelling vision presentation:
- Current state problems: [DESCRIBE]
- Time horizon: [1 year / 3 years / longer]
- Audience: [LEADERSHIP / BOARD / TEAM]
- Constraints to design within: [TECH / BUSINESS / MARKET]

Start by helping me map the current state gaps and frame the opportunity areas that will anchor the vision.`,
  },
  {
    id: 7, type: "ai",
    title: "Designing an AI-powered feature",
    mission: "Design a product feature where AI is the core interaction — scoping what the model does, how outputs surface, and how users build trust over time.",
    when: ["You're adding a generative AI capability to an existing product", "You need to design around model outputs that are probabilistic, not deterministic", "You're figuring out how to handle low-confidence results, errors, and user control"],
    phases: [
      { key: "01", note: "Understand what users expect from AI in this context; research trust and mental models" },
      { key: "02", note: "Scope the AI's role, define success, map failure modes" },
      { key: "03", note: "Explore output surfaces, feedback patterns, and trust-building interactions" },
      { key: "04", note: "Build for all states: loading, confident, uncertain, wrong, recovering" },
      { key: "05", note: "Test with real model outputs; measure trust calibration" },
    ],
    deliverables: ["AI feature brief", "Trust and mental model research", "Interaction patterns for AI states", "Prototype with error and uncertainty states", "Validation findings"],
    skills: ["user-research.md", "problem-framing.md", "concept-generation.md", "prototyping.md", "usability-testing.md"],
    time: "4–8 weeks",
    prompt: `I'm designing an AI-powered feature: [DESCRIBE THE FEATURE AND WHAT THE AI DOES]. Help me approach this systematically:
- What the AI does: [summarizes / generates / recommends / classifies / etc.]
- User context: [who uses it, when, and what they're trying to accomplish]
- Key risks: [wrong outputs / hallucinations / user over-trust / under-trust]

Start by helping me map user mental models and expectations for AI in this context, and identify the critical trust moments I need to design for.`,
  },
  {
    id: 8, type: "general",
    title: "Design sprint",
    mission: "Run a compressed 3–5 day sprint — map the problem, generate and vote on ideas, prototype one direction, and test with real users.",
    when: ["You have a clear problem and need answers fast", "You want to validate a risky assumption before committing to build", "A cross-functional team needs to move from debate to decision"],
    phases: [
      { key: "01", note: "Day 1: map the challenge, expert interviews, HMW generation" },
      { key: "02", note: "Day 1–2: target selection, sprint question" },
      { key: "03", note: "Day 2–3: lightning demos, sketching, storyboard" },
      { key: "04", note: "Day 4: build a realistic facade prototype" },
      { key: "05", note: "Day 5: test with 5 users, synthesize findings" },
    ],
    deliverables: ["Sprint map", "HMW statements", "Storyboard", "Prototype", "Usability test findings", "Sprint retrospective"],
    skills: ["problem-framing.md", "concept-generation.md", "prototyping.md", "usability-testing.md"],
    time: "5 days",
    prompt: `I'm running a design sprint on [CHALLENGE / PRODUCT AREA]. Help me plan and execute it day by day:
- Sprint team: [ROLES]
- Core challenge: [ONE SENTENCE]
- Sprint question (what we want to answer): [QUESTION OR TBD]
- Days available: [3 / 4 / 5]

Start with Day 1: help me build the sprint map and generate a strong set of HMW statements from what we know.`,
  },
  {
    id: 9, type: "ai",
    title: "AI workflow integration audit",
    mission: "Map where AI currently fits in a design team's process, identify high-leverage gaps, and recommend tools or skills to close them.",
    when: ["A design team is using AI ad hoc and wants to systematize it", "You've adopted some AI tools but they're not connected to your actual workflow", "You want to know which phases of your process have the most room for AI leverage"],
    phases: [
      { key: "01", note: "Map current workflow phase by phase; inventory existing AI tool usage" },
      { key: "02", note: "Score leverage by phase; prioritize gaps" },
      { key: "06", note: "Produce an integration playbook with specific tools and skill files per phase" },
    ],
    deliverables: ["Phase-by-phase workflow map", "AI leverage scorecard", "Gap analysis", "Tool recommendations per phase", "Integration playbook"],
    skills: ["user-research.md", "problem-framing.md", "design-delivery.md"],
    time: "1–2 weeks",
    prompt: `I want to audit how AI fits into my design workflow and build a plan to integrate it more intentionally:
- My role: [solo designer / team lead / design ops]
- Phases I work through: [all six / subset]
- Current AI usage: [describe what you use and when]
- Biggest friction in my current workflow: [describe]

Start by helping me map my current workflow phase by phase and score where AI could add the most leverage.`,
  },
  {
    id: 10, type: "general",
    title: "New feature from zero",
    mission: "Take a feature request from brief to build-ready — research, framing, design, testing, and handoff documentation for engineering.",
    when: ["A feature has been prioritized and you're the designer owning it end-to-end", "You have a brief but no research, designs, or specs yet", "You need to deliver something fully handoff-ready, not just explorations"],
    phases: [
      { key: "01", note: "Understand user needs and context for this feature" },
      { key: "02", note: "Frame the problem, write the brief, define requirements" },
      { key: "03", note: "Generate and evaluate design directions" },
      { key: "04", note: "Build and iterate on the design" },
      { key: "05", note: "Test with users, incorporate findings" },
      { key: "06", note: "Component specs, handoff docs, QA checklist" },
    ],
    deliverables: ["Research insights", "Problem statement & brief", "Design explorations", "Validated prototype", "Component specs", "Handoff package"],
    skills: ["user-research.md", "problem-framing.md", "concept-generation.md", "prototyping.md", "usability-testing.md", "design-delivery.md", "phase-handoff.md"],
    time: "4–8 weeks",
    prompt: `I'm designing a new feature from scratch: [FEATURE NAME AND DESCRIPTION]. Help me run this end-to-end:
- Product: [PRODUCT NAME]
- User: [TARGET USER]
- Business goal: [WHAT SUCCESS LOOKS LIKE]
- Constraints: [TECH / TIMELINE / SCOPE]

Start with Discover: help me write a research plan to understand what users need from this feature before I design anything.`,
  },
  {
    id: 11, type: "general",
    title: "Design system build or audit",
    mission: "Build a new component library from scratch or audit an existing one — tokens, components, documentation, and handoff for scale.",
    when: ["Your product has inconsistent UI and needs a shared system", "Engineering is asking for tokens and component specs", "You're onboarding new designers and need a source of truth"],
    phases: [
      { key: "03", note: "Visual direction, token architecture, component inventory" },
      { key: "04", note: "Component build, state documentation, usage guidelines" },
      { key: "06", note: "Token export, component specs, contribution docs" },
    ],
    deliverables: ["Token set", "Component inventory", "Component specs with states", "Usage guidelines", "Handoff documentation", "Contribution governance"],
    skills: ["design-systems.md", "visual-design-execution.md", "design-delivery.md", "figma-playbook.md"],
    time: "4–12 weeks",
    prompt: `I need to [build a new design system / audit our existing one] for [PRODUCT]. Help me scope and execute this:
- Current state: [no system / partial tokens / inconsistent components / needs audit]
- Platform: [Web / iOS / Android / Cross-platform]
- Team size: [N designers, N engineers]
- Priority: [tokens / core components / patterns / documentation]

Start by helping me create a component inventory and token architecture plan.`,
  },
  {
    id: 12, type: "ai",
    title: "Responsible AI design review",
    mission: "Audit an existing or in-progress AI product for transparency, bias, error handling, and user trust — producing actionable design recommendations.",
    when: ["You're shipping an AI feature and want to check it against responsible design principles", "Users have reported feeling misled or confused by AI outputs", "Legal or leadership has asked for a design-layer risk assessment"],
    phases: [
      { key: "01", note: "Understand how the AI behaves, where it fails, and what users experience" },
      { key: "05", note: "Evaluate against transparency, fairness, control, and error recovery principles" },
      { key: "06", note: "Produce a prioritized recommendations report and design spec for fixes" },
    ],
    deliverables: ["AI behavior audit", "Responsible design scorecard", "User trust evaluation", "Prioritized recommendations", "Design spec for mitigations"],
    skills: ["user-research.md", "usability-testing.md", "design-delivery.md"],
    time: "1–3 weeks",
    prompt: `I need to run a responsible AI design review of [PRODUCT / FEATURE]. Help me audit it systematically:
- What the AI does: [describe]
- Known concerns: [bias / transparency / error handling / user control / other]
- Users affected: [describe]
- Output needed: [internal review / leadership report / design fixes]

Start by helping me build a responsible AI design scorecard covering transparency, fairness, user control, error recovery, and trust calibration.`,
  },
  {
    id: 13, type: "general",
    title: "Work directly in Figma with Claude",
    mission: "Use Claude Code + Figma MCP to build, annotate, and structure design work directly in your Figma file — without copy-pasting between tools.",
    when: ["You want Claude to build a FigJam board, wireframe frames, or spec annotations directly in your file", "You're working in Ideate, Prototype, or Deliver and want Claude to do the Figma work, not just describe it", "You want to skip the manual step of translating Claude's output into Figma"],
    phases: [
      { key: "03", note: "Build concept boards, storyboard frames, and FigJam ideation boards directly in your file" },
      { key: "04", note: "Scaffold wireframe frames, organize flows, apply design system components" },
      { key: "06", note: "Generate and place spec annotations, accessibility notes, and design decision records" },
    ],
    deliverables: ["FigJam workshop or research board", "Wireframe frame structure", "Component annotations", "Spec overlays", "Journey map visualization", "Design decision records"],
    skills: ["figma-playbook.md"],
    time: "Ongoing — replaces manual Figma work across phases",
    prompt: `I want Claude to work directly in my Figma file using the Figma MCP. Let's do a connection check first, then start working.

My file: [PASTE FIGMA FILE URL OR NAME]
What I need built: [DESCRIBE — e.g. a FigJam affinity board / wireframe frames for a checkout flow / spec annotations on my components]
Phase I'm in: [Ideate / Prototype / Deliver]

First, confirm you can see my open Figma file by telling me its name and any pages you can see. Then we'll start building.`,
  },
];

function WaysToWorkPath() {
  const [filter, setFilter] = useState("all");
  const [activeScenario, setActiveScenario] = useState(null);

  const filtered = filter === "all" ? SCENARIOS
    : filter === "ai" ? SCENARIOS.filter(s => s.type === "ai")
    : SCENARIOS.filter(s => s.type === "general");

  return (
    <div style={{ position: "relative" }}>
      {/* Filter pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[{ id: "all", label: "All scenarios" }, { id: "general", label: "General" }, { id: "ai", label: "AI — specific" }].map(f => {
          const isActive = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "4px 12px", borderRadius: 20, cursor: "pointer",
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.07em", textTransform: "uppercase",
              border: `1px solid ${isActive ? T.borderHover : T.border}`,
              background: isActive ? T.surface : "transparent",
              color: isActive ? T.text : T.dim,
              transition: "all 0.12s",
            }}>{f.label}</button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{ marginBottom: 14 }}>
        <Mono color={T.dim} size={10}>{filtered.length} scenario{filtered.length !== 1 ? "s" : ""}</Mono>
      </div>

      {/* Scenario list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden" }}>
        {filtered.map((s, i) => {
          const isLast = i === filtered.length - 1;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScenario(s)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 16,
                padding: "16px 20px", background: T.surface,
                border: "none", borderBottom: isLast ? "none" : `1px solid ${T.border}`,
                cursor: "pointer", textAlign: "left",
                transition: "background 0.12s", outline: "none",
              }}
              onMouseEnter={e => e.currentTarget.style.background = T.card}
              onMouseLeave={e => e.currentTarget.style.background = T.surface}
            >
              {/* Index */}
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: T.dim, paddingTop: 3, flexShrink: 0, minWidth: 22 }}>
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{s.title}</span>
                  {s.type === "ai" && (
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: T.card, border: `1px solid ${T.border}`, color: T.muted }}>AI</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, marginBottom: 8 }}>{s.mission}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {s.phases.map(p => {
                    const ph = T.phases[p.key];
                    return ph ? (
                      <span key={p.key} style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: `${ph.color}14`, border: `1px solid ${ph.color}30`, color: ph.color }}>{ph.label}</span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Arrow */}
              <span style={{ fontSize: 14, color: T.dim, flexShrink: 0, paddingTop: 2 }}>→</span>
            </button>
          );
        })}
      </div>

      {/* Drawer */}
      {activeScenario && (
        <ScenarioDrawer scenario={activeScenario} onClose={() => setActiveScenario(null)} />
      )}
    </div>
  );
}

function ScenarioDrawer({ scenario: s, onClose }) {
  const [copied, setCopied] = useState(false);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function Section({ label, children }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>{label}</div>
        {children}
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, backdropFilter: "blur(2px)" }} />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(520px, 92vw)",
        background: T.surface,
        borderLeft: `1px solid ${T.border}`,
        zIndex: 101,
        display: "flex", flexDirection: "column",
        overflowY: "auto",
        animation: "slideIn 0.22s ease-out",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Drawer header */}
        <div style={{ padding: "20px 24px 18px", borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, background: T.surface, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                {s.type === "ai" && (
                  <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: T.card, border: `1px solid ${T.border}`, color: T.muted }}>AI — specific</span>
                )}
              </div>
              <h2 style={{ fontSize: 20, fontFamily: "'DM Serif Display', serif", fontWeight: 400, color: T.text, marginBottom: 6, lineHeight: 1.2 }}>{s.title}</h2>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>{s.mission}</p>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 18, padding: "2px 4px", flexShrink: 0, lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Drawer body */}
        <div style={{ padding: "24px 24px 32px", flex: 1 }}>

          {/* 1. When to use this */}
          <Section label="When to use this">
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {s.when.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: T.dim, fontSize: 11, paddingTop: 2, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, color: T.muted, lineHeight: 1.55 }}>{w}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* 2. Phases and focus */}
          <Section label="Phases and focus">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {s.phases.map(p => {
                const ph = T.phases[p.key];
                if (!ph) return null;
                return (
                  <div key={p.key} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 3, background: `${ph.color}14`, border: `1px solid ${ph.color}30`, color: ph.color, flexShrink: 0, whiteSpace: "nowrap" }}>{ph.label}</span>
                    <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, paddingTop: 1 }}>{p.note}</span>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 3. Key deliverables */}
          <Section label="Key deliverables">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {s.deliverables.map((d, i) => (
                <span key={i} style={{ fontSize: 11, color: T.muted, background: T.card, border: `1px solid ${T.border}`, borderRadius: 4, padding: "3px 9px" }}>{d}</span>
              ))}
            </div>
          </Section>

          {/* 4. Skills + time side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>Skills to use</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {s.skills.map((sk, i) => (
                  <span key={i} style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.muted, background: T.card, border: `1px solid ${T.border}`, borderRadius: 4, padding: "3px 8px", display: "inline-block" }}>{sk}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>Estimated time</div>
              <span style={{ fontSize: 13, color: T.muted, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, padding: "6px 12px", display: "inline-block" }}>{s.time}</span>
            </div>
          </div>

          {/* 5. Starting prompt */}
          <div>
            <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, marginBottom: 10 }}>Starting prompt</div>
            <pre style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: T.muted, lineHeight: 1.7, whiteSpace: "pre-wrap",
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 6, padding: "14px 16px", margin: "0 0 12px",
              overflowX: "auto",
            }}>{s.prompt}</pre>
            <button
              onClick={() => { navigator.clipboard.writeText(s.prompt); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
              style={{
                padding: "8px 16px", borderRadius: 6,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer", border: `1.5px solid ${copied ? "#22C55E" : T.border}`,
                background: "transparent", color: copied ? "#22C55E" : T.muted,
                transition: "all 0.15s",
              }}
            >{copied ? "✓ Copied" : "Copy prompt"}</button>
          </div>
        </div>
      </div>
    </>
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
  const PHASE_META = {
    "01": { label: "Discover",   color: "#22C55E", dim: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)"  },
    "02": { label: "Define",     color: "#8B5CF6", dim: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" },
    "03": { label: "Ideate",     color: "#F59E0B", dim: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
    "04": { label: "Prototype",  color: "#3B82F6", dim: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)" },
    "05": { label: "Validate",   color: "#EF4444", dim: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)"  },
    "06": { label: "Deliver",    color: "#14B8A6", dim: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)" },
  };
  const PHASES_ORDER = ["01","02","03","04","05","06"];

  const [selected, setSelected] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [guideCopied, setGuideCopied] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const typeColor = { tool: "#22C55E", prompt: "#8B5CF6" };

  const phaseItems = selected
    ? DELIVERABLES.filter(d => d.phase === selected && (typeFilter === "all" || d.type === typeFilter))
    : [];

  const meta = selected ? PHASE_META[selected] : null;

  return (
    <div>
      {/* Phase strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
        border: `1px solid ${T.border}`, borderRadius: 10,
        overflow: "hidden", marginBottom: 1,
      }}>
        {PHASES_ORDER.map((ph, i) => {
          const m = PHASE_META[ph];
          const isActive = selected === ph;
          const count = DELIVERABLES.filter(d => d.phase === ph).length;
          return (
            <button key={ph}
              onClick={() => setSelected(selected === ph ? null : ph)}
              style={{
                padding: "14px 10px 12px", border: "none",
                borderRight: i < 5 ? `1px solid ${T.border}` : "none",
                borderBottom: isActive ? `2px solid ${m.color}` : "2px solid transparent",
                background: isActive ? T.surface : "transparent",
                cursor: "pointer", textAlign: "center", transition: "all 0.15s", outline: "none",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.card; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, margin: "0 auto 8px", boxShadow: isActive ? `0 0 8px ${m.color}` : "none", transition: "box-shadow 0.15s" }} />
              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: isActive ? m.color : T.dim, marginBottom: 2 }}>{ph}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: isActive ? T.text : T.muted, lineHeight: 1.2 }}>{m.label}</div>
              <div style={{ fontSize: 9, color: T.dim, fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{count}</div>
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div style={{ overflow: "hidden", minHeight: 200, marginBottom: 12 }}>
        {!selected ? (
          /* Default state */
          <div style={{ padding: "28px 0 32px" }}>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.6, margin: "0 0 16px", maxWidth: 520 }}>
              Select a phase above to see every deliverable for that stage. Each deliverable is produced by either a Tool or a Prompt.
            </p>
            <div className="deliverable-info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                {
                  badge: "Interactive", headline: "Tools",
                  desc: "Guided multi-step workflows with real-time AI generation. Walk through structured steps — Claude produces each output as you go.",
                  when: "When you want a full workflow in one session",
                },
                {
                  badge: "Copy + Paste", headline: "Prompts",
                  desc: "Pre-engineered prompts for Claude Chat. Copy, paste your context, and get a targeted output. Best when you need something fast or want to stay in an existing Claude conversation.",
                  when: "When you need something fast or want to stay in chat",
                },
              ].map(item => (
                <div key={item.headline} style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim, marginBottom: 6 }}>{item.badge}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 4 }}>{item.headline}</div>
                  <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.55, marginBottom: 6 }}>{item.desc}</div>
                  <div style={{ fontSize: 10, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>{item.when}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Phase deliverable cards */
          <div style={{ padding: "20px 0 24px" }}>
            {/* Phase header + type filter inline */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color, boxShadow: `0 0 7px ${meta.color}` }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: meta.color }}>{selected} — {meta.label}</span>
                <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace" }}>
                  {phaseItems.length} deliverable{phaseItems.length !== 1 ? "s" : ""}
                </span>
              </div>
              {/* Type filter */}
              <div style={{ display: "flex", gap: 5 }}>
                {[{ id: "all", label: "All" }, { id: "tool", label: "Tool" }, { id: "prompt", label: "Prompt" }].map(f => {
                  const isActive = typeFilter === f.id;
                  const accent = f.id === "tool" ? typeColor.tool : f.id === "prompt" ? typeColor.prompt : null;
                  return (
                    <button key={f.id} onClick={() => setTypeFilter(f.id)} style={{
                      padding: "3px 11px", borderRadius: 20, cursor: "pointer",
                      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      border: `1px solid ${isActive ? (accent || T.borderHover) : T.border}`,
                      background: isActive ? (accent ? `${accent}18` : T.card) : "transparent",
                      color: isActive ? (accent || T.text) : T.dim,
                      transition: "all 0.12s",
                    }}>{f.label}</button>
                  );
                })}
              </div>
            </div>

            {/* Cards */}
            {phaseItems.length === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <Mono color={T.dim} size={11}>No {typeFilter} deliverables in this phase</Mono>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
                {phaseItems.map(d => (
                  <div key={d.ref} style={{
                    background: T.surface, border: `1px solid ${meta.border}`, borderRadius: 8,
                    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
                    transition: "border-color 0.12s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = meta.color + "60"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = meta.border}
                  >
                    {/* Name + type badge */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{d.name}</span>
                      <span style={{
                        fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        padding: "2px 7px", borderRadius: 3, flexShrink: 0,
                        background: "rgba(255,255,255,0.06)",
                        border: `1px solid ${T.border}`,
                        color: T.muted,
                      }}>{d.type}</span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0 }}>{d.desc}</p>

                    {/* Output pill */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>Output</span>
                      <span style={{ fontSize: 11, color: T.muted, background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "2px 9px" }}>{d.output}</span>
                    </div>

                    {/* Tool name + action */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: T.dim }}>{d.label}</span>
                      {d.type === "tool" && (
                        <button onClick={() => onOpenTool(d.ref)} style={{
                          padding: "5px 14px", borderRadius: 5, flexShrink: 0,
                          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: "0.06em", textTransform: "uppercase",
                          background: "transparent", border: `1px solid ${T.border}`,
                          color: T.muted, cursor: "pointer", transition: "all 0.12s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                        >Open tool</button>
                      )}
                      {d.type === "prompt" && (
                        <CopyBtn text={PROMPTS.find(p => p.id === d.ref)?.text || ""} label="Copy prompt" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cross-phase tools — always visible */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim }}>Cross-phase</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: T.dim }}>{DELIVERABLES.filter(d => d.phase === null && (typeFilter === "all" || d.type === typeFilter)).length} tool{DELIVERABLES.filter(d => d.phase === null && (typeFilter === "all" || d.type === typeFilter)).length !== 1 ? "s" : ""}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
          {DELIVERABLES.filter(d => d.phase === null && (typeFilter === "all" || d.type === typeFilter)).map(d => (
            <div key={d.ref} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, transition: "border-color 0.12s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{d.name}</span>
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, flexShrink: 0, background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, color: T.muted }}>{d.type}</span>
              </div>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0 }}>{d.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>Output</span>
                <span style={{ fontSize: 11, color: T.muted, background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "2px 9px" }}>{d.output}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                <span style={{ fontSize: 11, color: T.dim }}>{d.label}</span>
                <button onClick={() => onOpenTool(d.ref)} style={{ padding: "5px 14px", borderRadius: 5, flexShrink: 0, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, cursor: "pointer", transition: "all 0.12s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                >Open tool</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Don't see what you need */}
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <button onClick={() => setGuideOpen(!guideOpen)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
        }}>
          <span style={{ fontSize: 12, color: T.muted }}>Don't see the deliverable you need?</span>
          <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace", display: "inline-block", transform: guideOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
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
              borderRadius: 6, padding: "14px 16px", margin: "0 0 14px", overflowX: "auto",
            }}>{DELIVERABLE_GUIDE_PROMPT}</pre>
            <button onClick={() => { navigator.clipboard.writeText(DELIVERABLE_GUIDE_PROMPT); setGuideCopied(true); setTimeout(() => setGuideCopied(false), 1800); }} style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em",
              textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
              border: `1.5px solid ${guideCopied ? "#22C55E" : T.border}`,
              background: "transparent", color: guideCopied ? "#22C55E" : T.muted, transition: "all 0.15s",
            }}>{guideCopied ? "✓ Copied" : "Copy Prompt"}</button>
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
function SkillsLibraryOverlay({ onBack }) {
  const [activeSkill, setActiveSkill] = useState(null);
  const [selected, setSelected] = useState(null);
  const [surfaceFilter, setSurfaceFilter] = useState("all");

  const PHASES_ORDER = ["01","02","03","04","05","06"];
  const PHASE_META = {
    "01": { label: "Discover",  color: "#22C55E", dim: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)"  },
    "02": { label: "Define",    color: "#8B5CF6", dim: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.25)" },
    "03": { label: "Ideate",    color: "#F59E0B", dim: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
    "04": { label: "Prototype", color: "#3B82F6", dim: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)" },
    "05": { label: "Validate",  color: "#EF4444", dim: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.25)"  },
    "06": { label: "Deliver",   color: "#14B8A6", dim: "rgba(20,184,166,0.12)", border: "rgba(20,184,166,0.25)" },
  };

  const SURFACE_FILTERS = [
    { id: "all",              label: "All" },
    { id: "chat",             label: "Chat" },
    { id: "chat + code",      label: "Chat + Code" },
    { id: "code + figma mcp", label: "Figma MCP" },
  ];

  const surfaceColors = {
    "chat":             { color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"  },
    "chat + code":      { color: "#3B82F6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.25)" },
    "code + figma mcp": { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)" },
  };

  const applyFilters = (skills) => surfaceFilter === "all" ? skills : skills.filter(s => s.surface === surfaceFilter);

  const phaseSkills = selected ? applyFilters(SKILL_FILES.filter(s => s.phase === selected)) : [];
  const crossSkills = applyFilters(SKILL_FILES.filter(s => s.phase === null));
  const allFiltered = applyFilters(SKILL_FILES);

  const meta = selected ? PHASE_META[selected] : null;

  function SkillCard({ skill }) {
    const dir = skill.phase ? `${skill.phase}-${PHASE_META[skill.phase]?.label.toLowerCase()}` : "";
    const url = dir ? `${RAW}/${dir}/${skill.file}` : `${RAW}/${skill.file}`;
    const sc = surfaceColors[skill.surface] || surfaceColors["chat"];
    const phaseColor = skill.phase ? PHASE_META[skill.phase]?.color : T.dim;
    return (
      <div style={{
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        padding: "14px 16px", background: T.surface, borderRadius: 8,
        border: `1px solid ${T.border}`, gap: 16, transition: "border-color 0.15s",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
        onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: T.muted }}>{skill.file}</span>
            {skill.phase && (
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: phaseColor, display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: phaseColor, display: "inline-block" }} />
                {skill.phase} — {PHASE_META[skill.phase]?.label}
              </span>
            )}
            {!skill.phase && (
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>Cross-phase</span>
            )}
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
              {skill.surface === "chat" ? "Chat" : skill.surface === "chat + code" ? "Chat + Code" : "Figma MCP"}
            </span>
          </div>
          <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, margin: 0 }}>{skill.desc}</p>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
          <button onClick={() => setActiveSkill(skill)} style={{ padding: "5px 12px", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >Preview →</button>
          <a href={url} download style={{ padding: "5px 10px", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >↓</a>
        </div>
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
      <div style={{ borderBottom: `1px solid ${T.border}`, padding: "0 clamp(24px, 5vw, 80px)", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50, background: `${T.bg}f0`, backdropFilter: "blur(12px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: T.muted, transition: "all 0.15s" }}>← Home</button>
          <div style={{ width: 1, height: 16, background: T.border }} />
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }} />
            <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>Skills Library</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.dim }}>
            {allFiltered.length} skill{allFiltered.length !== 1 ? "s" : ""}
          </span>
          <ZipDownloadBtn skills={allFiltered} />
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "40px clamp(24px, 5vw, 80px) 80px" }}>

        {/* What is a Skill */}
        <div style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 10, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 6 }}>What is a Skill file?</div>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.65, marginBottom: 8 }}>
                Skill files are <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, background: T.card, padding: "1px 5px", borderRadius: 3 }}>.md</code> files you attach to a Claude Chat conversation before starting work. They give Claude the full context, methods, templates, and quality standards for a specific design phase — so every response is grounded in the framework rather than generic advice.
              </p>
              <div className="skill-steps-row">
                {["Download the .md file", "Attach it to a new Claude Chat", "Start working — Claude has full context"].map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#3B82F6", fontWeight: 700 }}>0{i + 1}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Phase strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 1 }}>
          {PHASES_ORDER.map((ph, i) => {
            const m = PHASE_META[ph];
            const isActive = selected === ph;
            const count = SKILL_FILES.filter(s => s.phase === ph).length;
            return (
              <button key={ph}
                onClick={() => setSelected(selected === ph ? null : ph)}
                style={{ padding: "14px 10px 12px", border: "none", borderRight: i < 5 ? `1px solid ${T.border}` : "none", borderBottom: isActive ? `2px solid ${m.color}` : "2px solid transparent", background: isActive ? T.surface : "transparent", cursor: "pointer", textAlign: "center", transition: "all 0.15s", outline: "none" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.card; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: m.color, margin: "0 auto 8px", boxShadow: isActive ? `0 0 8px ${m.color}` : "none", transition: "box-shadow 0.15s" }} />
                <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: isActive ? m.color : T.dim, marginBottom: 2 }}>{ph}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: isActive ? T.text : T.muted, lineHeight: 1.2 }}>{m.label}</div>
                <div style={{ fontSize: 9, color: T.dim, fontFamily: "'JetBrains Mono', monospace", marginTop: 3 }}>{count}</div>
              </button>
            );
          })}
        </div>

        {/* Phase detail panel */}
        <div style={{ overflow: "hidden", marginBottom: 20 }}>
          {!selected ? (
            <div style={{ padding: "28px 0 32px" }}>
              <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
                Select a phase above to browse skill files for that stage. Skill files are downloaded and attached to Claude Chat — they give Claude the methodology, templates, and quality standards for that phase automatically.
              </p>
            </div>
          ) : (
            <div style={{ padding: "20px 0 24px" }}>
              {/* Phase header + surface filter */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color, boxShadow: `0 0 7px ${meta.color}` }} />
                  <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: meta.color }}>{selected} — {meta.label}</span>
                  <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace" }}>{phaseSkills.length} skill{phaseSkills.length !== 1 ? "s" : ""}</span>
                </div>
                {/* Surface filter inline */}
                <div style={{ display: "flex", gap: 5 }}>
                  {SURFACE_FILTERS.map(f => {
                    const isActive = surfaceFilter === f.id;
                    return (
                      <button key={f.id} onClick={() => setSurfaceFilter(f.id)} style={{ padding: "3px 11px", borderRadius: 20, cursor: "pointer", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", border: `1px solid ${isActive ? T.borderHover : T.border}`, background: isActive ? T.card : "transparent", color: isActive ? T.text : T.dim, transition: "all 0.12s" }}>{f.label}</button>
                    );
                  })}
                </div>
              </div>
              {phaseSkills.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: T.dim, fontFamily: "'JetBrains Mono', monospace" }}>No skills match this surface filter</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {phaseSkills.map(skill => <SkillCard key={skill.file} skill={skill} />)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cross-phase skills — always visible */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim }}>Cross-phase</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: T.dim }}>{crossSkills.length} skill{crossSkills.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {crossSkills.map(skill => <SkillCard key={skill.file} skill={skill} />)}
          </div>
        </div>

      </div>
      {activeSkill && <SkillDrawer skill={activeSkill} onClose={() => setActiveSkill(null)} />}
    </div>
  );
}


// ── Skill Drawer ──────────────────────────────────────────────────────────────
function SkillDrawer({ skill, onClose }) {
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

  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, backdropFilter: "blur(2px)" }} />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(680px, 92vw)",
        background: T.surface,
        borderLeft: `1px solid ${T.border}`,
        zIndex: 101,
        display: "flex", flexDirection: "column",
        animation: "slideIn 0.22s ease-out",
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Drawer header */}
        <div style={{
          padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          background: T.surface, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{skill.file}</span>
            {skill.phase && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: phaseColor, flexShrink: 0 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: phaseColor }} />
                {skill.phase} — {T.phases[skill.phase]?.label}
              </span>
            )}
            {!skill.phase && <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: T.dim, flexShrink: 0 }}>Cross-phase</span>}
            <SkillBadge surface={skill.surface} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <a href={url} download style={{
              padding: "5px 14px", borderRadius: 5,
              fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em", textTransform: "uppercase",
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.muted, textDecoration: "none", transition: "all 0.15s", whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
            >↓ Download</a>
            <button onClick={onClose} style={{ background: "none", border: "none", color: T.dim, cursor: "pointer", fontSize: 18, padding: "2px 4px", lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Drawer content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px clamp(20px, 4vw, 48px) 48px" }}>
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
          {content && <div>{renderMarkdown(content)}</div>}
        </div>
      </div>
    </>
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
  // Skill detail now handled via SkillDrawer inline
  if (showSkillsLibrary) return <SkillsLibraryOverlay onBack={() => setShowSkillsLibrary(false)} />;

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
        .path-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; }
        .path-grid-item { border-right: 1px solid #2C2C2C; }
        .path-grid-item:last-child { border-right: none; }
        .three-ways-badge { display: inline-block; margin-bottom: 8px; }
        .three-ways-row { display: flex; gap: 14px; padding: 12px 14px; }
        .ways-explainer-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
        .skill-steps-row { display: flex; gap: 20px; flex-wrap: wrap; }
        .figma-callout-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: nowrap; }
        .deliverable-row { display: flex; align-items: center; padding: 13px 16px; gap: 14px; }
        .deliverable-label { display: inline; }
        .phase-counts { display: flex; gap: 8px; flex-shrink: 0; margin-left: 16px; }
        .three-ways-badge-wrap { display: inline-block; margin-bottom: 8px; }
        .skill-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; }
        .skill-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .tool-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; }
        .how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .how-figma { display: flex; gap: 10px; align-items: flex-start; }
        @media (max-width: 600px) {
          .path-grid { grid-template-columns: 1fr !important; }
          .path-grid-item { border-right: none !important; border-bottom: 1px solid #2C2C2C; }
          .path-grid-item:last-child { border-bottom: none; }
          .three-ways-badge { display: block; margin-bottom: 6px; }
          .ways-explainer-grid { grid-template-columns: 1fr; gap: 14px; }
          .deliverable-info-grid { grid-template-columns: 1fr !important; }
          .skill-steps-row { flex-direction: column; gap: 10px; }
          .three-ways-row { flex-direction: column; gap: 8px; }
          .three-ways-badge-wrap { background: none !important; border: none !important; padding: 0 !important; font-size: 10px !important; color: #666 !important; }
          .figma-callout-inner { flex-direction: column; align-items: flex-start; gap: 8px; }
          .figma-callout-inner button { align-self: flex-start; }
          .deliverable-row { flex-wrap: wrap; gap: 10px; }
          .deliverable-label { display: none; }
          .phase-counts { display: none; }
          .skill-row { flex-direction: column; align-items: flex-start; gap: 10px; }
          .skill-actions { width: 100%; }
          .skill-actions a, .skill-actions button { flex: 1; text-align: center; justify-content: center; }
          .tool-row { flex-direction: column; align-items: flex-start; gap: 10px; }
          .tool-row button { width: 100%; }
          .how-grid { grid-template-columns: 1fr; }
          .how-figma { flex-direction: column; gap: 6px; }
        }
        .hide-mobile { display: inline; }
        .show-mobile { display: none; }
        @media (max-width: 540px) {
          .hide-mobile { display: none; }
          .show-mobile { display: inline; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        padding: "0 40px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        background: `${T.bg}f0`, backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, justifyContent: "center" }}>
          <div style={{ display: "flex", gap: 3 }}>
            {Object.values(T.phases).map(p => (
              <div key={p.label} style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }} />
            ))}
          </div>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>
            <span className="hide-mobile">Agentic Product Design Framework</span>
            <span className="show-mobile">APDF</span>
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

        <div className="path-grid" style={{
          marginBottom: activePath ? 32 : 0,
          border: `1px solid ${T.border}`,
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
              desc: "I have a mission — a project or challenge I need to run. Show me a path through the framework.",
              cta: "Browse scenarios →",
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
                className="path-grid-item"
                onClick={() => setActivePath(activePath === item.id ? null : item.id)}
                style={{
                  background: T.surface,
                  border: "none",
                  padding: "20px 20px 18px", textAlign: "left",
                  cursor: "pointer", transition: "background 0.15s",
                  borderBottom: isActive ? `2px solid ${T.text}` : "2px solid transparent",
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
                }}>{isActive ? "▲ Active" : item.cta}</span>
              </button>
            );
          })}
        </div>

        {/* Path content */}
        {activePath === "phase" && (
          <div style={{ marginTop: 8 }}>
            <PhasePath
              onOpenTool={setActiveTool}
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
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
            <Mono color={T.dim} size={10}>Agentic Product Design Framework</Mono>
          </div>
        )}

      </div>
    </div>
  );
}
