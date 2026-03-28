# AI × UX Design Process — Skills Library

A collection of Claude skills for every phase of the product design process. Each skill provides structured workflows, templates, and quality checklists that can be used directly with Claude or as reference documentation for your design practice.

## Skills by Phase

### 01 — Discover
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| User Research | `01-discover/user-research.md` | High | Synthesize raw research into structured insights, plan studies, create interview guides |
| Competitive Analysis | `01-discover/competitive-analysis.md` | High | Map competitive landscapes, benchmark features, identify differentiation opportunities |

### 02 — Define
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Problem Framing | `02-define/problem-framing.md` | Medium | Frame problems with HMW/JTBD/user stories, journey mapping, requirements prioritization |

### 03 — Ideate
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Concept Generation | `03-ideate/concept-generation.md` | High | Five-Direction concepts, UI patterns, visual system directions, chart type selection |
| Visual Design Execution | `03-ideate/visual-design-execution.md` | High | **NEW** — Style selection, semantic color tokens, typography, spacing, motion, icon standards |

### 04 — Prototype
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Prototyping | `04-prototype/prototyping.md` | High | Functional prototypes, touch targets, interaction timing, gesture safety, platform QA |
| Accessibility Audit | `04-prototype/accessibility-audit.md` | High | **NEW** — WCAG 2.1 AA audit: web, iOS VoiceOver, Android TalkBack, touch, forms |

### 05 — Validate
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Usability Testing | `05-validate/usability-testing.md` | High | Plan tests, write scenarios, analyze results, heuristic evaluations |

### 06 — Deliver
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Design Delivery | `06-deliver/design-delivery.md` | High | Component specs, iOS/Android/Web handoff packages, DDRs, release notes |

### Cross-Phase
| Skill | File | AI Leverage | Description |
|-------|------|-------------|-------------|
| Design Systems | `design-systems.md` | High | Design system audit & M3 token documentation — cross-system comparison, Figma variable setup |
| Figma Playbook | `figma-playbook.md` | High | Execute design work directly in Figma via MCP — patterns for every phase |

---

## How to Use

### With Claude
1. Upload a skill file or paste its contents into your conversation
2. Describe your project context and what you need
3. Claude will follow the skill's workflow and output templates

### In Your Repo
```
skills/
├── README.md
├── design-systems.md
├── figma-playbook.md
├── 01-discover/
│   ├── user-research.md
│   └── competitive-analysis.md
├── 02-define/
│   └── problem-framing.md
├── 03-ideate/
│   ├── concept-generation.md
│   └── visual-design-execution.md  ← NEW
├── 04-prototype/
│   ├── prototyping.md
│   └── accessibility-audit.md      ← NEW
├── 05-validate/
│   └── usability-testing.md
└── 06-deliver/
    └── design-delivery.md
```

## AI Leverage Levels

- **High** — AI handles the heavy lifting (synthesis, generation, documentation). You review, refine, and direct.
- **Medium** — AI assists with structure and drafts. You bring judgment, context, and strategic thinking.
- **Low** — Fundamentally human skills (empathy, taste, stakeholder navigation). AI can support but not replace.

## Contributing

To add or modify skills:
1. Follow the frontmatter format (`name`, `phase`, `description`, `ai_leverage`)
2. Include structured templates with clear placeholders
3. Add a quality checklist at the end of every skill
4. Keep skills actionable — workflows, not theory
