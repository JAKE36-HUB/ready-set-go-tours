"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Lightbulb, Home } from "lucide-react"
import { ACTIVITY_CATEGORIES, ACCOMMODATION_TIERS } from "../types"
import { cn } from "@/lib/utils"

export function StepExperiences({
  activities,
  onActivitiesChange,
  accommodation,
  onAccommodationChange,
  onNext,
  onBack,
}: {
  activities: string[]
  onActivitiesChange: (v: string[]) => void
  accommodation: string
  onAccommodationChange: (v: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const [input, setInput] = useState("")

  const addActivity = () => {
    const name = input.trim()
    if (!name || activities.includes(name)) return
    onActivitiesChange([...activities, name])
    setInput("")
  }

  const removeActivity = (name: string) => {
    onActivitiesChange(activities.filter((a) => a !== name))
  }

  const suggest = (name: string) => {
    if (!activities.includes(name)) onActivitiesChange([...activities, name])
  }

  const applyTier = (tier: string) => {
    onAccommodationChange(tier)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">What Do You Want to Do & How Do You Want to Stay?</h3>
      <p className="text-white/40 text-sm mb-6">Select your activities and preferred style — or skip ahead, we&apos;ll suggest options</p>

      {/* Activities */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Activities
        </h4>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addActivity() }}
            placeholder="e.g. Hot air balloon safari, Maasai village visit..."
            className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-all"
            aria-label="Add an activity"
          />
          <button
            type="button"
            onClick={addActivity}
            disabled={!input.trim()}
            className="h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-semibold transition-all"
          >
            Add
          </button>
        </div>

        {activities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {activities.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30">
                  {a}
                  <button type="button" onClick={() => removeActivity(a)} className="hover:text-white transition-colors" aria-label={`Remove ${a}`}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Popular Activities
        </h4>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_CATEGORIES.map((act) => {
            const added = activities.includes(act.value)
            return (
              <button
                key={act.value}
                type="button"
                onClick={() => suggest(act.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all",
                  added
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 ring-1 ring-white/10"
                )}
              >
                <span>{act.icon}</span>
                {act.value}
                {added && <span className="text-[10px] text-emerald-400 ml-0.5">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Accommodation */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          Accommodation Style <span className="text-white/30 normal-case tracking-normal">(optional)</span>
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {ACCOMMODATION_TIERS.map((tier) => (
            <button
              key={tier.value}
              type="button"
              onClick={() => applyTier(tier.label + " - " + tier.desc)}
              className={cn(
                "relative p-4 rounded-2xl border text-left transition-all duration-200",
                accommodation.toLowerCase().includes(tier.label.toLowerCase())
                  ? "bg-emerald-500/15 border-emerald-400/50 ring-1 ring-emerald-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{tier.icon}</span>
                <div>
                  <h5 className="text-sm font-bold text-white">{tier.label}</h5>
                  <p className="text-xs text-white/40 mt-0.5">{tier.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30">Price index</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4].map((dot) => (
                    <div key={dot} className={cn("w-2 h-2 rounded-full", dot <= ACCOMMODATION_TIERS.indexOf(tier) + 1 ? "bg-emerald-400" : "bg-white/10")} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3">Not sure? Leave it blank — we&apos;ll tailor options to your budget.</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button type="button" onClick={onBack} className="text-sm text-white/40 hover:text-white/70 transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all"
        >
          Continue
        </button>
      </div>
    </motion.div>
  )
}