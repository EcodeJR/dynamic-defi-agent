import { StrategyModel } from "../db/models/Strategy";

/**
 * Fetch strategy history from database
 */
export async function historyCommand(params?: { state?: { userId?: string }; payload?: any }) {
  try {
    const userId = params?.state?.userId || "demo-user";
    const history = await StrategyModel.find({ userId }).sort({ createdAt: -1 }).limit(10);
    return { ok: true, history };
  } catch (error: any) {
    console.error("❌ History fetch error:", error);
    return { ok: false, error: error.message };
  }
}
