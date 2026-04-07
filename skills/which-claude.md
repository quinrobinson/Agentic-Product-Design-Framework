---
name: which-claude
phase: all
description: >
  Route every design task to the right Claude surface — Chat, Cowork, or Code. Use this skill
  before starting any session if you're unsure which Claude to open. Triggers include any
  question about where to run a workflow, whether to use the browser or terminal, how to
  connect Figma, or when a task isn't working as expected. This is the first skill to read
  when onboarding to the framework.
ai_leverage: high
---

# Which Claude? — Surface Routing Guide

Before uploading a skill file or starting a session, open the right Claude. Using the wrong
surface is the #1 reason workflows stall — not skill gaps, not prompting mistakes.

---

## The Three Surfaces

### Claude Chat — `claude.ai`
**What it is:** A browser-based or mobile conversation interface. No setup required.

**Best for:**
- All skill-file-based workflows (research synthesis, problem framing, concept generation, etc.)
- Uploading transcripts, CSVs, PDFs, or images for analysis
- Generating content, copy, documentation, and design briefs
- Talking through design decisions and getting structured recommendations
- Running the AI Brief Generator, Brand Style Builder, and Design System Audit tools on the live site
- Phase Handoff Blocks — generating and pasting between sessions
- **Figma Make prompts** — after completing concept generation or storyboarding in a session, ask Claude to synthesize a Figma Make prompt from the session context. Claude already has your concept cards, persona, and scenario — just ask by concept name. Copy the output and paste directly into Figma Make. No setup required.

**Not for:**
- Operating Figma directly (use Claude Code + Figma MCP)
- Running terminal commands or Git operations
- Accessing your local file system

**How to start:** Go to [claude.ai](https://claude.ai) → New conversation → Upload your skill file → Begin.

---

### Claude Cowork — Desktop App
**What it is:** A downloadable desktop application that can observe and control your screen,
browser, and apps — it sees what you see and can click, type, and navigate on your behalf.

**Best for:**
- Automating repetitive browser tasks (filling forms, organizing tabs, navigating complex UIs)
- Screen-aware workflows where Claude needs to observe your current state
- Tasks that require switching between multiple open applications
- Reviewing live prototypes or staging environments with Claude watching alongside

**Not for:**
- Deep file system operations or Git commands (use Claude Code)
- Figma MCP integration (use Claude Code)
- Pure text analysis and generation (Claude Chat is faster and simpler)

**How to start:** Download the Claude desktop app → Open it alongside your browser or app
→ Give screen access permission when prompted → Describe what you want Claude to help automate.

---

### Claude Code — Terminal
**What it is:** A command-line AI agent that runs inside your terminal. Has direct access to
your local file system, can execute code, manage Git, and connect to MCP servers like Figma.

**Best for:**
- **Figma MCP workflows** — this is the only surface that supports direct Figma integration
- Editing, committing, and pushing files to GitHub
- Running build scripts, linters, or test suites
- Generating and writing code files to disk (components, tokens, configs)
- Working with design tokens — exporting, transforming, syncing CSS/JSON files
- Any workflow in the `figma-playbook.md` skill

**Not for:**
- Conversational design thinking (use Claude Chat)
- Tasks that don't involve your local file system or a terminal

**How to start:** Install Claude Code via `npm install -g @anthropic-ai/claude-code` →
Open your terminal in your project directory → Run `claude` → You're in a session.

---

## Quick Decision Table

| Task | Surface |
|------|---------|
| Synthesize interview transcripts | Claude Chat |
| Write a HMW problem statement | Claude Chat |
| Generate concept directions | Claude Chat |
| Build an accessibility audit | Claude Chat |
| Write component specs for handoff | Claude Chat |
| Use the AI Brief Generator (live site) | Claude Chat |
| Use the Design Process System (live site) | Claude Chat |
| Generate a Phase Handoff Block | Claude Chat |
| Generate a Figma Make prompt from a session | Claude Chat |
| Create frames and boards directly in Figma | Claude Code + Figma MCP |
| Scaffold components in Figma | Claude Code + Figma MCP |
| Sync design tokens to CSS/JSON files | Claude Code |
| Push skill files or artifacts to GitHub | Claude Code |
| Automate a browser-based task | Claude Cowork |
| Review a live prototype with Claude watching | Claude Cowork |
| Navigate a complex web UI with AI assistance | Claude Cowork |

---

## Figma Integration — Which Surface?

This is the most common point of confusion. Here's the clear rule:

| What you want | Surface | Why |
|---|---|---|
| **Claude to think about Figma** — naming conventions, structure, component strategy | Claude Chat | No MCP needed; pure reasoning |
| **Claude to generate a Figma Make prompt** — synthesize session context into a ready-to-paste Make prompt | Claude Chat | Claude already has the context from the session; no MCP needed |
| **Claude to work inside Figma** — create frames, build components, update tokens | Claude Code + Figma MCP | Figma MCP only connects via Claude Code |
| **Claude to navigate Figma in the browser** — click around, read content | Claude Cowork | Screen awareness; but no deep Figma API access |

> **Rule of thumb:** If you want Claude to *create or modify* Figma content, use Claude Code.
> If you want Claude to *think or advise* about Figma content, use Claude Chat.

---

## Surface × Phase Matrix

| Phase | Primary Surface | When to Add Claude Code |
|-------|----------------|------------------------|
| 01 — Discover | Claude Chat | Pulling research files from local disk |
| 02 — Define | Claude Chat | Exporting journey maps to Figma |
| 03 — Ideate | Claude Chat | Building concept wireframes in Figma |
| 04 — Prototype | Claude Chat + Claude Code | Generating component code or building in Figma |
| 05 — Validate | Claude Chat | Writing test findings back to Figma boards |
| 06 — Deliver | Claude Chat + Claude Code | Pushing tokens, generating handoff docs, Figma annotations |

---

## Setup Requirements by Surface

### Claude Chat
- A claude.ai account (Free, Pro, or Team)
- No installation required
- Skill files uploaded per conversation

### Claude Cowork
- Claude desktop app downloaded and installed
- Screen recording permission granted
- Works best on macOS and Windows

### Claude Code
- Node.js installed (`node --version` to verify)
- Claude Code installed: `npm install -g @anthropic-ai/claude-code`
- For Figma MCP: Figma desktop app (not browser) + MCP configured
- Verify: `claude --version` and `claude mcp list`

---

## If Something Isn't Working

| Symptom | Likely cause | Fix |
|---|---|---|
| Claude can't "see" my Figma file | Using Claude Chat, not Claude Code | Switch to terminal, run `claude`, connect Figma MCP |
| Figma MCP commands aren't running | Claude Desktop chat, not Claude Code | Claude Code is `claude` in terminal — not the desktop chat window |
| Claude can't read my local files | Using Claude Chat | Switch to Claude Code in terminal from your project directory |
| Claude can't click things on screen | Using Claude Chat | Switch to Claude Cowork desktop app |
| Skill file workflow feels slow | Using Claude Code for text tasks | Claude Chat is faster for reasoning and generation |
