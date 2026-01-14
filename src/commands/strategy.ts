import { CommandHandler } from "../agent/types";

type StrategyGoal = "yield" | "farming" | "leverage";

const riskPermissions: Record<string, StrategyGoal[]> = {
  low: ["yield"],
  medium: ["yield", "farming"],
  high: ["yield", "farming", "leverage"],
};

const baseScores: Record<StrategyGoal, number> = {
  yield: 40,
  farming: 65,
  leverage: 85,
};

export const strategyCommand: CommandHandler = async ({
  state,
  payload,
  reply,
}) => {
  if (!state.riskProfile) {
    return reply("⚠️ Please set your risk profile first using /set-risk.");
  }

  const rawGoal = payload?.goal;

  if (
    rawGoal !== "yield" &&
    rawGoal !== "farming" &&
    rawGoal !== "leverage"
  ) {
    return reply("❌ Invalid strategy goal. Use: yield | farming | leverage");
  }

  // ✅ Type is now safely narrowed
  const goal: StrategyGoal = rawGoal;

  const allowedGoals = riskPermissions[state.riskProfile];

  if (!allowedGoals.includes(goal)) {
    return reply(
      `🚫 Strategy "${goal}" is not allowed for **${state.riskProfile}** risk profile.`
    );
  }

  // ---- Strategy Scoring ----
  let score = baseScores[goal];
  let complexity: "low" | "medium" | "high" = "low";

  if (goal === "farming") complexity = "medium";
  if (goal === "leverage") complexity = "high";

  if (state.riskProfile === "medium" && goal === "leverage") {
    score -= 15;
  }

  score = Math.max(0, Math.min(100, score));

  return reply(
    `📊 Strategy Preview\n\n` +
      `• Goal: ${goal}\n` +
      `• Asset: ${payload?.asset ?? "not specified"}\n` +
      `• Protocol: ${payload?.protocol ?? "not specified"}\n\n` +
      `🧮 Risk Score: ${score}/100\n` +
      `⚙️ Complexity: ${complexity}\n\n` +
      `🧪 Dry run only. No funds will be moved.`
  );
};
