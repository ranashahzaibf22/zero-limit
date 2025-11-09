/**
 * Homepage for ZeroLimitApparel
 * Features hero section, featured products, and collections
 */

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/Button';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0">
          <Image
            src="/hero-image.jpg"
            alt="ZeroLimitApparel Hero"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Break Your Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Premium quality hoodies with minimalist design. 
              Comfort meets style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg" className="bg-white text-black hover:bg-gray-200">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Classic Collection */}
          <Link href="/products?category=Classic" className="group relative h-96 overflow-hidden border border-gray-200 hover:border-black transition-colors">
            <div className="absolute inset-0 bg-black">
              <Image
                src="/collection-classic.jpg"
                alt="Classic Collection"
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Classic</h3>
              <p className="text-gray-200 mb-4">Timeless designs for everyday wear</p>
              <span className="text-sm underline">Shop Collection →</span>
            </div>
          </Link>

          {/* Custom Collection */}
          <Link href="/products?category=Custom" className="group relative h-96 overflow-hidden border border-gray-200 hover:border-black transition-colors">
            <div className="absolute inset-0 bg-black">
              <Image
                src="/collection-custom.jpg"
                alt="Custom Collection"
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Custom</h3>
              <p className="text-gray-200 mb-4">Personalized designs just for you</p>
              <span className="text-sm underline">Shop Collection →</span>
            </div>
          </Link>

          {/* Gen-Z Collection */}
          <Link href="/products?category=Gen-Z" className="group relative h-96 overflow-hidden border border-gray-200 hover:border-black transition-colors">
            <div className="absolute inset-0 bg-black">
              <Image
                src="/collection-genz.jpg"
                alt="Gen-Z Collection"
                fill
                className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">Gen-Z</h3>
              <p className="text-gray-200 mb-4">Trendy oversized fit for the modern generation</p>
              <span className="text-sm underline">Shop Collection →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose ZeroLimitApparel?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Made from the finest materials for lasting comfort and durability.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">
                Premium quality without the premium price tag. Value for money.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">
                Safe and secure checkout with Stripe. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-black text-white p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Break Your Limits?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust ZeroLimitApparel for premium quality hoodies.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="bg-white text-black hover:bg-gray-200">
              Shop All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

