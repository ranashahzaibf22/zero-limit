/**
 * Manual order creation API endpoint
 * POST /api/checkout - Create order with COD or Pre-booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    const { items, total, shippingAddress, paymentType, contactNumber } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    if (!paymentType || !['cod', 'prebooking'].includes(paymentType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // For pre-booking, contact number is required
    if (paymentType === 'prebooking' && !contactNumber) {
      return NextResponse.json(
        { success: false, error: 'Contact number required for pre-booking' },
        { status: 400 }
      );
    }

    // Create order in database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: session?.user?.id || null,
          total,
          status: 'pending',
          payment_type: paymentType,
          payment_status: paymentType === 'cod' ? 'pending' : 'pending',
          contact_number: contactNumber || null,
          shipping_address: shippingAddress,
        },
      ])
      .select()
      .single();

    if (orderError) {
      throw orderError;
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      variant_id: item.variant?.id || null,
      quantity: item.quantity,
      price: item.variant?.price || item.product.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw itemsError;
    }

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
