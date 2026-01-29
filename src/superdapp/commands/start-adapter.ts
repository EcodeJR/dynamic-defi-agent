import { Message } from "@superdapp/agents";
import { replyToMessage } from "../client";
import { createHelpButtons } from "../ui-helpers";

/**
 * /start command - Welcome message with interactive buttons
 */
export async function handleStartCommand(message: Message): Promise<void> {
    const welcomeMessage = `
🤖 **Welcome to Dynamic DeFi Strategy Agent!**

I'm an AI-powered agent that helps you generate optimized DeFi strategies based on your goals and risk tolerance.

**What I can do:**
📊 Generate custom DeFi strategies
⚖️ Analyze risk vs. reward
🧠 Provide AI-powered insights
💰 Simulate execution outcomes

**Get Started:**
1. Set your risk profile using /risk
2. Choose a strategy goal using /strategy
3. Review AI analysis and execution plan

Use the buttons below to explore!
  `.trim();

    await replyToMessage(message, welcomeMessage, createHelpButtons());
}
