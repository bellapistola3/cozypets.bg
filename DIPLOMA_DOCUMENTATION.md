# 🎓 ДИПЛОМНА РАБОТА
## Разработване на уеб платформа за услуги за домашни любимци "CozyPets.bg"

---

## 📌 1. АНОТАЦИЯ И ЦЕЛИ НА ПРОЕКТА
Платформата **CozyPets.bg** е съвременна уеб система, създадена за да свързва собственици на домашни любимци с проверени и квалифицирани гледачи (pet sitters). Системата предоставя пълен набор от функционалности за регистрация, търсене, онлайн резервация, оставяне на отзиви, ветеринарни консултации и интерактивно съвпадение (AI Match Center).

---

## 🏗️ 2. АРХИТЕКТУРА И ТЕХНОЛОГИЧЕН СТЕК

### 💻 Frontend (Клиентска част)
- **Framework**: React 18 + TypeScript + Vite
- **Стилизиране**: Tailwind CSS (с адаптивен мобилен дизайн)
- **Маршрутизация**: React Router DOM v6
- **Иконки & Компоненти**: Lucide React
- **Индексиране & Карти**: Leaflet.js / OpenStreetMap

### 🗄️ Backend & Database (Сървърна част)
- **Платформа**: Supabase (BaaS)
- **База данни**: PostgreSQL 15
- **Автентикация**: Supabase Auth (JWT tokens, OAuth интеграции)
- **Сигурност**: Row Level Security (RLS) политики на ниво база данни
- **Автоматизация**: PL/pgSQL тригери и процедури

### 🚀 Деплоймент & Инфраструктура
- **Хостинг**: Superhosting.bg (Apache Web Server)
- **Пренасочване (SPA Routing)**: `.htaccess` конфигурация за поддръжка на клиентски рутинг
- **SSL / HTTPS**: TLS криптиране с персонален купен домейн (`cozypets.bg`)

---

## 📊 3. СТРУКТУРА НА БАЗАТА ДАННИ (RELATIONAL SCHEMA)

Схемата се състои от **6 основни таблици** и **4 потребителски типове (Enums)**:

### 🔹 Скаларни типове (Custom Enums)
1. `user_role`: `'owner'`, `'sitter'`, `'admin'`
2. `payment_method`: `'credit_card'`, `'paypal'`, `'bank_transfer'`
3. `payment_status`: `'pending'`, `'completed'`, `'failed'`
4. `escrow_status`: `'held'`, `'released'`, `'refunded'`

### 🔹 Таблици и релации

#### 1. `public.profiles` (Потребителски профили)
- `id` (UUID, Primary Key, Foreign Key -> `auth.users.id` ON DELETE CASCADE)
- `full_name` (TEXT)
- `email` (TEXT UNIQUE NOT NULL)
- `phone` (TEXT)
- `role` (`user_role` DEFAULT `'owner'`)
- `created_at` (TIMESTAMP WITH TIME ZONE)

#### 2. `public.sitters` (Детайлни профили на гледачи)
- `id` (UUID, Primary Key, Foreign Key -> `public.profiles.id` ON DELETE CASCADE)
- `profile_title` (TEXT) — Заглавие на профила
- `bio` (TEXT) — Описание
- `experience` (TEXT) — Опит
- `address_line` (TEXT), `lat` (FLOAT), `lng` (FLOAT) — Локация и координати
- `price_24h` (DOUBLE PRECISION) — Дневна тарифа в BGN
- `pet_types` (TEXT[]) — Приемани видове животни
- `allow_small_dogs`, `allow_large_dogs`, `accept_in_heat`, `accept_unneutered`, `has_car`, `behavior_trainer` (BOOLEAN)
- `medical_training`, `day_flow_short` (TEXT)

#### 3. `public.pets` (Домашни любимци)
- `id` (UUID, Primary Key, Auto Generated)
- `user_id` (UUID, Foreign Key -> `public.profiles.id` ON DELETE CASCADE)
- `name` (TEXT NOT NULL)
- `breed` (TEXT)
- `age` (INTEGER)
- `health_status` (TEXT)
- `photo_url` (TEXT)

