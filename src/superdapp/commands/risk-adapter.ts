import { Message } from "@superdapp/agents";
import { replyToMessage } from "../client";
import { createRiskButtons } from "../ui-helpers";
import { getOrCreateSession, updateSession } from "../session-manager";
import { extractUserId, parseCommandArgs, extractCallbackData } from "../message-parser";

/**
 * /set-risk or /risk command - Set user risk profile
 */
export async function handleRiskCommand(message: Message): Promise<void> {
    const userId = extractUserId(message);

    // Check if this is a callback from button click
    const callbackData = extractCallbackData(message);
    let risk: string | null = null;

    if (callbackData) {
        // Extract risk from callback: "/set-risk low"
        const parts = callbackData.split(" ");
        risk = parts[1] || null;
    } else {
        // Extract from command args
        const args = parseCommandArgs(message);
        risk = args[0] || null;
    }

    // If no risk provided, show buttons
    if (!risk) {
        const promptMessage = `
⚖️ **Set Your Risk Profile**

Choose your risk tolerance level:

🟢 **Low Risk** - Conservative, capital preservation focus
🟡 **Medium Risk** - Balanced growth and safety
🔴 **High Risk** - Aggressive growth, higher volatility

Select your preference:
    `.trim();

        await replyToMessage(message, promptMessage, createRiskButtons());
        return;
    }

    // Validate risk level
    const validRisks = ["low", "medium", "high"];
    if (!validRisks.includes(risk.toLowerCase())) {
        await replyToMessage(
            message,
            "❌ Invalid risk level. Please choose: low, medium, or high"
        );
        return;
    }

    // Update session
    updateSession(userId, {
        riskProfile: risk.toLowerCase() as "low" | "medium" | "high",
    });

    const riskEmoji = {
        low: "🟢",
        medium: "🟡",
        high: "🔴",
    }[risk.toLowerCase()];

    await replyToMessage(
        message,
        `✅ Risk profile set to: ${riskEmoji} **${risk.toUpperCase()}**\n\nYou can now generate strategies using /strategy`
    );
}
