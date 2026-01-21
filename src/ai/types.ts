export interface AIReasoningInput {
  goal: string;
  riskProfile: "low" | "medium" | "high";
  plan: any;
  simulation: any;
}

export interface AIReasoningOutput {
  summary: string;
  strengths: string[];
  risks: string[];
  recommendation: "proceed" | "caution" | "reject";
}
