"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { PopupCTA, PopupConfig } from "@/lib/popups/types"
import { Countdown } from "./Countdown"
import { SpinWheel } from "./SpinWheel"
import { ScratchCard } from "./ScratchCard"
import { LeadForm } from "./LeadForm"
import { parseCountdown } from "@/lib/popups/engine"

export interface ActivePopup {
  id: number
  variant: string
  type: string
  name: string
  config: PopupConfig
}

interface Props {
  popup: ActivePopup
  onClose: () => void
  onCTA: (cta: PopupCTA, index: number) => void
  onLeadSuccess: () => void
}

function stripEmoji(text: string) {
  return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "").trim()
}

const hoverClass = (h: string) =>
  h === "pulse" ? "animate-pulse" : h === "grow" ? "hover:scale-105" : h === "shake" ? "hover:animate-[wiggle_0.4s_ease-in-out]" : ""

const ctaStyle = (cta: PopupCTA) => ({
  backgroundColor: cta.bgColor || "#f59e0b",
  color: cta.textColor || "#ffffff",
})

const overlayAnim = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

function ContentSection({ config, light }: { config: PopupConfig; light?: boolean }) {
  const c = config.content
  const title = c.emoji ? c.title : stripEmoji(c.title)
  return (
    <>
      {c.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {c.badges.map((b) => (
            <span key={b} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-500/25 uppercase tracking-wide ${light ? "bg-white/15 text-amber-200" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"}`}>
              {b}
            </span>
          ))}
        </div>
      )}
      {title && (
        <h2 className={`text-2xl font-extrabold leading-tight ${light ? "text-white" : "text-slate-900 dark:text-white"}`}>{title}</h2>
      )}
      {c.subtitle && (
        <p className={`text-sm font-semibold ${light ? "text-amber-100" : "text-slate-600 dark:text-slate-300"}`}>{c.subtitle}</p>
      )}
      {c.description && (
        <p className={`text-sm leading-relaxed ${light ? "text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>{c.description}</p>
      )}
      {(c.priceBefore || c.priceNow) && (
        <div className="flex items-center justify-center gap-2">
          {c.priceBefore && (
            <span className={`text-base line-through ${light ? "text-slate-300" : "text-slate-400"}`}>{c.priceBefore}</span>
          )}
          {c.priceNow && (
            <span className={`text-2xl font-extrabold ${light ? "text-amber-300" : "text-amber-600 dark:text-amber-400"}`}>{c.priceNow}</span>
          )}
        </div>
      )}
      {c.promoCode && (
        <p className={`text-xs ${light ? "text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
          Promo code: <span className={`font-mono font-bold ${light ? "text-amber-300" : "text-amber-600 dark:text-amber-400"}`}>{c.promoCode}</span>
        </p>
      )}
    </>
  )
}

function TrustRow({ config }: { config: PopupConfig }) {
  const cv = config.conversion
  const items: string[] = [...cv.trustBadges]
  if (cv.googleReviews) items.push(`â­ ${cv.googleReviews} Google Rating`)
  if (cv.tripadvisorRating) items.push(`ðŸŒ ${cv.tripadvisorRating}.0 TripAdvisor`)
  if (cv.securePayment) items.push("ðŸ”’ Secure Payment")
  if (cv.moneyBack) items.push("ðŸ’µ Money Back Guarantee")
  items.push(...cv.awardBadges)
  if (items.length === 0) return null
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
      {items.slice(0, 5).map((b) => (
        <span key={b} className="text-[10px] text-slate-500 dark:text-slate-400">{b}</span>
      ))}
    </div>
  )
}

function UrgencyRow({ config }: { config: PopupConfig }) {
  const cv = config.conversion
  const [seats, setSeats] = useState(cv.remainingSeats ?? 0)
  const [viewers, setViewers] = useState(0)

  useEffect(() => {
    if (cv.remainingSeats) {
      const iv = setInterval(() => {
        setSeats((s) => Math.max(1, s - (Math.random() < 0.15 ? 1 : 0)))
      }, 12000)
      return () => clearInterval(iv)
    }
  }, [cv.remainingSeats])

  useEffect(() => {
    if (cv.peopleViewing) {
      setViewers(8 + Math.floor(Math.random() * 17))
      const iv = setInterval(() => {
        setViewers((v) => Math.max(3, v - 1 + Math.floor(Math.random() * 3)))
      }, 9000)
      return () => clearInterval(iv)
    }
  }, [cv.peopleViewing])

  return (
    <div className="space-y-1.5">
      {cv.remainingSeats ? (
        <div>
          <p className="text-xs font-bold text-red-500 flex items-center justify-center gap-1">
            âš¡ Only {seats} {seats === 1 ? "seat" : "seats"} remaining for this date!
          </p>
          <div className="h-1.5 w-full max-w-[220px] mx-auto bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500"
              animate={{ width: `${Math.max(8, (seats / 20) * 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      ) : null}
      {cv.peopleViewing && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          {viewers} people are viewing this package right now
        </p>
      )}
      {cv.recentlyBooked && (
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          âœ… Sarah from London booked 2 hours ago
        </p>
      )}
      {cv.liveFeed && (
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          ðŸŽ‰ 3 bookings in the last 24 hours
        </p>
      )}
    </div>
  )
}

function CTAs({ config, onCTA, center = true }: { config: PopupConfig; onCTA: (cta: PopupCTA, i: number) => void; center?: boolean }) {
  return (
    <div className={`flex flex-wrap gap-2.5 ${center ? "justify-center" : ""}`}>
      {config.ctas.map((cta, i) => (
        <button
          key={cta.id}
          onClick={() => onCTA(cta, i)}
          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold shadow-lg transition-all active:scale-95 ${hoverClass(cta.hoverAnimation)}`}
          style={ctaStyle(cta)}
        >
          {cta.icon && <span aria-hidden>{cta.icon}</span>}
          {cta.label}
        </button>
      ))}
    </div>
  )
}

function VideoEmbed({ url }: { url: string }) {
  if (/youtube\.com\/embed|youtu\.be/.test(url)) {
    const src = url.replace("watch?v=", "embed/")
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <iframe src={src} className="absolute inset-0 w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Popup video" />
      </div>
    )
  }
  return (
    <video src={url} controls autoPlay muted loop playsInline className="w-full aspect-video rounded-lg object-cover" />
  )
}

