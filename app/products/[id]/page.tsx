/**
 * Product detail page
 * Shows individual product with images, variants, and add to cart
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types';
import { Button } from '@/components/Button';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(*),
          variants:product_variants(*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
      
      // Set default variant if available
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, selectedVariant, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const primaryImage = product.images?.find((img) => img.is_primary)?.image_url || 
                      product.images?.[0]?.image_url || 
                      '/placeholder-product.jpg';

  const images = product.images || [];
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square relative bg-gray-100 mb-4">
            <Image
              src={images[selectedImage]?.image_url || primaryImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative bg-gray-100 border-2 transition-colors ${
                    selectedImage === index ? 'border-black' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold mb-6">
            ${currentPrice.toFixed(2)}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <label className="block font-medium mb-3">Select Size/Color</label>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 border-2 transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {variant.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-3">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 hover:border-black transition-colors"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="w-10 h-10 border border-gray-300 hover:border-black transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {currentStock > 0 ? (
              <p className="text-green-600">In Stock ({currentStock} available)</p>
            ) : (
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="lg"
            className="w-full mb-4"
            onClick={handleAddToCart}
            disabled={currentStock === 0}
          >
            {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          {/* WhatsApp Contact */}
          <div className="mb-4">
            <WhatsAppButton 
              message={`Hi, I'm interested in ${product.name}`}
              className="w-full"
            />
          </div>

          {/* Category */}
          {product.category && (
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Category:{' '}
                <span className="font-medium text-black">{product.category}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
