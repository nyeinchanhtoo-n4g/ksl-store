import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

type ProductWithOptionalOriginalPrice = Product & { originalPrice?: number | null };

export default function ProductCard({
  product,
  priority = false,
}: {
  product: ProductWithOptionalOriginalPrice;
  priority?: boolean;
}) {
  const originalPriceNumber =
    typeof product.originalPrice === "number" ? product.originalPrice : null;
  const isOnSale = originalPriceNumber !== null && originalPriceNumber > product.price;

  return (
    <Link href={`/products/${product.id}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700">
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <span className="text-gray-400 font-medium">No Image</span>
        )}
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
            Sale
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div className="min-w-0">
            {isOnSale && (
              <p className="text-sm font-semibold text-gray-400 line-through dark:text-zinc-500">
                {originalPriceNumber!.toLocaleString()} Ks
              </p>
            )}
            <p className="text-xl font-extrabold text-gray-900 dark:text-white">
              {product.price.toLocaleString()} Ks
            </p>
          </div>
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 group-hover:opacity-80 transition-opacity">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
