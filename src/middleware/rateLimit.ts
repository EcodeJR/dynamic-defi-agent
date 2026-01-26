interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requests = new Map<string, RateLimitEntry>();

export function rateLimit(userId: string | undefined, limit = 10, windowMs = 60000) {
  if (!userId || userId.trim() === "") {
    throw new Error("Invalid userId for rate limiting");
  }

  const now = Date.now();
  const entry = requests.get(userId);

  // Reset if window expired
  if (entry && now > entry.resetAt) {
    requests.delete(userId);
  }

  const current = requests.get(userId);

  if (current && current.count >= limit) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }

  if (current) {
    current.count += 1;
  } else {
    requests.set(userId, {
      count: 1,
      resetAt: now + windowMs,
    });
  }
}
