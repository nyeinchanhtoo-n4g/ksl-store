import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditProductForm from "./EditProductForm";

const db = prisma as any;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, collections] = await Promise.all([
    db.product.findUnique({
      where: { id },
    }),
    db.collection.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <Link href="/admin/products" className="text-blue-600 hover:underline mt-4 inline-block">Return to products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products" className="flex items-center text-sm text-gray-500 hover:text-gray-900 font-medium">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
        <EditProductForm product={product} collections={collections} />
      </div>
    </div>
  );
}
