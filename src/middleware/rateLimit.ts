const requests = new Map<string, number>();

export function rateLimit(userId: string, limit = 10) {
  const count = requests.get(userId) || 0;

  if (count >= limit) {
    throw new Error("Rate limit exceeded");
  }

  requests.set(userId, count + 1);
}
