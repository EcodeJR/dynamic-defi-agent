import { WalletState } from "./types";
import { ExecutionIntent } from "../strategy/executionEngine";

export interface WalletExecutionResult {
  success: boolean;
  logs: string[];
  txHash?: string;
}

