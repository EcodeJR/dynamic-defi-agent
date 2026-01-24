import { StrategyGoal } from "./types";
import { generateStrategy } from "./generator";

export function generateMultipleStrategies(
  goal: StrategyGoal,
  risk: "low" | "medium" | "high"
) {
  return [
    {
      type: "conservative",
      plan: generateStrategy(goal, "low"),
    },
    {
      type: "balanced",
      plan: generateStrategy(goal, "medium"),
    },
    {
      type: "aggressive",
      plan: generateStrategy(goal, "high"),
    },
  ];
}
