# ZeroLimitApparel - Complete Setup & Navigation Guide

## 🎯 Overview

ZeroLimitApparel is a production-ready eCommerce platform built to run on 100% free-tier services. This guide will help you get started quickly.

## 📁 Project Structure

```
zero-limit/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel (protected routes)
│   │   ├── dashboard/     # Sales overview & analytics
│   │   ├── products/      # Product CRUD management
│   │   ├── orders/        # Order management
│   │   └── customers/     # Customer management
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Login page
│   │   └── signup/        # Registration page
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout with COD/Pre-booking
│   ├── products/          # Product catalog & details
│   └── page.tsx           # Homepage
├── components/            # Reusable UI components
├── lib/                   # Utilities & configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── supabase.ts       # Supabase client
│   ├── cart-store.ts     # Zustand cart state
│   ├── migrations.sql    # Database schema & admin user
│   └── db-schema.ts      # TypeScript schema reference
├── docs/                  # Documentation
└── .env.example          # Environment variables template
```

## 🚀 Quick Start (5 Minutes)

### 1. Clone & Install
```bash
git clone <repository-url>
cd zero-limit
npm install
```

### 2. Setup Supabase Database
1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run the entire `lib/migrations.sql` file
5. Copy API credentials from Settings > API

### 3. Setup Cloudinary
1. Create free account at [cloudinary.com](https://cloudinary.com)
2. From Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### 4. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_WHATSAPP_NUMBER=+92XXXXXXXXXX
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## 🔐 Admin Access

### Default Admin Credentials
- **URL**: http://localhost:3000/admin
- **Email**: `admin@zerolimitapparel.com`
- **Password**: `shahzaib12`

> Note: The admin user is automatically created when you run `lib/migrations.sql`

### Admin Features
- **Dashboard** (`/admin/dashboard`): Sales overview, order statistics, recent orders
- **Products** (`/admin/products`): Add, edit, delete products with images
- **Orders** (`/admin/orders`): View all orders, update status
- **Customers** (`/admin/customers`): View all registered users

### Logout
Click the "Logout" button in the top-right corner of the admin panel.

## 🛍️ Customer Flow

### 1. Browse Products
- **Homepage** (`/`): Hero section with featured collections
- **Products** (`/products`): All products with filtering
- **Categories**:
  - Classic: `/products?category=Classic`
  - Custom: `/products?category=Custom`
  - Gen-Z: `/products?category=Gen-Z`

### 2. Product Details
Click any product to view:
- Multiple images (if available)
- Size/color variants
- Stock status
- Add to cart button
- WhatsApp contact button

### 3. Shopping Cart
- Add/remove items
- Update quantities
- View total
- Proceed to checkout

### 4. Checkout
Two payment methods available:
- **Cash on Delivery (COD)**: Pay when you receive the order
- **Pre-booking**: Provide contact number for payment coordination

After placing order:
- Order stored in database
- Customer receives confirmation
- Admin can view in orders panel

## 📱 WhatsApp Integration

WhatsApp buttons appear on:
- Product detail pages
- Checkout page
- Floating button (bottom-right, all pages)

Configure with `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`

Format: `+92XXXXXXXXXX` (include country code, no spaces)

## 🎨 Customization

### Categories
Current categories (editable in admin):
- Classic: Timeless designs
- Custom: Personalized products
- Gen-Z: Trendy oversized fits

To add/change categories:
1. Edit products in admin panel
2. Update category filter in `app/page.tsx` if needed

### Branding
- Update logo in `components/Header.tsx`
- Customize colors in component files (Tailwind classes)
- Update footer links in `components/Footer.tsx`

### Product Images
Upload via admin panel or:
1. Upload to Cloudinary manually
2. Add URL to database via admin panel
3. Mark as primary image if needed

## 🔧 Troubleshooting

### Database Connection Error
- Verify Supabase URL and keys in `.env.local`
- Check that migrations were run successfully
- Refresh schema cache in Supabase dashboard

### Can't Login as Admin
- Verify email: `admin@zerolimitapparel.com`
- Verify password: `shahzaib12`
- Check that migrations created the user (query `users` table in Supabase)

### Images Not Displaying
- Check Cloudinary credentials
- Verify image URLs in database
- Ensure images are uploaded to correct folder

### WhatsApp Button Not Working
- Verify number format: `+92XXXXXXXXXX`
- Check environment variable is set
- Test number is active on WhatsApp

## 📊 Database Schema

### Tables Created by Migration

1. **users**
   - Stores customer accounts and admin users
   - Fields: id, name, email, password_hash, role

2. **products**
   - Product catalog
   - Fields: id, name, description, price, category, stock

3. **product_images**
   - Cloudinary image URLs
   - Fields: id, product_id, image_url, is_primary

4. **product_variants**
   - Size/color options
   - Fields: id, product_id, variant_name, size, color, price, stock

5. **orders**
   - Customer orders
   - Fields: id, user_id, total, status, payment_type, contact_number

6. **order_items**
   - Line items in orders
   - Fields: id, order_id, product_id, variant_id, quantity, price

## 🚢 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repository
4. Add all environment variables from `.env.local`
5. Deploy!

### 3. Update Environment Variables
After deployment, update:
```env
NEXTAUTH_URL=https://yourdomain.vercel.app
NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
```

## 💰 Cost Breakdown

All services are **100% FREE**:
- **Supabase**: 500MB database, 2GB bandwidth/month
- **Cloudinary**: 25GB storage, 25GB bandwidth/month
- **Vercel**: 100GB bandwidth/month
- **NextAuth**: Free, open-source
- **Next.js**: Free, open-source

**Total Monthly Cost**: $0

## 📚 Additional Resources

- **Full README**: See `README.md` for detailed information
- **Quick Start**: See `QUICKSTART.md` for faster setup
- **Deployment**: See `docs/DEPLOYMENT.md` for deployment details
- **Project Summary**: See `docs/PROJECT_SUMMARY.md` for architecture

## ✅ Checklist for Going Live

- [ ] Run database migrations in Supabase
- [ ] Set all environment variables
- [ ] Test admin login
- [ ] Add real products via admin panel
- [ ] Upload product images to Cloudinary
- [ ] Test complete order flow (COD & Pre-booking)
- [ ] Configure WhatsApp number
- [ ] Test WhatsApp integration
- [ ] Update branding (logo, colors)
- [ ] Deploy to Vercel
- [ ] Test production site
- [ ] Set up custom domain (optional)

## 🆘 Support

For issues or questions:
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase/Cloudinary dashboards for usage/errors
4. Verify all environment variables are set correctly

---

Built with ❤️ using 100% free-tier services
