# ZeroLimitApparel - Full-Featured eCommerce Store

A production-ready Next.js 14+ eCommerce platform for selling premium hoodies with a minimalist black/white theme.

## 🚀 Features

### Customer Features
- **Homepage**: Hero section, featured collections, brand story
- **Product Catalog**: Grid layout with filtering by category
- **Product Details**: Image gallery, size/color variants, stock info
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Secure Stripe payment integration
- **User Authentication**: Register/login with NextAuth.js
- **Order History**: View past orders and status

### Admin Features
- **Dashboard**: Sales overview, order statistics
- **Product Management**: CRUD operations for products
- **Order Management**: Update order status, view details
- **Customer Management**: View all customers and their info

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase/Neon PostgreSQL
- **Authentication**: NextAuth.js with credentials provider
- **Payments**: Stripe with webhook support
- **State Management**: Zustand for cart
- **Image Storage**: Supabase Storage
- **Deployment**: Vercel & Digital Ocean ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase or Neon account (PostgreSQL database)
- Stripe account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zero-limit
npm install
```

### 2. Database Setup

#### Option A: Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `lib/db-schema.ts`
3. Create a storage bucket named `products` for product images
4. Get your project URL and keys from Settings > API

#### Option B: Neon

1. Create a new project at [neon.tech](https://neon.tech)
2. Connect to your database and run the schema from `lib/db-schema.ts`
3. Get your connection string from the dashboard

### 3. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database (Supabase)
DATABASE_URL=your_postgresql_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

#### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 4. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Developers > API keys
3. Set up webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Create Admin User

Run this SQL in your database to create an admin user:

```sql
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@zerolimitapparel.com',
  '$2a$10$...',  -- Use bcrypt to hash 'password123' or your chosen password
  'admin'
);
```

Or register normally and update the role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
zerolimitapparel/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── checkout/     # Stripe checkout
│   │   ├── products/     # Products API
│   │   ├── register/     # User registration
│   │   └── webhooks/     # Stripe webhooks
│   ├── admin/            # Admin panel pages
│   ├── auth/             # Authentication pages
│   ├── products/         # Product pages
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   └── account/          # User account
├── components/            # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── stripe.ts         # Stripe integration
│   ├── supabase.ts       # Supabase client
│   ├── cart-store.ts     # Cart state management
│   └── db-schema.ts      # Database schema
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.js` to customize colors.

### Product Categories

Add/modify categories in the admin panel or directly in the database.

### Shipping Costs

Edit shipping logic in `app/cart/page.tsx` and `app/checkout/page.tsx`.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

```bash
npm install -g vercel
vercel
```

### Deploy to Digital Ocean

1. Create a Droplet (Ubuntu 22.04)
2. Install Node.js and npm
3. Clone repository
4. Install dependencies: `npm install`
5. Build: `npm run build`
6. Install PM2: `npm install -g pm2`
7. Start: `pm2 start npm --name "zerolimit" -- start`
8. Set up Nginx as reverse proxy
9. Configure SSL with Let's Encrypt

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🧪 Testing

Run tests:

```bash
npm test
```

## 📝 Database Schema

See `lib/db-schema.ts` for complete schema. Main tables:

- **users**: User accounts and authentication
- **products**: Product catalog
- **product_images**: Product photos
- **product_variants**: Size/color variants
- **orders**: Customer orders
- **order_items**: Order line items

## 🔐 Security

- Passwords hashed with bcrypt
- API routes protected with authentication
- Stripe webhook signature verification
- Admin routes protected by role check
- SQL injection prevention via Supabase client

## 📞 Support

For issues and questions, create an issue in the repository.

## 📄 License

MIT License

---

Built with ❤️ for ZeroLimitApparel

