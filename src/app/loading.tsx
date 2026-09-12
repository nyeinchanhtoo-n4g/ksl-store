export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-white/45 pt-20 backdrop-blur-[1px] dark:bg-zinc-950/45"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400" />
        Loading...
      </div>
    </div>
  );
}
