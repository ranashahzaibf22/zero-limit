/**
 * Shopping Cart page
 * Display cart items, update quantities, and proceed to checkout
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal > 0 ? 10 : 0; // $10 flat shipping
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              const price = item.variant?.price || item.product.price;
              const primaryImage = item.product.images?.find((img) => img.is_primary)?.image_url || 
                                  item.product.images?.[0]?.image_url || 
                                  '/placeholder-product.jpg';

              return (
                <div
                  key={`${item.product.id}-${item.variant?.id || 'default'}`}
                  className="flex gap-4 p-4 border border-gray-200 bg-white"
                >
                  {/* Image */}
                  <div className="w-24 h-24 relative bg-gray-100 flex-shrink-0">
                    <Image
                      src={primaryImage}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-semibold text-lg hover:underline"
                    >
                      {item.product.name}
                    </Link>
                    
                    {item.variant && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.variant.variant_name}
                      </p>
                    )}

                    <p className="text-lg font-bold mt-2">
                      ${price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                        className="w-8 h-8 border border-gray-300 hover:border-black transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                        className="w-8 h-8 border border-gray-300 hover:border-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right flex flex-col justify-between">
                    <p className="text-xl font-bold">
                      ${(price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        removeItem(item.product.id, item.variant?.id);
                        toast.success('Item removed from cart');
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clear Cart Button */}
          <div className="mt-6">
            <button
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="text-sm text-gray-600 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 border border-gray-200 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-3 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mb-4"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>

            <Link href="/products">
              <Button variant="outline" size="md" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
