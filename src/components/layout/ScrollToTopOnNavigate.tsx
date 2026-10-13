"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const skipNext = useRef(false);

  useEffect(() => {
    const onPop = () => {
      skipNext.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    if (skipNext.current) {
      skipNext.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
