import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Cleaning database...')

    // Delete in order to respect foreign keys
    await prisma.auditLog.deleteMany()
    await prisma.payoutLedger.deleteMany()
    await prisma.invoice.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.parkingSlot.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()

    console.log('✨ All data cleared.')

    // Create ONE Master Admin so the system is usable
    console.log('👤 Creating Master Admin...')
    await prisma.user.create({
        data: {
            name: 'Master Admin',
            phone: '9999999999', // Default admin phone
            email: 'admin@parkvoid.com',
            role: 'admin',
            walletBalance: 0
        }
    })

    console.log('✅ System Reset Complete. Master Admin (9999999999) created.')
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
