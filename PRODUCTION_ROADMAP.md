# Parkvoid Production Roadmap - Chennai Pilot Launch 🚀

## Phase 1: Core Infrastructure Migration (Current Step)
Moving from `localStorage` demo logic to production-grade infrastructure.

### 1. Data Layer (Migration to Postgres)
- [ ] **Database**: Provision PostgreSQL (e.g., Supabase/AWS RDS).
- [ ] **Schema**: Migrate `lib/types.ts` to SQL Tables (`users`, `bookings`, `subscriptions`, `wallets`, `kYC`).
- [ ] **ORM**: Integrate `Prisma` or `Drizzle` for type-safe DB access.
- [ ] **Storage**: Set up S3/R2 bucket for "Property Proofs" and "Car Images".

### 2. Authentication (Production Security)
- [ ] **Auth Provider**: Switch `AuthContext` to use NextAuth.js or Supabase Auth.
- [ ] **OTP Service**: Integrate Indian SMS Gateway (Msg91/Twilio) for `+91` numbers.
- [ ] **RBAC**: Enforce Role-Based Access Control in middleware.

### 3. Payments Audit (Razorpay Production)
- [ ] **Webhooks**: Implement secure webhook handlers to update DB on payment success/failure.
- [ ] **Payouts**: Integrate RazorpayX or solving for Vendor Payouts.
- [ ] **GST**: Ensure all amounts stored are pre/post tax compliant.

## Phase 2: Operations & Compliance
Tools required for running the business in Chennai.

### 1. Parking Operations
- [ ] **KYC Portal**: Upload flow for Aadhar/Property tax receipt for owners.
- [ ] **Geo-Fencing**: Define Chennai Polygon zones (T. Nagar, Adyar, OMR).
- [ ] **QR Implementation**: Generate unique, signed QR codes for check-in/out.

### 2. Legal & Trust
- [x] Terms of Service Page (Designing Now)
- [x] Privacy Policy URL (Designing Now)
- [x] Refund & Cancellation Policy (Designing Now)
- [ ] Audit Logging: Track every `admin` action and `money` movement.

## Phase 3: Reliability & Scaling
Preparing for 10k+ users.

- [ ] **Logging**: Integrate structured logging (e.g., Pino/Winston) to capture errors.
- [ ] **Monitoring**: Set up Sentry for frontend/backend error tracking.
- [ ] **Caching**: Redis layer for "Search Slots" to reduce DB hits.
- [ ] **CI/CD**: GitHub Actions pipeline for automated testing and deployment.

---

## Technical Stack Selection (Production)
| Component | Choice | Reason |
|-----------|--------|--------|
| **Database** | PostgreSQL | Relational integrity for bookings/money is non-negotiable. |
| **Auth** | Supabase Auth | Built-in Phone OTP + Row Level Security. |
| **Payments** | Razorpay | Best success rates in India + Subscription support. |
| **Maps** | Google Maps Platform | Distance Matrix API for accurate ETAs. |
| **Server** | Vercel / AWS | Vercel for Frontend, AWS/DigitalOcean for Cron jobs/Workers. |

