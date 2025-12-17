/**
 * FileRepository - Data Access Layer pentru Files
 * Locație: src/server/repositories/FileRepository.ts
 * 
 * Folosit în:
 * - src/server/services/FileService.ts
 * - src/app/api/files/route.ts
 * 
 * Responsabilități:
 * - CRUD pentru entitatea File
 * - Queries cu filtrare pe userId
 * - File system operations (optional)
 */

import { PrismaClient, File } from '@prisma/client';

export class FileRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Find all files pentru un user
   */
  async findAllByUserId(userId: string): Promise<File[]> {
    return await this.prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    });
  }

  /**
   * Find file by ID și verifică ownership
   */
  async findByIdAndUserId(fileId: string, userId: string): Promise<File | null> {
    return await this.prisma.file.findFirst({
      where: {
        id: fileId,
        userId
      }
    });
  }

  /**
   * Find file by ID (fără ownership check)
   */
  async findById(fileId: string): Promise<File | null> {
    return await this.prisma.file.findUnique({
      where: { id: fileId }
    });
  }

  /**
   * Create new file record
   */
  async create(fileData: {
    userId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
  }): Promise<File> {
    return await this.prisma.file.create({
      data: fileData
    });
  }

  /**
   * Update file metadata
   */
  async update(fileId: string, updateData: Partial<{
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
  }>): Promise<File> {
    return await this.prisma.file.update({
      where: { id: fileId },
      data: updateData
    });
  }

  /**
   * Delete file record
   */
  async delete(fileId: string): Promise<File> {
    return await this.prisma.file.delete({
      where: { id: fileId }
    });
  }

  /**
   * Count files pentru user (plan limit check)
   */
  async countByUserId(userId: string): Promise<number> {
    return await this.prisma.file.count({
      where: { userId }
    });
  }

  /**
   * Get files cu charts asociate
   */
  async findWithCharts(userId: string): Promise<any[]> {
    return await this.prisma.file.findMany({
      where: { userId },
      include: {
        charts: {
          select: {
            id: true,
            title: true,
            chartType: true
          }
        }
      },
      orderBy: { uploadedAt: 'desc' }
    });
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const fileRepository = new FileRepository();
