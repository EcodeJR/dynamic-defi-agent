import mongoose from "mongoose";

const ExecutionSchema = new mongoose.Schema({
  strategyId: String,
  wallet: String,
  chain: String,

  steps: Array,
  result: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const ExecutionModel = mongoose.model(
  "Execution",
  ExecutionSchema
);
