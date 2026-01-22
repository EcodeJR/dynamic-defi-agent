import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { handleCommand } from "./agent/agent";
import { connectDB } from "./db/connect";

connectDB();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

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
