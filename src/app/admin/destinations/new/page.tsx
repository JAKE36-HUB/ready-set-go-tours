"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Save, MapPin, ImageIcon, Info, Star } from "lucide-react"
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
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder}
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

export default function NewDestinationPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "", slug: "", image: "", description: "", rating: "", best_time: "", duration: "",
    starting_price: "", region: "kenya", highlights: [] as string[],
  })

  const handleNameChange = useCallback((name: string) => {
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) || 0, starting_price: Number(form.starting_price) || 0 }),
      })
      if (res.ok) { router.push("/admin/destinations"); router.refresh() }
      else { const err = await res.json(); alert(err.error || "Failed to create destination") }
    } catch { alert("Network error") }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400 p-6 sm:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => router.push("/admin/destinations")} className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">New Destination</h1>
            <p className="text-sm text-white/80">Add a new travel destination</p>
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
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Basic Information</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Name, region, rating, and pricing</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Maasai Mara" required /></div>
              <div className="space-y-2"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={form.region} onValueChange={(v) => setForm((p) => ({ ...p, region: v ?? "kenya" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                    <SelectItem value="uganda">Uganda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Rating (1-5)</Label><Input type="number" min="0" max="5" step="0.5" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} placeholder="e.g. 4.5" /></div>
              <div className="space-y-2"><Label>Starting Price ($)</Label><Input type="number" value={form.starting_price} onChange={(e) => setForm((p) => ({ ...p, starting_price: e.target.value }))} placeholder="0" /></div>
            </div>
            <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 pt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Details</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Description, best time, and duration</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Best Time to Visit</Label><Input value={form.best_time} onChange={(e) => setForm((p) => ({ ...p, best_time: e.target.value }))} placeholder="e.g. June - October" /></div>
              <div className="space-y-2"><Label>Typical Duration</Label><Input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3-5 Days" /></div>
            </div>
            <ArrayInput label="Highlights" values={form.highlights} onChange={(v) => setForm((p) => ({ ...p, highlights: v }))} placeholder="e.g. Great Migration" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-3 pb-8">
          <Button variant="outline" onClick={() => router.push("/admin/destinations")}
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</Button>
          <Button type="submit" disabled={saving}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white border-0 hover:shadow-lg hover:shadow-emerald-500/25 transition-all min-w-[140px]">
            <Save className="w-4 h-4 mr-1.5" />{saving ? "Saving..." : "Save Destination"}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
