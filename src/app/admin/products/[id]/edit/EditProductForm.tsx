"use client";

import { useTransition } from "react";
import { updateProduct } from "@/actions/product.actions";
import { Product } from "@prisma/client";

export default function EditProductForm({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      updateProduct(product.id, formData);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Product Name</label>
        <input type="text" name="name" id="name" defaultValue={product.name} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Description</label>
        <textarea name="description" id="description" defaultValue={product.description} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"></textarea>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Price (Ks)</label>
          <input type="number" name="price" id="price" defaultValue={product.price} min="0" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Stock</label>
          <input type="number" name="stock" id="stock" defaultValue={product.stock} min="0" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
        </div>
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Image URL (Optional)</label>
        <input type="url" name="imageUrl" id="imageUrl" defaultValue={product.imageUrl || ""} placeholder="https://example.com/image.jpg" className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400" />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Updating..." : "Update Product"}
        </button>
      </div>
    </form>
  );
}
