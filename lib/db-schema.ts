/**
 * Database utility functions
 * SQL schema and migration helpers for PostgreSQL
 */

/**
 * SQL Schema for ZeroLimitApparel Database
 * Run this in your Supabase SQL Editor or Neon SQL console
 */

export const DATABASE_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  alt_text VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Variants table (for size/color combinations)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_type VARCHAR(50) DEFAULT 'cod', -- 'cod' or 'prebooking'
  payment_status VARCHAR(50) DEFAULT 'pending',
  contact_number VARCHAR(20), -- For pre-booking payments
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

/**
 * Seed data for development/testing
 */
export const SEED_DATA = `
-- Insert sample products
INSERT INTO products (name, description, price, category, stock) VALUES
  ('Classic Black Hoodie', 'Premium quality black hoodie with ZeroLimit branding', 59.99, 'Hoodies', 100),
  ('Classic White Hoodie', 'Premium quality white hoodie with ZeroLimit branding', 59.99, 'Hoodies', 100),
  ('Oversized Black Hoodie', 'Trendy oversized fit black hoodie', 69.99, 'Hoodies', 75),
  ('Oversized White Hoodie', 'Trendy oversized fit white hoodie', 69.99, 'Hoodies', 75),
  ('Minimalist Black Zip Hoodie', 'Sleek zip-up hoodie in black', 64.99, 'Hoodies', 50),
  ('Minimalist White Zip Hoodie', 'Sleek zip-up hoodie in white', 64.99, 'Hoodies', 50)
ON CONFLICT DO NOTHING;
`;

export default DATABASE_SCHEMA;
