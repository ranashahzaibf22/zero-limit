/**
 * Header navigation component with cart icon and search
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/cart-store';

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-white/95">
      <nav className="container mx-auto px-4 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl lg:text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
              ZeroLimit
            </span>
            <span className="text-emerald-600">Apparel</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            <Link href="/products" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
              Shop
            </Link>
            <Link href="/products?category=Classic" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
              Classic
            </Link>
            <Link href="/products?category=Custom" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
              Custom
            </Link>
            <Link href="/products?category=Gen-Z" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
              Gen-Z
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
              About
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-5 lg:space-x-6">
            {session ? (
              <>
                <Link href="/wishlist" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors hidden md:block">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>
                <Link href="/account" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-neutral-700 hover:text-red-600 font-medium transition-colors hidden md:block"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors hidden md:inline-block">
                  Sign Up
                </Link>
              </>
            )}

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-neutral-700 hover:text-emerald-600 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-neutral-700 hover:text-emerald-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="mt-4 pb-2 animate-in slide-in-from-top">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-5 py-3.5 pr-12 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-600 hover:text-emerald-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/products" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
            Shop
          </Link>
          <Link href="/products?category=Classic" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
            Classic
          </Link>
          <Link href="/products?category=Custom" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
            Custom
          </Link>
          <Link href="/products?category=Gen-Z" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
            Gen-Z
          </Link>
          <Link href="/about" className="text-neutral-700 hover:text-emerald-600 font-medium transition-colors">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
