import { prisma } from "@/lib/prisma";
import {
  createCarouselSlide,
  deleteCarouselSlide,
  updateCarouselSlide,
} from "@/actions/admin.actions";
import ImageUploadField from "@/components/admin/ImageUploadField";

const db = prisma as any;

export default async function CarouselManagementPage() {
  const slides = await db.carouselSlide.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Home Carousel</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-zinc-300">
          Manage the full-screen hero slides shown on the home page.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Slide</h2>
        <form action={createCarouselSlide} className="mt-4 grid gap-4 lg:grid-cols-2">
          <input
            type="text"
            name="title"
            required
            placeholder="Slide title"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <div className="lg:col-span-2">
            <ImageUploadField
              name="imageUrl"
              label="Slide Image"
              placeholder="https://example.com/slide.jpg"
              helperText="Upload a wide hero image for the home page."
              folder="ksl-project/carousel"
            />
          </div>
          <textarea
            name="subtitle"
            rows={3}
            placeholder="Subtitle / description"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white lg:col-span-2"
          />
          <input
            type="text"
            name="buttonText"
            placeholder="Button text (optional)"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="text"
            name="buttonHref"
            placeholder="Button link e.g. /products/abc or /#products"
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <input
            type="number"
            name="sortOrder"
            placeholder="Sort order"
            defaultValue={0}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
          />
          <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 dark:border-zinc-700 dark:text-zinc-300">
            <input type="checkbox" name="isActive" defaultChecked />
            Active slide
          </label>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 lg:col-span-2"
          >
            Add Slide
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            No slides yet. Add your first hero slide above.
          </div>
        ) : (
          slides.map((slide: any) => {
            const updateAction = updateCarouselSlide.bind(null, slide.id);
            const deleteAction = deleteCarouselSlide.bind(null, slide.id);

            return (
              <div
                key={slide.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4 overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
                  <img src={slide.imageUrl} alt={slide.title} className="h-48 w-full object-cover" />
                </div>

                <form action={updateAction} className="grid gap-4 lg:grid-cols-2">
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={slide.title}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                  <div className="lg:col-span-2">
                    <ImageUploadField
                      name="imageUrl"
                      label="Slide Image"
                      defaultValue={slide.imageUrl}
                      placeholder="https://example.com/slide.jpg"
                      helperText="Upload a wide hero image for the home page."
                      folder="ksl-project/carousel"
                    />
                  </div>
                  <textarea
                    name="subtitle"
                    rows={3}
                    defaultValue={slide.subtitle || ""}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white lg:col-span-2"
                  />
                  <input
                    type="text"
                    name="buttonText"
                    defaultValue={slide.buttonText || ""}
                    placeholder="Button text"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                  <input
                    type="text"
                    name="buttonHref"
                    defaultValue={slide.buttonHref || ""}
                    placeholder="Button link"
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                  <input
                    type="number"
                    name="sortOrder"
                    defaultValue={slide.sortOrder}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                  <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 dark:border-zinc-700 dark:text-zinc-300">
                    <input type="checkbox" name="isActive" defaultChecked={slide.isActive} />
                    Active slide
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Save Slide
                  </button>
                </form>

                <form action={deleteAction} className="mt-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                  >
                    Delete Slide
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
