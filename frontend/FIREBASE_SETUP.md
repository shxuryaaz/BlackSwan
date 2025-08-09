# Firebase Setup Guide for BlackSwan

This guide will help you set up Firebase for BlackSwan so that customer data can be properly saved and retrieved.

## Prerequisites

1. A Google account
2. Access to Firebase Console

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **Create a project** or **Add project**
3. Enter a project name (e.g., "blackswan")
4. Choose whether to enable Google Analytics (optional)
5. Click **Create project**

## Step 2: Enable Authentication

1. In your Firebase project, click **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Optionally enable **Google** authentication (see GOOGLE_AUTH_SETUP.md)
6. Click **Save**

## Step 3: Set up Firestore Database

1. In your Firebase project, click **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click **Done**

## Step 4: Get Firebase Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "BlackSwan Web")
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## Step 5: Configure Environment Variables

1. In the `frontend` directory, copy the `.env.example` file to `.env`:
   ```bash
   cp env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Other configurations...
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here
VITE_RESEND_API_KEY=re_your_resend_api_key_here
VITE_FROM_EMAIL=noreply@yourdomain.com
VITE_TWILIO_ACCOUNT_SID=AC_your_twilio_account_sid_here
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
VITE_TWILIO_PHONE_NUMBER=+1234567890
VITE_APP_NAME=BlackSwan
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

## Step 6: Set up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /customers/{customerId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /api_settings/{settingId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
  }
}
```

3. Click **Publish**

## Step 7: Test the Setup

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the application
3. Try to sign up or sign in
4. Import some customers
5. Check if the customers appear in the list

## Troubleshooting

### Common Issues

1. **"Firebase not configured" error**
   - Make sure you've created the `.env` file
   - Verify all Firebase environment variables are set correctly
   - Restart the development server after changing environment variables

2. **"Permission denied" errors**
   - Check your Firestore security rules
   - Make sure you're signed in to the application
   - Verify the user ID matches the data owner

3. **"Network error" or "Connection failed"**
   - Check your internet connection
   - Verify your Firebase project is active
   - Check if your Firebase project has billing enabled (if needed)

4. **Customers not appearing after import**
   - Check the browser console for errors
   - Verify the import completed successfully
   - Check if the user is properly authenticated
   - Look for any Firebase permission errors

### Debugging

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for any error messages
   - Check the Network tab for failed requests

2. **Check Firebase Console**
   - Go to Firestore Database to see if data is being saved
   - Check Authentication to see if users are being created
   - Look at the Functions logs if you're using Cloud Functions

3. **Verify Environment Variables**
   - Make sure the `.env` file is in the correct location
   - Verify all variables start with `VITE_`
   - Check that there are no extra spaces or quotes

## Security Best Practices

1. **Never commit your `.env` file** to version control
2. **Use environment-specific configurations** for development and production
3. **Regularly review your Firestore security rules**
4. **Enable Firebase App Check** for additional security
5. **Monitor your Firebase usage** to avoid unexpected charges

## Next Steps

Once Firebase is properly configured:

1. Set up Google Authentication (see `GOOGLE_AUTH_SETUP.md`)
2. Configure API integrations (OpenAI, Resend, Twilio)
3. Test all features thoroughly
4. Deploy to production with proper environment variables

---

**Note**: This setup is essential for the application to function properly. Without Firebase configuration, customer data cannot be saved or retrieved. 