"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role === "USER") {
    throw new Error("Unauthorized");
  }

  const telegramUrl = formData.get("telegramUrl") as string;
  const messengerUrl = formData.get("messengerUrl") as string;

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: { telegramUrl, messengerUrl },
    create: { id: 1, telegramUrl, messengerUrl },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}
