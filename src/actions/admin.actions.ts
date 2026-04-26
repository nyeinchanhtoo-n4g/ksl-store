"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const db = prisma as any;

async function requireOwnerOrAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role === "USER") {
    throw new Error("Unauthorized.");
  }

  return session;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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

export async function createCollection(formData: FormData) {
  await requireOwnerOrAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim();

  if (!name) {
    throw new Error("Collection name is required.");
  }

  await db.collection.create({
    data: {
      name,
      slug: slugify(name),
      description: description || null,
    },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/");
}

export async function updateCollection(collectionId: string, formData: FormData) {
  await requireOwnerOrAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim();

  if (!name) {
    throw new Error("Collection name is required.");
  }

  await db.collection.update({
    where: { id: collectionId },
    data: {
      name,
      slug: slugify(name),
      description: description || null,
    },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteCollection(collectionId: string) {
  await requireOwnerOrAdmin();

  await db.collection.delete({
    where: { id: collectionId },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function createCarouselSlide(formData: FormData) {
  await requireOwnerOrAdmin();

  const title = (formData.get("title") as string)?.trim();
  const subtitle = ((formData.get("subtitle") as string) || "").trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const buttonText = ((formData.get("buttonText") as string) || "").trim();
  const buttonHref = ((formData.get("buttonHref") as string) || "").trim();
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const isActive = formData.get("isActive") === "on";

  if (!title || !imageUrl) {
    throw new Error("Slide title and image URL are required.");
  }

  await db.carouselSlide.create({
    data: {
      title,
      subtitle: subtitle || null,
      imageUrl,
      buttonText: buttonText || null,
      buttonHref: buttonHref || null,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
    },
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function updateCarouselSlide(slideId: string, formData: FormData) {
  await requireOwnerOrAdmin();

  const title = (formData.get("title") as string)?.trim();
  const subtitle = ((formData.get("subtitle") as string) || "").trim();
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const buttonText = ((formData.get("buttonText") as string) || "").trim();
  const buttonHref = ((formData.get("buttonHref") as string) || "").trim();
  const sortOrder = parseInt((formData.get("sortOrder") as string) || "0", 10);
  const isActive = formData.get("isActive") === "on";

  if (!title || !imageUrl) {
    throw new Error("Slide title and image URL are required.");
  }

  await db.carouselSlide.update({
    where: { id: slideId },
    data: {
      title,
      subtitle: subtitle || null,
      imageUrl,
      buttonText: buttonText || null,
      buttonHref: buttonHref || null,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
    },
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function deleteCarouselSlide(slideId: string) {
  await requireOwnerOrAdmin();

  await db.carouselSlide.delete({
    where: { id: slideId },
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
}
