# Frontend - BlackSwan

This folder contains the React frontend application for BlackSwan, built with Vite, TypeScript, and Tailwind CSS.

## Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── customers/      # Customer management components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Base UI components (shadcn/ui)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   └── assets/             # Static assets
├── public/                 # Public assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Features

### Authentication
- Supabase authentication integration
- Login and signup forms
- Protected routes
- Session management

### Customer Management
- CSV/Excel import functionality
- Customer data visualization
- Payment tracking
- Risk assessment

### Dashboard
- Real-time statistics
- Recent activity tracking
- AI-powered insights
- Payment reminder overview

### Reminders
- Multi-channel communication (Email, WhatsApp, Voice)
- Reminder history and tracking
- AI tone customization
- Delivery status monitoring

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Supabase** - Backend as a Service

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Component Architecture

### UI Components (shadcn/ui)
- Button, Input, Card, etc.
- Consistent design system
- Accessible and customizable

### Custom Components
- **Logo**: Black swan design with BlackSwan branding
- **ImportCustomers**: CSV/Excel import with validation
- **StatsCard**: Dashboard statistics display
- **RecentActivity**: Activity timeline component

### Pages
- **Index**: Landing page with features overview
- **Auth**: Authentication forms
- **Dashboard**: Main application dashboard
- **Customers**: Customer management interface
- **Reminders**: Reminder history and management
- **Settings**: Application configuration

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom CSS variables** for theming
- **Responsive design** for all screen sizes
- **Dark mode support** (configurable)

## State Management

- **React Query** for server state
- **React Context** for authentication state
- **Local state** with useState for component-specific data

## API Integration

The frontend integrates with:
- **Supabase** for authentication and database
- **CSV/Excel parsing** for data import
- **Toast notifications** for user feedback
- **Form validation** with proper error handling 