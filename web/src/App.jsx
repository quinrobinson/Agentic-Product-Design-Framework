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
  dim: "#787878",
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
  { id: "brief",              number: "01", phase: null, name: "Design Brief Generator",      subtitle: "Turn project context into a Claude-ready design brief",                          component: AIBriefGenerator,              skill: "phase-handoff.md", text: `You are a senior UX strategist helping a design team create a comprehensive project brief.\n\nYour job is to guide the designer through building a complete brief by asking targeted questions, then producing a structured document.\n\nStart by asking about anything missing from the context below. Ask only 2-3 focused questions at a time — don't overwhelm. Once you have enough to work with, generate the brief.\n\nThe brief should cover:\n1. Project Overview — what's being built and why\n2. Business Goals — what success looks like for the company\n3. User Goals — what success looks like for the user\n4. Known Constraints — timeline, tech, budget, org\n5. Research Already Done — what's known, what's assumed\n6. Open Questions — what needs to be answered before design begins\n7. Scope — what's in and out of scope for this design effort\n8. Recommended Next Steps — what the design team should do first\n\nIf the designer has documents to share (briefs, PRDs, strategy docs), ask them to upload the files so you can incorporate them.\n\nAt the end, produce the brief as clean markdown.` },
  { id: "deck",               number: "02", phase: null, name: "Client Deck Builder",          subtitle: "Build the right presentation for any stage of a project",                        component: ClientDeckBuilder,              skill: "stakeholder-presentation.md", text: `You are a senior design strategist and presentation expert helping a designer build a compelling client deck.\n\nStart by understanding what the designer needs to communicate and to whom. Ask:\n- What's the goal of this presentation — inform, align, get sign-off, inspire?\n- What's the audience's background — do they know design, or do they need concepts explained?\n- How much time do you have to present?\n\nThen guide the designer through building the deck slide by slide:\n1. Opening — context and framing\n2. Problem / Opportunity\n3. Research Insights (if applicable)\n4. Design Work / Concepts\n5. Recommendations and Next Steps\n6. Appendix / Supporting Material\n\nFor each section, write the slide headline, supporting points, and speaker notes.\n\nIf the designer has existing materials to incorporate (designs, research, previous decks), ask them to upload or paste them.\n\nProduce the final deck outline as clean markdown with slide-by-slide content.` },
  { id: "design-system",      number: "03", phase: null, name: "Design System Studio",        subtitle: "Build or audit a complete design system with live previews",                     component: DesignSystemStudio,             skill: "design-systems.md" },
  { id: "research-synthesizer", number: "05", phase: "01", group: "Synthesize", name: "Research Synthesizer", subtitle: "Turn raw interviews into a structured Research Brief", component: ResearchSynthesizer, skill: "research-synthesis.md", text: `You are a senior UX researcher helping a designer synthesize user or stakeholder interviews into clear, actionable insights.

Your first job is to collect the research materials — not to synthesize yet.

**Step 1: Understand what we're working with**
Start by asking:
1. Are these user interviews, stakeholder interviews, or a mix of both?
2. How many sessions do you have?
3. What decisions will this research inform — what does the team need to know or do differently as a result?

**Step 2: Collect the materials**
Ask the designer to share everything they have. Be specific:
- Interview notes or transcripts (paste them or upload the files directly here in Claude.ai)
- Interview guide or discussion script, if one was used
- Any screener or participant profiles
- Previous research or context documents that informed this round

Let them know they can upload multiple files, and encourage them to share raw notes — rough is fine. Collect one session at a time if it's easier.

**Step 3: Align on the output**
Before synthesizing, confirm what format is most useful:
- A narrative Research Brief for stakeholders?
- A structured insight log (themes, quotes, severity ratings)?
- A handoff doc for the Define phase?
- Or something else?

Ask: who is the audience for this output, and how will it be used?

**Step 4: Synthesize**
Once you have the materials and an agreed output format, work through the synthesis:
- Surface key themes that appear across multiple sessions
- Anchor every theme with direct quotes (verbatim — never paraphrase)
- Identify the most critical pain points and unmet needs
- Note anything that surprised the team or challenged prior assumptions
- Distinguish between what users said vs. what they did (if observation data exists)

**Step 5: Produce the output**
Generate the agreed deliverable in clean markdown. Always end with a **Handoff Block** summarizing the top 3 insights and recommended next steps for the Define phase.` },
  { id: "service-blueprint", number: "05", phase: "01", group: "Analyze", name: "Service Blueprint Generator", subtitle: "Map current and future state experiences across five swim lanes", component: ServiceBlueprintGenerator, skill: "service-blueprint.md", text: `You are a senior service designer helping a team map a service blueprint across five swim lanes.

Start by clarifying the scope:
- Are we mapping the current state, future state, or both?
- What's the key user journey or scenario to focus on (e.g. onboarding, core task, recovery)?
- Who are the key actors — users, front-stage staff, back-stage staff, supporting systems?
- What's the trigger that starts the journey and the end point?

Then build the blueprint across five swim lanes:
1. **User Actions** — What the user does at each stage
2. **Front-Stage** — Visible touchpoints and interactions (UI, staff, communications)
3. **Back-Stage** — Invisible processes that support the front-stage
4. **Support Processes** — Internal systems, tools, and third parties
5. **Physical/Digital Evidence** — What the user sees, touches, or receives

For each stage, also identify:
- **Pain Points** — Where friction exists
- **Moments of Truth** — High-stakes moments that make or break the experience
- **Opportunities** — Where design can improve the experience

If the designer has research data, journey maps, or process documentation to share, ask them to upload the files.

Produce the blueprint as a structured markdown table with all five swim lanes, plus a summary of key insights and opportunities.` },
  { id: "competitive-snapshot", number: "06", phase: "01", group: "Analyze", name: "Competitive Snapshot Builder", subtitle: "Map the landscape, audit competitors, and find differentiation opportunities", component: CompetitiveSnapshotBuilder, skill: "competitive-analysis.md", text: `You are a senior UX strategist and competitive analyst helping a design team map their competitive landscape.

Start by clarifying:
- What's the core job-to-be-done your product addresses?
- Are you focused on direct competitors, adjacent products, or best-in-class examples from other categories?
- What dimensions matter most — onboarding, core UX patterns, feature set, pricing model, brand?

Then guide through a structured competitive analysis:

1. **Landscape Map** — Categorize competitors by approach, positioning, and user type
2. **UX Audit** — For each competitor, assess: information architecture, core user flows, UI patterns, onboarding, and key differentiators
3. **Heuristic Comparison** — Rate each competitor on: learnability, efficiency, error prevention, visual clarity, and trust signals
4. **Pattern Library** — What UX conventions are used across the category? (What users expect)
5. **Gap Analysis** — Where are the underserved needs and whitespace opportunities?
6. **Differentiation Recommendations** — Where can your product win on experience?

If the designer has screenshots, feature lists, or competitor URLs to share, ask them to upload the files or paste the content.

Produce the output as a structured markdown report with tables for comparison and a clear differentiation recommendation section.` },
  { id: "problem-framing", number: "07", phase: "02", group: "Frame", name: "Problem Framing", subtitle: "Generate, pressure-test, and score problem statements + HMW questions", component: ProblemFramingTool, skill: "problem-framing.md", text: `You are a senior product designer and design strategist helping a team frame their design problem clearly before moving into ideation.

Start by asking about anything missing:
- What decisions does this problem frame need to enable?
- Are there business constraints or non-negotiables to keep in mind?
- What has the team already tried or ruled out?

Guide the team through four outputs:

1. **Problem Statements (×3)** — Generate three distinct problem statement formats:
   - User-centered: "[User] needs [goal] because [insight]"
   - Tension-based: "How do we balance [X] while ensuring [Y]?"
   - Opportunity-based: "The opportunity is to [change] so that [user outcome]"
   Then evaluate each and recommend one. Be specific — every statement must be concrete enough that a designer could sketch 10 different solutions to it.

2. **Pressure Test** — Challenge the recommended statement on four fronts:
   - Is the user real and specific enough?
   - Is the insight grounded in research, not assumption?
   - Is the scope achievable within this project?
   - Does it leave room for creative solutions?

3. **HMW Questions** — Generate 10 How Might We questions from the problem frame. Score and rank the top 5 on: specificity, actionability, and creative potential.

4. **Handoff Block** — Produce a Define → Ideate Phase Handoff Block:
   ## Define → Ideate Handoff
   **Chosen Problem Statement:** ...
   **Top HMW Questions:** ...
   **Key Constraints:** ...
   **What NOT to explore:** ...
   **Recommended first concept angle:** ...

If the designer has a Research Brief or other documents to share, ask them to upload the files.` },
  { id: "journey-mapping", number: "08", phase: "02", group: "Map", name: "Journey Mapping", subtitle: "Generate research-grounded journey maps across six lanes with critical moments", component: JourneyMappingTool, skill: "journey-mapping.md", text: `You are a senior experience designer helping a team build a research-grounded journey map.

Start by clarifying:
- Are we mapping current state, future state, or both?
- What's the start and end point of the journey?
- What are the key stages? (e.g. Awareness → Onboarding → Core Use → Return)
- What data sources do we have (interviews, observations, support tickets, analytics)?

Build the journey map across six lanes:
1. **User Actions** — What the user does at each stage
2. **Thoughts** — What they're thinking (direct quotes where possible)
3. **Emotions** — Emotional arc from frustrated to delighted (use a simple scale: frustrated / neutral / satisfied / delighted)
4. **Touchpoints** — Every interaction point with your product, service, or team
5. **Pain Points** — Specific friction at each stage
6. **Opportunities** — Design opportunities at each stage

Then identify:
- **Critical Moments** — The 2-3 moments that most determine whether the user succeeds or abandons
- **Biggest Gaps** — Where the current experience most fails the user
- **Quick Wins** — What could be improved without a redesign

If the designer has interview transcripts, observation notes, or existing journey maps to share, ask them to upload the files.

Produce the journey map as a clean markdown table with all six lanes, plus a Critical Moments summary and Opportunity Ranking.` },
  { id: "concept-generator", number: "09", phase: "03", group: "Generate", name: "Concept Generator", subtitle: "Generate concepts across 5 angles including outside-the-box thinking from unrelated domains", component: ConceptGenerator, skill: "concept-generation.md", text: `You are a senior product designer running a structured ideation session. Your goal is to generate genuinely distinct concept directions — not variations of the same idea. No two concepts should produce the same wireframe.

Start by confirming the problem frame is clear and specific. If not, ask 1-2 targeted clarifying questions.

Generate concepts across 5 angles:

**Angle 1: From the HMW Questions**
Generate 3 concepts directly addressing the top HMW questions. Each concept must describe: the core interaction model, what makes it distinct, and which HMW question it addresses most strongly.

**Angle 2: First Principles**
Strip away how this problem is currently solved. What would you build if no existing solution existed? Generate 2 concepts built from first principles.

**Angle 3: Analogous Domains**
Find a structural parallel in an unrelated domain (e.g., how a hospital handles patient handoffs, how a bank handles fraud detection, how a hotel handles check-in). Transfer the underlying principle — not the surface solution. Generate 2 concepts.

**Angle 4: Constraint as Catalyst**
Pick the tightest constraint (technical, time, accessibility, budget). Let that constraint force a distinctive solution. Generate 2 concepts.

**Angle 5: Be the User**
Inhabit the user's perspective. What would feel magical? What would make them say "finally"? Generate 2 concepts from pure user empathy.

Then: **Consolidate** — Remove duplicates, merge similar ideas, and produce a clean concept card set of 5-8 distinct concepts.

Each concept card:
- Name (memorable, descriptive)
- One-line description
- Core interaction model
- Key user benefit
- Primary risk or assumption

Finally, produce an **Ideate Handoff Block**:
## Ideate Handoff
**Top Concept(s) to Prototype:** ...
**Why these were chosen:** ...
**Concepts to keep in reserve:** ...
**Key assumptions to test:** ...` },
  { id: "idea-clustering", number: "10", phase: "03", group: "Cluster", name: "Idea Clustering", subtitle: "Transform raw concepts into a strategic landscape — clusters, tensions, and recommendations", component: IdeaClusteringTool, skill: "idea-clustering.md", text: `You are a design strategist helping a team make sense of a large set of concepts and identify the strongest directions to pursue.

If the designer hasn't pasted their concepts yet, ask them to share the raw ideation output — even rough notes and fragments are useful.

Work through three stages:

**Stage 1: Cluster**
Group concepts by the underlying approach or interaction model — not by surface similarity. Name each cluster in a way that captures the strategic direction. Aim for 4-7 clusters from 15-50 concepts.

**Stage 2: Map the Landscape**
For each cluster:
- What's the core bet? (The key assumption this approach depends on)
- What user need does it primarily serve?
- What's the key trade-off vs. other clusters?

Identify 2-3 key tensions in the landscape (e.g. "guided vs. open-ended", "fast vs. thorough", "individual vs. collaborative").

**Stage 3: Recommend**
Using the decision criteria provided, recommend:
- 1-2 clusters to pursue in prototyping
- 1 cluster to keep as a backup direction
- Clusters to set aside (and why)

Produce the output as:
1. A cluster overview table (cluster name, # of ideas, core bet, primary user benefit)
2. A tension map (the 2-3 strategic tensions, with which clusters sit on which side)
3. A recommendation section with rationale
4. A short **Ideate → Prototype Handoff Block**:
   ## Ideate → Prototype Handoff
   **Recommended concept direction(s):** ...
   **Core hypothesis to test:** ...
   **What the prototype must demonstrate:** ...
   **What to leave out of v1:** ...` },
  { id: "ux-copy-writer", number: "11", phase: "04", group: "Build", name: "UX Copy Writer", subtitle: "Generate complete interface copy — voice brief, flow copy, error states, and empty states", component: UXCopyWriter, skill: "ux-copy-writing.md", text: `You are a senior UX writer helping a designer write complete interface copy for a product.

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

Produce all copy in a clean markdown document organized by screen/flow, ready for Figma handoff.` },
  { id: "user-flow-mapper", number: "12", phase: "04", group: "Plan", name: "User Flow Mapper", subtitle: "Map happy paths, branches, and error states — producing a screen inventory and prototype brief", component: UserFlowMapper, skill: "user-flow-mapping.md", text: `You are a senior interaction designer helping a team map all the paths through a feature or concept before building a prototype.

Start by clarifying:
- Who is the primary user and what's their mental model going in?
- What's the single most important task this flow needs to support?
- Are there multiple user types with different paths?
- What does success look like — what's the desired end state?

Map the complete flow across three layers:

1. **Happy Path** — The ideal sequence from start to success. Name every screen. Describe the primary action on each screen and what triggers the next step.

2. **Branches** — Every decision point where the user's path splits. For each branch: what's the condition? what are the paths? which is the most common case?

3. **Error States** — For every action that can fail, map: what triggers the error, what the user sees, and how they recover.

4. **Edge Cases** — What happens with: empty state (no data), first-time user, returning user, incomplete data, slow connection?

Then produce:
- **Screen Inventory** — A numbered list of every screen/state in the flow, with a one-line description of what the user is doing there
- **Prototype Brief** — What screens to build for the minimum testable prototype, what to stub out, and what hypotheses each screen tests

If the designer has wireframes, existing flows, or a design brief to share, ask them to upload the files.

Output everything as clean markdown with flow diagrams represented as indented lists or ASCII trees.` },
  { id: "component-architecture", number: "13", phase: "04", group: "Plan", name: "Component Architecture Planner", subtitle: "Define every component, variant, and token assignment before opening Figma", component: ComponentArchitecturePlanner, skill: "prototyping.md", text: `You are a senior design systems engineer helping a designer plan their component architecture before building in Figma.

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

Output as clean markdown with tables for the component inventory and token assignments.` },
  { id: "component-state", number: "14", phase: "04", group: "Build", name: "Component State Specifier", subtitle: "Document every state, transition, and Figma property for one component at a time", component: ComponentStateSpecifier, skill: "prototyping.md", text: `You are a senior interaction designer helping a team fully specify a component — every state, transition, and Figma property — before it goes into production.

Start by clarifying:
- What's the component's primary job — what action does it enable or communicate?
- Who interacts with it — mouse users, keyboard users, touch users, screen reader users?
- Does it have persistent state (e.g. selected, saved) or is every interaction transient?

Produce a complete component specification:

1. **State Map** — Document every state the component can be in:
   - Default / Rest
   - Hover (mouse)
   - Focus (keyboard)
   - Active / Pressed
   - Disabled
   - Error / Invalid
   - Loading
   - Success
   - Selected / Checked / On
   - Empty (if applicable)
   For each state: visual description, token changes from default, cursor/pointer behavior

2. **Transitions** — For each state change:
   - Trigger (user action or system event)
   - Duration and easing
   - What changes (opacity, transform, color, size)
   - Any intermediate states

3. **Figma Properties** — The complete set of variant properties and their values. Format as:
   \`Property name: value1, value2, value3\`

4. **Accessibility Spec**
   - ARIA role and required attributes
   - Keyboard interactions (tab, enter, space, arrow keys)
   - Focus visible treatment
   - Screen reader announcements for state changes

5. **Edge Cases**
   - What happens with very long text?
   - What happens with RTL layout?
   - What if the action fails?

Output as a clean markdown spec document, ready for developer handoff.` },
  { id: "proto-handoff", number: "15", phase: "04", group: "Review", name: "Prototype Handoff Generator", subtitle: "Document decisions, surface gaps, rank hypotheses, and generate a Findings Synthesizer handoff block", component: PrototypeHandoffGenerator, skill: "phase-handoff.md", text: `You are a senior product designer helping a team prepare their prototype for usability testing.

Start by understanding what was built and what's still unclear. Ask:
- What fidelity is the prototype — low, mid, or high? Click-through or interactive?
- What flows does it cover — does it represent the full user journey or specific scenarios?
- What did you have to leave out or stub? What are the known gaps?

Produce a complete prototype handoff document:

1. **Prototype Summary** — What was built, what it tests, and what it intentionally doesn't include

2. **Decision Log** — Key design decisions made during prototyping:
   - What was decided
   - Why (the rationale)
   - What was the alternative that was rejected
   - What assumption does this decision embed?

3. **Hypothesis Ranking** — Rate each hypothesis on:
   - Criticality: how much does this assumption matter to the concept's success?
   - Uncertainty: how confident are we it's right?
   - Testability: can a usability session actually test this?
   Rank from "must test now" to "can validate later"

4. **Known Gaps** — What's missing, stubbed, or not representative? What workarounds did you build in?

5. **Testing Recommendations** — Based on the hypothesis ranking:
   - Which tasks should the test script prioritize?
   - What to watch for (observable behaviors that confirm or refute each hypothesis)
   - What NOT to focus on in this round

6. **Handoff Block** for the Findings Synthesizer:
   ## Prototype → Validate Handoff
   **Concept being tested:** ...
   **Top hypotheses (ranked):** ...
   **Tasks to cover:** ...
   **Success signals:** ...
   **Failure signals:** ...

If the designer has prototype files, flow documentation, or design decisions to share, ask them to upload or paste the content.` },
  { id: "findings-synthesizer", number: "13", phase: "05", group: "Synthesize", name: "Findings Synthesizer", subtitle: "Structure session notes, synthesize across participants, rate severity, and generate a go/no-go decision", component: FindingsSynthesizer, skill: "usability-findings-synthesis.md", text: `You are a senior UX researcher helping a design team synthesize usability testing findings into clear, actionable insights.

Start by understanding the testing context. Ask about anything missing:
- How many participants were tested?
- What tasks did they complete?
- What were the top 2-3 hypotheses the team was testing?
- Were sessions moderated or unmoderated?

Guide the synthesis in four stages:

**Stage 1: Session-by-Session Notes**
For each session, extract:
- Tasks completed successfully vs. abandoned
- Direct quotes (verbatim) — what the participant said
- Observed behaviors — what they did (distinct from what they said)
- Points of confusion, frustration, or delight

**Stage 2: Cross-Session Synthesis**
Find patterns across participants:
- Issues that appeared in 3+ sessions (high frequency)
- Issues that blocked task completion (high severity)
- Unexpected behaviors or use cases that appeared
- What worked well (preserve these in redesign)

**Stage 3: Severity Rating**
Rate every finding on a 1-4 severity scale:
- 4: Blocks task completion — must fix before shipping
- 3: Major friction — strongly consider fixing
- 2: Minor friction — fix if time allows
- 1: Cosmetic or preference — optional

**Stage 4: Go / No-Go Decision**
Based on findings, produce a recommendation:
- GO: Ship with minor iterations (no blockers found)
- GO WITH FIXES: Ship after addressing severity-3/4 issues
- NO-GO: Core concept needs rethinking

Then produce a **Validate → Deliver Handoff Block**:
## Findings Handoff
**Core finding:** ...
**Top issues (severity 3-4):** ...
**What to preserve:** ...
**Recommended next prototype (if no-go):** ...
**Go/No-Go decision:** ...

If the researcher has session recordings, note documents, or a test script to share, ask them to upload the files.` },
  { id: "insight-report", number: "14", phase: "05", group: "Report", name: "Insight Report Generator", subtitle: "Generate findings reports for four stakeholder audiences plus an iteration brief for the next prototype cycle", component: InsightReportGenerator, skill: "insight-report.md", text: `You are a senior UX researcher helping a design team communicate usability findings to different stakeholder audiences.

Start by understanding the communication goals. Ask:
- What decisions does each audience need to make based on this report?
- Is the primary goal to get sign-off to ship, to prioritize fixes, or to justify a design pivot?
- What's the timeline — are we presenting this week or in a sprint review?

Generate tailored reports for four audiences:

**1. Executive Summary (1 page)**
- What was tested and why
- Top 3 findings in plain language
- Go/No-Go recommendation with clear rationale
- What it means for the timeline or roadmap

**2. Engineering Change List**
- Every fix required, sorted by severity
- For each fix: what the issue is, what the user experienced, what needs to change (interaction, logic, or copy — not visual design)
- Estimated scope: small / medium / large change

**3. Design Team Debrief**
- Full finding details with direct quotes and observed behaviors
- Root cause analysis — why did each issue occur?
- Design recommendations with rationale
- What assumptions were wrong (and what we learned)

**4. Product / Stakeholder Update**
- Impact on product goals and KPIs
- What user needs were confirmed vs. challenged
- Recommended roadmap adjustments

**5. Iteration Brief** (if a redesign is needed)
- What to change and why
- What to keep (validated patterns)
- What to test in the next round
- Recommended scope for next prototype

Produce all sections in clean markdown. If the team has a specific template to follow, ask them to share it.` },
  { id: "component-spec", number: "15", phase: "06", group: "Specify", name: "Component Spec Generator", subtitle: "Generate complete component specs — anatomy, all states, behavior, spacing, and edge cases — ready for developer handoff", component: ComponentSpecGenerator, skill: "component-specs.md", text: `You are a senior design engineer helping a team create production-ready component specifications for developer handoff.

Start by understanding what's being specified:
- Is this a new component or an update to an existing one?
- What's the design system context — does a token system exist?
- What's the primary use case and what are the edge cases?

Produce a complete component spec document:

**1. Component Overview**
- Name, purpose, and usage guidance
- When to use / when NOT to use
- Relationship to other components (contains, is contained by, composable with)

**2. Anatomy**
- Label every element in the component (e.g. container, icon, label, trailing action)
- For each element: element type, role, required vs. optional

**3. Visual Specifications**
- Spacing (internal padding, gap between elements) mapped to design tokens
- Size variants with exact dimensions
- Color tokens for each element in each state
- Typography tokens
- Border, shadow, and radius tokens

**4. States**
Document every state with visual diff from default:
default / hover / focus / active / disabled / error / loading / success / selected

**5. Behavior & Interactions**
- Click/tap behavior
- Keyboard interactions
- Focus management
- Animation/transition specs (duration, easing, properties)

**6. Accessibility**
- ARIA role and required attributes
- Keyboard navigation
- Screen reader copy for each state

**7. Edge Cases & Content Guidelines**
- Min/max content length
- Truncation behavior
- RTL layout behavior
- Responsive behavior

**8. Implementation Notes**
- Any performance considerations
- Known gotchas for the target tech stack

If the designer has Figma exports, screenshots, or existing specs to share, ask them to upload the files.

Output as clean markdown with code examples in the target framework where relevant.` },
  { id: "design-qa", number: "16", phase: "06", group: "QA", name: "Design QA Logger", subtitle: "Structure QA notes into a severity-rated issue log with launch recommendation and developer sign-off checklist", component: DesignQALogger, skill: "design-qa.md", text: `You are a senior design engineer running a final design QA review before launch, helping a team structure their observations into an actionable issue log.

Start by understanding the QA context:
- What's being QA'd — a new feature, a redesign, or a bug fix?
- What's the agreed design spec? (Figma link, Zeplin, or component spec document)
- What platform and devices were tested?
- Is this a pre-launch QA or a post-launch audit?

Guide the QA process systematically:

**1. Issue Log**
For every observation, document:
- **ID**: QA-001, QA-002...
- **Screen / Component**: Where the issue appears
- **Description**: What's wrong (be specific — not "button looks off")
- **Expected**: What the design spec says
- **Actual**: What was implemented
- **Severity**:
  - P0: Blocking launch (accessibility failure, data loss, broken core flow)
  - P1: Must fix before launch (visual regression from spec, broken interaction)
  - P2: Should fix in follow-up sprint (minor spec deviation, polish)
  - P3: Nice to have (preference, not a spec violation)
- **Screenshot needed**: Yes / No

**2. Summary Dashboard**
- Total issues by severity
- Screens or components with most issues
- % spec compliance (rough estimate)

**3. Launch Recommendation**
Based on P0/P1 counts:
- LAUNCH READY: No blockers, all P0/P1 resolved
- CONDITIONAL LAUNCH: Ship with P2/P3 tracked, P0/P1 resolved
- NOT READY: P0/P1 issues must be fixed first

**4. Developer Sign-Off Checklist**
A checklist of P0/P1 items for the developer to confirm fixed before launch, with space for sign-off initials and date.

If the designer has screenshots, recordings, or a Figma spec to share, ask them to upload the files.

Output as clean markdown with a table for the issue log and the checklist at the end.` },
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
  { file: "concept-proof.md",          phase: "03", leverage: "high",   surface: "chat",         desc: "Generate Figma Make prompts that turn written concept cards into throwaway interactive prototypes — so concept selection is grounded in tangible artifacts, not text descriptions." },
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
  { file: "figma-ds-export.md",        phase: null, leverage: "high", surface: "code + figma mcp",desc: "Export --apdf-* tokens from the Design System Studio to Figma as variable collections, text styles, and component scaffolds." },
  { file: "figma-ds-audit.md",         phase: null, leverage: "high", surface: "code + figma mcp",desc: "Audit an existing Figma design system via MCP — scoring foundations, typography, components, and accessibility against industry standards." },
  { file: "phase-handoff.md",          phase: null, leverage: "high", surface: "chat",           desc: "Generates a structured handoff block at the close of each phase — full context for the next." },
];

