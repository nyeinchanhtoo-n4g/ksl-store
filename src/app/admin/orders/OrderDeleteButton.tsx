"use client";

import { deleteOrder } from "@/actions/order.actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Delete this order permanently?")) return;
    startTransition(() => deleteOrder(orderId));
  }

  return <button type="button" onClick={handleDelete} disabled={isPending} aria-label="Delete order" className="inline-flex items-center rounded-lg px-2 py-1.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>;
}
