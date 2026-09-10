"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const product = parseProductFormData(formData);

  await prisma.product.create({
    data: {
      ...product,
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();
  const product = parseProductFormData(formData);

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...product,
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  await prisma.product.delete({
    where: { id: productId }
  });

  revalidatePath("/admin/products");
}

function parseProductFormData(formData: FormData) {
  const parsed = productSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { imageUrl, collectionId, ...product } = parsed.data;
  return { ...product, imageUrl: imageUrl || null, collectionId: collectionId || null };
}
