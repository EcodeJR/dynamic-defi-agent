import { CommandRouter } from "./commandRouter";
import { handleStart } from "./commands/start";
import { handleRisk } from "./commands/risk";

export const commandRouter = new CommandRouter();

// Register commands
commandRouter.register("/start", handleStart);

commandRouter.register("/risk", handleRisk);
