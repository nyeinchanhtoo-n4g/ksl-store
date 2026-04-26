"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type CarouselItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonHref?: string;
  meta?: string;
};

interface HomeCarouselProps {
  items: CarouselItem[];
  isOrderSuccess?: boolean;
}

export default function HomeCarousel({
  items,
  isOrderSuccess = false,
}: HomeCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-black">
      <img
        src={activeItem.imageUrl}
        alt={activeItem.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-end px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="w-full max-w-3xl text-white">
          {isOrderSuccess && (
            <div className="mb-8 max-w-2xl rounded-2xl border border-green-400/30 bg-green-500/10 p-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold text-green-200">Order Placed Successfully!</h3>
              <p className="mt-1 text-sm text-green-100/90">
                Thank you for your purchase. We&apos;ve received your order and will contact you shortly.
              </p>
            </div>
          )}

          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-300">
            Premium Collection
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
            {activeItem.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
            {activeItem.description}
          </p>
          {activeItem.meta && (
            <p className="mt-6 text-2xl font-bold text-white sm:text-3xl">
              {activeItem.meta}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={activeItem.buttonHref || "#products"}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              {activeItem.buttonText || "Explore Now"}
            </Link>
            <Link
              href="#products"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Browse Products
            </Link>
          </div>

          {items.length > 1 && (
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={goToPrevious}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="ml-1 flex items-center gap-2">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-10 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
