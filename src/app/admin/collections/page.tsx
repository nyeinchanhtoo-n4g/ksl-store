import { prisma } from '@/lib/prisma';
import { createCollection, deleteCollection, updateCollection } from '@/actions/admin.actions';
import type { Prisma } from '@prisma/client';

type CollectionWithCount = Prisma.CollectionGetPayload<{
  include: {
    _count: {
      select: { products: true };
    };
  };
}>;

export default async function CollectionsPage() {
  const collections: CollectionWithCount[] = await prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Collections</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-zinc-300">
          Create product groups using the name `Collection` and organize how items appear on the
          storefront.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Collection</h2>
        <form action={createCollection} className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            name="name"
            placeholder="Collection name"
            required
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="text"
            name="description"
            placeholder="Short description (optional)"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {collections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            No collections yet. Create your first collection above.
          </div>
        ) : (
          collections.map((collection) => {
            const updateAction = updateCollection.bind(null, collection.id);
            const deleteAction = deleteCollection.bind(null, collection.id);

            return (
              <div
                key={collection.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <form
                  action={updateAction}
                  className="grid gap-4 lg:grid-cols-[1fr_2fr_auto_auto] lg:items-start"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={collection.name}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
                      {collection._count.products} products in this collection
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-zinc-300">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={collection.description || ''}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Save
                  </button>
                </form>

                <form action={deleteAction} className="mt-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                  >
                    Delete Collection
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
