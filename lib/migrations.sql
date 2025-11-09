-- ZeroLimitApparel Database Setup and Migrations
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. SCHEMA CREATION
-- ============================================

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

-- ============================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ============================================
-- 3. TRIGGER FUNCTIONS
-- ============================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. CREATE ADMIN USER
-- ============================================

-- Admin user credentials:
-- Email: admin@zerolimitapparel.com
-- Password: shahzaib12
-- Password hash generated with bcrypt (10 rounds)

INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@zerolimitapparel.com',
  '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET 
  password_hash = EXCLUDED.password_hash,
  role = 'admin',
  updated_at = NOW();

-- ============================================
-- 5. SEED SAMPLE PRODUCTS (Optional)
-- ============================================

-- Insert sample products for testing
INSERT INTO products (name, description, price, category, stock) VALUES
  ('Classic Black Hoodie', 'Premium quality black hoodie with ZeroLimit branding. Comfortable and stylish.', 59.99, 'Classic', 100),
  ('Classic White Hoodie', 'Premium quality white hoodie with ZeroLimit branding. Clean and minimal.', 59.99, 'Classic', 100),
  ('Custom Print Hoodie', 'Personalized hoodie with custom designs. Express your style.', 69.99, 'Custom', 75),
  ('Gen-Z Black Hoodie', 'Trendy oversized fit black hoodie. Perfect for the modern generation.', 64.99, 'Gen-Z', 80),
  ('Gen-Z White Hoodie', 'Trendy oversized fit white hoodie. Stand out from the crowd.', 64.99, 'Gen-Z', 80),
  ('Minimalist Zip Hoodie', 'Sleek zip-up hoodie in black. Versatile and practical.', 67.99, 'Classic', 50)
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================

-- Check if all tables exist
SELECT 
  table_name 
FROM 
  information_schema.tables 
WHERE 
  table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY 
  table_name;

-- Verify admin user was created
SELECT id, name, email, role, created_at 
FROM users 
WHERE email = 'admin@zerolimitapparel.com';

-- Count products
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Generate the correct password hash for 'shahzaib12' and update the INSERT statement
-- 3. After running, verify all tables with the verification queries
-- 4. You can skip the sample products if you want to add them manually via admin panel
