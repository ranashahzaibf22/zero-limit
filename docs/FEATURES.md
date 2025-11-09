# ZeroLimitApparel Features Guide

Complete guide to all features available in the ZeroLimitApparel eCommerce platform.

---

## 🛍️ Customer Features

### Homepage
- **Hero Section**: Eye-catching banner with call-to-action buttons
- **Featured Products**: Grid display of 6 latest products
- **Collections Showcase**: 3-column grid showcasing Classic, Custom, and Gen-Z collections
- **Why Choose Us**: Feature highlights section
- **Call-to-Action**: Prominent button linking to product catalog

### Product Browsing & Search

#### Product Catalog (`/products`)
- View all products in a responsive grid layout (1/2/3 columns based on screen size)
- Category filtering via URL parameters:
  - `/products?category=Classic`
  - `/products?category=Custom`
  - `/products?category=Gen-Z`
- **Search Functionality**: Search bar in header allows searching by product name, description, or category
- Empty state handling when no products found

#### Product Detail Page (`/products/[id]`)
- High-quality product images with gallery
- Image thumbnails for multiple views
- Product name, description, and pricing
- Size/color variant selection (if available)
- Quantity selector with stock validation
- Stock availability indicator
- Add to Cart button
- WhatsApp "Contact for this product" button
- Product category display
- **Customer Reviews**: 
  - Display average rating with stars
  - List all reviews with customer names and ratings
  - Review submission form (requires login)
  - Star rating input (1-5 stars)
  - Comment text area

### Wishlist (`/wishlist`)
- Save products for later viewing
- **Heart icon on product cards** for quick add/remove
- Accessible from header navigation
- Requires user login
- Shows saved products in grid layout
- Quick add to cart from wishlist
- Remove button on each item
- Shows count of saved items
- Empty state with call-to-action

### Shopping Cart (`/cart`)
- View all cart items with images and details
- Quantity adjustment with +/- buttons
- Remove items from cart
- Running subtotal calculation
- Persistent storage (survives page refresh)
- Empty cart state
- Proceed to checkout button

### Checkout (`/checkout`)

#### Contact & Shipping Information
- Email address
- Full name
- Complete shipping address (street, city, state, postal code, country)
- Optional contact number for pre-booking

#### Payment Options
1. **Cash on Delivery (COD)**
   - Pay when you receive your order
   - No upfront payment required
   - Simple and secure

2. **Pre-booking**
   - Provide contact number
   - Store contacts you via WhatsApp
   - Complete payment via Bank Transfer/JazzCash/EasyPaisa
   - Order ships after payment confirmation

#### Coupon Codes
- Enter coupon code in checkout
- Real-time validation
- Displays discount amount
- Shows final price after discount
- Coupon management via admin panel
- Supports:
  - Percentage discounts (e.g., 10% off)
  - Fixed amount discounts (e.g., $5 off)
  - Expiry dates
  - Usage limits
  - Active/inactive status

#### Order Summary
- Line items with quantities and prices
- Subtotal calculation
- Shipping cost
- Discount amount (if coupon applied)
- Final total
- WhatsApp support button

### User Account (`/account`)
- View order history
- Track order status
- View order details
- Update profile information
- Access from header when logged in

### Authentication

#### Sign Up (`/auth/signup`)
- Create new account
- Email and password required
- Optional name field
- Automatic redirect after signup
- Password validation

#### Sign In (`/auth/signin`)
- Login with email and password
- Remember session across browser sessions
- Redirect to previous page after login
- Error handling for invalid credentials

#### Guest Checkout
- **No forced login required**
- Can browse and add to cart without account
- Can complete checkout as guest
- Optional account creation during checkout

### Help & Support (`/help`)
Comprehensive support page with:

#### FAQs
- **Ordering**: How to place orders, account requirements, modifications
- **Payment**: Accepted payment methods, COD vs Pre-booking, security
- **Shipping**: Delivery times, tracking, costs, coverage
- **Returns & Exchanges**: Return policy, exchange process, shipping costs
- **Product Care**: Washing instructions, size selection guide

