export type PopupType =
  | "hero"        // hero banner
  | "modal"       // center modal
  | "fullscreen"  // full screen promotion
  | "sticky"      // bottom sticky bar
  | "corner"      // floating corner card
  | "slide"       // side slide in
  | "countdown"   // countdown offer
  | "video"       // video popup
  | "multistep"   // multi-step popup
  | "newsletter"  // newsletter popup
  | "spin"        // spin to win
  | "scratch"     // scratch card
  | "seats"       // limited seats
  | "flash"       // flash sale
  | "whatsapp"    // whatsapp popup

export type PopupStatus = "active" | "draft" | "scheduled" | "expired"

export interface PopupCTA {
  id: string
  label: string
  url: string
  newTab: boolean
  bgColor: string
  textColor: string
  hoverAnimation: "none" | "pulse" | "grow" | "shine" | "shake"
  icon: string | null
  type: "url" | "whatsapp" | "call" | "download" | "close"
  formSubmit?: boolean
}

export interface PopupContent {
  heroImage: string
  backgroundImage: string
  video: string
  title: string
  subtitle: string
  description: string
  emoji: boolean
  badges: string[]
  countdownEndsAt: string | null
  promoCode: string
  priceBefore: string
  priceNow: string
}

export interface PopupTargeting {
  visitorType: "all" | "new" | "returning"
  minPagesVisited: number
  minTimeSeconds: number
  exitIntent: boolean
  scrollDepth: number // 0 | 50 | 75 | 100
  pages: "all" | "home" | "destinations" | "packages" | "blog" | "contact" | "gallery" | "custom"
  customPages: string[]
  devices: string[] // empty = all
  countries: string[]
  languages: string[]
  trafficSources: string[] // google | facebook | instagram | direct | referral | utm
  utmCampaign: string
}

export interface PopupFrequency {
  show: "once_ever" | "once_per_day" | "once_per_week" | "every_visit" | "every_x_days"
  everyXDays: number
  maxPerSession: number
  suppressAfterConversion: boolean
  suppressAfterBooking: boolean
  suppressAfterWhatsApp: boolean
}

export interface PopupAdvanced {
  trigger: "delay" | "scroll" | "inactivity" | "exit" | "randomized"
  delaySeconds: number
  inactivitySeconds: number
  businessHoursOnly: boolean
  businessHoursStart: string
  businessHoursEnd: string
  weekendOnly: boolean
  dateWindowStart: string | null
  dateWindowEnd: string | null
}

export interface PopupConversion {
  countdown: boolean
  remainingSeats: number | null
  peopleViewing: boolean
  recentlyBooked: boolean
  liveFeed: boolean
  trustBadges: string[]
  googleReviews: number | null
  tripadvisorRating: number | null
  securePayment: boolean
  moneyBack: boolean
  awardBadges: string[]
  customerPhotos: boolean
  videoTestimonials: boolean
}

export interface PopupLeadForm {
  enabled: boolean
  fields: string[]
  submitLabel: string
  successMessage: string
  emailRequired: boolean
}

export interface PopupConfig {
  name: string
  status: PopupStatus
  priority: number
  category: string
  notes: string
  type: PopupType
  template: string
  content: PopupContent
  ctas: PopupCTA[]
  targeting: PopupTargeting
  frequency: PopupFrequency
  advanced: PopupAdvanced
  conversion: PopupConversion
  leadForm: PopupLeadForm
  conversionValue: number | null
  startDate: string | null
  endDate: string | null
}

export interface PopupRecord {
  id: number
  title: string
  content: string
  image: string
  link_url: string
  link_text: string
  position: string
  delay_seconds: number
  start_date: string | null
  end_date: string | null
  is_active: boolean
  show_once: boolean
  created_at: string
  updated_at: string
  config: PopupConfig | null
  type: string | null
  priority: number | null
  status: string | null
  template: string | null
  category: string | null
  notes: string | null
  variant_of: number | null
  traffic_split: number | null
}

