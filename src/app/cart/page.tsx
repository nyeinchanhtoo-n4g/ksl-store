"use client";

import { useCart } from "@/store/useCart";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, updateQuantity, removeItem, getTotals } = useCart();
  const totals = getTotals();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Your Cart is Empty</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Discover our products and start shopping.</p>
        <Link href="/" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-10">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-8">
          <ul role="list" className="border-t border-gray-200 dark:border-zinc-800 divide-y divide-gray-200 dark:divide-zinc-800">
            {items.map((item) => (
              <li key={item.product.id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0">
                  <div className="relative h-24 w-24 rounded-lg overflow-hidden sm:h-32 sm:w-32 bg-gray-100 dark:bg-zinc-800">
                    {item.product.imageUrl ? (
                      <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                    ) : (
                      <span className="flex items-center justify-center h-full text-xs text-gray-400">No Image</span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium">
                          <Link href={`/products/${item.product.id}`} className="text-gray-900 dark:text-white hover:text-blue-600">
                            {item.product.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">{item.product.price.toLocaleString()} Ks</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9 flex items-center">
                      <div className="flex items-center border border-gray-300 dark:border-zinc-700 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-1 text-gray-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="ml-4 p-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order summary */}
        <section className="mt-16 bg-gray-50 dark:bg-zinc-900 rounded-2xl px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-4 border border-gray-200 dark:border-zinc-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order summary</h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600 dark:text-gray-400">Total Items</dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white">{totals.totalQuantity}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 pt-4">
              <dt className="text-base font-medium text-gray-900 dark:text-white">Order total</dt>
              <dd className="text-base font-medium text-gray-900 dark:text-white">{totals.totalPrice.toLocaleString()} Ks</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
