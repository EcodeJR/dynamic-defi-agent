import { ExecutionIntent } from "../strategy/executionEngine";
import { Wallet } from "./types";

export function validateExecution(
  wallet: Wallet | undefined,
  execution: ExecutionIntent
): { ok: boolean; reason?: string } {
  if (!wallet) {
    return { ok: false, reason: "No wallet connected" };
  }

  const totalAllocation = execution.steps.reduce(
    (sum, s) => sum + s.allocation,
    0
  );

  if (totalAllocation > 100) {
    return {
      ok: false,
      reason: "Allocation exceeds 100%",
    };
  }

  if (execution.readiness === "blocked") {
    return {
      ok: false,
      reason: "Execution marked as unsafe",
    };
  }

  return { ok: true };
}
