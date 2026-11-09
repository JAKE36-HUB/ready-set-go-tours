"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

type TiltCardProps = HTMLMotionProps<"div"> & {
  /** Maximum tilt in degrees at the card edges. */
  intensity?: number
}

/**
 * Card that tilts toward the cursor and reveals a soft brand spotlight.
 * Motion props (initial/animate/transition) pass straight through, so it can
 * replace a plain motion.div without changing the reveal choreography.
 */
export function TiltCard({
  children,
  className,
  intensity = 5,
  style,
  whileHover,
  onMouseMove,
  onMouseLeave,
  ...rest
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 220, damping: 24, mass: 0.6 })
  const springY = useSpring(rotateY, { stiffness: 220, damping: 24, mass: 0.6 })

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (el) {
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      rotateY.set((px - 0.5) * intensity * 2)
      rotateX.set(-(py - 0.5) * intensity * 2)
      el.style.setProperty("--spotlight-x", `${px * 100}%`)
      el.style.setProperty("--spotlight-y", `${py * 100}%`)
    }
    onMouseMove?.(event)
  }

  const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    rotateX.set(0)
    rotateY.set(0)
    onMouseLeave?.(event)
  }

  return (
    <motion.div
      ref={ref}
      {...rest}
      whileHover={whileHover ?? { y: -6 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1000,
        ...style,
      }}
      className={cn("spotlight-card", className)}
    >
      {children}
    </motion.div>
  )
}
