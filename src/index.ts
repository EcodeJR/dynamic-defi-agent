import express from "express";
import bodyParser from "body-parser";
import { Agent } from "@superdapp/agents";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

// Initialize SuperDapp Agent
const agent = new Agent({ apiKey: process.env.SUPERDAPP_API_KEY! });

app.post("/webhook", async (req, res) => {
  try {
    await agent.processRequest(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Agent failed:", err);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Webhook server listening on http://localhost:${PORT}`);
});
