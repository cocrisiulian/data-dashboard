/**
 * Files API Route - Next.js App Router
 * Locație: src/app/api/files/route.ts
 * 
 * Folosește:
 * - src/server/controllers/FileController.ts (HTTP handling)
 * - src/server/services/FileService.ts (business logic)
 * - src/server/repositories/FileRepository.ts (data access)
 * - src/server/infrastructure/container.ts (dependency injection)
 * 
 * Endpoints:
 * - GET    /api/files          - Get all files for logged user
 * - POST   /api/files          - Upload new file
 * 
 * Arhitectură:
 * Request → Next.js Route → Controller → Service → Repository → Database
 * Response ← Next.js Route ← Controller ← Service ← Repository ← Database
 */

import { NextRequest, NextResponse } from 'next/server';
import { fileController } from '@/server/controllers/FileController';
import { FileController } from '@/server/controllers/FileController';

/**
 * GET /api/files
 * Get all files for logged user
 * 
 * Exemplu Response (200 OK):
 * {
 *   "success": true,
 *   "count": 3,
 *   "data": [
 *     {
 *       "id": "uuid-1",
 *       "original_name": "sales-data.csv",
 *       "file_path": "/uploads/user-id/file.csv",
 *       "file_size": 1024,
 *       "mime_type": "text/csv",
 *       "uploaded_at": "2025-12-10T10:00:00Z",
 *       "user_id": "user-uuid",
 *       "_count": { "charts": 2 }
 *     },
 *     ...
 *   ]
 * }
 * 
 * Response (401 Unauthorized):
 * {
 *   "success": false,
 *   "message": "Authentication required"
 * }
 * 
 * Folosit în:
 * - src/app/files/page.tsx (file listing)
 * - src/components/files/file-list.tsx
 */
export async function GET(request: NextRequest) {
  try {
    // Extract userId from session/auth
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const apiResponse = await fileController.getAllFiles(userId);
    return FileController.toNextResponse(apiResponse, 200);
  } catch (error) {
    console.error('[API Route] GET /api/files error:', error);
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
 * POST /api/files
 * Upload new file
 * 
 * Request: multipart/form-data
 * - file: File (required)
 * - userId: string (from auth context)
 * 
 * Response (201 Created):
 * {
 *   "success": true,
 *   "message": "File uploaded successfully",
 *   "data": {
 *     "id": "uuid-new",
 *     "original_name": "data.csv",
 *     "file_path": "/uploads/user-id/data.csv",
 *     "file_size": 2048,
 *     "mime_type": "text/csv",
 *     "uploaded_at": "2025-12-12T15:30:00Z",
 *     "user_id": "user-uuid"
 *   }
 * }
 * 
 * Response (400 Bad Request):
 * {
 *   "success": false,
 *   "message": "File upload limit reached (5 files for Free plan)"
 * }
 * 
 * Response (413 Payload Too Large):
 * {
 *   "success": false,
 *   "message": "File size exceeds 10MB limit"
 * }
 * 
 * Validări (în FileService):
 * - User has not reached plan file limit
 * - File size within allowed limits
 * - Valid file type (CSV, JSON, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File is required' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadData = {
      originalname: file.name,
      mimetype: file.type,
      size: file.size,
      path: '', // Will be set by service
    };

    const apiResponse = await fileController.uploadFile(userId, uploadData);
    
    if (apiResponse.success) {
      return FileController.toNextResponse(apiResponse, 201);
    } else {
      // Handle business logic errors (e.g., limit reached)
      return FileController.toNextResponse(apiResponse, 400);
    }
  } catch (error) {
    console.error('[API Route] POST /api/files error:', error);
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
