import { AgentState } from "./types";
import { strategyCommand } from "../commands/strategy";
import { setRiskCommand } from "../commands/setRisk";

const agentState: AgentState = {
  userId: "demo-user",
  riskProfile: "medium",
};

const commands: Record<string, Function> = {
  strategy: strategyCommand,
  "set-risk": setRiskCommand,
};

/**
 * Main command handler
 */
export async function handleCommand(params: { state: { userId: string }; payload: any }) {
  const { state, payload } = params;
  const command = payload.command;

  if (!command) {
    return { ok: false, error: "No command specified" };
  }

  const handler = commands[command];
  if (!handler) {
    return { ok: false, error: `Unknown command: ${command}` };
  }

  return handler({
    state: { ...agentState, userId: state.userId },
    payload,
    reply: (message: string) => message,
  });
}
