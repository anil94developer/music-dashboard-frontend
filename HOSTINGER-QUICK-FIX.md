# Hostinger Par Routes Fix - Quick Guide (Hindi)

## Problem
Routes kaam nahi kar rahe - "404 Not Found" aa raha hai.

## Solution (3 Simple Steps)

### Step 1: Build Run Karein
```bash
cd tuneplus-main
npm run build
```

### Step 2: Build Folder Check Karein
1. `tuneplus-main/build` folder mein jao
2. `.htaccess` file check karein (agar nahi hai, to `public/.htaccess` ko manually copy karein)
3. `index.html` file check karein

### Step 3: Hostinger Par Upload Karein
1. **Hostinger cPanel** mein login karein
2. **File Manager** open karein
3. `public_html` folder mein jao (ya jahan aapki site hosted hai)
4. **Build folder ki SAARI files** upload karein:
   - `index.html`
   - `static/` folder (purra)
   - `.htaccess` file (IMPORTANT!)
   - Sab kuch

### Step 4: .htaccess File Verify Karein
1. File Manager mein `.htaccess` file check karein
2. File name exactly `.htaccess` honi chahiye (dot se start, extension nahi)
3. File `public_html` root mein honi chahiye (jahan `index.html` hai)

### Step 5: Test Karein
1. Browser cache clear karein: `Ctrl+Shift+R` (Windows) ya `Cmd+Shift+R` (Mac)
2. Ya incognito window mein test karein
3. Routes test karein:
   - `https://www.admin.tuneplusmusic.com/`
   - `https://www.admin.tuneplusmusic.com/CompanyManagement`
   - `https://www.admin.tuneplusmusic.com/Withdraw%20Request`

## .htaccess File Content

Agar `.htaccess` file manually banana ho, to yeh content use karein:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

## Important Points

1. **File Name:** `.htaccess` (dot se start, extension nahi)
2. **Location:** `public_html` root folder mein (jahan `index.html` hai)
3. **Permissions:** 644 ya 755
4. **Build Folder:** Puri build folder upload karni hai, sirf `index.html` nahi

## Common Mistakes (Avoid Karein)

❌ **GALAT:**
- File name: `htaccess` (dot nahi hai)
- File name: `.htaccess.txt` (extension hai)
- Sirf `index.html` upload kiya
- `.htaccess` file subfolder mein hai

✅ **SAHI:**
- File name: `.htaccess` (dot se start, no extension)
- Puri `build` folder upload ki
- `.htaccess` file `public_html` root mein hai

## Verification Checklist

- [ ] `npm run build` successfully run hua
- [ ] `build/.htaccess` file check ki
- [ ] Build folder ki saari files upload hui
- [ ] `.htaccess` file `public_html` root mein hai
- [ ] File name exactly `.htaccess` hai
- [ ] Browser cache clear kiya
- [ ] Routes test kiye (incognito window mein)

## Agar Abhi Bhi Kaam Nahi Kare

### Option 1: File Manager Se Manually Add Karein
1. cPanel → File Manager → `public_html`
2. **New File** create karein
3. Name: `.htaccess` (dot se start)
4. Content paste karein (upar wala code)
5. Save karein

### Option 2: FTP Se Upload Karein
1. FTP client (FileZilla) use karein
2. `public_html` folder connect karein
3. `.htaccess` file upload karein
4. File permissions set karein (644)

### Option 3: Hostinger Support
Agar kuch bhi kaam nahi kare:
1. Hostinger support se contact karein
2. Bataein: "React Router routes kaam nahi kar rahe"
3. `.htaccess` file configuration ke liye help maangein

## Quick Commands

```bash
# Build run karein
npm run build

# Build folder check karein
ls -la build/.htaccess

# Agar .htaccess nahi hai, manually copy karein
cp public/.htaccess build/.htaccess
```

Yeh karne se routes kaam karne chahiye! 🚀

