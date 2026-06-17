import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const getAllUsers = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/users`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch users');
    return data.data;
  } catch (error) {
    console.error('userService getAllUsers error:', error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/users/${id}`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch user');
    return data.data;
  } catch (error) {
    console.error('userService getUser error:', error);
    throw error;
  }
};
