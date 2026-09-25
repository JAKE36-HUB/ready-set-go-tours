"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ACCOMMODATION_TIERS } from "../types"
import { cn } from "@/lib/utils"

export function StepAccommodation({
  value, onChange, onNext, onBack,
}: {
  value: string
  onChange: (v: string) => void
  onNext: () => void
  onBack: () => void
}) {
  const [input, setInput] = useState(value)

  const applySuggestion = (tier: string) => {
    setInput(tier)
    onChange(tier)
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">Describe Your Ideal Stay</h3>
      <p className="text-white/40 text-sm mb-6">Tell us what kind of accommodation you&apos;re looking for</p>

      <div className="mb-6">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); onChange(e.target.value) }}
          placeholder="Describe your ideal accommodation — e.g. 'A luxury tented camp in the Mara with river views' or 'Budget-friendly lodge near the park gate'..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-all resize-none"
          aria-label="Describe your ideal accommodation"
        />
      </div>

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Need inspiration? Here are popular options:
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {ACCOMMODATION_TIERS.map((tier) => (
            <button
              key={tier.value}
              type="button"
              onClick={() => applySuggestion(tier.label + " - " + tier.desc)}
              className={cn(
                "relative p-4 rounded-2xl border text-left transition-all duration-200",
                input.toLowerCase().includes(tier.label.toLowerCase())
                  ? "bg-emerald-500/15 border-emerald-400/50 ring-1 ring-emerald-400/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl">{tier.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{tier.label}</h4>
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
        <p className="text-xs text-white/30 mt-3">Click an option to fill it in, or type your own description above.</p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button type="button" onClick={onBack} className="text-sm text-white/40 hover:text-white/70 transition-colors">Back</button>
        <button
          type="button"
          onClick={onNext}
          disabled={!input.trim()}
          className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all"
        >
          Next Step
        </button>
      </div>
    </motion.div>
  )
}
