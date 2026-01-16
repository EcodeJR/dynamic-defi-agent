// src/strategy/generator.ts

import {
  StrategyGoal,
  StrategyPlan,
  ExecutionStep,
} from "./types";
import { scoreStrategyGoal } from "./scoring";

/**
 * Generates a deterministic execution plan
 * for a given strategy goal.
 */
export function generateStrategy(goal: StrategyGoal): StrategyPlan {
  const baseRisk = scoreStrategyGoal(goal);

  let steps: ExecutionStep[] = [];

  if (goal === "capital_preservation") {
    steps = [
      {
        stepId: 1,
        action: "HOLD",
        asset: "USDC",
        amount: 100,
        riskScore: 5,
        description: "Hold stablecoins to preserve capital",
      },
    ];
  }

  if (goal === "yield_generation") {
    steps = [
      {
        stepId: 1,
        action: "LEND",
        asset: "USDC",
        amount: 100,
        riskScore: 20,
        exampleProtocols: ["Aave", "Compound"],
        description: "Lend stablecoins to earn passive yield",
      },
    ];
  }

  if (goal === "balanced_growth") {
    steps = [
      {
        stepId: 1,
        action: "LEND",
        asset: "USDC",
        amount: 60,
        riskScore: 20,
        exampleProtocols: ["Aave"],
        description: "Lend majority of funds for stable yield",
      },
      {
        stepId: 2,
        action: "SWAP",
        asset: "ETH",
        amount: 40,
        riskScore: 40,
        exampleProtocols: ["Uniswap"],
        description: "Swap portion into ETH for growth exposure",
      },
    ];
  }

  if (goal === "aggressive_growth") {
    steps = [
      {
        stepId: 1,
        action: "SWAP",
        asset: "ETH",
        amount: 70,
        riskScore: 50,
        exampleProtocols: ["Uniswap"],
        description: "Convert majority of capital into ETH",
      },
      {
        stepId: 2,
        action: "STAKE",
        asset: "ETH",
        amount: 70,
        riskScore: 60,
        exampleProtocols: ["Lido"],
        description: "Stake ETH to amplify yield and exposure",
      },
    ];
  }

  const totalRiskScore = steps.reduce(
    (sum, step) => sum + step.riskScore,
    baseRisk
  );

  return {
    goal,
    totalRiskScore,
    steps,
  };
}
