import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Subtle button lift on hover. Previously this used framer-motion springs to
 * follow the cursor, which pulled the whole motion runtime into the initial
 * bundle for a decorative effect. The CSS version keeps the visual feedback
 * without any client JavaScript.
 */
export function Magnetic({
  children,
  className,
  strength: _strength = 16,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  void _strength

  return <div className={cn("magnetic", className)}>{children}</div>
}
