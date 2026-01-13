import { AgentCommandContext } from "./types/agent";

export const handleStart = async (
  { replyMessage }: AgentCommandContext
) => {
  await replyMessage("Hello! I am your DeFi Strategy Assistant 👋");
};
