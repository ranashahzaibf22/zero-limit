# ZeroLimitApparel - eCommerce Store (Free Tier Only)

A production-ready Next.js 14+ eCommerce platform for selling premium hoodies, optimized to run on free-tier services only.

## 🚀 Features

### Customer Features
- Homepage with hero section and featured collections
- Product catalog with category filtering
- Product detail pages with variants and image gallery
- Shopping cart with persistent storage
- Manual checkout (COD or Pre-booking)
- User authentication (register/login)
- User account with order history
- **WhatsApp Support**: Direct contact buttons throughout the site

### Admin Features
- Dashboard with sales overview
- Product management (CRUD operations)
- Order management with status updates
- Customer management

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
3. Run SQL from `lib/db-schema.ts` in SQL Editor
4. Get credentials from Settings > API

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

- `README.md` - This file
- `QUICKSTART.md` - Quick setup guide
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/PROJECT_SUMMARY.md` - Project overview

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
