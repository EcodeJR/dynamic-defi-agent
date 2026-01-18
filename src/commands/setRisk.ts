import { CommandHandler } from "../agent/types";

export const setRiskCommand: CommandHandler = async ({
  state,
  payload,
  reply,
}) => {
  const { risk } = payload;

  if (!risk || !["low", "medium", "high"].includes(risk)) {
    return reply(
      "⚠️ Please provide a valid risk profile: low | medium | high"
    );
  }

  state.riskProfile = risk;

  return reply(`✅ Risk profile set to: ${risk.toUpperCase()}`);
};
