'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Product page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md">
        <svg 
          className="w-24 h-24 mx-auto text-red-500 mb-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <h2 className="text-2xl font-bold mb-4 text-neutral-900">Something went wrong!</h2>
        <p className="text-neutral-600 mb-6">
          We encountered an error while loading this product. This might be due to configuration issues.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Try Again
          </button>
          <a
            href="/products"
            className="block w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-semibold py-3 px-6 rounded-lg transition-all"
          >
            Back to Products
          </a>
        </div>
        {error.message && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-neutral-500 hover:text-neutral-700">
              Error details
            </summary>
            <p className="mt-2 text-xs text-neutral-600 bg-neutral-100 p-3 rounded">
              {error.message}
            </p>
          </details>
        )}
      </div>
    </div>
  );
}
