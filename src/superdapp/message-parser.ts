import { Message } from "@superdapp/agents";

/**
 * Helper to get parsed content from message
 */
function getParsedContent(message: Message): any {
    const body = message.body;
    let parsedBody = body;

    if (typeof body === "string") {
        try {
            parsedBody = JSON.parse(body);
        } catch (e) {
            return body;
        }
    }

    const m = (parsedBody as any)?.m;
    if (typeof m === "string") {
        // Check if it's URL encoded JSON
        if (m.includes("%")) {
            try {
                return JSON.parse(decodeURIComponent(m));
            } catch (e) {
                return m;
            }
        }
        return m;
    }

    return m || parsedBody;
}

/**
 * Extract command from SuperDapp message
 */
export function extractCommand(message: Message): string | null {
    const content = getParsedContent(message);

    // Handle string content or parsed object with body
    let text = "";
    if (typeof content === "string") {
        text = content;
    } else if (typeof content === "object" && content !== null) {
        text = content.body || content.callback_query || "";
    }

    const trimmed = text.trim();
    if (trimmed.startsWith("/")) {
        return trimmed.split(" ")[0].toLowerCase();
    }

    return null;
}

/**
 * Extract text content from SuperDapp message
 */
export function extractText(message: Message): string {
    const content = getParsedContent(message);

    if (typeof content === "string") {
        return content;
    }

    if (typeof content === "object" && content !== null) {
        return content.body || "";
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
