export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  hit(key: string): RateLimitResult;
}

interface RateLimitOptions {
  /** Peticiones permitidas por ventana. */
  limit: number;
  windowMs: number;
  now?: () => number;
}

const PRUNE_THRESHOLD = 5_000;

/**
 * Ventana deslizante en memoria. Con varias instancias serverless cada una cuenta
 * por separado: en producción habría que usar un almacén compartido (Redis, KV).
 */
export function createRateLimiter({ limit, windowMs, now = Date.now }: RateLimitOptions): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    hit(key) {
      const current = now();
      const recent = (hits.get(key) ?? []).filter((timestamp) => current - timestamp < windowMs);

      if (recent.length >= limit) {
        hits.set(key, recent);
        const oldest = recent[0] ?? current;
        return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (current - oldest)) / 1000) };
      }

      recent.push(current);
      hits.set(key, recent);

      if (hits.size > PRUNE_THRESHOLD) {
        for (const [otherKey, timestamps] of hits) {
          if (timestamps.every((timestamp) => current - timestamp >= windowMs)) hits.delete(otherKey);
        }
      }
      return { allowed: true, retryAfterSeconds: 0 };
    },
  };
}
