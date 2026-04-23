"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const currentOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!currentOrder) return;

  // Restore inventory if changing to CANCELLED from a non-CANCELLED state
  if (status === "CANCELLED" && currentOrder.status !== "CANCELLED") {
    await prisma.$transaction(
      currentOrder.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );
  } 
  // Deduct inventory if changing AWAY from CANCELLED to a valid state
  else if (currentOrder.status === "CANCELLED" && status !== "CANCELLED") {
    await prisma.$transaction(
      currentOrder.items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      )
    );
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin/orders");
}

export async function placeGuestOrder(
  contactInfo: { name: string; phone: string; address: string; method: string },
  items: { productId: string; quantity: number; price: number }[],
  totalAmount: number
) {
  // Save order to database and deduct stock atomically
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: null, 
        guestContactInfo: JSON.stringify(contactInfo),
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return createdOrder;
  });

  // Fetch settings for Telegram and Messenger URLs
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 },
  });

  // Build the message text
  const text = `🛒 New Order: ${order.id}\n👤 Name: ${contactInfo.name}\n📞 Phone: ${contactInfo.phone}\n📍 Address: ${contactInfo.address}\n💰 Total: ${totalAmount} Ks`;
  const encodedText = encodeURIComponent(text);

  let redirectUrl = "/";

  if (contactInfo.method === "telegram" && settings?.telegramUrl) {
    // Basic formatting for telegram `https://t.me/bot?text=hello`
    const baseUrl = settings.telegramUrl.split("?")[0];
    redirectUrl = `${baseUrl}?text=${encodedText}`;
  } else if (contactInfo.method === "messenger" && settings?.messengerUrl) {
    // Messenger uses m.me
    // Note: It's harder to pass custom pre-filled text in Messenger safely via regular links cross-platform,
    // but we link directly to the page. 
    redirectUrl = settings.messengerUrl;
  } else {
    // Fallback if settings not configured
    redirectUrl = `/?orderSuccess=true`;
  }

  return { success: true, redirectUrl };
}
