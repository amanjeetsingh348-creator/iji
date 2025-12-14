# Word Tracker - Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository with your code
- Git installed locally

## Step 1: Push Code to GitHub

1. Initialize git (if not already done):
```bash
cd d:\00.1\word-tracker-main\word-tracker-main
git init
git add .
git commit -m "Prepare for Railway deployment"
```

2. Add your GitHub repository:
```bash
git remote add origin https://github.com/amanjeetsingh348-creator/word-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Railway

### 2.1 Create New Project
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your `word-tracker` repository
4. Click "Add variables" and configure:

### 2.2 Add MySQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "MySQL"
3. Railway will automatically create these environment variables:
   - `MYSQLHOST`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLPORT`

### 2.3 Configure Backend Service
1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Set **Root Directory**: Leave empty (root)
4. Railway will auto-detect PHP and use the `nixpacks.toml` configuration
5. Click "Deploy"

### 2.4 Setup Database Schema
1. Once backend is deployed, get the backend URL (e.g., `https://your-backend.railway.app`)
2. Visit: `https://your-backend.railway.app/init_railway_db.php`
3. This will create all necessary database tables

### 2.5 Get Backend URL
1. Go to your backend service in Railway
2. Click "Settings" → "Domains"
3. Copy the generated domain (e.g., `word-tracker-backend-production.up.railway.app`)
4. **Save this URL** - you'll need it for frontend configuration

## Step 3: Deploy Frontend to Railway

### 3.1 Update Frontend Environment
1. Edit `frontend/src/environments/environment.prod.ts`
2. Replace `YOUR_BACKEND_URL` with your actual Railway backend URL:
```typescript
export const environment = {
    production: true,
    apiUrl: 'https://word-tracker-backend-production.up.railway.app'
};
```

3. Commit and push:
```bash
git add frontend/src/environments/environment.prod.ts
git commit -m "Update production API URL"
git push
```

### 3.2 Create Frontend Service
1. In Railway project, click "+ New" → "GitHub Repo"
2. Select your repository again
3. Set **Root Directory**: `frontend`
4. Add these environment variables:
   - `NODE_VERSION`: `18`
5. Click "Deploy"

### 3.3 Configure Build Settings
Railway will automatically:
- Install dependencies in `frontend/`
- Run `npm run build`
- Serve the static files

### 3.4 Get Frontend URL
1. Go to your frontend service
2. Click "Settings" → "Domains"
3. Copy the generated domain
4. Visit it to see your deployed app!

## Step 4: Update CORS Settings

1. Edit `backend-php/api/` files to allow your frontend domain
2. Update CORS headers in all API files to include your Railway frontend URL

## Alternative: Deploy Frontend to Vercel (Recommended for Angular)

Vercel offers better Angular support and is free:

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Angular
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/word-tracker/browser`
4. Add environment variable:
   - `BACKEND_URL`: Your Railway backend URL
5. Update `environment.prod.ts` before deploying
6. Click "Deploy"

## Verification Checklist

- [ ] Backend deployed successfully on Railway
- [ ] MySQL database created and connected
- [ ] Database schema initialized (`init_railway_db.php` executed)
- [ ] Backend health check working (`/api/ping.php`)
- [ ] Frontend deployed (Railway or Vercel)
- [ ] Frontend environment configured with correct backend URL
- [ ] CORS headers updated in backend
- [ ] Login/Register working
- [ ] All API endpoints responding correctly

## Troubleshooting

### Backend Issues
- Check Railway logs: Click on backend service → "Deployments" → Latest deployment → "View Logs"
- Test health check: Visit `https://your-backend.railway.app/api/ping.php`
- Verify database connection: Check environment variables are set

### Frontend Issues
- Check build logs in Railway/Vercel
- Verify `environment.prod.ts` has correct backend URL
- Check browser console for CORS errors
- Ensure backend CORS headers include frontend domain

### Database Issues
- Verify MySQL service is running in Railway
- Check database credentials in environment variables
- Run `init_railway_db.php` to ensure tables exist

## Post-Deployment

1. **Update CORS**: Add your frontend domain to backend CORS whitelist
2. **Test all features**: Login, Register, Create Plans, etc.
3. **Monitor**: Check Railway logs regularly
4. **Backup**: Railway provides automatic backups for databases

## Cost Estimate

- Railway: $5/month (includes backend + database)
- Vercel: Free tier (sufficient for most apps)

## Support

If you encounter issues:
1. Check Railway logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors
