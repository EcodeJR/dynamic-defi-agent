import { buildPrompt } from "./prompts";
import { callLLM } from "./llm";
import { AIReasoningInput, AIReasoningOutput } from "./types";

export async function runAIReasoning(
  input: AIReasoningInput
): Promise<AIReasoningOutput> {

  const prompt = buildPrompt(input);
  const raw = await callLLM(prompt);

  try {
    return JSON.parse(raw) as AIReasoningOutput;
  } catch {
    return {
      summary: "AI analysis failed to parse.",
      strengths: [],
      risks: ["Model returned invalid JSON"],
      recommendation: "caution",
    };
  }
}
