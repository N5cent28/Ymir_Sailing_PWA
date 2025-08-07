# 🚀 Ymir Sailing Club PWA - Deployment Guide

## ✅ Pre-Deployment Checklist

**Database**: ✅ Neon PostgreSQL connected and migrated  
**File Storage**: ✅ Vercel Blob configured and tested  
**Code**: ✅ Pushed to GitHub and ready for deployment  
**Build**: ✅ Fixed serverless deployment issue  

## 📋 Deployment Steps

### Step 1: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your GitHub repository**: `N5cent28/Ymir_Sailing_PWA`
4. **Vercel will auto-detect it's an Astro project**
5. **Click "Deploy"**

### Step 2: Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```
DATABASE_URL=postgres://neondb_owner:npg_XGd87KwNSAHM@ep-mute-boat-ad1q7b1p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_2c4aSUK3SUrn4zhP_iQMyLp0re9399zpQGvtcPICuVWumpp
NODE_ENV=production
```

### Step 3: Redeploy

After adding environment variables:
1. **Go to Deployments tab**
2. **Click "Redeploy"** on your latest deployment
3. **Wait for deployment to complete**

### Step 4: Test Your Deployment

Your app will be available at: `https://ymir-sailing-pwa.vercel.app` (or similar)

**Test these features:**
- ✅ Homepage loads
- ✅ Member login works
- ✅ Boat check-in/out works
- ✅ QR codes work
- ✅ Admin panel works

### Step 5: Update QR Code URLs

**After deployment, update QR code URLs to use your new domain:**

Run this script to update all QR code URLs:
```bash
node update-qr-urls.js https://your-vercel-domain.vercel.app
```

**Example QR code URLs:**
```
https://your-domain.vercel.app/qr/boat-1    (Quest 1)
https://your-domain.vercel.app/qr/boat-2    (Quest 2)
https://your-domain.vercel.app/qr/boat-3    (Zest 1)
... (all 16 boats)
https://your-domain.vercel.app/qr/kayak     (Kayak)
https://your-domain.vercel.app/qr/paddle-board (Paddle Board)
```

## 🎉 Success!

Your Ymir Sailing Club PWA is now:
- ✅ **Live on Vercel** with serverless functions
- ✅ **Using Neon PostgreSQL** for persistent data
- ✅ **Using Vercel Blob** for file storage
- ✅ **Optimized for mobile** with PWA features
- ✅ **Ready for production use**

## 🔧 Troubleshooting

### **Node.js Version Compatibility**

**⚠️ Important**: You may see this warning during build:
```
The local Node.js version (24) is not supported by Vercel Serverless Functions.
Your project will use Node.js 22 as the runtime instead.
```

**This is normal and expected!** Vercel automatically handles the version mismatch:
- ✅ **Local development**: Node.js 24 (your machine)
- ✅ **Production deployment**: Node.js 22 (Vercel's runtime)
- ✅ **No action needed**: Vercel automatically uses the correct version

**If you want to match versions locally:**
```bash
# Install Node.js 22 (optional)
nvm install 22
nvm use 22
```

### **If deployment fails with "Cannot find module '/var/task/dist/server/entry.mjs'"**

**This was the main issue we fixed!** The problem was:
- ❌ **Deprecated adapter**: `@astrojs/vercel/serverless` was causing build issues
- ✅ **Solution**: Switched to `@astrojs/vercel` with proper configuration

**If you see this error again:**
1. Check that `astro.config.mjs` uses `@astrojs/vercel` adapter
2. Verify `dist/server/entry.mjs` exists after build
3. Clean build cache: `rm -rf dist .vercel && npm run build`

### **Other Common Issues:**

**If deployment fails:**
1. Check environment variables are set correctly
2. Verify database connection string
3. Check Vercel deployment logs

**If QR codes don't work:**
1. Update QR code URLs with new domain
2. Regenerate QR codes if needed

**If database connection fails:**
1. Verify DATABASE_URL is correct
2. Check Neon database is active
3. Test connection locally first

**If build fails locally:**
1. Run `npm run build` to check for errors
2. Verify all imports are correct
3. Check for missing dependencies

## 📱 PWA Features

Your app includes:
- **Offline support** with service worker
- **Installable** on mobile devices
- **Push notifications** (if configured)
- **Responsive design** for all devices

## 🔐 Security

- **Admin authentication** with PIN system
- **Member authentication** with member numbers
- **Secure database** with SSL connections
- **Environment variables** for sensitive data

## 🛠️ Technical Details

**Current Configuration:**
- **Adapter**: `@astrojs/vercel` (modern configuration)
- **Database**: Neon PostgreSQL
- **File Storage**: Vercel Blob
- **Build Output**: `dist/server/entry.mjs` ✅
- **Node.js Runtime**: 22 (Vercel production) / 24 (local development)

**Key Files:**
- `astro.config.mjs` - Astro configuration
- `src/lib/database-postgres.js` - Database functions
- `vercel.json` - Vercel configuration
- `env.example` - Environment variables template

---

**Need help?** Check the deployment logs in Vercel dashboard or refer to the original documentation files. 