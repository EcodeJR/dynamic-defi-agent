import { CommandHandler } from "../agent/types";
import { generateStrategy } from "../strategy/generator";
import { validateStrategy } from "../strategy/validator";
import { scoreStrategy } from "../strategy/scorer";
import { simulateStrategy } from "../strategy/simulator";
import { buildExecutionIntent } from "../strategy/executionEngine";
import { StrategyGoal } from "../strategy/types";

export const strategyCommand: CommandHandler = async ({
  state,
  payload,
}) => {
  const goal = payload?.goal as StrategyGoal;

  if (!goal) return "❌ Strategy goal required.";

  if (!state.riskProfile) {
    return "⚠️ Please set your risk profile first using /set-risk.";
  }

  // Step 1: Validate
  const validation = validateStrategy(goal, state.riskProfile);
  if (!validation.valid) {
    return `🚫 Strategy rejected: ${validation.reason}`;
  }

  // Step 2: Generate
  const plan = generateStrategy(goal, state.riskProfile);

  // Step 3: Score
  const { score, reasoning } = scoreStrategy(
    goal,
    state.riskProfile
  );

  // Step 4: Simulate
  const simulation = simulateStrategy(goal, state.riskProfile);

  // Step 5: Execution readiness
  const execution = buildExecutionIntent(
    goal,
    state.riskProfile,
    plan
  );

  // Step 6: Build response
  let response = `📊 Strategy Analysis\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;
  response += `🎯 Goal: ${goal}\n`;
  response += `⚖️ Risk Profile: ${state.riskProfile}\n`;
  response += `📈 Confidence Score: ${score}/100\n\n`;

  response += `🧠 Reasoning:\n`;
  for (const reason of reasoning) {
    response += `• ${reason}\n`;
  }

  response += `\n📋 Execution Plan:\n`;

  for (const step of plan.steps) {
    response += `\nStep ${step.stepId}\n`;
    response += `• Action: ${step.action}\n`;
    response += `• Asset: ${step.asset}\n`;
    response += `• Allocation: ${step.amount}%\n`;
    response += `• Risk: ${step.riskScore}\n`;
  }

  response += `\n📉 Simulation Results\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;
  response += `📈 Estimated APY: ${simulation.estimatedAPY}%\n`;
  response += `📉 Max Drawdown: ${simulation.maxDrawdown}%\n`;
  response += `📊 Volatility: ${simulation.volatility}\n`;
  response += `⏳ Time Horizon: ${simulation.horizon}\n`;
  response += `⚠️ Risk Level: ${simulation.riskLevel}\n`;

  response += `\n🚀 Execution Readiness\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;
  response += `Status: ${execution.readiness.toUpperCase()}\n`;

  if (execution.warnings.length > 0) {
    response += `⚠️ Warnings:\n`;
    for (const w of execution.warnings) {
      response += `• ${w}\n`;
    }
  } else {
    response += `✅ Ready for execution pipeline\n`;
  }

  response += `\n⚠️ Simulation only — no funds moved.`;

  return response;
};
