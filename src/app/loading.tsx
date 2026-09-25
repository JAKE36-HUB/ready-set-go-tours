export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-burgundy-100 dark:border-burgundy-900" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-burgundy-500 animate-spin" />
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
        Loading your adventure...
      </p>
    </div>
  );
}
