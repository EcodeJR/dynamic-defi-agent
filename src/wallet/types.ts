export type Chain = "ethereum" | "polygon" | "arbitrum";

export interface WalletBalance {
  asset: string;
  amount: number;
}

export interface WalletState {
  address: string;
  chain: string;
  balance: number;
  canExecute: boolean;
}

export interface Wallet {
  address: string;
  chain: string;
  balance: number;
  canExecute: boolean;
}

export interface WalletExecutionResult {
  success: boolean;
  txHash?: string;
  logs: string[];
  error?: string;
}
