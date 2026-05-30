"use server";

import { getDealerDetails } from "@/src/lib/dealers/performance-service";
import { requireActionRole } from "@/lib/authorization";
import { UserRole } from "@/lib/generated/prisma";

export async function fetchDealerDetailsAction(dealerId: string) {
  await requireActionRole([UserRole.ADMIN]);
  
  try {
    const details = await getDealerDetails(dealerId);
    return { success: true, data: details };
  } catch (error) {
    console.error("Error fetching dealer details:", error);
    return { success: false, message: "Failed to fetch dealer details" };
  }
}
