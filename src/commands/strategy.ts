import { randomUUID } from "crypto";
import { CommandHandler } from "../agent/types";
import { StrategyGoal } from "../strategy/types";
import { generateMultipleStrategies } from "../strategy/multiGenerator";
import { compareStrategies } from "../strategy/comparator";
import { validateStrategy } from "../strategy/validator";
import { buildExecutionIntent } from "../strategy/executionEngine";
import { executeStrategy } from "../strategy/executor";
import { runAIReasoning } from "../ai";
import { simulateWallet, executeWithWallet } from "../wallet";
import { StrategyModel } from "../db/models/Strategy";
import { saveStrategy } from "../memory";
import { logEvent } from "../utils/logger";
import { rateLimit } from "../middleware/rateLimit";

export const strategyCommand: CommandHandler = async ({
  state,
  payload,
}) => {
  // ✅ Rate limiting
  rateLimit(state.userId);

  const goal = payload?.goal as StrategyGoal;
  if (!goal) return "❌ Strategy goal required.";
  if (!state.riskProfile)
    return "⚠️ Please set your risk profile first using /set-risk.";

  // ✅ Step 1: Validate
  const validation = validateStrategy(goal, state.riskProfile);
  if (!validation.valid) return `🚫 ${validation.reason}`;

  // ✅ Step 2: Generate strategies
  const strategies = generateMultipleStrategies(
    goal,
    state.riskProfile
  );

  // ✅ Step 3: Compare
  const comparison = compareStrategies(
    goal,
    state.riskProfile,
    strategies
  );
  const best = comparison.best;

  // ✅ Step 4: AI reasoning
  const aiResult = await runAIReasoning({
    goal,
    riskProfile: state.riskProfile,
    plan: best.plan,
    simulation: best.simulation,
  });

  // ✅ Execution mode
  const isDemo = process.env.DEMO_MODE === "true";
  const executionMode = isDemo ? "simulation" : "live";

  // ✅ Step 5: Build execution intent
  const execution = buildExecutionIntent(
    goal,
    state.riskProfile,
    best.plan
  );

  // ✅ Step 6: Wallet + execution
  const wallet = simulateWallet();

  const executionResult = await executeStrategy(
    execution,
    wallet,
    executionMode
  );

  const walletResult = executeWithWallet(wallet, execution);

  const status =
    executionResult.status === "success"
      ? "simulated"
      : "failed";

  // ✅ Step 7: Persist strategy
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

    audit: {
      generatedAt: Date.now(),
      aiVersion: "gpt-4.1",
      executionMode,
      riskProfile: state.riskProfile,
    },

    status,
  });

  // ✅ Logging
  logEvent("INFO", "Strategy executed", {
    goal,
    riskProfile: state.riskProfile,
    status: executionResult.status,
  });

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

  // ✅ Response
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

  walletResult.logs.forEach((l) => {
    response += `• ${l}\n`;
  });

  return response;
};
