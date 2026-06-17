import { db } from '../config/firebase';
import { User, CreateUserDTO } from '../interfaces/User';

export const createUser = async (data: CreateUserDTO): Promise<User> => {
  try {
    console.log(`[UserService] Creating user document for: ${data.email}`);
    const userData = {
      email: data.email,
      role: data.role,
      createdAt: new Date().toISOString(),
    };
    await db.collection('users').doc(data.id).set(userData);
    const newUser = { id: data.id, ...userData } as User;
    console.log(`[UserService] ✅ User document created: ${data.id}`);
    return newUser;
  } catch (error) {
    console.error('[UserService] ❌ Error creating user:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    console.log(`[UserService] Fetching user with id: ${id}`);
    const doc = await db.collection('users').doc(id).get();
    if (!doc.exists) {
      throw new Error('User not found');
    }
    const user = { id: doc.id, ...doc.data() } as User;
    console.log(`[UserService] ✅ Found user: ${user.email}`);
    return user;
  } catch (error) {
    console.error('[UserService] ❌ Error fetching user:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    console.log('[UserService] Fetching all users...');
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
    console.log(`[UserService] ✅ Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('[UserService] ❌ Error fetching all users:', error);
    throw error;
  }
};
