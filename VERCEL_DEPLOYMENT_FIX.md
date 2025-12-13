# 🚀 Vercel Angular SPA Deployment Fix

## 🔴 Problem Diagnosis

Your Angular app shows **404: NOT_FOUND** on Vercel because:

### Root Cause #1: Wrong Output Directory
- **Angular 17+** uses the new `@angular-devkit/build-angular:application` builder
- This builder outputs to `dist/word-tracker/browser` (adds `/browser` subdirectory)
- Vercel was looking in `dist/word-tracker` (missing the `/browser` folder)
- Result: No `index.html` found → 404 error

### Root Cause #2: SPA Routing Not Configured
- Without proper rewrites, Vercel treats routes like `/dashboard` as file paths
- When you refresh `/dashboard`, Vercel looks for a file named `dashboard`
- Since it doesn't exist, you get a 404
- Solution: Rewrite all routes to `index.html` so Angular handles routing

---

## ✅ Solution Applied

### 1. **Optimized `vercel.json` Created**

**Location:** `frontend/vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/word-tracker/browser",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**What This Does:**
- ✅ **buildCommand**: Explicitly tells Vercel to run `npm run build`
- ✅ **outputDirectory**: Points to correct Angular 17 output folder (`dist/word-tracker/browser`)
- ✅ **rewrites**: All routes serve `index.html` (fixes refresh/direct URL access)
- ✅ **headers**: Optimizes caching for static assets (JS, CSS, images)
- ✅ **framework: null**: Prevents Vercel from auto-detecting and using wrong settings

---

## 📋 Vercel Project Settings

### Option A: Using `vercel.json` (Recommended)
Since we've added build settings to `vercel.json`, Vercel will automatically use them. **No manual configuration needed!**

### Option B: Manual Configuration (If Option A Fails)
Go to your Vercel project → **Settings** → **General**:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/word-tracker/browser` |
| **Install Command** | `npm install` |

---

## 🎯 Deployment Steps

### Step 1: Commit Changes
```bash
cd d:\000\word-tracker-main
git add frontend/vercel.json
git commit -m "fix: optimize vercel.json for Angular 17 SPA routing"
git push origin main
```

### Step 2: Trigger Redeploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Deployments** tab
4. Click **⋯** (three dots) on the latest deployment
5. Click **Redeploy**
6. ✅ Check **"Use existing Build Cache"** = **OFF** (force fresh build)
7. Click **Redeploy**

### Step 3: Verify Deployment
Wait for deployment to complete, then test:

✅ **Root URL**: `https://your-app.vercel.app/` → Should load homepage  
✅ **Direct Route**: `https://your-app.vercel.app/dashboard` → Should load dashboard  
✅ **Refresh Test**: Navigate to `/dashboard` and press F5 → Should NOT show 404  
✅ **Browser Back/Forward**: Should work without errors  

---

## 🔍 Why This Works

### Angular 17 Application Builder
```json
"builder": "@angular-devkit/build-angular:application"
```
This new builder (vs old `browser` builder) creates:
```
dist/
└── word-tracker/
    ├── browser/          ← Client-side bundle (what Vercel needs)
    │   ├── index.html
    │   ├── main-ABC123.js
    │   └── styles-XYZ789.css
    └── server/           ← Server-side (not used for SPA)
```

### SPA Routing Pattern
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```
This means:
- `/` → `index.html` ✅
- `/dashboard` → `index.html` ✅ (Angular router handles it)
- `/login` → `index.html` ✅
- `/settings` → `index.html` ✅
- Any route → `index.html` ✅

Angular's router then reads the URL and displays the correct component.

---

## 🚨 Common Issues & Fixes

### Issue 1: Still Getting 404 After Deploy
**Solution:**
1. Clear Vercel build cache (redeploy without cache)
2. Check Vercel build logs for errors
3. Verify `dist/word-tracker/browser/index.html` exists in build output

### Issue 2: Assets Not Loading (404 on CSS/JS)
**Solution:**
- Ensure `angular.json` has correct `outputPath`
- Check browser DevTools → Network tab for failed requests
- Verify asset paths don't have double slashes (`//`)

### Issue 3: API Calls Failing
**Solution:**
- This fix only handles frontend routing
- Ensure `environment.prod.ts` has correct backend URL
- Backend should be deployed separately (Railway, etc.)

### Issue 4: Build Fails on Vercel
**Solution:**
```bash
# Test build locally first
cd frontend
npm install
npm run build

# Check if dist/word-tracker/browser exists
ls dist/word-tracker/browser
```

---

## 📊 Final Deployment Checklist

### Pre-Deployment
- [x] `vercel.json` created with correct `outputDirectory`
- [x] `vercel.json` has SPA rewrites configured
- [x] `angular.json` uses `application` builder
- [x] Local build succeeds (`npm run build`)
- [x] `dist/word-tracker/browser/index.html` exists after build

### Post-Deployment
- [ ] Root URL loads without 404
- [ ] Direct route access works (e.g., `/dashboard`)
- [ ] Page refresh doesn't break routing
- [ ] Browser back/forward buttons work
- [ ] Assets (CSS, JS, images) load correctly
- [ ] API calls reach backend (if applicable)
- [ ] No console errors in browser DevTools

---

## 🎓 Key Takeaways

1. **Angular 17+ Output Structure Changed**
   - Old: `dist/word-tracker/index.html`
   - New: `dist/word-tracker/browser/index.html`

2. **SPA Routing Requires Rewrites**
   - All routes must serve `index.html`
   - Angular handles client-side routing

3. **Vercel Configuration Priority**
   - `vercel.json` settings override dashboard settings
   - Always commit `vercel.json` to version control

4. **Cache Optimization**
   - Static assets (JS, CSS) should have long cache times
   - `index.html` should NOT be cached (always fresh)

---

## 📞 Support

If issues persist:
1. Check Vercel build logs: `Deployments → [Latest] → Building`
2. Check browser console: `F12 → Console`
3. Verify backend is running (if using external API)

**Deployment Status:** ✅ Ready for production
