# 🔥 Firebase Integration Guide - Cozy Pets

## ✅ Какво е направено

Всички Supabase файлове и зависимости са премахнати. Проектът е подготвен за Firebase интеграция.

### Премахнати файлове:
- ❌ `supabase/` директория (всички миграции и функции)
- ❌ `src/lib/supabase.ts`
- ❌ `SUPABASE_ADMIN_SETUP.md`
- ❌ `COMPLETE_SUPABASE_SETUP.md`
- ❌ `QUICK_START_ADMIN_SETUP.md`
- ❌ `@supabase/supabase-js` package

### Създадени нови файлове:
- ✅ `src/lib/firebase.ts` - Пълна Firebase интеграция
- ✅ `src/lib/auth.ts` - Firebase Authentication helpers
- ✅ `.env.example` - Firebase environment variables template
- ✅ `package.json` - Обновен с Firebase dependency

---

## 📋 Стъпки за завършване на интеграцията

### 1️⃣ Инсталиране на Firebase SDK

```bash
npm install firebase
```

**Забележка:** Ако имате проблем с дисковото пространство:
```bash
npm cache clean --force
npm install firebase
```

---

### 2️⃣ Конфигуриране на Firebase Credentials

#### A) Вземете credentials от Firebase Console

1. Отидете на https://console.firebase.google.com
2. Изберете вашия проект (на профила на жена ви)
3. Кликнете на ⚙️ **Settings** → **Project settings**
4. В секцията **Your apps**, ако няма web app:
   - Кликнете **Add app** → **Web** (</>)
   - Дайте име (например "Cozy Pets Web")
   - Кликнете **Register app**
5. Ще видите **Firebase SDK configuration**. Копирайте стойностите.

#### B) Създайте `.env` файл

Копирайте `.env.example` в `.env`:
```bash
copy .env.example .env
```

#### C) Попълнете `.env` файла

Отворете `.env` и попълнете стойностите от Firebase Console:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

### 3️⃣ Firestore Database Structure

Уверете се, че вашата Firestore база данни има следната структура:

```
📁 Firestore Database
│
├── 📂 users/{userId}
│   ├── name: string
│   ├── full_name: string
│   ├── email: string
│   ├── phone: string
│   ├── role: "owner" | "admin" | "sitter"
│   ├── created_at: timestamp
│   │
│   └── 📂 pets/{petId}
│       ├── name: string
│       ├── breed: string
│       ├── age: number
│       ├── medicalConditions: string
│       ├── photo_url: string
│       └── created_at: timestamp
│
├── 📂 sitters/{sitterId}
│   ├── name: string
│   ├── profile: string
│   ├── location: string
│   ├── availability: string
│   ├── rating: number
│   ├── hourly_rate: number
│   ├── bio: string
│   ├── qualifications: string
│   ├── profile_title: string
│   ├── experience: string
│   ├── address_line: string
│   ├── lat: number
│   ├── lng: number
│   ├── is_hotel: boolean
│   ├── price_24h: number
│   ├── price_notes: string
│   ├── pet_types: array
│   ├── allow_small_dogs: boolean
│   ├── allow_large_dogs: boolean
│   ├── accept_in_heat: boolean
│   ├── accept_unneutered: boolean
│   ├── behavior_trainer: boolean
│   ├── has_car: boolean
│   ├── medical_training: string
│   └── day_flow_short: string
│
├── 📂 reservations/{reservationId}
│   ├── ownerId: string
│   ├── sitterId: string
│   ├── petId: string
│   ├── startDate: timestamp
│   ├── endDate: timestamp
│   ├── totalPrice: number
│   ├── status: "pending" | "confirmed" | "completed" | "cancelled"
│   └── created_at: timestamp
│
├── 📂 reviews/{reviewId}
│   ├── reservationId: string
│   ├── reviewerId: string
│   ├── sitterId: string
│   ├── rating: number
│   ├── comment: string
│   └── created_at: timestamp
│
└── 📂 payments/{paymentId}
    ├── reservationId: string
    ├── amount: number
    ├── paymentMethod: "credit_card" | "paypal" | "bank_transfer"
    ├── paymentStatus: "pending" | "completed" | "failed"
    └── created_at: timestamp
```

---

### 4️⃣ Firestore Security Rules