const bodyCls =
  "max-h-[78vh] overflow-y-auto rounded-t-2xl lg:rounded-2xl bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl"

export function PopupShell({ popup, onClose, onCTA, onLeadSuccess }: Props) {
  const cfg = popup.config
  const c = cfg.content
  const type = popup.type
  const countdownEnd = useRef<number | null>(parseCountdown(c.countdownEndsAt)).current
  const [step, setStep] = useState(0)
  const [winPrize, setWinPrize] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const closeBtn = (
    <button
      ref={closeRef}
      onClick={onClose}
      aria-label="Close popup"
      className="absolute top-3 right-3 z-20 rounded-full bg-black/40 hover:bg-black/60 text-white p-1.5 transition backdrop-blur-sm"
    >
      <X className="w-4 h-4" />
    </button>
  )

  const imageUrl = c.heroImage || c.backgroundImage

  const base = (children: React.ReactNode, popAnim: object, wrap: string) => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto p-4" role="dialog" aria-modal="true">
      <motion.div {...overlayAnim} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div {...popAnim} className={`relative ${wrap}`}>
        {closeBtn}
        {children}
      </motion.div>
    </div>
  )

  const modalCard = (children: React.ReactNode) => (
    <div className={`${bodyCls} w-full max-w-md overflow-hidden`}>
      {imageUrl && (
        <div className="relative h-44 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      )}
      <div className="p-6 flex flex-col gap-3 text-center">{children}</div>
    </div>
  )

  const sharedContent = (
    <>
      <ContentSection config={cfg} />
      <UrgencyRow config={cfg} />
      <TrustRow config={cfg} />
      <CTAs config={cfg} onCTA={onCTA} />
    </>
  )

  if (type === "hero") {
    return (
      <motion.div
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -120, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="fixed top-0 inset-x-0 z-[150]"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative overflow-hidden">
          {imageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
            </>
          )}
          <div className={`relative ${imageUrl ? "text-white" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"} px-6 py-4`}>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="flex-1 min-w-0">
                <ContentSection config={cfg} light />
              </div>
              <div className="shrink-0">
                <CTAs config={cfg} onCTA={onCTA} />
              </div>
            </div>
            <button onClick={onClose} aria-label="Close popup" className="absolute top-2 right-2 rounded-full bg-black/30 hover:bg-black/50 p-1.5 text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === "sticky") {
    return (
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="fixed bottom-0 inset-x-0 z-[150]"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-bold truncate">{c.title}</p>
              {c.subtitle && <p className="text-xs text-slate-400 truncate">{c.subtitle}</p>}
            </div>
            {countdownEnd && <div className="hidden md:block"><Countdown endTime={countdownEnd} compact /></div>}
            <div className="flex items-center gap-2">
              <CTAs config={cfg} onCTA={onCTA} />
              <button onClick={onClose} aria-label="Close popup" className="rounded-full bg-white/10 hover:bg-white/20 p-1.5 transition shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === "corner") {
    return (
      <motion.div
        initial={{ x: 120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 120, opacity: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        className="fixed bottom-4 right-4 z-[150] w-[min(92vw,330px)]"
        role="dialog"
        aria-modal="true"
      >
        <div className={`${bodyCls} overflow-hidden`}>
          {imageUrl ? (
            <div className="relative h-32 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />
          )}
          <div className="p-4 flex flex-col gap-2 text-center">
            <ContentSection config={cfg} />
            <CTAs config={cfg} onCTA={onCTA} />
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === "slide") {
    return (
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 240 }}
        className="fixed top-0 right-0 bottom-0 z-[150] w-full max-w-sm"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl flex flex-col">
          <div className="relative h-40 shrink-0 overflow-hidden">
            {imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600" />
            )}
            <button onClick={onClose} aria-label="Close popup" className="absolute top-3 right-3 rounded-full bg-black/40 hover:bg-black/60 p-1.5 text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-3 text-center">
            <ContentSection config={cfg} light={!!imageUrl} />
            <UrgencyRow config={cfg} />
            <TrustRow config={cfg} />
            <CTAs config={cfg} onCTA={onCTA} />
          </div>
        </div>
      </motion.div>
    )
  }

  if (type === "fullscreen") {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150]" role="dialog" aria-modal="true">
        <div className="absolute inset-0">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          )}
        </div>
        <div className="relative h-full flex items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            className="max-w-lg w-full text-center text-white"
          >
            <ContentSection config={cfg} light />
            <UrgencyRow config={cfg} />
            <TrustRow config={cfg} />
            <div className="mt-2"><CTAs config={cfg} onCTA={onCTA} /></div>
          </motion.div>
        </div>
        <button onClick={onClose} aria-label="Close popup" className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 p-2 text-white transition">
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    )
  }

  if (type === "video") {
    return (
      <motion.div {...overlayAnim} className="fixed inset-0 z-[150] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`${bodyCls} w-full max-w-lg p-4`}>
          {closeBtn}
          {c.video ? (
            <VideoEmbed url={c.video} />
          ) : imageUrl ? (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ) : null}
          <div className="flex flex-col gap-3 text-center mt-4">{sharedContent}</div>
        </motion.div>
      </motion.div>
    )
  }

  if (type === "spin") {
    return base(
      <div className={`${bodyCls} w-full max-w-md p-6 text-center flex flex-col gap-4`}>
        <ContentSection config={cfg} />
        <SpinWheel
          promoCode={c.promoCode}
          onWin={(prize) => {
            setWinPrize(prize)
            onCTA(cfg.ctas[0], 0)
          }}
        />
        {winPrize && <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">ðŸŽ‰ You won: {winPrize}</p>}
        <TrustRow config={cfg} />
      </div>,
      { initial: { scale: 0.85, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.85, opacity: 0, y: 20 } },
      ""
    )
  }

  if (type === "scratch") {
    return base(
      <div className={`${bodyCls} w-full max-w-md p-6 text-center flex flex-col gap-4`}>
        <ContentSection config={cfg} />
        <ScratchCard
          prize={c.priceNow || "Special Discount!"}
          promoCode={c.promoCode}
          onRevealed={() => onCTA(cfg.ctas[0], 0)}
        />
        <TrustRow config={cfg} />
      </div>,
      { initial: { scale: 0.85, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.85, opacity: 0, y: 20 } },
      ""
    )
  }

  if (type === "whatsapp") {
    return base(
      <div className={`${bodyCls} w-full max-w-md p-6 text-center flex flex-col gap-4`}>
        <div className="mx-auto w-16 h-16 rounded-full bg-[#25d366]/15 flex items-center justify-center text-3xl">ðŸ’¬</div>
        <ContentSection config={cfg} />
        <UrgencyRow config={cfg} />
        <button
          onClick={() => onCTA(cfg.ctas[0] || { id: "wa", label: "Chat on WhatsApp", url: "https://wa.me", newTab: true, bgColor: "#25d366", textColor: "#fff", hoverAnimation: "pulse", icon: "ðŸ’¬", type: "whatsapp" }, 0)}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#25d366] px-8 py-3 text-base font-bold text-white shadow-xl hover:scale-105 active:scale-95 transition animate-pulse"
        >
          ðŸ’¬ Chat on WhatsApp
        </button>
        <p className="text-xs text-slate-400">Instant reply, usually within minutes</p>
      </div>,
      { initial: { scale: 0.85, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.85, opacity: 0, y: 20 } },
      ""
    )
  }

  if (type === "multistep" && cfg.leadForm.enabled) {
    return base(
      <div className={`${bodyCls} w-full max-w-md overflow-hidden`}>
        {step === 0 ? (
          <div className="p-6 flex flex-col gap-3 text-center">
            {imageUrl && (
              <div className="relative -mx-6 -mt-6 mb-1 h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            <ContentSection config={cfg} />
            <UrgencyRow config={cfg} />
            <CTAs config={cfg} onCTA={onCTA} />
            <button onClick={() => setStep(1)} className="text-xs text-amber-600 dark:text-amber-400 underline underline-offset-2">
              Get a free personalized quote â†’
            </button>
          </div>
        ) : (
          <div className="p-6 flex flex-col gap-3">
            <p className="text-center text-sm font-bold text-slate-900 dark:text-white">Get your free quote ðŸ¦</p>
            <LeadForm popupId={popup.id} config={cfg} variant={popup.variant} popupName={popup.name} onSuccess={onLeadSuccess} />
          </div>
        )}
      </div>,
      { initial: { scale: 0.85, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.85, opacity: 0, y: 20 } },
      ""
    )
  }

  if (cfg.leadForm.enabled) {
    return base(
      <div className={`${bodyCls} w-full max-w-md overflow-hidden`}>
        {imageUrl && (
          <div className="relative h-36 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        <div className="p-6 flex flex-col gap-3 text-center">
          <ContentSection config={cfg} />
          <div className="text-left">
            <LeadForm popupId={popup.id} config={cfg} variant={popup.variant} popupName={popup.name} onSuccess={onLeadSuccess} />
          </div>
        </div>
      </div>,
      { initial: { scale: 0.85, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.85, opacity: 0, y: 20 } },
      ""
    )
  }

  return base(modalCard(sharedContent), { initial: { scale: 0.85, opacity: 0, y: 20 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.85, opacity: 0, y: 20 } }, "")
}
