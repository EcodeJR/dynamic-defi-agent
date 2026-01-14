import { UserState } from "./userState";

class UserStore {
  private users = new Map<string, UserState>();

  get(userId: string): UserState {
    const existing = this.users.get(userId);

    if (existing) return existing;

    const now = new Date();
    const newUser: UserState = {
      userId,
      riskProfile: "medium", // safe default
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(userId, newUser);
    return newUser;
  }

  update(userId: string, updates: Partial<UserState>) {
    const user = this.get(userId);

    const updated: UserState = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };

    this.users.set(userId, updated);
    return updated;
  }
}

export const userStore = new UserStore();
