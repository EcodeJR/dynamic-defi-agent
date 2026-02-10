import { Message } from "@superdapp/agents";
import { replyToMessage, client } from "../client";
import { createHelpButtons } from "../ui-helpers";

/**
 * /start command - Welcome message with interactive buttons
 */
export async function handleStartCommand(message: Message): Promise<void> {
  console.log("🚀 handleStartCommand triggered for user:", message.senderId);

  // DEBUG: Diagnose connection visibility
  try {
    if (client) {
      console.log("🔍 [DEBUG] Fetching Bot Channels...");
      const channels = await client.getBotChannels();
      console.log("🔍 [DEBUG] Bot Channels:", JSON.stringify(channels, null, 2));
    }
  } catch (e: any) {
    console.error("⚠️ [DEBUG] Failed to fetch bot channels:", e.message);
  }

  const welcomeMessage = `
🤖 ** Welcome to Dynamic DeFi Strategy Agent! **

  I'm an AI-powered agent that helps you generate optimized DeFi strategies based on your goals and risk tolerance.

    ** What I can do:**
📊 Generate custom DeFi strategies
⚖️ Analyze risk vs reward
🧠 Provide AI - powered insights
💰 Simulate execution outcomes

  ** Get Started:**
    1. Set your risk profile using / risk
    2. Choose a strategy goal using / strategy
    3. Review AI analysis and execution plan

Use the buttons below to explore!
  `.trim();

  await replyToMessage(message, welcomeMessage, createHelpButtons());
}
