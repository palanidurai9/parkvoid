# Parkvoid - MVP Demo Guide

## 🚀 Getting Started

1. **Install Dependencies** (If not already installed):
   ```bash
   npm install
   ```
2. **Run the Development Server**:
   ```bash
   npm run dev
   ```
3. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 👤 User Roles & Demo Credentials

Use the **Quick Login** buttons on the login page for instant access.

| Role | Demo User | Capabilities |
|------|-----------|--------------|
| **Driver** | Ravi Kumar | Search map, Book slots, View active passes |
| **Owner** | Lakshmi N. | Add new parking, View earnings, Manage slots |
| **Admin** | Parkvoid | Approve listings, View platform revenue, Dispute handling |

## 🧪 Key Features to Test

### 1. Driver Flow (Search & Book)
1. Login as **Driver**.
2. Click **Find Parking** on the dashboard.
3. Browse the Map (Pins are located in Chennai: T. Nagar, Adyar, etc.).
4. Click a pin -> **Book Slot**.
5. Select a time and duration.
6. Click **Pay** (Simulates Razorpay).
7. View the generated **QR Code Pass**.
8. Go to **My Bookings** to see it saved.

### 2. Owner Flow (List a Spot)
1. Login as **Owner**.
2. Dashboard shows Revenue and active spots.
3. Click **Add Parking**.
4. Fill the form (Title, Address, Price).
5. Submit.
6. Note: The slot status will be **Pending**. It won't appear on the Map yet.

### 3. Admin Flow (Approval)
1. Login as **Admin**.
2. See the **Pending Requests** card/section.
3. You will see the slot you just created as "Pending".
4. Click the **Green Checkmark** to Approve it.
5. Logout and log back in as **Driver** -> The new slot is now visible on the Map!

## 🛠 Technical Notes
- **Database**: Uses `localStorage` to persist data across sessions in your browser.
- **Map**: Uses OpenStreetMap + Leaflet.
- **Payments**: Sandbox mode (no real money).
