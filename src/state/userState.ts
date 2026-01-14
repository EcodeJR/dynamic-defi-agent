export type RiskProfile = "low" | "medium" | "high";

export interface UserState {
  userId: string;

  riskProfile: RiskProfile;

  createdAt: Date;
  updatedAt: Date;
}