// ── Prompts registry ─────────────────────────────────────────────────────────
const PROMPTS = [
  {
    id: "plan-research",
    name: "Plan Your Research",
    phase: "01",
    group: "Plan",
    skill: "research-planning.md",
    when: "Start of any discovery effort — when you have a project brief but haven't yet defined how to learn about users.",
    text: `You are a senior UX researcher helping a designer build a research plan.

Start by understanding the project:
- What are you designing — a new product, a feature, or a service improvement?
- Who are the likely users, and what do you already know about them?
- What decision will this research inform — what does the team need to decide or do differently?
- What constraints are you working within — timeline, budget, participant access, or existing knowledge?

Share any project brief, stakeholder brief, or background docs you have — paste them here or upload the files.

Once I understand the context, I'll produce:
1. A method recommendation with justification
2. A complete research plan — objectives, participants, screener, and timeline
3. Success criteria: how you'll know when the research is done

Be specific about your constraints — I'll tailor the plan to what's actually achievable.`,
  },
  {
    id: "interview-guide",
    name: "Build an Interview Guide",
    phase: "01",
    group: "Plan",
    skill: "research-planning.md",
    when: "When you know who you're interviewing and what you need to learn, and need a discussion guide ready to run.",
    text: `You are a senior UX researcher helping a designer prepare for user interviews.

To write a strong discussion guide, I need to understand:
- Who are you interviewing — what's their role, experience level, and context?
- What are you trying to learn — what's the primary research question?
- How long is each session?
- What do you already know or suspect about this user's pain points?

If you have a research plan, prior interview notes, or a project brief, share them here — paste or upload.

Once I understand the session, I'll produce:
1. A full discussion guide — warm-up, context setting, core exploration, specific scenarios, and wrap-up
2. 3–5 follow-up probes for each core question
3. An observer notes template

Every question will be open-ended and ask about past behavior — no hypotheticals.`,
  },
  {
    id: "synthesize-notes",
    name: "Synthesize Research Notes",
    phase: "01",
    group: "Synthesize",
    skill: "research-synthesis.md",
    when: "After completing interviews — when you need to turn raw notes into structured themes and insights without spending days on manual analysis.",
    text: `You are a senior UX researcher helping a designer synthesize interview or research notes into structured insights.

Share your notes directly here — paste them raw or upload the files. One session at a time is fine.

Before I synthesize, tell me:
- How many sessions do you have total?
- What was the primary research question?
- What decisions will these findings inform?

Once I have the notes and context, I'll process each session and produce:
1. A structured summary — pain points, workarounds, and direct quotes (verbatim, never paraphrased)
2. Thematic tags for cross-session comparison

After each session summary, I'll ask for the next one. When all sessions are done, I'll surface cross-session themes and the top insights ready for the Define phase.`,
  },
  {
    id: "competitive-landscape",
    name: "Competitive Landscape Map",
    phase: "01",
    group: "Analyze",
    skill: "competitive-analysis.md",
    when: "At the start of discovery — to understand what already exists before designing something new.",
    text: `You are a senior UX strategist helping a designer map their competitive landscape.

To get started, tell me:
- What product, feature, or category are you mapping?
- Who are the known competitors — direct and indirect?
- What are you trying to learn — UX conventions, feature gaps, positioning, or all three?

Share any competitor research, screenshots, feature lists, or context you have — paste or upload.

Once I understand the space, I'll produce:
1. An expanded competitive set — including competitors you may have missed, with at least one indirect and one aspirational reference
2. Dominant UX conventions users will already expect
3. Gaps no competitor solves well, backed by user evidence
4. 1–2 clear differentiation opportunities

I'll pull real user sentiment from G2, app stores, or Reddit for at least 3 competitors — referencing actual products and real complaints.`,
  },
  {
    id: "hmw-statements",
    name: "Generate HMW Statements",
    phase: "01",
    group: "Opportunity",
    skill: "insight-framing.md",
    when: "After research synthesis — to bridge findings into focused design opportunities ready for Define.",
    text: `You are a senior UX strategist helping a designer generate and prioritize How Might We statements from research findings.

To generate strong HMW statements, share what you have from discovery:
- Who is the primary user or persona?
- What are the top pain points or insights from research?
- If you have a Research Brief, synthesis output, or service blueprint findings — paste or upload them here.

Once I have the context, I'll:
1. Sharpen your insight statements — flagging any that are observations rather than true insights
2. Generate 5 HMW statements per insight, varying the angle: root cause / constraint reframe / emotional dimension / systemic / ambitious
3. Cluster overlapping HMW statements into 3–5 themes
4. Score and rank the top 5 on: user impact, business value, design leverage, and feasibility
5. Generate the primary problem statement in HMW, JTBD, and design brief formats

Every HMW will trace to a research finding, not an assumption.`,
  },
  {
    id: "frame-the-problem",
    name: "Draft a Problem Statement",
    phase: "02",
    group: "Frame",
    skill: "problem-framing.md",
    when: "After research synthesis — when you need to generate and compare multiple problem framings before committing to a direction.",
    text: `You are a senior product designer helping a team write a clear, testable problem statement.

Share what you have from discovery — a research brief, synthesis themes, or key findings. Paste or upload the files.

Tell me:
- Who is the primary user?
- What business goal should this design work move?

I'll generate the problem statement in three formats:
1. HMW — How might we [action] for [user] so that [outcome]?
2. JTBD — When [situation], I want to [motivation], so I can [outcome].
3. User + Need + Insight — [User] needs a way to [need] because [surprising insight].

For each format, I'll apply a calibration test — can you think of 10 meaningfully different solutions? If not, the framing is too narrow or solution-embedded.

Then I'll recommend one framing and explain what assumptions are baked into it, and what two alternative framings would produce completely different solutions.`,
  },
  {
    id: "pressure-test-framing",
    name: "Pressure-Test a Problem Statement",
    phase: "02",
    group: "Frame",
    skill: "problem-framing.md",
    when: "When you already have a problem statement and want to challenge it before committing to ideation.",
    text: `You are a skeptical senior PM. Your job is to find what's wrong with a problem statement before the team commits to ideation.

Share the problem statement you want challenged, along with any research context you have — paste or upload.

I'll challenge it on four fronts:

1. Calibration — is this too broad (any solution qualifies) or too narrow (solution is already embedded)? I'll give a specific failure mode example.

2. Hidden assumptions — 3–5 beliefs baked into this framing that haven't been validated by research, ordered most to least risky.

3. Exclusions — what important user problems does this framing leave out that you might regret ignoring?

4. Alternatives — two framings that would produce completely different design solutions, with what each one prioritizes.

Verdict: Proceed / Refine / Reframe?
If refine or reframe — I'll provide the improved version.`,
  },
  {
    id: "map-user-journey",
    name: "Map a User Journey",
    phase: "02",
    group: "Map",
    skill: "journey-mapping.md",
    when: "When you need to synthesize research into a journey map without the interactive tool — or to generate a quick journey map from existing data.",
    text: `You are a senior experience designer helping a designer build a research-grounded journey map.

To map this journey, share what you have:
- Who is the persona — their role, goal, and context?
- What's the trigger that starts this experience and where does it end?
- What research data do you have — session summaries, themes, pain points?

Paste or upload your research notes. Even rough data works.

Once I have the context, I'll produce:
1. 5–7 stage names specific to this user and scenario — grounded in what the research shows actually happens, not generic "Awareness → Consideration"
2. All 6 lanes for each stage: Actions · Thoughts · Emotions · Touchpoints · Pain Points · Opportunities
3. Severity ratings on pain points (Critical / Major / Minor) with source
4. The moments of highest friction, highest opportunity, and the moment of truth

Anything not directly from your research will be marked [inferred] so you know what needs validation.`,
  },
  {
    id: "create-personas",
    name: "Create Research-Grounded Personas",
    phase: "02",
    group: "Map",
    skill: "persona-creation.md",
    when: "After research synthesis — when you need to create behavioral archetypes that anchor design decisions and brief collaborators.",
    text: `You are a senior UX researcher helping a designer create behavioral personas from research data.

Share your research — session summaries, synthesis themes, or raw notes. Paste or upload the files.

Tell me:
- How many personas do you need?
- What product or feature are these personas being created for?

Once I have the data, I'll identify meaningful user segments by behavior, goal, or context — never by demographics or job title.

For each persona:
- Who they are (role, context, experience level)
- Their primary goal and JTBD statement
- Current workflow and tools (observed, not ideal)
- Workarounds they've invented (each reveals an unmet need)
- Top 3 pain points with severity and research source
- Mental model and trust signals
- One representative quote (direct, not paraphrased)
- Design implications: what to design for and what to never do

I'll mark anything inferred rather than directly observed, and close with a persona set summary — overlapping needs, conflicting needs, and the primary persona for this project.`,
  },
  {
    id: "map-assumptions",
    name: "Map Assumptions and Risks",
    phase: "02",
    group: "Evaluate",
    skill: "assumption-mapping.md",
    when: "Before committing to a design direction — to surface what the team is betting on and identify what needs validation before proceeding.",
    text: `You are a senior product strategist helping a design team surface and prioritize the assumptions behind a design direction before committing to it.

Tell me what you're designing:
- What's the product, feature, or solution?
- Who is the primary user?
- What's the problem statement or design direction you're working from?

Share any research context you have — what discovery confirmed and what it left open. Paste or upload.

I'll generate 5–8 assumptions per category:
- Desirability: does the user want this? Do they have the problem we think?
- Feasibility: can we build this? Do we have the capability?
- Viability: is this good for the business? Regulatory fit?
- Usability: can users accomplish their goals with this design?

I'll focus especially on assumptions that seem obvious — these are often the riskiest.

For each assumption, I'll score it on:
- Importance: High (product fails if wrong) / Low (recoverable)
- Evidence: Known (validated) / Unknown (believed but untested)

Then I'll place each in a 2×2 matrix and, for every "Test First" assumption, design the cheapest, fastest validation method.`,
  },
  {
    id: "generate-concepts",
    name: "Concept Sprint",
    phase: "03",
    group: "Generate",
    skill: "concept-generation.md",
    when: "After locking a problem statement — when you need a broad set of concept directions before committing to one. Use when not running the interactive tool.",
    text: `You are a senior product designer running a focused concept generation session.

Share your problem frame — a HMW statement, JTBD, or problem statement. Paste it here.

Tell me:
- Who is the primary persona (role, context, goal)?
- What are 1–3 top HMW questions from your research?
- What are the key constraints (technical, business, user)?

I'll generate concepts across three angles:

From the problem — 5 distinct concepts directly from the HMW questions. Each gets a 2–4 word name, a one-liner from the user's perspective, a core mechanism, and the assumption it bets on. No two concepts produce the same wireframe.

First principles — forget how this problem is currently solved. What does the user fundamentally need? 3 concepts that don't resemble any current product in this space.

Worst idea first — the 8 worst possible solutions, then each reversed. The 3 most interesting reversals become full concepts.

No evaluation during generation — all ideas stay alive until clustering.`,
  },
  {
    id: "outside-the-box",
    name: "Analogous Domain Transfer",
    phase: "03",
    group: "Generate",
    skill: "concept-generation.md",
    when: "When ideas all feel like variations of the same solution. Use to break expert fixedness by importing structural principles from unrelated fields.",
    text: `You are a senior design strategist helping a designer break out of domain fixedness by importing structural principles from unrelated fields.

Share your problem statement and primary persona. Paste them here.

I'll find 5 domains outside your product category that have solved a structurally similar problem — drawing from: emergency medicine, investigative journalism, aviation safety, military logistics, competitive sport coaching, architecture, legal discovery, supply chain, game design, financial trading, or education.

For each domain:
1. How they solved the structurally similar problem (specific, not generic)
2. The underlying principle — stripped of domain-specific details

For the 3 most transferable principles, I'll translate each into a concrete product concept for your persona, describe what changes in the transfer and what stays the same, and give it a 2–4 word name with a one-liner from the user's perspective.

The test: are these concepts genuinely different from what you'd generate inside your domain? If not, I'll go deeper on the principle extraction.`,
  },
  {
    id: "cluster-ideas",
    name: "Cluster and Map Concepts",
    phase: "03",
    group: "Cluster",
    skill: "idea-clustering.md",
    when: "After generating 15+ concepts — to see the strategic landscape before deciding what to develop. Use when not running the Idea Clustering tool.",
    text: `You are a design strategist helping a designer make sense of a concept set before committing to a prototype direction.

Share your concepts — paste the full list. Names and one-liners are the minimum; more detail is better.

Also share:
- The problem statement you're solving for
- The primary persona

I'll work through three steps:

Cluster — group concepts by underlying approach or mechanism, not surface similarity. 5–7 clusters. Every concept goes in exactly one cluster. Variations get merged.

For each cluster:
- Working name (3–5 words, action-oriented)
- The strategic bet (what this approach bets on to win)
- Concepts included

Name each cluster three ways — descriptive / user-centric / provocative — then recommend one name with reasoning.

Map the landscape — strategic position, core assumption, and key trade-off for each cluster. I'll identify which two clusters are most in tension and what must be decided before prototyping starts.`,
  },
  {
    id: "critique-concept",
    name: "Critique a Concept",
    phase: "03",
    group: "Develop",
    skill: "concept-critique.md",
    when: "Before committing to prototyping — to surface weaknesses, hidden assumptions, and user risks that enthusiasm obscures. Run before any wireframes exist.",
    text: `You are an adversarial design reviewer. Your job is to find what's wrong with a concept before it goes into prototyping — while enthusiasm is still recoverable.

Share the concept you want challenged:
- What's it called?
- What does it do from the user's perspective?
- What makes it work — the core mechanism?
- What must be true for it to succeed?

Also share the problem statement, primary persona (including their current tools and workarounds), and any relevant research findings. Paste or upload.

I'll run five lenses:

User reality check — acting as the persona, I'll challenge on mental model fit, workflow integration, trust signals, and a realistic scenario where it breaks.

Assumption audit — every assumption across desirability / feasibility / viability / usability. Risk rating (Critical / Major / Minor) and evidence (Validated / Partial / None). Top 3 ranked.

Adversarial review — three objections, each made as strong as possible: skeptical engineer (technical feasibility), risk-averse PM (scope and failure scenarios), resistant user (busiest, most change-averse version of the persona).

Competitive displacement — why would the persona switch? What's the switching cost? At what point does value outweigh cost?

Failure modes in normal use — including "works as designed but user still doesn't get value."

Verdict: Proceed / Refine / Reframe? If refine — I'll provide the improvement.`,
  },
  {
    id: "write-storyboard",
    name: "Write a Concept Storyboard",
    phase: "03",
    group: "Develop",
    skill: "storyboarding.md",
    when: "After selecting a concept — to visualize the experience step by step before wireframing. Surfaces forced design decisions and prototype questions before any screens are built.",
    text: `You are a senior experience designer helping a team visualize a concept before wireframing begins.

Share the concept you want storyboarded:
- What's it called and what does it do from the user's perspective?
- What makes it work — the core mechanism?

Also share:
- The persona (name, role, context, goal)
- The specific scenario trigger — what event starts this experience?
- The top risk from any critique work — the assumption most likely to fail

If you have a concept card, critique output, or storyboard brief, upload or paste it.

I'll generate a 6–8 scene storyboard. For each scene:
- A specific title (e.g. "The realization hits at 4pm" — not "Step 3")
- What happens — observable action, what a camera would capture
- What the persona thinks — first-person, specific to their situation
- What the persona feels — emotion and intensity
- The interface — what they see and interact with (functional, not visual)

Rules I'll follow:
- Every scene is grounded in research pain points
- Scene 3–4 is the highest-risk moment — more detail than others
- The final scene shows emotional resolution, not just task completion
- No visual design descriptions — only function and experience

After the scenes: emotional arc table, arc narrative, forced design decisions, and the three questions the prototype must answer.`,
  },
  {
    id: "write-ux-copy",
    name: "Write Copy for a Flow",
    phase: "04",
    group: "Build",
    skill: "ux-copy-writing.md",
    when: "When a prototype or feature needs real copy before testing — or when placeholder text is blocking meaningful stakeholder feedback.",
    text: `You are a senior UX writer helping a designer write complete interface copy for a specific flow.

Tell me about the product and the flow you need copy for:
- What does the product do and who uses it?
- What screens or steps make up this flow?

Share the voice brief if you have one — or describe the brand personality in 3 adjectives, what the tone sounds like, and what it doesn't sound like. If you have wireframes, a flow diagram, or existing copy drafts, upload or paste them.

For each screen, I'll write:
- Headline — primary message, user benefit, 7 words or fewer, present tense, active voice
- Body — supporting context, 1–2 sentences max (only if the headline needs it)
- Primary CTA — verb + noun, specific (never just "Continue" or "Next")
- Secondary actions — back, skip, or alternative path text
- Form labels — sentence case, noun phrase, no colons
- Helper text — what it does for the user, not just what the field is
- Placeholder text — example data, never a restated label

Rules I'll apply: every CTA is verb + noun; headlines lead with user benefit; no passive voice; plain language readable by a non-expert.`,
  },
  {
    id: "write-error-states",
    name: "Write Error + Empty States",
    phase: "04",
    group: "Build",
    skill: "ux-copy-writing.md",
    when: "When a prototype needs a complete failure mode library — before usability testing, before dev handoff, or when error copy has been deferred and needs to be written quickly.",
    text: `You are a senior UX writer helping a designer complete the failure mode copy library for a product.

Tell me about the product and the voice:
- What does it do and who uses it?
- How should the voice handle errors — what's the tone when things go wrong?

Share the flow context — which screens or features need error and empty state coverage. Upload wireframes or flow documentation if you have them.

I'll write using the error message formula: [What happened] + [Why, if actionable] + [What to do].

Error States — headline + body + primary action + secondary action for:
1. Network / connection failure
2. Form validation — field level (inline)
3. Form validation — form level (summary)
4. Permission denied
5. Not found
6. Timeout
7. 2 product-specific errors I'll infer from your flow

Empty States — headline + body + primary CTA for:
1. First use (most important)
2. Search returned no results
3. Filtered list is empty
4. User cleared or deleted everything

Confirmation dialogs — for each irreversible action:
- Headline (what's about to happen — never "Are you sure?")
- Body (consequence in plain language)
- Confirm CTA (the action — not "Yes")
- Cancel

Rules: never say just "Error"; never blame the user; always give a next step.`,
  },
  {
    id: "map-user-flow",
    name: "Map a User Flow",
    phase: "04",
    group: "Plan",
    skill: "user-flow-mapping.md",
    when: "Before wireframing a new feature — to define what screens need to exist, including error states and edge cases, before building any of them.",
    text: `You are a senior interaction designer helping a team map a user flow completely before wireframing.

Tell me about the flow:
- Where does it start — what's the specific trigger?
- What is the user trying to accomplish?
- Who is the user — what context do they bring and what do they already know?
- Are there any technical, permission, or system constraints?

Share any flow diagrams, feature specs, or existing documentation you have — paste or upload.

I'll map the complete flow:

Happy path — every step as: [Step N]: [User or System] — [Action or Response]. Every decision point flagged with → Decision. Every variable system response flagged with → Variable.

Decision points + branches — for each decision, all branches mapped with condition, steps, and outcome.

Error states — for each async operation or user input: what can go wrong, what triggers it, what the user sees, what they can do, whether progress is preserved. Covers: network failure, validation, permission denied, not found, timeout.

Screen inventory — every unique state in a table: Screen name / Type / Triggered by / Primary action / Leads to. Grouped by: Happy path / Alternative paths / Error states / Empty states.

Closes with a total screen count and recommended v1 prototype scope.`,
  },
  {
    id: "heuristic-review",
    name: "Run a Heuristic Review",
    phase: "04",
    group: "Review",
    skill: "heuristic-review.md",
    when: "Before a usability test — to fix obvious problems so testing surfaces deeper insights. Also useful before a stakeholder review or dev handoff.",
    text: `You are a senior UX designer running a heuristic evaluation before a usability test.

Describe what you're reviewing:
- Who is the user — what do they know, what do they expect, what are they trying to accomplish?
- What's the task you're evaluating?
- Walk me through the screens — for each one, tell me what it contains, what actions are available, and what the user is trying to do there.

If you have screenshots or a prototype recording, upload them.

I'll evaluate against Nielsen's 10 usability heuristics:
1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition over recall
7. Flexibility and efficiency
8. Aesthetic and minimalist design
9. Error recovery
10. Help and documentation

For each heuristic: Rating (Pass / Partial / Fail) · Evidence (specific screen and element) · Severity (Critical / Major / Minor) · Fix (specific, actionable change).

Closes with a prioritized fix list: Fix before testing → Fix before stakeholder review → Fix before handoff.`,
  },
  {
    id: "draft-test-script",
    name: "Draft a Test Script",
    phase: "04",
    group: "Review",
    skill: "test-script-drafting.md",
    when: "At the end of Prototype — before usability testing begins. Write the script before the prototype is done so testing starts the moment it's ready.",
    text: `You are a senior UX researcher helping a team write a complete usability test script.

Tell me about the test:
- What prototype or feature are you testing?
- Who are you recruiting — role, context, experience level?
- How long is each session?
- What are the 2–3 key questions this test must answer?

Share the prototype brief, hypothesis list, or any existing script drafts — paste or upload.

I'll write a complete test script:

Introduction — read aloud to every participant. Covers: what we're testing (the prototype, not them), think-aloud instructions, "we didn't build this" framing, no wrong answers, recording consent, time commitment.

Warm-up questions — 3–5, all about past behavior in this domain. No opinions about what they're about to see.

Tasks — one per prototype question. Each task gets: a scenario (realistic context that explains why they'd do this), task statement (in the user's language, not the product's), starting screen, success criteria (observable behavior), and 2–3 probing prompts for when they're silent or stuck.

Probing questions — 8–10 questions after tasks about reasoning, violated expectations, and copy comprehension.

Debrief — 5-minute wrap: overall impression, comparison to current behavior, top 3 things that worked and didn't.

Observation guide — what to watch for at each critical moment, note-taking codes, timing column.`,
  },
  {
    id: "synthesize-findings",
    name: "Synthesize Session Notes",
    phase: "05",
    group: "Synthesize",
    skill: "usability-findings-synthesis.md",
    when: "After completing usability test sessions — to identify patterns, severity, and answers to prototype questions across participants. Use when not running the interactive Findings Synthesizer tool.",
    text: `You are a senior UX researcher helping a designer synthesize usability test session notes into structured findings.

Share your session notes — paste them here or upload the files. Use P1, P2, P3 codes for each participant. Raw notes are fine.

Tell me:
- How many participants total?
- What tasks did you test?
- What were the prototype questions — the hypotheses this test was designed to answer?

I'll work through the notes and produce:

Per prototype question:
- What users did (observable behaviors, cited by participant code)
- Success rate: N of N completed
- Where they struggled (specific moments with participant codes)
- Key quotes (verbatim)
- Answer: Yes / No / Partial + confidence level

Issue list — every distinct usability issue:
Issue · Task · Participants affected · Representative quote

Severity ratings — Critical (prevents completion) / Major (significant friction) / Minor (noticeable, low impact) / Cosmetic.

What worked — elements that tested well. These must not change in the next iteration.

Go / No-Go recommendation — Proceed / Iterate / Return to ideation, with the specific finding that drives the decision.`,
  },
  {
    id: "write-findings-report",
    name: "Findings Report",
    phase: "05",
    group: "Report",
    skill: "insight-report.md",
    when: "After synthesizing usability findings — to produce a shareable document that drives design decisions and stakeholder alignment.",
    text: `You are a senior UX researcher helping a designer write a complete usability test findings report.

Share what you have — session notes, a synthesis summary, or a findings list. Paste or upload. Tell me:
- What prototype or feature was tested?
- How many participants?
- What tasks were tested?
- What were the prototype questions?
- What's the go/no-go decision?

I'll write a complete findings report:

Executive summary — 3–5 sentences: what was tested, with whom, the single most important finding, and the decision.

Prototype question answers — for each question: Answer (Yes / No / Partial) · Evidence (N of N participants + key observation) · Confidence · Representative quote (verbatim, with participant code).

Critical findings — one section per finding: observation, direct quote, frequency, severity, why it matters, and a specific recommendation (not "improve X" — "change X to Y because Z").

Major findings — same format, briefer.

What worked — equal importance. For each success: element + success rate + why it matters to preserve.

Decision + next steps — rationale + 3 ordered next steps.`,
  },
  {
    id: "write-screener",
    name: "Write a Recruitment Screener",
    phase: "05",
    group: "Prepare",
    skill: "recruitment-screener.md",
    when: "Before scheduling usability test sessions — to define who qualifies and write screening questions that find the right participants without revealing what qualifies.",
    text: `You are a senior UX researcher helping a designer write a participant recruitment screener for usability testing.

Tell me about the test:
- What product or feature is being tested?
- Who is the target participant — what do they do, what context are they in, what behaviors matter?
- How many participants are you recruiting?
- What format are sessions — remote moderated, in-person, or unmoderated?
- How long is each session, and what's the compensation?

Share the persona or participant profile if you have one — paste or upload.

I'll produce:

Inclusion and exclusion criteria — in plain language before translating to questions.

Screener questions — 5–8 multiple-choice questions that don't reveal which answer qualifies.
Rules: never reveal which answer qualifies; disguise disqualifying answers among plausible options; ask about behavior frequency with ranges, not absolutes; never ask "Are you a [persona label]?" — ask about what they do.

Each question formatted as: Question text · Options · Qualifies if (internal note) · Disqualifies if (internal note).

Complete screener — intro paragraph, all questions, qualified close, disqualified close.`,
  },
  {
    id: "present-findings",
    name: "Present Findings to Stakeholders",
    phase: "05",
    group: "Report",
    skill: "stakeholder-presentation.md",
    when: "After writing the findings report — to reframe findings for audiences who weren't in the sessions and need different emphasis, depth, and decision framing.",
    text: `You are a senior UX researcher helping a designer communicate usability findings to a specific stakeholder audience.

Tell me:
- Who is the audience — Executive, Product Manager, Engineering Lead, or Design Team?
- What decision do they need to make based on these findings?
- What's the go/no-go recommendation?

Share the findings — paste your synthesis, findings list, or report. Upload session notes or a report document if you have them.

Once I understand the audience and findings, I'll reframe the report specifically for them:

Executive — 1 page max: what was tested, the key finding in plain language, business implication, the decision in one word + one sentence rationale, what you need from them. No methodology, no minor findings.

Product Manager — what was tested and what was being validated; which assumptions were confirmed vs. invalidated (each with evidence); roadmap implications; minimum changes before shipping; timeline impact.

Engineering Lead — structured list only, no narrative. Critical changes: component + current behavior + required behavior + user impact. Major changes: same format. What doesn't need to change. Questions with architectural implications.

Design Team — mental model findings; critical failures with behavioral root cause; what worked and why; surprising observations; open questions for next round.`,
  },
  {
    id: "write-iteration-brief",
    name: "Write an Iteration Brief",
    phase: "05",
    group: "Iterate",
    skill: "iteration-brief.md",
    when: "When the go/no-go decision is 'iterate' — to define exactly what changes to make, what to preserve, and what questions the next prototype must answer before starting any design work.",
    text: `You are a senior product designer helping a team define exactly what to change after a usability test — before any design work starts.

Share the findings from this test round — paste your synthesis, issue list, or findings report. Upload if you have the documents.

Tell me:
- What prototype was tested?
- How many participants?
- What tested well and should be preserved?

I'll produce an iteration brief in three tiers:

Preserve — do not change. For each element that worked: what it is, success rate evidence, why it matters to keep.

Change — Tier 1 (fix before next test): changes that directly affect prototype questions. Each change is specific enough to wireframe without interpretation. Linked directly to a Critical finding or prototype question.

Change — Tier 2 (fix in this iteration, don't re-test): Major findings that don't affect core prototype questions. Copy and label changes.

Change — Tier 3 (defer): Minor findings, cosmetic issues, changes requiring architectural rework.

Next prototype questions — what the next test needs to answer, with the observable behavior that confirms the fix worked.

What's stable — elements validated in this round, treated as fixed in the next iteration.`,
  },
  {
    id: "generate-component-spec",
    name: "Component Spec",
    phase: "06",
    group: "Specify",
    skill: "component-specs.md",
    when: "Before any developer handoff — when Figma has the visual design but behavioral documentation is missing. Use when not running the interactive Component Spec Generator tool.",
    text: `You are a senior design engineer helping a designer write a complete component specification for developer handoff.

Tell me about the component:
- What's it called and what does it do?
- Where does it appear in the product?
- What variants exist — sizes, styles, types?
- What design tokens does it use, if known?

Share Figma exports, screenshots, or any existing spec documentation — upload or paste.

I'll document all 8 categories:

1. Purpose + usage — what job this component does, when to use it, when not to use it and what to use instead
2. Anatomy — every element with name, type, required status, and constraints
3. Variants — what differs from default and when each applies
4. States — for each (Default / Hover / Focus / Active / Disabled / Loading / Error / Success / Empty): trigger, visual change, functional change, transition timing, screen reader announcement
5. Behavior — interaction table (trigger → response → duration → easing), keyboard interactions, focus management, reduced-motion behavior
6. Spacing + typography — internal padding, gaps, and typography per text element using token names
7. Accessibility — ARIA role, keyboard bindings, focus ring spec, screen reader announcements
8. Edge cases — long content, empty/no content, dark mode, high contrast, nested usage`,
  },
  {
    id: "write-handoff-annotations",
    name: "Write Handoff Annotations",
    phase: "06",
    group: "Annotate",
    skill: "handoff-annotation.md",
    when: "Before the developer handoff meeting — to annotate prototype screens with behavior notes, edge cases, and interaction explanations that aren't visible in the static design.",
    text: `You are a senior UX designer helping a team write handoff annotation content for developer implementation.

Tell me what you're annotating:
- What feature or flow is this?
- Which screens need annotation?

Share screenshots, a Figma export, or describe the screens — paste or upload what you have.

For each screen, I'll write the annotation content that a developer needs but can't see in the static design file:

Behavior notes — what happens when the user interacts with each element, how interactions work (trigger, response, timing), what state the screen is in when the user arrives.

Edge cases — what shows when content is empty, truncation rules for long text, how the screen behaves on the smallest supported viewport, any dark mode special treatment.

Interaction specifications — entrance/exit animation (duration and easing), scroll behavior, minimum touch target sizes.

Open questions for developer — as checkboxes, every design decision not yet made that affects implementation, and every technical question where you need the developer's input.

What's NOT in scope — elements or interactions explicitly excluded from this build, to prevent scope creep.

All annotations describe behavior, not visual design — the Figma file handles visuals.`,
  },
  {
    id: "log-design-qa",
    name: "QA Issue Log",
    phase: "06",
    group: "QA",
    skill: "design-qa.md",
    when: "After engineering builds a feature and it's deployed to staging — to structure scattered QA notes into a severity-rated issue log that developers can action directly.",
    text: `You are a senior design engineer helping a designer structure implementation review notes into a clear, actionable issue log.

Share your QA notes — paste them in any format: scattered observations, Figma comments, screenshot descriptions, Slack messages. Raw and messy is fine.

Tell me:
- What feature or screens were reviewed?
- What environment was tested — staging build, device, browser?
- What's the agreed design spec? (Figma link, component spec, or describe it)

I'll structure every discrepancy between spec and implementation:

For each issue: short title · screen · element · what the spec says · what was implemented · specific fix required.

Severity rating:
- P0: Blocks launch — broken functionality, severe accessibility failure, complete deviation that breaks user task
- P1: Must fix before launch — significant visual deviation, wrong copy, missing state, layout broken on supported viewport
- P2: Fix post-launch (within one sprint) — minor visual discrepancy, spacing slightly off
- P3: Polish backlog — preference-level difference, low-visibility element

Launch recommendation based on P0 count: HOLD / APPROVED WITH CONDITIONS / APPROVED.

What passed — screens and elements that correctly match spec, to prevent unnecessary changes.

Closes with severity summary: P0: N / P1: N / P2: N / P3: N.`,
  },
  {
    id: "design-decision-record",
    name: "Write a Design Decision Record",
    phase: "06",
    group: "Annotate",
    skill: "design-decision-record.md",
    when: "At handoff and after major design reviews — to permanently document why key design choices were made. Almost never written under time pressure; Claude generates it from a conversation about the decisions.",
    text: `You are a senior product designer helping a team create a permanent record of why design choices were made.

Tell me about the feature and the decisions you want to document. You can either:
- Walk me through the decisions conversationally — I'll ask follow-up questions and structure the record
- Share existing notes, a design brief, or meeting notes — paste or upload, and I'll extract and structure the decisions from there

For each significant design decision, I'll document:

Context — why this decision needed to be made; what constraint or problem forced it.

Alternatives considered — each option with why it was rejected.

Decision — what was decided, specific and unambiguous.

Rationale — why this option over the others, referencing user research, technical constraints, or business requirements.

Tradeoffs accepted — what this decision gives up (honest about the downsides).

Future considerations — when this should be revisited and what would trigger a change.

I'll close the record with:
- Anti-patterns documented — directions explicitly rejected, so future designers don't revisit them without new information
- Open decisions — design questions intentionally deferred, with what information is needed to resolve them

The record documents why, not what — the Figma file documents what.`,
  },
  {
    id: "write-accessibility-annotations",
    name: "Write Accessibility Annotations",
    phase: "06",
    group: "Annotate",
    skill: "accessibility-annotation.md",
    when: "Before developer handoff — to document ARIA roles, keyboard navigation, focus order, and screen reader behavior for WCAG 2.1 AA compliance. Systematic application of known standards; Claude generates the annotation content.",
    text: `You are a senior accessibility specialist helping a designer write WCAG 2.1 AA annotation content for developer handoff.

Tell me what you're annotating:
- What feature or flow is this?
- Which components or screens need accessibility documentation?

Share screenshots, wireframes, or a Figma export — paste or upload what you have.

For each component, I'll document:

ARIA specification — role, label (if visible label is insufficient), described-by (if additional context is needed), live region (if content updates dynamically).

Keyboard behavior table — Tab / Enter / Space / Arrow keys / Escape — what each key does for this specific component.

Focus management — what the focus indicator looks like, where focus moves after each action, whether a focus trap is needed (modal or dialog), and where focus returns after dismissal.

Screen reader announcements — what gets read on focus (role + name + state), on action, on state change, and on error.

Color and contrast — text contrast (minimum 4.5:1 normal, 3:1 large), UI component contrast (minimum 3:1), and confirmation that information isn't conveyed by color alone.

Touch targets — minimum 44×44px confirmation, spacing between targets (minimum 8px), flagging anything smaller.`,
  },
];

