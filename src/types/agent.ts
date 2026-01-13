export interface AgentCommandContext {
  replyMessage: (msg: string) => Promise<void>;

  // Web3 context
  walletAddress?: string;
  chainId?: number;

  // User preferences
  riskProfile?: "low" | "medium" | "high";
}
