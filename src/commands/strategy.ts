import { CommandHandler } from "../agent/types";
import { generateStrategy } from "../strategy/generator";
import { validateStrategy } from "../strategy/validator";
import { StrategyGoal } from "../strategy/types";

export const strategyCommand: CommandHandler = async ({
  state,
  payload,
}) => {
  const goal = payload?.goal as StrategyGoal;

  if (!goal) {
    return "❌ Strategy goal required.";
  }

  if (!state.riskProfile) {
    return "⚠️ Please set your risk profile first using /set-risk.";
  }

  // ✅ NEW: validation layer
  const validation = validateStrategy(goal, state.riskProfile);

  if (!validation.valid) {
    return `🚫 Strategy rejected: ${validation.reason}`;
  }

  const plan = generateStrategy(goal, state.riskProfile);

  let response = `📊 Strategy Plan (${state.riskProfile.toUpperCase()})\n\n`;

  for (const step of plan.steps) {
    response += `Step ${step.stepId}\n`;
    response += `• Action: ${step.action}\n`;
    response += `• Asset: ${step.asset}\n`;
    response += `• Amount: ${step.amount}%\n`;
    response += `• Risk: ${step.riskScore}\n`;
    response += `• Why: ${step.description}\n\n`;
  }

  response += `⚠️ Dry run only. No funds moved.`;

  return response;
};
