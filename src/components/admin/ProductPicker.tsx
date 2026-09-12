"use client";

import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

type ProductOption = { id: string; name: string; price: number; description: string };

export default function ProductPicker({ products, initialName = "", initialDescription = "" }: { products: ProductOption[]; initialName?: string; initialDescription?: string }) {
  const [query, setQuery] = useState(initialName);
  const [selectedName, setSelectedName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [isOpen, setIsOpen] = useState(false);
  const filteredProducts = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [products, query]);

  function selectProduct(product: ProductOption) {
    setQuery(product.name);
    setSelectedName(product.name);
    setDescription(product.description);
    setIsOpen(false);
  }

  return <div className="relative md:col-span-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Item Name</label>
    <input type="hidden" name="itemName" value={selectedName} />
    <div className="relative mt-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input value={query} onChange={(event) => { setQuery(event.target.value); setSelectedName(event.target.value); setIsOpen(true); }} onFocus={() => setIsOpen(true)} onBlur={() => setTimeout(() => setIsOpen(false), 100)} placeholder="Search products..." required className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
    {isOpen && <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">{filteredProducts.length > 0 ? filteredProducts.map((product) => <button type="button" key={product.id} onMouseDown={(event) => event.preventDefault()} onClick={() => selectProduct(product)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 dark:text-zinc-200 dark:hover:bg-zinc-700"><span>{product.name}</span><span className="ml-3 whitespace-nowrap text-xs text-gray-500 dark:text-zinc-400">{product.price.toLocaleString()} Ks</span></button>) : <p className="px-3 py-2 text-sm text-gray-500 dark:text-zinc-400">No products found.</p>}</div>}
    <label className="mt-4 block text-sm font-medium text-gray-700 dark:text-zinc-300">Description<textarea name="description" rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" /></label>
  </div>;
}
