/**
 * FileController - Presentation/HTTP Layer pentru Files
 * Locație: src/server/controllers/FileController.ts
 * 
 * Folosit în:
 * - src/app/api/files/route.ts
 * - src/app/api/files/[id]/route.ts
 * 
 * Flow: API Route → FileController → FileService → FileRepository → DB
 */

import { FileService, FileDTO } from '../services/FileService';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

export class FileController {
  private fileService: FileService;

  /**
   * Constructor cu Dependency Injection
   */
  constructor(fileService: FileService) {
    this.fileService = fileService;
  }

  /**
   * GET /api/files
   * Get all files pentru authenticated user
   * 
   * Response: 200 OK
   * {
   *   "success": true,
   *   "count": 5,
   *   "data": [
   *     {
   *       "id": "...",
   *       "file_name": "data.csv",
   *       "file_size": 1024,
   *       "file_type": "text/csv",
   *       "uploaded_at": "2025-12-10T10:00:00Z"
   *     }
   *   ]
   * }
   */
  async getAllFiles(userId: string): Promise<ApiResponse<FileDTO[]>> {
    try {
      const files = await this.fileService.getAllFiles(userId);
      
      return {
        success: true,
        count: files.length,
        data: files
      };
    } catch (error) {
      console.error('[FileController] Error in getAllFiles:', error);
      return {
        success: false,
        message: 'Error fetching files',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET /api/files/:id
   * Get single file by ID
   * 
   * Response: 200 OK sau 404 Not Found
   */
  async getFileById(fileId: string, userId: string): Promise<ApiResponse<FileDTO>> {
    try {
      const file = await this.fileService.getFileById(fileId, userId);
      
      return {
        success: true,
        data: file
      };
    } catch (error) {
      console.error('[FileController] Error in getFileById:', error);
      
      if (error instanceof Error && error.message === 'File not found') {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error fetching file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * POST /api/files
   * Upload new file
   * 
   * Request: multipart/form-data cu file
   * 
   * Response: 201 Created sau 403 Forbidden (limit reached)
   * {
   *   "success": true,
   *   "message": "File uploaded successfully",
   *   "data": {
   *     "id": "...",
   *     "file_name": "data.csv",
   *     "file_size": 1024
   *   }
   * }
   */
  async uploadFile(
    userId: string,
    fileData: {
      originalname: string;
      path: string;
      size: number;
      mimetype: string;
    }
  ): Promise<ApiResponse<FileDTO>> {
    try {
      if (!fileData) {
        return {
          success: false,
          message: 'No file uploaded'
        };
      }

      const file = await this.fileService.uploadFile(userId, fileData);
      
      return {
        success: true,
        message: 'File uploaded successfully',
        data: file
      };
    } catch (error) {
      console.error('[FileController] Error in uploadFile:', error);
      
      // Handle plan limit errors
      if (error instanceof Error && error.message.includes('limit reached')) {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error uploading file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * DELETE /api/files/:id
   * Delete file (both DB record și filesystem)
   * 
   * Response: 200 OK sau 404 Not Found
   */
  async deleteFile(fileId: string, userId: string): Promise<ApiResponse> {
    try {
      await this.fileService.deleteFile(fileId, userId);
      
      return {
        success: true,
        message: 'File deleted successfully'
      };
    } catch (error) {
      console.error('[FileController] Error in deleteFile:', error);
      
      if (error instanceof Error && error.message === 'File not found') {
        return {
          success: false,
          message: error.message
        };
      }
      
      return {
        success: false,
        message: 'Error deleting file',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * GET /api/files?include=charts
   * Get files cu charts asociate
   */
  async getFilesWithCharts(userId: string): Promise<ApiResponse> {
    try {
      const files = await this.fileService.getFilesWithCharts(userId);
      
      return {
        success: true,
        count: files.length,
        data: files
      };
    } catch (error) {
      console.error('[FileController] Error in getFilesWithCharts:', error);
      return {
        success: false,
        message: 'Error fetching files with charts',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Helper: Convert controller response to Next.js Response
   */
  static toNextResponse(apiResponse: ApiResponse, defaultStatus: number = 200): Response {
    let status = defaultStatus;
    
    if (!apiResponse.success) {
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('limit reached')) {
        status = 403; // Forbidden
      } else if (apiResponse.message?.includes('No file uploaded')) {
        status = 400; // Bad Request
      } else {
        status = 500; // Internal Server Error
      }
    }

    return new Response(JSON.stringify(apiResponse), {
      status,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Export singleton instance
import { fileService } from '../services/FileService';
export const fileController = new FileController(fileService);
