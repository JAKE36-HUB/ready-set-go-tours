"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, ImageIcon, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function Skeleton() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="h-28 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
      <div className="space-y-4">{[...Array(2)].map((_, i) => (<div key={i} className="h-36 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />))}</div>
    </div>
  )
}

export default function EditGalleryImagePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ src: "", alt: "", category: "uncategorized", width: "800", height: "600" })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/gallery/${params.id}`)
        const json = await res.json()
        if (json.data) {
          const img = json.data
          setForm({
            src: img.src || "", alt: img.alt || "", category: img.category || "uncategorized",
            width: String(img.width ?? 800), height: String(img.height ?? 600),
          })
        }
      } catch { alert("Failed to load image") }
      finally { setLoading(false) }
    }
    load()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.src) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/gallery/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, width: Number(form.width) || 800, height: Number(form.height) || 600 }),
      })
      if (res.ok) { router.push("/admin/gallery"); router.refresh() }
      else { const err = await res.json(); alert(err.error || "Failed to update image") }
    } catch { alert("Network error") }
    finally { setSaving(false) }
  }

  if (loading) return <Skeleton />

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-violet-400 p-6 sm:p-8">
        <div className="absolute inset-0">
          <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-violet-300/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => router.push("/admin/gallery")} className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white truncate">Edit Image</h1>
            <p className="text-sm text-white/80 truncate">{form.alt || "Gallery image"}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs text-white font-medium">
            <Sparkles className="w-3 h-3" /> Editing
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.src && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="aspect-video relative">
              <img src={form.src} alt="Preview" className="w-full h-full object-cover"
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
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Image Details</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">URL, description, and category</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2"><Label>Image URL *</Label><Input value={form.src} onChange={(e) => setForm((p) => ({ ...p, src: e.target.value }))} required /></div>
            <div className="space-y-2"><Label>Alt Text</Label><Input value={form.alt} onChange={(e) => setForm((p) => ({ ...p, alt: e.target.value }))} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v ?? "uncategorized" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                    <SelectItem value="safari">Safari</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="wildlife">Wildlife</SelectItem>
                    <SelectItem value="beach">Beach</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Width (px)</Label><Input type="number" value={form.width} onChange={(e) => setForm((p) => ({ ...p, width: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Height (px)</Label><Input type="number" value={form.height} onChange={(e) => setForm((p) => ({ ...p, height: e.target.value }))} /></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between gap-3 pb-8">
          <Button variant="outline" onClick={() => router.push("/admin/gallery")}
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</Button>
          <Button type="submit" disabled={saving}
            className="bg-gradient-to-r from-purple-500 to-violet-400 text-white border-0 hover:shadow-lg hover:shadow-purple-500/25 transition-all min-w-[140px]">
            <Save className="w-4 h-4 mr-1.5" />{saving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </form>
    </div>
  )
}
