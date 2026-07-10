import { prisma } from '@/lib/prisma';
import { CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type GuestContactInfo = {
  name?: string;
  phone?: string;
  address?: string;
  method?: string;
};

function parseGuestContactInfo(value: string | null): GuestContactInfo {
  if (!value) return {};

  try {
    return JSON.parse(value) as GuestContactInfo;
  } catch {
    return {};
  }
}

function buildContactUrl({
  method,
  orderId,
  totalAmount,
  settings,
}: {
  method: string;
  orderId: string;
  totalAmount: number;
  settings: { telegramUrl: string | null; viberUrl: string | null } | null;
}) {
  const text = `New Order: ${orderId}\nTotal: ${totalAmount} Ks`;
  const encodedText = encodeURIComponent(text);

  if (method === 'telegram' && settings?.telegramUrl) {
    const baseUrl = settings.telegramUrl.split('?')[0];
    return `${baseUrl}?text=${encodedText}`;
  }

  if (method === 'viber' && settings?.viberUrl) {
    return settings.viberUrl;
  }

  return null;
}

export default async function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [order, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        guestContactInfo: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.storeSettings.findUnique({
      where: { id: 1 },
      select: {
        telegramUrl: true,
        viberUrl: true,
      },
    }),
  ]);

  if (!order) {
    notFound();
  }

  const contact = parseGuestContactInfo(order.guestContactInfo);
  const method = contact.method === 'viber' ? 'viber' : 'telegram';
  const contactUrl = buildContactUrl({
    method,
    orderId: order.id,
    totalAmount: order.totalAmount,
    settings,
  });

  return (
    <main className="flex-1 bg-gray-50 px-4 py-16 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Order placed successfully
        </h1>
        <p className="mt-3 text-gray-600 dark:text-zinc-300">
          Keep this order number for your records.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-5 text-left dark:border-zinc-800 dark:bg-zinc-950">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-zinc-400">Order number</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                #{order.id.slice(0, 8)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-zinc-400">Date</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-500 dark:text-zinc-400">Status</dt>
              <dd className="font-medium text-gray-900 dark:text-white">{order.status}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4 dark:border-zinc-800">
              <dt className="font-semibold text-gray-900 dark:text-white">Total</dt>
              <dd className="font-semibold text-gray-900 dark:text-white">
                {order.totalAmount.toLocaleString()} Ks
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {contactUrl && (
            <a
              href={contactUrl}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <MessageCircle className="h-4 w-4" />
              Continue on {method === 'viber' ? 'Viber' : 'Telegram'}
            </a>
          )}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
