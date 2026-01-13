import { CommandRouter } from "./commandRouter";
import { handleStart } from "./commands/start";

export const commandRouter = new CommandRouter();

// Register commands
commandRouter.register("/start", handleStart);
