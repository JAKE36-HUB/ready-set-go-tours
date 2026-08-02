"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Save, Trash2, Plus, Eye, EyeOff, Loader2 } from "lucide-react"
import type { PopupConfig, PopupCTA } from "@/lib/popups/types"
import {
  AWARD_BADGES,
  CTA_ICONS,
  POPUP_TYPES,
  STATUS_OPTIONS,
  TRUST_BADGES,
  defaultConfig,
} from "@/lib/popups/types"
import { POPUP_TEMPLATES, getTemplate } from "@/lib/popups/templates"
import ImageUpload from "@/components/admin/ImageUpload"
import { PopupShell } from "@/components/popups/PopupShell"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TABS = ["General", "Content", "CTAs", "Targeting", "Frequency", "Advanced", "Features", "Lead Form", "A/B Test"]

const inputCls =
  "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 dark:text-white"

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</span>
      {children}
    </label>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 group"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
        )}
      >
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[18px]" : "translate-x-[3px]"
          )}
        />
      </span>
      {label && <span className="text-xs text-slate-600 dark:text-slate-300">{label}</span>}
    </button>
  )
}

function BadgePicker({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[]
  selected: string[]
  onToggle: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((b) => (
        <button
          type="button"
          key={b}
          onClick={() => onToggle(b)}
          className={cn(
            "text-[11px] px-2 py-1 rounded-full border transition",
            selected.includes(b)
              ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400"
              : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-400"
          )}
        >
          {b}
        </button>
      ))}
    </div>
  )
}

interface Props {
  popupId?: number
  initialConfig?: PopupConfig
  initialVariantOf?: number | null
  initialTrafficSplit?: number | null
  allPopups?: { id: number; title: string }[]
  defaultTemplate?: string
}

