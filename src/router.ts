import { CommandHandler } from "./agent/types";

const commandRegistry = new Map<string, CommandHandler>();

export function registerCommand(
  name: string,
  handler: CommandHandler
) {
  commandRegistry.set(name, handler);
}

export function getCommand(name: string): CommandHandler | undefined {
  return commandRegistry.get(name);
}
