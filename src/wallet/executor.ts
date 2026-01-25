import { ExecutionIntent } from "../strategy/executionEngine";
import { WalletState, WalletExecutionResult } from "./types";

export function executeWithWallet(
  wallet: WalletState,
  execution: ExecutionIntent
): WalletExecutionResult {
  if (!wallet.canExecute) {
    return {
      success: false,
      logs: ["Wallet blocked from execution"],
    };
  }

  if (execution.readiness !== "ready") {
    return {
      success: false,
      logs: ["Execution blocked by safety checks"],
    };
  }

  const logs = execution.steps.map(
    (s) => `[EXECUTED] ${s.executionType} ${s.asset}`
  );

  return {
    success: true,
    logs,
    txHash: "0xSIMULATED_TX_HASH",
  };
}
