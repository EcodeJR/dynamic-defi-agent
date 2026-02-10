import { getWebhookAgent, type Message } from "./sdk-loader";
import { handleStartCommand } from "./commands/start-adapter";
import { handleRiskCommand } from "./commands/risk-adapter";
import { handleStrategyCommand } from "./commands/strategy-adapter";
import { handleHistoryCommand } from "./commands/history-adapter";
import { handleHelpCommand } from "./commands/help-adapter";
import { extractCommand } from "./message-parser";
import { logEvent } from "../utils/logger";

// Webhook agent instance (initialized asynchronously)
export let webhookAgent: any = null;

/**
 * Register all command handlers
 */
function registerCommands() {
    if (!webhookAgent) {
        throw new Error("Webhook agent not initialized");
    }

    // Start/Welcome command
    webhookAgent.addCommand("/start", handleStartCommand);

    // Risk profile commands
    webhookAgent.addCommand("/risk", handleRiskCommand);
    webhookAgent.addCommand("/set-risk", handleRiskCommand);

    // Strategy generation command
    webhookAgent.addCommand("/strategy", handleStrategyCommand);

    // History command
    webhookAgent.addCommand("/history", handleHistoryCommand);

    // Help command
    webhookAgent.addCommand("/help", handleHelpCommand);

    // Register a generic callback_query handler for interactive buttons
    const callbackHandler = async (message: Message) => {
        console.log("📥 Callback handler triggered directly");
        const command = extractCommand(message);
        if (command) {
            console.log(`🔘 Dispatching command from callback: ${command}`);
            // Manually route to the correct command handler
            if (command === "/strategy") await handleStrategyCommand(message);
            else if (command === "/risk" || command === "/set-risk") await handleRiskCommand(message);
            else if (command === "/history") await handleHistoryCommand(message);
            else if (command === "/help") await handleHelpCommand(message);
            else if (command === "/start") await handleStartCommand(message);
        } else {
            console.log("⚠️ Failed to extract command from callback message:", JSON.stringify(message.body.m));
        }
    };

    webhookAgent.addCommand("callback_query", callbackHandler);

    // Also try to register it directly in the registry if accessible
    if ((webhookAgent as any).registry) {
        (webhookAgent as any).registry.registerCommand("callback_query", callbackHandler);
    }

    const registered = (webhookAgent as any).registry?.getAllCommands?.() || ["unknown"];
    console.log("📋 Registered SuperDapp Commands:", registered);

    logEvent("INFO", "SuperDapp commands registered", {
        commands: registered,
    });
}

/**
 * Handle generic messages (non-commands)
 */
async function handleGenericMessage(message: Message) {
    const { replyToMessage } = await import("./client");

    const helpText = `
👋 Hello! I'm the Dynamic DeFi Strategy Agent.

I didn't understand that message. Here are the commands I support:

📊 /strategy - Generate a DeFi strategy
⚖️ /risk - Set your risk profile
📜 /history - View your past strategies
ℹ️ /help - Show help message

Try using /start to get started!
  `.trim();

    await replyToMessage(message, helpText);
}

/**
 * Initialize webhook agent
 */
export async function initializeWebhookAgent() {
    const WebhookAgent = getWebhookAgent();
    webhookAgent = new WebhookAgent();

    registerCommands();

    // Handle non-command messages
    webhookAgent.onMessage(async (message: Message) => {
        const command = extractCommand(message);
        console.log(`📩 Incoming message detected: command="${command}"`);

        // If command detected, manually dispatch to ensure it runs
        if (command) {
            console.log(`⚡ Command detected: ${command}. Manually dispatching...`);
            if (command === "/start") await handleStartCommand(message);
            else if (command === "/risk" || command === "/set-risk") await handleRiskCommand(message);
            else if (command === "/strategy") await handleStrategyCommand(message);
            else if (command === "/history") await handleHistoryCommand(message);
            else if (command === "/help") await handleHelpCommand(message);
            return;
        }

        // If no command detected, handle as generic message
        console.log("❓ No command detected, handling as generic message");
        await handleGenericMessage(message);
    });

    logEvent("INFO", "SuperDapp webhook agent initialized");
}

/**
 * Process incoming webhook request
 */
export async function processWebhookRequest(body: Message): Promise<void> {
    if (!webhookAgent) {
        throw new Error("Webhook agent not initialized. Call initializeWebhookAgent() first.");
    }

    try {
        await webhookAgent.processRequest(body);
    } catch (error: any) {
        logEvent("ERROR", "Webhook processing error", {
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
}

/**
 * Get webhook agent instance
 */
export function getWebhookAgentInstance() {
    return webhookAgent;
}
