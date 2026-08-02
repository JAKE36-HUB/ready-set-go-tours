import type { PopupAdvanced, PopupConfig, PopupFrequency, PopupTargeting } from "./types"

const K = {
  session: "rsgt_session_id",
  visits: "rsgt_visit_count",
  firstVisit: "rsgt_first_visit",
  country: "rsgt_country",
  converted: (id: number) => `rsgt_pp_${id}_converted`,
  whatsapp: (id: number) => `rsgt_pp_${id}_whatsapp`,
  ever: (id: number) => `rsgt_pp_${id}_ever`,
  last: (id: number) => `rsgt_pp_${id}_last`,
}

export interface SessionState {
  id: string
  visitCount: number
  isNew: boolean
  pathname: string
  device: "mobile" | "tablet" | "desktop"
  country: string
  language: string
  referrer: string
  utmCampaign: string
  timeOnPageMs: number
}

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(key, value)
  } catch {}
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function getSession(): SessionState {
  let id = safeGet(K.session)
  if (!id) {
    id = uid()
    safeSet(K.session, id)
  }

  const rawVisits = parseInt(safeGet(K.visits) || "0", 10) || 0
  const visitCount = rawVisits + 1
  safeSet(K.visits, String(visitCount))
  if (!safeGet(K.firstVisit)) safeSet(K.firstVisit, String(Date.now()))

  let device: SessionState["device"] = "desktop"
  if (typeof window !== "undefined") {
    const width = window.innerWidth
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches
    if (width < 768 || (width < 1024 && coarse)) device = "mobile"
    else if (width < 1280 || coarse) device = "tablet"
  }

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const ref = typeof document !== "undefined" ? document.referrer || "" : ""

  return {
    id,
    visitCount,
    isNew: visitCount <= 1,
    pathname: typeof window !== "undefined" ? window.location.pathname : "/",
    device,
    country: safeGet(K.country) || "",
    language: (typeof navigator !== "undefined" ? navigator.language || "" : "").split("-")[0]?.toLowerCase() || "",
    referrer: ref,
    utmCampaign: params.get("utm_campaign") || "",
    timeOnPageMs: Date.now(),
  }
}

