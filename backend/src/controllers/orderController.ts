import { Request, Response } from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from '../services/orderService';

export const placeOrder = async (req: Request, res: Response) => {
  try {
    console.log('[OrderController] POST /api/orders called');
    const { customerName, customerEmail, shippingAddress, items, subtotal, shippingFee, total } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !items || !items.length) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'customerName, customerEmail, shippingAddress, and items are required',
      });
    }

    const order = await createOrder({
      userId: (req as any).user.uid,
      customerName,
      customerEmail,
      shippingAddress,
      items,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      total: Number(total),
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('[OrderController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place order',
      message: 'An unexpected error occurred',
    });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    console.log('[OrderController] GET /api/orders/my-orders called');
    const userId = (req as any).user.uid;
    const orders = await getUserOrders(userId);
    res.status(200).json({
      success: true,
      data: orders,
      message: 'Orders fetched successfully',
    });
  } catch (error) {
    console.error('[OrderController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: 'An unexpected error occurred',
    });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    console.log('[OrderController] GET /api/orders called');
    const orders = await getAllOrders();
    res.status(200).json({
      success: true,
      data: orders,
      message: 'All orders fetched successfully',
    });
  } catch (error) {
    console.error('[OrderController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: 'An unexpected error occurred',
    });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    console.log(`[OrderController] GET /api/orders/${req.params.id} called`);
    const order = await getOrderById(req.params.id);

    // customers can only view their own orders
    const user = (req as any).user;
    if (user.role !== 'admin' && order.userId !== user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You do not have permission to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order fetched successfully',
    });
  } catch (error: any) {
    console.error('[OrderController] ❌ Error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: 'No order exists with this ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: 'An unexpected error occurred',
    });
  }
};

export const changeOrderStatus = async (req: Request, res: Response) => {
  try {
    console.log(`[OrderController] PUT /api/orders/${req.params.id}/status called`);
    const { status } = req.body;

    if (!['pending', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
        message: 'Status must be one of: pending, shipped, delivered',
      });
    }

    const order = await updateOrderStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });
  } catch (error: any) {
    console.error('[OrderController] ❌ Error:', error);
    if (error.message === 'Order not found') {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message: 'No order exists with this ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: 'An unexpected error occurred',
    });
  }
};
