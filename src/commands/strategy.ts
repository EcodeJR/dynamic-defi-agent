import { randomUUID } from "crypto";
import { CommandHandler } from "../agent/types";
import { generateStrategy } from "../strategy/generator";
import { validateStrategy } from "../strategy/validator";
import { scoreStrategy } from "../strategy/scorer";
import { simulateStrategy } from "../strategy/simulator";
import { buildExecutionIntent } from "../strategy/executionEngine";
import { executeStrategy } from "../strategy/executor";
import { StrategyGoal } from "../strategy/types";
import { saveStrategy } from "../memory";
import { runAIReasoning } from "../ai";
import { simulateWallet, executeWithWallet } from "../wallet";

import { StrategyModel } from "../db/models/Strategy";



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
  const { score, reasoning } = scoreStrategy(goal, state.riskProfile);

  // Step 4: Simulate
  const simulation = simulateStrategy(goal, state.riskProfile);

  // Step 4.5: AI Reasoning
  const aiAnalysis = await runAIReasoning({
  goal,
  riskProfile: state.riskProfile,
  plan,
  simulation,
});

  // Step 5: Build execution intent
  const execution = buildExecutionIntent(
    goal,
    state.riskProfile,
    plan
  );
 // ✅ Step 6: Execute (SAFE — simulated)
  const executionResult = await executeStrategy(execution);

  const wallet = simulateWallet();
  const walletResult = executeWithWallet(wallet, execution);
 
  await StrategyModel.create({
    goal,
    riskProfile: state.riskProfile,
    plan,
    simulation,
    execution,
    aiSummary: aiAnalysis.summary,
    aiRecommendation: aiAnalysis.recommendation,
    status: execution.readiness === "ready" ? "simulated" : "failed",
  });

  // Step 7: Build response
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

  response += `\n⚙️ Execution Simulation\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;

  if (executionResult.status === "success") {
    response += `✅ Executed Steps:\n`;
    executionResult.executedSteps.forEach((step: string) => {
      response += `• ${step}\n`;
    });

    if (executionResult.skippedSteps.length > 0) {
      response += `\n⚠️ Skipped Steps:\n`;
      executionResult.skippedSteps.forEach((step: string) => {
        response += `• ${step}\n`;
      });
    }
  } else {
    response += `❌ Execution blocked: ${executionResult.reason}\n`;
  }

  if (execution.warnings.length > 0) {
    response += `\n⚠️ Warnings:\n`;
    execution.warnings.forEach(w => {
      response += `• ${w}\n`;
    });
  } else {
    response += `\n✅ Ready for execution pipeline\n`;
  }

  response += `\n⚠️ Simulation only — no funds moved.`;


  response += `\n🧠 AI Reasoning\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;
  response += `Summary: ${aiAnalysis.summary}\n\n`;

  response += `Strengths:\n`;
  aiAnalysis.strengths.forEach(s => {
    response += `• ${s}\n`;
  });

  if (aiAnalysis.risks.length > 0) {
    response += `\nRisks:\n`;
    aiAnalysis.risks.forEach(r => {
      response += `• ${r}\n`;
    });
  }

  response += `\n🧭 Recommendation: ${aiAnalysis.recommendation.toUpperCase()}\n`;

  //Wallet Simulation
  response += `\n👛 Wallet Simulation\n`;
  response += `━━━━━━━━━━━━━━━━━━\n`;
  response += `Wallet: ${wallet.address}\n`;
  response += `Chain: ${wallet.chain}\n\n`;

  if (walletResult.success) {
    response += `✅ Wallet Actions:\n`;
    walletResult.logs.forEach(log => {
      response += `• ${log}\n`;
    });
  } else {
    response += `❌ Wallet execution blocked\n`;
  }


  // Save strategy record to memory
  saveStrategy({
    id: randomUUID(),
    goal,
    riskProfile: state.riskProfile,
    plan,
    simulation,
    execution,
    status: execution.readiness === "ready" ? "simulated" : "failed",
    createdAt: Date.now(),
  });



  return response;
};
