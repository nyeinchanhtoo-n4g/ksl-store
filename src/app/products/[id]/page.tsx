import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export default async function ProductDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  const isOnSale =
    typeof product.originalPrice === "number" &&
    product.originalPrice > product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 xl:gap-x-16">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-2xl bg-gray-100 overflow-hidden dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}
          {isOnSale && (
            <span className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            {isOnSale && (
              <p className="text-lg font-semibold text-gray-400 line-through dark:text-zinc-500">
                {product.originalPrice!.toLocaleString()} Ks
              </p>
            )}
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {product.price.toLocaleString()} Ks
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700 dark:text-gray-300">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center">
            {product.stock > 0 ? (
              <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                Out of Stock
              </span>
            )}
          </div>

          <div className="mt-8 flex w-full max-w-xs">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