#### Support Features
- WhatsApp contact buttons throughout
- Step-by-step guides
- Clear policy explanations
- Feature highlights (Fast Response, Quality Guaranteed, Easy Returns)

### WhatsApp Integration
- **Floating Button**: Always visible in bottom-right corner
- **Product Pages**: Direct inquiry about specific products
- **Checkout**: Support during checkout process
- **Help Page**: Quick contact for questions
- Customizable message pre-fill
- Opens in new tab

---

## 👨‍💼 Admin Features

### Admin Access (`/admin/login`)
- Separate login page for administrators
- Email/password authentication
- Role validation (must have `role = 'admin'`)
- Automatic redirect to dashboard after login
- Session persistence
- Protected routes (non-admins redirected to login)

**Default Credentials:**
- Email: `admin@zerolimit.com`
- Password: `shahzaib12`

### Admin Dashboard (`/admin/dashboard`)
- Sales overview and key metrics
- Total revenue display
- Total orders count
- Average order value
- Pending orders alert
- Top-selling products list
- Recent orders table
- Quick navigation to other admin pages

### Product Management (`/admin/products`)

#### Product List
- View all products in table format
- Product name, category, price, stock
- Quick actions: Edit, Delete
- Low stock alerts (stock < 5 highlighted in red)

#### Create/Edit Product
- Product name
- Description (multiline)
- Price (decimal)
- Category dropdown (Classic, Custom, Gen-Z)
- Stock quantity
- **Cloudinary image upload**
- Image URL display for verification
- Form validation
- Success/error notifications

### Order Management (`/admin/orders`)
- View all orders in table format
- Order ID, customer info, total amount
- Payment type (COD/Pre-booking)
- Order status with color coding:
  - Pending (yellow)
  - Processing (blue)
  - Shipped (purple)
  - Delivered (green)
  - Cancelled (red)
- **Update order status** dropdown
- Contact number for pre-booking orders
- Order date and time
- Order items details

### Customer Management (`/admin/customers`)
- List all registered customers
- Customer name and email
- Registration date
- Number of orders per customer
- Total spent per customer
- Customer details view
- Order history per customer

### Promotions Management (`/admin/promotions`)

#### Coupon List
- All active and inactive coupons
- Coupon code (displayed in mono font)
- Discount type and amount
- Expiry date
- Usage count vs limit
- Active/inactive status badge
- Actions: Edit, Activate/Deactivate, Delete

#### Create/Edit Coupon
- **Coupon Code**: Unique identifier (auto-uppercase)
- **Discount Type**: Percentage or Fixed Amount
- **Amount**: Discount value
- **Expiry Date**: Optional expiration
- **Usage Limit**: Optional maximum uses
- **Active Status**: Enable/disable coupon
- Validation for unique codes
- Real-time preview of discount

#### Coupon Validation
- Automatic validation at checkout
- Checks:
  - Code exists
  - Code is active
  - Not expired
  - Under usage limit
- Usage count increments on successful order
- Error messages for invalid codes

### Navigation & Layout
- **Top Header**: 
  - "Admin Panel - ZeroLimitApparel" branding
  - "Back to Store" link
  - Logout button (top-right)
- **Tab Navigation**: Dashboard, Products, Orders, Customers, Promotions
- **Active Tab Indicator**: Bold with bottom border
- Responsive layout
- Consistent styling

---

## 📱 Mobile Experience

### Responsive Design
- Mobile-first approach
- Adaptive grid layouts:
  - 1 column on mobile
  - 2 columns on tablet
  - 3 columns on desktop
- Touch-friendly buttons and links
- Collapsible navigation on mobile
- Optimized images for mobile bandwidth
- Fast load times

### Mobile Navigation
- Hamburger menu on header
- Full-screen mobile menu
- Easy access to all pages
- Search bar accessible on mobile
- Cart icon with item count badge

---

## 🔒 Security Features

### Authentication
- **Password Hashing**: bcrypt with 10 rounds
- **Session Management**: JWT-based with NextAuth
- **Session Duration**: 30 days
- **CSRF Protection**: Built-in with NextAuth
- **XSS Prevention**: React automatic escaping

### Authorization
- **Role-Based Access**: User vs Admin roles
- **Route Protection**: Admin routes check role
- **API Protection**: Server-side role verification
- **Session Validation**: On every protected request

