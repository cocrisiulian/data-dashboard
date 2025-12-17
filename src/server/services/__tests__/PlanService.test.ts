/**
 * PlanService Unit Tests
 * Tests pentru business logic layer al Plans
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlanService } from '@/server/services/PlanService';
import { PlanRepository } from '@/server/repositories/PlanRepository';
import { mockPlans } from '@/__tests__/fixtures/data';

describe('PlanService', () => {
  let planService: PlanService;
  let mockPlanRepository: PlanRepository;

  beforeEach(() => {
    // Create mock repository
    mockPlanRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as any;

    planService = new PlanService(mockPlanRepository);
  });

  describe('getAllPlans', () => {
    it('should return all plans with enriched data', async () => {
      const plans = [mockPlans.free, mockPlans.pro];
      mockPlanRepository.findAll = vi.fn().mockResolvedValue(plans);

      const result = await planService.getAllPlans();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('valueScore');
      expect(result[0]).toHaveProperty('displayName');
      expect(mockPlanRepository.findAll).toHaveBeenCalledOnce();
    });

    it('should calculate value score correctly', async () => {
      mockPlanRepository.findAll = vi.fn().mockResolvedValue([mockPlans.pro]);

      const result = await planService.getAllPlans();

      expect(result[0].valueScore).toBeGreaterThan(0);
    });
  });

  describe('getPlanById', () => {
    it('should return enriched plan when found', async () => {
      const planWithCount = { ...mockPlans.pro, _count: { users: 42 } };
      mockPlanRepository.findById = vi.fn().mockResolvedValue(planWithCount);

      const result = await planService.getPlanById('plan-pro');

      expect(result).toHaveProperty('id', 'plan-pro');
      expect(result).toHaveProperty('_count');
      expect(mockPlanRepository.findById).toHaveBeenCalledWith('plan-pro');
    });

    it('should throw error when plan not found', async () => {
      mockPlanRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(planService.getPlanById('non-existent')).rejects.toThrow(
        'Plan not found'
      );
    });
  });

  describe('createPlan', () => {
    it('should create new plan with valid data', async () => {
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

      mockPlanRepository.create = vi.fn().mockResolvedValue(createdPlan);

      const result = await planService.createPlan(newPlanData);

      expect(result).toEqual(createdPlan);
      expect(mockPlanRepository.create).toHaveBeenCalledWith(newPlanData);
    });
  });

  describe('updatePlan', () => {
    it('should update existing plan', async () => {
      const updateData = { price: 12.99 };
      const updatedPlan = { ...mockPlans.pro, price: 12.99 };

      mockPlanRepository.findById = vi.fn().mockResolvedValue(mockPlans.pro);
      mockPlanRepository.update = vi.fn().mockResolvedValue(updatedPlan);

      const result = await planService.updatePlan('plan-pro', updateData);

      expect(result.price).toBe(12.99);
      expect(mockPlanRepository.update).toHaveBeenCalledWith('plan-pro', updateData);
    });

    it('should throw error when plan not found', async () => {
      mockPlanRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(
        planService.updatePlan('non-existent', { price: 10 })
      ).rejects.toThrow('Plan not found');
    });
  });

  describe('deletePlan', () => {
    it('should delete plan when it has no users', async () => {
      const planWithNoUsers = { ...mockPlans.enterprise, _count: { users: 0 } };
      mockPlanRepository.findById = vi.fn().mockResolvedValue(planWithNoUsers);
      mockPlanRepository.delete = vi.fn().mockResolvedValue(mockPlans.enterprise);

      await planService.deletePlan('plan-enterprise');

      expect(mockPlanRepository.delete).toHaveBeenCalledWith('plan-enterprise');
    });

    it('should throw error when plan has active users', async () => {
      const planWithUsers = { ...mockPlans.free, _count: { users: 10 } };
      mockPlanRepository.findById = vi.fn().mockResolvedValue(planWithUsers);

      await expect(planService.deletePlan('plan-free')).rejects.toThrow(
        /Cannot delete plan/
      );
      expect(mockPlanRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw error when plan not found', async () => {
      mockPlanRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(planService.deletePlan('non-existent')).rejects.toThrow(
        'Plan not found'
      );
    });
  });
});
