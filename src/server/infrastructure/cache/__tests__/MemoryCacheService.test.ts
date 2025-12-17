/**
 * MemoryCacheService Unit Tests
 * Tests pentru cache implementation
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryCacheService } from '@/server/infrastructure/cache/MemoryCacheService';

describe('MemoryCacheService', () => {
  let cacheService: MemoryCacheService;

  beforeEach(() => {
    cacheService = new MemoryCacheService(60); // 60 seconds TTL
  });

  afterEach(() => {
    cacheService.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      const testData = { id: '1', name: 'Test' };
      
      cacheService.set('test-key', testData);
      const result = cacheService.get('test-key');

      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const result = cacheService.get('non-existent');

      expect(result).toBeNull();
    });

    it('should handle different data types', () => {
      cacheService.set('string', 'test');
      cacheService.set('number', 123);
      cacheService.set('boolean', true);
      cacheService.set('array', [1, 2, 3]);
      cacheService.set('object', { key: 'value' });

      expect(cacheService.get('string')).toBe('test');
      expect(cacheService.get('number')).toBe(123);
      expect(cacheService.get('boolean')).toBe(true);
      expect(cacheService.get('array')).toEqual([1, 2, 3]);
      expect(cacheService.get('object')).toEqual({ key: 'value' });
    });

    it('should not store null or undefined values', () => {
      cacheService.set('null-key', null);
      cacheService.set('undefined-key', undefined);

      expect(cacheService.isSet('null-key')).toBe(false);
      expect(cacheService.isSet('undefined-key')).toBe(false);
    });

    it('should use custom TTL when provided', () => {
      cacheService.set('custom-ttl', 'test', 30);
      
      expect(cacheService.isSet('custom-ttl')).toBe(true);
    });
  });

  describe('isSet', () => {
    it('should return true for existing key', () => {
      cacheService.set('existing-key', 'value');

      expect(cacheService.isSet('existing-key')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cacheService.isSet('non-existent')).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove a specific key', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');

      cacheService.remove('key1');

      expect(cacheService.isSet('key1')).toBe(false);
      expect(cacheService.isSet('key2')).toBe(true);
    });
  });

  describe('removeByPattern', () => {
    it('should remove all keys matching pattern', () => {
      cacheService.set('plan-1', { id: '1' });
      cacheService.set('plan-2', { id: '2' });
      cacheService.set('file-1', { id: '1' });

      cacheService.removeByPattern('plan');

      expect(cacheService.isSet('plan-1')).toBe(false);
      expect(cacheService.isSet('plan-2')).toBe(false);
      expect(cacheService.isSet('file-1')).toBe(true);
    });

    it('should handle empty pattern results', () => {
      cacheService.set('test-1', 'value');

      expect(() => cacheService.removeByPattern('nonexistent')).not.toThrow();
    });

    it('should remove cache for specific entity types', () => {
      cacheService.set('plans-all', []);
      cacheService.set('plan-123', {});
      cacheService.set('files-user-456', []);
      cacheService.set('file-789', {});

      cacheService.removeByPattern('plan');

      expect(cacheService.isSet('plans-all')).toBe(false);
      expect(cacheService.isSet('plan-123')).toBe(false);
      expect(cacheService.isSet('files-user-456')).toBe(true);
      expect(cacheService.isSet('file-789')).toBe(true);
    });
  });

  describe('clear', () => {
    it('should remove all cached data', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      cacheService.set('key3', 'value3');

      cacheService.clear();

      expect(cacheService.isSet('key1')).toBe(false);
      expect(cacheService.isSet('key2')).toBe(false);
      expect(cacheService.isSet('key3')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cacheService.set('test', 'value');
      
      const stats = cacheService.getStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty('keys');
    });
  });

  describe('TTL expiration', () => {
    it('should expire values after TTL', async () => {
      const shortTTL = new MemoryCacheService(1); // 1 second
      
      shortTTL.set('expire-test', 'value', 1);
      expect(shortTTL.isSet('expire-test')).toBe(true);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1500));

      expect(shortTTL.isSet('expire-test')).toBe(false);
      expect(shortTTL.get('expire-test')).toBeNull();

      shortTTL.clear();
    });
  });

  describe('clone behavior', () => {
    it('should clone objects to prevent external modifications', () => {
      const original = { name: 'Original', count: 1 };
      
      cacheService.set('clone-test', original);
      original.name = 'Modified';
      original.count = 999;

      const cached = cacheService.get('clone-test');

      expect(cached).toEqual({ name: 'Original', count: 1 });
      expect(cached).not.toBe(original); // Different object references
    });
  });
});
