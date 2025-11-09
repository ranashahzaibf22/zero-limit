# Admin Panel Guide - ZeroLimitApparel

Complete guide for administrators to manage the ZeroLimitApparel eCommerce store.

---

## 🔐 Admin Access

### Login Credentials

**Default Admin Account:**
- **Email**: `admin@zerolimit.com`
- **Password**: `shahzaib12`

**Login URL**: `http://localhost:3000/admin/login` (or `/admin/login` on your domain)

### Creating Additional Admin Users

You can create additional admin users directly in your Supabase database:

```sql
-- Create a new admin user
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin Name',
  'newemail@zerolimit.com',
  '$2b$10$...',  -- Generate hash using bcryptjs
  'admin'
);

-- Or promote an existing user to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'existing@email.com';
```

To generate a password hash:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password', 10);
console.log(hash);
```

---

## 📊 Dashboard (`/admin/dashboard`)

The dashboard provides an overview of your store's performance.

### Key Metrics Displayed

1. **Total Revenue**
   - Sum of all completed orders
   - Displayed in currency format
   - Updates in real-time

2. **Total Orders**
   - Count of all orders (all statuses)
   - Click to view orders page

3. **Average Order Value**
   - Total revenue ÷ number of orders
   - Helps track pricing strategy

4. **Pending Orders**
   - Orders awaiting processing
   - Highlighted for attention
   - Quick action required

### Top Products Section
- Shows best-selling products
- Sorted by total quantity sold
- Displays product name and units sold
- Links to product edit page

### Recent Orders Table
- Last 10 orders
- Shows: Order ID, Customer, Amount, Status
- Click order ID for details
- Color-coded status badges

---

## 📦 Product Management (`/admin/products`)

Manage your complete product catalog.

### Product List View

#### Table Columns:
- **Image**: Product thumbnail
- **Name**: Product title
- **Category**: Classic/Custom/Gen-Z
- **Price**: Display price
- **Stock**: Current inventory level
- **Actions**: Edit/Delete buttons

#### Stock Alerts:
- **Red Background**: Stock < 5 (low inventory warning)
- **Normal**: Stock ≥ 5

### Creating a New Product

1. Click **"+ Add Product"** button
2. Fill in the form:

   **Required Fields:**
   - **Name**: Product title (e.g., "Classic Black Hoodie")
   - **Description**: Detailed product description
   - **Price**: Decimal number (e.g., 59.99)
   - **Category**: Select from dropdown
     - Classic
     - Custom
     - Gen-Z
   - **Stock**: Integer quantity (e.g., 100)

3. **Upload Image to Cloudinary:**
   - Log in to your Cloudinary account
   - Navigate to Media Library
   - Click "Upload" and select product image
   - Copy the **secure_url** from the uploaded image
   - Paste URL into admin form (will be added as product image)

4. Click **"Add Product"** to save

### Editing a Product

1. Click **"Edit"** button next to product
2. Modify any fields
3. Click **"Update Product"** to save changes

### Deleting a Product

1. Click **"Delete"** button next to product
2. Confirm deletion in popup
3. Product and all related data are removed

**Warning**: Deletion is permanent and cannot be undone!

### Product Image Management

#### Current Process:
1. Upload images manually to Cloudinary
2. Copy the image URL
3. Add URL to product in database via Supabase
4. Product images will display on storefront

#### Adding Images via Supabase:
```sql
-- Add image to existing product
INSERT INTO product_images (product_id, image_url, is_primary)
VALUES (
  'product-uuid-here',
  'https://res.cloudinary.com/your-cloud/image/path.jpg',
  true  -- Set to true for primary image
);
```

### Product Variants (Size/Color)

Add variants directly in Supabase:

```sql
-- Add a variant to a product
INSERT INTO product_variants (product_id, variant_name, size, color, price, stock, sku)
VALUES (
  'product-uuid-here',
  'Medium-Black',
  'M',
  'Black',
  59.99,
  50,
  'CLK-M-BLK-001'
);
```

---

## 📋 Order Management (`/admin/orders`)

Process and track all customer orders.

### Order List View

#### Table Columns:
- **Order ID**: Unique order identifier
- **Customer**: Customer name or email
- **Total**: Order total amount
- **Payment**: COD or Pre-booking
- **Status**: Current order status
- **Contact**: Phone number (for pre-booking)
- **Date**: Order placement date
- **Actions**: View details, Update status

### Order Statuses

| Status | Color | Meaning |
|--------|-------|---------|
| Pending | Yellow | Order placed, needs processing |
| Processing | Blue | Order confirmed, being prepared |
| Shipped | Purple | Order sent to customer |
| Delivered | Green | Order received by customer |
| Cancelled | Red | Order cancelled |

### Processing Orders

#### For COD Orders:
1. Review order details
2. Update status to "Processing"
3. Prepare shipment
4. Update status to "Shipped" (add tracking if available)
5. After delivery confirmation → "Delivered"

#### For Pre-booking Orders:
1. Contact customer via WhatsApp (number provided)
2. Share payment instructions:
   - Bank Transfer details
   - JazzCash/EasyPaisa number
   - Payment amount
3. Wait for payment confirmation
4. Update status to "Processing" after payment
5. Ship order → "Shipped"
6. After delivery → "Delivered"

### Viewing Order Details

Click on an order ID to see:
- Complete customer information
- Shipping address
- All order items with quantities
- Payment method
- Order timeline
- Order notes

### Updating Order Status

1. Select new status from dropdown
2. Click **"Update Status"**
3. Customer sees updated status in their account

---

## 👥 Customer Management (`/admin/customers`)

View and manage your customer base.

### Customer List View

#### Table Columns:
- **Name**: Customer full name
- **Email**: Contact email
- **Orders**: Total number of orders
- **Total Spent**: Lifetime customer value
- **Joined**: Registration date
- **Actions**: View details

### Customer Insights

#### Key Metrics Per Customer:
- Total orders placed
- Total amount spent
- Average order value
- Last order date
- Account registration date

### Viewing Customer Details

Click **"View"** to see:
- Complete customer profile
- Full order history
- Shipping addresses used
- Payment preferences
- Contact information

---

## 🎟️ Promotions Management (`/admin/promotions`)

Create and manage discount coupons.

### Coupon List View

#### Table Columns:
- **Code**: Coupon code (e.g., SUMMER2024)
- **Discount**: Type and amount (10% or $5)
- **Expiry**: Expiration date
- **Usage**: Current uses / limit
- **Status**: Active or Inactive
- **Actions**: Edit, Toggle, Delete

### Creating a Coupon

1. Click **"+ New Coupon"** button
2. Fill in the form:

   **Coupon Code**:
   - Unique identifier (auto-uppercase)
   - Example: SUMMER2024, WELCOME10
   - Must be unique

   **Discount Type**:
   - **Percentage (%)**: Discount as percentage of subtotal
   - **Fixed Amount ($)**: Fixed dollar amount off

   **Amount**:
   - Number value
   - For percentage: 10 = 10% off
   - For fixed: 5 = $5 off

   **Expiry Date** (Optional):
   - Date when coupon becomes invalid
   - Leave empty for no expiry

   **Usage Limit** (Optional):
   - Maximum number of times coupon can be used
   - Leave empty for unlimited uses

   **Active**:
   - Check to make coupon immediately active
   - Uncheck to create as inactive

3. Click **"Create Promotion"** to save

### Editing a Coupon

1. Click **"Edit"** next to coupon
2. Modify any fields
3. Click **"Update Promotion"** to save

### Activating/Deactivating Coupons

- Click **"Activate"** to enable an inactive coupon
- Click **"Deactivate"** to disable an active coupon
- Inactive coupons cannot be used at checkout

### Deleting a Coupon

1. Click **"Delete"**
2. Confirm deletion
3. Coupon is permanently removed

### Coupon Examples

#### Welcome Discount (10% off, unlimited):
- Code: WELCOME10
- Type: Percentage
- Amount: 10
- Expiry: (none)
- Limit: (none)

#### Summer Sale ($20 off, expires):
- Code: SUMMER20
- Type: Fixed Amount
- Amount: 20
- Expiry: 2024-08-31
- Limit: (none)

#### Limited Flash Sale (15% off, 100 uses):
- Code: FLASH15
- Type: Percentage
- Amount: 15
- Expiry: 2024-07-15
- Limit: 100

### Tracking Coupon Usage

The admin panel shows:
- **Usage Count**: How many times coupon has been used
- **Remaining Uses**: For limited coupons
- Monitor popular coupons
- Deactivate if needed

---

## 🔧 Best Practices

### Daily Tasks
1. Check pending orders
2. Update order statuses
3. Respond to WhatsApp inquiries
4. Review low stock alerts
5. Check new customer registrations

### Weekly Tasks
1. Review sales analytics
2. Analyze top-selling products
3. Update product descriptions
4. Create promotional campaigns
5. Review and adjust pricing

### Monthly Tasks
1. Analyze monthly revenue
2. Review customer satisfaction
3. Update product photos
4. Plan new product launches
5. Audit inventory levels

### Order Processing Workflow

```
New Order Received
      ↓
