# Quick Start Guide - ZeroLimitApparel

## ⚡ Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

**Option A: Supabase (Recommended)**
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy and run the schema from `lib/db-schema.ts`
5. Create storage bucket: Go to Storage → Create bucket → Name it "products"
6. Make bucket public (for images)

**Option B: Neon**
1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Connect to SQL console
4. Run schema from `lib/db-schema.ts`

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# From Supabase: Settings > API
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_generated_secret

# From Stripe: Developers > API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Leave as-is for local dev
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Admin User

Run this in Supabase SQL Editor (or your database):
```sql
-- First, generate password hash with bcrypt
-- For password "admin123", the hash would be:
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@zerolimit.com',
  -- Hash for "admin123" - replace with your own hashed password
  '$2a$10$YourHashedPasswordHere',
  'admin'
);
```

Or register normally at `/auth/signup`, then update role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

### 6. Add Sample Products (Optional)

Run in SQL Editor:
```sql
INSERT INTO products (name, description, price, category, stock) VALUES
  ('Classic Black Hoodie', 'Premium black hoodie', 59.99, 'Hoodies', 100),
  ('Classic White Hoodie', 'Premium white hoodie', 59.99, 'Hoodies', 100);
```

## 🎯 Quick Access

- **Homepage**: http://localhost:3000
- **Products**: http://localhost:3000/products
- **Admin Panel**: http://localhost:3000/admin
- **Sign Up**: http://localhost:3000/auth/signup

## 📝 Common Tasks

### Add a Product (via Admin)
1. Go to `/admin` and sign in
2. Click "Products" → "Add Product"
3. Fill in details and save

### Test Checkout
1. Add products to cart
2. Go to `/cart`
3. Click "Proceed to Checkout"
4. Use Stripe test card: `4242 4242 4242 4242`
5. Any future date, any CVC

### Set Up Stripe Webhooks (for Production)
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings > Environment Variables
```

## 🔧 Troubleshooting

**Build fails?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Database connection error?**
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify API keys are from the same project
- Ensure schema is applied

**Stripe not working?**
- Confirm you're using test keys (start with `pk_test_` and `sk_test_`)
- Check webhook secret matches
- Test with card `4242 4242 4242 4242`

**Can't log in as admin?**
- Verify user role is 'admin' in database
- Clear browser cookies and try again

## 📚 More Information

- Full documentation: See `README.md`
- Deployment guide: See `docs/DEPLOYMENT.md`
- Project summary: See `docs/PROJECT_SUMMARY.md`

## 🎉 You're Ready!

Your eCommerce store is now running. Start customizing and add your products!
