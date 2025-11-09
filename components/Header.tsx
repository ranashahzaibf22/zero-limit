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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ZeroLimitApparel
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:underline">
              Shop
            </Link>
            <Link href="/products?category=Classic" className="hover:underline">
              Classic
            </Link>
            <Link href="/products?category=Custom" className="hover:underline">
              Custom
            </Link>
            <Link href="/products?category=Gen-Z" className="hover:underline">
              Gen-Z
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/wishlist" className="hover:underline hidden md:block">
                  Wishlist
                </Link>
                <Link href="/account" className="hover:underline">
                  Account
                </Link>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="hover:underline"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hover:underline">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="hover:underline hidden md:inline">
                  Sign Up
                </Link>
              </>
            )}

            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:underline"
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
            <Link href="/cart" className="relative">
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
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="mt-4 pb-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
        <div className="md:hidden mt-4 flex space-x-4 text-sm">
          <Link href="/products" className="hover:underline">
            Shop
          </Link>
          <Link href="/products?category=Classic" className="hover:underline">
            Classic
          </Link>
          <Link href="/products?category=Custom" className="hover:underline">
            Custom
          </Link>
          <Link href="/products?category=Gen-Z" className="hover:underline">
            Gen-Z
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
