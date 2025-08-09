# 🚀 BlackSwan Setup Guide

Complete setup guide to get BlackSwan running with Firebase and all external services.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `blackswan`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. Click "Save"

### 3. Create Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users
4. Click "Done"

### 4. Set Up Security Rules

In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /customers/{customerId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /api_settings/{settingId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

### 5. Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name "BlackSwan Web"
5. Copy the config object

## 🔑 API Keys Setup

### 1. OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login
3. Go to "API Keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

### 2. Resend API Key

1. Go to [Resend](https://resend.com/)
2. Sign up for free account
3. Go to API Keys section
4. Click "Create API Key"
5. Copy the API key (starts with `re_`)

### 3. Twilio Credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for free account
3. Get your Account SID and Auth Token from the dashboard
4. Purchase a phone number for voice/SMS
5. Note down all three values

## ⚙️ Environment Configuration

### 1. Copy Environment Template

```bash
cd frontend
cp env.example .env
```

### 2. Fill in Your Values

Edit `.env` file with your actual values:

```env
# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your_openai_api_key_here

# Resend Configuration
VITE_RESEND_API_KEY=re_your_resend_api_key_here
VITE_FROM_EMAIL=noreply@yourdomain.com

# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=AC_your_twilio_account_sid_here
VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
VITE_TWILIO_PHONE_NUMBER=+1234567890

# Optional: App Configuration
VITE_APP_NAME=BlackSwan
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development
```

## 🚀 Installation & Running

### 1. Install Dependencies

```bash
# From project root
npm run install:all

# Or from frontend directory
cd frontend
npm install
```

### 2. Start Development Server

```bash
# From project root
npm run dev

# Or from frontend directory
cd frontend
npm run dev
```

### 3. Access Application

Open your browser and go to: `http://localhost:8080`

## 📊 Database Structure

The application automatically creates these collections in Firestore:

### Profiles Collection
```javascript
{
  user_id: "firebase_uid",
  full_name: "John Doe",
  email: "john@example.com",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Customers Collection
```javascript
{
  user_id: "firebase_uid",
  name: "Acme Corp",
  email: "billing@acmecorp.com",
  phone: "+1234567890",
  company: "Acme Corporation",
  amount_due: 15000.00,
  due_date: "2024-02-15",
  status: "pending", // pending, paid, overdue
  risk_level: "low", // low, medium, high
  notes: "High priority customer",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### Reminders Collection
```javascript
{
  user_id: "firebase_uid",
  customer_id: "customer_doc_id",
  type: "email", // email, whatsapp, voice
  status: "sent", // pending, sent, delivered, failed, responded
  message_content: "Payment reminder message...",
  ai_tone: "professional",
  channels: ["email", "whatsapp"],
  sent_at: "2024-01-01T00:00:00.000Z",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

### API Settings Collection
```javascript
{
  user_id: "firebase_uid",
  openai_api_key: "sk-...",
  resend_api_key: "re_...",
  from_email: "noreply@yourdomain.com",
  twilio_account_sid: "AC...",
  twilio_auth_token: "...",
  twilio_phone_number: "+1234567890",
  automation_enabled: true,
  default_ai_tone: "professional",
  reminder_schedule: "daily",
  escalation_rules: "Custom escalation rules...",
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Testing the Setup

### 1. Create Account
1. Go to the application
2. Click "Get Started"
3. Create a new account with email/password

### 2. Configure API Keys
1. Go to Settings page
2. Enter your API keys for OpenAI, Resend, and Twilio
3. Click "Save Settings"

### 3. Import Sample Data
1. Go to Customers page
2. Click "Import"
3. Use the sample CSV file from `backend/sample_customers.csv`

### 4. Test Reminders
1. Go to Customers page
2. Click the email/WhatsApp/voice icons next to a customer
3. Check that reminders are created and sent

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Authentication Error**
   - Check that Email/Password auth is enabled
   - Verify Firebase config in .env file

2. **Firestore Permission Denied**
   - Check Firestore security rules
   - Ensure user is authenticated

3. **API Key Errors**
   - Verify API keys are correct
   - Check API key permissions
   - Ensure billing is set up (for OpenAI)

4. **Import Not Working**
   - Check CSV format matches expected columns
   - Verify file encoding is UTF-8
   - Check browser console for errors

### Debug Mode

Enable debug logging by adding to `.env`:
```env
VITE_DEBUG=true
```

## 🚀 Production Deployment

### 1. Build for Production

```bash
cd frontend
npm run build
```

### 2. Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy
```

### 3. Update Firestore Rules for Production

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // More restrictive rules for production
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /customers/{customerId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /reminders/{reminderId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    match /api_settings/{settingId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify all API keys are correct
3. Ensure Firebase project is properly configured
4. Check Firestore security rules
5. Review the troubleshooting section above

## 🎉 You're Ready!

Once you've completed all steps:

1. ✅ Firebase project created and configured
2. ✅ API keys obtained and configured
3. ✅ Environment variables set
4. ✅ Application running locally
5. ✅ Test account created
6. ✅ Sample data imported
7. ✅ Reminders tested

Your BlackSwan application is now fully functional! 🚀 