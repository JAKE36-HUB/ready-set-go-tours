"use client"

import { motion } from "framer-motion"
import type { PlannerData, UpdatePlannerData } from "../types"

export function StepContact({
  data, update, onNext, onBack,
}: {
  data: PlannerData
  update: UpdatePlannerData
  onNext: () => void
  onBack: () => void
}) {
  const valid = data.fullName.length >= 2 && data.email.includes("@") && data.phone.length >= 7

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">Almost There!</h3>
      <p className="text-white/40 text-sm mb-6">Enter your details so we can send your custom itinerary</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Full Name *</label>
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="John Smith"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Email Address *</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="john@example.com"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Phone Number *</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+1 234 567 890"
              className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Country of Residence</label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="United States"
            className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-white/50 mb-1.5 block">Special Requests (optional)</label>
          <textarea
            value={data.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any specific requirements, dietary needs, or preferences..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 text-sm resize-none"
          />
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
          {valid ? "Get My Quote" : "Fill required fields"}
        </button>
      </div>
    </motion.div>
  )
}
