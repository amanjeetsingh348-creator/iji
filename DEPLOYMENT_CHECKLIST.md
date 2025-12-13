# 🚀 Railway Deployment - Quick Start Checklist

## ✅ Pre-Deployment (COMPLETED)
- [x] Code pushed to GitHub
- [x] Database configuration updated for Railway
- [x] CORS configuration updated for production
- [x] Complete schema.sql created
- [x] Railway configuration files created
- [x] Frontend environment files configured
- [x] Vercel configuration added

## 📋 Deployment Steps

### STEP 1: Deploy Backend to Railway (15 minutes)

1. **Go to Railway**: https://railway.app/new
   
2. **Create New Project**:
   - Click "Deploy from GitHub repo"
   - Select `ankitverma3490/word-tracker`
   - Click "Deploy Now"

3. **Add MySQL Database**:
   - In your project, click "+ New"
   - Select "Database" → "MySQL"
   - Railway will automatically create environment variables

4. **Configure Backend Service**:
   - Click "+ New" → "GitHub Repo"
   - Select `ankitverma3490/word-tracker` again
   - **IMPORTANT**: Set Root Directory to `backend-php`
   - Click "Deploy"

5. **Get Backend URL**:
   - Go to backend service → "Settings" → "Domains"
   - Click "Generate Domain"
   - Copy the URL (e.g., `word-tracker-backend-production.up.railway.app`)
   - **SAVE THIS URL** - you'll need it!

6. **Initialize Database**:
   - Visit: `https://YOUR-BACKEND-URL/init_railway_db.php`
   - You should see: `{"status":"success","message":"Database initialization completed."}`
   - Verify tables were created

7. **Test Backend**:
   - Visit: `https://YOUR-BACKEND-URL/api/ping.php`
   - Should return: `{"status":"ok","message":"Backend is reachable"}`

### STEP 2: Deploy Frontend (Choose ONE Option)

#### Option A: Deploy to Vercel (RECOMMENDED - Easier for Angular)

1. **Go to Vercel**: https://vercel.com/new
   
2. **Import Repository**:
   - Click "Import Git Repository"
   - Select `ankitverma3490/word-tracker`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Angular
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/word-tracker/browser`

4. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add: `BACKEND_URL` = `https://YOUR-BACKEND-URL` (from Step 1.5)

5. **Update environment.prod.ts**:
   ```bash
   # Edit frontend/src/environments/environment.prod.ts
   # Replace YOUR_BACKEND_URL with actual Railway backend URL
   ```

6. **Commit and Push**:
   ```bash
   git add frontend/src/environments/environment.prod.ts
   git commit -m "Update production backend URL"
   git push
   ```

7. **Deploy**:
   - Vercel will auto-deploy
   - Get your frontend URL (e.g., `word-tracker.vercel.app`)

#### Option B: Deploy to Railway

1. **Create Frontend Service**:
   - In Railway project, click "+ New" → "GitHub Repo"
   - Select `ankitverma3490/word-tracker` again
   - **Root Directory**: Leave EMPTY (root)
   - Add environment variable: `NODE_VERSION` = `18`

2. **Update environment.prod.ts** (same as Option A, step 5-6)

3. **Deploy**:
   - Railway will auto-deploy
   - Generate domain in Settings → Domains

### STEP 3: Update CORS

1. **Edit backend-php/config/cors.php**:
   ```php
   $allowedOrigins = [
       'http://localhost:4200',
       'http://localhost',
       'https://YOUR-VERCEL-URL.vercel.app', // Add your actual Vercel URL
       // OR
       'https://YOUR-RAILWAY-FRONTEND.railway.app' // Add your Railway frontend URL
   ];
   ```

2. **Commit and Push**:
   ```bash
   git add backend-php/config/cors.php
   git commit -m "Update CORS for production frontend"
   git push
   ```

3. **Railway will auto-redeploy** the backend

### STEP 4: Final Testing

Test these features on your deployed app:

- [ ] Register new account
- [ ] Login with credentials
- [ ] Create a new plan
- [ ] View plan details
- [ ] Create checklist
- [ ] Mark checklist items
- [ ] View statistics
- [ ] Create challenge
- [ ] Join challenge
- [ ] Log progress

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Database connection error
- **Solution**: Check Railway MySQL environment variables are set
- Visit: `https://YOUR-BACKEND-URL/test_db_connection.php`

**Problem**: 500 Internal Server Error
- **Solution**: Check Railway deployment logs
- Go to: Backend Service → Deployments → Latest → View Logs

**Problem**: CORS errors
- **Solution**: Update `backend-php/config/cors.php` with frontend URL
- Ensure origin is in `$allowedOrigins` array

### Frontend Issues

**Problem**: "Connection error" message
- **Solution**: Verify `environment.prod.ts` has correct backend URL
- Check browser console for actual error

**Problem**: Build fails on Vercel/Railway
- **Solution**: Check build logs
- Verify Node.js version is 18+
- Ensure all dependencies in package.json

**Problem**: 404 on page refresh
- **Solution**: Vercel should handle this automatically
- For Railway, ensure `serve` is configured correctly

## 📊 Deployment URLs

Fill in after deployment:

- **Backend URL**: `https://_____________________________.railway.app`
- **Frontend URL**: `https://_____________________________.vercel.app`
- **MySQL Host**: (in Railway environment variables)

## 💰 Cost Estimate

- **Railway**: $5/month (Backend + MySQL)
- **Vercel**: FREE (Hobby tier)
- **Total**: ~$5/month

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Backend health check returns OK
- ✅ Database has all tables
- ✅ Frontend loads without errors
- ✅ Login/Register works
- ✅ Can create and view plans
- ✅ No CORS errors in browser console

## 📞 Need Help?

1. Check Railway deployment logs
2. Check browser console (F12)
3. Test backend endpoints directly
4. Review `RAILWAY_DEPLOYMENT.md` for detailed info

---

**Last Updated**: 2025-12-14
**Status**: Ready for Deployment ✅
