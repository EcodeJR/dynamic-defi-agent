import { getSuperdappClient, type BotConfig } from "./sdk-loader";

export let client: any = null;
let isMockMode = false;

/**
 * Initialize the SuperDapp client
 */
export async function initializeClient() {
    const SuperDappClient = getSuperdappClient();

    const apiToken = process.env.SUPERDAPP_API_KEY || "";
    // Explicit mock mode via env var, or fallback to checking placeholder
    isMockMode = process.env.MOCK_SUPERDAPP === "true" ||
        !apiToken ||
        apiToken === "your_api_key_here" ||
        apiToken === "mock";

    if (isMockMode) {
        console.log("⚠️ SuperDapp Client running in MOCK mode (local testing)");
    }

    const config: BotConfig = {
        apiToken: apiToken,
        baseUrl: process.env.SUPERDAPP_BASE_URL || "https://api.superdapp.ai",
    };

    client = new SuperDappClient(config);
    return client;
}

/**
 * Get the client instance
 */
function getClient() {
    if (!client) {
        throw new Error("SuperDapp client not initialized. Call initializeClient() first.");
    }
    return client;
}

/**
 * Send a message to a channel
 */
export async function sendChannelMessage(
    channelId: string,
    text: string,
    replyMarkup?: any
) {
    const apiToken = process.env.SUPERDAPP_API_KEY || "";
    const currentMockMode = process.env.MOCK_SUPERDAPP === "true" ||
        !apiToken ||
        apiToken === "your_api_key_here" ||
        apiToken === "mock";

    if (currentMockMode) {
        console.log(`[MOCK] Sending Channel Message to ${channelId}:`);
        console.log(`> Text: ${text}`);
        if (replyMarkup) console.log(`> UI:`, JSON.stringify(replyMarkup, null, 2));
        return { success: true, mock: true };
    }

    try {
        const messageBody: any = { body: text };

        if (replyMarkup) {
            messageBody.reply_markup = replyMarkup;
        }

        return await getClient().sendChannelMessage(channelId, {
            message: messageBody,
            isSilent: false,
        });
    } catch (error: any) {
        console.error("❌ Failed to send channel message:", error.message);
        throw error;
    }
}

/**
 * Send a direct message to a user
 */
export async function sendDirectMessage(
    userId: string,
    text: string,
    replyMarkup?: any
) {
    const apiToken = process.env.SUPERDAPP_API_KEY || "";
    const currentMockMode = process.env.MOCK_SUPERDAPP === "true" ||
        !apiToken ||
        apiToken === "your_api_key_here" ||
        apiToken === "mock";

    if (currentMockMode) {
        console.log(`[MOCK] Sending Direct Message to ${userId}:`);
        console.log(`> Text: ${text}`);
        if (replyMarkup) console.log(`> UI:`, JSON.stringify(replyMarkup, null, 2));
        return { success: true, mock: true };
    }

    try {
        const messageBody: any = { body: text };

        if (replyMarkup) {
            messageBody.reply_markup = replyMarkup;
        }

        return await client.sendConnectionMessage(userId, {
            message: messageBody,
            isSilent: false,
        });
    } catch (error: any) {
        console.error("❌ Failed to send direct message:", error.message);
        throw error;
    }
}

/**
 * Reply to a message in the same channel/chat
 */
export async function replyToMessage(
    message: any,
    text: string,
    replyMarkup?: any
) {
    const channelId = message.channelId;

    if (channelId) {
        return sendChannelMessage(channelId, text, replyMarkup);
    } else {
        const userId = message.senderId || message.memberId;
        return sendDirectMessage(userId, text, replyMarkup);
    }
}

/**
 * Get bot information
 */
export async function getBotInfo() {
    if (isMockMode) {
        return {
            bot_info: { id: "mock-bot", name: "Mock DeFi Agent", isActive: true },
            user: { id: "mock-user", username: "mockbot" }
        };
    }

    try {
        return await client.getBotInfo();
    } catch (error: any) {
        console.error("❌ Failed to get bot info:", error.message);
        throw error;
    }
}
