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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (session) {
      checkWishlistStatus();
    }
  }, [productId, session]);

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

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/wishlist');
      const result = await response.json();
      
      if (result.success) {
        const inWishlist = result.data.some((item: any) => item.product_id === productId);
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!session) {
      toast.error('Please sign in to save for later');
      router.push('/auth/signin');
      return;
    }

    setIsTogglingWishlist(true);
    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist?product_id=${productId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (result.success) {
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId }),
        });
        const result = await response.json();
        
        if (result.success) {
          setIsInWishlist(true);
          toast.success('Saved for later!');
        } else {
          toast.error(result.error || 'Failed to save for later');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
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
      <div className="min-h-screen bg-neutral-50 flex justify-center items-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-emerald-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md">
          <svg className="w-24 h-24 mx-auto text-neutral-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h1 className="text-2xl font-bold mb-4 text-neutral-900">Product Not Found</h1>
          <p className="text-neutral-600 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/products')} className="bg-emerald-600 hover:bg-emerald-700">
            Browse Products
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
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center space-x-2 text-sm text-neutral-600">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-emerald-600">Products</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Images */}
          <div className="p-8">
            <div className="aspect-square relative bg-neutral-100 mb-6 rounded-xl overflow-hidden">
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
                    className={`aspect-square relative bg-neutral-100 border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index ? 'border-emerald-600 shadow-lg scale-105' : 'border-neutral-200 hover:border-emerald-400'
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
          <div className="p-8 lg:p-12">
            {/* Category Badge */}
            {product.category && (
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
                <span className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">{product.category}</span>
              </div>
            )}

            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-neutral-900">{product.name}</h1>
            
            {/* Rating Display */}
            {totalReviews > 0 && (
              <div className="flex items-center mb-6">
                {renderStars(Math.round(averageRating), 'sm')}
                <span className="ml-3 text-sm text-neutral-600 font-medium">
                  {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            <div className="text-4xl font-bold mb-8 text-neutral-900">
              ${currentPrice.toFixed(2)}
            </div>

            <p className="text-neutral-700 mb-8 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <label className="block font-bold mb-4 text-neutral-900">Select Size/Color</label>
                <div className="grid grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-3 border-2 rounded-lg font-semibold transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-lg'
                          : 'border-neutral-300 text-neutral-700 hover:border-emerald-600'
                      }`}
                    >
                    {variant.variant_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <label className="block font-bold mb-4 text-neutral-900">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 border-2 border-neutral-300 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all font-bold text-neutral-700"
              >
                -
              </button>
              <span className="text-2xl font-bold w-16 text-center text-neutral-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="w-12 h-12 border-2 border-neutral-300 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all font-bold text-neutral-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-8">
            {currentStock > 0 ? (
              <div className="flex items-center text-emerald-600 bg-emerald-50 px-4 py-3 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold">In Stock ({currentStock} available)</p>
              </div>
            ) : (
              <div className="flex items-center text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold">Out of Stock</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Button
              variant="primary"
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={handleAddToCart}
              disabled={currentStock === 0}
            >
              {currentStock > 0 ? (
                <span className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </span>
              ) : 'Out of Stock'}
            </Button>

            {/* Save for Later Button */}
            <button
              onClick={toggleWishlist}
              disabled={isTogglingWishlist}
              className={`w-full py-4 px-6 border-2 rounded-xl font-bold transition-all flex items-center justify-center ${
                isInWishlist 
                  ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-neutral-300 text-neutral-700 hover:border-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <svg 
                className={`w-6 h-6 mr-2 ${isInWishlist ? 'fill-current' : ''}`} 
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isInWishlist ? 'Saved for Later' : 'Save for Later'}
            </button>

            {/* WhatsApp Contact */}
            <WhatsAppButton 
              message={`Hi, I'm interested in ${product.name}`}
              className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Buy Now on WhatsApp
            </WhatsAppButton>
          </div>
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
