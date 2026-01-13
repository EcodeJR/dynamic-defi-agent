import { AgentCommandContext } from "./agent";

export type CommandHandler = (
  context: AgentCommandContext
) => Promise<void>;
