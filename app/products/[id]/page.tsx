/**
 * Product detail page
 * Shows individual product with images, variants, and add to cart
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Product, ProductVariant, ProductReview } from '@/types';
import { Button } from '@/components/Button';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useCartStore } from '@/lib/cart-store';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
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

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`/api/reviews?product_id=${productId}`);
      const result = await response.json();

      if (result.success) {
        setReviews(result.data.reviews || []);
        setAverageRating(result.data.averageRating || 0);
        setTotalReviews(result.data.totalReviews || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error('Please sign in to leave a review');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
      } else {
        toast.error(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
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
          
          {/* Rating Display */}
          {totalReviews > 0 && (
            <div className="flex items-center mb-4">
              {renderStars(Math.round(averageRating), 'sm')}
              <span className="ml-2 text-sm text-gray-600">
                {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
          
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

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          {session && (
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="outline"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-gray-50 p-6 mb-8 border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Write Your Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="focus:outline-none"
                    >
                      <svg
                        className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Your Review</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                />
              </div>

              <Button type="submit" variant="primary">
                Submit Review
              </Button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {isLoadingReviews ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 border border-gray-200">
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
