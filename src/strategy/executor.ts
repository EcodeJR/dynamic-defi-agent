import { ExecutionIntent } from "./executionEngine";
import { Wallet } from "../wallet/types";
import { validateExecution } from "../wallet/guard";

export type ExecutionMode = "simulation" | "dry-run" | "live";

export interface ExecutionResult {
  status: "success" | "blocked";
  executedSteps: string[];
  skippedSteps: string[];
  txHash?: string;
  reason?: string;
}

export async function executeStrategy(
  execution: ExecutionIntent,
  wallet?: Wallet,
  mode: ExecutionMode = "simulation"
): Promise<ExecutionResult> {
  // 🚨 Safety check
  if (mode !== "simulation") {
    const validation = validateExecution(wallet, execution);
    if (!validation.ok) {
      return {
        status: "blocked",
        executedSteps: [],
        skippedSteps: execution.steps.map(
          (s) => `${s.action} (${s.asset})`
        ),
        reason: validation.reason,
      };
    }
  }

  // 🧪 Simulation mode
  if (mode === "simulation") {
    return {
      status: "success",
      executedSteps: execution.steps.map(
        (s) => `[SIM] ${s.action} ${s.asset}`
      ),
      skippedSteps: [],
    };
  }

  // 🧪 Dry-run (preflight)
  if (mode === "dry-run") {
    return {
      status: "success",
      executedSteps: execution.steps.map(
        (s) => `[DRY-RUN] ${s.action} ${s.asset}`
      ),
      skippedSteps: [],
    };
  }

  // 🚀 Live execution (still mocked)
  return {
    status: "success",
    executedSteps: execution.steps.map(
      (s) => `[LIVE] ${s.action} ${s.asset}`
    ),
    skippedSteps: [],
    txHash: "0xSIMULATED_TX_HASH",
  };
}
