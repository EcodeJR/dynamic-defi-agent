import { RiskProfile } from "../state/userState";

export interface AgentCommandContext {
  replyMessage: (msg: string) => Promise<void>;

  // identity
  userId: string;

  // user state
  riskProfile: RiskProfile;

  // web3-ready
  walletAddress?: string;
  chainId?: number;
}