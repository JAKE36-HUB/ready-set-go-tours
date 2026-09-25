"use client"

import { motion } from "framer-motion"
import { Calendar, Users, Minus, Plus } from "lucide-react"
import type { PlannerData, UpdatePlannerData } from "../types"

export function StepDatesGroup({
  data, update, onNext, onBack,
}: {
  data: PlannerData
  update: UpdatePlannerData
  onNext: () => void
  onBack: () => void
}) {
  const valid = data.startDate && data.endDate && data.adults > 0

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">When & Who?</h3>
      <p className="text-white/40 text-sm mb-6">Tell us about your travel dates and group</p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Arrival Date *
          </label>
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Departure Date *
          </label>
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Adults *
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("adults", Math.max(1, data.adults - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Decrease adults"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-xl font-bold text-white tabular-nums">{data.adults}</span>
            <button
              type="button"
              onClick={() => update("adults", Math.min(20, data.adults + 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Increase adults"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Children (2-12 yrs)
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update("children", Math.max(0, data.children - 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Decrease children"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-xl font-bold text-white tabular-nums">{data.children}</span>
            <button
              type="button"
              onClick={() => update("children", Math.min(10, data.children + 1))}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Increase children"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button type="button" onClick={onBack} className="text-sm text-white/40 hover:text-white/70 transition-colors">Back</button>
        <button
          type="button"
          onClick={onNext}
          disabled={!valid}
          className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {valid ? "Next Step" : "Select dates to continue"}
        </button>
      </div>
    </motion.div>
  )
}
