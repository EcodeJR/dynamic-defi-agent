import mongoose from "mongoose";
import { StrategyModel } from "../src/db/models/Strategy";

describe("Database connection", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should save strategy to DB", async () => {
    const doc = await StrategyModel.create({
      goal: "yield",
      riskProfile: "medium",
      plan: {},
      simulation: {},
      execution: {},
      aiSummary: "test",
      aiRecommendation: "proceed",
      status: "simulated",
    });

    expect(doc._id).toBeDefined();
  });
});
