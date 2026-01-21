import { AIReasoningInput } from "./types";

export function buildPrompt(data: AIReasoningInput): string {
  return `
You are a DeFi strategy analyst AI.

Analyze the following strategy and respond in JSON format.

GOAL:
${data.goal}

RISK PROFILE:
${data.riskProfile}

STRATEGY:
${JSON.stringify(data.plan, null, 2)}

SIMULATION:
${JSON.stringify(data.simulation, null, 2)}

Return ONLY valid JSON:

{
  "summary": "...",
  "strengths": ["...", "..."],
  "risks": ["...", "..."],
  "recommendation": "proceed | caution | reject"
}
`;
}
