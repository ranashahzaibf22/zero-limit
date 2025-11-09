/**
 * Manual order creation API endpoint
 * POST /api/checkout - Create order with COD or Pre-booking
 * 
 * This endpoint handles manual payment methods:
 * - COD (Cash on Delivery): Customer pays when receiving the order
 * - Pre-booking: Store collects contact number and reaches out for payment
 * 
 * No payment gateway integration required - keeps costs at $0/month
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get session if user is logged in (optional for checkout)
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { items, total, shippingAddress, paymentType, contactNumber } = body;

    // Validate cart items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Validate payment type (must be 'cod' or 'prebooking')
    if (!paymentType || !['cod', 'prebooking'].includes(paymentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // For pre-booking, contact number is required for payment coordination
    if (paymentType === 'prebooking' && !contactNumber) {
      return NextResponse.json(
        { success: false, error: 'Contact number required for pre-booking' },
        { status: 400 }
      );
    }

    // Create order in Supabase database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: session?.user?.id || null, // Null if guest checkout
          total,
          status: 'pending', // Order starts as pending
          payment_type: paymentType, // 'cod' or 'prebooking'
          payment_status: 'pending', // Will be updated after payment confirmation
          contact_number: contactNumber || null, // For pre-booking coordination
          shipping_address: shippingAddress,
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items (line items for products in the order)
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      variant_id: item.variant?.id || null,
      quantity: item.quantity,
      price: item.variant?.price || item.product.price, // Store price at time of order
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

    // Return success with appropriate message based on payment type
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: order.total,
        payment_type: order.payment_type,
      },
      message: paymentType === 'cod' 
        ? 'Order placed successfully! Pay on delivery.' 
        : 'Order received! We will contact you for payment details.',
    });
  } catch (error: any) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create order',
      },
      { status: 500 }
    );
  }
}
