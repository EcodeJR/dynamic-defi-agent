import { randomUUID } from "crypto";
import { CommandHandler } from "../agent/types";
import { StrategyGoal } from "../strategy/types";
import { generateMultipleStrategies } from "../strategy/multiGenerator";
import { compareStrategies } from "../strategy/comparator";
import { validateStrategy } from "../strategy/validator";
import { simulateStrategy } from "../strategy/simulator";
import { scoreStrategy } from "../strategy/scorer";
import { buildExecutionIntent } from "../strategy/executionEngine";
import { executeStrategy } from "../strategy/executor";
import { runAIReasoning } from "../ai";
import { simulateWallet, executeWithWallet } from "../wallet";
import { StrategyModel } from "../db/models/Strategy";
import { saveStrategy } from "../memory";

export const strategyCommand: CommandHandler = async ({
  state,
  payload,
}) => {
  const goal = payload?.goal as StrategyGoal;

  if (!goal) return "❌ Strategy goal required.";
  if (!state.riskProfile)
    return "⚠️ Please set your risk profile first using /set-risk.";

  // ✅ Step 1: Validate
  const validation = validateStrategy(goal, state.riskProfile);
  if (!validation.valid) return `🚫 ${validation.reason}`;

  // ✅ Step 2: Generate multiple strategies
  const strategies = generateMultipleStrategies(
    goal,
    state.riskProfile
  );

  // ✅ Step 3: Compare strategies
  const comparison = compareStrategies(
    goal,
    state.riskProfile,
    strategies
  );

  const best = comparison.best;

  // ✅ Step 4: AI Reasoning
  const aiResult = await runAIReasoning({
    goal,
    riskProfile: state.riskProfile,
    plan: best.plan,
    simulation: best.simulation,
  });

  // ✅ Step 5: Build execution
  const execution = buildExecutionIntent(
    goal,
    state.riskProfile,
    best.plan
  );

  const executionResult = await executeStrategy(execution);

  // ✅ Step 6: Wallet simulation
  const wallet = simulateWallet();
  const walletResult = executeWithWallet(wallet, execution);

  const status =
  execution.readiness === "ready"
    ? "simulated"
    : "failed";

  // ✅ Step 7: Save to DB
  await StrategyModel.create({
    userId: "demo-user",
    goal,
    riskProfile: state.riskProfile,
    plan: best.plan,
    simulation: best.simulation,
    execution,
    ai: {
      summary: aiResult.summary,
      recommendation: aiResult.recommendation,
    },
    status,
  });

  // ✅ Step 8: Build response
  let response = `📊 Strategy Analysis\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;
  response += `🎯 Goal: ${goal}\n`;
  response += `⚖️ Risk: ${state.riskProfile}\n`;
  response += `🏆 Best Strategy: ${best.type.toUpperCase()}\n`;
  response += `📈 APY: ${best.simulation.estimatedAPY}%\n`;
  response += `📉 Drawdown: ${best.simulation.maxDrawdown}%\n`;
  response += `📊 Score: ${best.score.score}/100\n\n`;

  response += `🧠 AI Summary:\n${aiResult.summary}\n\n`;
  response += `🧭 Recommendation: ${aiResult.recommendation}\n\n`;

  response += `📋 Execution Plan:\n`;
  best.plan.steps.forEach((s: any) => {
    response += `• ${s.action} → ${s.asset} (${s.amount}%)\n`;
  });

  response += `\n👛 Wallet Simulation\n`;
  response += `Wallet: ${wallet.address}\n`;

  if (walletResult.success) {
    walletResult.logs.forEach((l) => (response += `• ${l}\n`));
  } else {
    response += `❌ Execution blocked\n`;
  }

  // ✅ Save memory
  saveStrategy({
    id: randomUUID(),
    goal,
    riskProfile: state.riskProfile,
    plan: best.plan,
    simulation: best.simulation,
    execution,
    status,
    createdAt: Date.now(),
  });

  return response;
};