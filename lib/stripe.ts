/**
 * Stripe payment configuration and utilities
 * Handles payment processing and webhook management
 */

import Stripe from 'stripe';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Create a payment intent for checkout
 * @param amount - Amount in cents (e.g., 5999 for $59.99)
 * @param metadata - Additional metadata to attach to payment
 * @returns Stripe PaymentIntent
 */
export async function createPaymentIntent(
  amount: number,
  metadata: Record<string, string> = {}
) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Verify Stripe webhook signature
 * @param payload - Raw request body
 * @param signature - Stripe signature header
 * @returns Stripe Event
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Format amount from cents to dollars
 * @param cents - Amount in cents
 * @returns Formatted dollar amount (e.g., "$59.99")
 */
export function formatAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

/**
 * Convert dollar amount to cents
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export default stripe;
