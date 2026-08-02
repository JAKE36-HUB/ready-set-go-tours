export type LeadStatus =
  | "new"
  | "contacted"
  | "quote_sent"
  | "negotiating"
  | "payment_pending"
  | "booked"
  | "completed"
  | "lost"

export type LeadSource =
  | "contact_form"
  | "booking"
  | "newsletter"
  | "whatsapp"
  | "popup_lead"
  | "package_inquiry"

export interface Lead {
  id: number
  name: string
  phone: string
  email: string
  country: string
  destination: string
  travel_date: string
  budget: string
  adults: string
  children: string
  message: string
  source: LeadSource | string
  page: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  browser: string
  device: string
  ip: string
  ip_country: string
  status: LeadStatus
  assigned_to: string
  archived: boolean
  created_at: string
  updated_at: string
}

export interface LeadEvent {
  id: number
  lead_id: number
  event_type: string
  detail: string
  created_by: string
  created_at: string
}

export interface Reminder {
  id: number
  lead_id: number | null
  title: string
  due_at: string
  done: boolean
  created_by: string
  created_at: string
}

export interface AppNotification {
  id: number
  type: string
  title: string
  body: string
  lead_id: number | null
  read: boolean
  archived: boolean
  created_at: string
}

export interface LeadDetail extends Lead {
  events: LeadEvent[]
  reminders: Reminder[]
}

export interface LeadStats {
  new_today: number
  unread: number
  bookings_today: number
  revenue: number
  whatsapp_clicks: number
  conversion_rate: number
  avg_response_time: number
  overdue_reminders: number
}

export interface LeadFilters {
  range: string
  q: string
  country: string
  destination: string
  status: string
  budget: string
  source: string
  archived: boolean
}

export const EMPTY_FILTERS: LeadFilters = {
  range: "",
  q: "",
  country: "",
  destination: "",
  status: "",
  budget: "",
  source: "",
  archived: false,
}

export const LEAD_STATUSES: { value: LeadStatus; label: string; cls: string; dot: string }[] = [
  { value: "new", label: "New Lead", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400", dot: "bg-sky-500" },
  { value: "contacted", label: "Contacted", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400", dot: "bg-indigo-500" },
  { value: "quote_sent", label: "Quote Sent", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400", dot: "bg-violet-500" },
  { value: "negotiating", label: "Negotiating", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", dot: "bg-amber-500" },
  { value: "payment_pending", label: "Payment Pending", cls: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400", dot: "bg-orange-500" },
  { value: "booked", label: "Booked", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", dot: "bg-emerald-500" },
  { value: "completed", label: "Completed", cls: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400", dot: "bg-green-500" },
  { value: "lost", label: "Lost", cls: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400", dot: "bg-rose-500" },
]

export const LEAD_SOURCES: { value: LeadSource | string; label: string }[] = [
  { value: "contact_form", label: "Contact Form" },
  { value: "booking", label: "Booking Form" },
  { value: "newsletter", label: "Newsletter" },
  { value: "whatsapp", label: "WhatsApp Request" },
  { value: "popup_lead", label: "Popup Lead" },
  { value: "package_inquiry", label: "Package Inquiry" },
]

export const NOTIFICATION_TYPES: Record<string, { label: string; cls: string }> = {
  new_lead: { label: "New Lead", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  new_booking: { label: "New Booking", cls: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-400" },
  contact_form: { label: "Contact Form", cls: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400" },
  newsletter: { label: "Newsletter Signup", cls: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  whatsapp_request: { label: "WhatsApp Request", cls: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" },
  popup_lead: { label: "Popup Lead", cls: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400" },
  package_inquiry: { label: "Package Inquiry", cls: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400" },
  reminder_due: { label: "Reminder Due", cls: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400" },
}

export const RANGE_PRESETS = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "7d", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
]

export function parseBudget(budget: string): number {
  const nums = budget.match(/\d[\d,.]*/g)
  if (!nums || nums.length === 0) return 0
  const vals = nums.map((n) => Number(n.replace(/,/g, "")) || 0).filter((n) => n > 0)
  if (vals.length === 0) return 0
  const sum = vals.reduce((a, b) => a + b, 0)
  return vals.length === 1 ? vals[0] : sum / vals.length
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return formatDate(iso)
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "?"
}

export function deviceLabel(ua: string): string {
  if (!ua) return ""
  const lower = ua.toLowerCase()
  if (/iphone|ipod/.test(lower)) return "iPhone"
  if (/ipad/.test(lower)) return "iPad"
  if (/android/.test(lower)) return "Android"
  if (/windows/.test(lower)) return "Windows"
  if (/macintosh|mac os/.test(lower)) return "macOS"
  if (/linux/.test(lower)) return "Linux"
  return "Unknown"
}

export function browserLabel(ua: string): string {
  if (!ua) return ""
  const lower = ua.toLowerCase()
  if (/edg\//.test(lower)) return "Edge"
  if (/chrome|crios/.test(lower)) return "Chrome"
  if (/firefox|fxios/.test(lower)) return "Firefox"
  if (/safari/.test(lower)) return "Safari"
  if (/opera|opr\//.test(lower)) return "Opera"
  if (/msie|trident/.test(lower)) return "IE"
  return "Unknown"
}
