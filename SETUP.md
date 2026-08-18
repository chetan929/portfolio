# Django Email Backend Setup Guide

Your portfolio now has a working Django backend that handles email sending!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Gmail (IMPORTANT)
You need to set up Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" (if not already enabled)
3. Search for "App passwords" 
4. Select "Mail" and "Windows Computer"
5. Google will generate a 16-character app password
6. Copy this password

### 3. Update Django Settings
Edit `config/settings.py` and replace:
```python
EMAIL_HOST_PASSWORD = 'your-app-password-here'  # Paste your 16-char password here
```

### 4. Initialize Database
```bash
python manage.py migrate
```

### 5. Run the Server
```bash
python manage.py runserver
```

Visit: `http://localhost:8000`

## 📧 How It Works

1. **User submits form** → Form data sent to `/api/send-message/`
2. **Backend validates** → Checks all fields are valid
3. **Saves to database** → Message stored in SQLite database
4. **Sends email** → Two emails:
   - To you (kumarchetan8566@gmail.com)
   - Confirmation email to the visitor

## 🔧 Admin Panel

View all messages you received:

```bash
python manage.py createsuperuser  # Create admin account
python manage.py runserver
```

Visit: `http://localhost:8000/admin`

Login with your superuser credentials to see all contact messages.

## 📁 Project Structure

```
My Portfolio/
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── config/               # Django configuration
│   ├── settings.py       # Main settings (update EMAIL_HOST_PASSWORD here)
│   ├── urls.py           # URL routing
│   └── wsgi.py           # WSGI config
├── contact/              # Contact app
│   ├── models.py         # ContactMessage model
│   ├── views.py          # API endpoint handler
│   ├── urls.py           # Contact app URLs
│   └── admin.py          # Admin interface
├── home.html             # Your portfolio
├── script.js             # Updated with backend API call
└── style.css             # Styling
```

## ⚙️ Environment Variables (Optional but Recommended)

For security, use environment variables instead of hardcoding:

```bash
pip install python-dotenv
```

Create `.env` file:
```
EMAIL_HOST_USER=kumarchetan8566@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
SECRET_KEY=your-random-secret-key
```

Update `config/settings.py`:
```python
from dotenv import load_dotenv
load_dotenv()

EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
```

## 🐛 Troubleshooting

**Error: "SMTP authentication failed"**
- Check your app password is correct (16 characters)
- Make sure 2-factor auth is enabled on Google Account

**Messages not appearing in database**
- Run: `python manage.py migrate`
- Check Django logs for errors

**Port 8000 already in use**
```bash
python manage.py runserver 8001  # Use different port
```

## 📝 Notes

- Form submissions are saved to database even if email fails
- All form data is validated before processing
- Emails require internet connection
- In production, use environment variables for sensitive data

---

**That's it! Your form emails are now working! 🎉**
