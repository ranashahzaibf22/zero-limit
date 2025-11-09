/**
 * Core TypeScript type definitions for ZeroLimitApparel eCommerce store
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash?: string;
  role?: 'user' | 'admin';
  created_at: Date;
  updated_at?: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  created_at: Date;
  updated_at?: Date;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  alt_text?: string;
  created_at?: Date;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  variant_name: string; // e.g., "Small-Black", "Medium-White"
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku?: string;
  created_at?: Date;
}

export interface Order {
  id: string;
  user_id: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: Address;
  payment_type?: 'cod' | 'prebooking'; // Cash on Delivery or Pre-booking
  payment_status?: 'pending' | 'paid' | 'failed';
  contact_number?: string; // For pre-booking payments
  created_at: Date;
  updated_at?: Date;
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  product?: Product;
  variant?: ProductVariant;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Admin Analytics Types
export interface SalesOverview {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: {
    product: Product;
    totalSold: number;
    revenue: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface CheckoutFormData {
  email: string;
  name: string;
  address: Address;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  variants?: Omit<ProductVariant, 'id' | 'product_id'>[];
}
