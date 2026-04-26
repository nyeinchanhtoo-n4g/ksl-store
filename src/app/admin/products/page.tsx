import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

const db = prisma as any;

export default async function ProductsManagementPage() {
  const products = await db.product.findMany({
    include: { collection: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">Products Inventory</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-zinc-300">
            Manage your store&apos;s products. Add new items, update their prices and stock, or edit details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/products/new"
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-zinc-800 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-900">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Product</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Collection</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Price (Ks)</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-zinc-400">
                        No products found. Start by adding a new product.
                      </td>
                    </tr>
                  )}
                  {products.map((product: any) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        <div className="flex items-center">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 flex-shrink-0 rounded-md object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200 dark:bg-zinc-800 mr-3 flex items-center justify-center text-gray-400">IMG</div>
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                        {product.collection?.name || "Unassigned"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">{product.price.toLocaleString("en-US")} Ks</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-zinc-400">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          product.stock > 10 ? 'bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-200' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200' : 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-200'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end space-x-4">
                          <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-300" title="Edit Product">
                            <Edit2 className="w-5 h-5" />
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
