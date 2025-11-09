# Deployment Guide (Free Tier Services Only)

## Vercel Deployment (Recommended - 100% Free)

### Prerequisites
- GitHub account
- Vercel account (free)
- All free-tier services configured:
  - Supabase (database)
  - Cloudinary (images)
  - WhatsApp Business number

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Environment Variables**
   Add all variables in Vercel Dashboard (Settings > Environment Variables):

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   
   # NextAuth
   NEXTAUTH_URL=https://yourdomain.vercel.app
   NEXTAUTH_SECRET=your_generated_secret
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # WhatsApp
   NEXT_PUBLIC_WHATSAPP_NUMBER=+92XXXXXXXXXX
   
   # App
   NEXT_PUBLIC_APP_URL=https://yourdomain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

5. **Post-Deployment**
   - Update `NEXTAUTH_URL` to your Vercel URL
   - Test all functionality
   - Create admin user in Supabase

### Production Checklist
- [ ] All environment variables set
- [ ] Database schema applied in Supabase
- [ ] Admin user created
- [ ] Cloudinary credentials configured
- [ ] WhatsApp number set
- [ ] Test checkout flow (COD/Pre-booking)
- [ ] Test admin panel
- [ ] Test WhatsApp buttons

## Free Tier Limits

### Supabase (Free Tier)
- **Database**: 500MB
- **File Storage**: 1GB
- **Bandwidth**: 2GB/month
- **API Requests**: Unlimited

**Enough for**: ~5,000 products, 10,000 orders/month

### Cloudinary (Free Tier)
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Videos**: 0.5GB storage, 1GB bandwidth

**Enough for**: ~5,000 product images with variants

### Vercel (Free Tier)
- **Bandwidth**: 100GB/month
- **Build Minutes**: 6,000/month
- **Sites**: Unlimited
- **Serverless Functions**: 100GB-Hours

**Enough for**: 50,000+ page views/month

## Scaling Beyond Free Tier

If you outgrow free tiers:

### Supabase Pro ($25/month)
- 8GB database
- 100GB file storage
- 250GB bandwidth/month

### Cloudinary Plus ($89/month when needed)
- 200GB storage
- 275GB bandwidth/month
- Unlimited transformations

### Vercel Pro ($20/month)
- 1TB bandwidth
- Unlimited build minutes
- Advanced analytics

## Monitoring Usage

### Supabase
- Dashboard > Settings > Usage
- Monitor database size, API requests, bandwidth

### Cloudinary
- Dashboard > Usage
- Monitor storage, transformations, bandwidth

### Vercel
- Dashboard > Analytics
- Monitor bandwidth, function executions

## Performance Optimization

### Images (Cloudinary)
```javascript
// Automatic optimization enabled by default
// In lib/cloudinary.ts:
transformation: [
  { width: 1000, height: 1000, crop: 'limit' },
  { quality: 'auto' },  // Auto quality based on connection
  { fetch_format: 'auto' }  // Auto format (WebP, AVIF when supported)
]
```

### Database (Supabase)
- Indexes already configured in schema
- Connection pooling enabled by default
- Query optimization via select specific columns

### Caching
- Next.js static generation for product pages
- API route caching where appropriate
- Image CDN caching via Cloudinary

## Backup Strategy

### Database Backups (Supabase)
Free tier includes:
- Daily automatic backups (7 days retention)
- Point-in-time recovery

Manual backup:
```bash
# Export database
supabase db dump > backup.sql

# Import if needed
psql -h db.xxx.supabase.co -p 5432 -U postgres -d postgres < backup.sql
```

### Image Backups (Cloudinary)
- Cloudinary retains all uploaded images
- Optional: Periodic export via API
- Disaster recovery built-in

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env.local` to Git
   - Use Vercel's encrypted environment variables
   - Rotate secrets periodically

2. **Supabase**
   - Use Row Level Security (RLS) policies
   - Limit service role key usage to server-side only
   - Enable 2FA on Supabase account

3. **Cloudinary**
   - Use signed uploads for production
   - Restrict upload permissions
   - Enable 2FA on account

4. **Vercel**
   - Enable deployment protection
   - Use preview deployments for testing
   - Enable 2FA on account

## Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
vercel --force

# Check environment variables
vercel env ls
```

### Database Connection
- Verify Supabase URL format: `https://xxx.supabase.co`
- Check API keys are for same project
- Test connection in Supabase dashboard

### Image Upload Failures
- Verify Cloudinary credentials
- Check upload preset exists
- Monitor usage limits in dashboard

### WhatsApp Button Not Working
- Verify number format: +92XXXXXXXXXX
- Test number is active on WhatsApp
- Check environment variable is set

## Custom Domain (Optional)

### Add Custom Domain to Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (up to 48 hours)
5. Vercel automatically provisions SSL

### Update Environment Variables
```env
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Monitoring & Analytics

### Vercel Analytics (Free)
- Automatic page view tracking
- Core Web Vitals monitoring
- Real User Monitoring (RUM)

### Supabase Logs
- Real-time database logs
- API request tracking
- Error monitoring

### Custom Analytics
Add Google Analytics 4 (free):
```javascript
// app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

## Support & Help

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Cloudinary**: [cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

---

✅ **Your store is now deployed on 100% free infrastructure!**

Start selling without any monthly infrastructure costs.