В Firebase Console → Firestore Database → Rules, добавете:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can update their own data
      allow update: if request.auth != null && request.auth.uid == userId;
      // Only authenticated users can create profiles (via auth)
      allow create: if request.auth != null;
      
      // Admins can read/write all users
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Pets subcollection
      match /pets/{petId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Sitters collection
    match /sitters/{sitterId} {
      // Everyone can read sitters
      allow read: if true;
      // Only the sitter or admin can write
      allow write: if request.auth != null && 
        (request.auth.uid == sitterId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Reservations collection
    match /reservations/{reservationId} {
      // Users can read their own reservations
      allow read: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         resource.data.sitterId == request.auth.uid);
      // Users can create reservations
      allow create: if request.auth != null;
      // Only owner, sitter, or admin can update
      allow update: if request.auth != null && 
        (resource.data.ownerId == request.auth.uid || 
         resource.data.sitterId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      // Admins can read all
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      // Everyone can read reviews
      allow read: if true;
      // Only authenticated users can create reviews
      allow create: if request.auth != null;
      // Only the reviewer or admin can update/delete
      allow update, delete: if request.auth != null && 
        (resource.data.reviewerId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Payments collection
    match /payments/{paymentId} {
      // Users can read their own payments
      allow read: if request.auth != null;
      // Only system can create payments (via Cloud Functions)
      allow create: if request.auth != null;
      // Admins can read all
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

### 5️⃣ Firebase Authentication Setup

В Firebase Console → Authentication:

1. **Enable Email/Password**:
   - Отидете на **Sign-in method**
   - Активирайте **Email/Password**

2. **Enable Google Sign-In** (опционално):
   - Активирайте **Google**
   - Попълнете Project support email

3. **Enable Facebook Sign-In** (опционално):
   - Активирайте **Facebook**
   - Добавете App ID и App Secret от Facebook Developers

4. **Create Admin User**:
   - Отидете на **Users** tab
   - Кликнете **Add user**
   - Email: `methodman9090@gmail.com`
   - Password: (вашата парола)
   - След създаване, отидете в Firestore
   - Намерете документа в `/users/{uid}`
   - Променете `role` на `"admin"`

---

### 6️⃣ Тестване на приложението

```bash
# Стартирайте dev server
npm run dev
```

Отворете http://localhost:5173 и тествайте:

1. ✅ **Регистрация** - създайте нов потребител
2. ✅ **Login** - влезте с email/password
3. ✅ **Admin Login** - влезте като admin
4. ✅ **Pet Management** - добавете домашен любимец
5. ✅ **Sitter Search** - търсете гледачи
6. ✅ **Reservations** - създайте резервация

---

### 7️⃣ Build за Production

```bash
# Build приложението
npm run build

# Preview production build
npm run preview
```

---

### 8️⃣ Deploy to Firebase Hosting

```bash
# Инсталирайте Firebase CLI
npm install -g firebase-tools

# Login в Firebase
firebase login

# Инициализирайте Firebase Hosting
firebase init hosting

# Изберете:
# - Existing project → (вашия проект)
# - Public directory → dist
# - Single-page app → Yes
# - GitHub deploys → No (засега)

# Build и deploy
npm run build
firebase deploy
```

---

## 🔧 Troubleshooting

### Проблем: "Firebase not configured"
**Решение:** Проверете дали `.env` файлът съществува и съдържа валидни credentials.

### Проблем: "Permission denied" в Firestore
**Решение:** Проверете Firestore Security Rules и уверете се, че са правилно конфигурирани.

### Проблем: "No space left on device"
**Решение:**
```bash
npm cache clean --force
# Изтрийте node_modules и инсталирайте отново
Remove-Item -Path node_modules -Recurse -Force
npm install
```

### Проблем: Admin user няма admin role
**Решение:**
1. Отидете в Firestore Console
2. Намерете документа `/users/{admin_uid}`
3. Редактирайте полето `role` на `"admin"`

---

## 📚 Полезни ресурси

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

---

## ✨ Готово!

След завършване на тези стъпки, вашето Cozy Pets приложение ще работи напълно с Firebase! 🎉

Всички компоненти вече използват Firebase вместо Supabase:
- ✅ Authentication (Email/Password, Google, Facebook)
- ✅ Firestore Database (Users, Pets, Sitters, Reservations, Reviews, Payments)
- ✅ Firebase Storage (за снимки)
- ✅ Firebase Hosting (за deployment)
