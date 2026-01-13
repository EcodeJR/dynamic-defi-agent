import { CommandHandler } from "../../types/command";

export const handleStart: CommandHandler = async ({
  replyMessage,
}) => {
  await replyMessage(
    "👋 Welcome! I’m your Dynamic DeFi Strategy Assistant.\n\n" +
    "You can ask me about:\n" +
    "- Risk profiles\n" +
    "- Yield strategies\n" +
    "- Market conditions"
  );
};
