# ⚠️ CRITICAL: Configure Redirects in Render Dashboard

## The Problem
You're getting `404` errors when navigating directly to routes like `/CompanyManagement` because Render needs the rewrite rule configured **manually in the dashboard**.

## ✅ SOLUTION: Configure in Render Dashboard (REQUIRED)

### Step-by-Step Instructions:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/
   - Log in to your account

2. **Find Your Static Site**
   - Look for a service named `music-dashboard-frontend` (or whatever you named it)
   - Click on it to open the service

3. **Go to Settings**
   - Click on **"Settings"** tab in the left sidebar
   - Scroll down to find **"Redirects"** or **"Rewrites"** section

4. **Add Rewrite Rule**
   - Click **"Add Redirect"** or **"Add Rewrite"** button
   - Fill in the form:
     - **Source Path**: `/*`
     - **Destination Path**: `/index.html`
     - **Type/Action**: Select **"Rewrite"** (NOT "Redirect" - this is critical!)
     - **Status Code**: Leave as default or set to `200`
   
   ⚠️ **IMPORTANT**: Use "Rewrite", not "Redirect"!
   - **Redirect** changes the URL in the browser (bad for SPAs)
   - **Rewrite** serves the file without changing the URL (correct for SPAs)

5. **Save Changes**
   - Click **"Save"** or **"Update"**
   - Render will automatically redeploy

6. **Wait for Deployment**
   - Check the "Events" or "Logs" tab
   - Wait for deployment to complete (usually 1-2 minutes)

7. **Test**
   - Open in **incognito/private window** (to avoid cache)
   - Test: `https://www.admin.tuneplusmusic.com/CompanyManagement`
   - Should now work! ✅

## Visual Guide

```
Render Dashboard → Your Service → Settings → Redirects
┌─────────────────────────────────────────┐
│ Add Redirect/Rewrite                     │
├─────────────────────────────────────────┤
│ Source Path:     /*                      │
│ Destination:     /index.html             │
│ Type:            Rewrite  ← IMPORTANT!  │
│ Status Code:     200                     │
└─────────────────────────────────────────┘
```

## Alternative: If You Don't See Redirects Section

If you don't see a "Redirects" section in Settings:

1. **Check Service Type**
   - Make sure it's a **"Static Site"** (not "Web Service")
   - If it's a Web Service, you need to configure it differently

2. **Try Environment Variables**
   - Some Render configurations use environment variables
   - Check if there's a `REDIRECTS` or `REWRITES` env var option

3. **Contact Render Support**
   - If redirects section is missing, contact Render support
   - They can enable it or help configure it

## Verify Configuration

After setting up, verify it's working:

1. **Check Service Settings**
   - Go back to Settings → Redirects
   - You should see: `/*` → `/index.html` (Rewrite)

2. **Test Direct URLs**
   ```bash
   # These should all return 200, not 404:
   https://www.admin.tuneplusmusic.com/
   https://www.admin.tuneplusmusic.com/CompanyManagement
   https://www.admin.tuneplusmusic.com/Dashboard
   https://www.admin.tuneplusmusic.com/All releases
   ```

3. **Check Browser Network Tab**
   - Open DevTools → Network tab
   - Navigate to `/CompanyManagement`
   - Should see `200 OK` for the request, not `404`

## Troubleshooting

### Still Getting 404?

1. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or use incognito window

2. **Check Deployment Status**
   - Make sure latest deployment completed successfully
   - Check build logs for errors

3. **Verify Rewrite Rule**
   - Go back to Settings → Redirects
   - Make sure rule is saved and active
   - Rule should be: `/*` → `/index.html` (Rewrite, not Redirect)

4. **Check Service Name**
   - Verify service name matches `render.yaml` (if using it)
   - Or update `render.yaml` to match your actual service name

### Build Files Not Copying?

The `_redirects` and `static.json` files should be copied automatically, but verify:

1. **Check Build Logs**
   - Look for: `✓ _redirects file copied to build folder`
   - Look for: `✓ static.json file copied to build folder`

2. **Manual Verification**
   - After build, check if these exist in build folder:
     - `build/_redirects`
     - `build/static.json`

## Why This Happens

- React Router uses **client-side routing**
- When you visit `/CompanyManagement` directly, the server looks for that file
- The file doesn't exist (it's a client-side route)
- Server returns 404
- **Solution**: Configure server to serve `index.html` for all routes
- React Router then handles the routing on the client side

## Summary

**The fix MUST be done in Render Dashboard manually.** The `render.yaml` file helps, but Render static sites often need manual configuration in the dashboard for redirects/rewrites to work properly.

After configuring the rewrite rule in the dashboard, all routes will work correctly! ✅

