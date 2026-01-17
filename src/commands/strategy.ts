import { CommandContext } from "../agent/types";
import { generateStrategy } from "../strategy/generator";
import { StrategyGoal } from "../strategy/types";

const VALID_GOALS: StrategyGoal[] = [
  "capital_preservation",
  "yield_generation",
  "balanced_growth",
  "aggressive_growth",
];

export async function strategyCommand({
  state,
  payload,
  reply,
}: CommandContext): Promise<string> {
  const goal = payload?.goal as StrategyGoal;

  if (!goal || !VALID_GOALS.includes(goal)) {
    return reply(
      "❌ Invalid strategy goal.\n\n" +
        "Valid options:\n" +
        "- capital_preservation\n" +
        "- yield_generation\n" +
        "- balanced_growth\n" +
        "- aggressive_growth"
    );
  }

  if (!state.riskProfile) {
    return reply("⚠️ Please set your risk profile first using /set-risk.");
  }

  const plan = generateStrategy(goal);

  let response = `📊 Strategy Plan: ${goal.replace("_", " ")}\n\n`;
  response += `⚠️ Total Risk Score: ${plan.totalRiskScore}\n\n`;

  for (const step of plan.steps) {
    response += `Step ${step.stepId}\n`;
    response += `• Action: ${step.action}\n`;
    response += `• Asset: ${step.asset}\n`;
    response += `• Amount: ${step.amount}%\n`;
    response += `• Risk: ${step.riskScore}\n`;
    response += `• Why: ${step.description}\n`;

    if (step.exampleProtocols) {
      response += `• Examples: ${step.exampleProtocols.join(", ")}\n`;
    }

    response += `\n`;
  }

  response += `🧪 Dry run only. No funds will be moved.`;

  reply(response);
  return response;
}
