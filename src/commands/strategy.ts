import { CommandHandler } from "../agent/types";

type StrategyGoal = "yield" | "farming" | "leverage";

const riskPermissions: Record<string, StrategyGoal[]> = {
  low: ["yield"],
  medium: ["yield", "farming"],
  high: ["yield", "farming", "leverage"],
};

export const strategyCommand: CommandHandler = async ({
  state,
  payload,
  reply,
}) => {
  const { goal, protocol, asset } = payload ?? {};

  if (!state.riskProfile) {
    return reply("⚠️ Please set your risk profile first using /set-risk.");
  }

  if (!goal || !["yield", "farming", "leverage"].includes(goal)) {
    return reply("❌ Invalid strategy goal. Use: yield | farming | leverage");
  }

  const allowedGoals = riskPermissions[state.riskProfile];

  if (!allowedGoals.includes(goal)) {
    return reply(
      `🚫 Strategy "${goal}" is not allowed for **${state.riskProfile}** risk profile.`
    );
  }

  // Dry-run explanation
  return reply(
    `📊 Strategy Preview:\n` +
      `• Goal: ${goal}\n` +
      `• Asset: ${asset ?? "not specified"}\n` +
      `• Protocol: ${protocol ?? "not specified"}\n\n` +
      `🧪 This is a dry-run. No funds will be moved.`
  );
};
