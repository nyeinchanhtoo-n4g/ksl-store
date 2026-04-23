import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, ShoppingCart, Home, Settings } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Prevent ordinary users from accessing the admin panel
  if (session.user.role === "USER") {
    redirect("/"); 
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white shadow-xl flex flex-col hidden md:flex z-10">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Panel</h2>
          <div className="mt-2 text-sm font-medium px-3 py-1 bg-blue-100 text-blue-800 rounded-full inline-block">
            {session.user.role}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded-lg transition-colors font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded-lg transition-colors font-medium">
            <ShoppingBag className="w-5 h-5" />
            <span>Products</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded-lg transition-colors font-medium">
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </Link>
          {session.user.role === "OWNER" && (
            <Link href="/admin/users" className="flex items-center space-x-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 p-3 rounded-lg transition-colors font-medium">
              <Users className="w-5 h-5" />
              <span>Team Settings</span>
            </Link>
          )}
          <Link href="/admin/settings" className="flex items-center space-x-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 p-3 rounded-lg transition-colors font-medium">
            <Settings className="w-5 h-5" />
            <span>Store Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="/" className="flex items-center space-x-3 text-gray-600 hover:bg-gray-50 p-3 rounded-lg transition-colors font-medium">
            <Home className="w-5 h-5" />
            <span>Go to Store</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