### Data Protection
- **Environment Variables**: Sensitive data in .env
- **SQL Injection Prevention**: Supabase prepared statements
- **Input Validation**: Client and server-side
- **Error Handling**: No sensitive data in errors

---

## 🎨 Design & UX

### Color Scheme
- **Primary**: Black (#000000)
- **Secondary**: White (#FFFFFF)
- **Accents**: Gray shades for depth
- **Success**: Green (#22C55E) for WhatsApp
- **Warning**: Yellow for alerts
- **Error**: Red for errors and deletion

### Typography
- **Headings**: Bold, large sizes for hierarchy
- **Body**: Clean sans-serif, readable
- **Buttons**: Medium weight, clear labels
- **Links**: Hover underlines
- **Code/Coupons**: Monospace font

### Interactions
- **Hover Effects**: Border color changes on cards
- **Loading States**: Spinners for async operations
- **Transitions**: Smooth 200ms transitions
- **Toasts**: Success/error notifications (bottom-right)
- **Modals**: Confirmation for destructive actions
- **Form Feedback**: Real-time validation

---

## 🔌 Integrations

### Supabase (PostgreSQL)
- User authentication
- Product catalog
- Order management
- Wishlist storage
- Reviews storage
- Coupon management
- Relational data with foreign keys
- Full-text search support

### Cloudinary
- Image hosting and delivery
- Product image uploads via admin
- CDN for fast global delivery
- Image transformations
- 25GB free storage
- 25GB free bandwidth/month

### WhatsApp Business
- Direct customer communication
- Product inquiries
- Order support
- Pre-booking payment coordination
- No API integration required (uses wa.me links)
- Customizable messages

### NextAuth
- Session management
- Credentials provider
- JWT tokens
- Protected routes
- Role-based access

---

## 📊 Analytics & Reporting

### Sales Metrics (Admin Dashboard)
- Total revenue (all time)
- Total number of orders
- Average order value
- Revenue trends
- Top selling products

### Inventory Tracking
- Current stock levels
- Low stock alerts (< 5 units)
- Out of stock indicators
- Stock updates on order

### Customer Insights
- Total registered customers
- Customer order history
- Lifetime value per customer
- Recent customer activity

---

## 🚀 Performance

### Optimization Techniques
- **Server-Side Rendering**: Fast initial page load
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic by Next.js
- **Lazy Loading**: Images load as needed
- **Caching**: Static pages cached
- **Database Indexing**: Fast queries

### Load Times
- Homepage: < 2s
- Product pages: < 2s
- Search results: < 1s
- Checkout: < 2s

---

## 🌐 Deployment

### Vercel (Free Tier)
- Automatic deployments from Git
- Global CDN
- 100GB bandwidth/month
- Unlimited sites
- HTTPS included
- Custom domains support

### Environment Setup
All required environment variables in `.env.example`:
- Supabase credentials
- Cloudinary credentials
- NextAuth secret
- WhatsApp number
- App URL

---

## 📝 Database Schema

### Core Tables
1. **users**: User accounts and roles
2. **products**: Product catalog
3. **product_images**: Cloudinary image URLs
4. **product_variants**: Size/color options
5. **product_reviews**: Customer reviews
6. **orders**: Order records
7. **order_items**: Line items
8. **wishlist**: Saved products
9. **promotions**: Coupon codes

### Sample Data Included
- 6 sample products across 3 categories
- 12+ product reviews with Pakistani names
- Sample customer accounts
- Admin user account

---

## 🎯 Business Model

### Payment Collection
- **COD**: Payment on delivery (zero fraud risk)
- **Pre-booking**: WhatsApp coordination for bank transfers
- No payment gateway fees
- Complete control over transactions

### Scalability
- Free tier supports:
  - ~500 orders/month
  - ~5,000 products
  - ~50,000 page views/month
- Upgrade path available when needed

### Customer Trust
- Direct WhatsApp communication
- Manual order verification
- No forced account creation
- Clear return policy
- Product reviews visible

---

**Last Updated**: November 2024  
**Version**: 1.0.0
