# Netlify Deployment Guide

## Build created successfully! 🎉

### Files included in ZIP:
- `dist/` - Production build files
- `netlify.toml` - Netlify configuration

### Deployment Instructions:

#### Option 1: Deploy via Netlify UI
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the extracted `admin_padmai_netlify.zip` file
4. Wait for deployment to complete

#### Option 2: Deploy via Netlify CLI
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Extract the ZIP file
3. Run: `netlify deploy --prod --dir=dist`
4. Follow the prompts to authenticate

### Build Configuration:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Redirects:** All routes redirect to `index.html` for SPA routing

### Environment Variables (if needed):
If your backend API URL needs to be configurable:
1. Go to Site settings → Environment variables
2. Add: `VITE_API_URL=https://your-backend-url.com`

### Update Backend URL:
If your backend is deployed on Vercel, update the API calls in your frontend to use the production URL instead of localhost.

### Current Backend Configuration:
- **Production Backend URL:** https://padmai-ft.vercel.app
- Backend runs on port 3000 locally
- Frontend is configured to use production backend by default

### Login Credentials (Hardcoded):
- Email: `admin@gmail.com`
- Password: `Test@1234`

