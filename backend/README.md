# Backend - BlackSwan

This folder contains the backend infrastructure for BlackSwan, built with Supabase.

## Structure

```
backend/
├── supabase/
│   ├── config.toml          # Supabase configuration
│   ├── migrations/          # Database migrations
│   ├── client.ts           # Supabase client configuration
│   └── types.ts            # TypeScript types for database
└── sample_customers.csv    # Sample data for testing imports
```

## Database Schema

The application uses the following tables:

### Profiles
- User profile information
- Links to Supabase Auth users

### Customers
- Customer data imported from CSV/Excel
- Payment information and due dates
- Risk assessment and status tracking

### Reminders
- Payment reminder history
- Multi-channel communication tracking
- AI tone and message content

### API Settings
- Third-party service configurations
- API keys and integration settings

## Setup

1. **Supabase Project**: Create a new Supabase project
2. **Environment Variables**: Set up your Supabase URL and API keys
3. **Database**: Run the migrations to create the schema
4. **RLS Policies**: Row Level Security is enabled for data protection

## Migrations

The database migrations create:
- All necessary tables with proper relationships
- Row Level Security policies
- Indexes for performance optimization
- Triggers for automatic timestamp updates

## Sample Data

Use `sample_customers.csv` to test the import functionality. The file includes:
- Customer names and contact information
- Payment amounts and due dates
- Company information and notes

## API Integration

The backend supports integration with:
- OpenAI (for AI-powered messages)
- Resend (for email delivery)
- Twilio (for WhatsApp and voice calls)

## Security

- Row Level Security (RLS) ensures users can only access their own data
- API keys are stored securely in the database
- All database operations are properly authenticated 