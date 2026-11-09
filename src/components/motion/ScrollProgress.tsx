"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/** Thin brand-coloured progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-primary via-[#16456B] to-accent"
    />
  )
}
