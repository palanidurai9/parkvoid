import { User, ParkingSlot, Booking, Review, Dispute, Subscription, Invoice } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
    USERS: 'parkvoid_users_v3',
    SLOTS: 'parkvoid_slots_v3',
    BOOKINGS: 'parkvoid_bookings_v3',
    REVIEWS: 'parkvoid_reviews_v3',
    DISPUTES: 'parkvoid_disputes_v3',
    CURRENT_USER: 'parkvoid_current_user_id_v3',
    SUBSCRIPTIONS: 'parkvoid_subscriptions_v3',
    INVOICES: 'parkvoid_invoices_v3',
};

// Seed Data
const SEED_USERS: User[] = [
    { id: 'driver1', name: 'Ravi Kumar', phone: '9000000000', role: 'driver', rating: 4.8 },

    // Free Hosts (8)
    { id: 'free1', name: 'Arun V', phone: '9000000101', role: 'owner', rating: 4.0, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free2', name: 'Bala K', phone: '9000000102', role: 'owner', rating: 3.5, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free3', name: 'Chitra R', phone: '9000000103', role: 'owner', rating: 0, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free4', name: 'Dinesh S', phone: '9000000104', role: 'owner', rating: 4.1, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free5', name: 'Elango M', phone: '9000000105', role: 'owner', rating: 4.8, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free6', name: 'Fathima J', phone: '9000000106', role: 'owner', rating: 3.9, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free7', name: 'Ganesh P', phone: '9000000107', role: 'owner', rating: 4.2, subscriptionPlan: 'free', subscriptionStatus: 'active' },
    { id: 'free8', name: 'Hari T', phone: '9000000108', role: 'owner', rating: 4.5, subscriptionPlan: 'free', subscriptionStatus: 'active' },

    // Starter Hosts (5)
    { id: 'owner1', name: 'Lakshmi Narayanan', phone: '9000000001', role: 'owner', rating: 4.5, walletBalance: 1200, subscriptionPlan: 'starter', subscriptionStatus: 'active', trialUsed: true },
    { id: 'owner2', name: 'Suresh Reddy', phone: '9000000011', role: 'owner', rating: 4.2, subscriptionPlan: 'starter', subscriptionStatus: 'active' },
    { id: 'starter3', name: 'Mani K', phone: '9000000012', role: 'owner', rating: 3.8, subscriptionPlan: 'starter', subscriptionStatus: 'active' },
    { id: 'starter4', name: 'Naveen L', phone: '9000000013', role: 'owner', rating: 4.6, subscriptionPlan: 'starter', subscriptionStatus: 'active' },
    { id: 'starter5', name: 'Omar F', phone: '9000000014', role: 'owner', rating: 4.3, subscriptionPlan: 'starter', subscriptionStatus: 'active' },

    // Pro Hosts (3)
    { id: 'owner_pro1', name: 'Vikram Singh', phone: '9000000021', role: 'owner', rating: 4.9, subscriptionPlan: 'pro', subscriptionStatus: 'active' },
    { id: 'pro2', name: 'Prestige Apartments', phone: '9000000031', role: 'owner', rating: 5.0, subscriptionPlan: 'pro', subscriptionStatus: 'active' }, // Migrated from Apartment
    { id: 'pro3', name: 'Royal Enclave', phone: '9000000032', role: 'owner', rating: 4.7, subscriptionPlan: 'pro', subscriptionStatus: 'active' },

    { id: 'admin1', name: 'Parkvoid Admin', phone: '9000000002', role: 'admin' },
];

const SEED_SUBSCRIPTIONS: Subscription[] = [
    // Free Subs (no amount, active)
    { id: 'sub_free1', ownerId: 'free1', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free2', ownerId: 'free2', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free3', ownerId: 'free3', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free4', ownerId: 'free4', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free5', ownerId: 'free5', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free6', ownerId: 'free6', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free7', ownerId: 'free7', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },
    { id: 'sub_free8', ownerId: 'free8', plan: 'free', amount: 0, status: 'active', startDate: '2024-01-01', endDate: '2099-01-01', autoRenew: false },

    // Starter Subs
    { id: 'sub1', ownerId: 'owner1', plan: 'starter', amount: 499, status: 'active', startDate: '2023-11-01', endDate: '2026-03-01', autoRenew: true },
    { id: 'sub2', ownerId: 'owner2', plan: 'starter', amount: 499, status: 'active', startDate: '2024-01-15', endDate: '2026-02-15', autoRenew: true },
    { id: 'sub3', ownerId: 'starter3', plan: 'starter', amount: 499, status: 'active', startDate: '2024-01-01', endDate: '2026-02-01', autoRenew: true },
    { id: 'sub4', ownerId: 'starter4', plan: 'starter', amount: 499, status: 'active', startDate: '2024-01-01', endDate: '2026-02-01', autoRenew: true },
    { id: 'sub5', ownerId: 'starter5', plan: 'starter', amount: 499, status: 'active', startDate: '2024-01-01', endDate: '2026-02-01', autoRenew: true },

    // Pro Subs
    { id: 'sub_pro1', ownerId: 'owner_pro1', plan: 'pro', amount: 1499, status: 'active', startDate: '2023-10-01', endDate: '2026-02-28', autoRenew: true },
    { id: 'sub_pro2', ownerId: 'pro2', plan: 'pro', amount: 1499, status: 'active', startDate: '2023-01-01', endDate: '2026-02-01', autoRenew: true },
    { id: 'sub_pro3', ownerId: 'pro3', plan: 'pro', amount: 1499, status: 'active', startDate: '2023-01-01', endDate: '2026-02-01', autoRenew: true },
];

const SEED_INVOICES: Invoice[] = [
    { id: 'inv1', ownerId: 'owner1', subscriptionId: 'sub1', amount: 499, date: '2024-01-01', status: 'paid', pdfUrl: '#' },
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
        },
        update: (updatedUser: User) => {
            const users = getStorage<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
            const index = users.findIndex(u => u.id === updatedUser.id);
            if (index !== -1) {
                users[index] = updatedUser;
                setStorage(STORAGE_KEYS.USERS, users);
            }
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
