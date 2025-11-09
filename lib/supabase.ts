/**
 * Supabase client configuration
 * Handles database connections and storage operations
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side Supabase client with service role (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name (default: 'products')
 * @returns Public URL of uploaded image
 */
export async function uploadImage(
  file: File,
  bucket: string = 'products'
): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
}

/**
 * Delete image from Supabase Storage
 * @param url - Public URL of the image
 * @param bucket - Storage bucket name
 */
export async function deleteImage(
  url: string,
  bucket: string = 'products'
): Promise<void> {
  const fileName = url.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName]);

  if (error) {
    console.error('Failed to delete image:', error);
  }
}

export default supabase;
