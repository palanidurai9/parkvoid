-- Parkvoid Production Database Schema
-- Target: PostgreSQL
-- Scope: Chennai Pilot Launch

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('driver', 'owner', 'admin', 'agent', 'apartment_admin');
CREATE TYPE sub_plan AS ENUM ('starter', 'pro', 'apartment');
CREATE TYPE sub_status AS ENUM ('active', 'past_due', 'cancelled', 'trial');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'suv');

-- 2. USERS & AUTH
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(255),
    role user_role DEFAULT 'driver',
    
    -- Owner Specific
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    subscription_plan sub_plan,
    subscription_status sub_status,
    kyc_status kyc_status DEFAULT 'pending',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 3. PARKING INVENTORY
CREATE TABLE parking_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100), -- e.g., "T. Nagar Cluster A"
    city VARCHAR(50) DEFAULT 'Chennai',
    polygon GEOMETRY(POLYGON, 4326),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE parking_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    zone_id UUID REFERENCES parking_zones(id),
    
    title VARCHAR(150),
    address TEXT,
    location GEOMETRY(POINT, 4326), -- PostGIS for geo-search
    
    price_per_hour DECIMAL(10, 2),
    vehicle_type vehicle_type,
    
    -- Availability
    is_active BOOLEAN DEFAULT FALSE,
    admin_approved BOOLEAN DEFAULT FALSE,
    
    -- Media
    images TEXT[],
    cctv_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BOOKINGS & TRANSACTIONS
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES users(id),
    slot_id UUID REFERENCES parking_slots(id),
    
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2),
    tax_gst DECIMAL(10, 2),
    
    status VARCHAR(20), -- 'pending', 'confirmed', 'completed', 'cancelled'
    payment_id VARCHAR(100), -- Razorpay Order ID
    
    -- Check-in Flow
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SUBSCRIPTIONS (SaaS Logic)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    tier sub_plan NOT NULL,
    
    status sub_status DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    
    razorpay_sub_id VARCHAR(100),
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. INVOICES & PAYOUTS
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    subscription_id UUID REFERENCES subscriptions(id),
    
    amount DECIMAL(10, 2),
    gst_component DECIMAL(10, 2),
    pdf_url TEXT,
    status VARCHAR(20), -- 'paid', 'failed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payout_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    
    amount DECIMAL(10, 2), -- Amount credited to owner
    commission_deducted DECIMAL(10, 2),
    status VARCHAR(20), -- 'pending', 'settled'
    
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 7. AUDIT & LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(50), -- 'CREATE_SLOT', 'APPROVE_KYC', 'REFUND_BOOKING'
    resource_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
