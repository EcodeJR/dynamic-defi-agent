import { RiskProfile } from "../agent/types";

interface UserSession {
    userId: string;
    riskProfile?: RiskProfile;
    lastCommand?: string;
    lastActivity: number;
    createdAt: number;
}

// In-memory session storage (consider Redis for production)
const sessions = new Map<string, UserSession>();

// Session timeout: 24 hours
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

/**
 * Get or create a user session
 */
export function getOrCreateSession(userId: string): UserSession {
    // Clean up expired sessions
    cleanupExpiredSessions();

    if (!sessions.has(userId)) {
        const newSession: UserSession = {
            userId,
            lastActivity: Date.now(),
            createdAt: Date.now(),
        };
        sessions.set(userId, newSession);
        return newSession;
    }

    const session = sessions.get(userId)!;
    session.lastActivity = Date.now();
    return session;
}

/**
 * Update user session
 */
export function updateSession(
    userId: string,
    updates: Partial<UserSession>
): UserSession {
    const session = getOrCreateSession(userId);
    Object.assign(session, updates);
    session.lastActivity = Date.now();
    sessions.set(userId, session);
    return session;
}

/**
 * Get session if exists
 */
export function getSession(userId: string): UserSession | null {
    return sessions.get(userId) || null;
}

/**
 * Delete a session
 */
export function deleteSession(userId: string): boolean {
    return sessions.delete(userId);
}

/**
 * Clean up expired sessions
 */
function cleanupExpiredSessions() {
    const now = Date.now();
    const expiredUsers: string[] = [];

    sessions.forEach((session, userId) => {
        if (now - session.lastActivity > SESSION_TIMEOUT) {
            expiredUsers.push(userId);
        }
    });

    expiredUsers.forEach((userId) => sessions.delete(userId));

    if (expiredUsers.length > 0) {
        console.log(`🧹 Cleaned up ${expiredUsers.length} expired sessions`);
    }
}

/**
 * Get all active sessions count
 */
export function getActiveSessionsCount(): number {
    cleanupExpiredSessions();
    return sessions.size;
}

/**
 * Get session statistics
 */
export function getSessionStats() {
    cleanupExpiredSessions();

    let withRiskProfile = 0;
    let totalSessions = sessions.size;

    sessions.forEach((session) => {
        if (session.riskProfile) withRiskProfile++;
    });

    return {
        total: totalSessions,
        withRiskProfile,
        withoutRiskProfile: totalSessions - withRiskProfile,
    };
}
