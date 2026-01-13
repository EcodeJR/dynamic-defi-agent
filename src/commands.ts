import { CommandHandler } from "@superdapp/agents";

export const handleStart: CommandHandler = async ({ replyMessage }) => {
  await replyMessage("Hello! I am your DeFi Strategy Assistant 👋");
};
