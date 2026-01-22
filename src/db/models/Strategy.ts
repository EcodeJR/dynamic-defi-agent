import mongoose from "mongoose";

const StrategySchema = new mongoose.Schema({
  goal: String,
  riskProfile: String,

  plan: Object,
  simulation: Object,
  execution: Object,

  aiSummary: String,
  aiRecommendation: String,

  status: {
    type: String,
    enum: ["simulated", "executed", "failed"],
    default: "simulated",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const StrategyModel = mongoose.model(
  "Strategy",
  StrategySchema
);
