/**
 * Admin Login Page
 * Separate login page for admin users
 */

'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
        setIsLoading(false);
      } else {
        // Check if user is admin by fetching session
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        
        if (session?.user?.role === 'admin') {
          toast.success('Logged in successfully!');
          router.push('/admin/dashboard');
          router.refresh();
        } else {
          toast.error('Access denied. Admin privileges required.');
          setIsLoading(false);
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
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
              Sign in to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-neutral-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                placeholder="admin@zerolimitapparel.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-neutral-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all"
              isLoading={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600 text-center">
              <span className="font-semibold text-neutral-900">Default credentials:</span><br />
              <span className="text-emerald-600 font-mono">admin@zerolimitapparel.com</span> / <span className="text-emerald-600 font-mono">shahzaib12</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Need help? <a href="/help" className="text-emerald-600 hover:text-emerald-700 font-semibold">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
