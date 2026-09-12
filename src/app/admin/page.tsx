import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import RevenueChart from "@/components/admin/RevenueChart";
import Link from "next/link";

const money = (value: number | null | undefined) => `${(value || 0).toLocaleString()} Ks`;

export default async function AdminDashboardPage() {
  await auth();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [products, orderStatusGroups, revenueData, orderItems, recentOrders, recentRevenue] = await Promise.all([
    prisma.product.findMany({ orderBy: [{ stock: "asc" }, { name: "asc" }], select: { id: true, name: true, stock: true } }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.orderItem.findMany({ where: { order: { status: { not: "CANCELLED" } } }, select: { itemName: true, quantity: true, price: true, product: { select: { name: true } } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, customerName: true, guestContactInfo: true, totalAmount: true, status: true, createdAt: true } }),
    prisma.order.findMany({ where: { status: { not: "CANCELLED" }, createdAt: { gte: sevenDaysAgo } }, select: { createdAt: true, totalAmount: true } }),
  ]);

  const statusCount = (status: string) => orderStatusGroups.find((group) => group.status === status)?._count._all || 0;
  const totalOrders = orderStatusGroups.reduce((total, group) => total + group._count._all, 0);
  const activeOrders = totalOrders - statusCount("CANCELLED");
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const totalSold = orderItems.reduce((total, item) => total + item.quantity, 0);
  const productSales = new Map<string, { quantity: number; revenue: number }>();
  for (const item of orderItems) {
    const name = item.itemName || item.product?.name || "Unknown item";
    const current = productSales.get(name) || { quantity: 0, revenue: 0 };
    current.quantity += item.quantity;
    current.revenue += item.quantity * item.price;
    productSales.set(name, current);
  }
  const bestSellers = [...productSales.entries()].sort(([, first], [, second]) => second.quantity - first.quantity).slice(0, 5);
  const lowStockProducts = products.filter((product) => product.stock <= 5).slice(0, 6);
  const chartDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    chartDataMap[date.toLocaleDateString("en-US", { month: "short", day: "numeric" })] = 0;
  }
  for (const order of recentRevenue) {
    const key = order.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (key in chartDataMap) chartDataMap[key] += order.totalAmount;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1><p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Store performance at a glance.</p></div><span className="text-sm text-gray-500 dark:text-zinc-400">Updated {new Date().toLocaleDateString()}</span></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><Metric label="Products" value={products.length.toLocaleString()} href="/admin/products" /><Metric label="Available Stock" value={totalStock.toLocaleString()} /><Metric label="Active Orders" value={activeOrders.toLocaleString()} href="/admin/orders" /><Metric label="Sold Quantity" value={totalSold.toLocaleString()} /><Metric label="Revenue" value={money(revenueData._sum.totalAmount)} tone="green" /></div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trends</h2><p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Non-cancelled orders from the last 7 days.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">7 Days</span></div><RevenueChart data={Object.entries(chartDataMap).map(([date, revenue]) => ({ date, revenue }))} /></section><section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Status</h2><div className="mt-5 grid grid-cols-2 gap-3"><StatusCard label="Pending" value={statusCount("PENDING")} color="text-amber-600 dark:text-amber-400" /><StatusCard label="Complete" value={statusCount("COMPLETE")} color="text-green-600 dark:text-green-400" /><StatusCard label="Processing" value={statusCount("PROCESSING")} color="text-blue-600 dark:text-blue-400" /><StatusCard label="Cancelled" value={statusCount("CANCELLED")} color="text-red-600 dark:text-red-400" /></div></section></div>

      <div className="grid gap-6 xl:grid-cols-2"><section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Best-selling Items</h2><span className="text-xs text-gray-500 dark:text-zinc-400">By quantity</span></div><div className="mt-4 space-y-3">{bestSellers.length === 0 ? <p className="text-sm text-gray-500 dark:text-zinc-400">No sales yet.</p> : bestSellers.map(([name, data], index) => <div key={name} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 dark:border-zinc-800"><div className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">{index + 1}</span><span className="truncate text-sm font-medium text-gray-900 dark:text-white">{name}</span></div><div className="text-right"><div className="text-sm font-bold text-gray-900 dark:text-white">{data.quantity.toLocaleString()} sold</div><div className="text-xs text-gray-500 dark:text-zinc-400">{money(data.revenue)}</div></div></div>)}</div></section><section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Low Stock</h2><Link href="/admin/products" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View products</Link></div><div className="mt-4 space-y-3">{lowStockProducts.length === 0 ? <p className="text-sm text-gray-500 dark:text-zinc-400">All products have healthy stock.</p> : lowStockProducts.map((product) => <div key={product.id} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 dark:border-zinc-800"><span className="truncate text-sm font-medium text-gray-900 dark:text-white">{product.name}</span><span className={`text-sm font-bold ${product.stock === 0 ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>{product.stock.toLocaleString()} left</span></div>)}</div></section></div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2><Link href="/admin/orders" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">View all</Link></div><div className="mt-4 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead><tr className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-zinc-800 dark:text-zinc-400"><th className="px-3 py-3">Customer</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Total</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{recentOrders.map((order) => { let contact: { name?: string } = {}; try { contact = JSON.parse(order.guestContactInfo || "{}"); } catch {} return <tr key={order.id} className="border-b border-gray-100 last:border-0 dark:border-zinc-800"><td className="px-3 py-3 font-medium text-gray-900 dark:text-white">{order.customerName || contact.name || "Guest"}</td><td className="whitespace-nowrap px-3 py-3 text-gray-500 dark:text-zinc-400">{order.createdAt.toLocaleDateString()}</td><td className="whitespace-nowrap px-3 py-3 font-semibold text-gray-900 dark:text-white">{money(order.totalAmount)}</td><td className="px-3 py-3"><span className="text-xs font-semibold uppercase text-gray-600 dark:text-zinc-300">{order.status}</span></td></tr>; })}</tbody></table></div></section>
    </div>
  );
}

function Metric({ label, value, href, tone }: { label: string; value: string; href?: string; tone?: "green" }) { const content = <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"><p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">{label}</p><p className={`mt-2 text-2xl font-bold ${tone === "green" ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>{value}</p></div>; return href ? <Link href={href}>{content}</Link> : content; }
function StatusCard({ label, value, color }: { label: string; value: number; color: string }) { return <div className="rounded-xl border border-gray-100 p-4 dark:border-zinc-800"><p className="text-sm text-gray-500 dark:text-zinc-400">{label}</p><p className={`mt-1 text-2xl font-bold ${color}`}>{value.toLocaleString()}</p></div>; }
