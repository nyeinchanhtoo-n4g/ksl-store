import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, ShoppingCart, Home, Settings, ShieldCheck } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the latest user data from DB to ensure role is up to date
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true }
  });

  if (!dbUser) {
    redirect("/login");
  }

  // Auto-promote the first user to OWNER if no OWNER exists in the system
  const ownerCount = await prisma.user.count({
    where: { role: "OWNER" }
  });

  if (ownerCount === 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "OWNER" }
    });
    // Refresh to pick up the new role
    redirect("/admin");
  }

  // Prevent ordinary users from accessing the admin panel
  if (dbUser.role === "USER") {
    redirect("/"); 
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white dark:bg-zinc-900 shadow-xl flex flex-col hidden md:flex z-10 border-r border-transparent dark:border-zinc-800">
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Panel</h2>
          <div className="mt-2 text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200 rounded-full inline-block">
            {dbUser.role}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 text-gray-700 dark:text-zinc-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800/70 dark:hover:text-white p-3 rounded-lg transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 text-gray-700 dark:text-zinc-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800/70 dark:hover:text-white p-3 rounded-lg transition-colors font-medium">
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 text-gray-700 dark:text-zinc-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800/70 dark:hover:text-white p-3 rounded-lg transition-colors font-medium">
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          {dbUser.role === "OWNER" && (
            <Link href="/admin/users" className="flex items-center space-x-3 text-gray-700 dark:text-zinc-200 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-zinc-800/70 dark:hover:text-white p-3 rounded-lg transition-colors font-medium">
              <Users className="w-5 h-5" />
              <span>Team Settings</span>
            </Link>
          )}
          <Link href="/admin/profile" className="flex items-center space-x-3 text-gray-700 dark:text-zinc-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800/70 dark:hover:text-white p-3 rounded-lg transition-colors font-medium">
            <ShieldCheck className="w-5 h-5" />
            <span>Security</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 text-gray-700 dark:text-zinc-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800/70 dark:hover:text-white p-3 rounded-lg transition-colors font-medium">
            <Settings className="w-5 h-5" />
            <span>Store Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-zinc-950 flex flex-col relative">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
             <span className="md:hidden font-bold text-gray-900 dark:text-white">Admin</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-sm text-gray-600 dark:text-zinc-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800/70 dark:hover:text-white px-3 py-2 rounded-lg transition-colors font-medium">
              <Home className="w-4 h-4" />
              <span>Go to Store</span>
            </Link>
            <div className="w-px h-5 bg-gray-200 dark:bg-zinc-800"></div>
            <LogoutButton />
          </div>
        </header>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
