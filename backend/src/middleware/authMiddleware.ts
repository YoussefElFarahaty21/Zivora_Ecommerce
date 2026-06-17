import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authorization token is missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Fetch user role from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const role = userDoc.exists ? userDoc.data()?.role : 'customer';

    (req as any).user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role,
    };

    next();
  } catch (error) {
    console.error('[AuthMiddleware] ❌ Token verification failed:', error);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};
