# AI × UX Product Design Framework

A scalable, AI-integrated framework for product and UX design — from research through delivery. Built as a living system that evolves with your practice and scales with any project.

## What's Inside

### `/skills` — Claude Skill Files
Nine structured `.md` skill files — seven organized by phase, plus a cross-cutting Figma Playbook and a Design Systems skill. Each contains workflows, templates, quality checklists, and guidance for integrating AI into that part of the design process.

| Phase | Skill File | What It Does |
|-------|-----------|--------------|
| 01 — Discover | `user-research.md` | Research synthesis, interview guides, thematic coding, research briefs |
| 01 — Discover | `competitive-analysis.md` | Landscape mapping, feature benchmarks, UX pattern libraries |
| 02 — Define | `problem-framing.md` | HMW/JTBD/user stories, journey maps, MoSCoW prioritization, design briefs |
| 03 — Ideate | `concept-generation.md` | Five-Direction concept method, UI pattern recs, design system scaffolding |
| 04 — Prototype | `prototyping.md` | Functional prototypes, UX copy systems, WCAG audits, design QA |
| 05 — Validate | `usability-testing.md` | Test plans, task scenarios, findings synthesis, heuristic evaluations |
| 06 — Deliver | `design-delivery.md` | Component specs, dev handoff packages, design decision records, release notes |
| 03 / 06 | `design-systems.md` | **Design system audit & token documentation** — M3 naming, cross-system comparison, Figma variable setup |
| All Phases | `figma-playbook.md` | **Figma MCP integration** — execute design work directly in Figma from Claude |

### Figma Playbook (MCP Integration)

The `figma-playbook.md` is a companion skill that works alongside any phase skill. It maps every design deliverable to concrete Figma actions Claude can execute via the Figma MCP:

- **Discover** → Research findings boards, persona cards, competitive matrices
- **Define** → Journey maps, design briefs, requirements boards
- **Ideate** → Concept cards, wireframe scaffolding, pattern references
- **Prototype** → Component creation, screen layouts, design system tokens
- **Validate** → Findings visualization, heuristic evaluation boards
- **Deliver** → Spec annotations, component documentation, decision records

Use it by reading the phase skill + the playbook together. The phase skill defines *what* to create; the playbook defines *how* to create it in Figma.

### `/artifacts` — Interactive React Components
Four JSX artifacts that render as interactive tools:

- **`design-process-system.jsx`** — Clickable phase-by-phase system with AI prompts, skill docs, templates, and tool recommendations per phase
- **`design-tokens-system.jsx`** — Universal starter design system with tunable tokens, live component previews, presets, and AI-powered customization export
- **`design-system-checklist.jsx`** — Comprehensive audit checklist synthesized from Material Design 3, Atlassian, IBM Carbon, and Apple HIG — with Figma-ready prompts per item
- **`m3-token-reference.jsx`** — Interactive M3 token documentation for Button, Card, Text Field, and Navigation Bar — covers color roles, elevation, shape, typography, and spacing with Figma variable spec prompts

### Figma Template
**[AI × UX Design Process Template](https://www.figma.com/design/mrHuD7sY7h6uKSVndTSIQE)** — A 10-page Figma file you duplicate per project:
- Cover with project metadata
- Process Map overview
- 6 phase workspace pages (Discover → Deliver) with structured sections
- Design System token reference
- AI Toolkit with copy-ready prompts and skill file references

## The Design Process

```
Discover → Define → Ideate → Prototype → Validate → Deliver
   ↑                                              |
   └──────────── Iterate as needed ←──────────────┘
```

## How to Use

### With Claude
Upload any skill file to a Claude conversation, describe your project context, and Claude will follow the structured workflows and output templates.

### As Reference
Each skill contains markdown templates you can copy directly into your project documentation, quality checklists to verify work before advancing, and frameworks for structuring your thinking.

### Per Project
1. Duplicate the Figma template
2. Fill in the Cover page with project details
3. Work through each phase, referencing the skill files and AI Toolkit
4. Customize the Design System page for your client
5. Use the interactive artifacts for live previewing and exploration

## AI Leverage Levels

Each skill is tagged with an AI leverage level:

- **High** — AI handles the heavy lifting (synthesis, generation, documentation). You review, refine, and direct.
- **Medium** — AI assists with structure and drafts. You bring judgment, context, and strategic thinking.
- **Low** — Fundamentally human skills (empathy, taste, stakeholder navigation). AI supports but doesn't replace.

## Contributing

To add or modify skills:
1. Follow the frontmatter format (`name`, `phase`, `description`, `ai_leverage`)
2. Include structured templates with clear `[PLACEHOLDERS]`
3. Add a quality checklist at the end of every skill
4. Keep skills actionable — workflows, not theory

## License

MIT
