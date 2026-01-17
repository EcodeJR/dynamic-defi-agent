import { StrategyGoal } from "./types";

export function scoreStrategy(
  goal: StrategyGoal,
  risk: "low" | "medium" | "high"
): { score: number; reasoning: string[] } {
  let score = 50;
  const reasoning: string[] = [];

  if (goal === "capital_preservation") {
    score += risk === "low" ? 30 : -10;
    reasoning.push("Focuses on capital safety.");
  }

  if (goal === "yield_generation") {
    score += risk === "medium" ? 25 : 5;
    reasoning.push("Balanced yield with manageable risk.");
  }

  if (goal === "balanced_growth") {
    score += risk === "medium" ? 30 : 10;
    reasoning.push("Optimized for steady growth.");
  }

  if (goal === "aggressive_growth") {
    score += risk === "high" ? 35 : -20;
    reasoning.push("High-reward strategy with elevated risk.");
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return { score, reasoning };
}
