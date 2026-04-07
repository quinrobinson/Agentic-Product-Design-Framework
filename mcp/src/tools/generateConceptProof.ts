export const generateConceptProof = {
  schema: {
    name: "generate_concept_proof",
    description:
      "Generate a Figma Make prompt for a concept card, producing a throwaway interactive prototype that makes the concept's core mechanism clickable before concept selection. Use after concept-generation and before or during concept-critique.",
    inputSchema: {
      type: "object",
      properties: {
        concept_name: {
          type: "string",
          description: "The concept name (2–4 words)",
        },
        one_liner: {
          type: "string",
          description: "What the concept does from the user's perspective",
        },
        core_mechanism: {
          type: "string",
          description: "What makes the concept work — the key design decision",
        },
        key_assumption: {
          type: "string",
          description: "What must be true for this concept to work",
        },
        persona: {
          type: "string",
          description: "Brief description of the primary user and their context",
        },
        scenario: {
          type: "string",
          description:
            "The specific trigger and goal — what causes the user to engage with this concept and what they need to accomplish",
        },
        platform: {
          type: "string",
          description:
            "Target platform: 'web', 'iOS', 'Android', or 'responsive'",
        },
      },
      required: [
        "concept_name",
        "one_liner",
        "core_mechanism",
        "persona",
        "scenario",
      ],
    },
  },
  handler(args: Record<string, string>) {
    const {
      concept_name,
      one_liner,
      core_mechanism,
      key_assumption = "not specified",
      persona,
      scenario,
      platform = "web",
    } = args;

    return {
      content: [
        {
          type: "text",
          text: `You are generating a Figma Make prompt for a concept proof — a throwaway interactive prototype that makes a concept's core mechanism clickable. The goal is concept evaluation, not polish.

## Concept to Prototype

- **Concept name:** ${concept_name}
- **What it does:** ${one_liner}
- **Core mechanism:** ${core_mechanism}
- **Key assumption:** ${key_assumption}
- **Persona:** ${persona}
- **Scenario:** ${scenario}
- **Platform:** ${platform}

---

## Your Task

Generate a Figma Make prompt that will produce a 2–3 screen interactive prototype demonstrating this concept's core mechanism. The prompt will be pasted directly into Figma Make.

**Rules for the prompt you generate:**
1. Keep it under 150 words — Make works best with focused, specific prompts
2. Name 2–3 screens and describe what the user sees on each
3. Specify the key interaction — what the user does and what changes on screen
4. Use realistic placeholder content (no Lorem Ipsum) — use the persona's context to make content specific
5. Do NOT specify visual style, colors, fonts, or layout — Make will decide those; they don't matter for a concept proof
6. Focus on the core mechanism — the interaction that defines the concept
7. Call out the moment that demonstrates the key assumption — this is the screen that needs to work

**Output format:** Write the Figma Make prompt as a single clear paragraph or short structured prompt. Then add:
- **What this proof validates:** 1 sentence — which assumption the proof tests
- **What to look for:** 2–3 things to observe when clicking through the proof
- **What the proof can't show:** 1–2 aspects of the concept that still need written critique to evaluate`,
        },
      ],
    };
  },
};
