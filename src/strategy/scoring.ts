// src/strategy/scoring.ts

import { StrategyGoal, RiskScore } from "./types";

/**
 * Base risk score per strategy goal.
 * These values are intentionally conservative.
 */
const BASE_GOAL_RISK: Record<StrategyGoal, RiskScore> = {
  capital_preservation: 10,
  yield_generation: 30,
  balanced_growth: 50,
  aggressive_growth: 75,
};

/**
 * Calculates the baseline risk score for a strategy goal.
 * Pure function — deterministic and auditable.
 */
export function scoreStrategyGoal(goal: StrategyGoal): RiskScore {
  return BASE_GOAL_RISK[goal];
}
