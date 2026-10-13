"use client"

import { useState } from "react"
import { Plus, X, ChevronUp, ChevronDown, CalendarDays, Utensils, Hotel, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ItineraryDay, OptionalActivity } from "@/lib/tour"

function ChipInput({ label, values, onChange, placeholder }: {
  label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string
}) {
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
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }} />
        <Button type="button" variant="outline" onClick={add} size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span key={v + i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700">
              {v}
              <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function ItineraryDaysEditor({ value, onChange }: {
  value: ItineraryDay[]; onChange: (v: ItineraryDay[]) => void
}) {
  const update = (i: number, patch: Partial<ItineraryDay>) => {
    onChange(value.map((d, j) => (j === i ? { ...d, ...patch } : d)))
  }
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const add = () => {
    const day = `Day ${value.length + 1}`
    onChange([
      ...value,
      { day, title: "", description: "", meals: "", accommodation: "", activities: [], highlights: [] } as ItineraryDay,
    ])
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
            <CalendarDays className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Day-by-Day Itinerary</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">One card per day of the safari</p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="w-4 h-4 mr-1" /> Add Day</Button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
          No itinerary yet. Add days to show a detailed day-by-day programme on the package page.
        </p>
      )}

      {value.map((d, i) => (
        <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-1 ring-sky-500/20 px-2.5 py-1 text-xs font-medium">
                {d.day || `Day ${i + 1}`}
              </span>
              <Input value={d.title} onChange={(e) => update(i, { title: e.target.value })}
                placeholder="e.g. Maasai Mara: Full-Day Game Drive" className="h-9" />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={i === 0} onClick={() => move(i, -1)}>
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8" disabled={i === value.length - 1} onClick={() => move(i, 1)}>
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500" onClick={() => remove(i)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Day Label</Label>
            <Input value={d.day} onChange={(e) => update(i, { day: e.target.value })} placeholder={`Day ${i + 1}`} className="h-9" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Description</Label>
            <Textarea value={d.description} onChange={(e) => update(i, { description: e.target.value })}
              placeholder="What happens on this day - destinations, drive times, activities and schedule..." rows={3} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5"><Utensils className="w-3 h-3" /> Meals</Label>
              <Input value={d.meals || ""} onChange={(e) => update(i, { meals: e.target.value })} placeholder="e.g. Breakfast, Lunch & Dinner" className="h-9" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5"><Hotel className="w-3 h-3" /> Accommodation</Label>
              <Input value={d.accommodation || ""} onChange={(e) => update(i, { accommodation: e.target.value })} placeholder="e.g. [Camp]" className="h-9" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ChipInput label="Activities" values={d.activities || []} onChange={(v) => update(i, { activities: v })} placeholder="e.g. Morning game drive" />
            <ChipInput label="Highlights" values={d.highlights || []} onChange={(v) => update(i, { highlights: v })} placeholder="e.g. River crossing (seasonal)" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function OptionalActivitiesEditor({ value, onChange }: {
  value: OptionalActivity[]; onChange: (v: OptionalActivity[]) => void
}) {
  const update = (i: number, patch: Partial<OptionalActivity>) => {
    onChange(value.map((a, j) => (j === i ? { ...a, ...patch } : a)))
  }
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i))
  const add = () => onChange([...value, { name: "", price: null, price_text: "" }])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Optional Activities</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add-ons guests can book at an extra cost</p>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={add}><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 italic">
          No optional activities listed.
        </p>
      )}

      {value.map((a, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_auto] gap-2 items-start">
          <Input value={a.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="e.g. Hot air balloon safari" className="h-9" />
          <Input type="number" value={a.price ?? ""} onChange={(e) => update(i, { price: e.target.value ? Number(e.target.value) : null })}
            placeholder="Price USD" className="h-9" />
          <Input value={a.price_text || ""} onChange={(e) => update(i, { price_text: e.target.value })} placeholder="On request" className="h-9" />
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 hover:text-red-500" onClick={() => remove(i)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}