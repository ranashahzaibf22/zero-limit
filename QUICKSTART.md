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
3. Copy entire content from `lib/migrations.sql`
4. Paste and run in SQL Editor (this will create all tables AND the admin user)
5. Go to Settings > API and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key

**Admin User Created:**
- Email: `admin@zerolimitapparel.com`
- Password: `shahzaib12`

The migration script automatically creates this admin user with the correct password hash.

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

**Already done!** The migration script in step 2 automatically created an admin user with these credentials:

- Email: `admin@zerolimitapparel.com`
- Password: `shahzaib12`

You can now login with these credentials at http://localhost:3000/auth/signin and access the admin panel at http://localhost:3000/admin.

If you need to create additional admin users or change the password, you can run this SQL in Supabase SQL Editor:

```sql
-- Create another admin user
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Your Name',
  'your@email.com',
  '$2b$10$...',  -- Generate hash using bcryptjs
  'admin'
);

-- Or promote existing user to admin
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
- **Admin Panel**: http://localhost:3000/admin
  - Login: `admin@zerolimitapparel.com` / `shahzaib12`
- **Sign Up**: http://localhost:3000/auth/signup
- **Sign In**: http://localhost:3000/auth/signin

## 📝 Add Sample Products

The migration script in step 2 already added sample products! You should see:
- Classic Black Hoodie
- Classic White Hoodie
- Custom Print Hoodie
- Gen-Z Black Hoodie
- Gen-Z White Hoodie
- Minimalist Zip Hoodie

These products are organized in three categories:
- **Classic**: Timeless designs
- **Custom**: Personalized products
- **Gen-Z**: Trendy oversized fits

You can manage these products or add more via the admin panel at http://localhost:3000/admin/products

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
