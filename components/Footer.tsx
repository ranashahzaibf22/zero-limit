/**
 * Footer component
 */

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">ZeroLimitApparel</h3>
            <p className="text-gray-400 text-sm">
              Premium quality hoodies with minimalist design.
              Break your limits, not your budget.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Classic" className="text-gray-400 hover:text-white">
                  Classic
                </Link>
              </li>
              <li>
                <Link href="/products?category=Custom" className="text-gray-400 hover:text-white">
                  Custom
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gen-Z" className="text-gray-400 hover:text-white">
                  Gen-Z
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link href="/help#shipping" className="text-gray-400 hover:text-white">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/help#returns" className="text-gray-400 hover:text-white">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/help#faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} ZeroLimitApparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
