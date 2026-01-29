import { Message } from "@superdapp/agents";
import { replyToMessage } from "../client";
import { createStrategyButtons, formatStrategyResponse } from "../ui-helpers";
import { getOrCreateSession } from "../session-manager";
import { extractUserId, parseCommandArgs, extractCallbackData } from "../message-parser";
import { StrategyGoal } from "../../strategy/types";
import { generateMultipleStrategies } from "../../strategy/multiGenerator";
import { compareStrategies } from "../../strategy/comparator";
import { validateStrategy } from "../../strategy/validator";
import { runAIReasoning } from "../../ai";
import { buildExecutionIntent } from "../../strategy/executionEngine";
import { executeStrategy } from "../../strategy/executor";
import { simulateWallet, executeWithWallet } from "../../wallet";
import { StrategyModel } from "../../db/models/Strategy";
import { saveStrategy } from "../../memory";
import { logEvent } from "../../utils/logger";
import { randomUUID } from "crypto";

/**
 * /strategy command - Generate DeFi strategy
 */
export async function handleStrategyCommand(message: Message): Promise<void> {
    const userId = extractUserId(message);
    const session = getOrCreateSession(userId);

    // Check if user has set risk profile
    if (!session.riskProfile) {
        await replyToMessage(
            message,
            "⚠️ Please set your risk profile first using /risk"
        );
        return;
    }

    // Check if this is a callback from button click
    const callbackData = extractCallbackData(message);
    let goal: string | null = null;

    if (callbackData) {
        // Extract goal from callback: "/strategy yield_generation"
        const parts = callbackData.split(" ");
        goal = parts[1] || null;
    } else {
        // Extract from command args
        const args = parseCommandArgs(message);
        goal = args[0] || null;
    }

    // If no goal provided, show buttons
    if (!goal) {
        const promptMessage = `
📊 **Choose Your Strategy Goal**

Select what you want to achieve:

🛡️ **Capital Preservation** - Protect your capital
💰 **Yield Generation** - Earn passive income
📈 **Balanced Growth** - Mix of safety and growth
🚀 **Aggressive Growth** - Maximum returns

What's your goal?
    `.trim();

        await replyToMessage(message, promptMessage, createStrategyButtons());
        return;
    }

    // Validate goal
    const validGoals: StrategyGoal[] = [
        "capital_preservation",
        "yield_generation",
        "balanced_growth",
        "aggressive_growth",
    ];

    if (!validGoals.includes(goal as StrategyGoal)) {
        await replyToMessage(
            message,
            "❌ Invalid strategy goal. Please use the buttons to select a goal."
        );
        return;
    }

    try {
        // Send "generating" message
        await replyToMessage(message, "⏳ Generating your strategy...");

        const strategyGoal = goal as StrategyGoal;

        // Validate strategy
        const validation = validateStrategy(strategyGoal, session.riskProfile);
        if (!validation.valid) {
            await replyToMessage(message, `🚫 ${validation.reason}`);
            return;
        }

        // Generate strategies
        const strategies = generateMultipleStrategies(strategyGoal, session.riskProfile);

        // Compare and select best
        const comparison = compareStrategies(strategyGoal, session.riskProfile, strategies);
        const best = comparison.best;

        // AI reasoning
        const aiResult = await runAIReasoning({
            goal: strategyGoal,
            riskProfile: session.riskProfile,
            plan: best.plan,
            simulation: best.simulation,
        });

        // Validate AI response
        if (!aiResult.summary || !aiResult.recommendation) {
            throw new Error("Invalid AI response format");
        }

        // Build execution intent
        const execution = buildExecutionIntent(strategyGoal, session.riskProfile, best.plan);

        // Simulate execution
        const wallet = simulateWallet();
        const isDemo = process.env.DEMO_MODE === "true";
        const executionMode = isDemo ? "simulation" : "live";

        const executionResult = await executeStrategy(execution, wallet, executionMode);
        const walletResult = executeWithWallet(wallet, execution);

        const status = executionResult.status === "success" ? "simulated" : "failed";

        // Save to database
        try {
            await StrategyModel.create({
                userId,
                goal: strategyGoal,
                riskProfile: session.riskProfile,
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
                    riskProfile: session.riskProfile,
                },
                status,
            });
        } catch (dbError: any) {
            console.error("❌ Database save error:", dbError);
        }

        // Log event
        logEvent("INFO", "Strategy executed via SuperDapp", {
            userId,
            goal: strategyGoal,
            riskProfile: session.riskProfile,
            status: executionResult.status,
        });

        // Save to memory
        saveStrategy({
            id: randomUUID(),
            goal: strategyGoal,
            riskProfile: session.riskProfile,
            plan: best.plan,
            simulation: best.simulation,
            execution,
            status,
            createdAt: Date.now(),
        });

        // Format and send response
        const formattedResponse = formatStrategyResponse({
            goal: strategyGoal,
            riskProfile: session.riskProfile,
            strategyType: best.type,
            apy: best.simulation.estimatedAPY,
            drawdown: best.simulation.maxDrawdown,
            score: best.score.score,
            aiSummary: aiResult.summary,
            recommendation: aiResult.recommendation,
            steps: best.plan.steps,
        });

        await replyToMessage(message, formattedResponse);

    } catch (error: any) {
        console.error("❌ Strategy generation error:", error);
        await replyToMessage(
            message,
            `❌ Error generating strategy: ${error.message || "Unknown error"}`
        );
    }
}
