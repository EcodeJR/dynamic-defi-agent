export type Chain = "ethereum" | "polygon" | "arbitrum";

export interface WalletBalance {
  asset: string;
  amount: number;
}

export interface WalletState {
  address: string;
  chain: Chain;
  balances: WalletBalance[];
}