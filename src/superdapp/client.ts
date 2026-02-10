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

    try {
        const info = await client.getBotInfo();
        console.log("🤖 SuperDapp Bot Info:", JSON.stringify(info, null, 2));
    } catch (e: any) {
        console.warn("⚠️ Could not fetch bot info:", e.message);
    }

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

    console.log(`📡 [LIVE] Sending Channel/Chat Message to ${channelId}...`);
    try {
        const messageBody: any = { body: text };

        if (replyMarkup) {
            messageBody.reply_markup = replyMarkup;
        }

        const response = await getClient().sendChannelMessage(channelId, {
            message: messageBody,
            isSilent: false,
        });
        console.log(`✅ [LIVE] Channel Message Sent! Response:`, JSON.stringify(response, null, 2));
        return response;
    } catch (error: any) {
        console.error("❌ Failed to send channel message:", error.message);
        throw error;
    }
}

/**
 * Send a direct message to a user or chat
 */
export async function sendDirectMessage(
    recipientId: string,
    text: string,
    replyMarkup?: any
) {
    const apiToken = process.env.SUPERDAPP_API_KEY || "";
    const currentMockMode = process.env.MOCK_SUPERDAPP === "true" ||
        !apiToken ||
        apiToken === "your_api_key_here" ||
        apiToken === "mock";

    if (currentMockMode) {
        console.log(`[MOCK] Sending Direct Message to ${recipientId}:`);
        console.log(`> Text: ${text}`);
        if (replyMarkup) console.log(`> UI:`, JSON.stringify(replyMarkup, null, 2));
        return { success: true, mock: true };
    }

    console.log(`📡 [LIVE] Sending Direct Message to ${recipientId}...`);
    try {
        const messageBody: any = { body: text };

        if (replyMarkup) {
            messageBody.reply_markup = replyMarkup;
        }

        // recipientId could be a userId or a chatId for connections API
        const response = await client.sendConnectionMessage(recipientId, {
            message: messageBody,
            isSilent: false,
        });
        console.log(`✅ [LIVE] Direct Message Sent! Response:`, JSON.stringify(response, null, 2));
        return response;
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
    // If it's a channel, use sendChannelMessage
    if (message.isChannel === true || (message.channelId && !message.chatId)) {
        const channelId = message.channelId || message.chatId;
        return sendChannelMessage(channelId, text, replyMarkup);
    }

    // Otherwise it's a DM or direct chat.
    // SuperDapp usually expects the userId (senderId) as the identifier for connection messages
    // but the payload provides a chatId which is a hybrid ID.
    const senderId = message.senderId || message.userId;
    const chatId = message.chatId;
    const memberId = message.memberId; // Bot's own ID in this context

    // Never reply to ourselves
    if (senderId === memberId) {
        console.log("⏭️ Skipping reply to self");
        return { success: true, skipped: true };
    }

    // PRIORITY 1: Swapped order (Bot-User) - Proven to work for replies
    // PRIORITY 2: The exact chatId from the webhook (User-Bot order)
    // PRIORITY 3: senderId alone

    const attempts = [
        { id: (memberId && senderId) ? `${memberId}-${senderId}` : null, label: "swapped Bot-User ID" },
        { id: chatId, label: "raw chatId" },
        { id: senderId, label: "senderId" }
    ];

    let lastError = null;

    for (const attempt of attempts) {
        if (!attempt.id) continue;

        try {
            return await sendDirectMessage(attempt.id, text, replyMarkup);
        } catch (e: any) {
            console.log(`📡 [REPLY] ${attempt.label} failed: ${e.message}`);
            lastError = e;
        }
    }

    // Final fallback: Try treating chatId as a CHANNEL
    try {
        return await sendChannelMessage(chatId, text, replyMarkup);
    } catch (e4: any) {
        console.error("❌ All reply attempts failed!");
        throw lastError || e4;
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
