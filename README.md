# TutorBuddy - Online Tutoring Platform

TutorBuddy is a comprehensive online tutoring platform that connects students with expert tutors for personalized learning sessions.

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access (Student/Tutor)
  - JWT-based authentication

- **Tutor Features**
  - Profile management
  - Availability settings
  - Booking management
  - Earnings dashboard

- **Student Features**
  - Tutor search with filters
  - Session booking
  - Payment processing
  - Learning dashboard

- **Real-time Features**
  - Video sessions using Jitsi Meet
  - Instant messaging
  - Real-time notifications
  - Session reminders

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Video**: Jitsi Meet
- **Payments**: Stripe
- **Email**: SendGrid
- **Deployment**: Vercel

## Prerequisites

- Node.js 16.x or later
- MongoDB Atlas account
- Stripe account
- SendGrid account
- Jitsi Meet API credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb+srv://your_username:your_password@your_cluster.mongodb.net/tutorbuddy?retryWrites=true&w=majority"

# Authentication
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRATION="24h"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="noreply@tutorbuddy.co"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"

# Video (Jitsi Meet)
JITSI_APP_ID="your-jitsi-app-id"
JITSI_API_KEY="your-jitsi-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tutorbuddy.git
   cd tutorbuddy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables in Vercel:
   - Go to your project settings
   - Navigate to the Environment Variables section
   - Add all required environment variables

5. Set up Stripe webhooks:
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Get the webhook secret and add it to Vercel environment variables

### Production Considerations

1. **Database**
   - Use a production MongoDB Atlas cluster
   - Set up database backups
   - Configure proper indexes for performance

2. **Email**
   - Verify your SendGrid domain
   - Set up email templates
   - Monitor email deliverability

3. **Payments**
   - Use Stripe production keys
   - Set up webhook monitoring
   - Configure payment success/failure notifications

4. **Security**
   - Enable CORS protection
   - Set up rate limiting
   - Configure proper SSL/TLS
   - Implement input validation
   - Set up error monitoring

## Development

### Code Structure

```
src/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── student/     # Student pages
│   └── tutor/       # Tutor pages
├── components/       # React components
├── contexts/        # React contexts
├── lib/            # Utility functions
└── types/          # TypeScript types
```

### Adding New Features

1. Create new components in `src/components`
2. Add API routes in `src/app/api`
3. Update database schema in `prisma/schema.prisma`
4. Add new pages in appropriate directories
5. Update types in `src/types`

### Testing

Run tests:
```bash
npm run test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@tutorbuddy.co or join our Discord server. 