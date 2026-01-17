// // src/strategy/generator.ts

// import {
//   StrategyGoal,
//   StrategyPlan,
//   ExecutionStep,
// } from "./types";
// import { scoreStrategyGoal } from "./scoring";

// /**
//  * Generates a deterministic execution plan
//  * for a given strategy goal.
//  */
// export function generateStrategy(goal: StrategyGoal): StrategyPlan {
//   const baseRisk = scoreStrategyGoal(goal);

//   let steps: ExecutionStep[] = [];

//   if (goal === "capital_preservation") {
//     steps = [
//       {
//         stepId: 1,
//         action: "HOLD",
//         asset: "USDC",
//         amount: 100,
//         riskScore: 5,
//         description: "Hold stablecoins to preserve capital",
//       },
//     ];
//   }

//   if (goal === "yield_generation") {
//     steps = [
//       {
//         stepId: 1,
//         action: "LEND",
//         asset: "USDC",
//         amount: 100,
//         riskScore: 20,
//         exampleProtocols: ["Aave", "Compound"],
//         description: "Lend stablecoins to earn passive yield",
//       },
//     ];
//   }

//   if (goal === "balanced_growth") {
//     steps = [
//       {
//         stepId: 1,
//         action: "LEND",
//         asset: "USDC",
//         amount: 60,
//         riskScore: 20,
//         exampleProtocols: ["Aave"],
//         description: "Lend majority of funds for stable yield",
//       },
//       {
//         stepId: 2,
//         action: "SWAP",
//         asset: "ETH",
//         amount: 40,
//         riskScore: 40,
//         exampleProtocols: ["Uniswap"],
//         description: "Swap portion into ETH for growth exposure",
//       },
//     ];
//   }

//   if (goal === "aggressive_growth") {
//     steps = [
//       {
//         stepId: 1,
//         action: "SWAP",
//         asset: "ETH",
//         amount: 70,
//         riskScore: 50,
//         exampleProtocols: ["Uniswap"],
//         description: "Convert majority of capital into ETH",
//       },
//       {
//         stepId: 2,
//         action: "STAKE",
//         asset: "ETH",
//         amount: 70,
//         riskScore: 60,
//         exampleProtocols: ["Lido"],
//         description: "Stake ETH to amplify yield and exposure",
//       },
//     ];
//   }

//   const totalRiskScore = steps.reduce(
//     (sum, step) => sum + step.riskScore,
//     baseRisk
//   );

//   return {
//     goal,
//     totalRiskScore,
//     steps,
//   };
// }
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
