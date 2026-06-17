import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[ErrorMiddleware] ❌ Unhandled error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message,
  });
};
