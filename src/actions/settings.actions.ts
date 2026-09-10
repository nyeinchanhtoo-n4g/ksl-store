"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { settingsSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function updateStoreSettings(formData: FormData) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { logoUrl, faviconUrl, telegramUrl, viberUrl } = parsed.data;

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {
      logoUrl: logoUrl || null,
      faviconUrl: faviconUrl || null,
      telegramUrl: telegramUrl || null,
      viberUrl: viberUrl || null,
    },
    create: {
      id: 1,
      logoUrl: logoUrl || null,
      faviconUrl: faviconUrl || null,
      telegramUrl: telegramUrl || null,
      viberUrl: viberUrl || null,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
}
