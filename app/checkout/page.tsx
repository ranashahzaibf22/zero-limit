/**
 * Checkout page with Stripe payment integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/Button';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const subtotal = getTotal();
  const shipping = 10;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          receipt_email: formData.email,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else {
        // Payment successful
        clearCart();
        router.push('/checkout/success');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Element */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <PaymentElement />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const subtotal = getTotal();
  const shipping = 10;
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Create payment intent
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        total,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          toast.error('Failed to initialize checkout');
        }
      })
      .catch((err) => {
        console.error('Checkout error:', err);
        toast.error('An error occurred');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to initialize checkout</h1>
          <Button onClick={() => router.push('/cart')}>
            Return to Cart
          </Button>
        </div>
      </div>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#000000',
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <CheckoutForm />
          </Elements>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 border border-gray-200 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map((item) => {
                const price = item.variant?.price || item.product.price;
                return (
                  <div key={`${item.product.id}-${item.variant?.id}`} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="font-medium">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 border-t border-gray-300 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
