import { StrategyModel } from "../db/models/Strategy";

export async function historyCommand() {
  const history = await StrategyModel.find()
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    ok: true,
    data: history,
  };
}
