type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitStore?: Map<string, RateLimitEntry>;
};

const store =
  globalForRateLimit.rateLimitStore ??
  new Map<string, RateLimitEntry>();

globalForRateLimit.rateLimitStore = store;

export function enforceRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + config.windowMs;

    store.set(key, {
      count: 1,
      resetAt,
    });

    return {
      success: true,
      remaining: config.limit - 1,
      resetAt,
    };
  }

  if (current.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;

  store.set(key, current);

  return {
    success: true,
    remaining: config.limit - current.count,
    resetAt: current.resetAt,
  };
}