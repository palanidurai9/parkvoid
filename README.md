# 🅿️ Parkvoid

> **Find. Book. Park.** — The smartest way to park in Chennai.

Parkvoid is a **full-stack parking marketplace SaaS** targeting urban India, starting with a Chennai pilot launch. It connects drivers looking for secure parking with space owners who want to monetise idle square footage — all managed by an admin approval layer and a subscription-based monetisation model.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📸 Screenshots

| Landing Page | Driver Map Search | Owner Dashboard | Admin Panel |
|---|---|---|---|
| *Find & Book* | *Interactive Map* | *Earnings & Slots* | *Approvals & Analytics* |

---

## ✨ Features

### 🚗 Driver
- **Interactive map** powered by Leaflet + OpenStreetMap — browse real-time parking pins across Chennai (T. Nagar, Adyar, OMR, etc.)
- **Slot booking** — pick a time slot, select duration, and confirm in seconds
- **Simulated UPI / Razorpay** payment flow
- **Digital QR Code Pass** generated instantly after payment
- **My Bookings** — full booking history with status tracking (`active`, `completed`, `cancelled`, `disputed`)

### 🏠 Owner
- **List a parking spot** — title, address, vehicle type, price per hour, open/close hours
- **Admin approval gate** — new listings enter a `pending` state before going live on the map
- **Revenue dashboard** — earnings summary, active slot count, monthly chart
- **Subscription tiers** — *Free*, *Starter*, and *Pro* plans that control slot limits and commission rates
- **Wallet** — track payouts and pending settlements

### 🛡️ Admin
- **Pending listings queue** — approve or reject owner submissions
- **User management** — view all drivers, owners; roles and KYC status
- **Subscription management** — manage plan overrides, view revenue
- **Transaction ledger** — platform-wide booking and payout history
- **Dispute resolution** centre
- **Audit logs** — every critical action is recorded

### 📄 Legal Pages
- Terms of Service
- Privacy Policy
- Refund & Cancellation Policy

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **ORM / DB** | Prisma 5 + SQLite (dev) → PostgreSQL (prod) |
| **Maps** | Leaflet + React-Leaflet + OpenStreetMap |
| **Payments** | Razorpay (sandbox) |
| **Auth** | Custom `AuthContext` via `localStorage` (dev) → NextAuth / Supabase Auth (prod) |
| **QR Codes** | `qrcode.react` |
| **Icons** | Lucide React |
| **Date Utils** | date-fns |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/parkvoid.git
cd parkvoid

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set DATABASE_URL (see below)

# 4. Push the database schema and seed demo data
npx prisma db push
npx ts-node prisma/seed.ts

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file at the project root:

