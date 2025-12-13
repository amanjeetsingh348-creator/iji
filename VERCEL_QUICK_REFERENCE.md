# ⚡ Quick Vercel Settings Reference

## 🎯 Correct Configuration

### For Vercel Dashboard (if not using vercel.json)
```
Root Directory:     frontend
Build Command:      npm run build
Output Directory:   dist/word-tracker/browser
Install Command:    npm install
Node Version:       18.x or higher
```

### For vercel.json (Recommended - Already Applied ✅)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/word-tracker/browser"
}
```

---

## 🚀 Deploy Now

```bash
# 1. Commit the fix
git add frontend/vercel.json
git commit -m "fix: configure Vercel for Angular 17 SPA"
git push origin main

# 2. Vercel auto-deploys from GitHub
# 3. Wait ~2 minutes
# 4. Test: https://your-app.vercel.app
```

---

## ✅ Success Indicators

After deployment, verify:
- ✅ Root loads: `https://your-app.vercel.app/`
- ✅ Routes work: `https://your-app.vercel.app/dashboard`
- ✅ Refresh works: Press F5 on any page → No 404
- ✅ Direct access: Paste URL directly → Loads correctly

---

## 🔧 If Still 404

### Quick Fix
1. Go to Vercel → Deployments
2. Click ⋯ → Redeploy
3. **Uncheck** "Use existing Build Cache"
4. Click Redeploy

### Verify Build Output
Check Vercel build logs for:
```
✓ Building...
✓ Compiled successfully
✓ Output: dist/word-tracker/browser
```

---

## 📁 Expected Build Structure

```
dist/
└── word-tracker/
    └── browser/          ← Vercel serves from here
        ├── index.html    ← Must exist
        ├── main.js
        ├── styles.css
        └── assets/
```

**Critical:** `index.html` MUST be in `dist/word-tracker/browser/`

---

## 🎯 Why It Was Failing

| Issue | Cause | Fix |
|-------|-------|-----|
| 404 on root | Wrong output dir | Set to `dist/word-tracker/browser` |
| 404 on refresh | No SPA rewrites | Added `rewrites` in vercel.json |
| 404 on direct URL | Same as above | Rewrite all routes to index.html |

---

## 💡 Pro Tips

1. **Always use vercel.json** - More reliable than dashboard settings
2. **Clear cache on redeploy** - Ensures fresh build
3. **Test locally first** - Run `npm run build` before pushing
4. **Check build logs** - First place to look for errors

---

**Status:** ✅ Configuration Applied  
**Next Step:** Push to GitHub and verify deployment
