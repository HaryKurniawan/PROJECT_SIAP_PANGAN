import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types';
/**
 * JWT auth via HTTP-only cookie
 */
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map