import { useState } from "react";

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

const REPO = "https://github.com/quinrobinson/Agentic-Product-Design-Framework";

const SKILL_META = {
  "research-planning.md": { phase: "01", leverage: "high", surface: "chat", desc: "Turns a project brief or business goal into a complete research plan and discussion guide — objectives, method selection, screener questions, timeline, and a ready-to-run interview guide." },
  "research-synthesis.md": { phase: "01", leverage: "high", surface: "chat", desc: "Transforms raw interview transcripts and notes into structured themes, insight statements, and ranked pain points using a step-by-step pipeline that prevents hallucination and preserves nuance." },
  "competitive-analysis.md": { phase: "01", leverage: "high", surface: "chat", desc: "Maps your competitive landscape across direct, indirect, and aspirational competitors — UX conventions, gaps, patterns worth stealing, and a primary differentiation opportunity." },
  "service-blueprint.md": { phase: "01", leverage: "high", surface: "chat", desc: "Generates current-state and future-state service blueprints from research data — mapping user actions, frontstage touchpoints, backstage processes, systemic gaps, and design principles across five swim lanes." },
  "insight-framing.md": { phase: "01", leverage: "high", surface: "chat", desc: "Sharpens research insights into prioritized How Might We statements using a scoring model — producing the top 5 HMW statements and a primary problem statement ready to open the Define phase." },
  "problem-framing.md": { phase: "02", leverage: "medium", surface: "chat", desc: "Converts fuzzy research into a sharp problem statement using HMW, JTBD, and user story framings — with assumptions surfaced and a prioritized requirements roadmap." },
  "concept-generation.md": { phase: "03", leverage: "high", surface: "chat", desc: "Generates five concept directions from conventional to moonshot, with chart type recommendations, UI pattern suggestions, and visual system scaffolding ready to paste into the Brand Style Builder." },
  "concept-proof.md": { phase: "03", leverage: "high", surface: "chat", desc: "Generates Figma Make prompts that turn written concept cards into throwaway interactive prototypes — so concept selection is grounded in tangible artifacts, not text descriptions." },
  "visual-design-execution.md": { phase: "03", leverage: "high", surface: "chat", desc: "Selects a visual style, builds a semantic color token architecture with light/dark pairing, defines type scale and spacing, and specifies motion timing and icon standards." },
  "prototyping.md": { phase: "04", leverage: "high", surface: "chat + code", desc: "Builds functional React or HTML prototypes with correct touch targets, interaction timing, gesture safety, UX copy, and a pre-delivery QA checklist across iOS, Android, and web." },
  "accessibility-audit.md": { phase: "04", leverage: "high", surface: "chat", desc: "Runs a systematic WCAG 2.1 AA audit — color contrast, keyboard navigation, focus management, screen reader behavior, and touch targets — with severity-ranked issues and specific fixes." },
  "usability-testing.md": { phase: "05", leverage: "high", surface: "chat", desc: "Plans moderated and unmoderated tests, writes non-leading task scenarios, and synthesizes raw session notes into a severity-ranked findings report with actionable recommendations." },
  "design-delivery.md": { phase: "06", leverage: "high", surface: "chat + code", desc: "Produces component specs, platform-specific handoff packages for iOS/Android/Web, design decision records, and release notes — everything a developer needs to build it right." },
  "design-systems.md": { phase: null, leverage: "high", surface: "chat + code", desc: "Audits any product against Material Design 3, Atlassian, IBM Carbon, and Apple HIG — then documents tokens using M3 naming conventions and sets up Figma variable collections." },
  "figma-playbook.md": { phase: null, leverage: "high", surface: "code + figma mcp", desc: "Gives Claude step-by-step Figma MCP execution patterns for every phase — research boards, journey maps, wireframes, components, spec annotations, and decision records in your file." },
  "figma-ds-export.md": { phase: null, leverage: "high", surface: "code + figma mcp", desc: "Exports --apdf-* tokens from the Design System Studio to Figma as three variable collections (Reference, System, Component), text styles, and optional component scaffolds." },
  "figma-ds-audit.md": { phase: null, leverage: "high", surface: "code + figma mcp", desc: "Audits an existing Figma design system via MCP — reads variables, styles, and components, then scores against Material, Atlassian, Carbon, and HIG criteria with a severity-rated gap analysis." },
  "phase-handoff.md": { phase: null, leverage: "high", surface: "chat", desc: "Generates a structured handoff block at the close of each phase that you paste into the next conversation — so Claude carries full project context across all six phases without re-briefing." },
  "skill-chaining.md": { phase: null, leverage: "high", surface: "chat", desc: "Chains all six phases into one continuous AI-assisted workflow using handoff blocks — turning separate Claude conversations into a single thread from research through delivery." },
};