// ── Deliverables map ─────────────────────────────────────────────────────────
const DELIVERABLES = [
  // Discover
  { phase: "01", name: "Research Brief",          type: "prompt", ref: "research-synthesizer",    label: "Research Synthesizer",           desc: "Turns raw interview notes and surveys into a structured brief with themes, pain points, and unmet needs.", output: "Shareable research brief" },
  { phase: "01", name: "Service Blueprint",       type: "prompt", ref: "service-blueprint",       label: "Service Blueprint Generator",    desc: "Maps the full experience across five swim lanes — exposing backstage failures invisible in a journey map.", output: "Current and/or future-state blueprint" },
  { phase: "01", name: "Competitive Analysis",    type: "prompt", ref: "competitive-snapshot",    label: "Competitive Snapshot Builder",   desc: "Audits competitors one by one using real web search, then synthesizes the landscape with differentiation opportunities.", output: "Competitive landscape + opportunity map" },
  { phase: "01", name: "Research Plan",           type: "prompt", ref: "plan-research",           label: "Plan Your Research",             desc: "Generates a complete research plan from a project brief — method recommendation, screener, timeline, and success criteria.", output: "Research plan ready to execute" },
  { phase: "01", name: "Interview Guide",         type: "prompt", ref: "interview-guide",         label: "Build an Interview Guide",       desc: "Writes a full discussion guide with warm-up, core questions, probes, and an observer notes template.", output: "Discussion guide + observer template" },
  { phase: "01", name: "HMW Statements",          type: "prompt", ref: "hmw-statements",          label: "Generate HMW Statements",        desc: "Converts research findings into ranked How Might We statements across five angles — ready to brief ideation.", output: "Prioritised HMW statement set" },
  // Define
  { phase: "02", name: "Problem Statement",       type: "prompt", ref: "problem-framing",         label: "Problem Framing",                desc: "Generates three framings (HMW / JTBD / User+Need+Insight), pressure-tests each, and recommends the strongest.", output: "Chosen, tested problem statement" },
  { phase: "02", name: "Journey Map",             type: "prompt", ref: "journey-mapping",         label: "Journey Mapping",                desc: "Produces a six-lane research-grounded journey map — actions, thoughts, emotions, pain points, workarounds, opportunities.", output: "Journey map with critical moments flagged" },
  // Ideate
  { phase: "03", name: "Concept Set",             type: "prompt", ref: "concept-generator",       label: "Concept Generator",              desc: "Generates concepts across five thinking angles including First Principles, Analogous, and Worst Idea First — breaking out of obvious directions.", output: "Named concept cards with strengths and risks" },
  { phase: "03", name: "Cluster Map",             type: "prompt", ref: "idea-clustering",         label: "Idea Clustering",                desc: "Groups a raw concept set by underlying strategic mechanism — not surface similarity — and maps tensions and gaps.", output: "Strategic landscape with recommended directions" },
  { phase: null, name: "Design System",           type: "tool",   ref: "design-system",           label: "Design System Studio",           desc: "Choose a theme, customize tokens, preview 14 core components live — export CSS with --apdf-* naming ready for Figma.", output: "Complete design system tokens + component previews" },
  // Prototype
  { phase: "04", name: "UX Copy",                 type: "prompt", ref: "ux-copy-writer",          label: "UX Copy Writer",                 desc: "Locks voice and tone first, then writes all flow copy, error states, empty states, and confirmations — grounded in the brief.", output: "Complete copy document for prototyping" },
  { phase: "04", name: "User Flow",               type: "prompt", ref: "user-flow-mapper",        label: "User Flow Mapper",               desc: "Maps the happy path, every branch, and every error state — producing a screen inventory and scoped prototype brief.", output: "Screen inventory + prototype brief" },
  { phase: "04", name: "Component Architecture",  type: "prompt", ref: "component-architecture",  label: "Component Architecture Planner", desc: "Takes your screen inventory and identifies every component, defines the variant matrix, and assigns design tokens before Figma opens.", output: "Ordered build list + token assignments" },
  { phase: "04", name: "Component State Spec",    type: "prompt", ref: "component-state",         label: "Component State Specifier",      desc: "Documents every state for one component — triggers, token deltas, transition timing, and Figma property setup.", output: "State spec + Figma property configuration" },
  { phase: "04", name: "Prototype Handoff",       type: "prompt", ref: "proto-handoff",           label: "Prototype Handoff Generator",    desc: "Documents decisions, surfaces gaps testers need to know about, ranks hypotheses by risk, and generates a Findings Synthesizer handoff block.", output: "Validate handoff block + ranked hypotheses" },
  // Validate
  { phase: "05", name: "Test Findings",           type: "prompt", ref: "findings-synthesizer",    label: "Findings Synthesizer",           desc: "Structures raw session notes, synthesizes patterns across participants, rates severity, and produces a Go/No-Go decision.", output: "Severity-rated issue list + Go/No-Go" },
  { phase: "05", name: "Findings Report",         type: "prompt", ref: "insight-report",          label: "Insight Report Generator",       desc: "Generates audience-specific versions of findings — engineering, executive, design team — plus an iteration brief for the next cycle.", output: "Three stakeholder reports + iteration brief" },
  // Deliver
  { phase: null, name: "Design Brief",            type: "prompt", ref: "brief",                   label: "Design Brief Generator",         desc: "Answers a few questions about your project and generates a Claude-ready brief — problem statement, phase roadmap, skill files, and a first prompt.", output: "Claude-ready project brief" },
  { phase: null, name: "Client Deck",             type: "prompt", ref: "deck",                    label: "Client Deck Builder",            desc: "Identifies the right deck type for your situation, then writes slide-by-slide structure with speaker notes and opening hook.", output: "Slide structure + speaker notes" },
  { phase: "06", name: "Component Spec",          type: "prompt", ref: "component-spec",          label: "Component Spec Generator",       desc: "Documents component anatomy, all interactive states, behavior, spacing, edge cases — complete enough for a developer to build without questions.", output: "Full component spec document" },
  { phase: "06", name: "QA Issue Log",            type: "prompt", ref: "design-qa",               label: "Design QA Logger",               desc: "Structures implementation review notes into a P0–P3 severity-rated issue log with an explicit launch recommendation.", output: "QA report + launch sign-off decision" },
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
      figma: "Claude can build concept boards, storyboard frames, and FigJam ideation boards directly in your file via Figma MCP.",
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
      figma: "Wireframing and prototyping live in Figma. Claude can scaffold frames, organize flows, and apply design system components directly in your file via MCP.",
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
      figma: "Most Deliver work lives in Figma. Claude can generate and place spec annotations, accessibility notes, and decision records directly in your file via MCP.",
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

// Figma brand-color F mark (official 5-segment logo, viewBox 0 0 38 57)
function FigmaIcon({ size = 10 }) {
  const w = Math.round(size * (38 / 57));
  return (
    <svg width={w} height={size} viewBox="0 0 38 57" fill="none" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M9.5 19H19V0H9.5C4.253 0 0 4.253 0 9.5 0 14.747 4.253 19 9.5 19Z" fill="#F24E1E"/>
      <path d="M19 0H28.5C33.747 0 38 4.253 38 9.5 38 14.747 33.747 19 28.5 19H19V0Z" fill="#FF7262"/>
      <path d="M9.5 38H19V19H9.5C4.253 19 0 23.253 0 28.5 0 33.747 4.253 38 9.5 38Z" fill="#A259FF"/>
      <path d="M19 28.5C19 23.253 23.253 19 28.5 19 33.747 19 38 23.253 38 28.5 38 33.747 33.747 38 28.5 38 23.253 38 19 33.747 19 28.5Z" fill="#1ABCFE"/>
      <path d="M19 38H9.5C4.253 38 0 42.253 0 47.5 0 52.747 4.253 57 9.5 57 14.747 57 19 52.747 19 47.5V38Z" fill="#0ACF83"/>
    </svg>
  );
}

// Claude spark mark — 4-pointed star in Claude orange
function ClaudeSparkIcon({ size = 10 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
      <path d="M8 0.5 L9.3 6.7 L15.5 8 L9.3 9.3 L8 15.5 L6.7 9.3 L0.5 8 L6.7 6.7 Z" fill="#DA7756"/>
    </svg>
  );
}

function SkillBadge({ surface }) {
  const labels = {
    "chat":             "Chat",
    "chat + code":      "Chat + Code",
    "code + figma mcp": "Figma MCP",
  };
  const label = labels[surface] || "Chat";
  const isFigma = surface === "code + figma mcp";
  return (
    <span style={{
      fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.08em", textTransform: "uppercase",
      padding: "2px 7px", borderRadius: 3,
      background: T.surface, border: `1px solid ${T.border}`, color: T.muted,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {isFigma ? <FigmaIcon size={9} /> : <ClaudeSparkIcon size={8} />}
      {label}
    </span>
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
      ← Home
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
        fontFamily: "'Inter', sans-serif",
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
  const [copiedMcp, setCopiedMcp] = useState(false);

  const cloneCmd = `git clone ${REPO}.git`;
  const mcpCmd = `claude mcp add apdf -- npx @apdf/mcp`;

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
        aria-expanded={open}
        aria-label="Setup checklist"
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
                      aria-label="Copy clone command"
                      style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: copied ? "#22C55E" : T.dim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {copied ? "✓" : "Copy"}
                    </button>
                  </div>
                )
              },
              {
                n: "④", label: "Add the APDF MCP (Claude Code users)",
                desc: "If you use Claude Code, add the framework as an MCP — 17 design tools available directly in your workflow with no API credits needed.",
                action: (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <code style={{ fontSize: 11, color: T.muted, fontFamily: "'JetBrains Mono', monospace", background: T.card, padding: "3px 8px", borderRadius: 4 }}>{mcpCmd}</code>
                    <button onClick={() => { navigator.clipboard.writeText(mcpCmd); setCopiedMcp(true); setTimeout(() => setCopiedMcp(false), 1800); }}
                      aria-label="Copy MCP install command"
                      style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: copiedMcp ? "#22C55E" : T.dim, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                      {copiedMcp ? "✓" : "Copy"}
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
function PhasePromptCard({ item }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const text = item.text || "";
  const desc = item.when || item.subtitle || "";

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <div style={{
        background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
        padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
        transition: "border-color 0.12s",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
        onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{item.name}</span>
        <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0, flex: 1 }}>{desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }}>
          <Mono color={T.dim} size={9}>{item.skill || ""}</Mono>
          <button onClick={() => setPopoverOpen(true)} style={{
            padding: "5px 12px", borderRadius: 5, flexShrink: 0,
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.06em", textTransform: "uppercase",
            background: "transparent", border: `1px solid ${T.border}`,
            color: T.muted, cursor: "pointer", transition: "all 0.12s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >View prompt</button>
        </div>
      </div>

      {popoverOpen && (
        <div onClick={() => setPopoverOpen(false)} style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
            width: "100%", maxWidth: 600, maxHeight: "80vh",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`, gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.3, marginBottom: 3 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{item.skill || item.group || ""}</div>
              </div>
              <button onClick={() => setPopoverOpen(false)} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 5, color: T.dim, cursor: "pointer", fontSize: 13, lineHeight: 1, padding: "4px 8px", flexShrink: 0, transition: "all 0.12s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.dim; }}
              >✕</button>
            </div>
            <pre style={{ flex: 1, overflowY: "auto", margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.muted, lineHeight: 1.72, whiteSpace: "pre-wrap", padding: "18px 20px" }}>{text}</pre>
            <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
              <button onClick={handleCopy} style={{ padding: "8px 20px", borderRadius: 6, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", border: `1.5px solid ${copied ? "#22C55E" : T.border}`, background: "transparent", color: copied ? "#22C55E" : T.muted, transition: "all 0.15s" }}>{copied ? "✓ Copied" : "Copy prompt"}</button>
            </div>
          </div>
        </div>
      )}
    </>
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
          /* ── Empty state ── */
          <div style={{ padding: "64px 0 48px", textAlign: "center" }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3A3A3A", marginBottom: 12 }}>Select a phase</div>
            <p style={{ fontSize: 13, color: "#4A4A4A", lineHeight: 1.65, maxWidth: 340, margin: "0 auto" }}>
              Choose a phase above to see its prompts, skills, and step-by-step guidance.
            </p>
          </div>
        ) : (
          /* ── Phase detail panel ── */
          <div style={{ padding: "24px 0 32px" }}>

            {/* Phase header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: p.color }}>{phase.id} — {phase.label}</span>
              </div>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, maxWidth: 600, margin: 0 }}>{phase.desc}</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
              {[
                { id: "prompts", label: "Prompts", count: phasePrompts.length + phaseTools.length },
                { id: "skills", label: "Skills", count: phaseSkills.length },
                { id: "how", label: "How to Use", count: null },
              ].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  padding: "6px 14px",
                  background: tab === t.id ? p.color + "18" : "transparent",
                  border: `1px solid ${tab === t.id ? p.color + "40" : T.border}`,
                  borderRadius: 6,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  color: tab === t.id ? p.color : T.dim,
                  cursor: "pointer", transition: "all 0.15s",
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
            {tab === "prompts" && (() => {
              const allItems = [
                ...phasePrompts.map(item => ({ ...item, _type: "prompt" })),
                ...phaseTools.map(item => ({ ...item, _type: "tool" })),
              ];
              if (allItems.length === 0) {
                return <div style={{ padding: "20px 0", textAlign: "center" }}><Mono color={T.dim}>No prompts yet for this phase</Mono></div>;
              }
              const groupOrder = [];
              const grouped = {};
              allItems.forEach(item => {
                const g = item.group || "Other";
                if (!grouped[g]) { grouped[g] = []; groupOrder.push(g); }
                grouped[g].push(item);
              });
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {groupOrder.map(groupLabel => (
                    <div key={groupLabel}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, whiteSpace: "nowrap" }}>{groupLabel}</span>
                        <div style={{ flex: 1, height: 1, background: T.border }} />
                        <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: T.dim }}>{grouped[groupLabel].length}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                        {grouped[groupLabel].map(item => <PhasePromptCard key={item.id} item={item} />)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Tab: Skills */}
            {tab === "skills" && (
              phaseSkills.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center" }}><Mono color={T.dim}>No skills yet for this phase</Mono></div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                  {phaseSkills.map(skill => (
                    <div key={skill.file} style={{
                      background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
                      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
                      transition: "border-color 0.12s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
                      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <Mono color={T.muted} size={11}>{skill.file}</Mono>
                        <SkillBadge surface={skill.surface} />
                      </div>
                      <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0, flex: 1 }}>{skill.desc}</p>
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <button onClick={() => setActiveSkill(skill)} style={{
                          padding: "5px 12px", borderRadius: 5, fontSize: 11,
                          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                          background: "transparent", border: `1px solid ${T.border}`, color: T.muted,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "55"; e.currentTarget.style.color = p.color; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                        >Preview</button>
                        <a href={skillUrl(skill)} download style={{
                          padding: "5px 12px", borderRadius: 5, fontSize: 11,
                          fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                          background: "transparent", border: `1px solid ${T.border}`, color: T.muted, textDecoration: "none",
                          transition: "all 0.15s",
                        }}>↓ Download</a>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeSkill && <SkillDrawer skill={activeSkill} onClose={() => setActiveSkill(null)} />}


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
                  <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, background: T.surface, border: `1px solid ${T.border}`, padding: "2px 7px", borderRadius: 3, flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 4 }}><FigmaIcon size={9} />Figma MCP</span>
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

      {/* Scenario cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
        {filtered.map((s) => (
          <div key={s.id} style={{
            background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
            padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8,
            transition: "border-color 0.12s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{s.title}</span>
              {s.type === "ai" && (
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: T.card, border: `1px solid ${T.border}`, color: T.muted, flexShrink: 0 }}>AI</span>
              )}
            </div>
            <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0, flex: 1 }}>{s.mission}</p>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {s.phases.map(ph => {
                const meta = T.phases[ph.key];
                return meta ? (
                  <span key={ph.key} style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: `${meta.color}14`, border: `1px solid ${meta.color}30`, color: meta.color }}>{meta.label}</span>
                ) : null;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
              <Mono color={T.dim} size={9}>{s.time}</Mono>
              <button onClick={() => setActiveScenario(s)} style={{
                padding: "5px 12px", borderRadius: 5, fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase",
                background: "transparent", border: `1px solid ${T.border}`, color: T.muted,
                cursor: "pointer", transition: "all 0.12s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
              >View scenario</button>
            </div>
          </div>
        ))}
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
              <h2 style={{ fontSize: 20, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: T.text, marginBottom: 6, lineHeight: 1.2 }}>{s.title}</h2>
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

// ── Deliverable card ──────────────────────────────────────────────────────────
function DeliverableCard({ d, borderColor, hoverColor, onOpenTool, getDelivPrompt }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isStudio = d.ref === "design-system";

  function handleCopy() {
    navigator.clipboard.writeText(getDelivPrompt(d));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <div style={{
        background: T.surface, border: `1px solid ${borderColor}`, borderRadius: 8,
        padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10,
        transition: "border-color 0.12s",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = hoverColor}
        onMouseLeave={e => e.currentTarget.style.borderColor = borderColor}
      >
        {/* Name */}
        <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.3 }}>{d.name}</span>

        {/* Description */}
        <p style={{ fontSize: 12, color: T.muted, lineHeight: 1.55, margin: 0 }}>{d.desc}</p>

        {/* Output — stacked label + value */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{
            fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim,
          }}>Output</span>
          <span style={{ fontSize: 12, color: "#C0C0C0", lineHeight: 1.4, fontWeight: 500 }}>{d.output}</span>
        </div>

        {/* Action row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 2 }}>
          <span style={{ fontSize: 11, color: T.dim, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label}</span>
          {isStudio ? (
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
          ) : (
            <button onClick={() => setPopoverOpen(true)} style={{
              padding: "5px 12px", borderRadius: 5, flexShrink: 0,
              fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.06em", textTransform: "uppercase",
              background: "transparent", border: `1px solid ${T.border}`,
              color: T.muted, cursor: "pointer", transition: "all 0.12s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
            >View prompt</button>
          )}
        </div>
      </div>

      {/* Prompt popover */}
      {popoverOpen && (
        <div
          onClick={() => setPopoverOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9000,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px 16px",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
              width: "100%", maxWidth: 600, maxHeight: "80vh",
              display: "flex", flexDirection: "column", overflow: "hidden",
            }}
          >
            {/* Popover header */}
            <div style={{
              display: "flex", alignItems: "flex-start", justifyContent: "space-between",
              padding: "18px 20px 16px", borderBottom: `1px solid ${T.border}`, gap: 12,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.3, marginBottom: 3 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{d.label}</div>
              </div>
              <button onClick={() => setPopoverOpen(false)} style={{
                background: "transparent", border: `1px solid ${T.border}`, borderRadius: 5,
                color: T.dim, cursor: "pointer", fontSize: 13, lineHeight: 1,
                padding: "4px 8px", flexShrink: 0, transition: "all 0.12s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.dim; }}
              >✕</button>
            </div>

            {/* Prompt text */}
            <pre style={{
              flex: 1, overflowY: "auto", margin: 0,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              color: T.muted, lineHeight: 1.72, whiteSpace: "pre-wrap",
              padding: "18px 20px",
            }}>{getDelivPrompt(d)}</pre>

            {/* Footer */}
            <div style={{ padding: "14px 20px", borderTop: `1px solid ${T.border}` }}>
              <button onClick={handleCopy} style={{
                padding: "8px 20px", borderRadius: 6,
                fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                cursor: "pointer", border: `1.5px solid ${copied ? "#22C55E" : T.border}`,
                background: "transparent", color: copied ? "#22C55E" : T.muted,
                transition: "all 0.15s",
              }}>{copied ? "✓ Copied" : "Copy prompt"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

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
  const [guideCopied, setGuideCopied] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const typeColor = { tool: "#22C55E", prompt: "#8B5CF6" };

  // Look up prompt text — checks TOOLS first, then PROMPTS
  function getDelivPrompt(d) {
    const tool = TOOLS.find(t => t.id === d.ref);
    if (tool?.text) return tool.text;
    const prompt = PROMPTS.find(p => p.id === d.ref);
    return prompt?.text || "";
  }

  const phaseItems = selected
    ? DELIVERABLES.filter(d => d.phase === selected)
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
          /* Empty state */
          <div style={{ padding: "64px 0 48px", textAlign: "center" }}>
            <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3A3A3A", marginBottom: 12 }}>Select a phase</div>
            <p style={{ fontSize: 13, color: "#4A4A4A", lineHeight: 1.65, maxWidth: 340, margin: "0 auto" }}>
              Choose a phase above to see every deliverable for that stage. Cross-phase deliverables are always visible below.
            </p>
          </div>
        ) : (
          /* Phase deliverable cards */
          <div style={{ padding: "20px 0 24px" }}>
            {/* Phase header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color, boxShadow: `0 0 7px ${meta.color}` }} />
              <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: meta.color }}>{selected} — {meta.label}</span>
              <span style={{ fontSize: 11, color: T.dim, fontFamily: "'JetBrains Mono', monospace" }}>
                {phaseItems.length} deliverable{phaseItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Cards */}
            {phaseItems.length === 0 ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                <Mono color={T.dim} size={11}>No deliverables in this phase</Mono>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
                {phaseItems.map(d => (
                  <DeliverableCard key={d.ref} d={d} borderColor={meta.border} hoverColor={meta.color + "60"} onOpenTool={onOpenTool} getDelivPrompt={getDelivPrompt} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cross-phase — always visible */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim }}>Cross-phase</span>
          <div style={{ flex: 1, height: 1, background: T.border }} />
          <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: T.dim }}>{DELIVERABLES.filter(d => d.phase === null).length} deliverable{DELIVERABLES.filter(d => d.phase === null).length !== 1 ? "s" : ""}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 10 }}>
          {DELIVERABLES.filter(d => d.phase === null).map(d => (
            <DeliverableCard key={d.ref} d={d} borderColor={T.border} hoverColor={T.borderHover} onOpenTool={onOpenTool} getDelivPrompt={getDelivPrompt} />
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
        <button onClick={onHome}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          style={{
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
    "chat":             { color: T.muted, bg: T.surface, border: T.border },
    "chat + code":      { color: T.muted, bg: T.surface, border: T.border },
    "code + figma mcp": { color: T.muted, bg: T.surface, border: T.border },
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
        display: "flex", flexDirection: "column", gap: 10,
        padding: "14px 16px", background: T.surface, borderRadius: 8,
        border: `1px solid ${T.border}`, transition: "border-color 0.15s",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
        onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
      >
        {/* File name + phase badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.muted, lineHeight: 1.4, wordBreak: "break-all" }}>{skill.file}</span>
          {skill.phase ? (
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: phaseColor, display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, padding: "2px 7px", borderRadius: 99, background: phaseColor + "14", border: `1px solid ${phaseColor}35`, whiteSpace: "nowrap" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: phaseColor, display: "inline-block" }} />
              {PHASE_META[skill.phase]?.label}
            </span>
          ) : (
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: T.dim, flexShrink: 0, opacity: 0.5 }}>Cross-phase</span>
          )}
        </div>

        {/* Surface badge */}
        <span style={{ alignSelf: "flex-start", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 99, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, display: "inline-flex", alignItems: "center", gap: 4 }}>
          {skill.surface === "code + figma mcp" ? <FigmaIcon size={9} /> : <ClaudeSparkIcon size={8} />}
          {skill.surface === "chat" ? "Chat" : skill.surface === "chat + code" ? "Chat + Code" : "Figma MCP"}
        </span>

        {/* Description */}
        <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, margin: 0, flex: 1 }}>{skill.desc}</p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <button onClick={() => setActiveSkill(skill)} style={{ padding: "5px 12px", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >Preview</button>
          <a href={url} download style={{ padding: "5px 12px", borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", background: "transparent", border: `1px solid ${T.border}`, color: T.muted, textDecoration: "none", whiteSpace: "nowrap", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >↓ Download</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif", color: T.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
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
            <div style={{ padding: "64px 0 48px", textAlign: "center" }}>
              <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#3A3A3A", marginBottom: 12 }}>Select a phase</div>
              <p style={{ fontSize: 13, color: "#4A4A4A", lineHeight: 1.65, maxWidth: 340, margin: "0 auto" }}>
                Choose a phase above to browse skill files for that stage.
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
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
          {content && (() => {
            const { intro, sections } = parseSkillSections(content);
            return (
              <div>
                {intro && <div style={{ marginBottom: sections.length ? 8 : 0 }}>{renderMarkdown(intro)}</div>}
                {sections.map((sec, i) => (
                  <SkillAccordionSection
                    key={i}
                    title={sec.title}
                    content={sec.content}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}

// ── Skill content: group H2s into 4 semantic buckets ─────────────────────────
const SKILL_GROUPS = [
  {
    key: "overview", label: "Overview",
    patterns: [/^when to use/i, /^the core principle/i, /^what claude needs/i,
               /^claude surface/i, /^prerequisites/i, /^how this playbook/i,
               /^before you start/i, /^how to use/i],
  },
  {
    key: "workflow", label: "Workflow",
    patterns: [/^step \d+/i, /^phase 0?\d/i],
  },
  {
    key: "templates", label: "Templates & Output",
    patterns: [/^output:/i, /^building the prototype/i, /^ux copy/i,
               /^touch &/i, /^micro-interaction/i, /^navigation pattern/i,
               /^component spec/i, /^platform-specific/i, /^web handoff/i,
               /^ios handoff/i, /^android handoff/i, /^developer handoff/i,
               /^design decision/i, /^release notes/i, /^design system doc/i,
               /^pre-delivery/i, /^accessibility audit/i, /^prototype spec/i],
  },
  {
    key: "handoff", label: "Quality & Handoff",
    patterns: [/^quality checklist/i, /^quality standards/i,
               /^phase handoff/i, /^handoff:/i, /^error handling/i],
  },
];

function parseSkillSections(text) {
  if (!text) return { intro: "", sections: [] };

  function getGroupKey(heading) {
    for (const g of SKILL_GROUPS) {
      if (g.patterns.some(p => p.test(heading.trim()))) return g.key;
    }
    return null; // inherit current bucket
  }

  const lines = text.split("\n");
  const intro = [];
  const sectionMap = {};   // key → { label, lines[] }
  const sectionOrder = []; // preserves insertion order
  let seenH2 = false;
  let currentKey = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      const heading = line.slice(3).trim();
      const key = getGroupKey(heading);
      seenH2 = true;

      if (key && key !== currentKey) {
        currentKey = key;
        if (!sectionMap[key]) {
          sectionMap[key] = { label: SKILL_GROUPS.find(g => g.key === key).label, lines: [] };
          sectionOrder.push(key);
        }
      } else if (!key && !currentKey) {
        // Unknown heading before any recognised group → Overview
        currentKey = "overview";
        if (!sectionMap["overview"]) {
          sectionMap["overview"] = { label: "Overview", lines: [] };
          sectionOrder.push("overview");
        }
      }
      if (currentKey && sectionMap[currentKey]) sectionMap[currentKey].lines.push(line);
    } else if (seenH2 && currentKey && sectionMap[currentKey]) {
      sectionMap[currentKey].lines.push(line);
    } else if (!seenH2) {
      intro.push(line);
    }
  }

  return {
    intro: intro.join("\n"),
    sections: sectionOrder.map(key => ({ title: sectionMap[key].label, content: sectionMap[key].lines.join("\n") })),
  };
}

function SkillAccordionSection({ title, content, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: `1px solid ${T.border}` }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          padding: "11px 0", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: open ? T.text : T.muted, transition: "color 0.15s", lineHeight: 1.3 }}>{title}</span>
        <span style={{
          fontSize: 10, color: T.dim, flexShrink: 0,
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
          display: "inline-block",
        }}>▾</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 20 }}>
          {renderMarkdown(content)}
        </div>
      )}
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
      elements.push(<h1 key={`h1-${i}`} style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 600, color: "#F2F2F2", marginBottom: 10, marginTop: 8, lineHeight: 1.15 }} dangerouslySetInnerHTML={{ __html: inlineFormat(line.slice(2)) }} />);
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
        a { color: inherit; }
        img, video { max-width: 100%; height: auto; }
        :focus-visible { outline: 2px solid #F2F2F2; outline-offset: 2px; border-radius: 4px; }
        button:focus:not(:focus-visible), a:focus:not(:focus-visible) { outline: none; }
        .path-grid-item:focus-visible { outline: 2px solid #F2F2F2; outline-offset: -2px; z-index: 1; }
        .setup-path-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
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
        @media (max-width: 768px) {
          .how-grid { grid-template-columns: 1fr; }
          .ways-explainer-grid { grid-template-columns: 1fr 1fr; }
          .setup-path-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .setup-path-grid { grid-template-columns: 1fr; }
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
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 600, lineHeight: 1.05,
              color: T.text, marginBottom: 16, letterSpacing: "-0.3px",
            }}>
              A system for using <span style={{ color: "#D97706" }}>Claude</span> <span style={{ fontSize: "0.45em", verticalAlign: "middle", color: T.dim }}>+</span> <span style={{ color: "#9B59F7" }}>Figma</span><br />
              <em style={{ fontStyle: "italic", color: T.muted }}>across every phase of product design.</em>
            </h1>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, maxWidth: 600, marginBottom: 0 }}>
              From research through delivery — skills, tools, and prompts built around Claude and Figma working together.
            </p>
          </div>
        )}

        {/* Setup block — always visible on home, hidden once a path is chosen */}
        {!activePath && <SetupBlock onOpenFigmaGuide={() => setShowFigmaGuide(true)} />}

        {/* Path chooser — home only */}
        {!activePath && (
          <>
            <div style={{ marginBottom: 20 }}>
              <Mono color={T.dim} size={12}>How do you want to start?</Mono>
            </div>
            <div className="path-grid" style={{
              marginBottom: 0,
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
              ].map((item) => (
                <button
                  key={item.id}
                  className="path-grid-item"
                  onClick={() => setActivePath(item.id)}
                  style={{
                    background: T.surface, border: "none",
                    padding: "20px 20px 18px", textAlign: "left",
                    cursor: "pointer", transition: "background 0.15s",
                    borderBottom: "2px solid transparent",
                    display: "flex", flexDirection: "column",
                  }}
                  aria-label={item.label}
                  onMouseEnter={e => e.currentTarget.style.background = T.card}
                  onMouseLeave={e => e.currentTarget.style.background = T.surface}
                >
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.dim }} />
                    <span style={{
                      fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted,
                    }}>{item.label}</span>
                  </div>
                  <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.6, margin: 0, flex: 1 }}>{item.desc}</p>
                  <span style={{
                    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    color: T.muted, marginTop: 14, display: "block",
                  }}>{item.cta}</span>
                </button>
              ))}
            </div>

            {/* Design System Studio callout */}
            <div style={{
              marginTop: 10,
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              background: T.surface,
              padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: T.dim, background: T.card, border: `1px solid ${T.border}`, padding: "2px 8px", borderRadius: 3 }}>Interactive Tool</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text, fontFamily: "'DM Sans', sans-serif" }}>Design System Studio</span>
                <span style={{ fontSize: 12, color: T.dim, lineHeight: 1.5 }}>Build, audit, and export a complete token-based design system with live component previews.</span>
              </div>
              <button
                onClick={() => setActiveTool("design-system")}
                style={{
                  padding: "7px 16px", borderRadius: 7, flexShrink: 0,
                  fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                  background: "transparent", border: `1px solid ${T.border}`,
                  color: T.muted, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
              >Open Studio →</button>
            </div>
          </>
        )}

        {/* Page header — shown when a path is active */}
        {activePath && (() => {
          const pages = {
            phase:       { title: "Start with a Phase",       desc: "Six phases. Three artifact types. One continuous workflow. Each phase produces artifacts that feed the next." },
            ways:        { title: "Ways to Work",             desc: "Each scenario maps a full design challenge — from a design sprint to a complete design system build — to a path through the framework." },
            deliverable: { title: "Start with a Deliverable", desc: "Know what you need to produce. Find the right prompt for that deliverable — or open the Design System Studio if that's your output." },
          };
          const pg = pages[activePath];
          return (
            <div style={{ marginBottom: 40 }}>
              <h2 style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 600,
                color: T.text, lineHeight: 1.1, marginBottom: 14, letterSpacing: "-0.2px",
              }}>{pg.title}</h2>
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.65, maxWidth: 560, margin: 0 }}>{pg.desc}</p>
            </div>
          );
        })()}

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
