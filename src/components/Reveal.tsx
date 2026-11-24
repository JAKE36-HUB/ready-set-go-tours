import { cn } from "@/lib/utils"

/**
 * Server-rendered scroll reveal. CSS handles the animation at paint time,
 * so no client JavaScript is shipped just to fade in static sections.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div
      className={cn("css-reveal", className)}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
