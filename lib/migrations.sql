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

-- Product Reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Promotions/Coupons table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  amount DECIMAL(10, 2) NOT NULL,
  expiry TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);

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

DROP TRIGGER IF EXISTS update_promotions_updated_at ON promotions;
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. CREATE ADMIN USER
-- ============================================

-- Admin user credentials:
-- Email: admin@zerolimit.com
-- Password: shahzaib12
-- Password hash generated with bcrypt (10 rounds)

INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@zerolimit.com',
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
-- 6. SEED SAMPLE USERS FOR REVIEWS
-- ============================================

-- Create sample customer users for reviews (using same password hash as admin for testing)
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Ahmed Khan', 'ahmed.khan@example.com', '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme', 'user'),
  ('Fatima Ali', 'fatima.ali@example.com', '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme', 'user'),
  ('Hassan Raza', 'hassan.raza@example.com', '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme', 'user'),
  ('Ayesha Malik', 'ayesha.malik@example.com', '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme', 'user'),
  ('Usman Tariq', 'usman.tariq@example.com', '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme', 'user'),
  ('Zainab Ahmed', 'zainab.ahmed@example.com', '$2b$10$bCDV3ttmcmRf1SEDLuMu6e29AOAaZ5I7BL0uAk8xyLhPBEHx8wUme', 'user')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- 7. SEED PRODUCT REVIEWS (1-2 reviews per product with Pakistani names)
-- ============================================

-- Reviews for Classic Black Hoodie
INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  5,
  'Absolutely love this hoodie! The quality is amazing and the fit is perfect. Highly recommend for anyone looking for a premium black hoodie.'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Classic Black Hoodie' AND u.email = 'ahmed.khan@example.com'
LIMIT 1;

INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  4,
  'Great hoodie with excellent material. Very comfortable and worth the price. Only minor issue is it took a bit longer to deliver but overall satisfied!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Classic Black Hoodie' AND u.email = 'fatima.ali@example.com'
LIMIT 1;

-- Reviews for Classic White Hoodie
INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  5,
  'Clean and minimal design just as described. The white color is perfect and the fabric quality is top-notch. Will definitely buy more!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Classic White Hoodie' AND u.email = 'hassan.raza@example.com'
LIMIT 1;

INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  5,
  'Best hoodie I have purchased! Very soft and comfortable. Perfect for winters in Lahore. Thank you ZeroLimit!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Classic White Hoodie' AND u.email = 'ayesha.malik@example.com'
LIMIT 1;

-- Reviews for Custom Print Hoodie
INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  5,
  'Got a custom design printed and it turned out amazing! The printing quality is excellent and didn''t fade after washing. Highly satisfied!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Custom Print Hoodie' AND u.email = 'usman.tariq@example.com'
LIMIT 1;

-- Reviews for Gen-Z Black Hoodie
INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  5,
  'Perfect oversized fit! Exactly what I was looking for. The quality is exceptional and it looks very trendy. Love it!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Gen-Z Black Hoodie' AND u.email = 'zainab.ahmed@example.com'
LIMIT 1;

INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  4,
  'Really good hoodie for the Gen-Z style. Comfortable and stylish. Slightly pricey but worth it for the quality you get.'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Gen-Z Black Hoodie' AND u.email = 'ahmed.khan@example.com'
LIMIT 1;

-- Reviews for Gen-Z White Hoodie
INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  5,
  'Absolutely stunning! The oversized fit is so comfortable and the white color goes with everything. Best purchase this month!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Gen-Z White Hoodie' AND u.email = 'fatima.ali@example.com'
LIMIT 1;

-- Reviews for Minimalist Zip Hoodie
INSERT INTO product_reviews (product_id, user_id, rating, comment)
SELECT 
  p.id,
  u.id,
  4,
  'Very practical and versatile. The zip design is convenient and the quality is solid. Good value for money!'
FROM products p
CROSS JOIN users u
WHERE p.name = 'Minimalist Zip Hoodie' AND u.email = 'hassan.raza@example.com'
LIMIT 1;

-- ============================================
-- 8. VERIFICATION QUERIES
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
WHERE email = 'admin@zerolimit.com';

-- Count products
SELECT category, COUNT(*) as count 
FROM products 
GROUP BY category;

-- Count reviews
SELECT COUNT(*) as total_reviews
FROM product_reviews;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Admin credentials: admin@zerolimit.com / shahzaib12
-- 3. After running, verify all tables with the verification queries
-- 4. Sample products and reviews are included for immediate testing
-- 5. All new tables (wishlist, product_reviews, promotions) are created automatically
