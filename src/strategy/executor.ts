import { ExecutionIntent } from "./executionEngine";

export interface ExecutionResult {
  status: "success" | "blocked";
  executedSteps: string[];
  skippedSteps: string[];
  reason?: string;
}

export async function executeStrategy(
  execution: ExecutionIntent
): Promise<ExecutionResult> {
  if (execution.readiness === "blocked") {
    return {
      status: "blocked",
      executedSteps: [],
      skippedSteps: execution.steps.map(
        (s) => `${s.action} (${s.asset})`
      ),
      reason: "Execution blocked due to risk warnings",
    };
  }

  const executedSteps: string[] = [];
  const skippedSteps: string[] = [];

  for (const step of execution.steps) {
    // Simulated execution logic
    executedSteps.push(
      `${step.action} ${step.asset} (${step.allocation}%)`
    );
  }

  return {
    status: "success",
    executedSteps,
    skippedSteps,
  };
}
