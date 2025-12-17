/**
 * PlanRepository Unit Tests
 * Tests pentru data access layer al Plans
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PlanRepository } from '@/server/repositories/PlanRepository';
import { mockPrismaClient, resetPrismaMocks } from '@/__tests__/mocks/prisma.mock';
import { mockPlans } from '@/__tests__/fixtures/data';

describe('PlanRepository', () => {
  let planRepository: PlanRepository;

  beforeEach(() => {
    resetPrismaMocks();
    planRepository = new PlanRepository(mockPrismaClient);
  });

  describe('findAll', () => {
    it('should return all plans', async () => {
      const expectedPlans = [mockPlans.free, mockPlans.pro, mockPlans.enterprise];
      mockPrismaClient.plan.findMany.mockResolvedValue(expectedPlans);

      const result = await planRepository.findAll();

      expect(result).toEqual(expectedPlans);
      expect(mockPrismaClient.plan.findMany).toHaveBeenCalledOnce();
    });

    it('should return empty array when no plans exist', async () => {
      mockPrismaClient.plan.findMany.mockResolvedValue([]);

      const result = await planRepository.findAll();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return plan when found', async () => {
      mockPrismaClient.plan.findUnique.mockResolvedValue(mockPlans.pro);

      const result = await planRepository.findById('plan-pro');

      expect(result).toEqual(mockPlans.pro);
      expect(mockPrismaClient.plan.findUnique).toHaveBeenCalledWith({
        where: { id: 'plan-pro' },
        include: {
          _count: {
            select: {
              users: true
            }
          }
        }
      });
    });

    it('should return null when plan not found', async () => {
      mockPrismaClient.plan.findUnique.mockResolvedValue(null);

      const result = await planRepository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return new plan', async () => {
      const newPlanData = {
        name: 'Starter',
        price: 4.99,
        maxFiles: 10,
        maxCharts: 20,
        maxDashboards: 5,
      };

      const createdPlan = {
        id: 'plan-starter',
        ...newPlanData,
        isPopular: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.plan.create.mockResolvedValue(createdPlan);

      const result = await planRepository.create(newPlanData);

      expect(result).toEqual(createdPlan);
      expect(mockPrismaClient.plan.create).toHaveBeenCalledWith({
        data: newPlanData,
      });
    });
  });

  describe('update', () => {
    it('should update and return updated plan', async () => {
      const updateData = { price: 12.99 };
      const updatedPlan = { ...mockPlans.pro, price: 12.99 };

      mockPrismaClient.plan.update.mockResolvedValue(updatedPlan);

      const result = await planRepository.update('plan-pro', updateData);

      expect(result).toEqual(updatedPlan);
      expect(mockPrismaClient.plan.update).toHaveBeenCalledWith({
        where: { id: 'plan-pro' },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete and return deleted plan', async () => {
      mockPrismaClient.plan.delete.mockResolvedValue(mockPlans.enterprise);

      const result = await planRepository.delete('plan-enterprise');

      expect(result).toEqual(mockPlans.enterprise);
      expect(mockPrismaClient.plan.delete).toHaveBeenCalledWith({
        where: { id: 'plan-enterprise' },
      });
    });
  });

  describe('findByName', () => {
    it('should return plan when found by name', async () => {
      mockPrismaClient.plan.findUnique.mockResolvedValue(mockPlans.free);

      const result = await planRepository.findByName('Free');

      expect(result).toEqual(mockPlans.free);
      expect(mockPrismaClient.plan.findUnique).toHaveBeenCalledWith({
        where: { name: 'Free' },
      });
    });

    it('should return null when plan not found', async () => {
      mockPrismaClient.plan.findUnique.mockResolvedValue(null);

      const result = await planRepository.findByName('NonExistent');

      expect(result).toBeNull();
    });
  });
});
