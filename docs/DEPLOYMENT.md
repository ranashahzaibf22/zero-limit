# Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account
- All environment variables ready

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
   Add all variables from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_URL` (set to your production URL)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

5. **Update Stripe Webhook**
   - Go to Stripe Dashboard > Webhooks
   - Update webhook URL to `https://yourdomain.vercel.app/api/webhooks/stripe`

### Production Checklist
- [ ] All environment variables set
- [ ] Database schema applied
- [ ] Admin user created
- [ ] Stripe webhook configured
- [ ] Test checkout flow
- [ ] Test admin panel

## Digital Ocean Deployment

### Server Setup

1. **Create Droplet**
   ```bash
   # Ubuntu 22.04 LTS
   # At least 1GB RAM
   ```

2. **Connect to Server**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node --version
   npm --version
   ```

4. **Install Git**
   ```bash
   sudo apt-get install git
   ```

5. **Clone Repository**
   ```bash
   cd /var/www
   git clone <your-repo-url> zerolimit
   cd zerolimit
   npm install
   ```

6. **Environment Setup**
   ```bash
   cp .env.example .env.local
   nano .env.local
   # Fill in production values
   ```

7. **Build Application**
   ```bash
   npm run build
   ```

8. **Install PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "zerolimit" -- start
   pm2 startup
   pm2 save
   ```

### Nginx Configuration

1. **Install Nginx**
   ```bash
   sudo apt-get install nginx
   ```

2. **Configure Site**
   ```bash
   sudo nano /etc/nginx/sites-available/zerolimit
   ```

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/zerolimit /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### SSL with Let's Encrypt

1. **Install Certbot**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Get Certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo certbot renew --dry-run
   ```

### Database Connection

Ensure your Supabase/Neon database allows connections from your server IP.

### Monitoring

```bash
# View logs
pm2 logs zerolimit

# Monitor app
pm2 monit

# Restart app
pm2 restart zerolimit
```

### Updates

```bash
cd /var/www/zerolimit
git pull origin main
npm install
npm run build
pm2 restart zerolimit
```

## Post-Deployment

1. Test all features:
   - User registration/login
   - Product browsing
   - Add to cart
   - Checkout process
   - Admin panel access
   - Order management

2. Configure DNS:
   - Point A record to server IP
   - Add www CNAME if needed

3. Monitor:
   - Check error logs
   - Monitor performance
   - Set up alerts

## Troubleshooting

### Build Errors
- Check Node.js version (18+)
- Clear `.next` folder and rebuild
- Verify all dependencies installed

### Database Connection
- Check environment variables
- Verify database URL format
- Check firewall rules

### Stripe Webhook
- Verify webhook URL is correct
- Check webhook secret matches
- Test with Stripe CLI

### Performance
- Enable caching in Nginx
- Optimize images
- Use CDN for static assets
