import mongoose, { Schema, Document } from "mongoose";

export interface StrategyDocument extends Document {
  userId: string;
  goal: string;
  riskProfile: string;
  simulation: {
    estimatedAPY: number;
    volatility: number;
    maxDrawdown: number;
  };
  ai: {
    summary: string;
    recommendation: string;
  };
  createdAt: Date;
}

const StrategySchema = new Schema<StrategyDocument>({
  userId: { type: String, required: true },
  goal: { type: String, required: true },
  riskProfile: { type: String, required: true },

  simulation: {
    estimatedAPY: Number,
    volatility: Number,
    maxDrawdown: Number,
  },

  ai: {
    summary: String,
    recommendation: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const StrategyModel =
  mongoose.models.Strategy ||
  mongoose.model<StrategyDocument>("Strategy", StrategySchema);
