'use client';

import { useCart } from '@/store/useCart';
import { Product } from '@prisma/client';
import { ShoppingCart } from 'lucide-react';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const isSoldOut = product.stock <= 0;

  return (
    <button
      onClick={() => addItem(product)}
      disabled={isSoldOut}
      className="flex flex-1 items-center justify-center rounded-xl border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed sm:w-full transition-colors"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {isSoldOut ? 'Sold Out' : 'Add to Cart'}
    </button>
  );
}
