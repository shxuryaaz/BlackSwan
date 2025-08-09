# BlackSwan - Smart Payment Reminder Agent

A comprehensive payment collection automation platform built with React, TypeScript, and Supabase. BlackSwan helps finance teams automate payment reminders through AI-powered multi-channel communication.

## 🏗️ Project Structure

```
clever-pay-buddy/
├── frontend/               # React application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Backend infrastructure
│   ├── supabase/          # Supabase configuration
│   └── sample_customers.csv # Sample data
└── README.md              # This file
```

## 🚀 Features

### ✅ **Authentication & Security**
- Supabase-based authentication
- Protected routes and session management
- Row Level Security (RLS) for data protection

### ✅ **Customer Management**
- **CSV/Excel Import**: Drag & drop file upload with validation
- **Real-time Data**: Live customer statistics and tracking
- **Payment Tracking**: Monitor outstanding amounts and due dates
- **Risk Assessment**: Automated risk scoring for customers

### ✅ **Payment Reminders**
- **Multi-channel Communication**: Email, WhatsApp, and Voice calls
- **AI-Powered Messages**: Intelligent tone adjustment
- **Reminder History**: Track delivery status and responses
- **Smart Scheduling**: Optimized sending times

### ✅ **Dashboard & Analytics**
- **Real-time Statistics**: Live payment and customer metrics
- **AI Insights**: Smart recommendations for collections
- **Activity Tracking**: Recent reminder history
- **Upcoming Due Dates**: Payment schedule overview

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **React Query** for data fetching
- **xlsx & papaparse** for file parsing

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

## 🎨 Design

- **Modern UI**: Clean, professional interface
- **Black Swan Logo**: Elegant branding with red accent
- **Responsive Design**: Works on all devices
- **Accessible**: WCAG compliant components

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd clever-pay-buddy
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**:
   Create `.env` file in the frontend directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**:
   - Create a new Supabase project
   - Run the migrations from `backend/supabase/migrations/`
   - Configure Row Level Security policies

5. **Start the development server**:
   ```bash
   cd frontend
   npm run dev
   ```

## 🗄️ Database Schema

### Tables
- **profiles**: User profile information
- **customers**: Customer data and payment information
- **reminders**: Payment reminder history and tracking
- **api_settings**: Third-party service configurations

### Key Features
- **Automatic timestamps** for all records
- **Foreign key relationships** for data integrity
- **Indexes** for optimal performance
- **RLS policies** for security

## 📊 Sample Data

Use the provided `backend/sample_customers.csv` to test the import functionality:

```csv
name,email,phone,company,amount_due,due_date,notes
Acme Corp Ltd,billing@acmecorp.com,+1-555-0123,Acme Corporation,15000.00,2024-02-15,High priority customer
Tech Solutions Inc,accounts@techsolutions.com,+1-555-0124,Tech Solutions,8500.50,2024-02-20,Regular customer
```

## 🔧 Configuration

### API Integrations
The platform supports integration with:
- **OpenAI**: AI-powered message generation
- **Resend**: Email delivery service
- **Twilio**: WhatsApp and voice call services

### Customization
- **Message Templates**: Customizable reminder templates
- **AI Tones**: Professional, friendly, urgent, formal
- **Automation Rules**: Configurable reminder schedules
- **Company Branding**: Customizable logo and colors

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
```

### Backend Deployment
- Deploy Supabase migrations
- Configure environment variables
- Set up API integrations

## 📈 Performance

- **Fast Loading**: Vite-based build optimization
- **Real-time Updates**: Supabase real-time subscriptions
- **Efficient Queries**: Optimized database queries with indexes
- **Caching**: React Query for intelligent data caching

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security policies
- **Data Protection**: Encrypted API keys and sensitive data
- **Input Validation**: Comprehensive form validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation in `frontend/README.md` and `backend/README.md`
- Review the Supabase setup guide
- Open an issue for bugs or feature requests

---

**BlackSwan** - Transforming payment collection with AI-powered automation 🚀
