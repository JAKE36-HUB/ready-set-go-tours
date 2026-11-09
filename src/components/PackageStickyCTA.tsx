"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import { PLAN_SAFARI_ROUTE, whatsappPackageLink } from "@/lib/constants";

export default function PackageStickyCTA({
  name,
  price,
  priceKES,
  noun,
  fromPrice,
  seasonLabel,
}: {
  name: string;
  price: number;
  priceKES: number | null;
  noun: string;
  fromPrice?: number | null;
  seasonLabel?: string | null;
}) {
  const [show, setShow] = useState(false);
  const displayPrice = fromPrice ?? price;

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border p-3 lg:hidden transition-transform duration-300 ease-out"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)" }}
    >
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="flex flex-col leading-tight shrink-0">
          {fromPrice && seasonLabel && (
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2F7D52] dark:text-[#8FD6A6]">
              From · {seasonLabel}
            </span>
          )}
          <span className="text-base font-bold text-foreground">
            ${displayPrice.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {priceKES ? `KES ${priceKES.toLocaleString()}` : "per person"}
          </span>
        </div>
        <a
          href={whatsappPackageLink(name)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[#25D366] hover:bg-[#1fb857] text-white transition-colors shrink-0"
        >
          <MessageCircle className="size-5" />
        </a>
        <Link
          href={PLAN_SAFARI_ROUTE}
          className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-full gradient-primary text-white text-sm font-semibold shadow-lg"
        >
          Plan This {noun}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
