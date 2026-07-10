'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';
import { auth } from '@/auth';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

type GuestContactInfo = {
  name: string;
  phone: string;
  address: string;
  method: string;
};

type GuestOrderItemInput = {
  productId: string;
  quantity: number;
};

async function requireOwnerOrAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role === 'USER') {
    throw new Error('Unauthorized.');
  }

  return session;
}

function assertOrderStatus(status: OrderStatus) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error('Invalid order status.');
  }
}

function normalizeGuestOrderItems(items: GuestOrderItemInput[]) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Your cart is empty.');
  }

  const quantityByProductId = new Map<string, number>();

  for (const item of items) {
    const productId = typeof item.productId === 'string' ? item.productId.trim() : '';
    const quantity = Number(item.quantity);

    if (!productId || !Number.isInteger(quantity) || quantity <= 0) {
      throw new Error('Invalid cart item.');
    }

    quantityByProductId.set(productId, (quantityByProductId.get(productId) || 0) + quantity);
  }

  return Array.from(quantityByProductId, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

function normalizeContactInfo(contactInfo: GuestContactInfo) {
  const name = contactInfo.name?.trim();
  const phone = contactInfo.phone?.trim();
  const address = contactInfo.address?.trim();
  const method = contactInfo.method === 'viber' ? 'viber' : 'telegram';

  if (!name || !phone || !address) {
    throw new Error('Name, phone, and address are required.');
  }

  return { name, phone, address, method };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireOwnerOrAdmin();
  assertOrderStatus(status);

  await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!currentOrder) {
      throw new Error('Order not found.');
    }

    if (status === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
      await Promise.all(
        currentOrder.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        )
      );
    } else if (currentOrder.status === 'CANCELLED' && status !== 'CANCELLED') {
      for (const item of currentOrder.items) {
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count !== 1) {
          throw new Error('Insufficient stock to restore this order status.');
        }
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
  });

  revalidatePath('/admin/orders');
}

export async function placeGuestOrder(contactInfo: GuestContactInfo, items: GuestOrderItemInput[]) {
  const normalizedContactInfo = normalizeContactInfo(contactInfo);
  const normalizedItems = normalizeGuestOrderItems(items);

  const order = await prisma.$transaction(
    async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: normalizedItems.map((item) => item.productId) } },
        select: { id: true, name: true, price: true, stock: true },
      });
      const productById = new Map(products.map((product) => [product.id, product]));

      if (products.length !== normalizedItems.length) {
        throw new Error('A product in your cart is no longer available.');
      }

      for (const item of normalizedItems) {
        const product = productById.get(item.productId);

        if (!product || product.stock < item.quantity) {
          throw new Error(`${product?.name || 'A product'} does not have enough stock.`);
        }
      }

      const totalAmount = normalizedItems.reduce((total, item) => {
        const product = productById.get(item.productId);
        return total + item.quantity * (product?.price || 0);
      }, 0);

      const createdOrder = await tx.order.create({
        data: {
          userId: null,
          guestContactInfo: JSON.stringify(normalizedContactInfo),
          totalAmount,
          status: 'PENDING',
          items: {
            create: normalizedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productById.get(item.productId)?.price || 0,
            })),
          },
        },
      });

      for (const item of normalizedItems) {
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });

        if (result.count !== 1) {
          throw new Error('Insufficient stock. Please refresh your cart and try again.');
        }
      }

      return createdOrder;
    },
    {
      timeout: 15000,
    }
  );

  // Fetch settings for Telegram and Viber URLs
  const settings = await prisma.storeSettings.findUnique({
    where: { id: 1 },
  });

  // Build the message text
  const text = `New Order: ${order.id}\nName: ${normalizedContactInfo.name}\nPhone: ${normalizedContactInfo.phone}\nAddress: ${normalizedContactInfo.address}\nTotal: ${order.totalAmount} Ks`;
  const encodedText = encodeURIComponent(text);

  let redirectUrl = '/';

  if (normalizedContactInfo.method === 'telegram' && settings?.telegramUrl) {
    // Basic formatting for telegram `https://t.me/bot?text=hello`
    const baseUrl = settings.telegramUrl.split('?')[0];
    redirectUrl = `${baseUrl}?text=${encodedText}`;
  } else if (normalizedContactInfo.method === 'viber' && settings?.viberUrl) {
    // Viber deep links vary by platform; we store a working URL in settings and redirect to it.
    redirectUrl = settings.viberUrl;
  } else {
    // Fallback if settings not configured
    redirectUrl = `/?orderSuccess=true`;
  }

  return { success: true, redirectUrl };
}
