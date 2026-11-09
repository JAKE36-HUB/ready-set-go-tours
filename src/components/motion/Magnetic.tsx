"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

import { cn } from "@/lib/utils"

/**
 * Pulls its child a few pixels toward the cursor, then springs back.
 * Keeps the child's own hover styling intact — this only moves the wrapper.
 */
export function Magnetic({
  children,
  className,
  strength = 16,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 })
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 })

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * strength)
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * strength)
  }

  const handleLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  )
}
