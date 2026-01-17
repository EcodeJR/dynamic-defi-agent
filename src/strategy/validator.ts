import { StrategyGoal } from "./types";

export function validateStrategy(
  goal: StrategyGoal,
  risk: "low" | "medium" | "high"
): { valid: boolean; reason?: string } {
  // ❌ Low risk cannot do aggressive strategies
  if (risk === "low" && goal === "aggressive_growth") {
    return {
      valid: false,
      reason: "Aggressive strategies are not allowed for low-risk profiles.",
    };
  }

  // ❌ Medium risk cannot go full leverage
  if (risk === "medium" && goal === "aggressive_growth") {
    return {
      valid: false,
      reason: "Aggressive growth exceeds medium risk tolerance.",
    };
  }

  // ✅ Everything else allowed
  return { valid: true };
}
