'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { requireAdmin } from '@/lib/authorization';
import { manualOrderSchema, normalizeMyanmarDigits } from '@/lib/validations';
import { buildTelegramUrl, buildViberUrl } from '@/lib/contact-links';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'COMPLETE' as OrderStatus,
];
const CONTACT_METHODS = new Set(['telegram', 'viber']);
const PHONE_PATTERN = /^[+\d][\d\s-]{5,24}$/;

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
    const quantity = Number(normalizeMyanmarDigits(String(item.quantity)));

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
  const method = contactInfo.method?.trim().toLowerCase() || '';

  if (!name || !phone || !address) {
    throw new Error('Name, phone, and address are required.');
  }

  if (name.length < 2 || name.length > 80) {
    throw new Error('Name must be between 2 and 80 characters.');
  }

  if (!PHONE_PATTERN.test(phone)) {
    throw new Error('Please enter a valid phone number.');
  }

  if (address.length < 8 || address.length > 500) {
    throw new Error('Address must be between 8 and 500 characters.');
  }

  if (!CONTACT_METHODS.has(method)) {
    throw new Error('Please choose Telegram or Viber.');
  }

  return { name, phone, address, method };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  assertOrderStatus(status);

  await prisma.$transaction(async (tx) => {
    const currentOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!currentOrder) {
      throw new Error('Order not found.');
    }

    await tx.order.update({
      where: { id: orderId },
      data: { status },
    });
  });

  revalidatePath('/admin/orders');
}

export async function createManualOrder(formData: FormData) {
  await requireAdmin();
  const parsed = manualOrderSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);
  const data = parsed.data;
  const order = await prisma.order.create({ data: { isManual: true, customerName: data.customerName, customerAccount: data.customerAccount || null, customerPhone: data.customerPhone || null, leather: data.leather || null, deposit: data.deposit, deliveryCharge: data.deliveryCharge, deliveryAddress: data.deliveryAddress || null, deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null, setupNote: data.setupNote || null, attachmentUrls: data.attachmentUrls || null, totalAmount: data.totalAmount, items: { create: { itemName: data.itemName, description: data.description || null, quantity: data.quantity, price: data.price } } } });
  revalidatePath('/admin/orders');
  redirect(`/admin/orders/${order.id}`);
}

export async function updateManualOrder(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get('orderId') || '');
  const parsed = manualOrderSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!orderId || !parsed.success) throw new Error(parsed.success ? 'Order not found.' : parsed.error.issues[0].message);

  const data = parsed.data;
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: { orderBy: { id: 'asc' }, take: 1 } } });
  if (!order || !order.items[0]) throw new Error('Order not found.');

  const guestContactInfo = order.isManual ? undefined : JSON.stringify({
    name: data.customerName,
    phone: data.customerPhone || '',
    address: data.deliveryAddress || '',
    method: (data.customerAccount || '').toLowerCase(),
  });

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { customerName: data.customerName, customerAccount: data.customerAccount || null, customerPhone: data.customerPhone || null, guestContactInfo, leather: data.leather || null, deposit: data.deposit, deliveryCharge: data.deliveryCharge, deliveryAddress: data.deliveryAddress || null, deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null, setupNote: data.setupNote || null, attachmentUrls: data.attachmentUrls || null, totalAmount: data.totalAmount } }),
    prisma.orderItem.update({ where: { id: order.items[0].id }, data: { itemName: data.itemName, description: data.description || null, quantity: data.quantity, price: data.price } }),
  ]);

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}`);
}

export async function deleteOrder(orderId: string) {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true } });
  if (!order) throw new Error('Order not found.');
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath('/admin/orders');
  redirect('/admin/orders');
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

  const orderDetails = await prisma.order.findUnique({
    where: { id: order.id },
    select: {
      id: true,
      totalAmount: true,
      items: {
        select: {
          itemName: true,
          description: true,
          quantity: true,
          price: true,
          product: { select: { name: true, description: true } },
        },
      },
    },
  });

  const itemLines = orderDetails?.items.map((item) => {
    const name = item.itemName || item.product?.name || 'Item';
    const description = item.description || item.product?.description;
    return [`- ${name} x${item.quantity} @ ${item.price.toLocaleString()} Ks`, description ? `  Description: ${description}` : ''].filter(Boolean).join('\n');
  }).join('\n') || '- No item details';
  const text = [
    `New Order: ${order.id}`,
    `Name: ${normalizedContactInfo.name}`,
    `Phone: ${normalizedContactInfo.phone}`,
    `Address: ${normalizedContactInfo.address}`,
    'Items:',
    itemLines,
    `Total: ${order.totalAmount.toLocaleString()} Ks`,
  ].join('\n');

  let redirectUrl = '/';

  if (normalizedContactInfo.method === 'telegram' && settings?.telegramUrl) {
    // Basic formatting for telegram `https://t.me/bot?text=hello`
    redirectUrl = buildTelegramUrl(settings.telegramUrl, text);
  } else if (normalizedContactInfo.method === 'viber' && settings?.viberUrl) {
    redirectUrl = buildViberUrl(settings.viberUrl, text);
  } else {
    // Fallback if settings not configured
    redirectUrl = `/order-success/${order.id}`;
  }

  return { success: true, orderId: order.id, redirectUrl };
}
