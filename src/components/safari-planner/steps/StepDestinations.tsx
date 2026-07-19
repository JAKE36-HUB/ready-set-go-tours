"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Star, Clock, Plus, X, Search } from "lucide-react"
import { DESTINATIONS } from "@/lib/constants"
import type { DestinationSelection } from "../types"
import { cn } from "@/lib/utils"

let customIdCounter = 1000

export function StepDestinations({
  value, onChange, onNext,
}: {
  value: DestinationSelection[]
  onChange: (v: DestinationSelection[]) => void
  onNext: () => void
}) {
  const [customInput, setCustomInput] = useState("")

  const toggle = (dest: (typeof DESTINATIONS.kenya)[0], country: "kenya" | "tanzania") => {
    const exists = value.find((d) => d.id === dest.id)
    if (exists) {
      onChange(value.filter((d) => d.id !== dest.id))
    } else {
      onChange([...value, { id: dest.id, name: dest.name, country }])
    }
  }

  const addCustom = () => {
    const name = customInput.trim()
    if (!name) return
    const exists = value.some((d) => d.name.toLowerCase() === name.toLowerCase())
    if (exists) return
    onChange([...value, { id: customIdCounter++, name, country: "other", custom: true }])
    setCustomInput("")
  }

  const removeCustom = (id: number) => {
    onChange(value.filter((d) => d.id !== id))
  }

  const renderDest = (dest: (typeof DESTINATIONS.kenya)[0], country: "kenya" | "tanzania") => {
    const selected = value.some((d) => d.id === dest.id)
    return (
      <button
        key={dest.id}
        type="button"
        onClick={() => toggle(dest, country)}
        className={cn(
          "relative text-left p-4 rounded-2xl border transition-all duration-200 w-full",
          selected
            ? "bg-emerald-500/15 border-emerald-400/50 ring-1 ring-emerald-400/30"
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{dest.name}</h4>
            <p className="text-xs text-white/40 mt-0.5 line-clamp-1">{dest.description.slice(0, 80)}...</p>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-white/30">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{dest.duration}</span>
              <span className="flex items-center gap-1"><Star className="w-3 h-3" />{dest.rating}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{dest.bestTime}</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 whitespace-nowrap">${dest.startingPrice}</span>
        </div>
      </button>
    )
  }

  const customDests = value.filter((d) => d.custom)

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">Where Do You Want to Go?</h3>
      <p className="text-white/40 text-sm mb-6">Pick from our featured destinations or type in your own</p>

      {/* Custom destination input */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-emerald-400" />
          Add a Custom Destination
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCustom() }}
            placeholder="e.g. Lake Natron, Amboseli, Zanzibar..."
            className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-all"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!customInput.trim()}
            className="h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Custom destinations chips */}
      {customDests.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Your Custom Places</h4>
          <div className="flex flex-wrap gap-2">
            {customDests.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30"
              >
                {d.name}
                <button type="button" onClick={() => removeCustom(d.id)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Kenya — Popular Destinations
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {DESTINATIONS.kenya.map((d) => renderDest(d, "kenya"))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Tanzania — Popular Destinations
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {DESTINATIONS.tanzania.map((d) => renderDest(d, "tanzania"))}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-xs text-white/40">{value.length} destination{value.length > 1 ? "s" : ""} selected</span>
          <button
            type="button"
            onClick={onNext}
            className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all"
          >
            Next Step
          </button>
        </div>
      )}
    </motion.div>
  )
}
