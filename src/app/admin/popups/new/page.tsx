"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Megaphone, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/admin/ImageUpload"

export default function NewPopupPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [form, setForm] = useState({
    title: "", content: "", image: "", link_url: "", link_text: "Learn More",
    position: "center", delay_seconds: "0", start_date: "", end_date: "",
    is_active: false, show_once: true,
  })

  const set = useCallback((key: string, value: any) => setForm((p) => ({ ...p, [key]: value })), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title) return
    setSaving(true)
    setSaveError("")
    try {
      const res = await fetch("/api/admin/popups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          delay_seconds: parseInt(form.delay_seconds) || 0,
          start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
          end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        }),
      })
      if (res.ok) { router.push("/admin/popups"); return }
      const json = await res.json()
      setSaveError(json.error || `Error ${res.status}`)
    } catch { setSaveError("Network error — check console") } finally { setSaving(false) }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Popup</h2>
            <p className="text-xs text-slate-500">Create a promotional popup banner</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-fuchsia-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Content</h3>
          </div>
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Summer Sale 2026" required />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Get 20% off all safari packages this summer!" rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload currentImage={form.image} onUpload={(url) => set("image", url)} />
          </div>
        </motion.div>

        {/* Link & CTA */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Link & CTA</h3>
          </div>
          <div className="space-y-2">
            <Label>Link URL</Label>
            <Input value={form.link_url} onChange={(e) => set("link_url", e.target.value)} placeholder="/deals/summer-sale" />
          </div>
          <div className="space-y-2">
            <Label>Button Text</Label>
            <Input value={form.link_text} onChange={(e) => set("link_text", e.target.value)} placeholder="Learn More" />
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Display Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={form.position} onValueChange={(v) => set("position", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center Modal</SelectItem>
                  <SelectItem value="bottom">Bottom Banner</SelectItem>
                  <SelectItem value="full">Full Screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Delay (seconds)</Label>
              <Input type="number" min="0" value={form.delay_seconds} onChange={(e) => set("delay_seconds", e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="datetime-local" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="datetime-local" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set("is_active", e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" checked={form.show_once} onChange={(e) => set("show_once", e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600" />
              Show once per visitor
            </label>
          </div>
        </motion.div>

        {/* Submit */}
        {saveError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            {saveError}
          </motion.div>
        )}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="h-9">Cancel</Button>
          <Button type="submit" disabled={saving || !form.title}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-400 text-white border-0 h-9">
            <Save className="w-4 h-4 mr-1.5" />{saving ? "Saving..." : "Save Popup"}
          </Button>
        </div>
      </form>
    </div>
  )
}
