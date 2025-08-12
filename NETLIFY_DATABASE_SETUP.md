# 🚀 Fixing Database Connection in Netlify

## The Problem
Your Astro PWA is deployed on Netlify but getting **500 Internal Server Errors** because:
- The app is trying to connect to a PostgreSQL database (Neon)
- Netlify doesn't have the `DATABASE_URL` environment variable set
- All database operations fail, causing the 500 errors

## ✅ Solution: Connect Neon Database to Netlify

### Step 1: Get Your Neon Database Connection String

1. **Go to Neon Dashboard**: https://console.neon.tech/
2. **Select your project** (the one you created for Vercel)
3. **Click "Connection Details"** in the left sidebar
4. **Copy the connection string** that looks like:
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

### Step 2: Add Environment Variables in Netlify

1. **Go to your Netlify dashboard**: https://app.netlify.com/
2. **Select your site** (effortless-choux-105f99)
3. **Go to Site settings** → **Environment variables**
4. **Add these variables**:

   | Key | Value | Description |
   |-----|-------|-------------|
   | `DATABASE_URL` | `your_neon_connection_string` | Your Neon database connection string |
   | `NODE_ENV` | `production` | Tells the app it's running in production |
   | `ADMIN_PIN` | `your_admin_pin` | The PIN for admin access (check your env.example) |
   | `APP_URL` | `https://siglingafelagidymir.com` | Your production domain |

### Step 3: Redeploy Your Site

1. **Trigger a new deployment** by:
   - Pushing a small change to your Git repository, OR
   - Going to Netlify dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

### Step 4: Test the Fix

1. **Wait for deployment to complete**
2. **Test your API endpoints**:
   - Try changing boat status in admin dashboard
   - Try checking out a boat
   - Check the browser console for errors

## 🔍 Alternative: Create New Netlify Database

If you prefer to start fresh with Netlify's infrastructure:

### Option A: Netlify Postgres
1. In Netlify dashboard, go to **Functions** → **Postgres**
2. Create a new database
3. Use the connection string provided by Netlify

### Option B: New Neon Database
1. Create a new Neon database specifically for Netlify
2. Update the connection string in Netlify environment variables

## 🚨 Important Notes

- **Never commit your `.env` file** to Git (it should be in `.gitignore`)
- **Environment variables are encrypted** in Netlify
- **Changes require redeployment** to take effect
- **Check your Neon database is still active** (they can expire if unused)

## 🧪 Testing Your Setup

After setting up the environment variables, you can test locally:

```bash
# Set the environment variable temporarily
export DATABASE_URL="your_neon_connection_string"

# Test the connection
node test-neon-connection.js
```

## 📞 Need Help?

If you're still having issues:
1. Check the Netlify deployment logs for errors
2. Verify your Neon database is active and accessible
3. Ensure the connection string format is correct
4. Check that SSL is enabled (Neon requires it)

## 🎯 Expected Result

After fixing this, your API endpoints should work correctly:
- ✅ `/api/update-boat-status` - Should update boat status
- ✅ `/api/check-in` - Should allow boat checkouts
- ✅ No more 500 errors in the console 