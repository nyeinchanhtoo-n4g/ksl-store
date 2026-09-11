"use client";

import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

export default function AttachmentUploadField({ initialUrls = "" }: { initialUrls?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(() => initialUrls.split("\n").map((url) => url.trim()).filter(Boolean));
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setError("");

    try {
      const uploadedUrls = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Image upload failed.");
        return result.secure_url as string;
      }));
      setUrls((current) => [...current, ...uploadedUrls]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return <div className="md:col-span-2">
    <input type="hidden" name="attachmentUrls" value={urls.join("\n")} />
    <p className="block text-sm font-medium text-gray-700 dark:text-zinc-300">Order Images</p>
    <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleUpload} className="sr-only" />
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => inputRef.current?.click()} disabled={isUploading} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800">
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isUploading ? "Uploading..." : "Upload images"}
      </button>
      {urls.length > 0 && <span className="text-sm text-gray-500 dark:text-zinc-400">{urls.length} image{urls.length === 1 ? "" : "s"} attached</span>}
    </div>
    {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    {urls.length > 0 && <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{urls.map((url) => <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700"><Image src={url} alt="Order attachment" fill sizes="(max-width: 640px) 50vw, 160px" className="object-cover" /><button type="button" onClick={() => setUrls((current) => current.filter((item) => item !== url))} className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/70 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100" aria-label="Remove image"><X className="h-4 w-4" /></button></div>)}</div>}
  </div>;
}