export function PopupForm({
  popupId,
  initialConfig,
  initialVariantOf,
  initialTrafficSplit,
  allPopups = [],
  defaultTemplate,
}: Props) {
  const [cfg, setCfg] = useState<PopupConfig>(() =>
    defaultTemplate && !initialConfig ? getTemplate(defaultTemplate) || defaultConfig() : initialConfig || defaultConfig()
  )
  const [variantOf, setVariantOf] = useState<number | null>(initialVariantOf || null)
  const [trafficSplit, setTrafficSplit] = useState<number>(initialTrafficSplit ?? 50)
  const [tab, setTab] = useState(0)
  const [preview, setPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const upd = <K extends keyof PopupConfig>(key: K, value: PopupConfig[K]) => setCfg((c) => ({ ...c, [key]: value }))

  const updContent = (key: string, value: unknown) => setCfg((c) => ({ ...c, content: { ...c.content, [key]: value } }))
  const updTargeting = (key: string, value: unknown) => setCfg((c) => ({ ...c, targeting: { ...c.targeting, [key]: value } }))
  const updFrequency = (key: string, value: unknown) => setCfg((c) => ({ ...c, frequency: { ...c.frequency, [key]: value } }))
  const updAdvanced = (key: string, value: unknown) => setCfg((c) => ({ ...c, advanced: { ...c.advanced, [key]: value } }))
  const updConversion = (key: string, value: unknown) => setCfg((c) => ({ ...c, conversion: { ...c.conversion, [key]: value } }))
  const updLeadForm = (key: string, value: unknown) => setCfg((c) => ({ ...c, leadForm: { ...c.leadForm, [key]: value } }))

  function updateCTA(id: string, key: keyof PopupCTA, value: unknown) {
    setCfg((c) => ({ ...c, ctas: c.ctas.map((cta) => (cta.id === id ? { ...cta, [key]: value } : cta)) }))
  }

  function addCTA() {
    setCfg((c) => ({
      ...c,
      ctas: [
        ...c.ctas,
        {
          id: `cta_${Date.now()}`,
          label: "New Button",
          url: "",
          newTab: false,
          bgColor: "#f59e0b",
          textColor: "#ffffff",
          hoverAnimation: "grow",
          icon: "🎯",
          type: "url",
        },
      ],
    }))
  }

  function removeCTA(id: string) {
    setCfg((c) => ({ ...c, ctas: c.ctas.filter((cta) => cta.id !== id) }))
  }

  function toggleBadge(key: "badges" | "trustBadges" | "awardBadges", value: string) {
    setCfg((c) => {
      if (key === "badges") {
        const list = c.content.badges.includes(value) ? c.content.badges.filter((b) => b !== value) : [...c.content.badges, value]
        return { ...c, content: { ...c.content, badges: list } }
      }
      if (key === "trustBadges") {
        const list = c.conversion.trustBadges.includes(value) ? c.conversion.trustBadges.filter((b) => b !== value) : [...c.conversion.trustBadges, value]
        return { ...c, conversion: { ...c.conversion, trustBadges: list } }
      }
      const list = c.conversion.awardBadges.includes(value) ? c.conversion.awardBadges.filter((b) => b !== value) : [...c.conversion.awardBadges, value]
      return { ...c, conversion: { ...c.conversion, awardBadges: list } }
    })
  }

  const previewPopup = useMemo(
    () => ({
      id: popupId || 0,
      variant: "A",
      type: cfg.type,
      name: cfg.name,
      config: cfg,
    }),
    [cfg, popupId]
  )

  async function save() {
    if (!cfg.name.trim()) {
      setError("Popup name is required")
      setTab(0)
      return
    }
    setSaving(true)
    setError("")
    try {
      const res = await fetch(popupId ? `/api/admin/popups/${popupId}` : "/api/admin/popups", {
        method: popupId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg, variant_of: variantOf, traffic_split: trafficSplit }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        setError(j.error || "Failed to save")
        return
      }
      window.location.href = "/admin/popups"
    } catch {
      setError("Failed to save popup")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition",
                tab === i
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setPreview(!preview)}>
            {preview ? <EyeOff className="w-3.5 h-3.5 mr-1" /> : <Eye className="w-3.5 h-3.5 mr-1" />}
            {preview ? "Hide Preview" : "Live Preview"}
          </Button>
          <Button type="button" size="sm" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1" />}
            Save Popup
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 px-4 py-2 text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className={preview ? "block fixed inset-0 z-[200]" : "hidden"}>
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setPreview(false)} />
        <div className="absolute bottom-4 left-4 z-10">
          <Button size="sm" onClick={() => setPreview(false)}>Close Preview</Button>
        </div>
        <PopupShell
          popup={previewPopup}
          onClose={() => setPreview(false)}
          onCTA={() => {}}
          onLeadSuccess={() => {}}
        />
      </div>

      {tab === 0 && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">General</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Popup Name *">
                <input className={inputCls} value={cfg.name} onChange={(e) => upd("name", e.target.value)} placeholder="e.g. Great Migration Offer" />
              </Field>
              <Field label="Status">
                <select className={inputCls} value={cfg.status} onChange={(e) => upd("status", e.target.value as PopupConfig["status"])}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Priority (higher = shows first)">
                <input type="number" className={inputCls} value={cfg.priority} min={1} max={10}
                  onChange={(e) => upd("priority", parseInt(e.target.value) || 5)} />
              </Field>
              <Field label="Category">
                <input className={inputCls} value={cfg.category} onChange={(e) => upd("category", e.target.value)}
                  placeholder="e.g. Seasonal, Offers, Destinations" />
              </Field>
              <Field label="Average Booking Value ($) — for revenue analytics" className="md:col-span-2">
                <input type="number" className={inputCls} value={cfg.conversionValue ?? ""}
                  onChange={(e) => upd("conversionValue", e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="e.g. 2000" />
              </Field>
            </div>
            <Field label="Internal Notes">
              <textarea className={cn(inputCls, "resize-none")} rows={2} value={cfg.notes}
                onChange={(e) => upd("notes", e.target.value)} placeholder="Notes visible to admin only" />
            </Field>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Popup Type</h3>
            <p className="text-xs text-slate-400 mb-3">Choose a layout for this popup</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {POPUP_TYPES.map((t) => (
                <button
                  type="button"
                  key={t.value}
                  onClick={() => {
                    upd("type", t.value)
                    upd("template", "")
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-left transition",
                    cfg.type === t.value
                      ? "border-amber-500 bg-amber-500/10 shadow"
                      : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                  )}
                >
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Templates</h3>
            <p className="text-xs text-slate-400 mb-3">Start from a proven tourism campaign template</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {POPUP_TEMPLATES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => {
                    const built = getTemplate(t.id)
                    if (built) {
                      const { name, ...rest } = cfg
                      void name
                      setCfg({ ...built, ...rest, name: built.name, template: t.id, type: built.type })
                    }
                  }}
                  className={cn(
                    "rounded-xl border p-3 text-left transition",
                    cfg.template === t.id
                      ? "border-amber-500 bg-amber-500/10 shadow"
                      : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                  )}
                >
                  <div className="text-lg mb-0.5">{t.emoji}</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Hero Image">
              <ImageUpload currentImage={cfg.content.heroImage} onUpload={(u) => updContent("heroImage", u)} />
            </Field>
            <Field label="Background Image">
              <ImageUpload currentImage={cfg.content.backgroundImage} onUpload={(u) => updContent("backgroundImage", u)} />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Video URL (YouTube embed or MP4)">
              <input className={inputCls} value={cfg.content.video} onChange={(e) => updContent("video", e.target.value)}
                placeholder="https://www.youtube.com/embed/..." />
            </Field>
            <Field label="Title">
              <input className={inputCls} value={cfg.content.title} onChange={(e) => updContent("title", e.target.value)} />
            </Field>
            <Field label="Subtitle">
              <input className={inputCls} value={cfg.content.subtitle} onChange={(e) => updContent("subtitle", e.target.value)} />
            </Field>
            <div className="flex items-end pb-1">
              <Toggle checked={cfg.content.emoji} onChange={(v) => updContent("emoji", v)} label="Allow emoji in title" />
            </div>
          </div>
          <Field label="Description">
            <textarea className={cn(inputCls, "resize-none")} rows={3} value={cfg.content.description}
              onChange={(e) => updContent("description", e.target.value)} />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Promo Code">
              <input className={inputCls} value={cfg.content.promoCode} onChange={(e) => updContent("promoCode", e.target.value)}
                placeholder="e.g. MIGRATION10" />
            </Field>
            <Field label="Countdown Ends At">
              <input type="datetime-local" className={inputCls}
                value={cfg.content.countdownEndsAt ? new Date(cfg.content.countdownEndsAt).toISOString().slice(0, 16) : ""}
                onChange={(e) => updContent("countdownEndsAt", e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </Field>
            <Field label="Price Before (strikethrough)">
              <input className={inputCls} value={cfg.content.priceBefore} onChange={(e) => updContent("priceBefore", e.target.value)}
                placeholder="e.g. $2,400" />
            </Field>
            <Field label="Discounted Price">
              <input className={inputCls} value={cfg.content.priceNow} onChange={(e) => updContent("priceNow", e.target.value)}
                placeholder="e.g. $2,160" />
            </Field>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Highlight Badges</span>
            <input className={inputCls} value={cfg.content.badges.join(", ")}
              onChange={(e) => updContent("badges", e.target.value.split(",").map((b) => b.trim()).filter(Boolean))}
              placeholder="e.g. Best Price Guarantee, Expert Guides" />
            <p className="text-[10px] text-slate-400 mt-1">Comma separated</p>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-4">
          {cfg.ctas.map((cta, i) => (
            <div key={cta.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Button {i + 1}</h3>
                {cfg.ctas.length > 1 && (
                  <button type="button" onClick={() => removeCTA(cta.id)} className="text-red-400 hover:text-red-500 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Label">
                  <input className={inputCls} value={cta.label} onChange={(e) => updateCTA(cta.id, "label", e.target.value)} />
                </Field>
                <Field label="URL">
                  <input className={inputCls} value={cta.url} onChange={(e) => updateCTA(cta.id, "url", e.target.value)}
                    placeholder="https://... or wa.me link" />
                </Field>
                <Field label="Type">
                  <select className={inputCls} value={cta.type} onChange={(e) => updateCTA(cta.id, "type", e.target.value)}>
                    <option value="url">Link</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="call">Call Now</option>
                    <option value="download">Download</option>
                    <option value="close">Close Popup</option>
                  </select>
                </Field>
                <Field label="Background Color">
                  <div className="flex gap-2 items-center">
                    <input type="color" className="h-9 w-12 rounded border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                      value={cta.bgColor} onChange={(e) => updateCTA(cta.id, "bgColor", e.target.value)} />
                    <input className={inputCls} value={cta.bgColor} onChange={(e) => updateCTA(cta.id, "bgColor", e.target.value)} />
                  </div>
                </Field>
                <Field label="Text Color">
                  <div className="flex gap-2 items-center">
                    <input type="color" className="h-9 w-12 rounded border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                      value={cta.textColor} onChange={(e) => updateCTA(cta.id, "textColor", e.target.value)} />
                    <input className={inputCls} value={cta.textColor} onChange={(e) => updateCTA(cta.id, "textColor", e.target.value)} />
                  </div>
                </Field>
                <Field label="Hover Animation">
                  <select className={inputCls} value={cta.hoverAnimation} onChange={(e) => updateCTA(cta.id, "hoverAnimation", e.target.value)}>
                    <option value="none">None</option>
                    <option value="pulse">Pulse</option>
                    <option value="grow">Grow</option>
                    <option value="shine">Shine</option>
                    <option value="shake">Shake</option>
                  </select>
                </Field>
              </div>
              <div className="mt-3">
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Icon (emoji)</span>
                <div className="flex flex-wrap gap-1.5">
                  {CTA_ICONS.map((ic) => (
                    <button type="button" key={ic} onClick={() => updateCTA(cta.id, "icon", cta.icon === ic ? null : ic)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-base flex items-center justify-center border transition",
                        cta.icon === ic ? "border-amber-500 bg-amber-500/15" : "border-slate-200 dark:border-slate-700 hover:border-amber-300"
                      )}>
                      {ic}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <Toggle checked={cta.newTab} onChange={(v) => updateCTA(cta.id, "newTab", v)} label="Open in new tab" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addCTA}
            className="w-full rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-amber-400 py-3 text-xs font-semibold text-slate-400 hover:text-amber-500 transition flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Another Button
          </button>
        </div>
      )}

      {tab === 3 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Audience Targeting</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Visitor Type">
              <select className={inputCls} value={cfg.targeting.visitorType} onChange={(e) => updTargeting("visitorType", e.target.value)}>
                <option value="all">Everyone</option>
                <option value="new">New Visitors Only</option>
                <option value="returning">Returning Visitors Only</option>
              </select>
            </Field>
            <Field label="Min pages visited">
              <input type="number" min={0} className={inputCls} value={cfg.targeting.minPagesVisited}
                onChange={(e) => updTargeting("minPagesVisited", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Stayed X seconds">
              <input type="number" min={0} className={inputCls} value={cfg.targeting.minTimeSeconds}
                onChange={(e) => updTargeting("minTimeSeconds", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Pages">
              <select className={inputCls} value={cfg.targeting.pages} onChange={(e) => updTargeting("pages", e.target.value)}>
                <option value="all">All Pages</option>
                <option value="home">Only Homepage</option>
                <option value="destinations">Destination Pages</option>
                <option value="packages">Package Pages</option>
                <option value="blog">Blog / Travel Guide</option>
                <option value="contact">Contact</option>
                <option value="gallery">Gallery</option>
                <option value="custom">Custom Pages</option>
              </select>
            </Field>
            {cfg.targeting.pages === "custom" && (
              <Field label="Custom paths (comma separated, * wildcards)" className="md:col-span-2">
                <input className={inputCls} value={cfg.targeting.customPages.join(", ")}
                  onChange={(e) => updTargeting("customPages", e.target.value.split(",").map((p) => p.trim()).filter(Boolean))}
                  placeholder="/deals, /travel-guide/*" />
              </Field>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Devices">
              <select multiple className={cn(inputCls, "h-auto")} value={cfg.targeting.devices}
                onChange={(e) => updTargeting("devices", Array.from(e.target.selectedOptions).map((o) => o.value))}>
                <option value="mobile">Mobile</option>
                <option value="tablet">Tablet</option>
                <option value="desktop">Desktop</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Hold Ctrl/Cmd to select. Empty = all devices.</p>
            </Field>
            <Field label="Traffic Source">
              <select multiple className={cn(inputCls, "h-auto")} value={cfg.targeting.trafficSources}
                onChange={(e) => updTargeting("trafficSources", Array.from(e.target.selectedOptions).map((o) => o.value))}>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="direct">Direct</option>
                <option value="referral">Referral</option>
                <option value="utm">UTM Campaign</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">Empty = all sources.</p>
            </Field>
            <Field label="Countries (ISO codes, comma separated)">
              <input className={inputCls} value={cfg.targeting.countries.join(", ")}
                onChange={(e) => updTargeting("countries", e.target.value.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean))}
                placeholder="KE, US, GB, DE, FR" />
            </Field>
            <Field label="Languages (e.g. en, fr, de)">
              <input className={inputCls} value={cfg.targeting.languages.join(", ")}
                onChange={(e) => updTargeting("languages", e.target.value.split(",").map((l) => l.trim().toLowerCase()).filter(Boolean))}
                placeholder="en, fr, de" />
            </Field>
            <Field label="UTM Campaign (exact match)">
              <input className={inputCls} value={cfg.targeting.utmCampaign}
                onChange={(e) => updTargeting("utmCampaign", e.target.value)} placeholder="e.g. instagram_spring" />
            </Field>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Toggle checked={cfg.targeting.exitIntent} onChange={(v) => updTargeting("exitIntent", v)} label="Exit intent (mouse leaves window)" />
              <Toggle checked={cfg.advanced.trigger === "inactivity"} onChange={(v) => updAdvanced("trigger", v ? "inactivity" : "delay")} label="Show after mouse inactivity" />
            </div>
            <Field label="Show after scroll depth">
              <select className={inputCls} value={cfg.targeting.scrollDepth}
                onChange={(e) => updTargeting("scrollDepth", parseInt(e.target.value) || 0)}>
                <option value={0}>No scroll requirement</option>
                <option value={50}>50% of page</option>
                <option value={75}>75% of page</option>
                <option value={100}>100% of page</option>
              </select>
            </Field>
          </div>
        </div>
      )}

      {tab === 4 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Frequency Control</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Show">
              <select className={inputCls} value={cfg.frequency.show} onChange={(e) => updFrequency("show", e.target.value)}>
                <option value="once_ever">Once Ever</option>
                <option value="once_per_day">Once Per Day</option>
                <option value="once_per_week">Once Per Week</option>
                <option value="every_visit">Every Visit</option>
                <option value="every_x_days">Every X Days</option>
              </select>
            </Field>
            {cfg.frequency.show === "every_x_days" && (
              <Field label="Days between shows">
                <input type="number" min={1} className={inputCls} value={cfg.frequency.everyXDays}
                  onChange={(e) => updFrequency("everyXDays", parseInt(e.target.value) || 7)} />
              </Field>
            )}
            <Field label="Max per session">
              <input type="number" min={1} className={inputCls} value={cfg.frequency.maxPerSession}
                onChange={(e) => updFrequency("maxPerSession", parseInt(e.target.value) || 1)} />
            </Field>
          </div>
          <div className="space-y-2.5">
            <Toggle checked={cfg.frequency.suppressAfterConversion} onChange={(v) => updFrequency("suppressAfterConversion", v)}
              label="Do not show again after conversion (form submitted)" />
            <Toggle checked={cfg.frequency.suppressAfterBooking} onChange={(v) => updFrequency("suppressAfterBooking", v)}
              label="Do not show again after booking" />
            <Toggle checked={cfg.frequency.suppressAfterWhatsApp} onChange={(v) => updFrequency("suppressAfterWhatsApp", v)}
              label="Do not show again after WhatsApp click" />
          </div>
        </div>
      )}

      {tab === 5 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Advanced Display Rules</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Trigger">
              <select className={inputCls} value={cfg.advanced.trigger} onChange={(e) => updAdvanced("trigger", e.target.value)}>
                <option value="delay">After delay</option>
                <option value="scroll">On scroll</option>
                <option value="inactivity">Mouse inactivity</option>
                <option value="exit">Exit intent</option>
                <option value="randomized">Randomized delay</option>
              </select>
            </Field>
            {cfg.advanced.trigger !== "exit" && cfg.advanced.trigger !== "inactivity" && (
              <Field label="Delay (seconds)">
                <input type="number" min={0} className={inputCls} value={cfg.advanced.delaySeconds}
                  onChange={(e) => updAdvanced("delaySeconds", parseInt(e.target.value) || 0)} />
              </Field>
            )}
            {cfg.advanced.trigger === "inactivity" && (
              <Field label="Inactivity (seconds)">
                <input type="number" min={3} className={inputCls} value={cfg.advanced.inactivitySeconds}
                  onChange={(e) => updAdvanced("inactivitySeconds", parseInt(e.target.value) || 15)} />
              </Field>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Schedule Start">
              <input type="datetime-local" className={inputCls}
                value={cfg.startDate ? new Date(cfg.startDate).toISOString().slice(0, 16) : ""}
                onChange={(e) => upd("startDate", e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </Field>
            <Field label="Schedule End">
              <input type="datetime-local" className={inputCls}
                value={cfg.endDate ? new Date(cfg.endDate).toISOString().slice(0, 16) : ""}
                onChange={(e) => upd("endDate", e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </Field>
            <Field label="Date Window (targeting)">
              <input type="date" className={inputCls}
                value={cfg.advanced.dateWindowStart?.slice(0, 10) || ""}
                onChange={(e) => updAdvanced("dateWindowStart", e.target.value ? e.target.value : null)} />
            </Field>
            <Field label="End of Date Window">
              <input type="date" className={inputCls}
                value={cfg.advanced.dateWindowEnd?.slice(0, 10) || ""}
                onChange={(e) => updAdvanced("dateWindowEnd", e.target.value ? e.target.value : null)} />
            </Field>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Toggle checked={cfg.advanced.businessHoursOnly} onChange={(v) => updAdvanced("businessHoursOnly", v)}
              label="Business hours only" />
            {cfg.advanced.businessHoursOnly && (
              <div className="flex gap-2">
                <Field label="From">
                  <input type="time" className={inputCls} value={cfg.advanced.businessHoursStart}
                    onChange={(e) => updAdvanced("businessHoursStart", e.target.value)} />
                </Field>
                <Field label="To">
                  <input type="time" className={inputCls} value={cfg.advanced.businessHoursEnd}
                    onChange={(e) => updAdvanced("businessHoursEnd", e.target.value)} />
                </Field>
              </div>
            )}
            <Toggle checked={cfg.advanced.weekendOnly} onChange={(v) => updAdvanced("weekendOnly", v)} label="Weekend only" />
          </div>
        </div>
      )}

      {tab === 6 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Conversion Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Toggle checked={cfg.conversion.countdown} onChange={(v) => updConversion("countdown", v)} label="Countdown timer" />
            <Toggle checked={cfg.conversion.peopleViewing} onChange={(v) => updConversion("peopleViewing", v)} label="'People viewing' counter" />
            <Toggle checked={cfg.conversion.recentlyBooked} onChange={(v) => updConversion("recentlyBooked", v)} label="'Recently booked' notification" />
            <Toggle checked={cfg.conversion.liveFeed} onChange={(v) => updConversion("liveFeed", v)} label="Live booking feed" />
            <Toggle checked={cfg.conversion.securePayment} onChange={(v) => updConversion("securePayment", v)} label="Secure payment badge" />
            <Toggle checked={cfg.conversion.moneyBack} onChange={(v) => updConversion("moneyBack", v)} label="Money back guarantee" />
            <Toggle checked={cfg.conversion.customerPhotos} onChange={(v) => updConversion("customerPhotos", v)} label="Customer photos" />
            <Toggle checked={cfg.conversion.videoTestimonials} onChange={(v) => updConversion("videoTestimonials", v)} label="Video testimonials" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Field label="Remaining seats">
              <input type="number" min={0} className={inputCls} value={cfg.conversion.remainingSeats ?? ""}
                onChange={(e) => updConversion("remainingSeats", e.target.value ? parseInt(e.target.value) : null)}
                placeholder="e.g. 12 (empty = off)" />
            </Field>
            <Field label="Google Rating (e.g. 4.9)">
              <input type="number" step="0.1" min={0} max={5} className={inputCls} value={cfg.conversion.googleReviews ?? ""}
                onChange={(e) => updConversion("googleReviews", e.target.value ? parseFloat(e.target.value) : null)} />
            </Field>
            <Field label="TripAdvisor Rating (1–5)">
              <input type="number" step="0.1" min={0} max={5} className={inputCls} value={cfg.conversion.tripadvisorRating ?? ""}
                onChange={(e) => updConversion("tripadvisorRating", e.target.value ? parseFloat(e.target.value) : null)} />
            </Field>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Trust Badges</span>
            <BadgePicker options={TRUST_BADGES} selected={cfg.conversion.trustBadges} onToggle={(v) => toggleBadge("trustBadges", v)} />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Award Badges</span>
            <BadgePicker options={AWARD_BADGES} selected={cfg.conversion.awardBadges} onToggle={(v) => toggleBadge("awardBadges", v)} />
          </div>
        </div>
      )}

      {tab === 7 && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Lead Capture Form</h3>
          <Toggle checked={cfg.leadForm.enabled} onChange={(v) => updLeadForm("enabled", v)} label="Enable lead form on this popup" />
          {cfg.leadForm.enabled && (
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Form fields</span>
                <div className="flex flex-wrap gap-1.5">
                  {["name", "phone", "email", "country", "destination", "travel_date", "budget", "adults", "children", "message"].map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => {
                        const list = cfg.leadForm.fields.includes(f)
                          ? cfg.leadForm.fields.filter((x) => x !== f)
                          : [...cfg.leadForm.fields, f]
                        updLeadForm("fields", list)
                      }}
                      className={cn(
                        "text-[11px] px-2 py-1 rounded-full border capitalize transition",
                        cfg.leadForm.fields.includes(f)
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                      )}
                    >
                      {f.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Submit button label">
                  <input className={inputCls} value={cfg.leadForm.submitLabel} onChange={(e) => updLeadForm("submitLabel", e.target.value)} />
                </Field>
                <Field label="Success message">
                  <input className={inputCls} value={cfg.leadForm.successMessage} onChange={(e) => updLeadForm("successMessage", e.target.value)} />
                </Field>
              </div>
              <Toggle checked={cfg.leadForm.emailRequired} onChange={(v) => updLeadForm("emailRequired", v)} label="Email required" />
              <p className="text-xs text-slate-400">
                Submissions are saved to Supabase automatically and can be exported as CSV from the Leads page.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 8 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">A/B Testing</h3>
            <p className="text-xs text-slate-400">
              Make this popup a variant of another popup. Traffic is split automatically between the original (A) and this variant (B).
              Analytics will show which converts better.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Variant of">
                <select className={inputCls} value={variantOf ?? ""} onChange={(e) => setVariantOf(e.target.value ? parseInt(e.target.value) : null)}>
                  <option value="">Not a variant (original)</option>
                  {allPopups
                    .filter((p) => p.id !== popupId)
                    .map((p) => (
                      <option key={p.id} value={p.id}>{p.title} (#{p.id})</option>
                    ))}
                </select>
              </Field>
              <Field label="Traffic % to this variant">
                <input type="number" min={5} max={95} className={inputCls} value={trafficSplit}
                  onChange={(e) => setTrafficSplit(Math.min(95, Math.max(5, parseInt(e.target.value) || 50)))} />
              </Field>
            </div>
            {variantOf && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Tip: the original popup shows to {100 - trafficSplit}% of visitors, this variant to {trafficSplit}%.
              </p>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Start / End Dates</h3>
            <p className="text-xs text-slate-400 mb-3">Status becomes "scheduled" automatically once dates are set.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Start">
                <input type="datetime-local" className={inputCls}
                  value={cfg.startDate ? new Date(cfg.startDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => upd("startDate", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              </Field>
              <Field label="End">
                <input type="datetime-local" className={inputCls}
                  value={cfg.endDate ? new Date(cfg.endDate).toISOString().slice(0, 16) : ""}
                  onChange={(e) => upd("endDate", e.target.value ? new Date(e.target.value).toISOString() : null)} />
              </Field>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
