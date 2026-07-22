"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

interface ArrayInputProps {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

function ArrayInput({ label, values, onChange, placeholder }: ArrayInputProps) {
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
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
        />
        <Button type="button" variant="outline" onClick={add} size="icon" className="shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {v}
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NewPackagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "safari",
    image: "",
    price: "",
    price_kes: "",
    duration: "",
    accommodation: "",
    meals: "",
    transport: "",
    description: "",
    activities: [] as string[],
    highlights: [] as string[],
    included: [] as string[],
    excluded: [] as string[],
  })

  const handleNameChange = useCallback((name: string) => {
    setForm((prev) => ({ ...prev, name, slug: slugify(name) }))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.slug) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price) || 0,
          price_kes: form.price_kes ? Number(form.price_kes) : null,
        }),
      })
      if (res.ok) {
        router.push("/admin/packages")
        router.refresh()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to create package")
      }
    } catch {
      alert("Network error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/packages")} aria-label="Back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Package</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Add a new tour package</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. 7-Day Kenya Safari" required />
            </div>
            <div className="space-y-2">
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} placeholder="auto-generated" required />
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
              <Input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 7 Days / 6 Nights" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price (USD)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Price (KES)</Label>
              <Input type="number" value={form.price_kes} onChange={(e) => setForm((p) => ({ ...p, price_kes: e.target.value }))} placeholder="Optional" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accommodation</Label>
            <Input value={form.accommodation} onChange={(e) => setForm((p) => ({ ...p, accommodation: e.target.value }))} placeholder="e.g. Luxury tented camps" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Meals</Label>
              <Input value={form.meals} onChange={(e) => setForm((p) => ({ ...p, meals: e.target.value }))} placeholder="e.g. Full board" />
            </div>
            <div className="space-y-2">
              <Label>Transport</Label>
              <Input value={form.transport} onChange={(e) => setForm((p) => ({ ...p, transport: e.target.value }))} placeholder="e.g. 4x4 Jeep" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe the package..."
              rows={4}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Details</h3>
          <ArrayInput label="Activities" values={form.activities} onChange={(v) => setForm((p) => ({ ...p, activities: v }))} placeholder="e.g. Game drives" />
          <ArrayInput label="Highlights" values={form.highlights} onChange={(v) => setForm((p) => ({ ...p, highlights: v }))} placeholder="e.g. View the Big Five" />
          <ArrayInput label="Included" values={form.included} onChange={(v) => setForm((p) => ({ ...p, included: v }))} placeholder="e.g. Park fees" />
          <ArrayInput label="Excluded" values={form.excluded} onChange={(v) => setForm((p) => ({ ...p, excluded: v }))} placeholder="e.g. International flights" />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/admin/packages")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? "Saving..." : "Save Package"}
          </Button>
        </div>
      </form>
    </div>
  )
}
