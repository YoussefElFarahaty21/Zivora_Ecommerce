import { db } from '../config/firebase';
import { Product, CreateProductDTO } from '../interfaces/Product';

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    console.log('[ProductService] Fetching all products...');
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    console.log(`[ProductService] ✅ Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('[ProductService] ❌ Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    console.log(`[ProductService] Fetching product with id: ${id}`);
    const doc = await db.collection('products').doc(id).get();
    if (!doc.exists) {
      throw new Error('Product not found');
    }
    const product = { id: doc.id, ...doc.data() } as Product;
    console.log(`[ProductService] ✅ Found product: ${product.name}`);
    return product;
  } catch (error) {
    console.error('[ProductService] ❌ Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  try {
    console.log('[ProductService] Creating new product...');
    const productData = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('products').add(productData);
    const newProduct = { id: docRef.id, ...productData } as Product;
    console.log(`[ProductService] ✅ Product created with id: ${docRef.id}`);
    return newProduct;
  } catch (error) {
    console.error('[ProductService] ❌ Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<CreateProductDTO>): Promise<Product> => {
  try {
    console.log(`[ProductService] Updating product with id: ${id}`);
    const docRef = db.collection('products').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      throw new Error('Product not found');
    }
    await docRef.update({ ...data });
    const updated = await docRef.get();
    const product = { id: updated.id, ...updated.data() } as Product;
    console.log(`[ProductService] ✅ Product updated: ${product.name}`);
    return product;
  } catch (error) {
    console.error('[ProductService] ❌ Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    console.log(`[ProductService] Deleting product with id: ${id}`);
    const docRef = db.collection('products').doc(id);
    const existing = await docRef.get();
    if (!existing.exists) {
      throw new Error('Product not found');
    }
    await docRef.delete();
    console.log(`[ProductService] ✅ Product deleted: ${id}`);
  } catch (error) {
    console.error('[ProductService] ❌ Error deleting product:', error);
    throw error;
  }
};
