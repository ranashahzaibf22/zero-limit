/**
 * Product Card component for displaying products in grid layouts
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Product } from '@/types';
import { Button } from './Button';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showWishlist?: boolean;
}

export function ProductCard({ product, onAddToCart, showWishlist = true }: ProductCardProps) {
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url || 
                      '/placeholder-product.jpg';

  useEffect(() => {
    if (session && showWishlist) {
      checkWishlistStatus();
    }
  }, [session, product.id, showWishlist]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const result = await response.json();
      
      if (result.success) {
        const inWishlist = result.data.some((item: any) => item.product_id === product.id);
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist?product_id=${product.id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.success) {
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: product.id }),
        });
        const result = await response.json();
        
        if (result.success) {
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        } else {
          toast.error(result.error || 'Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-neutral-200">
      {/* Wishlist Button */}
      {showWishlist && session && (
        <button
          onClick={toggleWishlist}
          disabled={isTogglingWishlist}
          className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-neutral-600'}`}
            fill={isInWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      )}

      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-neutral-100">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg px-4 py-2 bg-red-600 rounded-lg">OUT OF STOCK</span>
            </div>
          )}
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
              {product.category}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-xl mb-2 hover:text-emerald-600 transition-colors text-neutral-900">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-neutral-900">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-xs text-orange-600 mt-1">Only {product.stock} left!</p>
            )}
          </div>
          
          {onAddToCart && product.stock > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddToCart(product)}
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
