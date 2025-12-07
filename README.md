# Application Marketplace

An admin-driven application listing and lead generation system built with Next.js, React, and Supabase.

## Features

- **Public Marketplace**: Browse AI applications without login
- **App Details**: View screenshots, YouTube demos, code previews, and workflow guides
- **Lead Generation**: Users can sign in and submit interest requests
- **Admin Dashboard**: Create, update, and delete applications
- **Notifications**: Email (via Resend) and WhatsApp notifications for leads

## Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **UI Components**: shadcn/ui, Framer Motion
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `ADMIN_EMAIL` | Admin email for notifications |
| `ADMIN_WHATSAPP` | Admin WhatsApp number (+91...) |
| `RESEND_API_KEY` | Resend API key for emails |
| `WHATSAPP_WEBHOOK_URL` | Zapier/Make webhook for WhatsApp |

### Database Setup

Run the SQL migration in your Supabase SQL Editor:

```bash
# See: supabase/migration_leads.sql
```

## Deployment

This project is configured for Vercel deployment:

```bash
vercel --prod
```

## License

Private - All rights reserved
