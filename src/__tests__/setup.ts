/**
 * Vitest Global Setup
 * Runs before all tests
 */

import { beforeAll, afterAll, vi } from 'vitest';

beforeAll(() => {
  // Setup global test environment
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
});

afterAll(() => {
  // Cleanup after all tests
  vi.clearAllMocks();
});
