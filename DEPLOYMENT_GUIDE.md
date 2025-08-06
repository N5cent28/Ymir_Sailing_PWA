# Ymir Sailing Club PWA - Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository
1. Ensure your code is in a Git repository (GitHub, GitLab, etc.)
2. Make sure all files are committed

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's an Astro project
5. Click "Deploy"

### Step 3: Configure Environment Variables
In your Vercel dashboard, go to Settings → Environment Variables and add:
```
NODE_ENV=production
ADMIN_PIN=your_admin_pin_here
APP_URL=https://yourdomain.com
```

### Step 4: Set Up Custom Domain (Optional)
1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 🔧 Pre-Deployment Checklist

### Database Setup
**Option A: Keep SQLite (Quick Start)**
- Your `boats.db` file will be included in deployment
- Note: Data resets on each deployment
- Good for testing, not ideal for production

**Option B: PostgreSQL (Recommended for Production)**
1. Set up a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Update database connection in `src/lib/database.js`
3. Run migration scripts

**Option C: Vercel KV (Serverless)**
1. Create Vercel KV database
2. Update database functions to use KV instead of SQLite

### QR Code URLs Update
**CRITICAL**: Update all QR code URLs to use your production domain:

**Before deployment, update these files:**
- `src/pages/en/qr-codes.astro`
- `src/pages/is/qr-codes.astro`
- `generate-qr-codes.md`
- `ADMIN_GUIDE.md`

**Replace all instances of:**
```
https://yourdomain.com
```
**With your actual domain:**
```
https://ymir-sailing-club.vercel.app
```
or your custom domain.

### QR Code Generation
After deployment, generate QR codes for each boat using your production URLs:

**Individual Boats:**
```
https://yourdomain.com/qr/boat-1    (Quest 1)
https://yourdomain.com/qr/boat-2    (Quest 2)
https://yourdomain.com/qr/boat-3    (Zest 1)
https://yourdomain.com/qr/boat-4    (Zest 2)
https://yourdomain.com/qr/boat-5    (Zest 3)
https://yourdomain.com/qr/boat-6    (Zest 4)
https://yourdomain.com/qr/boat-7    (Zest 5)
https://yourdomain.com/qr/boat-8    (Zest 6)
https://yourdomain.com/qr/boat-9    (Topaz 1)
https://yourdomain.com/qr/boat-10   (Topaz 2)
https://yourdomain.com/qr/boat-11   (Laser 1)
https://yourdomain.com/qr/boat-12   (Laser 2)
https://yourdomain.com/qr/boat-13   (Laser 3)
https://yourdomain.com/qr/boat-14   (Laser 4)
```

**Shared Boats:**
```
https://yourdomain.com/qr/kayak         (Kayak)
https://yourdomain.com/qr/paddle-board  (Paddle Board)
```

## 📱 PWA Configuration

### Service Worker
Your service worker (`public/sw.js`) is already configured for PWA functionality.

### Manifest
Your `public/manifest.json` is properly configured for:
- App installation
- Splash screen
- Theme colors
- Icons

### Icons
Ensure your icons are properly sized:
- `icon-192.svg` (192x192)
- `icon-512.svg` (512x512)

## 🔒 Security Considerations

### Admin PIN
- Change the default admin PIN before going live
- Use a strong, memorable PIN
- Share securely with club administrators

### HTTPS
- Vercel provides automatic HTTPS
- Ensure all QR codes use HTTPS URLs
- Test QR code scanning on production domain

### Data Privacy
- Review what data is stored
- Consider GDPR compliance if applicable
- Implement data retention policies

## 📊 Post-Deployment Testing

### Essential Tests
1. **QR Code Scanning**: Test each boat's QR code
2. **Check-in/Check-out**: Test the complete workflow
3. **Admin Functions**: Test admin panel access
4. **Mobile Experience**: Test on various devices
5. **Offline Functionality**: Test PWA offline features

### Performance Testing
1. **Load Times**: Ensure fast loading on mobile
2. **Database Performance**: Test with multiple concurrent users
3. **Image Optimization**: Ensure QR codes load quickly

## 🚨 Important Considerations

### QR Code URLs
**MOST IMPORTANT**: All QR codes must point to your production domain. If you change domains later, you'll need to regenerate all QR codes.

### Database Persistence
If using SQLite, be aware that:
- Data may reset on deployments
- Consider backing up data regularly
- For production, migrate to a persistent database

### SMS Notifications
If implementing SMS notifications:
- Set up Twilio or similar service
- Add environment variables for API keys
- Test notification delivery

### Backup Strategy
- Regular database backups
- QR code image backups
- Configuration backups

## 🔄 Continuous Deployment

### Automatic Deployments
- Connect your Git repository to Vercel
- Every push to main branch triggers deployment
- Test changes in development branch first

### Environment Management
- Use different environments for dev/staging/production
- Test database migrations in staging first
- Use feature flags for new features

## 📞 Support & Maintenance

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor uptime and performance
- Track user analytics

### Updates
- Regular security updates
- Feature updates based on user feedback
- Database schema updates as needed

### Documentation
- Keep deployment guide updated
- Document any custom configurations
- Maintain admin user guide

## 🎯 Go-Live Checklist

- [ ] Deploy to production
- [ ] Update all QR code URLs
- [ ] Generate and print QR codes
- [ ] Test all boat check-in/check-out flows
- [ ] Test admin functions
- [ ] Verify PWA installation works
- [ ] Test on multiple devices
- [ ] Set up monitoring
- [ ] Train club administrators
- [ ] Announce to club members

## 🆘 Troubleshooting

### Common Issues
1. **QR codes not working**: Check URL format and HTTPS
2. **Database errors**: Verify database file is included in deployment
3. **PWA not installing**: Check manifest.json and service worker
4. **Admin access issues**: Verify PIN and environment variables

### Getting Help
- Check Vercel deployment logs
- Review browser console for errors
- Test locally with `npm run build && npm run preview`
- Contact support if needed 