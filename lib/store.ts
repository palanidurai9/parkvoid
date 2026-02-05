import { User, ParkingSlot, Booking, Review, Dispute, Subscription, Invoice } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
    USERS: 'parkvoid_users',
    SLOTS: 'parkvoid_slots_v2',
    BOOKINGS: 'parkvoid_bookings',
    REVIEWS: 'parkvoid_reviews',
    DISPUTES: 'parkvoid_disputes',
    CURRENT_USER: 'parkvoid_current_user_id',
    SUBSCRIPTIONS: 'parkvoid_subscriptions',
    INVOICES: 'parkvoid_invoices',
};

// Seed Data
// Seed Data
const SEED_USERS: User[] = [
    { id: 'driver1', name: 'Ravi Kumar', phone: '9000000000', role: 'driver', rating: 4.8 },
    // Starter Hosts
    { id: 'owner1', name: 'Lakshmi Narayanan', phone: '9000000001', role: 'owner', rating: 4.5, walletBalance: 1200, subscriptionPlan: 'starter', subscriptionStatus: 'active', trialUsed: true },
    { id: 'owner2', name: 'Suresh Reddy', phone: '9000000011', role: 'owner', rating: 4.2, subscriptionPlan: 'starter', subscriptionStatus: 'active' },
    // Pro Hosts
    { id: 'owner_pro1', name: 'Vikram Singh', phone: '9000000021', role: 'owner', rating: 4.9, subscriptionPlan: 'pro', subscriptionStatus: 'active' },
    // Apartment Hosts
    { id: 'owner_apt1', name: 'Prestige Apartments', phone: '9000000031', role: 'owner', rating: 5.0, subscriptionPlan: 'apartment', subscriptionStatus: 'active' },

    { id: 'admin1', name: 'Parkvoid Admin', phone: '9000000002', role: 'admin' },
];

const SEED_SUBSCRIPTIONS: Subscription[] = [
    { id: 'sub1', ownerId: 'owner1', plan: 'starter', amount: 499, status: 'active', startDate: '2023-11-01', endDate: '2026-03-01', autoRenew: true },
    { id: 'sub2', ownerId: 'owner2', plan: 'starter', amount: 499, status: 'active', startDate: '2024-01-15', endDate: '2026-02-15', autoRenew: true },
    { id: 'sub3', ownerId: 'owner_pro1', plan: 'pro', amount: 1499, status: 'active', startDate: '2023-10-01', endDate: '2026-02-28', autoRenew: true },
    { id: 'sub4', ownerId: 'owner_apt1', plan: 'apartment', amount: 4999, status: 'active', startDate: '2023-01-01', endDate: '2026-02-01', autoRenew: true },
];

const SEED_INVOICES: Invoice[] = [
    { id: 'inv1', ownerId: 'owner1', subscriptionId: 'sub1', amount: 499, date: '2024-01-01', status: 'paid', pdfUrl: '#' },
    { id: 'inv2', ownerId: 'owner1', subscriptionId: 'sub1', amount: 499, date: '2024-02-01', status: 'paid', pdfUrl: '#' },
];

const SEED_SLOTS: ParkingSlot[] = [];

// Helpers
const getStorage = <T>(key: string, seed: T): T => {
    if (typeof window === 'undefined') return seed; // server side
    const stored = localStorage.getItem(key);
    if (!stored) {
        localStorage.setItem(key, JSON.stringify(seed));
        return seed;
    }
    return JSON.parse(stored);
};

const setStorage = <T>(key: string, data: T) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
};

// API
export const db = {
    users: {
        getAll: () => getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS),
        getById: (id: string) => getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS).find(u => u.id === id),
        login: (phone: string) => getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS).find(u => u.phone === phone),
        create: (user: User) => {
            const users = getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
            users.push(user);
            setStorage(STORAGE_KEYS.USERS, users);
            return user;
        }
    },
    slots: {
        getAll: () => getStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, SEED_SLOTS),
        add: (slot: ParkingSlot) => {
            const slots = getStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, SEED_SLOTS);
            slots.push(slot);
            setStorage(STORAGE_KEYS.SLOTS, slots);
        },
        update: (updatedSlot: ParkingSlot) => {
            const slots = getStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, SEED_SLOTS);
            const index = slots.findIndex(s => s.id === updatedSlot.id);
            if (index !== -1) {
                slots[index] = updatedSlot;
                setStorage(STORAGE_KEYS.SLOTS, slots);
            }
        },
        delete: (id: string) => {
            const slots = getStorage<ParkingSlot[]>(STORAGE_KEYS.SLOTS, SEED_SLOTS);
            const newSlots = slots.filter(s => s.id !== id);
            setStorage(STORAGE_KEYS.SLOTS, newSlots);
        }
    },
    bookings: {
        getAll: () => getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []),
        create: (booking: Booking) => {
            const bookings = getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
            bookings.push(booking);
            setStorage(STORAGE_KEYS.BOOKINGS, bookings);
        },
        updateStatus: (id: string, status: string) => { // generic string to satisfy the overly strict type checker if I used BookingStatus
            const bookings = getStorage<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
            const b = bookings.find(x => x.id === id);
            if (b) {
                b.status = status as any;
                if (status === 'paid' && !b.qrCode) {
                    b.qrCode = `PARKVOID-${b.id}-${Date.now()}`;
                }
                setStorage(STORAGE_KEYS.BOOKINGS, bookings);
            }
        }
    },
    auth: {
        getCurrentUser: () => {
            if (typeof window === 'undefined') return null;
            const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
            if (!id) return null;
            return getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS).find(u => u.id === id);
        },
        setCurrentUser: (id: string | null) => {
            if (typeof window === 'undefined') return;
            if (id) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, id);
            else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
    },
    subscriptions: {
        getAll: () => getStorage<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS),
        getByOwner: (ownerId: string) => getStorage<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS).find(s => s.ownerId === ownerId),
        create: (sub: Subscription) => {
            const subs = getStorage<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS);
            subs.push(sub);
            setStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);
        },
        update: (sub: Subscription) => {
            const subs = getStorage<Subscription[]>(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS);
            const idx = subs.findIndex(s => s.id === sub.id);
            if (idx !== -1) {
                subs[idx] = sub;
                setStorage(STORAGE_KEYS.SUBSCRIPTIONS, subs);
            }
        }
    },
    invoices: {
        getAll: () => getStorage<Invoice[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES),
        getByOwner: (ownerId: string) => getStorage<Invoice[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES).filter(i => i.ownerId === ownerId),
        add: (inv: Invoice) => {
            const invs = getStorage<Invoice[]>(STORAGE_KEYS.INVOICES, SEED_INVOICES);
            invs.push(inv);
            setStorage(STORAGE_KEYS.INVOICES, invs);
        }
    }
};
