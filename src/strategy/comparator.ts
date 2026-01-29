import { simulateStrategy } from "./simulator";
import { scoreStrategy } from "./scorer";
import { StrategyGoal } from "./types";

export function compareStrategies(
  goal: StrategyGoal,
  risk: "low" | "medium" | "high",
  strategies: any[]
) {
  const evaluated = strategies.map((s) => {
    const simulation = simulateStrategy(goal, s.type);
    const score = scoreStrategy(goal, risk, simulation);

    return {
      type: s.type,
      plan: s.plan,
      simulation,
      score,
    };
  });

  evaluated.sort((a, b) => b.score.score - a.score.score);

  return {
    best: evaluated[0],
    all: evaluated,
  };
}
