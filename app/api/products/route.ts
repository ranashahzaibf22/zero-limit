/**
 * Products API endpoint
 * GET /api/products - List all products with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products?.length || 0,
    });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}
