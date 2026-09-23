import { trackLeadConversion } from "@/lib/analytics"

const SESSION_KEY = "rsgt_session_id"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

interface TrackConversionInput {
  type: string
  label: string
  details?: string
}

/**
 * Mirrors the Google Ads conversion tracking: always fires the gtag
 * conversion event, and additionally records the conversion to the
 * admin Conversions dashboard so it can be viewed without Google.
 */
export function trackConversion({ type, label, details }: TrackConversionInput) {
  // Fire the Google Ads conversion pixel (existing behaviour)
  trackLeadConversion()

  // Persist the event for the admin Conversions dashboard
  try {
    const session_id = getSessionId()
    if (!session_id) return
    const page = window.location.pathname
    fetch("/api/track-conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, type, label, details: details || "", page }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}