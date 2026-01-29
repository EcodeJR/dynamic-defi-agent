import { Message, MessageContent } from "@superdapp/agents";

/**
 * Extract command from SuperDapp message
 */
export function extractCommand(message: Message): string | null {
    const content = message.body.m;

    // Handle string content
    if (typeof content === "string") {
        const trimmed = content.trim();
        if (trimmed.startsWith("/")) {
            return trimmed.split(" ")[0].toLowerCase();
        }
    }

    // Handle callback_query object
    if (typeof content === "object" && content.body) {
        const body = content.body as any;
        if (typeof body === "object" && body.callback_query) {
            const trimmed = body.callback_query.trim();
            if (trimmed.startsWith("/")) {
                return trimmed.split(" ")[0].toLowerCase();
            }
        }
    }

    return null;
}

/**
 * Extract text content from SuperDapp message
 */
export function extractText(message: Message): string {
    const content = message.body.m;

    if (typeof content === "string") {
        return content;
    }

    if (typeof content === "object" && content.body) {
        if (typeof content.body === "string") {
            return content.body;
        }
    }

    return "";
}

/**
 * Extract callback data from button click
 */
export function extractCallbackData(message: Message): string | null {
    const content = message.body.m;

    if (typeof content === "object" && content.body) {
        if (typeof content.body === "object" && "callback_query" in content.body) {
            return content.body.callback_query as string;
        }
    }

    return null;
}

/**
 * Parse command arguments from message text
 */
export function parseCommandArgs(message: Message): string[] {
    const text = extractText(message);
    const parts = text.trim().split(/\s+/);

    // Remove command itself, return remaining args
    return parts.slice(1);
}

/**
 * Extract user ID from message
 */
export function extractUserId(message: Message): string {
    return message.senderId || message.memberId || "unknown";
}

/**
 * Extract channel/room ID from message
 */
export function extractRoomId(message: Message): string {
    return message.channelId || "dm";
}
