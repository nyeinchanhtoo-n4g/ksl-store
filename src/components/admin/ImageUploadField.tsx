"use client";

import { ChangeEvent, useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
  folder?: string;
}

export default function ImageUploadField({
  name,
  label,
  defaultValue = "",
  placeholder = "https://example.com/image.jpg",
  helperText,
  folder = "ksl-project",
}: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Upload failed");
      }

      setValue(result.secure_url || "");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <input type="hidden" name={name} value={value} />

      <div className="mt-1 flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          id={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-white dark:placeholder:text-zinc-400"
        />

        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          <span>{isUploading ? "Uploading..." : "Upload"}</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.ico"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {helperText && <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">{helperText}</p>}
      {error && <p className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>}

      {value && (
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-zinc-700 dark:bg-zinc-900">
          <img src={value} alt={label} className="h-24 w-auto max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
