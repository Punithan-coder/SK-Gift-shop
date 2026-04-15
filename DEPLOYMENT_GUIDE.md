# SK Gift Shop - Deployment Guide

This guide will help you deploy the SK Gift Shop application to make it accessible to users worldwide.

## Recommended Hosting Platform: Railway

Railway is an excellent choice for hosting full-stack applications like this one. It supports both React frontend and Flask backend deployment.

### Steps to Deploy:

1. **Create a Railway Account**
   - Go to [railway.app](https://railway.app) and sign up

2. **Connect Your GitHub Repository**
   - Link your GitHub account to Railway
   - Select this repository: `SK-Gift-shop`

3. **Deploy the Backend**
   - Railway will automatically detect the Python backend
   - It will use the `Procfile` and `requirements.txt`
   - Set environment variables in Railway dashboard:
     - `FLASK_ENV=production`
     - `SECRET_KEY=your-secret-key-here`
     - `DATABASE_URL=postgresql://...` (Railway provides this automatically)
     - Any other env vars from your `.env` file

4. **Deploy the Frontend**
   - Create a new service in Railway for the frontend
   - Set the build command: `npm run build`
   - Set the start command: `npx serve -s build -l $PORT`
   - Set environment variable: `REACT_APP_API_URL=https://your-backend-service-url.up.railway.app`

5. **Database Setup**
   - Railway provides PostgreSQL automatically
   - The app will create tables on first run
   - You can seed data using the `seed_products.py` script

6. **Custom Domain (Optional)**
   - In Railway dashboard, add your custom domain
   - Update DNS settings as instructed

## Alternative: Vercel + Railway

- **Frontend**: Deploy to Vercel (free tier available)
  - Connect GitHub repo
  - Set build settings: Build Command `npm run build`, Output Directory `build`
  - Set environment variable: `REACT_APP_API_URL=https://your-railway-backend-url`
- **Backend**: Deploy to Railway as above

## Environment Variables Needed

### Backend (.env):
```
FLASK_ENV=production
SECRET_KEY=your-very-secure-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
TWILIO_ACCOUNT_SID=your-twilio-sid (if using SMS)
TWILIO_AUTH_TOKEN=your-twilio-token
```

### Frontend:
```
REACT_APP_API_URL=https://your-backend-url
```

## Testing the Deployment

1. Visit your deployed frontend URL
2. Try registering/logging in
3. Add items to cart and checkout
4. Check that all features work

## Cost Estimate

- **Railway**: Free tier includes 512MB RAM, 1GB disk, enough for small applications
- **Vercel**: Free tier for frontend
- For production use, expect $5-10/month depending on traffic

## Troubleshooting

- **CORS Issues**: Make sure backend allows the frontend domain
- **API Calls Failing**: Check REACT_APP_API_URL is set correctly
- **Database Connection**: Ensure DATABASE_URL is properly set
- **Build Failures**: Check logs in Railway/Vercel dashboard

## Support

If you encounter issues, check the Railway documentation or contact their support.