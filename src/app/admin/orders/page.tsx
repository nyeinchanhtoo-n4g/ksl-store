import OrderStatusSelect from './OrderStatusSelect';
import { prisma } from '@/lib/prisma';
import { Eye, Pencil } from 'lucide-react';
import Link from 'next/link';
import OrderDeleteButton from './OrderDeleteButton';

function getDueDateLabel(dueDate: Date) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dueStart = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const days = Math.round((dueStart.getTime() - todayStart.getTime()) / 86_400_000);
  const digits = (value: number) => value.toString().replace(/\d/g, (digit) => '၀၁၂၃၄၅၆၇၈၉'[Number(digit)]);

  if (days === 0) return { text: 'ရက်ပြည့်သွားပါပြီ။', className: 'text-green-600 dark:text-green-400' };
  if (days > 0) return { text: `${digits(days)} ရက် ကျန်သေးသည်။`, className: 'text-yellow-600 dark:text-yellow-400' };
  return { text: `${digits(Math.abs(days))} ရက်ကျော်သွားသည်။`, className: 'text-red-600 dark:text-red-400' };
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1><Link href="/admin/orders/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create Order</Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-zinc-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
              <thead className="bg-gray-50 dark:bg-zinc-900">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Customer Contact
                  </th>
                  <th
                    scope="col"
                    className="w-64 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                {orders.map((order) => {
                  let contact = { name: 'N/A', phone: 'N/A', method: 'N/A' };
                  try {
                    contact = JSON.parse(order.guestContactInfo || '{}');
                  } catch {}

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        <div className="text-[11px] font-medium uppercase text-gray-400 dark:text-zinc-500">Create Order Date</div>
                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                        <div className="mt-2 text-[11px] font-medium uppercase text-gray-400 dark:text-zinc-500">Due Date</div>
                        <div>{order.deliveryDate ? order.deliveryDate.toLocaleDateString() : 'Not set'}</div>
                        {order.deliveryDate && (() => { const dueDateLabel = getDueDateLabel(order.deliveryDate); return <div className={`mt-1 text-xs font-semibold ${dueDateLabel.className}`}>{dueDateLabel.text}</div>; })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-zinc-400">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {order.customerName || contact.name}
                        </div>
                        <div>{order.customerPhone || contact.phone}</div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200 uppercase mt-1">
                          {order.customerAccount || contact.method || 'N/A'}
                        </span>
                      </td>
                      <td className="w-64 max-w-64 px-6 py-4 text-left text-sm text-gray-500 dark:text-zinc-400">
                        <div className="flex flex-col items-start gap-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="max-w-56 text-xs">
                              <span className="block truncate">{item.quantity}x {item.product?.name || item.itemName || 'Unknown Product'}</span>
                              {(item.description || item.product?.description) && <span className="block truncate text-gray-400">{item.description || item.product?.description}</span>}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                        {order.totalAmount.toLocaleString()} Ks
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-1">
                          <Link href={`/admin/orders/${order.id}`} aria-label="View order" className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"><Eye className="h-4 w-4" /></Link>
                          <Link href={`/admin/orders/${order.id}/edit`} aria-label="Edit order" className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium text-amber-600 transition hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10"><Pencil className="h-4 w-4" /></Link>
                          <OrderDeleteButton orderId={order.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
