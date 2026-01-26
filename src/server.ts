import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { handleCommand } from "./agent/agent";
import { connectDB } from "./db/connect";
import { historyCommand } from "./commands/history";

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Health check
app.get("/", (_, res) => {
  res.json({ status: "ok", service: "Strategy Agent API" });
});

// Command endpoint
app.post("/command", async (req, res) => {
  try {
    const { command, payload } = req.body;

    if (!command) {
      return res.status(400).json({
        error: "Missing command",
      });
    }

    if (command === "history") {
      const result = await historyCommand();
      return res.json(result);
    }


    const response = await handleCommand(command, payload);

    return res.json({
      ok: true,
      response,
    });
  } catch (err: any) {
    console.error("❌ Command Error:", err);

    return res.status(500).json({
      ok: false,
      error: err?.message || "Internal server error",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
