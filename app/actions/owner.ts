'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { ParkingSlot } from "@prisma/client"

// Owner Stats
export async function getOwnerStats(ownerId: string) {
    try {
        const slots = await prisma.parkingSlot.findMany({ where: { ownerId } })
        const bookings = await prisma.booking.findMany({ where: { slot: { ownerId } } })

        // Calculate earnings
        let totalEarnings = 0
        bookings.forEach(b => {
            if (b.status === 'paid' || b.status === 'completed') {
                totalEarnings += Number(b.amount)
            }
        })

        return {
            totalSlots: slots.length,
            activeSlots: slots.filter(s => s.isActive).length,
            totalBookings: bookings.length,
            totalEarnings: totalEarnings
        }
    } catch (e) {
        return { totalSlots: 0, activeSlots: 0, totalBookings: 0, totalEarnings: 0 }
    }
}

export async function addParkingSlot(data: any, ownerId: string) {
    try {
        // Validation (Basic)
        if (!data.title || !data.address || !data.pricePerHour) {
            return { success: false, error: "Missing required fields" }
        }

        // Check limits based on subscription
        const owner = await prisma.user.findUnique({
            where: { id: ownerId },
            include: { slots: true }
        })

        if (!owner) return { success: false, error: "Owner not found" }

        // Logic for limits (simplified)
        const currentCount = owner.slots.length
        let limit = 2 // Starter
        if (owner.subPlan === 'PRO') limit = 10
        if (owner.subPlan === 'APARTMENT') limit = 999

        if (currentCount >= limit) {
            return { success: false, error: `Detailed limit reached for ${owner.subPlan || 'STARTER'} plan.` }
        }

        await prisma.parkingSlot.create({
            data: {
                title: data.title,
                address: data.address,
                lat: parseFloat(data.lat),
                lng: parseFloat(data.lng),
                pricePerHour: parseFloat(data.pricePerHour),
                vehicleType: data.vehicleType,
                description: data.description,
                openTime: data.openTime || "00:00",
                closeTime: data.closeTime || "23:59",
                images: JSON.stringify(data.images || []),
                ownerId: ownerId,
                // status: 'pending', - REMOVED: Schema uses isActive/isApproved flags
                isActive: false // Not live yet
            }
        })

        revalidatePath('/dashboard/owner')
        return { success: true }
    } catch (error) {
        console.error("Error adding slot:", error)
        return { success: false, error: "Failed to add slot" }
    }
}
