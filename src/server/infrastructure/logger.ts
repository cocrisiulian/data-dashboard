/**
 * Logging Infrastructure
 * Locație: src/server/infrastructure/logger.ts
 * 
 * Responsabilități:
 * - Centralized logging pentru toată aplicația
 * - Support pentru diferite log levels (INFO, WARN, ERROR, DEBUG)
 * - Logging în consolă + fișier (production)
 * - Database logging pentru audit trail
 */

import { PrismaClient } from '@prisma/client';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface ILogger {
  debug(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  logToDatabase(
    userId: string | undefined,
    action: string,
    entity: string,
    entityId?: string,
    metadata?: any,
    level?: 'INFO' | 'WARN' | 'ERROR'
  ): Promise<void>;
}

/**
 * Console Logger Implementation
 * În production ar putea folosi Winston sau Pino
 */
export class Logger implements ILogger {
  private prisma: PrismaClient | null = null;

  constructor(
    private serviceName: string = 'DataInsight',
    prisma?: PrismaClient
  ) {
    this.prisma = prisma || null;
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | ${JSON.stringify(meta)}` : '';
    
    const logMessage = `[${timestamp}] [${level}] [${this.serviceName}] ${message}${metaString}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.INFO:
        console.info(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
    }
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, meta);
    }
  }

  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }

  /**
   * Log to database for audit trail
   * Folosit pentru acțiuni importante (CRUD operations, login, etc.)
   */
  async logToDatabase(
    userId: string | undefined,
    action: string,
    entity: string,
    entityId?: string,
    metadata?: any,
    level: 'INFO' | 'WARN' | 'ERROR' = 'INFO'
  ): Promise<void> {
    if (!this.prisma) {
      this.warn('Prisma client not available for database logging');
      return;
    }

    try {
      await this.prisma.activityLog.create({
        data: {
          userId: userId || undefined,
          action,
          entity,
          entityId: entityId || undefined,
          metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
          level
        }
      });

      this.debug('Activity logged to database', { userId, action, entity, entityId });
    } catch (error) {
      // Ne asigurăm că logging nu blochează fluxul principal
      this.error('Failed to log to database', { error, userId, action, entity });
    }
  }
}

/**
 * Factory: Create logger instance
 * Folosit în container pentru DI
 */
export function createLogger(serviceName?: string, prisma?: PrismaClient): ILogger {
  return new Logger(serviceName, prisma);
}

/**
 * Global logger instance
 * Pentru quick logging în afara DI container
 */
export const logger = new Logger('DataInsight');
