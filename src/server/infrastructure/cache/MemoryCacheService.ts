import NodeCache from 'node-cache';
import { ICache } from './ICache';

/**
 * Implementation of in-memory cache using node-cache
 * Provides caching functionality for Service layer
 */
export class MemoryCacheService implements ICache {
  private cache: NodeCache;
  private readonly defaultCacheTime: number;

  /**
   * Creates a new instance of MemoryCacheService
   * @param cacheTime - The default life time in seconds (default: 3600 = 1 hour)
   */
  constructor(cacheTime: number = 3600) {
    this.defaultCacheTime = cacheTime;
    this.cache = new NodeCache({
      stdTTL: cacheTime,
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: true, // Clone objects to prevent external modifications
    });
  }

  /**
   * Gets the value associated with the specified key
   * @param key - The cache key
   * @returns The cached value or null if not found
   */
  get<T>(key: string): T | null {
    const value = this.cache.get<T>(key);
    return value !== undefined ? value : null;
  }

  /**
   * Adds the specified key and object to the cache
   * @param key - The cache key
   * @param data - The data to cache
   * @param cacheTime - The life time in seconds (optional)
   */
  set(key: string, data: any, cacheTime?: number): void {
    if (data === null || data === undefined) {
      return;
    }

    const ttl = cacheTime ?? this.defaultCacheTime;
    this.cache.set(key, data, ttl);
  }

  /**
   * Gets a value indicating whether the value associated with the specified key is cached
   * @param key - The cache key
   * @returns True if the key exists in cache, false otherwise
   */
  isSet(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes the value with the specified key from the cache
   * @param key - The cache key
   */
  remove(key: string): void {
    this.cache.del(key);
  }

  /**
   * Removes all entries with keys matching the specified pattern
   * @param pattern - The pattern to match (uses startsWith)
   */
  removeByPattern(pattern: string): void {
    const keys = this.cache.keys();
    const keysToRemove = keys.filter(key => key.startsWith(pattern));
    
    if (keysToRemove.length > 0) {
      this.cache.del(keysToRemove);
    }
  }

  /**
   * Clear all cache data
   */
  clear(): void {
    this.cache.flushAll();
  }

  /**
   * Get cache statistics
   * @returns Object containing cache stats
   */
  getStats() {
    return this.cache.getStats();
  }
}
