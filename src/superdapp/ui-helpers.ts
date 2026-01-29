import { ReplyMarkup } from "@superdapp/agents";

/**
 * Create interactive buttons for strategy goal selection
 */
export function createStrategyButtons(): ReplyMarkup {
    return {
        type: "buttons",
        actions: [
            [
                {
                    text: "🛡️ Capital Preservation",
                    callback_data: "/strategy capital_preservation",
                },
                {
                    text: "💰 Yield Generation",
                    callback_data: "/strategy yield_generation",
                },
            ],
            [
                {
                    text: "📈 Balanced Growth",
                    callback_data: "/strategy balanced_growth",
                },
                {
                    text: "🚀 Aggressive Growth",
                    callback_data: "/strategy aggressive_growth",
                },
            ],
        ],
    };
}

/**
 * Create interactive buttons for risk profile selection
 */
export function createRiskButtons(): ReplyMarkup {
    return {
        type: "buttons",
        actions: [
            [
                { text: "🟢 Low Risk", callback_data: "/set-risk low" },
                { text: "🟡 Medium Risk", callback_data: "/set-risk medium" },
                { text: "🔴 High Risk", callback_data: "/set-risk high" },
            ],
        ],
    };
}

/**
 * Create help menu buttons
 */
export function createHelpButtons(): ReplyMarkup {
    return {
        type: "buttons",
        actions: [
            [
                { text: "📊 Generate Strategy", callback_data: "/strategy" },
                { text: "⚖️ Set Risk Profile", callback_data: "/risk" },
            ],
            [
                { text: "📜 View History", callback_data: "/history" },
                { text: "ℹ️ Help", callback_data: "/help" },
            ],
        ],
    };
}

/**
 * Format strategy response with markdown
 */
export function formatStrategyResponse(data: {
    goal: string;
    riskProfile: string;
    strategyType: string;
    apy: number;
    drawdown: number;
    score: number;
    aiSummary: string;
    recommendation: string;
    steps: Array<{ action: string; asset: string; amount: number }>;
}): string {
    let response = `📊 **Strategy Analysis**\n`;
    response += `━━━━━━━━━━━━━━━━━━\n\n`;
    response += `🎯 **Goal:** ${data.goal}\n`;
    response += `⚖️ **Risk:** ${data.riskProfile}\n`;
    response += `🏆 **Strategy:** ${data.strategyType.toUpperCase()}\n\n`;
    response += `📈 **APY:** ${data.apy}%\n`;
    response += `📉 **Max Drawdown:** ${data.drawdown}%\n`;
    response += `📊 **Score:** ${data.score}/100\n\n`;
    response += `🧠 **AI Analysis:**\n${data.aiSummary}\n\n`;
    response += `🧭 **Recommendation:** ${data.recommendation}\n\n`;
    response += `📋 **Execution Plan:**\n`;

    data.steps.forEach((step, i) => {
        response += `${i + 1}. ${step.action} → ${step.asset} (${step.amount}%)\n`;
    });

    return response;
}
