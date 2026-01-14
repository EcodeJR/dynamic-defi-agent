import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { handleCommand } from "./agent/agent";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

app.post("/command", async (req, res) => {
  const { command, payload } = req.body ?? {};

  if (!command) {
    return res.status(400).json({ error: "Missing command" });
  }

  try {
    const response = await handleCommand(command, payload);
    res.json({ ok: true, response });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
