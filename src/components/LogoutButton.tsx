"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center space-x-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors font-medium"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign out</span>
    </button>
  );
}
