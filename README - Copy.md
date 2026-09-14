# Cozy Pets by Alice

Пълноценна платформа за резервация на гледачи на домашни любимци с AI асистент, veterinary chat, premium съдържание и административна система.

## Основни функционалности

### За потребители
- **User Authentication** - Регистрация и вход с email/password чрез Supabase Auth
- **Pet Sitter Search** - Търсене и филтриране на гледачи по локация, услуги, рейтинг
- **AI Match Center** - AI-базирано matchване между собственици и гледачи
- **Booking System** - Пълна система за резервации с календар и потвърждения
- **Chat System** - Chat между собственици и гледачи с approval система
- **Reviews & Ratings** - Система за отзиви с aggregation и sitter отговори
- **Payment Escrow** - Escrow система за безопасни плащания
- **Veterinary Chat** - Chat с ветеринари за консултации
- **Premium Magazine** - Subscription-based дигитално списание за домашни любимци
- **AI Assistant** - Глобален AI помощник за въпроси и съвети
- **Notifications** - Система за известия за важни events

### За гледачи
- **Sitter Profiles** - Детайлни профили с снимки, услуги, цени
- **Availability Calendar** - Управление на наличност
- **Booking Management** - Преглед и управление на резервации
- **Reviews Management** - Отговор на отзиви от клиенти
- **Premium Subscriptions** - Subscription планове за повишена видимост
- **Earnings Dashboard** - Преглед на приходи и platform такси

### За администратори
- **Admin Dashboard** - Пълен административен панел
- **Statistics & Analytics** - Реал-тайм статистики за platform
- **User Management** - Управление на потребители с ban/unban
- **Booking Management** - Преглед и управление на всички резервации
- **Payment Management** - Управление на плащания и escrow
- **Chat Approval** - Модерация на chat заявки
- **Platform Earnings** - Tracking на platform печалби и такси

## Технологии

### Frontend
- **React 18** с TypeScript
- **Vite** за build система
- **React Router** за routing
- **Tailwind CSS** за styling
- **Lucide React** за icons
- **Leaflet** за карти

### Backend & Database
- **Supabase** за authentication и database
- **PostgreSQL** с Row Level Security (RLS)
- **Supabase Edge Functions** за serverless функции
- **Real-time subscriptions** за live updates

### AI & External Services
- **Supabase AI** за AI features
- **Edge Functions** за AI processing

## Database Schema

### Core Tables
- `profiles` - Потребителски профили
- `sitters` - Профили на гледачи
- `pets` - Информация за домашни любимци
- `reservations` - Резервации
- `reviews` - Отзиви и рейтинги
- `sitter_ratings` - Aggregated ratings

### Chat System
- `chat_requests` - Chat заявки с approval
- `messages` - Chat съобщения
- `chat_violations` - Tracking на нарушения и ban система

### Payment System
- `payments` - Плащания
- `platform_earnings` - Platform приходи
- `subscription_plans` - Subscription планове
- `sitter_subscriptions` - Sitter абонаменти

### Veterinary System
- `veterinarians` - Ветеринарни профили
- `vet_chat_rooms` - Chat стаи с ветеринари
- `vet_consultations` - Консултации

### Magazine System
- `magazine_issues` - Издания на списанието
- `magazine_articles` - Статии
- `user_magazine_access` - Достъп до съдържание

## Security

### Row Level Security (RLS)
Всички таблици имат включен RLS с детайлни политики:
- Потребителите виждат само своите данни
- Гледачите управляват само своите профили
- Админите имат пълен достъп
- Chat съобщения са видими само за участниците

### Authentication
- Supabase Auth с email/password
- JWT tokens за session management
- Secure password hashing
- Protected routes за authenticated users
- Admin role verification

## Installation

1. Clone repository
```bash
git clone <repo-url>
cd cosypetsbyalice
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
Create `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Database Setup

All migrations are in `supabase/migrations/`. Key migrations:

1. `create_complete_pet_sitting_database.sql` - Core tables
2. `add_platform_commission_system.sql` - Payment система
3. `add_premium_subscription_system.sql` - Subscriptions
4. `add_veterinary_chat_system.sql` - Vet chat
5. `add_premium_magazine_system.sql` - Magazine система
6. `add_chat_violations_and_escrow_system.sql` - Chat moderation & Escrow
7. `add_chat_approval_system_v2.sql` - Chat approval
8. `enhance_reviews_system_with_responses_and_aggregates.sql` - Reviews система

## Routes

### Public
- `/` - Начална страница
- `/about` - За нас
- `/privacy` - Политика за поверителност
- `/sitters` - Търсене на гледачи
- `/services` - Услуги

### Protected (Auth Required)
- `/dashboard` - Потребителски dashboard
- `/become-sitter` - Регистрация като гледач
- `/vet-chat` - Ветеринарен chat

### Admin Only
- `/admin` - Административен панел

## Key Components

### User Flow
1. `Register` → `Login` → `Dashboard`
2. Search sitters → View profile → Request chat → Book service
3. Complete service → Leave review

### Sitter Flow
1. Register → `BecomeASitter` form
2. Setup profile, pricing, availability
3. Receive bookings → Approve/Decline
4. Complete service → Get paid

### Admin Flow
1. Login as admin → `/admin`
2. Monitor statistics
3. Manage users, bookings, payments
4. Moderate chat requests
5. View platform earnings

## Error Handling

- Global `ErrorBoundary` за React errors
- `errorHandler.ts` utility за async errors
- `validation.ts` utility за form validation
- User-friendly error messages в български
- Logging за debugging

## Performance

- Code splitting за по-малки bundles
- Lazy loading на компоненти
- Optimized database queries
- RLS policies за security без performance impact
- Indexed foreign keys за бързи joins

## Future Improvements

- [ ] Real-time notifications със Supabase Realtime
- [ ] Push notifications
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Map-based sitter search
- [ ] Video chat за консултации
- [ ] Mobile app
- [ ] Payment gateway integration (Stripe)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## Contributing

Contact the development team for contribution guidelines.

## License

Proprietary - All rights reserved
