import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/storefront/ProductCard";
import Link from "next/link";

export default async function HomePage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const isOrderSuccess = searchParams?.orderSuccess === "true";

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-950 pt-24 pb-32">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-white to-white dark:from-blue-900/20 dark:via-zinc-950 dark:to-zinc-950"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="h-96 w-96 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/10 mix-blend-multiply dark:mix-blend-lighten animate-blob"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {isOrderSuccess && (
            <div className="mb-10 p-5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl max-w-2xl mx-auto shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center space-x-4 text-green-800 dark:text-green-300">
                <div className="bg-green-100 dark:bg-green-800/50 p-2.5 rounded-full flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg dark:text-green-100">Order Placed Successfully!</h3>
                  <p className="text-sm mt-0.5 opacity-90">Thank you for your purchase. We&apos;ve received your order and will contact you shortly.</p>
                </div>
              </div>
            </div>
          )}
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 mb-8 shadow-sm">
            Discover Premium Collections
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl mb-6">
            Elevate Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Lifestyle Today.
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Experience the finest selection of premium gadgets, watches, and accessories meticulously curated for the modern individual.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="#products"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-8 py-4 text-sm font-medium text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products" className="py-24 bg-gray-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl relative inline-block">
              Featured Products
              <div className="absolute -bottom-3 left-0 w-1/3 h-1 bg-blue-600 rounded-full"></div>
            </h2>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <p className="text-gray-500 dark:text-gray-400">No products available yet. Run the seeder to populate realistic data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
