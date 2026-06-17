import { useState, useEffect, useCallback, useRef } from 'react';
import { getProducts, getProduct } from '../services/productService';

const POLL_MS = 1000;

export function useProducts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);

  const fetchProducts = useCallback(async () => {
    try {
      if (isFirstLoad.current) setIsLoading(true);
      const result = await getProducts();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      if (isFirstLoad.current) {
        setIsLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  return { data, isLoading, error, refetch: fetchProducts };
}

export function useProduct(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (!id) return;

    isFirstLoad.current = true;
    setIsLoading(true);
    setError(null);

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        const result = await getProduct(id);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled && isFirstLoad.current) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      }
    };

    fetchProduct();
    const interval = setInterval(fetchProduct, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id]);

  return { data, isLoading, error };
}
