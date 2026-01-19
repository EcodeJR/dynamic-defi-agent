import { StrategyGoal } from "./types";

export interface ExecutionStep {
  action: string;
  asset: string;
  allocation: number;
  risk: number;
  executionType: "swap" | "stake" | "lp" | "hold";
}

export interface ExecutionIntent {
  goal: StrategyGoal;
  riskProfile: "low" | "medium" | "high";
  steps: ExecutionStep[];
  readiness: "ready" | "blocked";
  warnings: string[];
}

export function buildExecutionIntent(
  goal: StrategyGoal,
  riskProfile: "low" | "medium" | "high",
  plan: any
): ExecutionIntent {
  const warnings: string[] = [];

  const steps: ExecutionStep[] = plan.steps.map((step: any) => {
    let executionType: ExecutionStep["executionType"] = "hold";

    if (step.action.toLowerCase().includes("stake")) {
      executionType = "stake";
    } else if (step.action.toLowerCase().includes("liquidity")) {
      executionType = "lp";
    } else if (step.action.toLowerCase().includes("swap")) {
      executionType = "swap";
    }

    if (step.riskScore > 7 && riskProfile === "low") {
      warnings.push(
        `High risk step detected for low-risk profile: ${step.action}`
      );
    }

    return {
      action: step.action,
      asset: step.asset,
      allocation: step.amount,
      risk: step.riskScore,
      executionType,
    };
  });

  return {
    goal,
    riskProfile,
    steps,
    readiness: warnings.length > 0 ? "blocked" : "ready",
    warnings,
  };
}
