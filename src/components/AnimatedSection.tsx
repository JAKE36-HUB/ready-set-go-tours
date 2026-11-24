"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

/**
 * Lightweight scroll-reveal using IntersectionObserver + CSS. Avoids shipping
 * framer-motion on every public page just for a one-off fade-in.
 */
export default function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("reveal-section-visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transform = {
    up: "translateY(16px)",
    down: "translateY(-16px)",
    left: "translateX(24px)",
    right: "translateX(-24px)",
    none: "none",
  }[direction];

  return (
    <div
      ref={ref}
      className={cn("reveal-section", visible && "reveal-section-visible", className)}
      style={{
        "--reveal-transform": transform,
        "--reveal-delay": `${delay}ms`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
