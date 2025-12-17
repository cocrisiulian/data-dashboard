/**
 * FileService - Business Logic Layer pentru Files
 * Locație: src/server/services/FileService.ts
 * 
 * Flow: Controller → FileService → FileRepository + UserRepository → DB
 */

import { FileRepository } from '../repositories/FileRepository';
import { UserRepository } from '../repositories/UserRepository';
import { File } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface FileDTO extends File {
  file_name?: string;
  file_path?: string;
  file_size?: number;
  file_type?: string;
  uploaded_at?: Date;
  user_id?: string;
}

export class FileService {
  private fileRepository: FileRepository;
  private userRepository: UserRepository;

  constructor(
    fileRepository: FileRepository,
    userRepository: UserRepository
  ) {
    this.fileRepository = fileRepository;
    this.userRepository = userRepository;
  }

  /**
   * Get all files pentru user cu transformare snake_case
   */
  async getAllFiles(userId: string): Promise<FileDTO[]> {
    const files = await this.fileRepository.findAllByUserId(userId);
    
    // Transform la snake_case pentru frontend compatibility
    return files.map(file => this.toDTO(file));
  }

  /**
   * Get single file cu ownership validation
   */
  async getFileById(fileId: string, userId: string): Promise<FileDTO> {
    const file = await this.fileRepository.findByIdAndUserId(fileId, userId);
    
    if (!file) {
      throw new Error('File not found');
    }

    return this.toDTO(file);
  }

  /**
   * Upload file cu plan limit validation
   * Business Rule: Check max_files limit
   */
  async uploadFile(
    userId: string,
    fileData: {
      originalname: string;
      path: string;
      size: number;
      mimetype: string;
    }
  ): Promise<FileDTO> {
    // Business validation: Check plan limits
    const hasReachedLimit = await this.userRepository.hasReachedFileLimit(userId);
    
    if (hasReachedLimit) {
      // Cleanup uploaded file
      await fs.unlink(fileData.path).catch(() => {});
      
      const user = await this.userRepository.findById(userId);
      const planName = user?.plan?.name || 'current';
      const maxFiles = user?.plan?.maxFiles || 0;
      
      throw new Error(
        `File limit reached. Your ${planName} plan allows ${maxFiles} files.`
      );
    }

    // Store only filename, not full path
    const filename = path.basename(fileData.path);

    const file = await this.fileRepository.create({
      userId,
      fileName: fileData.originalname,
      filePath: filename,
      fileSize: fileData.size,
      fileType: fileData.mimetype
    });

    console.log(`[FILE SERVICE] File uploaded: ${file.fileName} (User: ${userId})`);

    return this.toDTO(file);
  }

  /**
   * Delete file cu cleanup filesystem
   */
  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.fileRepository.findByIdAndUserId(fileId, userId);
    
    if (!file) {
      throw new Error('File not found');
    }

    // Business logic: Delete from filesystem
    const uploadsDir = path.join(process.cwd(), 'labs_api', 'uploads', userId);
    const fullPath = path.join(uploadsDir, file.filePath);
    
    try {
      await fs.unlink(fullPath);
      console.log(`[FILE SERVICE] Deleted file from disk: ${fullPath}`);
    } catch (error) {
      console.warn(`[FILE SERVICE] Could not delete file from disk: ${error}`);
      // Continue cu ștergerea din DB chiar dacă fișierul nu există pe disk
    }

    // Delete from database
    await this.fileRepository.delete(fileId);

    console.log(`[FILE SERVICE] File deleted: ${file.fileName} (ID: ${fileId})`);
  }

  /**
   * Get files cu charts info
   */
  async getFilesWithCharts(userId: string): Promise<any[]> {
    const files = await this.fileRepository.findWithCharts(userId);
    
    return files.map(file => ({
      ...this.toDTO(file),
      charts: file.charts || []
    }));
  }

  /**
   * Transform File entity la DTO (snake_case pentru frontend)
   */
  private toDTO(file: File): FileDTO {
    return {
      ...file,
      file_name: file.fileName,
      file_path: file.filePath,
      file_size: file.fileSize,
      file_type: file.fileType,
      uploaded_at: file.uploadedAt,
      user_id: file.userId
    };
  }
}

// Export singleton
import { fileRepository } from '../repositories/FileRepository';
import { userRepository } from '../repositories/UserRepository';
export const fileService = new FileService(fileRepository, userRepository);
