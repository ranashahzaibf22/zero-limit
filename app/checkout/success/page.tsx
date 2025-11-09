/**
 * Checkout success page
 * Displayed after successful payment
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 mb-4">
            You will receive an order confirmation email shortly with your order details and tracking information.
          </p>
          <p className="text-sm text-gray-600">
            If you have any questions about your order, please contact our customer support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="outline" size="lg">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
