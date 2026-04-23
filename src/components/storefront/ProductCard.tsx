import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="group block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700">
      <div className="relative aspect-[4/3] w-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <span className="text-gray-400 font-medium">No Image</span>
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
          <p className="text-xl font-extrabold text-gray-900 dark:text-white">
            {product.price.toLocaleString()} Ks
          </p>
          <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 group-hover:opacity-80 transition-opacity">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
