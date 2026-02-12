import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  data: string;
  headers: Record<string, string>;
  status: number;
  expiry: number;
}

const MAX_CACHE_ENTRIES = parseInt(process.env.API_CACHE_MAX_ENTRIES || '500', 10);
const cache = new Map<string, CacheEntry>();

/**
 * Simple in-memory cache middleware for GET requests.
 * Reduces database load for frequently accessed public endpoints.
 * @param durationSeconds Cache duration in seconds (default: 60)
 */
export function apiCache(durationSeconds: number = 60) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      next();
      return;
    }

    // Don't cache authenticated requests (personalized data)
    if (req.headers.authorization) {
      next();
      return;
    }

    const key = `${req.originalUrl || req.url}`;
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      res.status(cached.status);
      Object.entries(cached.headers).forEach(([k, v]) => res.setHeader(k, v));
      res.setHeader('X-Cache', 'HIT');
      res.send(cached.data);
      return;
    }

    // Capture the response
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entry: CacheEntry = {
          data: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
          status: res.statusCode,
          expiry: Date.now() + durationSeconds * 1000,
        };
        cache.set(key, entry);

        // Evict old entries periodically
        if (cache.size > MAX_CACHE_ENTRIES) {
          const now = Date.now();
          for (const [k, v] of cache.entries()) {
            if (v.expiry < now) cache.delete(k);
          }
        }
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}

/**
 * Clear all cache entries. Useful after write operations.
 */
export function clearCache(): void {
  cache.clear();
}
