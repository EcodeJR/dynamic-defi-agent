import { createRequire } from "module";
const sdkRequire = createRequire(__filename);

let SuperDappClient: any;
let WebhookAgent: any;
let SuperDappAgent: any;

/**
 * Initialize SuperDapp SDK (must be called before using any SDK features)
 */
export async function initializeSuperdappSDK() {
    try {
        // Force load as CommonJS using require because the package is misconfigured
        // (It has "type": "module" but contains CJS code)
        const sdk = sdkRequire("@superdapp/agents");

        SuperDappClient = sdk.SuperDappClient;
        WebhookAgent = sdk.WebhookAgent;
        SuperDappAgent = sdk.SuperDappAgent;

        console.log("✅ SuperDapp SDK loaded successfully via CommonJS interop");
        return sdk;
    } catch (error: any) {
        console.error("❌ Failed to load SuperDapp SDK:", error.message);
        throw error;
    }
}

/**
 * Get SuperDappClient class
 */
export function getSuperdappClient() {
    if (!SuperDappClient) {
        throw new Error("SuperDapp SDK not initialized. Call initializeSuperdappSDK() first.");
    }
    return SuperDappClient;
}

/**
 * Get WebhookAgent class
 */
export function getWebhookAgent() {
    if (!WebhookAgent) {
        throw new Error("SuperDapp SDK not initialized. Call initializeSuperdappSDK() first.");
    }
    return WebhookAgent;
}

/**
 * Get SuperDappAgent class
 */
export function getSuperdappAgent() {
    if (!SuperDappAgent) {
        throw new Error("SuperDapp SDK not initialized. Call initializeSuperdappSDK() first.");
    }
    return SuperDappAgent;
}

// Export types (these are available at compile time)
export type {
    Message,
    MessageData,
    BotConfig,
    ReplyMarkup,
    MessageContent,
    CommandHandler
} from "@superdapp/agents";
