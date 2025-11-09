/**
 * Stripe checkout session API endpoint
 * POST /api/checkout - Create a Stripe checkout session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, toCents } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
      toCents(total),
      {
        user_id: session?.user?.id || 'guest',
        items: JSON.stringify(items.map((item: any) => ({
          product_id: item.product.id,
          variant_id: item.variant?.id,
          quantity: item.quantity,
          price: item.variant?.price || item.product.price,
        }))),
      }
    );

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}
