/**
 * Header navigation component with cart icon
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/cart-store';

export function Header() {
  const { data: session } = useSession();
  const itemCount = useCartStore((state) => state.getItemCount());

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
            <Link href="/products?category=Hoodies" className="hover:underline">
              Hoodies
            </Link>
            <Link href="/about" className="hover:underline">
              About
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
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
                <Link href="/auth/signup" className="hover:underline">
                  Sign Up
                </Link>
              </>
            )}

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

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-4 text-sm">
          <Link href="/products" className="hover:underline">
            Shop
          </Link>
          <Link href="/products?category=Hoodies" className="hover:underline">
            Hoodies
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
