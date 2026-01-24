import { StrategyGoal } from "./types";

type RiskLevel = "low" | "medium" | "high";

interface SimulationResult {
  estimatedAPY: number;
  volatility: number;
  maxDrawdown: number;
}

export function scoreStrategy(
  goal: StrategyGoal,
  risk: RiskLevel,
  simulation: SimulationResult
) {
  const weights = {
    low: { return: 0.7, volatility: 0.8, drawdown: 1.0 },
    medium: { return: 1.0, volatility: 0.6, drawdown: 0.7 },
    high: { return: 1.3, volatility: 0.4, drawdown: 0.4 },
  };

  const w = weights[risk];

  const rawScore =
    simulation.estimatedAPY * w.return -
    simulation.volatility * w.volatility -
    simulation.maxDrawdown * w.drawdown;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const confidence = Math.min(
    1,
    score / 100 + (risk === "high" ? 0.1 : 0)
  );

  const reasoning = [
    `Expected APY: ${simulation.estimatedAPY}%`,
    `Volatility impact: -${simulation.volatility * w.volatility}`,
    `Drawdown impact: -${simulation.maxDrawdown * w.drawdown}`,
    `Risk profile: ${risk}`,
  ];

  return {
    score,
    confidence,
    reasoning,
  };
}
