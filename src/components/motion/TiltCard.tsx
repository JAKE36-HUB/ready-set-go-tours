import * as React from "react"
import { cn } from "@/lib/utils"

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Kept for API compatibility — the CSS version ignores motion props. */
  initial?: unknown
  animate?: unknown
  exit?: unknown
  transition?: unknown
  whileHover?: unknown
  whileInView?: unknown
  viewport?: unknown
  intensity?: number
}

/**
 * CSS-only card with a soft cursor spotlight on hover. Previously this used
 * framer-motion springs on every card; the visual result is nearly identical
 * without shipping the motion runtime to every public page.
 */
export function TiltCard({
  children,
  className,
  initial: _initial,
  animate: _animate,
  exit: _exit,
  transition: _transition,
  whileHover: _whileHover,
  whileInView: _whileInView,
  viewport: _viewport,
  intensity: _intensity,
  ...rest
}: TiltCardProps) {
  // Motion-only props are intentionally ignored by the CSS implementation.
  void _initial
  void _animate
  void _exit
  void _transition
  void _whileHover
  void _whileInView
  void _viewport
  void _intensity

  return (
    <div className={cn("spotlight-card", className)} {...rest}>
      {children}
    </div>
  )
}
