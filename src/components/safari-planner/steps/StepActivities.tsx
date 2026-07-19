"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, X, Lightbulb } from "lucide-react"
import { ACTIVITY_CATEGORIES } from "../types"

export function StepActivities({
  value, onChange, onNext, onBack,
}: {
  value: string[]
  onChange: (v: string[]) => void
  onNext: () => void
  onBack: () => void
}) {
  const [input, setInput] = useState("")

  const addActivity = () => {
    const name = input.trim()
    if (!name || value.includes(name)) return
    onChange([...value, name])
    setInput("")
  }

  const removeActivity = (name: string) => {
    onChange(value.filter((a) => a !== name))
  }

  const suggest = (name: string) => {
    if (!value.includes(name)) onChange([...value, name])
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">What Do You Want to Do?</h3>
      <p className="text-white/40 text-sm mb-6">Type in any activities you&apos;re interested in</p>

      <div className="mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addActivity() }}
            placeholder="e.g. Hot air balloon safari, Maasai village visit..."
            className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 transition-all"
          />
          <button
            type="button"
            onClick={addActivity}
            disabled={!input.trim()}
            className="h-11 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Your Activities ({value.length})</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((a) => (
              <span key={a} className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30">
                {a}
                <button type="button" onClick={() => removeActivity(a)} className="hover:text-white transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Suggestions
        </h4>
        <div className="flex flex-wrap gap-2">
          {ACTIVITY_CATEGORIES.map((act) => {
            const added = value.includes(act.value)
            return (
              <button
                key={act.value}
                type="button"
                onClick={() => suggest(act.value)}
                className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all ${
                  added
                    ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 ring-1 ring-white/10"
                }`}
              >
                <span>{act.icon}</span>
                {act.value}
                {added && <span className="text-[10px] text-emerald-400 ml-0.5">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button type="button" onClick={onBack} className="text-sm text-white/40 hover:text-white/70 transition-colors">
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={value.length === 0}
          className="h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all"
        >
          {value.length > 0 ? `Next (${value.length})` : "Add at least one activity"}
        </button>
      </div>
    </motion.div>
  )
}
