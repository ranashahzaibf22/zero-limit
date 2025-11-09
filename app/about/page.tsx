/**
 * About page
 */

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 text-center">About ZeroLimitApparel</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-6 text-center">
            Breaking limits, one hoodie at a time.
          </p>

          <div className="bg-gray-50 p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              ZeroLimitApparel was founded with a simple mission: to provide premium quality 
              hoodies that combine comfort, style, and affordability. We believe that everyone 
              deserves to feel confident and comfortable in what they wear.
            </p>
            <p className="text-gray-700">
              Our minimalist black and white aesthetic reflects our philosophy - simple, 
              timeless, and effective. We don't believe in limits, and we want our customers 
              to break through theirs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-3">Quality First</h3>
              <p className="text-gray-700">
                Every hoodie is crafted from premium materials and undergoes rigorous 
                quality control to ensure it meets our high standards.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-3">Sustainable</h3>
              <p className="text-gray-700">
                We're committed to sustainable practices, from sourcing to production, 
                ensuring our impact on the planet is minimal.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-3">Fair Pricing</h3>
              <p className="text-gray-700">
                Premium quality doesn't have to mean premium prices. We keep our costs 
                low to pass the savings on to you.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-2xl font-bold mb-3">Customer First</h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We offer hassle-free returns and 
                responsive customer support.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button variant="primary" size="lg">
                Shop Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
