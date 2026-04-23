"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/order.actions";
import { OrderStatus } from "@prisma/client";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
  SHIPPED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  };

  const colorClass = STATUS_COLORS[currentStatus] || "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={isPending}
      className={`text-xs font-medium rounded-full px-2.5 py-1 pt-1.5 pb-1.5 border outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors disabled:opacity-50 appearance-none ${colorClass}`}
    >
      <option value="PENDING">PENDING</option>
      <option value="PROCESSING">PROCESSING</option>
      <option value="SHIPPED">SHIPPED</option>
      <option value="DELIVERED">DELIVERED</option>
      <option value="CANCELLED">CANCELLED</option>
    </select>
  );
}
