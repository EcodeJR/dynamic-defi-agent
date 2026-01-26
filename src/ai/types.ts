import { StrategyGoal } from "../strategy/types";

export interface AIReasoningInput {
  goal: StrategyGoal;
  riskProfile: "low" | "medium" | "high";
  plan: any; // Keep as any for now due to dynamic structure
  simulation: any; // Keep as any for now due to dynamic structure
}

export interface AIReasoningOutput {
  summary: string;
  strengths: string[];
  risks: string[];
  recommendation: "proceed" | "caution" | "reject";
}
