import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import RevenueChart from "@/components/admin/RevenueChart";

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

  // Chart Data Preparation (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0,0,0,0);

  const recentOrders = await prisma.order.findMany({
    where: {
      status: { not: "CANCELLED" },
      createdAt: { gte: sevenDaysAgo }
    },
    select: { createdAt: true, totalAmount: true }
  });

  const chartDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    chartDataMap[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
  }

  recentOrders.forEach(order => {
    const dateStr = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (chartDataMap[dateStr] !== undefined) {
      chartDataMap[dateStr] += order.totalAmount;
    }
  });

  const chartData = Object.keys(chartDataMap).map(date => ({
    date,
    revenue: chartDataMap[date]
  }));

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
      
      <div className="mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-2">
           <h2 className="text-2xl font-bold text-gray-900">Revenue Trends</h2>
           <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">Last 7 Days</span>
        </div>
        <p className="text-gray-500 text-sm">Visualizing the monetary value across all non-cancelled orders.</p>
        
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}
