import { Request, Response, NextFunction } from 'express';

/**
 * Extended Request with admin data from JWT cookie
 */
export interface AuthRequest extends Request {
  admin?: {
    id: number;
    username: string;
    nama: string;
  };
}

/**
 * Standard API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationInfo;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Controller handler type
 */
export type ControllerFn = (req: AuthRequest, res: Response, next?: NextFunction) => Promise<void> | void;
