/**
 * Basic tests for cart functionality
 */

import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/lib/cart-store';
import { Product } from '@/types';

// Mock product for testing
const mockProduct: Product = {
  id: '1',
  name: 'Test Hoodie',
  description: 'Test description',
  price: 59.99,
  category: 'Hoodies',
  stock: 10,
  created_at: new Date(),
};

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  test('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('1');
    expect(result.current.items[0].quantity).toBe(1);
  });

  test('should increase quantity when adding same item', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  test('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  test('should update item quantity', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  test('should calculate total correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct, undefined, 2);
    });

    const total = result.current.getTotal();
    expect(total).toBe(59.99 * 2);
  });

  test('should get item count correctly', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct, undefined, 3);
    });

    const count = result.current.getItemCount();
    expect(count).toBe(3);
  });

  test('should clear cart', () => {
    const { result } = renderHook(() => useCartStore());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});
