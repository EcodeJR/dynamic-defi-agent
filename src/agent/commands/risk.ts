import { CommandHandler } from "../../types/command";

export const handleRisk: CommandHandler = async ({
  replyMessage,
  riskProfile,
}) => {
  await replyMessage(
    `📊 Your current risk profile is: **${riskProfile.toUpperCase()}**`
  );
};
