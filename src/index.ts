import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
configDotenv();
const app = express();

app.use(bodyParser.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

app.post("/webhook", async (req: Request, res: Response) => {
  console.log("Webhook received:", req.body);
  res.json({ status: "received" });
});

// ------------- Test Command Handling --------------

import { commandRouter } from "./agent";

app.post("/command", async (req, res) => {
  const command = req.body?.command;

  if (!command) {
  return res.status(400).json({
    error: "Missing 'command' in request body",
  });
}


  await commandRouter.handle(command, {
    replyMessage: async (msg: string) => {
      console.log("AGENT:", msg);
    },
  });

  res.json({ ok: true });
});

// --------------------------------------------------


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
