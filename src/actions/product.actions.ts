"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role === "USER") {
    throw new Error("Unauthorized access.");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageUrl = formData.get("imageUrl") as string | null;
  const collectionId = (formData.get("collectionId") as string) || null;

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock: isNaN(stock) ? 0 : stock,
      imageUrl: imageUrl || null,
      collectionId,
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role === "USER") {
    throw new Error("Unauthorized access.");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const imageUrl = formData.get("imageUrl") as string | null;
  const collectionId = (formData.get("collectionId") as string) || null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      price,
      stock: isNaN(stock) ? 0 : stock,
      imageUrl: imageUrl || null,
      collectionId,
    }
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user || session.user.role === "USER") {
    throw new Error("Unauthorized access.");
  }

  await prisma.product.delete({
    where: { id: productId }
  });

  revalidatePath("/admin/products");
}
