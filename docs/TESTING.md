# ZeroLimitApparel - Testing Checklist

This document provides a comprehensive testing checklist to verify all features work correctly after setup.

## 📋 Pre-Testing Setup

Before testing, ensure you have:
- ✅ Installed all dependencies (`npm install`)
- ✅ Created and configured `.env.local` with all required variables
- ✅ Run the SQL migrations in Supabase (`lib/migrations.sql`)
- ✅ Verified Cloudinary account is set up
- ✅ Started the development server (`npm run dev`)

---

## 🏠 Frontend Testing

### Homepage
- [ ] Homepage loads without errors
- [ ] Hero section displays correctly with gradient and animations
- [ ] Featured products grid displays (up to 6 products)
- [ ] Product cards show images, names, prices, and categories
- [ ] "Shop Now" and "Learn More" buttons work
- [ ] Featured Collections section displays all 3 categories
- [ ] Collection cards (Classic, Custom, Gen-Z) link to filtered products
- [ ] "Why Choose Us" section displays with all 3 feature cards
- [ ] Footer displays with all links
- [ ] Floating WhatsApp button appears
- [ ] Page is responsive on mobile, tablet, and desktop

### Navigation & Header
- [ ] Logo links to homepage
- [ ] All navigation links work (Shop, Classic, Custom, Gen-Z, About)
- [ ] Search icon opens search bar
- [ ] Search functionality works (try searching for a product)
- [ ] Cart icon shows item count when items are added
- [ ] Wishlist link appears when logged in
- [ ] Sign In/Sign Up buttons appear when logged out
- [ ] Account and Sign Out buttons appear when logged in
- [ ] Admin link appears for admin users
- [ ] Mobile navigation menu works

### Products Listing Page
- [ ] `/products` shows all products
- [ ] Products display in grid layout (responsive)
- [ ] Category filter works (Classic, Custom, Gen-Z)
- [ ] Search results page works
- [ ] Product cards show correct information
- [ ] Wishlist heart icon works (when logged in)
- [ ] "Add to Cart" button adds products
- [ ] "Out of Stock" badge shows for unavailable items
- [ ] Loading spinner shows while fetching
- [ ] Empty state shows when no products found

### Product Detail Page
- [ ] Product detail page loads for each product
- [ ] Breadcrumb navigation works
- [ ] Product images display in gallery
- [ ] Image thumbnails work (if multiple images)
- [ ] Product name, category, price display correctly
- [ ] Product description shows
- [ ] Reviews and ratings display (if available)
- [ ] Variant selection works (size/color)
- [ ] Quantity selector works (increase/decrease)
- [ ] Stock status displays correctly
- [ ] "Add to Cart" button works
- [ ] "Save for Later" button works (wishlist)
- [ ] "Buy Now on WhatsApp" button works
- [ ] Review form appears for logged-in users
- [ ] Review submission works
- [ ] Page is responsive on all devices

### Shopping Cart
- [ ] Cart page shows added items
- [ ] Item quantities can be updated
- [ ] Items can be removed
- [ ] Subtotal calculates correctly
- [ ] "Proceed to Checkout" button works
- [ ] Empty cart state shows when cart is empty
- [ ] Cart persists across page refreshes

### Checkout
- [ ] Checkout form displays all fields
- [ ] Form validation works
- [ ] Coupon code field works
- [ ] Discount applies when valid coupon entered
- [ ] Payment method selection works (COD/Pre-booking)
- [ ] Contact number field works for pre-booking
- [ ] Order summary shows correct totals
- [ ] "Place Order" button submits order
- [ ] Success message shows after order placement
- [ ] Order confirmation page/redirect works
- [ ] Guest checkout works (no forced login)

### Wishlist
- [ ] Wishlist page shows saved products
- [ ] Products can be removed from wishlist
- [ ] "Add to Cart" works from wishlist
- [ ] Empty state shows when wishlist is empty
- [ ] Wishlist requires login

### User Authentication
- [ ] Sign Up form works
- [ ] Password validation works (min 6 characters)
- [ ] Password confirmation validation works
- [ ] User can register successfully
- [ ] Success message shows after registration
- [ ] Redirect to sign in page works
- [ ] Sign In form works
- [ ] User can sign in successfully
- [ ] Invalid credentials show error
- [ ] Redirect after login works
- [ ] Sign Out button works
- [ ] Session persists across page refreshes

