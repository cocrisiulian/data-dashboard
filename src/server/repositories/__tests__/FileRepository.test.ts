/**
 * FileRepository Unit Tests
 * Tests pentru data access layer al Files
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FileRepository } from '@/server/repositories/FileRepository';
import { mockPrismaClient, resetPrismaMocks } from '@/__tests__/mocks/prisma.mock';
import { mockFiles, mockUsers } from '@/__tests__/fixtures/data';

describe('FileRepository', () => {
  let fileRepository: FileRepository;

  beforeEach(() => {
    resetPrismaMocks();
    fileRepository = new FileRepository(mockPrismaClient);
  });

  describe('findAllByUserId', () => {
    it('should return all files for user', async () => {
      const userFiles = [mockFiles.salesData];
      mockPrismaClient.file.findMany.mockResolvedValue(userFiles);

      const result = await fileRepository.findAllByUserId('user-john');

      expect(result).toEqual(userFiles);
      expect(mockPrismaClient.file.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-john' },
        orderBy: { uploadedAt: 'desc' },
      });
    });

    it('should return empty array when user has no files', async () => {
      mockPrismaClient.file.findMany.mockResolvedValue([]);

      const result = await fileRepository.findAllByUserId('user-new');

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return file when found', async () => {
      mockPrismaClient.file.findUnique.mockResolvedValue(mockFiles.salesData);

      const result = await fileRepository.findById('file-1');

      expect(result).toEqual(mockFiles.salesData);
      expect(mockPrismaClient.file.findUnique).toHaveBeenCalledWith({
        where: { id: 'file-1' },
      });
    });

    it('should return null when file not found', async () => {
      mockPrismaClient.file.findUnique.mockResolvedValue(null);

      const result = await fileRepository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return new file', async () => {
      const newFileData = {
        fileName: 'new-data.csv',
        filePath: '/uploads/user-john/new-data.csv',
        fileSize: 512,
        fileType: 'text/csv',
        userId: 'user-john',
      };

      const createdFile = {
        id: 'file-new',
        ...newFileData,
        uploadedAt: new Date(),
      };

      mockPrismaClient.file.create.mockResolvedValue(createdFile);

      const result = await fileRepository.create(newFileData);

      expect(result).toEqual(createdFile);
      expect(mockPrismaClient.file.create).toHaveBeenCalledWith({
        data: newFileData,
      });
    });
  });

  describe('delete', () => {
    it('should delete and return deleted file', async () => {
      mockPrismaClient.file.delete.mockResolvedValue(mockFiles.salesData);

      const result = await fileRepository.delete('file-1');

      expect(result).toEqual(mockFiles.salesData);
      expect(mockPrismaClient.file.delete).toHaveBeenCalledWith({
        where: { id: 'file-1' },
      });
    });
  });

  describe('countByUserId', () => {
    it('should return count of files for user', async () => {
      mockPrismaClient.file.count.mockResolvedValue(5);

      const result = await fileRepository.countByUserId('user-john');

      expect(result).toBe(5);
      expect(mockPrismaClient.file.count).toHaveBeenCalledWith({
        where: { userId: 'user-john' },
      });
    });

    it('should return 0 when user has no files', async () => {
      mockPrismaClient.file.count.mockResolvedValue(0);

      const result = await fileRepository.countByUserId('user-new');

      expect(result).toBe(0);
    });
  });

  describe('findWithCharts', () => {
    it('should return files with associated charts for user', async () => {
      const filesWithCharts = [
        {
          ...mockFiles.salesData,
          charts: [{ id: 'chart-1', title: 'Sales by Month', chartType: 'bar' }],
        },
      ];

      mockPrismaClient.file.findMany.mockResolvedValue(filesWithCharts);

      const result = await fileRepository.findWithCharts('user-john');

      expect(result).toEqual(filesWithCharts);
      expect(mockPrismaClient.file.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-john' },
        include: {
          charts: {
            select: {
              id: true,
              title: true,
              chartType: true,
            },
          },
        },
        orderBy: { uploadedAt: 'desc' },
      });
    });

    it('should return files with empty charts array when no charts exist', async () => {
      const filesWithoutCharts = [
        {
          ...mockFiles.salesData,
          charts: [],
        },
      ];

      mockPrismaClient.file.findMany.mockResolvedValue(filesWithoutCharts);

      const result = await fileRepository.findWithCharts('user-john');

      expect(result[0].charts).toEqual([]);
    });
  });
});
