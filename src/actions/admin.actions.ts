"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: "USER" | "ADMIN" | "OWNER") {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "OWNER") {
    throw new Error("Unauthorized: Only an OWNER can modify roles.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/admin/users");
}
