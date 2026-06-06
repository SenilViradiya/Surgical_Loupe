// Lightweight in-memory cache for inventory snapshot. For production, swap to Redis.

const CACHE: Map<string, { value: any; expiresAt: number }> = new Map();

export function getCachedInventory<T>(key: string) {
  const item = CACHE.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    CACHE.delete(key);
    return null;
  }
  return item.value as T;
}

export function setCachedInventory<T>(key: string, value: T, ttlMs = 1000 * 60) {
  CACHE.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function invalidateInventoryCache(key: string) {
  CACHE.delete(key);
}
