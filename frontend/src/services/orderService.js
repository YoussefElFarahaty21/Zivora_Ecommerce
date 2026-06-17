import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const createOrder = async (orderData) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create order');
    return data.data;
  } catch (error) {
    console.error('orderService createOrder error:', error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/orders/my-orders`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch orders');
    return data.data;
  } catch (error) {
    console.error('orderService getMyOrders error:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/orders`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch all orders');
    return data.data;
  } catch (error) {
    console.error('orderService getAllOrders error:', error);
    throw error;
  }
};

export const getOrder = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/orders/${id}`, { headers });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch order');
    return data.data;
  } catch (error) {
    console.error('orderService getOrder error:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update order status');
    return data.data;
  } catch (error) {
    console.error('orderService updateOrderStatus error:', error);
    throw error;
  }
};
