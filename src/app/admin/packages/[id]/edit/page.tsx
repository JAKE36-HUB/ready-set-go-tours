"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Save, Package, ImageIcon, Info, List, Sparkles } from "lucide-react"
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
    if (val && !values.includes(val)) {
      onChange([...values, val])
      setInput("")
    }
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
              {v}
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </motion.span>
          ))}
        </motion.div>
      )}
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="h-28 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-52 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export default function EditPackagePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "", slug: "", type: "safari", image: "", price: "", price_kes: "",
    duration: "", accommodation: "", meals: "", transport: "", description: "",
    activities: [] as string[], highlights: [] as string[], included: [] as string[], excluded: [] as string[],
  })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/packages/${params.id}`)
        const json = await res.json()
        if (json.data) {
          const p = json.data
          setForm({
            name: p.name || "", slug: p.slug || "", type: p.type || "safari", image: p.image || "",
            price: String(p.price ?? ""), price_kes: String(p.price_kes ?? ""),
            duration: p.duration || "", accommodation: p.accommodation || "", meals: p.meals || "",
            transport: p.transport || "", description: p.description || "",
            activities: p.activities || [], highlights: p.highlights || [],
            included: p.included || [], excluded: p.excluded || [],
          })
        }
      } catch { alert("Failed to load package") }
      finally { setLoading(false) }
    }
    load()
  }, [params.id])

  const handleNameChange = useCallback((name: string) => {
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/packages/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) || 0, price_kes: form.price_kes ? Number(form.price_kes) : null }),
      })
      if (res.ok) { router.push("/admin/packages"); router.refresh() }
      else { const err = await res.json(); alert(err.error || "Failed to update package") }
    } catch { alert("Network error") }
    finally { setSaving(false) }
  }

  if (loading) return <Skeleton />

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-400 p-6 sm:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-cyan-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => router.push("/admin/packages")} className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">Edit Package</h1>
            <p className="text-sm text-white/80 truncate">{form.name}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs text-white font-medium">
            <Sparkles className="w-3 h-3" />
            Editing
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
              <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Basic Information</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Name, slug, type, and pricing</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v ?? "safari" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safari">Safari</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="mountain">Mountain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (USD)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Price (KES)</Label>
                <Input type="number" value={form.price_kes} onChange={(e) => setForm((p) => ({ ...p, price_kes: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 pt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Package Details</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Accommodation, meals, transport, and description</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label>Accommodation</Label>
              <Input value={form.accommodation} onChange={(e) => setForm((p) => ({ ...p, accommodation: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Meals</Label>
                <Input value={form.meals} onChange={(e) => setForm((p) => ({ ...p, meals: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Transport</Label>
                <Input value={form.transport} onChange={(e) => setForm((p) => ({ ...p, transport: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-6 pt-6 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
                <List className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Lists</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Activities, highlights, inclusions, and exclusions</p>
          </div>
          <div className="p-6 space-y-5">
            <ArrayInput label="Activities" values={form.activities} onChange={(v) => setForm((p) => ({ ...p, activities: v }))} />
            <ArrayInput label="Highlights" values={form.highlights} onChange={(v) => setForm((p) => ({ ...p, highlights: v }))} />
            <ArrayInput label="Included" values={form.included} onChange={(v) => setForm((p) => ({ ...p, included: v }))} />
            <ArrayInput label="Excluded" values={form.excluded} onChange={(v) => setForm((p) => ({ ...p, excluded: v }))} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-3 pb-8">
          <Button variant="outline" onClick={() => router.push("/admin/packages")}
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</Button>
          <Button type="submit" disabled={saving}
            className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 hover:shadow-lg hover:shadow-sky-500/25 transition-all min-w-[140px]">
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
