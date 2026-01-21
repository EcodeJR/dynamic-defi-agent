import { AIReasoningInput, AIReasoningOutput } from "./types";

export function runAIReasoning(
  input: AIReasoningInput
): AIReasoningOutput {
  const risks: string[] = [];

  if (input.simulation.maxDrawdown > 25) {
    risks.push("High potential drawdown.");
  }

  if (input.riskProfile === "low" && input.simulation.volatility > 20) {
    risks.push("Volatility too high for low-risk profile.");
  }

  const recommendation =
    risks.length > 1
      ? "reject"
      : risks.length === 1
      ? "caution"
      : "proceed";

  return {
    summary: `Strategy analyzed for ${input.goal}`,
    strengths: [
      "Balanced asset allocation",
      "Risk-adjusted strategy",
    ],
    risks,
    recommendation,
  };
}
