import { db } from '../config/firebase';
import { Order, CreateOrderDTO } from '../interfaces/Order';

export const createOrder = async (data: CreateOrderDTO): Promise<Order> => {
  try {
    console.log('[OrderService] Creating new order...');
    const orderData = {
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('orders').add(orderData);
    const newOrder = { id: docRef.id, ...orderData } as Order;
    console.log(`[OrderService] ✅ Order created with id: ${docRef.id}`);
    return newOrder;
  } catch (error) {
    console.error('[OrderService] ❌ Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (id: string): Promise<Order> => {
  try {
    console.log(`[OrderService] Fetching order with id: ${id}`);
    const doc = await db.collection('orders').doc(id).get();
    if (!doc.exists) {
      throw new Error('Order not found');
    }
    const order = { id: doc.id, ...doc.data() } as Order;
    console.log(`[OrderService] ✅ Found order: ${order.id}`);
    return order;
  } catch (error) {
    console.error('[OrderService] ❌ Error fetching order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    console.log(`[OrderService] Fetching orders for user: ${userId}`);
    const snapshot = await db
      .collection('orders')
      .where('userId', '==', userId)
      .get();
    const orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Order))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(`[OrderService] ✅ Found ${orders.length} orders for user ${userId}`);
    return orders;
  } catch (error) {
    console.error('[OrderService] ❌ Error fetching user orders:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    console.log('[OrderService] Fetching all orders...');
    const snapshot = await db.collection('orders').get();
    const orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Order))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    console.log(`[OrderService] ✅ Found ${orders.length} total orders`);
    return orders;
  } catch (error) {
    console.error('[OrderService] ❌ Error fetching all orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  id: string,
  status: 'pending' | 'shipped' | 'delivered'
): Promise<Order> => {
  try {
    console.log(`[OrderService] Updating order ${id} status to: ${status}`);
    const docRef = db.collection('orders').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      throw new Error('Order not found');
    }
    await docRef.update({ status });
    const updated = await docRef.get();
    const order = { id: updated.id, ...updated.data() } as Order;
    console.log(`[OrderService] ✅ Order status updated: ${id} → ${status}`);
    return order;
  } catch (error) {
    console.error('[OrderService] ❌ Error updating order status:', error);
    throw error;
  }
};
