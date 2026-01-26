import { StrategyGoal } from "./types";

export function generateStrategy(
  goal: StrategyGoal,
  risk: "low" | "medium" | "high"
) {
  if (risk === "low") {
    return {
      totalRiskScore: 2,
      steps: [
        {
          stepId: 1,
          action: "Hold stable assets",
          asset: "USDC / USDT",
          amount: 70,
          riskScore: 1,
          description: "Preserve capital with stablecoins",
        },
        {
          stepId: 2,
          action: "Lend assets",
          asset: "Aave",
          amount: 30,
          riskScore: 2,
          description: "Earn low-risk yield",
        },
      ],
    };
  }

  if (risk === "medium") {
    return {
      totalRiskScore: 5,
      steps: [
        {
          stepId: 1,
          action: "Liquidity provision",
          asset: "ETH/USDC",
          amount: 50,
          riskScore: 4,
          description: "Balanced yield farming",
        },
        {
          stepId: 2,
          action: "Staking",
          asset: "ETH",
          amount: 50,
          riskScore: 3,
          description: "Moderate staking returns",
        },
      ],
    };
  }

  // high risk
  return {
    totalRiskScore: 8,
    steps: [
      {
        stepId: 1,
        action: "Leverage trade",
        asset: "ETH",
        amount: 60,
        riskScore: 8,
        description: "High volatility exposure",
      },
      {
        stepId: 2,
        action: "Yield farming",
        asset: "DeFi LPs",
        amount: 40,
        riskScore: 7,
        description: "High APY, high risk",
      },
    ],
  };
}
