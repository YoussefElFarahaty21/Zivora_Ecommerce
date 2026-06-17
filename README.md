# ShopHub — Full-Stack E-Commerce Application

A complete full-stack e-commerce web application built with React, Node.js/Express, TypeScript, Firebase Auth, Firestore, and Firebase Storage.

---

## Tech Stack

| Layer       | Technology                                    |
|-------------|-----------------------------------------------|
| Frontend    | React 18, Tailwind CSS, React Router v6, Recharts |
| Backend     | Node.js, Express, TypeScript                  |
| Auth        | Firebase Authentication                        |
| Database    | Cloud Firestore                               |
| Storage     | Firebase Storage                              |
| Dev Tools   | Vite, ts-node-dev                             |

---

## Project Structure

```
/
├── frontend/       # React + Vite + Tailwind CSS
└── backend/        # Express + TypeScript + Firebase Admin
```

---

## 1. Firebase Setup

### Step 1 — Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** → enter a project name → Continue
3. Disable Google Analytics (optional) → Create project

### Step 2 — Enable Authentication

1. In Firebase Console → **Build → Authentication → Get started**
2. Click **Email/Password** → Enable → Save

### Step 3 — Create Firestore Database

1. **Build → Firestore Database → Create database**
2. Choose **Start in test mode** (for development)
3. Select a region → Done

### Step 4 — Enable Firebase Storage

1. **Build → Storage → Get started**
2. Choose **Start in test mode** → Done

### Step 5 — Get Web App Config (for Frontend)

1. Project Settings (gear icon) → **General** tab
2. Scroll to **Your apps** → click **Add app** → Web (</> icon)
3. Register app → copy the `firebaseConfig` object
4. You'll need: `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`

### Step 6 — Get Service Account (for Backend)

1. Project Settings → **Service accounts** tab
2. Click **Generate new private key** → Download JSON
3. Open the JSON and copy the values for your `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Step 7 — Firestore Security Rules

For development, update your Firestore rules to allow authenticated reads:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // only backend writes via admin SDK
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
```

---

## 2. Environment Variables

### Backend — `/backend/.env`

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
PORT=5000
FRONTEND_URL=http://localhost:5173
```

> **Important:** The `FIREBASE_PRIVATE_KEY` must include the `-----BEGIN/END PRIVATE KEY-----` wrappers and the literal `\n` characters (they are converted to real newlines by the backend).

### Frontend — `/frontend/.env`

Create a file at `/frontend/.env` (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_API_URL=http://localhost:5000
```

---

## 3. Installation & Running

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## 4. Creating the First Admin User

Since new registrations default to `role: "customer"`, you need to manually promote an account to admin:

### Method 1 — Firebase Console

1. Register normally through the app at `/register`
2. Go to Firebase Console → **Firestore Database**
3. Navigate to the `users` collection
4. Find the document with your user's UID
5. Edit the `role` field from `"customer"` to `"admin"`
6. Sign out and sign back in — you'll be redirected to `/admin/dashboard`

### Method 2 — Firebase Admin SDK Script

Create a script `backend/scripts/makeAdmin.ts`:

```typescript
import * as admin from 'firebase-admin';
import '../src/config/firebase';
import { db } from '../src/config/firebase';

const makeAdmin = async (uid: string) => {
  await db.collection('users').doc(uid).update({ role: 'admin' });
  console.log(`User ${uid} is now an admin`);
};

makeAdmin('PASTE_USER_UID_HERE');
```

---

## 5. API Endpoints Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Required | Create user Firestore document |
| POST | `/api/auth/login` | Required | Get user data from Firestore |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | Get all products |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Required | Place new order |
| GET | `/api/orders/my-orders` | Required | Get current user's orders |
| GET | `/api/orders` | Admin | Get all orders |
| GET | `/api/orders/:id` | Required | Get single order |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users` | Admin | Get all users |
| GET | `/api/users/:id` | Admin | Get single user |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/overview` | Admin | Revenue, orders, products, users count |
| GET | `/api/analytics/revenue` | Admin | Revenue last 30 days |
| GET | `/api/analytics/orders` | Admin | Orders by status |
| GET | `/api/analytics/top-products` | Admin | Top 5 products by orders |

---

## 6. Features

### Customer
- Browse product catalog with search and filters (category, price, in-stock)
- Responsive grid: 1 col → 2 col → 4 col
- Product detail page with quantity selector
- Shopping cart with real-time totals (persisted in localStorage)
- Wishlist (persisted in localStorage)
- Multi-step checkout with form validation
- Order confirmation page with order summary
- Order history with expandable details

### Admin
- Dashboard with 4 stat cards + 3 charts (revenue, order status, top products)
- Product management: add/edit/delete with image upload to Firebase Storage
- Order management: view all orders, update status
- User list: view all registered users

### Security
- Firebase token verification on all protected routes
- Role-based access control (customer vs admin)
- Admin routes protected by `adminMiddleware`
- Frontend route guards via `PrivateRoute` and `AdminRoute`

---

## 7. Firestore Collections

### `users`
```
{
  id: string (Firebase Auth UID),
  email: string,
  role: "customer" | "admin",
  createdAt: ISO string
}
```

### `products`
```
{
  id: string (auto),
  name: string,
  description: string,
  price: number,
  category: string,
  imageUrl: string,
  stock: number,
  createdAt: ISO string
}
```

### `orders`
```
{
  id: string (auto),
  userId: string,
  customerName: string,
  customerEmail: string,
  shippingAddress: { fullName, email, phone, address, city, country },
  items: [{ productId, name, price, quantity, imageUrl }],
  subtotal: number,
  shippingFee: number,
  total: number,
  status: "pending" | "shipped" | "delivered",
  createdAt: ISO string
}
```
