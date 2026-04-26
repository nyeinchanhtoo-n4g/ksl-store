"use client";

import { useCart } from "@/store/useCart";
import { placeGuestOrder } from "@/actions/order.actions";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsClient } from "@/lib/useIsClient";

export default function CheckoutPage() {
  const { items, getTotals, clearCart } = useCart();
  const totals = getTotals();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient && items.length === 0) router.replace("/cart");
  }, [items.length, router, isClient]);

  if (!isClient) return null;

  if (items.length === 0) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const contactInfo = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      method: formData.get("method") as string,
    };

    const orderItems = items.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      const result = await placeGuestOrder(contactInfo, orderItems, totals.totalPrice);
      if (result.success) {
        clearCart();
        window.location.assign(result.redirectUrl);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">Checkout</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
             <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
             <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
          </div>
          <div>
             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
             <input type="tel" name="phone" id="phone" required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
          </div>
          <div>
             <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address</label>
             <textarea name="address" id="address" rows={3} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"></textarea>
          </div>
          <div>
             <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Continue Order Via</span>
             <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="method" value="telegram" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-900 dark:text-white">Telegram</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="method" value="viber" className="text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-900 dark:text-white">Viber</span>
                </label>
             </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-zinc-800 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Total: {totals.totalPrice.toLocaleString()} Ks
            </span>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
