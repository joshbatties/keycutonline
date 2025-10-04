# KeyCut Online

A full-stack key cutting and locksmith booking platform built with Next.js 15, Supabase, Stripe payments, and modern web technologies.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://keycut.online)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-black?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 🚀 Features

### ✅ Core Functionality (Phase 1)
- **Key Copy Orders** - Mail-in key cutting with photo upload
- **Locksmith Bookings** - On-site locksmith services
- **Payment Processing** - Stripe integration with webhooks
- **Order Tracking** - Real-time status updates
- **Admin Dashboard** - Complete order and booking management
- **Email Notifications** - Professional templates with Resend

### ✅ Enhanced Features (Phase 2)
- **Google Places Autocomplete** - Smart Australian address entry
- **Admin Bulk Operations** - Multi-select status updates and CSV export
- **User Order Cancellation** - Self-service cancellation before processing
- **Saved Addresses** - Address management with default selection
- **Supabase Storage** - Secure file storage with signed URLs

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui component library
- **Backend**: Next.js API routes, Supabase (PostgreSQL + Auth + Storage)
- **Payments**: Stripe Payment Intents with webhook handling
- **Email**: Resend API with professional HTML templates
- **Deployment**: Vercel with automatic deployments

## 📊 System Statistics

- **14 API Endpoints** - Complete REST API coverage
- **18 UI Components** - Comprehensive component library
- **5 Database Tables** - Fully normalized schema with RLS
- **6 Email Templates** - Professional notification system
- **4 External Integrations** - Supabase, Stripe, Google Places, Resend

## 🔒 Security

- **Row Level Security** - Comprehensive RLS policies on all tables
- **Private Storage** - Supabase Storage with signed URLs (7-day expiry)
- **Admin Access Control** - Domain-based permissions (@keycutonline.com)
- **Input Validation** - Zod schemas with detailed error messages
- **Guest Checkout** - Secure anonymous order creation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase project with database and storage configured
- Stripe account for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd keycutonline
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual credentials
   ```

4. **Run database migrations**
   ```bash
   # In your Supabase SQL Editor, run:
   \i scripts/000_setup_database.sql
   ```

5. **Set up Supabase Storage**
   ```sql
   -- Create storage bucket (run in Supabase SQL Editor)
   INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
   VALUES ('keycutonline', 'keycutonline', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
   ```

6. **Configure storage policies in Supabase Dashboard**
   - Go to Storage → keycutonline → Policies
   - Create policies for upload, download, and admin access

7. **Start development server**
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```
keycutonline/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (14 endpoints)
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin dashboard
│   └── ...                # Public pages
├── components/            # React components (18 components)
├── lib/                   # Utilities and configurations
├── scripts/               # Database setup scripts
├── docs/                  # Documentation
└── styles/                # Global styles
```

## 🎯 Production Ready

The platform is **production-ready** with:
- ✅ Complete order and booking workflows
- ✅ Secure payment processing
- ✅ Professional email notifications
- ✅ Admin management dashboard
- ✅ Enhanced user experience features
- ✅ Comprehensive security measures

## 📞 Support

For technical issues or feature requests, please contact the development team.

---

**Built with ❤️ using modern web technologies for the key cutting industry.**
