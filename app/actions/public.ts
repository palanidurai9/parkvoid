'use server';

import { prisma } from '@/lib/prisma';

function slotDto(slot: Awaited<ReturnType<typeof prisma.parkingSlot.findFirst>>) {
  if (!slot) return null;
  return {
    ...slot,
    pricePerHour: Number(slot.pricePerHour),
    vehicleType: slot.vehicleType.toLowerCase(),
    status: slot.isActive ? 'active' : slot.isApproved ? 'inactive' : 'pending',
    images: JSON.parse(slot.images || '[]') as string[],
  };
}

export async function getPublicSlots() {
  const slots = await prisma.parkingSlot.findMany({
    where: { isActive: true, isApproved: true },
    include: { owner: { select: { subPlan: true } } },
  });
  const priority = { PRO: 2, STARTER: 1, FREE: 0 } as Record<string, number>;
  return slots
    .sort((left, right) => (priority[right.owner.subPlan ?? 'FREE'] ?? 0) - (priority[left.owner.subPlan ?? 'FREE'] ?? 0))
    .map(slotDto);
}

export async function getPublicSlot(slotId: string) {
  return slotDto(await prisma.parkingSlot.findFirst({ where: { id: slotId, isActive: true, isApproved: true } }));
}
