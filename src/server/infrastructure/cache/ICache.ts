/**
 * Interface for cache management
 * Defines the contract for in-memory caching operations
 */
export interface ICache {
  /**
   * Gets the value associated with the specified key
   * @param key - The cache key
   * @returns The cached value or null if not found
   */
  get<T>(key: string): T | null;

  /**
   * Adds the specified key and object to the cache
   * @param key - The cache key
   * @param data - The data to cache
   * @param cacheTime - The life time in seconds (optional)
   */
  set(key: string, data: any, cacheTime?: number): void;

  /**
   * Gets a value indicating whether the value associated with the specified key is cached
   * @param key - The cache key
   * @returns True if the key exists in cache, false otherwise
   */
  isSet(key: string): boolean;

  /**
   * Removes the value with the specified key from the cache
   * @param key - The cache key
   */
  remove(key: string): void;

  /**
   * Removes all entries with keys matching the specified pattern
   * @param pattern - The pattern to match (uses startsWith)
   */
  removeByPattern(pattern: string): void;

  /**
   * Clear all cache data
   */
  clear(): void;
}
