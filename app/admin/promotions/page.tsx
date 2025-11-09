/**
 * Admin Promotions/Coupons Management Page
 * CRUD operations for discount codes
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Promotion } from '@/types';
import toast from 'react-hot-toast';
import { supabaseAdmin } from '@/lib/supabase';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent' as 'percent' | 'fixed',
    amount: 0,
    expiry: '',
    usage_limit: 0,
    active: true,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseAdmin
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      toast.error('Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPromotion) {
        // Update existing promotion
        const { error } = await supabaseAdmin
          .from('promotions')
          .update({
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            amount: formData.amount,
            expiry: formData.expiry || null,
            usage_limit: formData.usage_limit || null,
            active: formData.active,
          })
          .eq('id', editingPromotion.id);

        if (error) throw error;
        toast.success('Promotion updated successfully!');
      } else {
        // Create new promotion
        const { error } = await supabaseAdmin
          .from('promotions')
          .insert([{
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            amount: formData.amount,
            expiry: formData.expiry || null,
            usage_limit: formData.usage_limit || null,
            active: formData.active,
          }]);

        if (error) throw error;
        toast.success('Promotion created successfully!');
      }

      setShowForm(false);
      setEditingPromotion(null);
      resetForm();
      fetchPromotions();
    } catch (err: any) {
      console.error('Error saving promotion:', err);
      if (err.code === '23505') {
        toast.error('Coupon code already exists');
      } else {
        toast.error('Failed to save promotion');
      }
    }
  };

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      discount_type: promotion.discount_type,
      amount: promotion.amount,
      expiry: promotion.expiry ? new Date(promotion.expiry).toISOString().split('T')[0] : '',
      usage_limit: promotion.usage_limit || 0,
      active: promotion.active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return;

    try {
      const { error } = await supabaseAdmin
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Promotion deleted successfully!');
      fetchPromotions();
    } catch (err) {
      console.error('Error deleting promotion:', err);
      toast.error('Failed to delete promotion');
    }
  };

  const toggleActive = async (promotion: Promotion) => {
    try {
      const { error } = await supabaseAdmin
        .from('promotions')
        .update({ active: !promotion.active })
        .eq('id', promotion.id);

      if (error) throw error;
      toast.success(`Promotion ${!promotion.active ? 'activated' : 'deactivated'}`);
      fetchPromotions();
    } catch (err) {
      console.error('Error toggling promotion:', err);
      toast.error('Failed to update promotion');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percent',
      amount: 0,
      expiry: '',
      usage_limit: 0,
      active: true,
    });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingPromotion(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promotions & Coupons</h1>
          <p className="text-gray-600">Manage discount codes for your store</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
        >
          {showForm ? 'Cancel' : '+ New Coupon'}
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black uppercase"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Discount Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percent' | 'fixed' })}
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount {formData.discount_type === 'percent' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expiry Date (Optional)</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Usage Limit (Optional)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) })}
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  className="w-4 h-4 mr-2"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                <label htmlFor="active" className="text-sm font-medium">Active</label>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
              </Button>
              {editingPromotion && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Promotions List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          {promotions.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No promotions found. Create your first coupon code!
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Discount</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Expiry</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Usage</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion.id}>
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold">{promotion.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      {promotion.discount_type === 'percent' ? `${promotion.amount}%` : `$${promotion.amount}`}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {promotion.expiry 
                        ? new Date(promotion.expiry).toLocaleDateString()
                        : 'No expiry'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {promotion.usage_count} / {promotion.usage_limit || '∞'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${
                        promotion.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {promotion.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(promotion)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toggleActive(promotion)}
                          className="text-gray-600 hover:underline text-sm"
                        >
                          {promotion.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