export const POPUP_TYPES: { value: PopupType; label: string; icon: string; desc: string }[] = [
  { value: "hero", label: "Hero Banner", icon: "🖼️", desc: "Full-width image banner with headline" },
  { value: "modal", label: "Center Modal", icon: "📦", desc: "Classic centered popup" },
  { value: "fullscreen", label: "Full Screen Promotion", icon: "🖥️", desc: "Immersive takeover" },
  { value: "sticky", label: "Bottom Sticky Bar", icon: "📌", desc: "Slim persistent bar" },
  { value: "corner", label: "Floating Corner Card", icon: "🪟", desc: "Small corner card" },
  { value: "slide", label: "Side Slide In", icon: "🎠", desc: "Slides from the side" },
  { value: "countdown", label: "Countdown Offer", icon: "⏳", desc: "Urgency with live timer" },
  { value: "video", label: "Video Popup", icon: "🎬", desc: "Embedded video player" },
  { value: "multistep", label: "Multi-step Popup", icon: "🪜", desc: "Step-by-step flow" },
  { value: "newsletter", label: "Newsletter Popup", icon: "✉️", desc: "Email capture" },
  { value: "spin", label: "Spin to Win", icon: "🎡", desc: "Prize wheel" },
  { value: "scratch", label: "Scratch Card", icon: "🎟️", desc: "Scratch to reveal" },
  { value: "seats", label: "Limited Seats", icon: "💺", desc: "Scarcity alert" },
  { value: "flash", label: "Flash Sale", icon: "⚡", desc: "Time-limited discount" },
  { value: "whatsapp", label: "WhatsApp Popup", icon: "💬", desc: "Direct chat invitation" },
]

export const STATUS_OPTIONS: { value: PopupStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
]

export const CTA_ICONS = [
  "🎯", "🗓️", "💬", "🎁", "📄", "📞", "📚", "🚀", "🔥", "⚡",
  "🦁", "🐘", "🌴", "💍", "🏖️", "✈️", "🐆", "🦒", "🌅", "🏕️",
] as const

export const TRUST_BADGES = [
  "✅ Trusted Local Operator",
  "⭐ 4.9 Google Rating",
  "🏆 Award-Winning Safaris",
  "🔒 Secure Booking",
  "💵 Best Price Guarantee",
  "🌍 5,000+ Happy Travellers",
  "🦁 Licensed Safari Experts",
  "🤝 24/7 Guest Support",
] as const

export const AWARD_BADGES = [
  "🥇 Best Safari Operator 2025",
  "🌍 TripAdvisor Travellers' Choice",
  "🏆 World Travel Awards Nominee",
  "🎖️ Kenya Tourism Excellence",
  "🌟 100% Kenyan Owned",
] as const

