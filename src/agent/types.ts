export type RiskProfile = "low" | "medium" | "high";

export interface AgentState {
  userId: string;
  riskProfile?: RiskProfile;
  memory?: string[];
  lastCommand?: string;
}

export interface CommandContext {
  state: AgentState;
  payload?: any;
  reply: (message: string) => string;
}

export type CommandHandler = (ctx: CommandContext) => Promise<string>;
