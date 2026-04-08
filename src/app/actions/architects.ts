"use server";

import { prisma } from "@/lib/prisma";

export async function submitArchitectLead(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  if (!name || !phone || !email) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    // 1. Save strictly to DB Vault
    await prisma.architectLead.create({
      data: {
        name,
        phone,
        email
      }
    });

    console.log("Architect Lead securely saved to database!");

    return { success: true };
  } catch (error) {
    console.error("Failed to submit Architect Lead:", error);
    return { success: false, error: "Failed to submit properly" };
  }
}
