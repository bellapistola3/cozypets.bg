# ⚡ QUICK START - Supabase Setup за 15 минути

## 📋 Преди да започнете

Имате нужда от:
- [ ] Supabase акаунт (безплатен)
- [ ] Code editor отворен с проекта
- [ ] 15 минути време

---

## 🚀 Стъпка 1: Supabase Проект (5 мин)

1. Отидете на https://supabase.com → Login
2. **+ New Project**
3. Попълнете:
   - Name: `CosyPetsByAlice`
   - Database Password: (създайте и запазете!)
   - Region: `eu-central-1` (Frankfurt - най-близо до България)
4. **Create new project** → изчакайте 2-3 минути

---

## 💾 Стъпка 2: База Данни (5 мин)

### 2.1 Отворете SQL Editor
Supabase Dashboard → **SQL Editor** (лявото меню) → **+ New query**

### 2.2 Приложете миграциите

Копирайте и изпълнете **всеки файл по ред** (Run след всеки):

```
1. supabase/migrations/20251231030342_create_complete_pet_sitting_database.sql
2. supabase/migrations/20251231030409_add_role_and_email_to_profiles.sql
3. supabase/migrations/20251231030414_auto_admin_setup.sql
4. supabase/migrations/20251117135423_add_platform_commission_system.sql
5. supabase/migrations/20251117135828_add_premium_subscription_system.sql
6. supabase/migrations/20251117140202_add_veterinary_chat_system.sql
7. supabase/migrations/20251211131152_add_chat_approval_system_v2.sql
8. supabase/migrations/20251211134426_enhance_reviews_system_with_responses_and_aggregates.sql
```

✅ След всяка миграция: "Success. No rows returned"

### 2.3 Бърза проверка
**Table Editor** → трябва да видите таблици: `profiles`, `sitters`, `pets`, `reservations`, etc.

---

## 🔑 Стъпка 3: API Keys (2 мин)

1. **Settings** → **API**
2. Копирайте:
   - **Project URL** (напр. `https://abc123.supabase.co`)
   - **anon public** key

---

## ⚙️ Стъпка 4: Локална Конфигурация (3 мин)

### 4.1 Създайте `.env` файл

В root на проекта (до `package.json`), създайте файл `.env`:

```env
VITE_SUPABASE_URL=https://вашият-url.supabase.co
VITE_SUPABASE_ANON_KEY=вашият-anon-key
```

### 4.2 Рестартирайте сървъра

```bash
# Спрете dev server (Ctrl+C)
npm run dev
```

---

## 👨‍💼 Стъпка 5: Admin Потребител (2 мин)

1. Отворете http://localhost:5173
2. **Регистрация** с:
   - Email: `methodman9090@gmail.com` ⚠️ (точно този email!)
   - Парола: Изберете и запомнете
3. Завършете регистрацията

---

## ✅ Финална Проверка

### Тест 1: Login
- Logout → Login с `methodman9090@gmail.com`
- ✅ Виждате dashboard

### Тест 2: Admin панел
- Отидете на `/admin`
- ✅ Виждате Admin Dashboard със статистики

---

## 🎉 Готово!

Сайтът работи локално! За production deployment, вижте `COMPLETE_SUPABASE_SETUP.md` стъпка 9.

---

## 🆘 Проблеми?

| Грешка | Решение |
|--------|---------|
| "Supabase not configured" | Проверете `.env` файла и рестартирайте сървъра |
| "Invalid credentials" | Проверете паролата или reset-нете я от Supabase |
| "No admin rights" | Уверете се че email-ът е точно `methodman9090@gmail.com` |

За повече помощ: `COMPLETE_SUPABASE_SETUP.md` (пълно ръководство)
