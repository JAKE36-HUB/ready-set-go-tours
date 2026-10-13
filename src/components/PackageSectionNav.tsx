"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

export default function PackageSectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const onScroll = () => {
      const offset = 150;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - offset <= 0) current = el.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="border-t border-foreground/5">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex items-center gap-1 overflow-x-auto py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((it) => (
            <li key={it.id} className="shrink-0">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById(it.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap",
                  active === it.id
                    ? "bg-primary/10 dark:bg-amber-400/10 text-primary dark:text-amber-400 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {it.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
