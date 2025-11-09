/**
 * User account page
 * View order history
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account');
    } else if (session?.user?.id) {
      fetchOrders();
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*, product:products(*))
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      {/* User Info */}
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Account Information</h2>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {session.user.name}</p>
          <p><span className="font-medium">Email:</span> {session.user.email}</p>
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">Order History</h2>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="mb-4">You haven't placed any orders yet.</p>
            <a href="/products" className="text-black underline">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <div key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${parseFloat(order.total.toString()).toFixed(2)}</p>
                    <p className={`text-sm ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'shipped' ? 'text-blue-600' :
                      order.status === 'processing' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-sm text-gray-700">
                        {item.product?.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
