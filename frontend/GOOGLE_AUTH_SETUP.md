# Google Authentication Setup Guide

This guide will help you set up Google authentication for BlackSwan using Firebase.

## Prerequisites

1. A Firebase project
2. Firebase Authentication enabled
3. Google Cloud Console access

## Step 1: Enable Google Authentication in Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** in the left sidebar
4. Click on the **Sign-in method** tab
5. Find **Google** in the list of providers and click on it
6. Click the **Enable** toggle to turn on Google authentication
7. Add your **Project support email** (this will be shown to users)
8. Click **Save**

## Step 2: Configure OAuth Consent Screen (Google Cloud Console)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** user type (unless you have a Google Workspace organization)
5. Fill in the required information:
   - **App name**: BlackSwan
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
6. Click **Save and Continue**
7. On the **Scopes** page, click **Save and Continue**
8. On the **Test users** page, add your email address as a test user
9. Click **Save and Continue**
10. Review the summary and click **Back to Dashboard**

## Step 3: Configure Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings**
2. Scroll down to **Authorized domains**
3. Add your domain(s):
   - For development: `localhost`
   - For production: Your actual domain (e.g., `yourdomain.com`)
4. Click **Add**

## Step 4: Update Environment Variables

1. Copy the `.env.example` file to `.env` in the frontend directory
2. Fill in your Firebase configuration values:
   ```env
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Step 5: Test Google Authentication

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Click the **Continue with Google** button
4. You should be redirected to Google's OAuth consent screen
5. Sign in with your Google account
6. You should be redirected back to the app and signed in

## Troubleshooting

### Common Issues

1. **"popup_closed_by_user" error**
   - Make sure pop-ups are enabled in your browser
   - Check that your domain is in the authorized domains list

2. **"unauthorized_domain" error**
   - Add your domain to the authorized domains in Firebase Console
   - For localhost development, make sure `localhost` is added

3. **"access_denied" error**
   - Check that Google authentication is enabled in Firebase
   - Verify your OAuth consent screen configuration

4. **"invalid_client" error**
   - Check your Firebase configuration values
   - Ensure your project ID matches between Firebase and environment variables

### Testing in Production

1. Add your production domain to authorized domains
2. Update your OAuth consent screen to include production scopes
3. Test with a non-test user account
4. Consider publishing your OAuth consent screen for public use

## Security Considerations

1. **Authorized Domains**: Only add domains you control
2. **OAuth Consent Screen**: Keep the scope minimal and only request necessary permissions
3. **Environment Variables**: Never commit your `.env` file to version control
4. **Firebase Rules**: Configure proper security rules for your Firestore database

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Identity Platform](https://developers.google.com/identity)
- [OAuth 2.0 Best Practices](https://developers.google.com/identity/protocols/oauth2)

---

**Note**: This setup is required for Google authentication to work. Without proper configuration, users will see authentication errors when trying to sign in with Google. 