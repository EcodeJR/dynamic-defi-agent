import { CommandHandler } from "../agent/types";

export const setRiskCommand: CommandHandler = async ({ payload, state }) => {
  const risk = payload?.risk;

  if (risk !== "low" && risk !== "medium" && risk !== "high") {
    return "❌ Invalid risk level. Use: low | medium | high";
  }

  state.riskProfile = risk;
  return `✅ Risk profile set to ${risk}`;
};
