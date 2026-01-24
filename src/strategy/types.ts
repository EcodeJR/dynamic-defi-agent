// src/strategy/types.ts

/**
 * High-level intent of the user.
 * This NEVER maps directly to a protocol.
 */
export type StrategyGoal =
  | "capital_preservation"
  | "yield_generation"
  | "balanced_growth"
  | "aggressive_growth";

/**
 * Abstract DeFi actions.
 * These are chain & protocol agnostic.
 */
export type StrategyAction =
  | "HOLD"
  | "LEND"
  | "STAKE"
  | "SWAP"
  | "BORROW"
  | "REBALANCE";

/**
 * Risk score used internally by the engine.
 * 0 = no risk, 100 = extreme risk
 */
export type RiskScore = number;

/**
 * One atomic execution step.
 * Later this maps 1-to-1 with a blockchain tx.
 */
export interface ExecutionStep {
  stepId: number;
  action: StrategyAction;
  asset: string;
  amount: number;
  riskScore: RiskScore;

  /**
   * Informational only.
   * NEVER relied on for execution logic.
   */
  exampleProtocols?: string[];

  /**
   * Human-readable explanation
   */
  description: string;
}

/**
 * Final strategy output returned to the user.
 */
export interface StrategyPlan {
  goal: StrategyGoal;
  totalRiskScore: RiskScore;
  steps: ExecutionStep[];
}

export type StrategyVariant =
  | "conservative"
  | "balanced"
  | "aggressive";
