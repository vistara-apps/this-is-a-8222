# Shield & Speak

**Know your rights, speak with confidence, document your interactions.**

A mobile-first web application providing instant, location-aware legal guidance and documentation tools for interactions with law enforcement.

## 🚀 Features

### Core Features
- **Know Your Rights Guide**: Mobile-optimized guide with state-specific legal information
- **Quick Record & Share**: One-tap audio/video recording with emergency contact alerts
- **Location-Aware Legal Snippets**: Automatic location detection for relevant legal content
- **AI-Powered Script Generation**: Dynamic scripts for common police interaction scenarios
- **Multilingual Support**: Full English and Spanish language support

### Premium Features
- **Unlimited AI Script Generation**: Personalized scripts for any scenario
- **Cloud Recording Storage**: Secure backup of all recordings
- **Advanced Emergency Contacts**: Comprehensive contact management
- **Priority Support**: 24/7 customer support for premium users

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Payments**: Stripe + Crypto (x402-axios)
- **AI Integration**: OpenAI API
- **Web3**: RainbowKit and Wagmi
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- OpenAI API key
- Modern web browser with geolocation support

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-8222.git
cd this-is-a-8222
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# OpenAI API Key for AI script generation
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Database Setup

#### Supabase Tables
Create the following tables in your Supabase project:

```sql
-- User profiles table
CREATE TABLE user_profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_id TEXT,
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recordings table
CREATE TABLE recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  file_url TEXT,
  duration INTEGER,
  location JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Legal content table
CREATE TABLE legal_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state TEXT NOT NULL,
  content_english JSONB,
  content_spanish JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment records table
CREATE TABLE payment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  payment_type TEXT NOT NULL,
  stripe_session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

#### Row Level Security (RLS)
Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Emergency contacts policies
CREATE POLICY "Users can manage own contacts" ON emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

-- Recordings policies
CREATE POLICY "Users can manage own recordings" ON recordings
  FOR ALL USING (auth.uid() = user_id);

-- Payment records policies
CREATE POLICY "Users can view own payments" ON payment_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert payments" ON payment_records
  FOR INSERT WITH CHECK (true);
```

### 5. Storage Setup
Create a storage bucket for recordings:
```sql
-- Create recordings bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);

-- Create policy for recordings bucket
CREATE POLICY "Users can upload own recordings" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own recordings" ON storage.objects
  FOR SELECT USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── AppShell.jsx    # Main app layout
│   ├── CallToAction.jsx # Action buttons
│   ├── EmergencyContacts.jsx # Contact management
│   ├── InfoCard.jsx    # Information display
│   ├── KnowYourRights.jsx # Rights information
│   ├── PaymentModal.jsx # Payment interface
│   ├── QuickRecord.jsx # Recording functionality
│   ├── UserProfile.jsx # User profile management
│   └── UserRegistration.jsx # User registration
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── data/              # Static data
│   └── legalContent.js # Legal information database
├── hooks/             # Custom React hooks
│   ├── useAuth.js     # Authentication hook
│   └── usePaymentContext.js # Payment hook
├── services/          # API services
│   ├── AIScriptGenerator.jsx # OpenAI integration
│   ├── LegalContentService.js # Legal content API
│   ├── LocationService.js # Geolocation service
│   ├── StripeService.js # Stripe payment service
│   └── SupabaseService.js # Supabase integration
├── App.jsx           # Main app component
└── main.jsx          # App entry point
```

## 🎨 Design System

The app uses a custom design system built with Tailwind CSS:

### Colors
- **Primary**: `hsl(200, 80%, 40%)` - Main brand color
- **Accent**: `hsl(160, 60%, 50%)` - Highlight color
- **Surface**: `hsl(0, 0%, 100%)` - Card backgrounds
- **Background**: `hsl(210, 20%, 95%)` - Page background
- **Text**: `hsl(210, 20%, 20%)` - Primary text

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary, outline, and accent variants
- **Forms**: Consistent input styling with validation
- **Navigation**: Bottom tab navigation for mobile

## 🔐 Security Features

- **Row Level Security**: Database-level access control
- **Authentication**: Secure user authentication via Supabase
- **Input Validation**: Client and server-side validation
- **HTTPS Only**: Enforced secure connections in production
- **Content Security Policy**: XSS protection
- **Secret Scanning**: Pre-commit hooks prevent secret commits

## 💳 Payment Integration

### Stripe Integration
- Subscription management
- One-time payments
- Customer portal
- Webhook handling
- Payment history

### Crypto Payments
- Web3 wallet integration
- x402-axios payment protocol
- Multi-chain support
- Automatic payment verification

## 🌍 Internationalization

Full support for English and Spanish:
- UI translations
- Legal content in both languages
- Dynamic language switching
- Locale-aware formatting

## 📱 Mobile Optimization

- **Mobile-first design**: Optimized for smartphones
- **Touch-friendly**: Large tap targets and gestures
- **Offline support**: Core features work offline
- **PWA ready**: Can be installed as a mobile app
- **Responsive**: Works on all screen sizes

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Configure production environment variables in `.env.production`:
- Set up production Supabase project
- Configure production Stripe keys
- Set up monitoring and analytics
- Enable security features

### Deployment Platforms
The app can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Firebase Hosting**

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📊 Monitoring

- **Error Tracking**: Sentry integration
- **Analytics**: Google Analytics
- **Performance**: Web Vitals monitoring
- **Uptime**: Status page monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Premium Support**: Available for premium subscribers
- **Community**: Join our Discord server for discussions

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Complete authentication system
- ✅ User profile management
- ✅ Emergency contacts system
- ✅ Payment integration (Stripe + Crypto)
- ✅ AI script generation
- ✅ Audio recording functionality
- ✅ Location-based legal content
- ✅ Multilingual support
- ✅ Mobile-responsive design

### Planned Features
- 📱 Native mobile app
- 🎥 Video recording support
- 🗺 Enhanced location services
- 📊 Usage analytics dashboard
- 🔔 Push notifications
- 🌐 Additional language support

---

**Shield & Speak** - Empowering citizens with knowledge and tools to protect their rights during law enforcement interactions.
