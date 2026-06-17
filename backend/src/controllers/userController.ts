import { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../services/userService';

export const getUsers = async (req: Request, res: Response) => {
  try {
    console.log('[UserController] GET /api/users called');
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
      message: 'Users fetched successfully',
    });
  } catch (error) {
    console.error('[UserController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: 'An unexpected error occurred',
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    console.log(`[UserController] GET /api/users/${req.params.id} called`);
    const user = await getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
      message: 'User fetched successfully',
    });
  } catch (error: any) {
    console.error('[UserController] ❌ Error:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No user exists with this ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: 'An unexpected error occurred',
    });
  }
};
