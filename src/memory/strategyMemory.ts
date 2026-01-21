import { StrategyRecord } from "./types";

const strategyStore: StrategyRecord[] = [];

export function saveStrategy(record: StrategyRecord) {
  strategyStore.push(record);
}

export function getAllStrategies() {
  return strategyStore;
}

export function getLastStrategy() {
  return strategyStore[strategyStore.length - 1];
}
