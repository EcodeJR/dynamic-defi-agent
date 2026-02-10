import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./db/connect";
import { handleCommand } from "./agent/agent";
import { historyCommand } from "./commands/history";
import { logEvent } from "./utils/logger";
import { initializeSuperdappSDK, initializeWebhookAgent, initializeClient, processWebhookRequest } from "./superdapp";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Strategy Agent API" });
});

// SuperDapp webhook endpoint
// Shared Webhook Handler
const webhookHandler = async (req: express.Request, res: express.Response) => {
  try {
    console.log("📥 Raw Webhook Payload:", JSON.stringify(req.body, null, 2));

    // Robustly handle stringified body from live webhooks
    const payload = { ...req.body };
    if (typeof payload.body === 'string') {
      try {
        payload.body = JSON.parse(payload.body);
        console.log("✅ Parsed nested body field successfully");
      } catch (e) {
        console.log("⚠️ Failed to parse nested body field");
      }
    }

    logEvent("INFO", "Webhook request received", {
      messageId: payload.id,
      senderId: payload.senderId,
    });

    await processWebhookRequest(payload);

    res.status(200).json({ success: true });
  } catch (error: any) {
    logEvent("ERROR", "Webhook processing error", { error: error.message });
    res.status(500).json({ error: error.message });
  }
};

// SuperDapp webhook endpoints (Support both /webhook and root /)
app.post("/webhook", webhookHandler);
app.post("/", webhookHandler);

// Legacy command endpoint (for backward compatibility)
app.post("/command", async (req, res) => {
  try {
    const { command, userId, payload } = req.body;

    if (!command || !userId) {
      return res.status(400).json({ error: "Missing command or userId" });
    }

    logEvent("INFO", "Command received", { command, userId });

    let result;
    if (command === "history") {
      result = await historyCommand({ state: { userId }, payload });
    } else {
      result = await handleCommand({ state: { userId }, payload: { command, ...payload } });
    }

    res.json(result);
  } catch (error: any) {
    logEvent("ERROR", "Command error", { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  try {
    // 1. Connect database
    await connectDB();

    // 2. Initialize SuperDapp SDK (Dynamic import for ESM compatibility)
    await initializeSuperdappSDK();

    // 3. Initialize SuperDapp API Client
    await initializeClient();

    // 4. Initialize SuperDapp Webhook Agent
    await initializeWebhookAgent();

    logEvent("INFO", "SuperDapp system initialized");

    app.listen(PORT, () => {
      logEvent("INFO", "Server started", { port: PORT });
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
      console.log(`🔧 Legacy API: http://localhost:${PORT}/command`);
    });
  } catch (error: any) {
    logEvent("ERROR", "Server startup failed", { error: error.message });
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
