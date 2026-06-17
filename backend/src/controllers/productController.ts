import { Request, Response } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    console.log('[ProductController] GET /api/products called');
    const products = await getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
      message: 'Products fetched successfully',
    });
  } catch (error) {
    console.error('[ProductController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: 'An unexpected error occurred',
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    console.log(`[ProductController] GET /api/products/${req.params.id} called`);
    const product = await getProductById(req.params.id);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product fetched successfully',
    });
  } catch (error: any) {
    console.error('[ProductController] ❌ Error:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'No product exists with this ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: 'An unexpected error occurred',
    });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    console.log('[ProductController] POST /api/products called');
    const { name, description, price, category, imageUrl, stock } = req.body;

    if (!name || !description || price === undefined || !category || !imageUrl || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'name, description, price, category, imageUrl, and stock are required',
      });
    }

    const product = await createProduct({
      name,
      description,
      price: Number(price),
      category,
      imageUrl,
      stock: Number(stock),
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('[ProductController] ❌ Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: 'An unexpected error occurred',
    });
  }
};

export const editProduct = async (req: Request, res: Response) => {
  try {
    console.log(`[ProductController] PUT /api/products/${req.params.id} called`);
    const product = await updateProduct(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('[ProductController] ❌ Error:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'No product exists with this ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: 'An unexpected error occurred',
    });
  }
};

export const removeProduct = async (req: Request, res: Response) => {
  try {
    console.log(`[ProductController] DELETE /api/products/${req.params.id} called`);
    await deleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('[ProductController] ❌ Error:', error);
    if (error.message === 'Product not found') {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
        message: 'No product exists with this ID',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: 'An unexpected error occurred',
    });
  }
};
