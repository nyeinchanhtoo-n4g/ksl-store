"use client";

import { useTransition } from "react";
import { createProduct } from "@/actions/product.actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      createProduct(formData);
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="flex items-center text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Product Name</label>
            <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400" placeholder="e.g. Trendy T-Shirt" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Description</label>
            <textarea name="description" id="description" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400" placeholder="Describe the item..."></textarea>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Price (Ks)</label>
              <input type="number" name="price" id="price" min="0" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400" placeholder="15000" />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Initial Stock</label>
              <input type="number" name="stock" id="stock" min="0" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400" placeholder="10" />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Image URL (Optional)</label>
            <input type="url" name="imageUrl" id="imageUrl" placeholder="https://example.com/image.jpg" className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-400" />
            <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">Upload your image to an external service and paste the link here.</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