const SKILLS = [
  { phase: "01", dir: "01-discover", files: ["research-planning.md", "research-synthesis.md", "competitive-analysis.md", "service-blueprint.md", "insight-framing.md"] },
  { phase: "02", dir: "02-define", files: ["problem-framing.md"] },
  { phase: "03", dir: "03-ideate", files: ["concept-generation.md", "concept-proof.md", "visual-design-execution.md"] },
  { phase: "04", dir: "04-prototype", files: ["prototyping.md", "accessibility-audit.md"] },
  { phase: "05", dir: "05-validate", files: ["usability-testing.md"] },
  { phase: "06", dir: "06-deliver", files: ["design-delivery.md"] },
  { phase: null, dir: "", files: ["design-systems.md", "figma-playbook.md", "figma-ds-export.md", "figma-ds-audit.md", "phase-handoff.md", "skill-chaining.md"] },
];

const PHASE_FILTERS = [
  { id: "all", label: "All skills" },
  { id: "01", label: "Discover" },
  { id: "02", label: "Define" },
  { id: "03", label: "Ideate" },
  { id: "04", label: "Prototype" },
  { id: "05", label: "Validate" },
  { id: "06", label: "Deliver" },
  { id: "cross", label: "Cross-phase" },
];

const RAW = "https://raw.githubusercontent.com/quinrobinson/Agentic-Product-Design-Framework/main/skills";

const ALL_SKILL_FILES = [
  { path: "01-discover/research-planning.md",      zipPath: "research-planning/SKILL.md" },
  { path: "01-discover/research-synthesis.md",     zipPath: "research-synthesis/SKILL.md" },
  { path: "01-discover/competitive-analysis.md",   zipPath: "competitive-analysis/SKILL.md" },
  { path: "01-discover/service-blueprint.md",      zipPath: "service-blueprint/SKILL.md" },
  { path: "01-discover/insight-framing.md",        zipPath: "insight-framing/SKILL.md" },
  { path: "02-define/problem-framing.md",           zipPath: "problem-framing/SKILL.md" },
  { path: "03-ideate/concept-generation.md",        zipPath: "concept-generation/SKILL.md" },
  { path: "03-ideate/concept-proof.md",             zipPath: "concept-proof/SKILL.md" },
  { path: "03-ideate/visual-design-execution.md",   zipPath: "visual-design-execution/SKILL.md" },
  { path: "04-prototype/prototyping.md",            zipPath: "prototyping/SKILL.md" },
  { path: "04-prototype/accessibility-audit.md",    zipPath: "accessibility-audit/SKILL.md" },
  { path: "05-validate/usability-testing.md",       zipPath: "usability-testing/SKILL.md" },
  { path: "06-deliver/design-delivery.md",          zipPath: "design-delivery/SKILL.md" },
  { path: "06-deliver/design-system-audit.md",      zipPath: "design-system-audit/SKILL.md" },
  { path: "design-systems.md",                      zipPath: "design-systems/SKILL.md" },
  { path: "figma-playbook.md",                      zipPath: "figma-playbook/SKILL.md" },
  { path: "figma-ds-export.md",                     zipPath: "figma-ds-export/SKILL.md" },
  { path: "figma-ds-audit.md",                      zipPath: "figma-ds-audit/SKILL.md" },
  { path: "phase-handoff.md",                       zipPath: "phase-handoff/SKILL.md" },
  { path: "skill-chaining.md",                      zipPath: "skill-chaining/SKILL.md" },
];

