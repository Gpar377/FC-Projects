# Deployment Guide - Personal Finance Tracker

## 🚀 Deploy to Vercel

### Backend Deployment

1. **Push to GitHub** (if not already done)
```bash
cd backend
git init
git add .
git commit -m "Backend ready for deployment"
git remote add origin https://github.com/Gpar377/finance-tracker-backend.git
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your backend repository
   - Configure:
     - Framework Preset: **Other**
     - Root Directory: `./` (or leave blank)
     - Build Command: (leave empty)
     - Output Directory: (leave empty)

3. **Add Environment Variables** in Vercel Dashboard:
```
MONGODB_URI=mongodb+srv://gopaparthiv_db_user:Gparthiv@cluster0.vaxcizd.mongodb.net/finance-tracker?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-finance-2024
FRONTEND_URL=https://your-frontend-url.vercel.app
```

4. **Deploy** - Click "Deploy"
   - Copy your backend URL: `https://your-backend.vercel.app`

### Frontend Deployment

1. **Update Environment Variables**
   - Edit `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

2. **Push to GitHub**
```bash
cd frontend
git init
git add .
git commit -m "Frontend ready for deployment"
git remote add origin https://github.com/Gpar377/finance-tracker-frontend.git
git push -u origin main
```

3. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your frontend repository
   - Configure:
     - Framework Preset: **Create React App**
     - Root Directory: `./` (or leave blank)
     - Build Command: `npm run build`
     - Output Directory: `build`

4. **Add Environment Variables** in Vercel Dashboard:
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

5. **Deploy** - Click "Deploy"

### Update Backend CORS

After frontend is deployed, update backend environment variable:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

Redeploy backend for changes to take effect.

## 🔧 Alternative: Deploy Both from Monorepo

If you want to deploy from the same repository:

### Backend
- Root Directory: `personal-finance-tracker/backend`
- Environment Variables: Same as above

### Frontend
- Root Directory: `personal-finance-tracker/frontend`
- Environment Variables: Same as above

## 📝 Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] MongoDB Atlas connection working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test login/register
- [ ] Test transaction CRUD
- [ ] Test budget features
- [ ] Test export functionality
- [ ] Test real-time updates (Socket.io)

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set in backend env
- Check Vercel logs for CORS issues
- Verify frontend URL matches exactly (no trailing slash)

### Socket.io Not Working
- Vercel has limitations with WebSockets
- Consider using Vercel's serverless functions
- Or deploy backend on Railway/Render for better WebSocket support

### MongoDB Connection Issues
- Verify MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Check connection string format
- Ensure database user has correct permissions

## 🌐 Alternative Hosting Options

### Backend
- **Railway**: Better WebSocket support
- **Render**: Free tier with persistent connections
- **Heroku**: Classic choice (paid)

### Frontend
- **Netlify**: Alternative to Vercel
- **GitHub Pages**: Free static hosting
- **Cloudflare Pages**: Fast CDN

## 📊 Production URLs

After deployment, update these in your documentation:
- Backend: `https://your-backend.vercel.app`
- Frontend: `https://your-frontend.vercel.app`
- API Docs: `https://your-backend.vercel.app/api`

## 🔐 Security Notes

- Never commit `.env` files
- Use strong JWT secrets
- Enable MongoDB Atlas IP whitelist
- Use HTTPS only in production
- Rotate secrets regularly
