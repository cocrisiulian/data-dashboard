/**
 * File by ID API Route - Next.js App Router
 * Locație: src/app/api/files/[id]/route.ts
 * 
 * Folosește:
 * - src/server/controllers/FileController.ts
 * - src/server/services/FileService.ts
 * - src/server/repositories/FileRepository.ts
 * 
 * Endpoints:
 * - GET    /api/files/:id - Get file by ID
 * - DELETE /api/files/:id - Delete file
 */

import { NextRequest, NextResponse } from 'next/server';
import { fileController } from '@/server/controllers/FileController';
import { FileController } from '@/server/controllers/FileController';

/**
 * GET /api/files/:id
 * Get file by ID
 * 
 * Exemplu: GET /api/files/uuid-1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid-1",
 *     "original_name": "sales-data.csv",
 *     "file_path": "/uploads/user-id/sales-data.csv",
 *     "file_size": 1024,
 *     "mime_type": "text/csv",
 *     "uploaded_at": "2025-12-10T10:00:00Z",
 *     "user_id": "user-uuid",
 *     "_count": { "charts": 2 }
 *   }
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "File not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to access this file"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const fileId = params.id;
    const apiResponse = await fileController.getFileById(fileId, userId);
    
    if (apiResponse.success) {
      return FileController.toNextResponse(apiResponse, 200);
    } else {
      // Handle not found or forbidden
      const status = apiResponse.message?.includes('not found') ? 404 : 403;
      return FileController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] GET /api/files/${params.id} error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files/:id
 * Delete file
 * 
 * Exemplu: DELETE /api/files/uuid-1
 * 
 * Response (200 OK):
 * {
 *   "success": true,
 *   "message": "File deleted successfully"
 * }
 * 
 * Response (404 Not Found):
 * {
 *   "success": false,
 *   "message": "File not found"
 * }
 * 
 * Response (403 Forbidden):
 * {
 *   "success": false,
 *   "message": "You don't have permission to delete this file"
 * }
 * 
 * Response (409 Conflict):
 * {
 *   "success": false,
 *   "message": "Cannot delete file with associated charts. Delete charts first."
 * }
 * 
 * Business Logic (în FileService):
 * - Check file ownership (user must own the file)
 * - Check for associated charts (prevent deletion if charts exist)
 * - Delete from filesystem
 * - Delete from database
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const fileId = params.id;
    const apiResponse = await fileController.deleteFile(fileId, userId);
    
    if (apiResponse.success) {
      return FileController.toNextResponse(apiResponse, 200);
    } else {
      // Determine status code based on error type
      let status = 400;
      if (apiResponse.message?.includes('not found')) {
        status = 404;
      } else if (apiResponse.message?.includes('permission')) {
        status = 403;
      } else if (apiResponse.message?.includes('associated charts')) {
        status = 409; // Conflict
      }
      
      return FileController.toNextResponse(apiResponse, status);
    }
  } catch (error) {
    console.error(`[API Route] DELETE /api/files/${params.id} error:`, error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
