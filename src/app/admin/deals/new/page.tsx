"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Save, Tag, ImageIcon, Info, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

function ArrayInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("")
  const add = () => {
    const val = input.trim()
    if (val && !values.includes(val)) { onChange([...values, val]); setInput("") }
  }
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }} />
        <Button type="button" variant="outline" onClick={add} size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
      </div>
      {values.length > 0 && (
        <motion.div layout className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <motion.span key={v + i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700">
              {v}<button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function NewDealPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "", slug: "", description: "", discount: "", code: "", image: "", type: "special",
    original_price: "", deal_price: "", price_kes: "", valid_until: "", duration: "",
    accommodation: "", meals: "", featured: false,
    highlights: [] as string[], included: [] as string[],
    itinerary: [] as { day: string; description: string }[],
  })

  const handleTitleChange = useCallback((title: string) => {
    setForm((prev) => ({ ...prev, title, slug: slugify(title) }))
  }, [])

  function addItineraryItem() {
    setForm((p) => ({ ...p, itinerary: [...p.itinerary, { day: `Day ${p.itinerary.length + 1}`, description: "" }] }))
  }

  function updateItineraryItem(i: number, field: "day" | "description", value: string) {
    setForm((p) => {
      const updated = [...p.itinerary]
      updated[i] = { ...updated[i], [field]: value }
      return { ...p, itinerary: updated }
    })
  }

  function removeItineraryItem(i: number) {
    setForm((p) => ({ ...p, itinerary: p.itinerary.filter((_, j) => j !== i) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.slug) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, original_price: Number(form.original_price) || 0, deal_price: Number(form.deal_price) || 0, price_kes: form.price_kes ? Number(form.price_kes) : null }),
      })
      if (res.ok) { router.push("/admin/deals"); router.refresh() }
      else { const err = await res.json(); alert(err.error || "Failed to create deal") }
    } catch { alert("Network error") }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-600 via-amber-500 to-orange-400 p-6 sm:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-orange-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => router.push("/admin/deals")} className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">New Deal</h1>
            <p className="text-sm text-white/80">Add a new special offer</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.image && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="aspect-video relative">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            </div>
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-xs text-white flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" /> Preview
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 pt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Basic Information</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Title, slug, type, and pricing</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Early Bird Safari" required /></div>
              <div className="space-y-2"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v ?? "special" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early-bird">Early Bird</SelectItem>
                    <SelectItem value="last-minute">Last Minute</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="combo">Combo</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 5 Days / 4 Nights" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Original Price (USD)</Label><Input type="number" value={form.original_price} onChange={(e) => setForm((p) => ({ ...p, original_price: e.target.value }))} placeholder="0" /></div>
              <div className="space-y-2"><Label>Deal Price (USD)</Label><Input type="number" value={form.deal_price} onChange={(e) => setForm((p) => ({ ...p, deal_price: e.target.value }))} placeholder="0" /></div>
              <div className="space-y-2"><Label>Price (KES)</Label><Input type="number" value={form.price_kes} onChange={(e) => setForm((p) => ({ ...p, price_kes: e.target.value }))} placeholder="Optional" /></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 pt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Offer Details</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Discount, promo code, validity, and description</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Discount Label</Label><Input value={form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: e.target.value }))} placeholder="e.g. 20% Off" /></div>
              <div className="space-y-2"><Label>Promo Code</Label><Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} placeholder="e.g. EARLY20" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Valid Until</Label><Input value={form.valid_until} onChange={(e) => setForm((p) => ({ ...p, valid_until: e.target.value }))} placeholder="e.g. Dec 31, 2026" /></div>
              <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50/80 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500" />
              <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">Featured deal <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">(shown prominently on the site)</span></Label>
            </div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Accommodation</Label><Input value={form.accommodation} onChange={(e) => setForm((p) => ({ ...p, accommodation: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Meals</Label><Input value={form.meals} onChange={(e) => setForm((p) => ({ ...p, meals: e.target.value }))} /></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 pt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <List className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Lists & Itinerary</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Highlights, inclusions, and day-by-day itinerary</p>
          </div>
          <div className="p-6 space-y-5">
            <ArrayInput label="Highlights" values={form.highlights} onChange={(v) => setForm((p) => ({ ...p, highlights: v }))} />
            <ArrayInput label="Included" values={form.included} onChange={(v) => setForm((p) => ({ ...p, included: v }))} />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Itinerary</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItineraryItem}
                  className="border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Day
                </Button>
              </div>
              {form.itinerary.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-start p-3 rounded-lg bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-900">
                  <div className="flex-1 space-y-2">
                    <Input value={item.day} onChange={(e) => updateItineraryItem(i, "day", e.target.value)} placeholder="Day title" className="text-sm font-medium" />
                    <Textarea value={item.description} onChange={(e) => updateItineraryItem(i, "description", e.target.value)} placeholder="Description for this day..." rows={2} />
                  </div>
                  <button type="button" onClick={() => removeItineraryItem(i)} className="mt-1 text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-3 pb-8">
          <Button variant="outline" onClick={() => router.push("/admin/deals")}
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</Button>
          <Button type="submit" disabled={saving}
            className="bg-gradient-to-r from-amber-500 to-orange-400 text-white border-0 hover:shadow-lg hover:shadow-amber-500/25 transition-all min-w-[140px]">
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? "Saving..." : "Save Deal"}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
