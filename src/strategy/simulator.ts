import { StrategyGoal } from "./types";

export interface SimulationResult {
  estimatedAPY: number;
  riskLevel: "low" | "medium" | "high";
  volatility: number;
  maxDrawdown: number;
  horizon: "short" | "medium" | "long";
}

export function simulateStrategy(
  goal: StrategyGoal,
  risk: "low" | "medium" | "high"
): SimulationResult {
  switch (goal) {
    case "capital_preservation":
      return {
        estimatedAPY: 4,
        riskLevel: "low",
        volatility: 5,
        maxDrawdown: 3,
        horizon: "long",
      };

    case "yield_generation":
      return {
        estimatedAPY: 10,
        riskLevel: "medium",
        volatility: 15,
        maxDrawdown: 12,
        horizon: "medium",
      };

    case "balanced_growth":
      return {
        estimatedAPY: 18,
        riskLevel: "medium",
        volatility: 22,
        maxDrawdown: 18,
        horizon: "medium",
      };

    case "aggressive_growth":
      return {
        estimatedAPY: 35,
        riskLevel: "high",
        volatility: 40,
        maxDrawdown: 35,
        horizon: "short",
      };
  }
}
