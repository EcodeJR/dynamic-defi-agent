import mongoose, { Schema, Document } from "mongoose";

export interface StrategyDocument extends Document {
  userId: string;
  goal: string;
  riskProfile: string;
  plan: any;
  simulation: {
    estimatedAPY: number;
    volatility: number;
    maxDrawdown: number;
  };
  execution: any;
  ai: {
    summary: string;
    recommendation: string;
  };
  audit: {
    generatedAt: number;
    aiVersion: string;
    executionMode: string;
    riskProfile: string;
  };
  status: string;
  createdAt: Date;
}

const StrategySchema = new Schema<StrategyDocument>({
  userId: { type: String, required: true },
  goal: { type: String, required: true },
  riskProfile: { type: String, required: true },

  plan: { type: Schema.Types.Mixed },

  simulation: {
    estimatedAPY: Number,
    volatility: Number,
    maxDrawdown: Number,
  },

  execution: { type: Schema.Types.Mixed },

  ai: {
    summary: String,
    recommendation: String,
  },

  audit: {
    generatedAt: Number,
    aiVersion: String,
    executionMode: String,
    riskProfile: String,
  },

  status: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const StrategyModel =
  mongoose.models.Strategy ||
  mongoose.model<StrategyDocument>("Strategy", StrategySchema);
