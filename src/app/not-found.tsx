import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg mb-8">
        <Compass className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Page Not Found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
        Looks like you&apos;ve wandered off the beaten path. Let us guide you back to your adventure.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <Compass className="w-5 h-5" />
        Return Home
      </Link>
    </div>
  );
}