Check Stock Availability
      ↓
[If COD]              [If Pre-booking]
      ↓                     ↓
Mark as Processing    Contact Customer
      ↓                     ↓
Prepare Shipment      Confirm Payment
      ↓                     ↓
Update to Shipped     Mark as Processing
      ↓                     ↓
Add Tracking          Prepare Shipment
      ↓                     ↓
Confirm Delivery      Update to Shipped
      ↓                     ↓
Mark as Delivered     Add Tracking
                            ↓
                      Confirm Delivery
                            ↓
                      Mark as Delivered
```

---

## 🚨 Common Issues & Solutions

### Issue: Cannot Login to Admin
**Solutions:**
1. Verify email is correct: `admin@zerolimit.com`
2. Verify password: `shahzaib12`
3. Check user role in database is set to 'admin'
4. Clear browser cache and cookies
5. Try incognito mode

### Issue: Products Not Showing Images
**Solutions:**
1. Verify Cloudinary URL is correct
2. Check image is uploaded to Cloudinary
3. Ensure image URL starts with `https://`
4. Add image via Supabase product_images table
5. Set `is_primary` to true for main image

### Issue: Orders Not Appearing
**Solutions:**
1. Check Supabase connection
2. Verify orders exist in database
3. Refresh the page
4. Check console for errors
5. Verify API endpoint is working

