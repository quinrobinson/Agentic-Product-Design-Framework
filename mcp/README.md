# APDF MCP Server

18 MCP tools for Claude Code. Each tool receives your project inputs and returns a structured prompt that Claude processes using its own intelligence — no external API calls, no credentials required beyond your Claude subscription.

When a tool runs, the framework's hooks fire automatically: project context is injected before the call, and the output is persisted to `.apdf/artifacts/` after it.

---

## Prerequisites

- **Node.js 18 or later** — `node --version` to check
- **Claude Code** — the MCP server runs locally and communicates over stdio

---

## Installation

From the repo root:

```bash
cd mcp
npm install
npm run build
```

This compiles the TypeScript source to `mcp/dist/index.js`. The compiled output is what Claude Code runs.

---

## Configure Claude Code

Add the `mcpServers` block to `.claude/settings.json` in the repo root. The file already contains the hooks configuration — add `mcpServers` alongside it:

```json
{
  "mcpServers": {
    "apdf": {
      "command": "node",
      "args": ["./mcp/dist/index.js"]
    }
  },
  "hooks": {
    ...existing hooks config...
  }
}
```

The path `./mcp/dist/index.js` is relative to the repo root. Claude Code resolves it from `$CLAUDE_PROJECT_DIR`.

> **Already done for you.** If you cloned this repo and the `.claude/settings.json` already contains the `mcpServers` block, skip this step — just run `npm install && npm run build` in `/mcp/`.

---

## Verify the installation

Start a Claude Code session in the repo root. In a new conversation, ask:

```
List all available APDF MCP tools.
```

Claude Code will call `list_tools` on the server and return all 18 tool names. If you see `synthesize_research`, `frame_problem`, and `generate_handoff` in the list, the server is running correctly.

Alternatively, verify the compiled binary runs without errors:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node mcp/dist/index.js
```

A JSON response listing all 18 tools confirms the server is working.

---

## Tool reference

All 18 tools are available as `mcp__apdf__<tool_name>` in Claude Code. Required inputs are marked with `*`.

### Discover phase

| Tool | What it does | Required inputs |
|------|-------------|-----------------|
| `synthesize_research` | Synthesize research sessions into themes, insights, and design directions | `research_question`*, `session_notes`* |
| `build_competitive_snapshot` | Map the competitive landscape and surface opportunity gaps | `product`*, `design_question`* |
| `generate_service_blueprint` | Generate a 5-lane service blueprint across user, frontstage, backstage, and support | `persona`*, `goal`* |

### Define phase

| Tool | What it does | Required inputs |
|------|-------------|-----------------|
| `frame_problem` | Transform research findings into problem statements and HMW questions | `research_data`*, `persona`* |
| `map_journey` | Build a 6-lane journey map across stages, emotions, and opportunities | `persona`*, `goal`* |

### Ideate phase

| Tool | What it does | Required inputs |
|------|-------------|-----------------|
| `generate_concepts` | Generate 5 meaningfully distinct design concepts from a problem statement | `problem_statement`*, `persona`* |
| `cluster_ideas` | Cluster raw ideas into strategic themes and recommend the strongest direction | `concepts`*, `problem_statement`* |
| `generate_concept_proof` | Generate a Figma Make prompt for a clickable concept proof | `concept_name`*, `user_perspective`*, `key_mechanism`*, `key_assumption`* |

### Prototype phase

| Tool | What it does | Required inputs |
|------|-------------|-----------------|
| `map_user_flow` | Map a user flow including decision points, error states, and edge cases | `entry_point`*, `goal`* |
| `write_ux_copy` | Define voice and generate copy for a complete product flow | `product`*, `persona`*, `flow`* |

### Validate phase

| Tool | What it does | Required inputs |
|------|-------------|-----------------|
| `synthesize_findings` | Consolidate usability test notes into severity-rated structured findings | `tasks_tested`*, `session_notes`* |
| `generate_insight_report` | Generate a stakeholder-ready insight report from synthesized findings | `prototype_name`*, `synthesis`*, `decision_needed`* |

### Deliver phase

| Tool | What it does | Required inputs |
|------|-------------|-----------------|
| `plan_component_architecture` | Analyze a screen inventory and produce a full component breakdown | `screen_inventory`* |
| `specify_component_states` | Generate a complete state inventory for a component | `component_name`*, `component_type`* |
| `generate_component_spec` | Generate full component documentation for engineering handoff | `component_name`*, `description`* |
| `generate_handoff` | Generate a prototype handoff document with design decisions and open questions | `screens_built`*, `flows_covered`*, `problem_statement`* |
| `log_design_qa` | Structure raw QA observations into a severity-rated issue log | `feature`*, `raw_notes`* |
| `build_client_deck` | Build a structured client presentation outline with speaker notes | `project_name`*, `deck_goal`*, `desired_outcome`* |

---

## How tools connect to hooks

The `.claude/settings.json` hooks match on `mcp__apdf__.*` — any tool this server exposes. When you call a tool:

1. **PreToolUse** — `inject-context.sh` reads `.apdf/context.json` and injects your project's persona, phase, problem statement, and constraints into the tool call
2. **Tool runs** — Claude processes the structured prompt with full project context
3. **PostToolUse** — `persist-artifact.sh` writes the output to `.apdf/artifacts/<tool>-<timestamp>.md` and updates `index.md`

This means you never need to manually save outputs or re-establish context between sessions. Fill in `.apdf/context.json.example` (rename to `context.json`) once per project and the hooks handle the rest.

---

## Project context file

Copy `.apdf/context.json.example` to `.apdf/context.json` and fill it in before your first session:

```json
{
  "project_name": "Your project name",
  "phase": "01 — Discover",
  "persona": "Primary user persona",
  "problem_statement": "The problem this project is solving",
  "constraints": "Platform, timeline, technical constraints",
  "open_questions": "",
  "last_handoff": ""
}
```

The `last_handoff` field is updated automatically by `/transition` after a phase handoff.

---

## Troubleshooting

**Tools don't appear in Claude Code**
- Confirm `mcp/dist/index.js` exists — run `npm run build` in `/mcp/` if not
- Check `.claude/settings.json` has the `mcpServers` block with the correct path
- Restart the Claude Code session after editing `settings.json`

**`node: command not found`**
- Install Node.js 18+ from [nodejs.org](https://nodejs.org)

**`Cannot find module` error on server start**
- Run `npm install` in `/mcp/` before building

**Hooks fire but context.json is empty**
- Copy `.apdf/context.json.example` to `.apdf/context.json` and fill in `project_name`, `phase`, and `persona` at minimum

**`mcp/dist/index.js` exists but server crashes immediately**
- Run `node mcp/dist/index.js` directly and check the error output
- Most common cause: Node.js version below 18
