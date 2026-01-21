import { StrategyGoal } from "../strategy/types";

export type StrategyStatus =
  | "simulated"
  | "executed"
  | "failed";

export interface StrategyRecord {
  id: string;
  goal: StrategyGoal;
  riskProfile: "low" | "medium" | "high";

  plan: any;
  simulation: any;
  execution: any;

  status: StrategyStatus;
  createdAt: number;
}