```env
# SQLite (local dev)
DATABASE_URL="file:./prisma/dev.db"

# Razorpay (sandbox keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 👤 Demo Accounts

Use the **Quick Login** buttons on `/login` for instant, passwordless demo access.

| Role | Demo User | Phone | Capabilities |
|---|---|---|---|
| **Driver** | Ravi Kumar | `9876543210` | Search map, Book slots, View passes |
| **Owner** | Lakshmi N. | `9876543211` | Add listings, View revenue, Manage slots |
| **Admin** | Parkvoid Admin | `0000000000` | Approve listings, Manage users, View analytics |

> **Note:** The current MVP uses `localStorage` for session persistence. No password is required — phone number is the login key.

---

## 🗺️ App Routes

```
/                          → Landing page (Hero + How it works)
/login                     → Role-based quick login
/search                    → Interactive map + slot browsing
/book/[slotId]             → Booking flow (time, duration, payment)
/bookings                  → Driver's booking history
/dashboard                 → Driver dashboard (active pass, quick actions)
/dashboard/owner           → Owner dashboard (revenue, slots, subscription)
/dashboard/owner/listing   → Add / manage parking listings
/dashboard/owner/bookings  → Owner's incoming booking history
/dashboard/owner/wallet    → Payouts & wallet balance
/dashboard/owner/settings  → Owner profile & subscription settings
/admin                     → Admin overview (metrics, pending queue)
/admin/users               → User management
/admin/parking-lots        → All listings management
/admin/subscriptions       → Subscription & revenue management
/admin/transactions        → Platform transaction ledger
/admin/settings            → Admin settings
/how-it-works              → Feature explanation page
/help                      → Support & FAQ
/legal/terms               → Terms of Service
/legal/privacy             → Privacy Policy
/legal/refund              → Refund & Cancellation Policy
```

---

## 🗄️ Database Schema

Managed by **Prisma**. Core models:

| Model | Purpose |
|---|---|
| `User` | Drivers, Owners, Admins — unified user table with role |
| `ParkingSlot` | Owner-listed spots with geo coordinates and status |
| `Booking` | Driver reservations with payment & QR code data |
| `Subscription` | SaaS tier per owner (`STARTER`, `PRO`) |
| `Invoice` | Billing records per subscription cycle |
| `PayoutLedger` | Commission-deducted credits per booking |
| `AuditLog` | Action trail for every admin/money event |

```bash
# View the database in Prisma Studio
npx prisma studio
```

---

## 💳 Subscription Plans (Owner-Facing SaaS)

| Plan | Price | Slot Limit | Commission |
|---|---|---|---|
| **Free** | ₹0 / mo | 1 slot | 20% |
| **Starter** | ₹499 / mo | 5 slots | 15% |
| **Pro** | ₹1,499 / mo | Unlimited | 10% |

---

## 🧪 Key Flows to Test

### Driver: Search & Book
1. Log in as **Driver**
2. Go to `/search` → browse the interactive map
3. Click a map pin → **Book Slot**
4. Select time & duration → **Pay** (sandbox Razorpay)
5. View your **QR Code Pass**
6. Check `/bookings` for history

### Owner: List a Spot
1. Log in as **Owner**
2. Go to **Owner Dashboard** → **Add Parking**
3. Fill in the form (title, address, price, hours)
4. Submit → status is `pending` (not yet visible on map)

### Admin: Approve a Listing
1. Log in as **Admin**
2. See the **Pending Requests** on the dashboard
3. Click the ✅ checkmark to approve
4. Log back in as **Driver** → the new slot now appears on the map!

---

## 📁 Project Structure

```
parkvoid/
├── app/
│   ├── actions/           # Next.js Server Actions (booking, slot creation)
│   ├── admin/             # Admin panel pages (users, subscriptions, transactions)
│   ├── book/[slotId]/     # Booking flow
│   ├── bookings/          # Driver booking history
│   ├── components/        # Shared UI components (Map, Header, etc.)
│   ├── context/           # AuthContext (session management)
│   ├── dashboard/         # Driver & Owner dashboards
│   ├── help/              # Help & FAQ page
│   ├── how-it-works/      # Feature explainer page
│   ├── legal/             # ToS, Privacy, Refund pages
│   ├── login/             # Quick-login page
│   ├── search/            # Map search page
│   ├── globals.css        # Global styles + brand tokens
│   ├── layout.tsx         # Root layout with AuthProvider
│   └── page.tsx           # Landing page
├── lib/
│   ├── store.ts           # localStorage DB abstraction (dev)
│   └── types.ts           # Global TypeScript types & interfaces
├── prisma/
│   ├── schema.prisma      # Prisma data model
│   ├── seed.ts            # Demo data seeder
│   └── dev.db             # SQLite dev database
├── public/                # Static assets
├── database_schema.sql    # Raw PostgreSQL schema (production reference)
├── DEMO_GUIDE.md          # Quick-start guide for demos
└── PRODUCTION_ROADMAP.md  # Phase-by-phase production plan
```

---

## 🛣️ Production Roadmap

### Phase 1 — Infrastructure
- [ ] Migrate from `localStorage` → **PostgreSQL** (Supabase / AWS RDS)
- [ ] Replace custom auth → **Supabase Auth** (Phone OTP via Msg91)
- [ ] Enforce RBAC in **Next.js Middleware**
- [ ] Razorpay **webhooks** for reliable payment confirmation
- [ ] S3/R2 storage for owner property photos

### Phase 2 — Operations & Compliance
- [ ] KYC portal (Aadhaar / Property tax receipt upload)
- [ ] Geo-fencing for Chennai zones (T. Nagar, Adyar, OMR)
- [ ] Signed, unique QR codes for check-in / check-out
- [ ] RazorpayX vendor payouts
- [ ] GST-compliant invoice generation

### Phase 3 — Scale
- [ ] Redis caching layer for map search
- [ ] Sentry error monitoring
- [ ] GitHub Actions CI/CD pipeline
- [ ] Google Maps Platform integration (Distance Matrix + ETAs)

> See [`PRODUCTION_ROADMAP.md`](./PRODUCTION_ROADMAP.md) for the full breakdown.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## 📬 Contact

Built with ❤️ for Chennai's parking problem.

- **Product**: [parkvoid.in](https://parkvoid.in) *(coming soon)*
- **Support**: help@parkvoid.in
- **Twitter / X**: [@parkvoid](https://twitter.com/parkvoid)
