export type UserRole = 'driver' | 'owner' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string; // Used for login
  role: UserRole;
  rating?: number;
  walletBalance?: number;
  // Subscription Fields
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  trialUsed?: boolean;
}

export interface ParkingSlot {
  id: string;
  ownerId: string;
  title: string;
  address: string;
  description?: string;
  lat: number;
  lng: number;
  pricePerHour: number;
  vehicleType: 'car' | 'bike' | 'suv' | 'all';
  openTime: string; // "09:00"
  closeTime: string; // "22:00"
  status: 'active' | 'inactive' | 'pending';
  images: string[];
}

export type BookingStatus = 'pending_payment' | 'paid' | 'active' | 'completed' | 'cancelled' | 'disputed';

export interface Booking {
  id: string;
  slotId: string;
  driverId: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  amount: number;
  status: BookingStatus;
  qrCode?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  driverId: string; // reviewer
  slotId: string;   // reviewed
  rating: number;   // 1-5
  comment: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  driverId: string;
  issue: string;
  status: 'open' | 'resolved' | 'rejected';
  createdAt: string;
}

export type SubscriptionPlan = 'starter' | 'pro' | 'apartment';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled';

export interface Subscription {
  id: string;
  ownerId: string;
  plan: SubscriptionPlan;
  amount: number;
  status: SubscriptionStatus;
  startDate: string; // ISO
  endDate: string;   // ISO (Renewal Date)
  autoRenew: boolean;
}

export interface Invoice {
  id: string;
  ownerId: string;
  subscriptionId: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
}

// Extend User in place (re-declaring interface to merge is not standard in this file structure, so modifying standard User)
// Ideally I should modify the specific lines for User.
