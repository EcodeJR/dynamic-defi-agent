import { Message } from "@superdapp/agents";
import { replyToMessage } from "../client";
import { createHelpButtons } from "../ui-helpers";

/**
 * /help command - Show available commands
 */
export async function handleHelpCommand(message: Message): Promise<void> {
    const helpMessage = `
🤖 **Dynamic DeFi Strategy Agent - Help**

**Available Commands:**

📊 **/strategy** - Generate a DeFi strategy
   Choose from 4 strategy goals based on your objectives

⚖️ **/risk** - Set your risk profile
   Options: Low, Medium, High

📜 **/history** - View your past strategies
   See your last 5 generated strategies

ℹ️ **/help** - Show this help message

🚀 **/start** - Show welcome message

**How to Use:**
1. Set your risk profile: /risk
2. Generate a strategy: /strategy
3. Review AI analysis and recommendations
4. View your history: /history

**Interactive Buttons:**
Use the buttons below for quick access!
  `.trim();

    await replyToMessage(message, helpMessage, createHelpButtons());
}
