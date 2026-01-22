import { buildPrompt } from "./prompts";
import { callLLM } from "./llm";
import { AIReasoningInput, AIReasoningOutput } from "./types";

export async function runAIReasoning(
  input: AIReasoningInput
): Promise<AIReasoningOutput> {
  try {
    const prompt = buildPrompt(input);
    const raw = await callLLM(prompt);

    return JSON.parse(raw);
  } catch (err) {
    console.warn("⚠️ AI fallback triggered:", err);

    return {
      summary: "AI analysis unavailable. Using heuristic evaluation.",
      strengths: ["Strategy structure is valid"],
      risks: ["AI model did not return a response"],
      recommendation: "caution",
    };
  }
}
