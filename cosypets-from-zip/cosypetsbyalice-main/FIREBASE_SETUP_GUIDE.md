# 🔥 Firebase Setup Guide for Cozy Pets

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. **Project name**: `CosyPets-Production`
4. **Google Analytics**: Enable (recommended)
5. **Analytics account**: Create new or use existing
6. Click **"Create project"**

## Step 2: Register Web App

1. In your Firebase project, click the **Web icon** (`</>`)
2. **App nickname**: `CosyPets Web App`
3. ☑️ **Also set up Firebase Hosting** (check this!)
4. Click **"Register app"**
5. **IMPORTANT**: Copy the `firebaseConfig` object - you'll need it!

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable these providers:
   - ✅ **Email/Password**
   - ✅ **Google** (add Web client ID)
   - ✅ **Facebook** (requires Facebook App setup)

### For Google Auth:
- No additional setup needed!

### For Facebook Auth:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app or use existing
3. Add **Facebook Login** product
4. Copy **App ID** and **App Secret**
5. Paste in Firebase Console

## Step 4: Setup Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. **Start in**: `Production mode`
4. **Location**: `eur3 (europe-west)` (closest to Bulgaria)
5. Click **"Enable"**

### Create Collections:

Run this in Firestore Console or via code:

```
/users/{userId}
  - name: string
  - email: string
  - phone: string
  - role: string (owner|sitter|admin)
  - created_at: timestamp

/sitters/{userId}
  - profile_title: string
  - bio: string
  - location: string
  - hourly_rate: number
  - rating: number
  - approved: boolean

/pets/{petId}
  - user_id: string
  - name: string
  - breed: string
  - age: number

/reservations/{reservationId}
  - owner_id: string
  - sitter_id: string
  - pet_id: string
  - start_date: timestamp
  - end_date: timestamp
  - status: string
  - total_price: number

/reviews/{reviewId}
  - sitter_id: string
  - reviewer_id: string
  - rating: number
  - comment: string
  - created_at: timestamp

/payments/{paymentId}
  - reservation_id: string
  - amount: number
  - status: string
  - created_at: timestamp
```

## Step 5: Configure Security Rules

Go to **Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && request.auth.token.email == 'methodman9090@gmail.com';
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId) || isAdmin();
    }
    
    // Sitters collection
    match /sitters/{sitterId} {
      allow read: if true; // Public profiles
      allow create: if isSignedIn();
      allow update: if isOwner(sitterId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Pets collection
    match /pets/{petId} {
      allow read, write: if isSignedIn();
    }
    
    // Reservations collection
    match /reservations/{reservationId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn() || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true; // Public reviews
      allow create: if isSignedIn();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if isSignedIn() || isAdmin();
      allow write: if isAdmin();
    }
  }
}
```

## Step 6: Setup Storage

1. Go to **Build → Storage**
2. Click **"Get started"**
3. **Start in**: `Production mode`
4. **Location**: Same as Firestore (`eur3`)
5. Click **"Done"**

### Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /pets/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /sitters/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Create .env File

Create `.env` in project root:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Admin Configuration
VITE_ADMIN_EMAIL=methodman9090@gmail.com
```

## Step 8: Install Firebase CLI

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

Select:
- Use existing project: **CosyPets-Production**
- Public directory: `dist`
- Single-page app: **Yes**
- GitHub deploys: **No** (for now)

## Done! ✅

Your Firebase project is now ready. The app will automatically connect once you add the `.env` file!

---

**Next steps:**
1. Copy your Firebase config to `.env`
2. Run `npm run dev` to test
3. Check Firebase Console to see auth users appearing
