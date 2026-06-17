import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;

    if (!user || user.role !== 'admin') {
      console.error(`[AdminMiddleware] ❌ Access denied for user: ${user?.uid} with role: ${user?.role}`);
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Admin access required',
      });
    }

    next();
  } catch (error) {
    console.error('[AdminMiddleware] ❌ Error in admin check:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    });
  }
};
