# Deployment Guide - Cozy Pets by Alice

Това ръководство описва стъпките за deploy на приложението в production среда.

## Prerequisites

- Supabase account
- Domain за production
- Node.js 18+ за local build

## Supabase Setup

### 1. Create Supabase Project

1. Отидете на [supabase.com](https://supabase.com)
2. Създайте нов проект
3. Запазете Database Password (ще ви трябва)
4. Изчакайте проекта да бъде provisioned

### 2. Apply Database Migrations

Migrations са в `supabase/migrations/`. Приложете ги в този ред:

```bash
# Via Supabase Dashboard
# Settings → Database → SQL Editor
# Copy-paste съдържанието на всеки файл по ред:

1. 20251117134102_create_complete_pet_sitting_database.sql
2. 20251117135423_add_platform_commission_system.sql
3. 20251117135828_add_premium_subscription_system.sql
4. 20251117140202_add_veterinary_chat_system.sql
5. 20251117141839_add_premium_magazine_system.sql
6. 20251201192649_add_chat_violations_and_escrow_system.sql
7. 20251211131152_add_chat_approval_system_v2.sql
8. 20251211134426_enhance_reviews_system_with_responses_and_aggregates.sql
```

### 3. Get API Keys

От Supabase Dashboard:
- Settings → API
- Copy `Project URL`
- Copy `anon` public key

### 4. Configure Authentication

1. Settings → Authentication → Email Auth
2. Enable Email provider
3. Disable email confirmation (или configure SMTP)
4. Set Site URL to your production domain

### 5. Setup Storage (Optional)

За profile pictures, pet photos:
1. Storage → New bucket
2. Create `avatars` bucket (public)
3. Create `pet-photos` bucket (public)
4. Create `sitter-photos` bucket (public)

## Environment Variables

### Production `.env`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Build & Deploy

### Option 1: Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Environment variables → Add .env values
4. Deploy

### Option 2: Vercel

1. Import GitHub repository
2. Framework: Vite
3. Root directory: `./`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Environment variables → Add .env values
7. Deploy

### Option 3: Manual Build

```bash
# Build locally
npm run build

# Upload dist/ folder to your hosting
# Examples: AWS S3, Cloudflare Pages, GitHub Pages
```

## Post-Deployment Checklist

### 1. Test Core Features

- [ ] User registration
- [ ] User login
- [ ] Sitter search
- [ ] Booking creation
- [ ] Chat system
- [ ] Admin dashboard access
- [ ] Payment flow
- [ ] Reviews system

### 2. Create Admin Account

```sql
-- Via Supabase SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin@email.com';
```

### 3. Test RLS Policies

- [ ] Users can only see their own data
- [ ] Sitters can only edit their profiles
- [ ] Admin can access all data
- [ ] Chat messages are properly restricted

### 4. Configure Edge Functions (if using)

```bash
# Deploy edge functions
supabase functions deploy ai-handler
supabase functions deploy alice-match-engine
supabase functions deploy pet-needs-engine
```

### 5. Monitor & Analytics

Setup:
- Error tracking (Sentry)
- Analytics (Google Analytics, Plausible)
- Performance monitoring
- Database usage alerts

## Database Backups

### Automatic Backups

Supabase автоматично прави daily backups:
- Settings → Database → Backups
- Free tier: 7 days retention
- Pro tier: 30 days retention

### Manual Backup

```bash
# Export database
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  > backup.sql
```

## Scaling Considerations

### Database

- Monitor query performance via Supabase Dashboard
- Add indexes за slow queries
- Consider upgrading plan при > 500MB database

### Frontend

- Enable CDN caching
- Optimize images (WebP format)
- Code splitting за large routes
- Lazy load компоненти

### Edge Functions

- Monitor execution time
- Cache frequently used data
- Consider rate limiting

## Security Checklist

- [ ] RLS enabled на всички таблици
- [ ] Policies тествани за edge cases
- [ ] Environment variables не са в Git
- [ ] HTTPS enabled на production
- [ ] CORS configured правилно
- [ ] API keys ротирани след deploy
- [ ] Admin emails limited в whitelist

## Monitoring

### Key Metrics

- Active users
- Booking conversion rate
- Average response time
- Database usage
- Error rate
- Payment success rate

### Alerts Setup

- Database > 80% capacity
- Error rate > 5%
- Response time > 2s
- Failed payments

## Rollback Procedure

### Frontend Rollback

Netlify/Vercel:
1. Dashboard → Deployments
2. Find previous working deployment
3. Click "Publish" на старата версия

### Database Rollback

```sql
-- Revert migration
-- Run inverse SQL operations
-- Or restore from backup
```

## Support

За проблеми при deployment:
- Check Supabase logs
- Check browser console
- Check Network tab за API errors
- Review RLS policies
- Verify environment variables

## Production URLs

- App: https://your-domain.com
- Admin: https://your-domain.com/admin
- Supabase Dashboard: https://app.supabase.com/project/your-project

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor database size
- [ ] Review new user signups
- [ ] Check payment reconciliation

### Monthly
- [ ] Review analytics
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification

### Quarterly
- [ ] Major feature releases
- [ ] Database optimization
- [ ] User feedback implementation
- [ ] Platform fee review