### User Account
- [ ] Account page loads for logged-in users
- [ ] User information displays
- [ ] Order history displays
- [ ] Order details show correctly
- [ ] Order status displays

### Help & Support
- [ ] Help page loads
- [ ] FAQ sections display
- [ ] WhatsApp contact buttons work
- [ ] All FAQ sections are readable

### About Page
- [ ] About page loads
- [ ] Content displays correctly
- [ ] Page is responsive

---

## 🔐 Admin Panel Testing

### Admin Login
- [ ] `/admin` redirects to `/admin/login`
- [ ] Admin login page displays correctly
- [ ] Admin can login with credentials:
  - Email: `admin@zerolimitapparel.com`
  - Password: `shahzaib12`
- [ ] Non-admin users cannot access admin panel
- [ ] Invalid credentials show error
- [ ] Successful login redirects to dashboard

### Admin Dashboard
- [ ] Dashboard displays after login
- [ ] Sales overview shows correct data
- [ ] Order statistics display
- [ ] Recent orders list shows
- [ ] Analytics cards show totals
- [ ] Navigation links work

### Product Management
- [ ] `/admin/products` page loads
- [ ] All products list displays
- [ ] "Add Product" button works
- [ ] Add product form displays all fields
- [ ] Product can be created successfully
- [ ] Product images can be uploaded (via Cloudinary URL)
- [ ] Variants can be added
- [ ] Product edit works
- [ ] Product delete works
- [ ] Changes reflect on storefront

### Order Management
- [ ] `/admin/orders` page loads
- [ ] All orders display
- [ ] Order details can be viewed
- [ ] Order status can be updated
- [ ] Status changes persist
- [ ] Order search/filter works (if available)

### Customer Management
- [ ] `/admin/customers` page loads
- [ ] Customer list displays
- [ ] Customer details show correctly
- [ ] Customer order history shows

### Promotions Management
- [ ] `/admin/promotions` page loads
- [ ] Promotion list displays
- [ ] "Add Promotion" works
- [ ] Coupon codes can be created
- [ ] Discount type works (percent/fixed)
- [ ] Expiry date can be set
- [ ] Usage limit can be set
- [ ] Promotions can be edited
- [ ] Promotions can be deleted
- [ ] Active/inactive status works

### Admin Logout
- [ ] Logout button appears in admin header
- [ ] Logout redirects to homepage
- [ ] Cannot access admin pages after logout

---

## 🔌 Backend Endpoint Testing

### Authentication Endpoints
- [ ] `POST /api/register` - User registration works
- [ ] `POST /api/auth/signin` - User login works
- [ ] Session management works correctly

### Product Endpoints
- [ ] `GET /api/products` - Returns all products
- [ ] `GET /api/products?category=Classic` - Filter by category works
- [ ] `GET /api/products?search=hoodie` - Search works
- [ ] `GET /api/products?limit=6` - Limit works
- [ ] Product CRUD operations work (admin only)

### Order Endpoints
- [ ] `POST /api/checkout` - Create order works
- [ ] Order list endpoint works
- [ ] Order update endpoint works (admin)
- [ ] Orders include correct payment_type and contact_number

### Wishlist Endpoints
- [ ] `GET /api/wishlist` - Returns user's wishlist
- [ ] `POST /api/wishlist` - Add to wishlist works
- [ ] `DELETE /api/wishlist` - Remove from wishlist works
- [ ] Requires authentication

### Review Endpoints
- [ ] `GET /api/reviews?product_id=X` - Returns product reviews
- [ ] `POST /api/reviews` - Submit review works
- [ ] Average rating calculates correctly
- [ ] Requires authentication for submission

### Coupon Endpoints
- [ ] `POST /api/promotions/validate` - Validate coupon works
- [ ] Returns correct discount amount
- [ ] Checks expiry date
- [ ] Checks usage limits

---

## 🧪 End-to-End User Flows

### Guest Checkout Flow
1. [ ] Visit homepage
2. [ ] Browse products
3. [ ] Click on a product
4. [ ] Add product to cart
5. [ ] View cart
6. [ ] Proceed to checkout (as guest)
7. [ ] Fill in checkout form
8. [ ] Select payment method
9. [ ] Place order
10. [ ] Verify order confirmation

