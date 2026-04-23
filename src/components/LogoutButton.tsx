"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex w-full items-center space-x-3 text-red-600 hover:bg-red-50 p-3 rounded-lg transition-colors font-medium mt-2"
    >
      <LogOut className="w-5 h-5" />
      <span>Sign out</span>
    </button>
  );
}
