/**
 * Products catalog page
 * Display all products with filtering and search
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = category 
        ? `/api/products?category=${encodeURIComponent(category)}`
        : '/api/products';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {category ? `${category}` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          Discover our collection of premium quality hoodies
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
