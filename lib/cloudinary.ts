/**
 * Cloudinary configuration and utilities
 * Handles image uploads for product images
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param fileBuffer - Image file buffer
 * @param folder - Folder name in Cloudinary (default: 'zerolimit/products')
 * @returns Cloudinary public URL of the uploaded image
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'zerolimit/products'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed with no result'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param imageUrl - Public URL of the image to delete
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from URL
    const parts = imageUrl.split('/');
    const fileName = parts[parts.length - 1].split('.')[0];
    const folderPath = parts.slice(-3, -1).join('/');
    const publicId = `${folderPath}/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  width?: number,
  height?: number
): string {
  const transformations = [];
  
  if (width || height) {
    transformations.push({ width, height, crop: 'fill' });
  }
  
  transformations.push({ quality: 'auto' }, { fetch_format: 'auto' });

  return cloudinary.url(publicId, {
    transformation: transformations,
    secure: true,
  });
}

export default cloudinary;
