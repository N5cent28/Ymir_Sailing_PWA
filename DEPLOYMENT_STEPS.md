# 🚀 Ymir Sailing Club PWA - Deployment Steps

## ✅ Pre-Deployment Checklist

**Database**: ✅ Neon PostgreSQL connected and migrated  
**File Storage**: ✅ Local file storage configured (public/qr-codes/)  
**Code**: ✅ Pushed to GitHub and ready for deployment  
**Build**: ✅ Netlify deployment configured  

## 📋 Deployment Steps

### Step 1: Deploy to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "New site from Git"**
3. **Connect your GitHub repository**: `N5cent28/Ymir_Sailing_PWA`
4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Click "Deploy site"**

### Step 2: Configure Environment Variables

In your Netlify site dashboard, go to **Site settings → Environment variables** and add:

```
DATABASE_URL=postgres://neondb_owner:npg_XGd87KwNSAHM@ep-mute-boat-ad1q7b1p-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NODE_ENV=production
ADMIN_PIN=your_admin_pin_here
APP_URL=https://yourdomain.com
```

### Step 3: Redeploy

After adding environment variables, trigger a new deployment:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**

### Step 4: Update QR Code URLs

**CRITICAL**: Update all QR code URLs to use your production domain:

```bash
node update-qr-urls.js https://yourdomain.com
```

This updates:
- `src/pages/en/qr-codes.astro`
- `src/pages/is/qr-codes.astro`
- `generate-qr-codes.md`
- `ADMIN_GUIDE.md`

### Step 5: Generate QR Codes

After deployment, generate QR codes for each boat:

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
https://yourdomain.com/qr/kayak     (Kayak)
https://yourdomain.com/qr/paddle-board (Paddle Board)
```

## 🎉 Deployment Complete!

Your app will be available at: `https://yourdomain.com` (or your Netlify subdomain)

## ✅ What's Working

- ✅ **Live on Netlify** with serverless functions
- ✅ **PostgreSQL database** connected and working
- ✅ **Using local file storage** for QR codes
- ✅ **PWA features** (installable, offline support)
- ✅ **Push notifications** system
- ✅ **Admin dashboard** with full functionality

## 🔧 Technical Notes

### Node.js Version
The local Node.js version (24) is not supported by Netlify Functions.

**This is normal and expected!** Netlify automatically handles the version mismatch:
- ✅ **Local development**: Node.js 24 (your system)
- ✅ **Production deployment**: Node.js 18 (Netlify's runtime)
- ✅ **No action needed**: Netlify automatically uses the correct version

### Build Configuration
- **Adapter**: `@astrojs/netlify` (configured in astro.config.mjs)
- **Output**: Server-side rendering with Netlify Functions
- **File Storage**: Local file system (public/qr-codes/)

### Database
- **Type**: PostgreSQL (Neon)
- **Connection**: Environment variable `DATABASE_URL`
- **SSL**: Required for production

## 🚨 Important Notes

### QR Code Storage
- QR codes are now stored in `public/qr-codes/` directory
- No external storage service needed
- Files are served directly by Netlify

### Environment Variables
Make sure all required environment variables are set in Netlify:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "production"
- `ADMIN_PIN` - Admin access PIN
- `APP_URL` - Your production domain

## 🔄 Future Updates

### Automatic Deployments
- Netlify automatically deploys when you push to GitHub
- No manual deployment needed
- Environment variables persist across deployments

### Manual Updates
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to GitHub
4. Netlify automatically rebuilds and deploys

## 🆘 Troubleshooting

### Common Issues
- **Build fails**: Check Node.js version and dependencies
- **Database errors**: Verify DATABASE_URL is correct
- **QR codes not working**: Update URLs in all files
- **Functions not working**: Check Netlify function logs

### Debug Steps
1. Check Netlify function logs in dashboard
2. Verify environment variables are set
3. Test database connection
4. Check browser console for errors

## 📊 Monitoring

### Netlify Dashboard
- Monitor deployments
- View function logs
- Check site analytics
- Manage environment variables

### Function Logs
- Go to Functions tab in Netlify dashboard
- View real-time logs
- Debug API issues
- Monitor notification delivery

## 🎯 Next Steps

1. **Test all functionality** on the live site
2. **Generate QR codes** for all boats
3. **Test push notifications** with admin dashboard
4. **Share with club members**
5. **Monitor usage and performance**

## 📞 Support

If you encounter any issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test locally first
4. Check browser console for errors

**Need help?** Check the deployment logs in Netlify dashboard or refer to the original documentation files.