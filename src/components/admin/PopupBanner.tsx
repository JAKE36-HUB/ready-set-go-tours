"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ExternalLink, Expand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ImageLightbox from "./ImageLightbox"

interface Popup {
  id: number
  title: string
  content: string
  image: string
  link_url: string
  link_text: string
  position: string
  delay_seconds: number
  is_active: boolean
  show_once: boolean
  start_date: string | null
  end_date: string | null
}

export default function PopupBanner() {
  const [popup, setPopup] = useState<Popup | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    async function fetchPopup() {
      try {
        const res = await fetch("/api/popup")
        const json = await res.json()
        if (!json.popup) return
        const p = json.popup as Popup
        if (p.show_once) {
          const key = `rsgt_popup_${p.id}`
          if (localStorage.getItem(key)) return
        }
        setPopup(p)
        setTimeout(() => setVisible(true), (p.delay_seconds || 0) * 1000)
      } catch {}
    }
    fetchPopup()
  }, [])

  const dismiss = useCallback(() => {
    setVisible(false)
    setDismissed(true)
    if (popup?.show_once) {
      localStorage.setItem(`rsgt_popup_${popup.id}`, "1")
    }
  }, [popup])

  if (!popup || dismissed) return null

  const hasImage = !!popup.image
  const hasContent = !!popup.title || !!popup.content || !!popup.link_url

  return (
    <>
      <AnimatePresence>
        {visible && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={dismiss}
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[101] m-auto flex items-center justify-center p-2 sm:p-4 pointer-events-none"
            >
              <div className="pointer-events-auto relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                style={{
                  width: "min(96vw, 900px)",
                  maxHeight: "90vh",
                }}
              >
                {/* Close button */}
                <button
                  onClick={dismiss}
                  className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Scrollable content area */}
                <div className="overflow-y-auto flex-1">
                  {/* Image */}
                  {hasImage && (
                    <div className="relative w-full bg-slate-900/5 dark:bg-slate-900/80 flex items-center justify-center p-4 sm:p-6">
                      <div className="relative w-full flex items-center justify-center">
                        <img
                          src={popup.image}
                          alt={popup.title}
                          onLoad={() => setImageLoaded(true)}
                          className="w-full h-auto max-h-[70vh] object-contain rounded-lg cursor-pointer select-none"
                          style={{ imageRendering: "auto" }}
                          onClick={() => setLightboxOpen(true)}
                          loading="eager"
                        />
                        {/* Expand hint */}
                        <button
                          onClick={() => setLightboxOpen(true)}
                          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors opacity-0 hover:opacity-100"
                        >
                          <Expand className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  {hasContent && (
                    <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-4 text-center">
                      {popup.title && (
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1.5">
                          {popup.title}
                        </h2>
                      )}
                      {popup.content && (
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                          {popup.content}
                        </p>
                      )}
                      {popup.link_url && (
                        <Button
                          onClick={() => { window.open(popup.link_url, "_blank"); dismiss() }}
                          className="bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white border-0 hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all text-sm h-10 px-6"
                        >
                          {popup.link_text || "Learn More"}
                          <ExternalLink className="w-4 h-4 ml-1.5" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* No content — minimal close hint */}
                  {!hasContent && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Click X to close
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {lightboxOpen && popup?.image && (
        <ImageLightbox
          src={popup.image}
          alt={popup.title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
