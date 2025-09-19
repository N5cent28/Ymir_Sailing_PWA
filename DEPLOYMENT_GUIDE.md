# Ymir Sailing Club PWA - Deployment Guide

## 🚀 Quick Deploy to Netlify (Recommended)

### Step 1: Prepare Your Repository
1. Ensure your code is in a Git repository (GitHub, GitLab, etc.)
2. Make sure all files are committed

### Step 2: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your Git repository
4. Netlify will automatically detect it's an Astro project
5. Set build command: `npm run build`
6. Set publish directory: `dist`
7. Click "Deploy site"

### Step 3: Configure Environment Variables
In your Netlify dashboard, go to Site settings → Environment variables and add:
```
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
ADMIN_PIN=your_admin_pin_here
APP_URL=https://yourdomain.com
```

### Step 4: Set Up Custom Domain (Optional)
1. In Netlify dashboard, go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

## 🔧 Pre-Deployment Checklist

### Database Setup
**PostgreSQL (Required for Production)**
1. Set up a PostgreSQL database (Neon, Supabase, etc.)
2. Update `DATABASE_URL` environment variable
3. Run migration scripts if needed

### QR Code URLs Update
**CRITICAL**: Update all QR code URLs to use your production domain:

**Before deployment, update these files:**
- `src/pages/en/qr-codes.astro`
- `src/pages/is/qr-codes.astro`
- `generate-qr-codes.md`
- `ADMIN_GUIDE.md`

**Use the update script:**
```bash
node update-qr-urls.js https://yourdomain.com
```

### Environment Variables Required
```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
ADMIN_PIN=your_admin_pin_here
APP_URL=https://yourdomain.com
```

## 📱 PWA Configuration

### Service Worker
- Automatically generated during build
- Handles offline functionality
- Manages push notifications

### Manifest
- Located at `public/manifest.json`
- Defines PWA metadata
- Icons stored in `public/` directory

## 🔔 Push Notifications Setup

### VAPID Keys
1. Generate VAPID keys for push notifications
2. Add to environment variables:
   ```
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key
   VAPID_EMAIL=your_email@domain.com
   ```

### Netlify Functions
- Push notification endpoints are serverless functions
- Automatically deployed with your site
- No additional configuration needed

## 🚀 Deployment Steps

### 1. Build Locally (Optional)
```bash
npm run build
npm run preview
```

### 2. Deploy to Netlify
1. Connect your Git repository to Netlify
2. Configure build settings
3. Add environment variables
4. Deploy

### 3. Post-Deployment
1. Test all functionality
2. Verify QR codes work
3. Test push notifications
4. Check admin dashboard

## 🔧 Troubleshooting

### Common Issues
- **Build fails**: Check Node.js version (18+ required)
- **Database errors**: Verify DATABASE_URL is correct
- **QR codes not working**: Update URLs in all files
- **Push notifications not working**: Check VAPID keys

### Debug Steps
1. Check Netlify function logs
2. Verify environment variables
3. Test database connection
4. Check browser console for errors

## 📊 Monitoring

### Netlify Analytics
- Built-in analytics available
- Monitor site performance
- Track user engagement

### Function Logs
- View serverless function logs
- Debug API issues
- Monitor notification delivery

## 🔄 Updates

### Automatic Deployments
- Netlify automatically deploys on Git push
- No manual deployment needed
- Environment variables persist

### Manual Updates
1. Make changes locally
2. Commit and push to Git
3. Netlify automatically rebuilds and deploys

## 📋 Production Checklist

- [ ] Database configured and tested
- [ ] Environment variables set
- [ ] QR code URLs updated
- [ ] VAPID keys configured
- [ ] Custom domain set up (optional)
- [ ] SSL certificate active
- [ ] All functionality tested
- [ ] Admin access verified
- [ ] Push notifications working
- [ ] PWA installable

## 🆘 Support

### Documentation
- Check this guide for common issues
- Review Netlify documentation
- Check Astro documentation

### Getting Help
1. Check Netlify function logs
2. Verify environment variables
3. Test locally first
4. Check browser console

## 🎉 Success!

Your Ymir Sailing Club PWA should now be live and accessible at your Netlify domain!

**Next steps:**
1. Test all functionality
2. Share with club members
3. Monitor usage and performance
4. Set up regular backups