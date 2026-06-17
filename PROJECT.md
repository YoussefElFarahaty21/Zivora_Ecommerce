# Zivora — Full-Stack E-Commerce Platform

## Overview

Zivora is a full-stack e-commerce web application built as a portfolio project. It features a modern customer-facing storefront alongside a fully-featured admin panel, real-time authentication, order management, analytics dashboards, and cart/wishlist persistence — all powered by Firebase and a custom REST API.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS 3 |
| Auth & Database | Firebase (Auth + Firestore) |
| Charts | Recharts |
| Notifications | React Hot Toast |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 4 |
| Language | TypeScript |
| Auth | Firebase Admin SDK (ID token verification) |
| Database | Firestore (via Firebase Admin) |
| Environment | dotenv |
| Dev Server | ts-node-dev |

---

## Project Structure

```
Ecommerce/
├── frontend/                   # Vite + React SPA
│   └── src/
│       ├── context/            # AuthContext, CartContext
│       ├── hooks/              # useAuth, useCart
│       ├── services/           # firebase, productService, orderService, userService
│       ├── utils/              # formatCurrency, formatDate
│       ├── pages/
│       │   ├── customer/       # Home, ProductDetail, Cart, Wishlist, Checkout,
│       │   │                   # OrderConfirmation, OrderHistory, Profile
│       │   ├── admin/          # Dashboard, Products, Orders, Users
│       │   └── auth/           # Login, Register, NotFound
│       └── components/
│           ├── layout/         # Navbar, Footer, MobileMenu, Sidebar
│           ├── ui/             # Button, Input, Modal, Card, Badge, Spinner
│           ├── customer/       # ProductCard, CartItem, WishlistItem, OrderCard,
│           │                   # CheckoutSteps
│           └── admin/          # StatCard, ProductRow, OrderRow, UserRow,
│                               # RevenueChart, OrderStatusChart, TopProductsChart
│
└── backend/                    # Express + TypeScript REST API
    └── src/
        ├── config/             # firebase.ts (Admin SDK init)
        ├── routes/             # authRoutes, productRoutes, orderRoutes,
        │                       # userRoutes, analyticsRoutes
        ├── controllers/        # authController, productController, orderController,
        │                       # userController, analyticsController
        ├── services/           # userService, productService, orderService,
        │                       # analyticsService
        ├── middleware/         # authMiddleware, adminMiddleware, errorMiddleware
        ├── interfaces/         # User, Product, Order (TypeScript types)
        └── scripts/            # seed.ts (populates Firestore with product catalog)
```

---

## Features

### Customer-Facing
- **Product Catalog** — Browse all products with filtering and detail pages
- **Shopping Cart** — Add/remove items; persisted to `localStorage`
- **Wishlist** — Save products for later; persisted to `localStorage` with cross-tab sync via custom events
- **Checkout Flow** — Multi-step checkout with shipping address and order summary
- **Order History** — View past orders with status tracking
- **User Profile** — Manage account information
- **Authentication** — Email/password sign-up and login via Firebase Auth

### Admin Panel (role-gated)
- **Dashboard** — Revenue, order, product, and user statistics with animated charts
- **Product Management** — Full CRUD for the product catalog
- **Order Management** — View all orders and update order status
- **User Management** — Browse all registered users

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/register` | Authenticated | Register user in Firestore |
| POST | `/login` | Authenticated | Return user profile |

### Products — `/api/products`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Public | List all products |
| GET | `/:id` | Public | Get product by ID |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Orders — `/api/orders`
| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Place a new order |
| GET | `/my-orders` | Customer | Get current user's orders |
| GET | `/:id` | Customer | Get single order (own only) |
| GET | `/` | Admin | Get all orders |
| PUT | `/:id/status` | Admin | Update order status |

### Users — `/api/users`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/` | Admin | List all users |
| GET | `/:id` | Admin | Get user by ID |

### Analytics — `/api/analytics`
| Method | Path | Access | Description |
|---|---|---|---|
| GET | `/overview` | Admin | Total revenue, orders, products, users |
| GET | `/revenue` | Admin | Daily revenue for the last 30 days |
| GET | `/orders` | Admin | Order count by status |
| GET | `/top-products` | Admin | Most ordered products by quantity |

---

## Data Models

### User
```ts
{
  email: string;
  role: 'customer' | 'admin';
  createdAt: Timestamp;
  // Firestore doc ID = Firebase Auth UID
}
```

### Product
```ts
{
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images?: string[];
  stock: number;
  createdAt: Timestamp;
}
```

### Order
```ts
{
  userId: string;
  customerInfo: { name: string; email: string };
  shippingAddress: { street: string; city: string; country: string; ... };
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: Timestamp;
}
```

---

## Authentication & Authorization Flow

```
Client signs in via Firebase Auth
        ↓
Firebase returns an ID Token (JWT)
        ↓
Client sends token as: Authorization: Bearer <token>
        ↓
authMiddleware verifies token via Firebase Admin SDK
        ↓
Loads users/{uid} from Firestore → attaches role to request
        ↓
adminMiddleware (on protected routes) → 403 if role !== 'admin'
```

Frontend reads role from `users/{uid}` in Firestore via `AuthContext` after login to determine which routes to show.

---

## Environment Variables

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project with **Authentication** and **Firestore** enabled
- A Firebase service account key (for the backend)

### Setup

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment variables
# Copy and fill in both .env files as shown above

# 3. Seed the product catalog (optional)
cd backend && npm run seed

# 4. Start the development servers
cd backend && npm run dev   # → http://localhost:5000
cd frontend && npm run dev  # → http://localhost:5173
```

### Firestore Security Rules (recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if false; // backend only
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // backend only
    }
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false; // backend only
    }
  }
}
```

---

## API Response Format

All API responses follow a consistent shape:

```json
{ "success": true, "data": { ... } }
{ "success": false, "message": "Error description", "error": "..." }
```

---

## Architecture Notes

- **Layered backend:** Routes → Controllers → Services → Firestore. Controllers handle HTTP, services handle all business logic and DB access.
- **Role from Firestore, not JWT claims:** The user role is stored in a `users/{uid}` Firestore document and is read by the backend on each authenticated request.
- **Cart and Wishlist are client-side only:** Both use `localStorage` for persistence; no backend involvement required for these features.
- **Admin SDK for all writes:** The Express backend uses the Firebase Admin SDK exclusively. The React client only reads `users/{uid}` directly via the Firestore client SDK (for role detection).
- **Seed script:** `npm run seed` in the backend clears and re-populates the `products` collection with a full catalog including Unsplash image URLs.
