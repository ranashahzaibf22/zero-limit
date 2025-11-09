# Quick Start Guide - ZeroLimitApparel (Free Services Only)

## ⚡ Get Started in 10 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase (Free Tier)

**Create Account** at [supabase.com](https://supabase.com)

1. Create new project
2. Go to SQL Editor
3. Copy entire content from `lib/db-schema.ts`
4. Paste and run in SQL Editor
5. Go to Settings > API and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### 3. Set Up Cloudinary (Free Tier)

**Create Account** at [cloudinary.com](https://cloudinary.com)

1. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
2. (Optional) Create upload preset:
   - Settings > Upload
   - Add upload preset
   - Set folder to `zerolimit/products`

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Supabase (from step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Generate secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (from step 3)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp Business number
NEXT_PUBLIC_WHATSAPP_NUMBER=+92XXXXXXXXXX

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Create Admin User

In Supabase SQL Editor:

```sql
-- Create admin user (password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin User',
  'admin@zerolimit.com',
  '$2a$10$rXK0h3cHXlH8nWRXlKv7XeLhWx7Ej0CiGhPSk/KKH7KnqWJkz7Wj6',
  'admin'
);
```

> **Note**: This hash is for "admin123". For production, generate your own hash using bcrypt.

Or create via signup and update role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Quick Access

- **Homepage**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Admin**: http://localhost:3000/admin (login with admin credentials)
- **Sign Up**: http://localhost:3000/auth/signup

## 📝 Add Sample Products

In Supabase SQL Editor:

```sql
-- Add sample products
INSERT INTO products (name, description, price, category, stock) VALUES
  ('Classic Black Hoodie', 'Premium black hoodie with ZeroLimit branding', 59.99, 'Hoodies', 100),
  ('Classic White Hoodie', 'Premium white hoodie with ZeroLimit branding', 59.99, 'Hoodies', 100),
  ('Oversized Black Hoodie', 'Trendy oversized fit black hoodie', 69.99, 'Hoodies', 75);

-- Add sample images (replace with your Cloudinary URLs)
INSERT INTO product_images (product_id, image_url, is_primary) 
SELECT id, 'https://res.cloudinary.com/demo/image/upload/sample.jpg', true
FROM products LIMIT 1;
```

## 🛍️ Test Checkout

1. Browse products at http://localhost:3000/products
2. Add items to cart
3. Go to checkout
4. Choose payment method:
   - **COD**: Cash on Delivery
   - **Pre-booking**: Provide phone number for payment confirmation
5. Place order

## 📱 WhatsApp Integration

The WhatsApp button will appear:
- On every product page
- On checkout page
- As floating button (bottom-right corner)

Make sure `NEXT_PUBLIC_WHATSAPP_NUMBER` is set in `.env.local`

## 🚀 Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use Vercel Dashboard:
1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy!

## 🔧 Troubleshooting

**Database connection error?**
- Verify Supabase URL and keys
- Check schema was applied successfully

**Images not uploading?**
- Verify Cloudinary credentials
- Check upload preset is created

**WhatsApp button not working?**
- Ensure phone number includes country code
- Format: +92XXXXXXXXXX (no spaces)

**Can't login as admin?**
- Check password hash is correct
- Verify role is 'admin' in database

## 💡 Next Steps

1. Replace placeholder images with actual product photos
2. Upload images to Cloudinary
3. Update product database with Cloudinary URLs
4. Customize brand colors in Tailwind config
5. Add your products in admin panel
6. Test complete order flow
7. Deploy to Vercel

## 📚 More Information

- Full docs: `README.md`
- Deployment: `docs/DEPLOYMENT.md`
- Project summary: `docs/PROJECT_SUMMARY.md`

## 💰 Cost Breakdown

All services are **100% FREE** for small stores:

- **Supabase**: 500MB database, 1GB file storage, 2GB bandwidth/month
- **Cloudinary**: 25GB storage, 25GB bandwidth/month, 25k transformations/month
- **Vercel**: 100GB bandwidth/month, unlimited sites
- **Next.js**: Open source, free to use

Perfect for starting your eCommerce business with zero infrastructure costs!

---

🎉 **You're ready!** Start selling with zero monthly costs.
