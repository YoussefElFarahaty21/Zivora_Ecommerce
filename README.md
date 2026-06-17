# Zivora — E-Commerce Platform

**Zivora** is a full-featured online store built for businesses that want a modern shopping experience for their customers and a straightforward back office for their team. Shoppers can browse products, manage a cart and wishlist, place orders, and track their purchase history. Store owners and staff with admin access get a dedicated dashboard to monitor sales, manage inventory, fulfil orders, and view registered customers.

This document is your handoff guide — everything you or a future developer needs to run, configure, and deploy the application.

---

## Key Features

### Customer Features

- **Product catalogue** — Browse all products on a responsive storefront with search, category filters, price limits, in-stock filtering, and sorting (price, name, availability).
- **Product detail pages** — View images, descriptions, pricing, stock status, and average customer ratings. Signed-in customers can leave a star rating.
- **Shopping cart** — Add items, adjust quantities, and see live totals. The cart is saved in the browser so it persists between visits.
- **Wishlist** — Save products for later (browser-based, requires sign-in to add items).
- **Account registration & sign-in** — Secure email/password accounts powered by Firebase Authentication.
- **Checkout** — A guided two-step checkout collects shipping details, applies a flat shipping fee, and places the order.
- **Order confirmation & history** — Customers receive an on-screen confirmation after purchase and can revisit all past orders with status updates (Pending → Shipped → Delivered).
- **Profile management** — Update display name, phone number, and saved address details.

### Admin Features

- **Analytics dashboard** — At-a-glance overview of total revenue, orders, products, and registered users, plus interactive charts for 30-day revenue, order status breakdown, and top-selling products.
- **Product management** — Add, edit, and remove products (name, description, price, category, stock, and image URL) from a single admin screen.
- **Order management** — View every order with customer and shipping details; update fulfilment status as orders progress.
- **User directory** — See all registered accounts with search by email or role.
- **Role-based access** — Only users with the `admin` role can access the admin area; customers are automatically restricted to the storefront.

> **Note:** Checkout records orders in the system but does not process live card payments. A payment gateway (e.g. Stripe, PayPal) can be added in a future phase if required.

---

## Screenshots

| Overview |
|:---:|
| ![Zivora storefront overview](portfolio-screenshots/enhanced/hero_combined.png) |

### Storefront

**Home & product browsing**

![Home page](portfolio-screenshots/enhanced/01_home.png)

![Product catalogue](portfolio-screenshots/enhanced/02_products.png)

**Product detail**

![Product detail page](portfolio-screenshots/enhanced/03_product_detail.png)

**Cart**

![Shopping cart](portfolio-screenshots/enhanced/04_cart.png)

**Sign in / Register**

![Authentication](portfolio-screenshots/enhanced/05_auth.png)

---

## Tech Stack

