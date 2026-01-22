import { runAIReasoning } from "../src/ai";

describe("AI Reasoning", () => {
  it("should return valid AI output", async () => {
    const result = await runAIReasoning({
      goal: "maximize yield",
      riskProfile: "medium",
      plan: { steps: [] },
      simulation: {
        estimatedAPY: 12,
        maxDrawdown: 10,
        volatility: 8,
        horizon: "3 months",
        riskLevel: "medium",
      },
    });

    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("strengths");
    expect(result).toHaveProperty("risks");
    expect(result).toHaveProperty("recommendation");
  });
});
