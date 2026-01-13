# ✅ Deployment Checklist - Cozy Pets by Alice

Използвайте този checklist за да се уверите че всичко е готово за пускане.

---

## 📋 Pre-Deployment

### Database & Backend
- [x] Приложени 8 основни миграции от `MIGRATION_ORDER.md`
- [x] Създаден `seed_sample_data.sql` и готов за изпълнение (примерни sitter, pets, reviews)
- [x] Проверка, че таблиците `profiles`, `sitters`, `magazine_issues`, `veterinary_clinics` съществуват
- [ ] Пускане на миграциите в production (ще се направи при деплой)

### Local Setup
- [x] `.env` файл създаден с правилни credentials
- [x] `npm install` завършил успешно
- [x] `npm run dev` работи без грешки
- [x] http://localhost:5173 зарежда успешно
- [x] Console няма критични грешки (404s fixed, само minor warnings)

### Admin Account
- [ ] Admin потребител регистриран с `methodman9090@gmail.com`
- [ ] Admin role присвоен (проверка в Table Editor → profiles)
- [ ] Admin login работи (`/admin/login`)
- [ ] Admin dashboard зарежда със статистики

### Core Features Test (Local)
- [x] Регистрация на нов потребител работи (форма функционална със всички полета)
- [x] Login работи (модал показва Google, Facebook, Email опции)
- [ ] Logout работи (не е тестван)
- [ ] User dashboard се зарежда (изисква реален login)
- [x] Admin dashboard е защитен - /admin изисква authentication
- [x] Sitter search страница зарежда (показва 0 гледачи - seed данни готови за добавяне)
- [x] "Become a Sitter" форма се отваря

---

## 🚀 Production Deployment

### Code Preparation
- [ ] Всички промени са committed в Git
- [ ] `.env` файл **НЕ Е** в Git repository
- [ ] `.gitignore` съдържа `.env`
- [ ] `npm run build` работи без грешки
- [ ] Build size е приемлив (<2MB за assets)

### Hosting Platform Setup (Netlify)

#### Deployment
- [ ] Repository свързан с Netlify
- [ ] Build settings конфигурирани:
  - Build command: `npm run build`
  - Publish directory: `dist`

#### Environment Variables
- [ ] `VITE_SUPABASE_URL` добавен
- [ ] `VITE_SUPABASE_ANON_KEY` добавен
- [ ] **НЕ СЕ** използва `service_role` key!

#### Deploy
- [ ] Първи deploy завършил успешно
- [ ] Production URL е достъпен
- [ ] Homepage зарежда правилно

### Supabase Production Configuration

#### URL Configuration
- [ ] Site URL променен на production URL
- [ ] Redirect URLs включват production URL + `/**`
- [ ] CORS е конфигуриран за production domain

#### Email Settings (Production)
- [ ] Email confirmations **ENABLED**
- [ ] SMTP настроен (или използва Supabase default)
- [ ] Email templates прегледани
- [ ] Test email изпратен успешно

#### Storage (Optional)
- [ ] `avatars` bucket създаден
- [ ] `pet-photos` bucket създаден
- [ ] `sitter-photos` bucket създаден
- [ ] Bucket policies конфигурирани

---

## 🧪 Production Testing

### Authentication Flow
- [ ] Регистрация работи на production
- [ ] Email confirmation работи (ако е enabled)
- [ ] Login работи
- [ ] Logout работи
- [ ] Password reset работи

### User Features
- [ ] User dashboard зарежда
- [ ] Profile edit работи
- [ ] Sitter search работи
- [ ] Sitter profile pages се отварят
- [ ] "Become a Sitter" форма работи

### Admin Features
- [ ] Admin login работи
- [ ] Admin dashboard зарежда
- [ ] Статистики показват правилни данни
- [ ] User management работи
- [ ] Admin може да ban/unban потребители

### Database
- [ ] Data се записва правилно
- [ ] RLS policies работят (users не виждат чужди данни)
- [ ] Foreign keys са консистентни
- [ ] No SQL errors в Supabase logs

### Performance
- [ ] Homepage зарежда <3s
- [ ] Throttle test (3G) е приемлив
- [ ] Images се оптимизират/зареждат
- [ ] No console errors
- [ ] No 404 errors

---

## 🔒 Security Checklist

### Authentication
- [ ] Email confirmations enabled (production)
- [ ] Strong password requirements
- [ ] JWT tokens работят правилно
- [ ] Session timeout е разумен

### Database Security
- [ ] RLS enabled на ВСИЧКИ таблици
- [ ] Policies тествани за различни roles
- [ ] Service role key НЕ Е във frontend
- [ ] Admin email whitelist работи

### Environment
- [ ] `.env` файл НЕ Е в Git
- [ ] Production environment variables са безопасни
- [ ] API keys са rotated след първоначалния setup
- [ ] HTTPS е forced на production

---

## 📊 Monitoring & Analytics

### Setup
- [ ] Google Analytics добавен (optional)
- [ ] Error tracking setup (Sentry optional)
- [ ] Supabase database alerts configured

### Metrics to Monitor
- [ ] Active users
- [ ] Booking conversion rate
- [ ] Error rate
- [ ] Database usage
- [ ] API response times

---

## 📝 Post-Deployment Tasks

### Documentation
- [ ] Production URL документиран
- [ ] Admin credentials в password manager
- [ ] Deployment процедура документирана
- [ ] Rollback план създаден

### User Communication
- [ ] Beta testers invited (ако има)
- [ ] Feedback channel setup
- [ ] Support email конфигуриран

### Backup
- [ ] Automatic backups enabled в Supabase
- [ ] Manual backup направен след deploy
- [ ] Backup restoration тествана

---

## 🎯 Launch Готовност

### Critical (Must Have)
- [ ] Сайтът зарежда без грешки
- [ ] Регистрация и login работят
- [ ] Admin панел работи
- [ ] Database е безопасна (RLS enabled)
- [ ] HTTPS работи

### Important (Should Have)
- [ ] Email notifications работят
- [ ] Performance е добър (<3s load time)
- [ ] Error tracking setup
- [ ] Backups конфигурирани

### Nice to Have
- [ ] Google Analytics
- [ ] Custom domain
- [ ] Professional SMTP (SendGrid, etc.)
- [ ] CDN optimization

---

## 🚨 Emergency Contacts

### Platform Issues
- **Netlify Support:** https://www.netlify.com/support/
- **Supabase Support:** https://supabase.com/support

### Rollback Procedure
1. Netlify: Dashboard → Deployments → Previous deploy → Publish
2. Database: Restore from backup via Supabase Dashboard
3. Check Supabase logs for any migration issues

---

## 🎉 Post-Launch

След успешен launch:

### Week 1
- [ ] Monitor errors daily
- [ ] Check database usage
- [ ] Review user feedback
- [ ] Fix critical bugs

### Week 2-4
- [ ] Analyze user behavior
- [ ] Optimize performance
- [ ] Add requested features
- [ ] Update documentation

### Monthly
- [ ] Review analytics
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization

---

## ✨ Success Criteria

Проектът е успешно пуснат ако:
- ✅ Потребителите могат да се регистрират и login-ват
- ✅ Sitters могат да създават профили
- ✅ Резервации могат да се правят
- ✅ Admin панелът работи
- ✅ Няма критични bugs
- ✅ Performance е добър

🎊 **Честито! Готови сте за Launch!** 🎊
