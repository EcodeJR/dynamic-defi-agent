import { AIReasoningInput } from "./types";

export function buildStrategyPrompt(data: AIReasoningInput): string {
  return `
You are a DeFi risk analysis AI.

Goal: ${data.goal}
Risk Profile: ${data.riskProfile}

Strategy:
${JSON.stringify(data.plan, null, 2)}

Simulation:
${JSON.stringify(data.simulation, null, 2)}

Provide:
1. Summary
2. Strengths
3. Risks
4. Recommendation (proceed / caution / reject)
`;
}
