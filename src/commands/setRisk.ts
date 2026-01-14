import { CommandHandler, RiskProfile } from "../agent/types";

export const setRiskCommand: CommandHandler = async ({ state, payload, reply }) => {
  const risk = payload?.risk as RiskProfile;

  if (!risk || !["low", "medium", "high"].includes(risk)) {
    return reply("❌ Invalid risk profile. Use: low | medium | high");
  }

  state.riskProfile = risk;
  return reply(`✅ Risk profile set to **${risk}**`);
};