export function defaultConfig(): PopupConfig {
  return {
    name: "",
    status: "draft",
    priority: 5,
    category: "",
    notes: "",
    type: "modal",
    template: "",
    content: {
      heroImage: "",
      backgroundImage: "",
      video: "",
      title: "",
      subtitle: "",
      description: "",
      emoji: true,
      badges: [],
      countdownEndsAt: null,
      promoCode: "",
      priceBefore: "",
      priceNow: "",
    },
    ctas: [
      {
        id: "cta_1",
        label: "Book Safari",
        url: "/contact",
        newTab: false,
        bgColor: "#f59e0b",
        textColor: "#ffffff",
        hoverAnimation: "grow",
        icon: "🎯",
        type: "url",
      },
    ],
    targeting: {
      visitorType: "all",
      minPagesVisited: 0,
      minTimeSeconds: 0,
      exitIntent: false,
      scrollDepth: 0,
      pages: "all",
      customPages: [],
      devices: [],
      countries: [],
      languages: [],
      trafficSources: [],
      utmCampaign: "",
    },
    frequency: {
      show: "once_per_day",
      everyXDays: 7,
      maxPerSession: 1,
      suppressAfterConversion: false,
      suppressAfterBooking: false,
      suppressAfterWhatsApp: false,
    },
    advanced: {
      trigger: "delay",
      delaySeconds: 8,
      inactivitySeconds: 15,
      businessHoursOnly: false,
      businessHoursStart: "08:00",
      businessHoursEnd: "22:00",
      weekendOnly: false,
      dateWindowStart: null,
      dateWindowEnd: null,
    },
    conversion: {
      countdown: false,
      remainingSeats: null,
      peopleViewing: false,
      recentlyBooked: false,
      liveFeed: false,
      trustBadges: [],
      googleReviews: null,
      tripadvisorRating: null,
      securePayment: true,
      moneyBack: false,
      awardBadges: [],
      customerPhotos: false,
      videoTestimonials: false,
    },
    leadForm: {
      enabled: false,
      fields: ["name", "email", "phone"],
      submitLabel: "Get My Free Quote",
      successMessage: "Thank you! We'll get back to you within 24 hours.",
      emailRequired: true,
    },
    conversionValue: null,
    startDate: null,
    endDate: null,
  }
}

export function configFromRecord(rec: Partial<PopupRecord>): PopupConfig {
  const base = defaultConfig()
  if (!rec.config || typeof rec.config !== "object") {
    const legacy = {
      ...base,
      name: rec.title || "",
      content: {
        ...base.content,
        title: rec.title || "",
        description: rec.content || "",
        heroImage: rec.image || "",
      },
      ctas: rec.link_url
        ? [{ ...base.ctas[0], label: rec.link_text || "Learn More", url: rec.link_url }]
        : base.ctas,
      status: rec.is_active ? "active" as const : "draft" as const,
      startDate: rec.start_date || null,
      endDate: rec.end_date || null,
      frequency: { ...base.frequency, show: rec.show_once === false ? "every_visit" as const : "once_ever" as const },
      advanced: { ...base.advanced, delaySeconds: rec.delay_seconds || base.advanced.delaySeconds },
    }
    return legacy
  }

  const c = rec.config
  return {
    ...base,
    ...c,
    content: { ...base.content, ...(c.content || {}) },
    ctas: Array.isArray(c.ctas) && c.ctas.length > 0 ? c.ctas : base.ctas,
    targeting: { ...base.targeting, ...(c.targeting || {}) },
    frequency: { ...base.frequency, ...(c.frequency || {}) },
    advanced: { ...base.advanced, ...(c.advanced || {}) },
    conversion: { ...base.conversion, ...(c.conversion || {}) },
    leadForm: { ...base.leadForm, ...(c.leadForm || {}) },
    status: (rec.status as PopupStatus) || c.status || "draft",
    type: (rec.type as PopupType) || c.type || "modal",
    priority: typeof rec.priority === "number" ? rec.priority : c.priority ?? 5,
    template: rec.template || c.template || "",
    category: rec.category || c.category || "",
    notes: rec.notes || c.notes || "",
    startDate: rec.start_date || c.startDate || null,
    endDate: rec.end_date || c.endDate || null,
  }
}

export function recordFromConfig(cfg: PopupConfig) {
  return {
    title: cfg.name || cfg.content.title,
    content: cfg.content.description,
    image: cfg.content.heroImage,
    link_url: cfg.ctas[0]?.url || "",
    link_text: cfg.ctas[0]?.label || "Learn More",
    position: cfg.type,
    delay_seconds: cfg.advanced.delaySeconds,
    start_date: cfg.startDate || null,
    end_date: cfg.endDate || null,
    is_active: cfg.status === "active",
    show_once: cfg.frequency.show === "once_ever",
    config: cfg,
    type: cfg.type,
    priority: cfg.priority,
    status: cfg.status,
    template: cfg.template,
    category: cfg.category,
    notes: cfg.notes,
    updated_at: new Date().toISOString(),
  }
}