| Technology | Role | Why it benefits you |
|---|---|---|
| **React + Vite** (frontend) | The customer-facing website and admin interface | Fast, modern, and easy for developers to maintain or extend. |
| **Node.js + Express + TypeScript** (backend) | Secure API for products, orders, users, and analytics | Keeps business logic on a dedicated server with type-safe, reliable code. |
| **Firebase Authentication** | Customer and admin sign-in | Industry-standard, secure login without building auth from scratch. |
| **Cloud Firestore** | Database for users, products, orders, and ratings | Real-time, scalable cloud database with no server management. |
| **Tailwind CSS** | Styling | Consistent, responsive design across desktop and mobile. |
| **Recharts** | Admin dashboard charts | Clear visual reporting for revenue and order trends. |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v18 or later** (includes `npm`)
- A [Firebase](https://console.firebase.google.com/) project with **Email/Password** authentication enabled and a **Firestore** database created (see [Configuration](#configuration) below)

### 1. Clone the repository

```bash
git clone https://github.com/YoussefElFarahaty21/Zivora_Ecommerce.git
cd Zivora_Ecommerce
```

### 2. Set up environment variables

Create the backend and frontend env files as described in the [Configuration](#configuration) section before running the app.

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API will be available at **http://localhost:5000**.  
Verify it is running by visiting **http://localhost:5000/health** in your browser.

### 4. Start the frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The storefront will open at **http://localhost:5173**.

### 5. (Optional) Load sample products

If your Firestore database is empty, you can populate it with demo products:

```bash
cd backend
npm run seed
```

This requires the same Firebase credentials in `backend/.env` used by the running server.

### 6. Create your first admin account

1. Register a new account at **http://localhost:5173/register**.
2. Open the [Firebase Console](https://console.firebase.google.com/) → **Firestore Database** → `users` collection.
3. Find the document matching your new user's ID and change the `role` field from `"customer"` to `"admin"`.
4. Sign out and sign back in — you will be redirected to the admin dashboard.

---

## Configuration

### Firebase project setup (one-time)

1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Firestore Database** (production mode recommended for live deployments).
4. Register a **Web app** under Project Settings → General → Your apps, and copy the config values for the frontend.
5. Under Project Settings → **Service accounts**, click **Generate new private key** and download the JSON file for the backend.

### Backend environment variables

Create a file at `backend/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
PORT=5000
FRONTEND_URL=http://localhost:5173
```

| Variable | Required | Purpose | Where to get it |
|---|---|---|---|
| `FIREBASE_PROJECT_ID` | Yes | Identifies your Firebase project | Service account JSON → `project_id`, or Firebase Console → Project Settings |
| `FIREBASE_PRIVATE_KEY` | Yes | Server-side authentication to Firebase | Service account JSON → `private_key` (keep the `\n` line breaks) |
| `FIREBASE_CLIENT_EMAIL` | Yes | Service account email for the backend | Service account JSON → `client_email` |
| `PORT` | No | Port the API listens on (default: `5000`) | Set as needed for your hosting provider |
| `FRONTEND_URL` | No | Allowed origin for browser requests (default: `http://localhost:5173`) | Set to your live storefront URL in production |

### Frontend environment variables

Copy the example file and fill in your values:

```bash
cd frontend
cp .env.example .env
```

| Variable | Required | Purpose | Where to get it |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | Connects the app to your Firebase project | Firebase Console → Project Settings → Your apps → Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Authentication domain | Same web app config → `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase project identifier | Same web app config → `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | Included in the template for future use; not required by the current build | Same web app config → `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase messaging identifier | Same web app config → `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase app identifier | Same web app config → `appId` |
| `VITE_API_URL` | Yes | URL of the backend API | `http://localhost:5000` locally; your deployed API URL in production |

> **Security reminder:** Never commit `.env` files or share private keys publicly. The `.gitignore` file already excludes them.

---

## Deployment

### Frontend

1. Set all `VITE_*` environment variables in your hosting provider's dashboard.
2. Build the production bundle:

   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. Deploy the `frontend/dist` folder to a static host such as **Vercel**, **Netlify**, or **Firebase Hosting**.
4. Set `VITE_API_URL` to your live backend URL before building.

### Backend

1. Set all backend environment variables on your host (see table above).
2. Set `FRONTEND_URL` to your live storefront URL (e.g. `https://your-store.com`).
3. Build and start:

   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

4. Deploy to a Node.js host such as **Railway**, **Render**, or **Fly.io**. The platform must expose the port defined by `PORT` (default `5000`).

### After deployment

- Confirm **http://your-api-url/health** returns a success response.
- Test sign-in, product browsing, and (with an admin account) the dashboard.
- Review [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started) before going live — restrict write access so only your backend service account can modify products and orders.

---

## Project Structure

```
Zivora_Ecommerce/
├── frontend/                  # Customer storefront & admin UI (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── customer/      # Home, product detail, cart, checkout, orders, profile, wishlist
│   │   │   └── admin/         # Dashboard, products, orders, users
│   │   ├── components/        # Reusable UI, layout, and chart components
│   │   ├── context/           # Auth and shopping-cart state
│   │   ├── hooks/             # Data-fetching and auth helpers
│   │   └── services/          # API calls to the backend
│   └── .env.example           # Template for frontend environment variables
│
├── backend/                   # REST API (Express + TypeScript)
│   ├── src/
│   │   ├── config/            # Firebase Admin SDK initialisation
│   │   ├── controllers/       # Request handlers (auth, products, orders, users, analytics)
│   │   ├── routes/            # API route definitions (/api/...)
│   │   ├── services/          # Business logic and Firestore queries
│   │   ├── middleware/        # Authentication, admin checks, error handling
│   │   └── scripts/           # Database seeding and maintenance utilities
│   └── .env                   # Backend secrets (create locally — not in repo)
│
└── portfolio-screenshots/     # Marketing / handoff screenshots included in this README
```

### Firestore collections

| Collection | Contents |
|---|---|
| `users` | Account email, role (`customer` or `admin`), creation date |
| `products` | Product catalogue (name, price, category, stock, images) |
| `products/{id}/ratings` | Customer star ratings per product |
| `orders` | Order details, line items, shipping address, status, totals |

---

## Support / Handoff

This application was **custom-built for your business** as a complete e-commerce foundation — storefront, checkout flow, order management, and admin reporting in one package.

**What is included in this delivery**

- Full source code for the frontend and backend
- Firebase integration for authentication and data storage
- Admin dashboard with sales analytics
- This README and environment templates

**For ongoing changes** — new features, payment integration, design updates, or deployment assistance — contact the developer who delivered this project. When engaging another developer, share this repository and ensure they have access to your Firebase project and hosting accounts.

---

*Built with care for Zivora.*
