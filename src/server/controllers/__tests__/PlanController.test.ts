/**
 * PlanController Unit Tests
 * Tests pentru HTTP handling layer al Plans
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PlanController } from '@/server/controllers/PlanController';
import { PlanService } from '@/server/services/PlanService';
import { mockPlans } from '@/__tests__/fixtures/data';

describe('PlanController', () => {
  let planController: PlanController;
  let mockPlanService: PlanService;

  beforeEach(() => {
    // Create mock service
    mockPlanService = {
      getAllPlans: vi.fn(),
      getPlanById: vi.fn(),
      createPlan: vi.fn(),
      updatePlan: vi.fn(),
      deletePlan: vi.fn(),
    } as any;

    planController = new PlanController(mockPlanService);
  });

  describe('getAllPlans', () => {
    it('should return success response with all plans', async () => {
      const plans = [mockPlans.free, mockPlans.pro];
      mockPlanService.getAllPlans = vi.fn().mockResolvedValue(plans);

      const response = await planController.getAllPlans();

      expect(response.success).toBe(true);
      expect(response.count).toBe(2);
      expect(response.data).toEqual(plans);
      expect(mockPlanService.getAllPlans).toHaveBeenCalledOnce();
    });

    it('should return error response when service throws', async () => {
      mockPlanService.getAllPlans = vi.fn().mockRejectedValue(
        new Error('Database error')
      );

      const response = await planController.getAllPlans();

      expect(response.success).toBe(false);
      expect(response.message).toBe('Error fetching plans');
      expect(response.error).toBe('Database error');
    });
  });

  describe('getPlanById', () => {
    it('should return success response with plan', async () => {
      const enrichedPlan = {
        ...mockPlans.pro,
        valueScore: 16.0,
        _count: { users: 42 },
        canDelete: false,
      };
      mockPlanService.getPlanById = vi.fn().mockResolvedValue(enrichedPlan);

      const response = await planController.getPlanById('plan-pro');

      expect(response.success).toBe(true);
      expect(response.data).toEqual(enrichedPlan);
    });

    it('should return error response when plan not found', async () => {
      mockPlanService.getPlanById = vi.fn().mockRejectedValue(
        new Error('Plan not found')
      );

      const response = await planController.getPlanById('non-existent');

      expect(response.success).toBe(false);
      expect(response.message).toBe('Plan not found');
    });
  });

  describe('createPlan', () => {
    it('should return success response with created plan', async () => {
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

      mockPlanService.createPlan = vi.fn().mockResolvedValue(createdPlan);

      const response = await planController.createPlan(newPlanData);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Plan created successfully');
      expect(response.data).toEqual(createdPlan);
    });

    it('should return error when service throws', async () => {
      mockPlanService.createPlan = vi.fn().mockRejectedValue(
        new Error('Validation error')
      );

      const response = await planController.createPlan({ name: 'Test' } as any);

      expect(response.success).toBe(false);
      expect(response.message).toBe('Error creating plan');
    });
  });

  describe('updatePlan', () => {
    it('should return success response with updated plan', async () => {
      const updateData = { price: 12.99 };
      const updatedPlan = { ...mockPlans.pro, price: 12.99 };

      mockPlanService.updatePlan = vi.fn().mockResolvedValue(updatedPlan);

      const response = await planController.updatePlan('plan-pro', updateData);

      expect(response.success).toBe(true);
      expect(response.message).toBe('Plan updated successfully');
      expect(response.data?.price).toBe(12.99);
    });

    it('should return error when plan not found', async () => {
      mockPlanService.updatePlan = vi.fn().mockRejectedValue(
        new Error('Plan not found')
      );

      const response = await planController.updatePlan('non-existent', { price: 10 });

      expect(response.success).toBe(false);
      expect(response.message).toBe('Plan not found');
    });
  });

  describe('deletePlan', () => {
    it('should return success response when plan deleted', async () => {
      mockPlanService.deletePlan = vi.fn().mockResolvedValue(undefined);

      const response = await planController.deletePlan('plan-enterprise');

      expect(response.success).toBe(true);
      expect(response.message).toBe('Plan deleted successfully');
    });

    it('should return error when plan has active users', async () => {
      mockPlanService.deletePlan = vi.fn().mockRejectedValue(
        new Error('Cannot delete plan with active users')
      );

      const response = await planController.deletePlan('plan-free');

      expect(response.success).toBe(false);
      expect(response.message).toBe('Error deleting plan');
      expect(response.error).toContain('Cannot delete plan');
    });
  });
});
