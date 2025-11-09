/**
 * Product Reviews API Route
 * Handles fetching and creating product reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('product_reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        user:users (
          id,
          name
        )
      `)
      .eq('product_id', product_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate average rating
    const avgRating = data && data.length > 0
      ? data.reduce((sum, review) => sum + review.rating, 0) / data.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews: data || [],
        averageRating: avgRating,
        totalReviews: data?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Add a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Please sign in to leave a review' },
        { status: 401 }
      );
    }

    const { product_id, rating, comment } = await request.json();

    if (!product_id || !rating) {
      return NextResponse.json(
        { success: false, error: 'Product ID and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('product_reviews')
      .insert([{
        product_id,
        user_id: session.user.id,
        rating,
        comment: comment || '',
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
