/**
 * Product Card component for displaying products in grid layouts
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url || 
                      '/placeholder-product.jpg';

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-black transition-all duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">OUT OF STOCK</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:underline">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold">
            ${product.price.toFixed(2)}
          </span>
          
          {onAddToCart && product.stock > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </Button>
          )}
        </div>
        
        {product.category && (
          <div className="mt-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
