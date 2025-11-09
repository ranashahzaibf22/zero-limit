/**
 * Products catalog page
 * Display all products with filtering and search
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const url = params.toString() 
        ? `/api/products?${params.toString()}`
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
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
            <span className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">
              {category ? category : 'All Products'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            {search ? `Search Results for "${search}"` : category ? `${category} Collection` : 'Our Collection'}
          </h1>
          <p className="text-neutral-600 text-lg">
            {search 
              ? `Found ${products.length} ${products.length === 1 ? 'product' : 'products'}`
              : 'Discover our premium quality hoodies crafted for comfort and style'
            }
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-emerald-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <svg className="w-24 h-24 mx-auto text-neutral-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-neutral-600 text-xl font-medium mb-2">No products found</p>
                <p className="text-neutral-500">Try adjusting your search or browse all products</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-emerald-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
