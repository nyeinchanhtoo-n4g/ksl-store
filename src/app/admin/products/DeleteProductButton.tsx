"use client";

import { useTransition } from "react";
import { deleteProduct } from "@/actions/product.actions";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        await deleteProduct(productId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-red-600 hover:text-red-900 ${isPending ? "opacity-50" : ""}`}
      title="Delete Product"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
