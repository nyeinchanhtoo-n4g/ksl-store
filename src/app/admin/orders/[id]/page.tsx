import OrderStatusSelect from '../OrderStatusSelect';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
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
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Order Details</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/orders/${order.id}/edit`} aria-label="Edit order" title="Edit order" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 dark:border-zinc-700 dark:text-amber-300 dark:hover:bg-amber-500/10"><Pencil className="h-4 w-4" />Edit</Link>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <section className="order-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-gray-200 px-7 py-5 dark:border-zinc-800">
            <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h2><p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{order.items.length} item{order.items.length === 1 ? '' : 's'} in this order</p></div>
            <span className="text-sm font-medium text-gray-500 dark:text-zinc-400">{order.totalAmount.toLocaleString()} Ks</span>
          </div>
          <div className="hidden grid-cols-[minmax(0,1fr)_110px_150px] gap-6 border-b border-gray-200 bg-gray-50 px-7 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 sm:grid">
            <span>Product</span><span className="text-right">Quantity</span><span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-zinc-800">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 px-7 py-6 sm:grid-cols-[minmax(0,1fr)_110px_150px] sm:items-start sm:gap-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.product?.name || item.itemName || 'Unknown Product'}
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
                  <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">
                    {item.quantity} x {item.price.toLocaleString()} Ks
                  </p>
                  {(item.description || item.product?.description) && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-500 dark:text-zinc-400">{item.description || item.product?.description}</p>}
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-300 sm:text-right">
                  {item.quantity}
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white sm:text-right">
                  {(item.quantity * item.price).toLocaleString()} Ks
                </p>
              </div>
            ))}
          </div>
        </section>

        <aside className="order-1 grid items-stretch gap-8 md:grid-cols-2 xl:grid-cols-3">
          <section className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Customer</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Name</dt>
                <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                  {order.customerName || contact.name || order.user?.name || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Phone</dt>
                <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                  {order.customerPhone || contact.phone || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Contact method</dt>
                <dd className="mt-1 font-medium uppercase text-gray-900 dark:text-white">
                  {order.customerAccount || contact.method || 'N/A'}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-zinc-400">Address</dt>
                <dd className="mt-1 whitespace-pre-wrap font-medium text-gray-900 dark:text-white">
                  {order.deliveryAddress || contact.address || 'N/A'}
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

          {order.isManual && <section className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manual Order Details</h2><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-1"><div><dt className="text-gray-500 dark:text-zinc-400">Leather</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{order.leather || 'Not set'}</dd></div><div><dt className="text-gray-500 dark:text-zinc-400">Deposit</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{order.deposit?.toLocaleString() || '0'} Ks</dd></div><div><dt className="text-gray-500 dark:text-zinc-400">Deli Charge</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{order.deliveryCharge?.toLocaleString() || '0'} Ks</dd></div><div><dt className="text-gray-500 dark:text-zinc-400">Due date</dt><dd className="mt-1 font-medium text-gray-900 dark:text-white">{order.deliveryDate ? order.deliveryDate.toLocaleDateString() : 'Not set'}</dd></div><div className="sm:col-span-2 lg:col-span-1"><dt className="text-gray-500 dark:text-zinc-400">Setup note</dt><dd className="mt-1 whitespace-pre-wrap font-medium text-gray-900 dark:text-white">{order.setupNote || 'None'}</dd></div>{order.attachmentUrls && <div className="sm:col-span-2 lg:col-span-1"><dt className="text-gray-500 dark:text-zinc-400">Attachments</dt><dd className="mt-2 space-y-1 break-all font-medium">{order.attachmentUrls.split('\n').map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="block text-blue-600 hover:underline dark:text-blue-400">View image</a>)}</dd></div>}</dl></section>}

          <section className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
