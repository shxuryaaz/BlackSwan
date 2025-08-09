# Email Setup Guide - CORS Fix

This guide explains how to fix the CORS error when sending emails via Resend API.

## Problem
The error `net::ERR_NAME_NOT_RESOLVED` and CORS policy blocking occurs because browsers don't allow direct API calls to external services from frontend applications.

## Solutions

### Option 1: Backend Server (Recommended)

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run dev
   ```

3. **Configure frontend:**
   Add to your `.env` file:
   ```env
   VITE_USE_BACKEND_SERVER=true
   ```

4. **Restart your frontend development server**

### Option 2: Vite Proxy (Development Only)

The Vite configuration already includes a proxy for development. This works automatically in development mode.

### Option 3: Supabase Edge Functions

1. **Deploy the Edge Function:**
   ```bash
   cd backend/supabase
   supabase functions deploy send-email
   ```

2. **Set environment variables in Supabase:**
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   ```

3. **Configure frontend with Supabase URL and anon key**

## Testing

1. Go to the Customers page
2. Click the email icon next to any customer
3. Check the browser console for success/error messages
4. Verify the email was sent via Resend dashboard

## Troubleshooting

### Backend Server Issues
- Make sure the server is running on port 3002
- Check that `VITE_USE_BACKEND_SERVER=true` is set
- Verify your Resend API key is correct

### Vite Proxy Issues
- Only works in development mode
- Check that the proxy configuration is correct in `vite.config.ts`

### General Issues
- Ensure your Resend API key is valid
- Check that the "from" email domain is verified in Resend
- Verify network connectivity

## Production Deployment

For production, use either:
1. **Backend Server**: Deploy the Express server to your hosting provider
2. **Supabase Edge Functions**: Deploy to Supabase for serverless email handling
3. **Custom Backend**: Integrate email sending into your existing backend

The backend server approach is recommended for simplicity and control. 