export function matchesPageRule(t: PopupTargeting, pathname: string): boolean {
  if (t.pages === "all") return true
  if (t.pages === "home") return pathname === "/"
  if (t.pages === "destinations") return /^\/(kenya-tours|tanzania-tours|destinations)/.test(pathname)
  if (t.pages === "packages") return /^\/(holiday-packages|honeymoon-packages|beach-holidays|packages)/.test(pathname)
  if (t.pages === "blog") return /^\/travel-guide/.test(pathname)
  if (t.pages === "contact") return pathname === "/contact"
  if (t.pages === "gallery") return pathname === "/gallery"
  if (t.pages === "custom") {
    return t.customPages.some((p) => {
      const pat = p.trim()
      if (!pat) return false
      if (pat.includes("*")) {
        const re = new RegExp("^" + pat.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$")
        return re.test(pathname)
      }
      return pathname === pat || pathname.startsWith(pat)
    })
  }
  return true
}

function matchesTraffic(t: PopupTargeting, s: SessionState): boolean {
  if (t.trafficSources.length === 0) return true
  let source = "direct"
  const host = s.referrer ? new URL(s.referrer).hostname : ""
  if (/google\./.test(host)) source = "google"
  else if (/facebook\./.test(host)) source = "facebook"
  else if (/instagram\./.test(host)) source = "instagram"
  else if (host) source = "referral"
  if (s.utmCampaign) source = "utm"
  if (!t.trafficSources.includes(source)) return false
  if (t.utmCampaign && t.utmCampaign !== s.utmCampaign) return false
  return true
}

export function matchesTargeting(cfg: PopupConfig, s: SessionState): boolean {
  const t = cfg.targeting

  if (t.visitorType === "new" && !s.isNew) return false
  if (t.visitorType === "returning" && s.isNew) return false
  if (t.minPagesVisited > 0 && s.visitCount < t.minPagesVisited) return false
  if (t.minTimeSeconds > 0 && Date.now() - s.timeOnPageMs < t.minTimeSeconds * 1000) return false

  if (!matchesPageRule(t, s.pathname)) return false
  if (t.devices.length > 0 && !t.devices.includes(s.device)) return false
  if (t.countries.length > 0 && !t.countries.includes(s.country)) return false
  if (t.languages.length > 0 && !t.languages.includes(s.language)) return false
  if (!matchesTraffic(t, s)) return false

  const a = cfg.advanced
  if (a.dateWindowStart && new Date() < new Date(a.dateWindowStart)) return false
  if (a.dateWindowEnd && new Date() > new Date(a.dateWindowEnd)) return false
  if (a.weekendOnly && ![0, 6].includes(new Date().getDay())) return false
  if (a.businessHoursOnly) {
    const now = new Date()
    const mins = now.getHours() * 60 + now.getMinutes()
    const [sh, sm] = a.businessHoursStart.split(":").map(Number)
    const [eh, em] = a.businessHoursEnd.split(":").map(Number)
    if (mins < sh * 60 + sm || mins > eh * 60 + em) return false
  }

  return true
}

function inBusinessHours(a: PopupAdvanced): boolean {
  if (!a.businessHoursOnly) return true
  const now = new Date()
  const mins = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = a.businessHoursStart.split(":").map(Number)
  const [eh, em] = a.businessHoursEnd.split(":").map(Number)
  return mins >= sh * 60 + sm && mins <= eh * 60 + em
}

export function isDateWindowOpen(a: PopupAdvanced): boolean {
  if (a.dateWindowStart && new Date() < new Date(a.dateWindowStart)) return false
  if (a.dateWindowEnd && new Date() > new Date(a.dateWindowEnd)) return false
  return true
}

export function canShow(f: PopupFrequency, popupId: number): boolean {
  if (f.suppressAfterConversion && safeGet(K.converted(popupId))) return false
  if (f.suppressAfterBooking && safeGet(K.converted(popupId))) return false
  if (f.suppressAfterWhatsApp && safeGet(K.whatsapp(popupId))) return false

  if (f.show === "once_ever" && safeGet(K.ever(popupId))) return false

  const last = parseInt(safeGet(K.last(popupId)) || "0", 10)
  const now = Date.now()

  if (f.show === "once_per_day" && last && now - last < 86_400_000) return false
  if (f.show === "once_per_week" && last && now - last < 7 * 86_400_000) return false
  if (f.show === "every_x_days") {
    const days = Math.max(1, f.everyXDays || 7)
    if (last && now - last < days * 86_400_000) return false
  }
  if (f.show === "every_visit" && last) {
    const perSession = Math.max(1, f.maxPerSession || 1)
    const shownThisSession = parseInt(safeGet(`rsgt_pp_${popupId}_session`) || "0", 10)
    if (shownThisSession >= perSession) return false
  }

  return true
}

export function markShown(popupId: number) {
  safeSet(K.last(popupId), String(Date.now()))
  safeSet(K.ever(popupId), "1")
  const n = parseInt(safeGet(`rsgt_pp_${popupId}_session`) || "0", 10)
  safeSet(`rsgt_pp_${popupId}_session`, String(n + 1))
}

export function markConverted(popupId: number) {
  safeSet(K.converted(popupId), "1")
}

export function markWhatsApp(popupId: number) {
  safeSet(K.whatsapp(popupId), "1")
}

export function setupTrigger(
  cfg: PopupConfig,
  onFire: () => void
): () => void {
  const a = cfg.advanced
  const t = cfg.targeting

  if (!isDateWindowOpen(a)) return () => {}
  if (!inBusinessHours(a)) return () => {}

  const cleanups: (() => void)[] = []
  let fired = false

  const fire = () => {
    if (fired) return
    fired = true
    onFire()
  }

  if (a.trigger === "exit" || t.exitIntent) {
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) fire()
    }
    document.addEventListener("mouseout", onMouseOut)
    cleanups.push(() => document.removeEventListener("mouseout", onMouseOut))
  }

  if (a.trigger === "scroll" || t.scrollDepth > 0) {
    const threshold = Math.max(t.scrollDepth || 0, a.trigger === "scroll" ? 50 : 0)
    const onScroll = () => {
      const doc = document.documentElement
      const pct = (window.scrollY + window.innerHeight) / Math.max(1, doc.scrollHeight - doc.scrollHeight * 0.9)
      const depth = Math.min(100, (window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)) * 100)
      if (pct > 1.05 || depth >= threshold) fire()
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    cleanups.push(() => window.removeEventListener("scroll", onScroll))
  }

  if (a.trigger === "inactivity") {
    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(fire, Math.max(3, a.inactivitySeconds) * 1000)
    }
    const events = ["mousemove", "keydown", "scroll", "touchstart"] as const
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }))
    reset()
    cleanups.push(() => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, reset))
    })
  }

  if (a.trigger === "randomized") {
    const max = Math.max(2, a.delaySeconds || 10)
    const timer = setTimeout(fire, 2000 + Math.random() * (max * 1000 - 2000))
    cleanups.push(() => clearTimeout(timer))
  }

  if (a.trigger === "delay") {
    const timer = setTimeout(fire, Math.max(0, a.delaySeconds) * 1000)
    cleanups.push(() => clearTimeout(timer))
  }

  if (cleanups.length === 0) {
    const timer = setTimeout(fire, Math.max(0, a.delaySeconds || 5) * 1000)
    cleanups.push(() => clearTimeout(timer))
  }

  return () => cleanups.forEach((c) => c())
}

export function parseCountdown(value: string | null): number | null {
  if (!value) return null
  const t = new Date(value).getTime()
  if (isNaN(t)) return null
  return Math.max(0, t - Date.now())
}

export { safeGet, safeSet }
