# ZeroLimitApparel - eCommerce Store (Free Tier Only)

A production-ready Next.js 14+ eCommerce platform for selling premium hoodies, optimized to run on free-tier services only.

## 🚀 Features

### Customer Features
- Homepage with hero section, featured products, and collections (Classic / Custom / Gen-Z)
- Product catalog with category filtering and search
- Product detail pages with variants, image gallery, and reviews
- Shopping cart with persistent storage
- Wishlist for saving products (requires login)
- Product reviews and ratings (with dummy reviews)
- Coupon code support at checkout
- Manual checkout (COD or Pre-booking)
- User authentication (register/login)
- Guest checkout (no forced login)
- User account with order history
- Help & Support page with FAQs
- **WhatsApp Support**: Direct contact buttons and floating button throughout the site

### Admin Features
- Dashboard with sales overview and analytics
- Product management (CRUD operations) with Cloudinary image upload
- Order management with status updates
- Customer management with order history
- Promotions management for creating and managing coupon codes
- Analytics: Total orders, total revenue, pending orders
- Protected admin panel (role-based access)
- Admin login at `/admin/login`

**Admin Access:**
- URL: `/admin` (redirects to `/admin/login`)
- Login URL: `/admin/login`
- Default Credentials:
  - Email: `admin@zerolimitapparel.com`
  - Password: `shahzaib12`
- After login, admin users can access the admin panel via the header navigation

## 🛠️ Tech Stack (100% Free Tier)

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase PostgreSQL (Free Tier - up to 500MB)
- **Authentication**: NextAuth.js
- **Payments**: Manual (COD / Pre-booking)
- **Image Hosting**: Cloudinary (Free Tier - 25GB storage, 25GB bandwidth/month)
- **State**: Zustand for cart
- **Deployment**: Vercel (Free Tier)

## 📋 Quick Start

### 1. Install

```bash
npm install
```

### 2. Set up Supabase (Free)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL from `lib/migrations.sql` in SQL Editor (creates all tables, admin user, and sample products)
4. Get credentials from Settings > API

**What the migration creates:**
- All database tables (users, products, product_images, etc.)
- Admin user: admin@zerolimitapparel.com / shahzaib12
- 6 sample products across 3 categories (Classic, Custom, Gen-Z)

### 3. Set up Cloudinary (Free)

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get Cloud Name, API Key, API Secret from Dashboard
3. Create upload preset (Settings > Upload > Add preset)

### 4. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_WHATSAPP_NUMBER=+92XXXXXXXXXX
```

### 5. Run

```bash
npm run dev
```

Visit http://localhost:3000

### 6. Access Admin Panel

After setting up the database and creating the admin user (see step 2), you can:

1. Navigate to http://localhost:3000/admin or click "Admin" in the header after logging in
2. Login with admin credentials:
   - Email: `admin@zerolimitapparel.com`
   - Password: `shahzaib12`
3. Manage products, orders, and customers from the admin dashboard

**Note:** Run the SQL migration from `lib/migrations.sql` in your Supabase SQL Editor to create the admin user automatically.

## 💳 Payment Methods

### Cash on Delivery (COD)
Customer pays when receiving the order.

### Pre-booking
Store collects customer contact number and reaches out for payment via WhatsApp.

## 📱 WhatsApp Integration

WhatsApp buttons appear on:
- All product pages
- Checkout page
- Floating button (bottom-right on all pages)

Configure with `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`

## 🚢 Deploy to Vercel (Free)

1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

All services used (Supabase, Cloudinary, Vercel) have generous free tiers suitable for small to medium eCommerce stores.

## 📝 Database Schema

- **users**: Authentication and user data
- **products**: Product catalog
- **product_images**: Cloudinary image URLs
- **product_variants**: Size/color options
- **orders**: Orders with `payment_type` (cod/prebooking) and `contact_number`
- **order_items**: Line items

See `lib/db-schema.ts` for complete schema.

## 📚 Documentation

Full documentation available in the `docs/` directory:

- **`README.md`** - This file (overview and quick start)
- **`QUICKSTART.md`** - Fast 10-minute setup guide
- **`docs/SETUP_GUIDE.md`** - Complete setup and navigation guide
- **`docs/MANUAL_ORDER_FLOW.md`** - COD and pre-booking payment workflows
- **`docs/DEPLOYMENT.md`** - Vercel deployment instructions
- **`docs/PROJECT_SUMMARY.md`** - Detailed project architecture

### Quick Links
- Setup Instructions: `docs/SETUP_GUIDE.md`
- Admin Panel Guide: `docs/SETUP_GUIDE.md#-admin-access`
- Payment Flow: `docs/MANUAL_ORDER_FLOW.md`
- Database Schema: `lib/migrations.sql`

## 🔐 Security

- Password hashing with bcrypt
- Session-based authentication
- Admin role protection
- SQL injection prevention
- Environment variables for secrets

## 📄 License

MIT

---

Built with ❤️ using 100% free-tier services
