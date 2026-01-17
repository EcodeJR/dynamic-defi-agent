import { CommandHandler } from "./types";
import { strategyCommand } from "../commands/strategy";
import { setRiskCommand } from "../commands/setRisk";

const commands = new Map<string, CommandHandler>();

const agentState = {
  riskProfile: undefined as "low" | "medium" | "high" | undefined,
};

commands.set("strategy", strategyCommand);
commands.set("set-risk", setRiskCommand);

export async function handleCommand(
  command: string,
  payload?: any
): Promise<string> {
  const handler = commands.get(command);

  if (!handler) {
    throw new Error(`Unknown command: ${command}`);
  }

  return handler({
    state: agentState,
    payload,
    reply: (message: string) => message,
  });
}