### Registered User Flow
1. [ ] Visit homepage
2. [ ] Sign up for account
3. [ ] Verify email (if applicable)
4. [ ] Sign in
5. [ ] Browse products
6. [ ] Add products to cart
7. [ ] Add products to wishlist
8. [ ] View wishlist
9. [ ] Checkout with saved info
10. [ ] View order in account history
11. [ ] Leave a product review

### Admin Workflow
1. [ ] Login to admin panel
2. [ ] View dashboard
3. [ ] Add a new product
4. [ ] Upload product image
5. [ ] Add product variants
6. [ ] Verify product appears on storefront
7. [ ] View orders
8. [ ] Update order status
9. [ ] Create a coupon code
10. [ ] Test coupon on storefront
11. [ ] View customer list
12. [ ] Logout

### Coupon Application Flow
1. [ ] Add products to cart
2. [ ] Go to checkout
3. [ ] Enter coupon code
4. [ ] Verify discount applies
5. [ ] Complete checkout
6. [ ] Verify total is correct

---

## 📱 WhatsApp Integration

- [ ] Floating WhatsApp button appears on all pages
- [ ] Product "Buy Now" button opens WhatsApp
- [ ] Pre-filled message includes product name
- [ ] WhatsApp opens in new tab/app
- [ ] Contact number configured in env

---

## 🎨 UI/UX Testing

### Design Consistency
- [ ] Color scheme is consistent (emerald accent + neutral tones)
- [ ] Typography is consistent across pages
- [ ] Buttons follow same design pattern
- [ ] Cards have consistent styling
- [ ] Hover effects work smoothly
- [ ] Transitions are smooth (200ms-500ms)
- [ ] Loading spinners match design
- [ ] Form inputs have consistent styling

### Responsiveness
- [ ] Test on mobile (320px - 480px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Test on large desktop (1920px+)
- [ ] Images scale properly
- [ ] Text is readable at all sizes
- [ ] Buttons are tappable on mobile
- [ ] Navigation adapts to screen size

### Accessibility
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Buttons have descriptive text
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works
- [ ] Focus states are visible

---

## ⚡ Performance Testing

- [ ] Homepage loads in under 3 seconds
- [ ] Product images load efficiently
- [ ] No console errors
- [ ] No console warnings
- [ ] No 404 errors
- [ ] API responses are fast (< 1 second)
- [ ] Smooth scrolling and animations
- [ ] Build completes without errors (`npm run build`)

---

## 🔒 Security Testing

- [ ] Admin panel requires authentication
- [ ] Non-admin users redirected from admin routes
- [ ] Passwords are hashed (not visible in database)
- [ ] Session cookies are secure
- [ ] Environment variables are not exposed
- [ ] SQL injection prevention works
- [ ] XSS prevention works
- [ ] CSRF protection works (NextAuth)

---

## 🚀 Deployment Testing

After deploying to Vercel:

- [ ] Homepage loads on production URL
- [ ] All environment variables configured in Vercel
- [ ] Database connection works
- [ ] Cloudinary images load
- [ ] All routes work in production
- [ ] Admin panel accessible
- [ ] Orders can be placed
- [ ] No build errors in Vercel logs
- [ ] HTTPS works correctly
- [ ] Custom domain works (if configured)

---

## 📊 Final Verification Checklist

Before marking complete:

- [ ] All customer features tested and working
- [ ] All admin features tested and working
- [ ] All API endpoints tested and working
- [ ] End-to-end flows completed successfully
- [ ] No critical bugs found
- [ ] UI/UX is polished and professional
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Documentation is up to date
- [ ] Deployment successful

---

## 🐛 Bug Tracking

Use this section to track any bugs found during testing:

### Critical Bugs
- None found ✅

### Minor Bugs
- None found ✅

### Enhancement Suggestions
- List any improvements or features to add in future

---

## ✅ Sign-Off

- **Tested By**: _________________
- **Date**: _________________
- **Status**: ☐ Passed ☐ Failed ☐ Needs Revision
- **Notes**: _________________

---

**Last Updated**: 2024-11-09
**Version**: 1.0.0
