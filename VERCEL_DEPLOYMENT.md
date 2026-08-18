# Vercel Deployment Guide

## 🚀 Deploy Your Portfolio on Vercel

Your portfolio is now ready to deploy on Vercel. Follow these steps:

### Option 1: Quick Deploy (Recommended)
1. Go to: **https://vercel.com**
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Choose `chetan929/portfolio` from your GitHub
5. Click **"Import"**
6. Vercel will auto-detect Django settings
7. Click **"Deploy"**

### Option 2: Deploy with Vercel CLI
```bash
npm i -g vercel
cd d:\My Portfolio
vercel --prod
```

## ⚙️ Set Environment Variables on Vercel

After importing your project:

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:

```
SECRET_KEY = your-secret-key-here
DEBUG = False
ALLOWED_HOSTS = your-project.vercel.app
EMAIL_HOST_PASSWORD = sljd rmsw rayk scyp
DATABASE_URL = postgresql://...  (if using external database)
```

## ⚠️ Important Notes

### Database Issue on Vercel
Vercel is **serverless** - your SQLite database (`db.sqlite3`) will be reset on each deployment.

**Solutions:**
1. **Use External Database (Recommended)**
   - PostgreSQL on Railway/Render/Neon
   - Update `requirements.txt` to include `psycopg2-binary`
   - Update `DATABASES` in `settings.py` to use `DATABASE_URL`

2. **Keep SQLite (Messages will be lost)**
   - Submissions still work but won't persist
   - Email functionality still works

### Email Setup for Production
Make sure your Gmail App Password is saved in Vercel environment variables:
- Variable Name: `EMAIL_HOST_PASSWORD`
- Value: `sljd rmsw rayk scyp`

## 📊 Testing After Deployment

1. Visit your Vercel deployment URL
2. Fill out the contact form
3. Check your Gmail inbox for the message
4. Note: Form data won't persist if using SQLite

## 🔄 Using External Database (PostgreSQL)

### Step 1: Create Database
Go to **Railway.app** or **Render.com** and create a PostgreSQL database

### Step 2: Update requirements.txt
Add:
```
psycopg2-binary==2.9.9
python-decouple==3.8
```

### Step 3: Update settings.py
```python
import dj_database_url

# Use DATABASE_URL from environment
DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600
    )
}
```

### Step 4: Add Vercel Environment Variable
In Vercel dashboard, add:
- `DATABASE_URL`: Your PostgreSQL connection string from Railway/Render

### Step 5: Run migrations on Vercel
```bash
vercel env pull
python manage.py migrate
vercel deploy --prod
```

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Email service configured
- [ ] Test form submission works
- [ ] Check Gmail for test email

## 🆘 Troubleshooting

**502 Bad Gateway**
- Check logs: `vercel logs https://your-project.vercel.app`
- Ensure all dependencies are in `requirements.txt`

**Form submissions not working**
- Verify environment variables are set
- Check CORS settings in `config/settings.py`
- Review Vercel function logs

**Emails not sending**
- Verify `EMAIL_HOST_PASSWORD` is correct in environment variables
- Ensure 2FA is enabled on your Gmail account
- Check spam folder

## 📱 Your Deployed URLs

After deployment:
- **Main Site**: `https://your-project.vercel.app`
- **Admin Panel**: `https://your-project.vercel.app/admin`
- **API Endpoint**: `https://your-project.vercel.app/api/send-message/`

---

**Need help? Check Vercel docs:** https://vercel.com/docs
