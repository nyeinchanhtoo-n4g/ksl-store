"use client";

import { useTransition } from "react";
import { updateUserRole } from "@/actions/admin.actions";

export default function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "USER" | "ADMIN" | "OWNER";
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
      } catch {
        alert("Failed to update role. Are you sure you're the OWNER?");
      }
    });
  };

  return (
    <select
      disabled={isPending}
      value={currentRole}
      onChange={handleChange}
      className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none sm:leading-6 ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      } ${
        currentRole === 'OWNER' ? 'bg-purple-50 text-purple-700' :
        currentRole === 'ADMIN' ? 'bg-blue-50 text-blue-700' :
        'bg-gray-50 text-gray-700'
      }`}
    >
      <option value="USER">USER</option>
      <option value="ADMIN">ADMIN</option>
      <option value="OWNER">OWNER</option>
    </select>
  );
}
