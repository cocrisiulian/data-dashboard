/**
 * Prisma Client Mock
 * Folosit pentru a mocka toate operațiunile Prisma în tests
 */

import { vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';

// Type pentru mock functions Prisma
type MockedPrismaModel = {
  findMany: ReturnType<typeof vi.fn>;
  findUnique: ReturnType<typeof vi.fn>;
  findFirst: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  count: ReturnType<typeof vi.fn>;
};

type MockedPrismaClient = {
  plan: MockedPrismaModel;
  user: MockedPrismaModel;
  file: MockedPrismaModel;
  dashboard: MockedPrismaModel;
  chart: MockedPrismaModel;
  $disconnect: ReturnType<typeof vi.fn>;
  $connect: ReturnType<typeof vi.fn>;
} & PrismaClient;

// Mock pentru PrismaClient
export const mockPrismaClient = {
  plan: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  file: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  dashboard: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  chart: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  $disconnect: vi.fn(),
  $connect: vi.fn(),
} as unknown as MockedPrismaClient;

/**
 * Helper pentru resetarea tuturor mock-urilor Prisma
 */
export const resetPrismaMocks = () => {
  Object.values(mockPrismaClient).forEach((model: any) => {
    if (typeof model === 'object') {
      Object.values(model).forEach((method: any) => {
        if (typeof method?.mockReset === 'function') {
          method.mockReset();
        }
      });
    }
  });
};
