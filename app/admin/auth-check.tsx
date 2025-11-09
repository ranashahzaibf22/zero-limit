'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ADMIN_TOKEN = '1234shah56';
const TOKEN_KEY = 'admin_auth_token';

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken === ADMIN_TOKEN) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === ADMIN_TOKEN) {
      localStorage.setItem(TOKEN_KEY, token);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid authentication token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
    router.push('/');
  };

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-neutral-200 border-t-emerald-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-emerald-600 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white p-10 rounded-2xl shadow-2xl border border-neutral-200">
            <div className="mb-8 text-center">
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 rounded-full">
                <span className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">Admin Access</span>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                <span className="text-neutral-900">ZeroLimit</span>
                <span className="text-emerald-600">Apparel</span>
              </h2>
              <p className="text-neutral-600">
                Enter authentication token to access admin panel
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-semibold mb-2 text-neutral-700">
                  Authentication Token
                </label>
                <input
                  id="token"
                  name="token"
                  type="password"
                  required
                  className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  placeholder="Enter token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Admin Panel - ZeroLimitApparel</h1>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-sm hover:underline">
                ← Back to Store
              </a>
              <button
                onClick={handleLogout}
                className="text-sm bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <a
              href="/admin/dashboard"
              className={`py-4 border-b-2 transition-colors ${
                pathname === '/admin/dashboard'
                  ? 'border-black font-semibold'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Dashboard
            </a>
            <a
              href="/admin/products"
              className={`py-4 border-b-2 transition-colors ${
                pathname === '/admin/products'
                  ? 'border-black font-semibold'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Products
            </a>
            <a
              href="/admin/orders"
              className={`py-4 border-b-2 transition-colors ${
                pathname === '/admin/orders'
                  ? 'border-black font-semibold'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Orders
            </a>
            <a
              href="/admin/customers"
              className={`py-4 border-b-2 transition-colors ${
                pathname === '/admin/customers'
                  ? 'border-black font-semibold'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Customers
            </a>
            <a
              href="/admin/promotions"
              className={`py-4 border-b-2 transition-colors ${
                pathname === '/admin/promotions'
                  ? 'border-black font-semibold'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Promotions
            </a>
          </nav>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
