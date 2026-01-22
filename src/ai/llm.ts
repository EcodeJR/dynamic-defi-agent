import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function callLLM(prompt: string): Promise<string> {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a DeFi risk analyst." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2,
  });

  return res.choices[0].message.content!;
}
