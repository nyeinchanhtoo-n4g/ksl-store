"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, requireOwner } from "@/lib/authorization";
import { carouselSlideSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function updateUserRole(userId: string, newRole: "USER" | "ADMIN" | "OWNER") {
  await requireOwner();

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });

  revalidatePath("/admin/users");
}

export async function createCollection(formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim();

  if (!name) {
    throw new Error("Collection name is required.");
  }

  await prisma.collection.create({
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
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = ((formData.get("description") as string) || "").trim();

  if (!name) {
    throw new Error("Collection name is required.");
  }

  await prisma.collection.update({
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
  await requireAdmin();

  await prisma.collection.delete({
    where: { id: collectionId },
  });

  revalidatePath("/admin/collections");
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function createCarouselSlide(formData: FormData) {
  await requireAdmin();
  const slide = parseCarouselSlideFormData(formData);

  await prisma.carouselSlide.create({
    data: {
      ...slide,
    },
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function updateCarouselSlide(slideId: string, formData: FormData) {
  await requireAdmin();
  const slide = parseCarouselSlideFormData(formData);

  await prisma.carouselSlide.update({
    where: { id: slideId },
    data: {
      ...slide,
    },
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

export async function deleteCarouselSlide(slideId: string) {
  await requireAdmin();

  await prisma.carouselSlide.delete({
    where: { id: slideId },
  });

  revalidatePath("/admin/carousel");
  revalidatePath("/");
}

function parseCarouselSlideFormData(formData: FormData) {
  const parsed = carouselSlideSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { subtitle, buttonText, buttonHref, ...slide } = parsed.data;
  return {
    ...slide,
    subtitle: subtitle || null,
    buttonText: buttonText || null,
    buttonHref: buttonHref || null,
  };
}
