import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist. Let us guide you back to your adventure.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex size-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
        <Compass className="size-10" />
      </div>
      <h1 className="mb-4 font-display text-6xl font-normal text-foreground">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-foreground/80">
        Page Not Found
      </h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Looks like you&apos;ve wandered off the beaten path. Let us guide you back to your adventure.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <Compass className="size-5" />
        Return Home
      </Link>
    </div>
  );
}
