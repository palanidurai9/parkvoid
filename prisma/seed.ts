import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Start seeding...')

    // 1. Clean existing data
    await prisma.auditLog.deleteMany()
    await prisma.payoutLedger.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.parkingSlot.deleteMany()
    await prisma.user.deleteMany()

    // 2. Create Users
    const admin = await prisma.user.create({
        data: {
            phone: '9000000002',
            name: 'System Admin',
            role: 'ADMIN',
            email: 'admin@parkvoid.in'
        }
    })

    // Create Owners
    const owners = []

    // 8 Free Owners
    for (let i = 1; i <= 8; i++) {
        const owner = await prisma.user.create({
            data: {
                phone: `999000100${i}`,
                name: `Free Host ${i}`,
                role: 'OWNER',
                walletBalance: 0,
                subPlan: 'FREE',
                subStatus: 'ACTIVE'
            }
        })
        owners.push(owner)
        await prisma.subscription.create({
            data: {
                ownerId: owner.id,
                tier: 'FREE',
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // Long expiry
                autoRenew: false
            }
        })
    }

    // 5 Starter Owners
    for (let i = 1; i <= 5; i++) {
        const owner = await prisma.user.create({
            data: {
                phone: `999000200${i}`,
                name: `Starter Host ${i}`,
                role: 'OWNER',
                walletBalance: 500,
                subPlan: 'STARTER',
                subStatus: 'ACTIVE'
            }
        })
        owners.push(owner)
        await prisma.subscription.create({
            data: {
                ownerId: owner.id,
                tier: 'STARTER',
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(new Date().setDate(new Date().getDate() + 30)),
                autoRenew: true
            }
        })
    }

    // 3 Pro Owners
    for (let i = 1; i <= 3; i++) {
        const owner = await prisma.user.create({
            data: {
                phone: `999000300${i}`,
                name: `Pro Host ${i}`,
                role: 'OWNER',
                walletBalance: 2000,
                subPlan: 'PRO',
                subStatus: 'ACTIVE'
            }
        })
        owners.push(owner)
        await prisma.subscription.create({
            data: {
                ownerId: owner.id,
                tier: 'PRO',
                status: 'ACTIVE',
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(new Date().setDate(new Date().getDate() + 30)),
                autoRenew: true
            }
        })
    }

    // Create 5 Drivers
    const drivers = []
    for (let i = 1; i <= 5; i++) {
        const driver = await prisma.user.create({
            data: {
                phone: `888000000${i}`,
                name: `Driver ${i}`,
                role: 'DRIVER',
                walletBalance: 500
            }
        })
        drivers.push(driver)
    }

    // 3. Create Slots (Some Approved, Some Pending)
    const slots = []
    for (const owner of owners) {
        const isApproved = Math.random() > 0.3; // 70% approved
        const slot = await prisma.parkingSlot.create({
            data: {
                ownerId: owner.id,
                title: `Parking at ${owner.name}'s`,
                address: `Street ${Math.floor(Math.random() * 10)}, T. Nagar`,
                lat: 13.04 + Math.random() * 0.01,
                lng: 80.22 + Math.random() * 0.01,
                pricePerHour: 40 + Math.floor(Math.random() * 60), // 40-100
                vehicleType: 'CAR',
                description: 'Safe and secure parking inside compound.',
                isApproved: isApproved,
                isActive: isApproved,
                images: JSON.stringify(["https://via.placeholder.com/300"])
            }
        })
        slots.push(slot)
    }

    // 4. Create Bookings
    for (let i = 0; i < 10; i++) {
        const slot = slots[Math.floor(Math.random() * slots.length)];
        const driver = drivers[Math.floor(Math.random() * drivers.length)];

        const statusOptions = ['COMPLETED', 'CONFIRMED', 'CANCELLED', 'active'];
        // Note: Schema has String for status, we used valid strings from previous enum
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

        await prisma.booking.create({
            data: {
                slotId: slot.id,
                driverId: driver.id,
                startTime: new Date(),
                endTime: new Date(new Date().setHours(new Date().getHours() + 2)), // 2 hours later
                amount: parseFloat(slot.pricePerHour.toString()) * 2,
                status: status,
                paymentId: `pay_${Math.floor(Math.random() * 100000)}`
            }
        })
    }

    console.log(`✅ Seeded: 5 Owners, 5 Drivers, ${slots.length} Slots, 10 Bookings`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
