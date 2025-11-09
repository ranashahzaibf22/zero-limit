# Supabase Database Setup Guide for ZeroLimitApparel

This guide will help you set up the complete Supabase database for the ZeroLimitApparel eCommerce platform.

## 📋 Prerequisites

- A Supabase account (free tier works fine)
- Access to Supabase SQL Editor
- Basic understanding of SQL

---

## 🚀 Quick Setup Steps

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: ZeroLimitApparel (or your preferred name)
   - **Database Password**: Choose a strong password and save it
   - **Region**: Select closest to your users
4. Click "Create new project" and wait for it to initialize (~2 minutes)

### Step 2: Run Database Migrations

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the **ENTIRE** content from `lib/migrations.sql` in this repository
4. Paste it into the SQL Editor
5. Click "Run" or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned" (this is normal)

### Step 3: Verify Database Setup

After running migrations, verify the following tables were created:

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - ✅ `users`
   - ✅ `products`
   - ✅ `product_images`
   - ✅ `product_variants`
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `product_reviews`
   - ✅ `wishlist`
   - ✅ `promotions`

### Step 4: Get API Credentials

1. Go to **Settings** (gear icon in sidebar) → **API**
2. Copy the following values (you'll need these for your `.env.local`):
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Configure Environment Variables

Create a `.env.local` file in the root of your project with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=generate-using-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (Optional - for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# WhatsApp (Optional)
NEXT_PUBLIC_WHATSAPP_NUMBER=+923001234567

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

---

## 📊 What the Migration Creates

### 1. Database Tables

#### Users Table
- Stores customer and admin accounts
- **Admin Account Created**:
  - Email: `admin@zerolimitapparel.com`
  - Password: `shahzaib12`
  - Role: `admin`

#### Products Table
- 6 sample products created automatically:
  - Classic Black Hoodie ($59.99)
  - Classic White Hoodie ($59.99)
  - Custom Print Hoodie ($69.99)
  - Gen-Z Black Hoodie ($64.99)
  - Gen-Z White Hoodie ($64.99)
  - Minimalist Zip Hoodie ($67.99)

#### Product Images Table
- Links product images to products
- Supports multiple images per product
- Can mark one as primary

#### Product Variants Table
- For size/color combinations
- Individual SKUs and pricing
- Stock management per variant

#### Orders Table
- Customer orders
- Supports COD and Pre-booking payment types
- Order status tracking

#### Order Items Table
- Individual items in each order
- Links to products and variants

#### Product Reviews Table
- Customer reviews and ratings (1-5 stars)
- Sample reviews created for testing

#### Wishlist Table
- Save products for later
- User-specific favorites

#### Promotions Table
- Coupon/discount codes
- Percentage or fixed amount discounts
- Usage limits and expiry dates

### 2. Performance Indexes
- Created on commonly queried columns
- Improves database query speed

### 3. Triggers
- Auto-update `updated_at` timestamps
- Maintains data integrity

### 4. Sample Data
- 6 sample users for reviews
- 12+ product reviews
- Admin account
- Sample products with descriptions

---

## 🔍 Verifying Your Setup

### Check Admin User

Run this query in SQL Editor to verify admin account:

```sql
SELECT id, name, email, role 
FROM users 
WHERE email = 'admin@zerolimitapparel.com';
```

Expected result:
- Name: Admin User
- Email: admin@zerolimitapparel.com
- Role: admin

### Check Sample Products

```sql
SELECT id, name, price, category, stock 
FROM products 
ORDER BY created_at;
```

You should see 6 products listed.

### Check Product Reviews

```sql
SELECT COUNT(*) as total_reviews 
FROM product_reviews;
```

You should have multiple reviews (12+).

---

## 🛡️ Security Setup (Row Level Security)

For production, you should enable Row Level Security (RLS):

### Enable RLS on All Tables

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
```

### Create Policies

#### Products (Public Read, Admin Write)

```sql
-- Anyone can read products
CREATE POLICY "Public products are viewable by everyone"
ON products FOR SELECT
USING (true);

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can manage products"
ON products FOR ALL
USING (auth.jwt() ->> 'role' = 'admin');
```

#### Wishlist (User-specific)

```sql
-- Users can only see their own wishlist
CREATE POLICY "Users can view own wishlist"
ON wishlist FOR SELECT
USING (auth.uid() = user_id);

-- Users can add to their own wishlist
CREATE POLICY "Users can add to own wishlist"
ON wishlist FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove from their own wishlist
CREATE POLICY "Users can remove from own wishlist"
ON wishlist FOR DELETE
USING (auth.uid() = user_id);
```

#### Orders (User-specific, Admin can view all)

```sql
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'admin');

-- Users can create their own orders
CREATE POLICY "Users can create own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only admins can update orders
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
USING (auth.jwt() ->> 'role' = 'admin');
```

**Note:** For now, you can skip RLS setup during development. The app will work without it, but enable it before going to production.

---

## 🔧 Troubleshooting

### Issue: "supabaseUrl is required" Error

**Solution:** Make sure you've set the environment variables in `.env.local` and restarted your dev server.

### Issue: No Products Showing

**Solution:** Check if products were inserted:
```sql
SELECT COUNT(*) FROM products;
```
If 0, re-run the migrations or insert products manually.

### Issue: Admin Login Not Working

**Solution:** 
1. Verify admin account exists:
   ```sql
   SELECT * FROM users WHERE role = 'admin';
   ```
2. For the new token-based admin access, use token: `1234shah56`

### Issue: Images Not Loading

**Solution:** 
1. Product images need to be added manually via admin panel or Cloudinary
2. Update image URLs in the database:
   ```sql
   UPDATE products 
   SET image_url = 'https://your-cloudinary-url.jpg'
   WHERE id = 'product-id';
   ```

---

## 📝 Adding More Sample Data

### Add Product Images

```sql
-- Example: Add images for Classic Black Hoodie
INSERT INTO product_images (product_id, image_url, is_primary, alt_text)
SELECT 
  id,
  'https://res.cloudinary.com/your-cloud/image/upload/v1/black-hoodie-1.jpg',
  true,
  'Classic Black Hoodie Front View'
FROM products 
WHERE name = 'Classic Black Hoodie'
LIMIT 1;
```

### Add Product Variants

```sql
-- Example: Add size variants for Classic Black Hoodie
INSERT INTO product_variants (product_id, variant_name, size, price, stock)
SELECT 
  id,
  'Small',
  'S',
  59.99,
  30
FROM products 
WHERE name = 'Classic Black Hoodie'
LIMIT 1;

-- Repeat for M, L, XL sizes
```

### Add Promotion Codes

```sql
-- Example: 10% off coupon
INSERT INTO promotions (code, discount_type, amount, usage_limit, active)
VALUES ('WELCOME10', 'percent', 10, 100, true);

-- Example: $5 off coupon
INSERT INTO promotions (code, discount_type, amount, usage_limit, active)
VALUES ('SAVE5', 'fixed', 5, 50, true);
```

---

## 🎯 Next Steps After Setup

1. ✅ Verify all tables exist in Table Editor
2. ✅ Test admin login with token: `1234shah56`
3. ✅ Add product images via admin panel or Cloudinary
4. ✅ Test creating an order on the frontend
5. ✅ Configure Cloudinary for image uploads
6. ✅ Test all API endpoints
7. ✅ Enable RLS policies for production

---

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in Dashboard → Logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Make sure you've restarted the dev server after adding env vars

---

## 🔐 Important Security Notes

- **Never commit** `.env.local` to git
- **Rotate** your service_role key regularly
- **Enable RLS** before production deployment
- **Use HTTPS** in production
- **Validate** all user inputs on the backend

---

**Last Updated:** 2024-11-09
**Version:** 2.0.0