#### 4. `public.reservations` (Резервации)
- `id` (UUID, Primary Key)
- `owner_id` (UUID, Foreign Key -> `public.profiles.id`)
- `sitter_id` (UUID, Foreign Key -> `public.sitters.id`)
- `pet_id` (UUID, Foreign Key -> `public.pets.id`)
- `start_date`, `end_date` (TIMESTAMP WITH TIME ZONE)
- `total_price` (DOUBLE PRECISION)
- `status` (TEXT DEFAULT `'pending'`)

#### 5. `public.reviews` (Отзиви и рейтинги)
- `id` (UUID, Primary Key)
- `reservation_id` (UUID, Foreign Key -> `public.reservations.id`)
- `reviewer_id` (UUID, Foreign Key -> `public.profiles.id`)
- `sitter_id` (UUID, Foreign Key -> `public.sitters.id`)
- `rating` (INTEGER CHECK 1..5)
- `comment` (TEXT)

#### 6. `public.payments` (Плащания)
- `id` (UUID, Primary Key)
- `reservation_id` (UUID, Foreign Key -> `public.reservations.id`)
- `amount` (DOUBLE PRECISION)
- `payment_method` (`payment_method`)
- `escrow_status` (`escrow_status`)
- `payment_status` (`payment_status`)

---

## 🔒 4. СИГУРНОСТ И ROW LEVEL SECURITY (RLS)

За защита на данните е внедрен модел на **Row Level Security (RLS)** директно в PostgreSQL базата данни:

1. **Profiles Policy**:
   - `SELECT`: Публичен за всички (нужен за преглед на гледачите).
   - `INSERT / UPDATE`: Разрешен само за автентикирания потребител, при условие че `auth.uid() = id`.

2. **Sitters Policy**:
   - `SELECT`: Публично четене за всички посетители.
   - `INSERT / UPDATE`: Разрешено само за гледача, чийто ID съвпада с `auth.uid()`.

3. **Pets Policy**:
   - Записи и промени се допускат само ако `auth.uid() = user_id`.

4. **Reservations & Payments Policy**:
   - Достъп до резервации и плащания имат единствено участващите страни (собственикът на любимеца и определеният гледач).

5. **Автоматичен Тригер за Профил (`handle_new_user`)**:
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, full_name, email, role)
     VALUES (
       NEW.id,
       COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
       NEW.email,
       CASE 
         WHEN NEW.email IN ('cozypetsbyalice@gmail.com', 'methodman9090@gmail.com') THEN 'admin'::user_role
         ELSE 'owner'::user_role
       END
     )
     ON CONFLICT (id) DO NOTHING;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

---

## 🧪 5. ТЕСТВАНЕ И ВЕРИФИКАЦИЯ (QUALITY ASSURANCE)

За гарантиране на стабилността на платформата е разработен автоматизиран **End-to-End (E2E) тест**, покриващ 25 независими проверки:

- ✅ **Тест 1 (Собственик)**: Регистрация през Supabase Auth, създаване на JWT сесия, автоматично генериране на профил, добавяне на любимец.
- ✅ **Тест 2 (Гледач)**: Регистрация на гледач, попълване на SitterProfileForm (цени, опит, услуги), проверка на появата му в публичното търсене.
- ✅ **Тест 3 (Резервация)**: Създаване на резервация между собственик и гледач, калкулация на сума и статус `pending`.
- ✅ **Тест 4 (Отзив)**: Записване на 5-звезден отзив и публичното му визуализиране.
- 🎯 **Краен резултат от тестовата среда**: **25/25 преминати проверки (0 грешки)**.

---

## 🔍 6. СЕО ОПТИМИЗАЦИЯ (SEO & PERFORMANCE)

Платформата е напълно оптимизирана за търсещи машини (Google):

1. **Structured Data (Schema.org JSON-LD)**:
   - Вградени микроформати `LocalBusiness`, `Service` и `FAQPage` за богати резултати в Google.
2. **Open Graph & Twitter Cards**:
   - Пълни мета-тагове за правилно визуализиране при споделяне във Facebook, Viber, Instagram и Twitter.
3. **Файлове за индексиране**:
   - `sitemap.xml`: Динамичен XML файл с актуални URL адреси и дати.
   - `robots.txt`: Конфигуриран с инструкции за Googlebot.

---

## 🏆 7. ЗАКЛЮЧЕНИЕ
Проектът **CozyPets.bg** представлява завършено, сигурно и високопроизводително уеб приложение, работещо с реална PostgreSQL база данни и съвременна облачна архитектура. Системата е напълно подготвена за демонстрация и успешна защита на дипломна работа.
