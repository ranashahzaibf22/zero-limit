/**
 * Homepage for ZeroLimitApparel
 * Features hero section, featured products, and collections
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6');
      const data = await response.json();
      
      if (data.success) {
        setFeaturedProducts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
      {/* Hero Section - Modern & Premium */}
      <section className="relative h-[700px] bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/hero-image.jpg"
            alt="ZeroLimitApparel Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent z-10 animate-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="relative z-20 container mx-auto px-4 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 px-4 py-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full">
              <span className="text-emerald-400 text-sm font-semibold">Premium Quality • Minimalist Design</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Break Your <span className="text-emerald-400">Limits</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-neutral-200 leading-relaxed">
              Discover premium quality hoodies crafted for those who dare to stand out. 
              Where comfort meets uncompromising style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700 px-8 py-4 text-lg font-semibold rounded-lg btn-hover-lift shadow-lg">
                  Explore Collection →
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-4 text-lg font-semibold rounded-lg btn-hover-lift">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg className="w-6 h-6 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
            <span className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">Featured Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
            Trending Now
          </h2>
          <p className="text-neutral-600 text-lg md:text-xl max-w-2xl mx-auto">
            Discover our most popular pieces. Handpicked for style, crafted for comfort.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-emerald-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full animate-ping opacity-20"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <div className="text-center">
              <Link href="/products">
                <Button variant="outline" size="lg" className="border-2 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg btn-hover-lift">
                  View All Products →
                </Button>
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Featured Collections */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-neutral-100 rounded-full">
              <span className="text-neutral-700 text-sm font-semibold uppercase tracking-wide">Shop By Category</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">
              Explore Collections
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Classic Collection */}
            <Link href="/products?category=Classic" className="group relative h-[500px] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow card-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800">
                <Image
                  src="/collection-classic.jpg"
                  alt="Classic Collection"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <div className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit">
                  <span className="text-xs font-semibold">TIMELESS</span>
                </div>
                <h3 className="text-4xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">Classic</h3>
                <p className="text-neutral-200 mb-6 text-lg">Timeless designs for everyday elegance</p>
                <span className="inline-flex items-center text-sm font-semibold text-emerald-400 group-hover:gap-3 gap-2 transition-all">
                  Shop Collection 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Custom Collection */}
            <Link href="/products?category=Custom" className="group relative h-[500px] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow card-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-700">
                <Image
                  src="/collection-custom.jpg"
                  alt="Custom Collection"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <div className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit">
                  <span className="text-xs font-semibold">PERSONALIZED</span>
                </div>
                <h3 className="text-4xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">Custom</h3>
                <p className="text-neutral-200 mb-6 text-lg">Unique designs crafted just for you</p>
                <span className="inline-flex items-center text-sm font-semibold text-emerald-400 group-hover:gap-3 gap-2 transition-all">
                  Shop Collection 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>

            {/* Gen-Z Collection */}
            <Link href="/products?category=Gen-Z" className="group relative h-[500px] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow card-hover">
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-600">
                <Image
                  src="/collection-genz.jpg"
                  alt="Gen-Z Collection"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
                <div className="inline-block mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full w-fit">
                  <span className="text-xs font-semibold">TRENDING</span>
                </div>
                <h3 className="text-4xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">Gen-Z</h3>
                <p className="text-neutral-200 mb-6 text-lg">Bold oversized fits for the modern era</p>
                <span className="inline-flex items-center text-sm font-semibold text-emerald-400 group-hover:gap-3 gap-2 transition-all">
                  Shop Collection 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-50 py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-white rounded-full shadow-sm">
              <span className="text-neutral-700 text-sm font-semibold uppercase tracking-wide">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              The ZeroLimit Difference
            </h2>
            <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
              We're committed to delivering excellence in every thread
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow card-hover">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Premium Quality</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Crafted from the finest materials for unmatched comfort and durability that lasts.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow card-hover">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Fair Pricing</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Premium quality without the premium price tag. Exceptional value for money.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow card-hover">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Secure Checkout</h3>
              <p className="text-neutral-600 text-lg leading-relaxed">
                Safe and secure payment options. Your data is protected with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent" />
            <div className="relative p-12 md:p-20 text-center">
              <div className="inline-block mb-6 px-4 py-2 bg-emerald-600/20 backdrop-blur-sm border border-emerald-500/30 rounded-full">
                <span className="text-emerald-400 text-sm font-semibold">Join Our Community</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                Ready to Break Your <span className="text-emerald-400">Limits?</span>
              </h2>
              <p className="text-xl md:text-2xl text-neutral-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied customers who trust ZeroLimitApparel for premium quality hoodies 
                that redefine comfort and style.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/products">
                  <Button variant="primary" size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700 px-10 py-5 text-lg font-semibold rounded-lg btn-hover-lift shadow-xl">
                    Shop All Products →
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-10 py-5 text-lg font-semibold rounded-lg btn-hover-lift">
                    Need Help?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

