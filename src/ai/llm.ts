import OpenAI from "openai";

let client: OpenAI | null = null;

/**
 * Get or initialize OpenAI client
 */
function getClient() {
  if (!client) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("Missing OPENROUTER_API_KEY environment variable");
    }

    client = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost",
        "X-Title": "Dynamic DeFi Agent",
      },
    });
  }
  return client;
}

export async function callLLM(prompt: string): Promise<string> {
  const res = await getClient().chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openrouter/auto",
    messages: [
      {
        role: "system",
        content:
          "You are a DeFi risk analyst. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
    max_tokens: 700,
  });

  const content = res.choices?.[0]?.message?.content;

  if (!content || content.trim().length === 0) {
    throw new Error("AI returned empty response");
  }

  return content;
}
