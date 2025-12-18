# Quick Vercel Deployment from GitHub

## 🚀 Deploy Backend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub: `https://github.com/Gpar377/FC-Projects`
3. Configure:
   - **Root Directory**: `personal-finance-tracker/backend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

4. **Environment Variables**:
```
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<your-jwt-secret-key>
FRONTEND_URL=http://localhost:3000
```

5. Click **Deploy**
6. **Copy Backend URL**: `https://your-backend-xxx.vercel.app`

---

## 🎨 Deploy Frontend

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub: `https://github.com/Gpar377/FC-Projects`
3. Configure:
   - **Root Directory**: `personal-finance-tracker/frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Environment Variables**:
```
REACT_APP_API_URL=https://your-backend-xxx.vercel.app/api
```
(Replace with your actual backend URL from step 1)

5. Click **Deploy**
6. **Copy Frontend URL**: `https://your-frontend-xxx.vercel.app`

---

## 🔄 Update Backend CORS

1. Go to your backend project in Vercel
2. Settings → Environment Variables
3. Edit `FRONTEND_URL`:
```
FRONTEND_URL=https://your-frontend-xxx.vercel.app
```
(Replace with your actual frontend URL)

4. Redeploy backend (Deployments → ... → Redeploy)

---

## ✅ Test Your App

Visit: `https://your-frontend-xxx.vercel.app`

- Register new account
- Add transactions
- Create budgets
- Test all features

---

## 📝 Quick Reference

**Backend URL**: `https://your-backend-xxx.vercel.app`
**Frontend URL**: `https://your-frontend-xxx.vercel.app`
**GitHub Repo**: `https://github.com/Gpar377/FC-Projects`

---

## 🐛 If Something Breaks

### CORS Error
- Check `FRONTEND_URL` in backend env matches exactly
- Redeploy backend after changing env vars

### API Not Found
- Verify `REACT_APP_API_URL` in frontend env
- Should end with `/api`
- Redeploy frontend after changing env vars

### MongoDB Connection Failed
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Verify connection string is correct
- Check database user permissions

---

## 🎉 Done!

Both apps should be live and working. Share your frontend URL! 🚀
