import { updateProduct } from "@/actions/product.actions";
import { Product } from "@prisma/client";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function EditProductForm({
  product,
  collections,
}: {
  product: Product & { collectionId?: string | null };
  collections: Array<{ id: string; name: string }>;
}) {
  const updateProductAction = updateProduct.bind(null, product.id);

  return (
    <form action={updateProductAction} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Product Name</label>
        <input type="text" name="name" id="name" defaultValue={product.name} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Description</label>
        <textarea name="description" id="description" defaultValue={product.description} rows={4} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"></textarea>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Price (Ks)</label>
          <input type="number" name="price" id="price" defaultValue={product.price} min="0" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Stock</label>
          <input type="number" name="stock" id="stock" defaultValue={product.stock} min="0" required className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white" />
        </div>
      </div>

      <div>
        <label htmlFor="collectionId" className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Collection</label>
        <select name="collectionId" id="collectionId" defaultValue={product.collectionId || ""} className="mt-1 block w-full rounded-md border-gray-300 dark:border-zinc-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border bg-white dark:bg-zinc-800 text-gray-900 dark:text-white">
          <option value="">No Collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUploadField
        name="imageUrl"
        label="Product Image"
        defaultValue={product.imageUrl || ""}
        placeholder="https://example.com/image.jpg"
        helperText="Upload directly to Cloudinary or paste an image URL."
        folder="ksl-project/products"
      />

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          Update Product
        </button>
      </div>
    </form>
  );
}
