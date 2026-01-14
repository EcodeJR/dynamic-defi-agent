import { CommandHandler } from "./types";
import { agentState } from "./state";

import { startCommand } from "../commands/start";
import { setRiskCommand } from "../commands/setRisk";

const commands: Record<string, CommandHandler> = {
  start: startCommand,
  "set-risk": setRiskCommand,
};

export async function handleCommand(command: string, payload?: any) {
  const handler = commands[command];

  if (!handler) {
    throw new Error(`Unknown command: ${command}`);
  }

  return handler({
    state: agentState,
    payload,
    reply: (msg: string) => msg,
  });
}
