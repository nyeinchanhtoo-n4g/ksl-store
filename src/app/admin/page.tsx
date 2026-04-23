import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await auth();

  const [totalProducts, totalOrders, revenueData] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } }
    })
  ]);

  const totalRevenue = revenueData._sum.totalAmount || 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Products</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalRevenue.toLocaleString()} Ks</p>
        </div>
      </div>
      
      <div className="mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name}! 👋</h2>
        <div className="mt-4 prose prose-blue">
          <p className="text-gray-600 text-lg">
            You are logged in with <span className="font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-md">{session?.user?.role}</span> privileges.
          </p>
          <p className="text-gray-600 mt-4">
            Use the sidebar navigation to setup your e-commerce store, add products, and track customer orders.
          </p>
        </div>
      </div>
    </div>
  );
}
