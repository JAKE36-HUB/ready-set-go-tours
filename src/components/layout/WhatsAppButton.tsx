"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { COMPANY } from "@/lib/constants"

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp}?text=Hello%21%20I%27d%20like%20to%20inquire%20about%20your%20travel%20services.`

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow duration-300"
        aria-label="Chat with us on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          delay: 1,
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <MessageCircle className="w-6 h-6 relative z-10" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full z-10">
          <motion.span
            className="absolute inset-0 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        </span>
      </motion.a>

      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.8 }}
        whileHover={{ opacity: 1, x: 0, scale: 1 }}
        className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          Chat with us
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
        </div>
      </motion.div>
    </div>
  )
}
