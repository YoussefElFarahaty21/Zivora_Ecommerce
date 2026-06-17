import { Request, Response } from 'express';
import { createUser, getUserById } from '../services/userService';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('[AuthController] POST /api/auth/register called');
    const user = (req as any).user;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'email is required',
      });
    }

    const newUser = await createUser({
      id: user.uid,
      email,
      role: 'customer',
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User registered successfully',
    });
  } catch (error: any) {
    console.error('[AuthController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: error.message || 'An unexpected error occurred',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('[AuthController] POST /api/auth/login called');
    const user = (req as any).user;

    const userData = await getUserById(user.uid);
    res.status(200).json({
      success: true,
      data: userData,
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('[AuthController] ❌ Error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No user record found. Please register first.',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'An unexpected error occurred',
    });
  }
};