### Issue: Coupon Not Applying
**Solutions:**
1. Verify coupon is active
2. Check coupon hasn't expired
3. Ensure usage limit not reached
4. Code must match exactly (case-insensitive)
5. Check coupon code in database

### Issue: Low Stock Alert
**Actions:**
1. Review product in admin panel
2. Reorder inventory if needed
3. Update stock quantity in product edit
4. Consider removing product if discontinued

---

## 📱 Mobile Admin Access

The admin panel is fully responsive and can be accessed from mobile devices:

### Mobile Features:
- Touch-friendly buttons
- Responsive tables
- Easy navigation
- Quick actions
- Full functionality

### Recommended:
- Use on tablet or larger screen for best experience
- Portrait mode for navigation
- Landscape mode for tables

---

## 🔒 Security Reminders

1. **Never share admin credentials**
2. **Use strong, unique passwords**
3. **Log out when done**
4. **Don't save password in public devices**
5. **Review user activity regularly**
6. **Keep Supabase credentials private**
7. **Monitor for suspicious orders**
8. **Verify large or unusual orders**

---

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Review error messages
3. Check browser console for errors
4. Verify Supabase connection
5. Check all environment variables are set

For technical support, refer to the main documentation in `/docs` folder.

---

**Last Updated**: November 2024  
**Admin Panel Version**: 1.0.0