export default function SkillsLibrary({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [allState, setAllState] = useState("idle"); // idle | loading | done | error
  const [skillStates, setSkillStates] = useState({}); // { "user-research.md": "idle|loading|done|error" }

  function setSkillState(file, state) {
    setSkillStates(prev => ({ ...prev, [file]: state }));
  }

  async function buildSkillZip(JSZip, file, dir) {
    const slug = file.replace(".md", "");
    const filePath = dir ? `${dir}/${file}` : file;
    const res = await fetch(`${RAW}/${filePath}`);
    if (!res.ok) throw new Error(`Failed to fetch ${filePath}`);
    const text = await res.text();
    const zip = new JSZip();
    zip.folder(slug).file("SKILL.md", text);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadSingleSkill(file, dir) {
    setSkillState(file, "loading");
    try {
      const JSZip = (await import("https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm")).default;
      await buildSkillZip(JSZip, file, dir);
      setSkillState(file, "done");
      setTimeout(() => setSkillState(file, "idle"), 3000);
    } catch (e) {
      console.error(e);
      setSkillState(file, "error");
      setTimeout(() => setSkillState(file, "idle"), 3000);
    }
  }

  async function downloadAllSkills() {
    setAllState("loading");
    try {
      const JSZip = (await import("https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm")).default;
      for (const { path, zipPath } of ALL_SKILL_FILES) {
        const slug = zipPath.split("/")[0];
        const res = await fetch(`${RAW}/${path}`);
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        const text = await res.text();
        const zip = new JSZip();
        zip.folder(slug).file("SKILL.md", text);
        const blob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${slug}.zip`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise(r => setTimeout(r, 400)); // stagger to avoid browser blocking
      }
      setAllState("done");
      setTimeout(() => setAllState("idle"), 4000);
    } catch (e) {
      console.error(e);
      setAllState("error");
      setTimeout(() => setAllState("idle"), 3000);
    }
  }

  const allLabel = { idle: "Download all skills", loading: "Downloading…", done: `✓ All ${ALL_SKILL_FILES.length} downloaded`, error: "Download failed — retry" }[allState];
  const allDisabled = allState === "loading";

  const filteredSkills = SKILLS.filter(row => {
    if (activeFilter === "all") return true;
    if (activeFilter === "cross") return row.phase === null;
    return row.phase === activeFilter;
  });

  const totalFiles = SKILLS.reduce((sum, row) => sum + row.files.length, 0);

  return (
    <div style={{ minHeight: "100vh", background: DS.light, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Top bar */}
      <div style={{ background: DS.dark, borderBottom: `1px solid ${DS.darkBorder}`, padding: "0 40px", display: "flex", alignItems: "center", gap: 16, height: 56, position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: DS.darkCard, border: `1px solid ${DS.darkBorder}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, color: DS.bodyLight, fontFamily: "'JetBrains Mono', monospace" }}>← Back</button>
        <div style={{ width: 1, height: 20, background: DS.darkBorder }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: DS.white }}>Claude Skills Library</span>
        <span style={{ fontSize: 11, color: DS.bodyDark, fontFamily: "'JetBrains Mono', monospace" }}>{totalFiles} files</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={downloadAllSkills}
            disabled={allDisabled}
            style={{
              background: allState === "done" ? "#22C55E22" : allState === "error" ? "#EF444422" : "transparent",
              border: `1px solid ${allState === "done" ? "#22C55E" : allState === "error" ? "#EF4444" : DS.darkBorder}`,
              borderRadius: 8, padding: "6px 14px", cursor: allDisabled ? "default" : "pointer",
              fontSize: 11, color: allState === "done" ? "#22C55E" : allState === "error" ? "#EF4444" : DS.bodyLight,
              fontFamily: "'JetBrains Mono', monospace", opacity: allDisabled ? 0.6 : 1,
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}
          >
            {allLabel}
          </button>
          <a href={`${REPO}/tree/main/skills`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: DS.bodyLight, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", opacity: 0.5 }}>
            View on GitHub ↗
          </a>
        </div>
      </div>

      {/* Hero */}
      <div style={{ background: DS.dark, padding: "48px 60px 52px", borderBottom: `1px solid ${DS.darkBorder}` }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 4, textTransform: "uppercase", color: DS.bodyLight, opacity: 0.6, marginBottom: 16 }}>
            Agentic Product Design Framework
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 44, fontWeight: 600, color: DS.white, margin: "0 0 14px", lineHeight: 1.05 }}>
            Claude Skills Library
          </h1>
          <p style={{ fontSize: 14, color: DS.bodyLight, lineHeight: 1.75, margin: "0 0 32px", maxWidth: 560 }}>
            {totalFiles} structured skill files — one per design capability. Upload any file to a Claude conversation to activate that phase's workflow, templates, and quality checks.
          </p>

          {/* How to use */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "stretch", maxWidth: 760 }}>
            <div style={{ background: "#0B1120", border: "1px solid #1E293B", borderRadius: 12, padding: "16px 22px", display: "flex", alignItems: "flex-start", gap: 16, flex: "1 1 400px" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "#1E293B", border: "1px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: DS.bodyLight }}>↑</div>
              <div style={{ fontSize: 13, color: DS.bodyLight, lineHeight: 1.65 }}>
                <span style={{ color: DS.white, fontWeight: 600 }}>How to use: </span>
                Download individual skills as zips using the ↓ .zip button on each row, or download all 14 at once. Each zip contains one <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: "#1E293B", padding: "1px 5px", borderRadius: 4 }}>SKILL.md</code> — upload directly to Claude via Settings → Customize → Skills.
              </div>
            </div>
            <button
              onClick={downloadAllSkills}
              disabled={allDisabled}
              aria-label="Download all skills as zip files"
              style={{
                background: allState === "done" ? "#22C55E18" : allState === "error" ? "#EF444418" : "#0B1120",
                border: `1px solid ${allState === "done" ? "#22C55E55" : allState === "error" ? "#EF444455" : "#1E293B"}`,
                borderRadius: 12, padding: "16px 22px", cursor: allDisabled ? "default" : "pointer",
                fontSize: 12, color: allState === "done" ? "#22C55E" : allState === "error" ? "#EF4444" : DS.white,
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                opacity: allDisabled ? 0.7 : 1, transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {allState === "idle" && <span style={{ fontSize: 16 }}>↓</span>}
              {allState === "loading" && <span style={{ fontSize: 16 }}>⟳</span>}
              {allLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Filter + table */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 60px 80px" }}>

        {/* Phase filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {PHASE_FILTERS.map(f => {
            const p = DS.phases[f.id];
            const isActive = activeFilter === f.id;
            const color = p ? p.color : f.id === "cross" ? "#64748B" : "#0F172A";
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 999, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                  border: isActive ? `1.5px solid ${color}` : `1px solid ${DS.lightBorder}`,
                  background: isActive ? `${color}10` : DS.white,
                  color: isActive ? color : DS.bodyDark,
                  transition: "all 0.15s", outline: "none",
                }}
              >
                {p && <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, display: "block" }} />}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Skills card grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          {filteredSkills.flatMap(row => {
            const p = row.phase ? DS.phases[row.phase] : null;
            return row.files.map(file => {
              const meta = SKILL_META[file];
              const sState = skillStates[file] || "idle";
              const surfaceColor = meta?.surface?.includes("figma") ? "#F59E0B" : meta?.surface?.includes("code") ? "#3B82F6" : "#22C55E";
              return (
                <div key={file} style={{
                  background: DS.white, border: `1px solid ${DS.lightBorder}`, borderRadius: 12,
                  padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)", transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#CBD5E1"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = DS.lightBorder}
                >
                  {/* File name + phase badge */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <a
                      href={`${REPO}/tree/main/skills/${row.dir ? row.dir + "/" : ""}${file}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: "#0F172A", textDecoration: "none", lineHeight: 1.4, wordBreak: "break-all" }}
                    >{file}</a>
                    {p ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 999, background: `${p.color}12`, border: `1px solid ${p.color}40`, color: p.color, whiteSpace: "nowrap" }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: p.color }} />
                        {p.label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: DS.bodyDark, opacity: 0.4, flexShrink: 0 }}>Cross-phase</span>
                    )}
                  </div>

                  {/* Surface badge */}
                  {meta?.surface && (
                    <span style={{ alignSelf: "flex-start", fontSize: 9, fontFamily: "'JetBrains Mono', monospace", padding: "2px 8px", borderRadius: 999, background: `${surfaceColor}12`, color: surfaceColor, border: `1px solid ${surfaceColor}40`, whiteSpace: "nowrap" }}>
                      {meta.surface}
                    </span>
                  )}

                  {/* Description */}
                  {meta?.desc && (
                    <p style={{ fontSize: 12, color: DS.bodyDark, lineHeight: 1.65, margin: 0, flex: 1 }}>{meta.desc}</p>
                  )}

                  {/* Download */}
                  <button
                    onClick={() => downloadSingleSkill(file, row.dir)}
                    disabled={sState === "loading"}
                    style={{
                      alignSelf: "flex-start", marginTop: 4,
                      display: "inline-flex", alignItems: "center", gap: 6,
                      fontSize: 11, padding: "6px 14px", borderRadius: 8,
                      fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
                      cursor: sState === "loading" ? "default" : "pointer",
                      border: `1px solid ${sState === "done" ? "#22C55E88" : sState === "error" ? "#EF444488" : DS.lightBorder}`,
                      background: sState === "done" ? "#22C55E12" : sState === "error" ? "#EF444412" : "transparent",
                      color: sState === "done" ? "#22C55E" : sState === "error" ? "#EF4444" : DS.bodyDark,
                      opacity: sState === "loading" ? 0.5 : 1, transition: "all 0.2s",
                    }}
                  >
                    {sState === "loading" ? "⟳" : sState === "done" ? "✓" : sState === "error" ? "✕" : "↓"} Download .zip
                  </button>
                </div>
              );
            });
          })}
        </div>

        {/* Figma Community Skills */}
        <div style={{ marginTop: 48, borderTop: `1px dashed ${DS.lightBorder}`, paddingTop: 40 }}>
          <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 3, textTransform: "uppercase", color: DS.bodyDark, marginBottom: 16 }}>More skills from the community</div>
          <div style={{ background: DS.white, border: `1px dashed ${DS.lightBorder}`, borderRadius: 16, padding: "28px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 400px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Figma Community Skills</div>
              <p style={{ fontSize: 13, color: DS.bodyDark, lineHeight: 1.7, margin: "0 0 10px" }}>
                Additional AI-agent actions built and approved by the Figma community. These skills extend what Claude Code can do directly on the Figma canvas — beyond what's included in this framework.
              </p>
              <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: DS.bodyDark, opacity: 0.5, margin: 0 }}>
                Note: Figma Community Skills are Figma-native — they install in Figma, not as .md files.
              </p>
            </div>
            <a
              href="https://www.figma.com/community/skills"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 22px", borderRadius: 10,
                background: "#9B59F712", border: "1px solid #9B59F740",
                color: "#9B59F7", fontSize: 13, fontWeight: 600,
                textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
                transition: "background 0.15s, border-color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#9B59F720"; e.currentTarget.style.borderColor = "#9B59F780"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#9B59F712"; e.currentTarget.style.borderColor = "#9B59F740"; }}
            >
              Browse Figma Skills ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
