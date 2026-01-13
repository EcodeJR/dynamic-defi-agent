import { CommandHandler } from "../types/command";

type CommandMap = Record<string, CommandHandler>;

export class CommandRouter {
  private commands: CommandMap = {};

  register(command: string, handler: CommandHandler) {
    this.commands[command] = handler;
  }

  async handle(
    command: string,
    context: Parameters<CommandHandler>[0]
  ) {
    const handler = this.commands[command];

    if (!handler) {
      await context.replyMessage(
        `❓ Unknown command: ${command}`
      );
      return;
    }

    try {
      await handler(context);
    } catch (error) {
      console.error("Command error:", error);
      await context.replyMessage(
        "⚠️ Something went wrong while processing your request."
      );
    }
  }
}
