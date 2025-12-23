# Render Manual Configuration - Routes Not Working Fix

## Problem
Routes like `/Withdraw Request` (which becomes `/Withdraw%20Request` in URL) show "Page Not Found" on live site.

## Root Cause
Render's static site hosting is not properly configured to handle React Router's client-side routing. The `render.yaml` might not be applied, or the service needs manual configuration.

## Solution: Manual Configuration in Render Dashboard

### Step 1: Go to Render Dashboard
1. Login to https://dashboard.render.com
2. Find your static site service (should be named `music-dashboard-frontend`)

### Step 2: Configure Redirects/Routes
1. Click on your static site service
2. Go to **Settings** tab
3. Scroll down to **Redirects** or **Routes** section
4. If you see "Redirects" section:
   - Click **Add Redirect**
   - **From:** `/*`
   - **To:** `/index.html`
   - **Type:** Select **Rewrite** (NOT Redirect)
   - Click **Save**

### Step 3: Verify render.yaml
1. In Render Dashboard, go to **Settings** → **Build & Deploy**
2. Check if **Build Command** is: `npm install && npm run build`
3. Check if **Publish Directory** is: `build`
4. Verify that `render.yaml` is detected (should show in settings)

### Step 4: Check Service Name
1. Go to **Settings** → **General**
2. Check the **Service Name**
3. It should be: `music-dashboard-frontend`
4. If different, either:
   - Rename service to `music-dashboard-frontend`, OR
   - Update `render.yaml` to match your actual service name

### Step 5: Redeploy
1. Go to **Manual Deploy** → **Deploy latest commit**
2. Wait for build to complete
3. Check build logs for:
   - `✓ _redirects file copied to build folder`
   - Build success message

### Step 6: Test
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Or use incognito window
3. Test routes:
   - `https://www.admin.tuneplusmusic.com/`
   - `https://www.admin.tuneplusmusic.com/Withdraw%20Request`
   - `https://www.admin.tuneplusmusic.com/CompanyManagement`

## Alternative: If Manual Redirect Doesn't Work

### Option 1: Use HashRouter (Changes URLs)
If BrowserRouter doesn't work, we can switch to HashRouter which uses `#` in URLs:
- Current: `https://www.admin.tuneplusmusic.com/Withdraw%20Request`
- With HashRouter: `https://www.admin.tuneplusmusic.com/#/Withdraw%20Request`

This doesn't require server configuration but changes URL format.

### Option 2: Contact Render Support
If nothing works:
1. Go to Render Community: https://community.render.com/
2. Ask about static site routing configuration
3. Provide your service name and issue details

## Verification Checklist

- [ ] Service name matches `music-dashboard-frontend`
- [ ] Manual redirect rule added in Render Dashboard
- [ ] Redirect type is "Rewrite" not "Redirect"
- [ ] Build completes successfully
- [ ] Build logs show `_redirects` copied
- [ ] Tested in incognito window
- [ ] Routes work after hard refresh

## Important Notes

1. **Rewrite vs Redirect:**
   - **Rewrite** = Server serves `/index.html` for all routes (CORRECT)
   - **Redirect** = Server sends 301/302 redirect (WRONG - causes issues)

2. **Service Name:**
   - Must match exactly in `render.yaml` and Render Dashboard
   - Case-sensitive

3. **Build Logs:**
   - Always check build logs after deployment
   - Look for postbuild script output
   - Verify `_redirects` file is copied

