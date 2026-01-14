import { CommandHandler } from "../agent/types";

export const startCommand: CommandHandler = async ({ reply }) => {
  return reply("👋 Welcome! I am your Dynamic DeFi Strategy Assistant.");
};
