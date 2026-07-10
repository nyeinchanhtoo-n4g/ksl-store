import OrderStatusSelect from '../OrderStatusSelect';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ExternalLink } from 'lucide-react';
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

export default async function AdminOrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: true,
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const contact = parseGuestContactInfo(order.guestContactInfo);
  const itemSubtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product?.name || 'Unknown Product'}
                    </p>
                    {item.product && (
                      <Link
                        href={`/products/${item.product.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        View product
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
                    {item.quantity} x {item.price.toLocaleString()} Ks
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {(item.quantity * item.price).toLocaleString()} Ks
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Name</dt>
                <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                  {contact.name || order.user?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Phone</dt>
                <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                  {contact.phone || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Contact method</dt>
                <dd className="mt-1 font-medium uppercase text-gray-900 dark:text-white">
                  {contact.method || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Address</dt>
                <dd className="mt-1 whitespace-pre-wrap font-medium text-gray-900 dark:text-white">
                  {contact.address || 'N/A'}
                </dd>
              </div>
              {order.user?.email && (
                <div>
                  <dt className="text-gray-500 dark:text-zinc-400">Account email</dt>
                  <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                    {order.user.email}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Summary</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 dark:text-zinc-400">Items</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {order.items.reduce((total, item) => total + item.quantity, 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-gray-500 dark:text-zinc-400">Subtotal</dt>
                <dd className="font-medium text-gray-900 dark:text-white">
                  {itemSubtotal.toLocaleString()} Ks
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-zinc-800">
                <dt className="text-base font-semibold text-gray-900 dark:text-white">
                  Order total
                </dt>
                <dd className="text-base font-semibold text-gray-900 dark:text-white">
                  {order.totalAmount.toLocaleString()} Ks
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
