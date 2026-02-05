'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// --- STATS ---
export async function getAdminStats() {
    try {
        const revenueResult = await prisma.booking.aggregate({
            _sum: { amount: true },
            where: { status: 'paid' } // Only count paid bookings
        })
        const totalUsers = await prisma.user.count()
        const totalBookings = await prisma.booking.count()
        const pendingRequests = await prisma.parkingSlot.count({
            where: { isApproved: false }
        })
        const activeBookings = await prisma.booking.count({
            where: { status: 'active' } // Assuming 'active' is a valid status string now
        })

        // Subscriptions logic (if implemented in DB)
        const activeSubs = await prisma.subscription.count({
            where: { status: 'active' }
        })

        // Hardcoding subscription amount for demo if missing in DB schema or complicated query
        const estimatedMRR = activeSubs * 499;

        return {
            revenue: revenueResult._sum.amount ? parseFloat(revenueResult._sum.amount.toString()) : 0,
            totalUsers,
            totalBookings,
            pendingRequests,
            activeBookings,
            activeSubs,
            estimatedMRR
        }
    } catch (error) {
        console.error("Stats Error:", error)
        return { revenue: 0, totalUsers: 0, totalBookings: 0, pendingRequests: 0, activeBookings: 0, activeSubs: 0, estimatedMRR: 0 }
    }
}

// --- SLOTS MANAGEMENT ---
export async function getPendingSlots() {
    try {
        const slots = await prisma.parkingSlot.findMany({
            where: { isApproved: false },
            include: { owner: true } // getting owner name
        })

        // Transform to match UI expectation if needed or just return raw
        return slots.map(slot => ({
            ...slot,
            pricePerHour: parseFloat(slot.pricePerHour.toString()),
            images: JSON.parse(slot.images || "[]"),
            owner: {
                ...slot.owner,
                walletBalance: parseFloat(slot.owner.walletBalance.toString())
            }
        }))
    } catch (error) {
        return []
    }
}

export async function getAllSlots() {
    try {
        const slots = await prisma.parkingSlot.findMany({
            include: { owner: true }
        })
        return slots.map(slot => ({
            ...slot,
            pricePerHour: parseFloat(slot.pricePerHour.toString()),
            images: JSON.parse(slot.images || "[]"),
            owner: {
                ...slot.owner,
                walletBalance: parseFloat(slot.owner.walletBalance.toString())
            }
        }))
    } catch (error) {
        return []
    }
}

export async function approveSlot(slotId: string) {
    try {
        await prisma.parkingSlot.update({
            where: { id: slotId },
            data: { isApproved: true, isActive: true }
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to approve' }
    }
}

export async function rejectSlot(slotId: string) {
    try {
        await prisma.parkingSlot.update({
            where: { id: slotId },
            data: { isApproved: false, isActive: false }
            // Or delete: await prisma.parkingSlot.delete({ where: { id: slotId } })
        })
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Failed to reject' }
    }
}

// --- BOOKINGS ---
export async function getAllBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                driver: { select: { name: true, phone: true } },
                slot: { select: { title: true, address: true } }
            }
        })
        return bookings.map(b => ({
            ...b,
            amount: parseFloat(b.amount.toString()),
        }))
    } catch (e) {
        return []
    }
}

export async function getRecentBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                driver: { select: { name: true, phone: true } },
                slot: { select: { title: true, address: true } }
            }
        })

        return bookings.map(b => ({
            ...b,
            amount: parseFloat(b.amount.toString()),
        }))
    } catch (e) {
        return []
    }
}

// --- USERS (OWNERS) ---
export async function getOwners() {
    try {
        const owners = await prisma.user.findMany({
            // where: { role: 'owner' }, // Fetching all users for now for the Registry
            include: { subscriptions: true }
        })
        return owners.map(o => ({
            ...o,
            walletBalance: parseFloat(o.walletBalance.toString())
        }))
    } catch (e) {
        return []
    }
}
