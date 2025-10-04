export function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
        </div>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
          Loading tokens...
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Fetching latest prices from Switcheo
        </p>
      </div>
    </div>
  );
}
