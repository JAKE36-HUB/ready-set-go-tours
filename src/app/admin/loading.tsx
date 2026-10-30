export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-sky-100 dark:border-sky-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
        Loading your adventure...
      </p>
    </div>
  );
}
