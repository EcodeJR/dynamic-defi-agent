import { Message } from "@superdapp/agents";
import { replyToMessage } from "../client";
import { extractUserId } from "../message-parser";
import { StrategyModel } from "../../db/models/Strategy";

/**
 * /history command - View past strategies
 */
export async function handleHistoryCommand(message: Message): Promise<void> {
    const userId = extractUserId(message);

    try {
        const history = await StrategyModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);

        if (history.length === 0) {
            await replyToMessage(
                message,
                "📜 No strategy history found.\n\nGenerate your first strategy using /strategy"
            );
            return;
        }

        let response = "📜 **Your Strategy History**\n";
        response += "━━━━━━━━━━━━━━━━━━\n\n";

        history.forEach((strategy, index) => {
            const date = new Date(strategy.createdAt).toLocaleDateString();
            response += `${index + 1}. **${strategy.goal}**\n`;
            response += `   Risk: ${strategy.riskProfile} | Date: ${date}\n`;
            response += `   APY: ${strategy.simulation?.estimatedAPY || "N/A"}% | `;
            response += `Status: ${strategy.status}\n\n`;
        });

        response += "Use /strategy to generate a new strategy!";

        await replyToMessage(message, response);

    } catch (error: any) {
        console.error("❌ History fetch error:", error);
        await replyToMessage(
            message,
            "❌ Error fetching history. Please try again later."
        );
    }
}
