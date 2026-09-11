"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export default function LedgerDeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Delete this statement entry permanently?")) return;
    startTransition(() => onDelete());
  }

  return <button type="button" onClick={handleDelete} disabled={isPending} aria-label="Delete entry" className="inline-flex items-center rounded-lg px-2 py-1.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>;
}
