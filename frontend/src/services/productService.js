import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeaders = async () => {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getProducts = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { cache: 'no-store' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch products');
    return data.data;
  } catch (error) {
    console.error('productService getProducts error:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: 'no-store' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch product');
    return data.data;
  } catch (error) {
    console.error('productService getProduct error:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to create product');
    return data.data;
  } catch (error) {
    console.error('productService createProduct error:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update product');
    return data.data;
  } catch (error) {
    console.error('productService updateProduct error:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      method: 'DELETE',
      headers,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete product');
    return data.data;
  } catch (error) {
    console.error('productService deleteProduct error:', error);
    throw error;
  }
};
