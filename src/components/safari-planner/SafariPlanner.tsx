"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import { STEPS, type PlannerData, type UpdatePlannerData } from "./types"
import { getDefaultPlannerData } from "./utils"
import { StepDestinations } from "./steps/StepDestinations"
import { StepActivities } from "./steps/StepActivities"
import { StepAccommodation } from "./steps/StepAccommodation"
import { StepDatesGroup } from "./steps/StepDatesGroup"
import { StepContact } from "./steps/StepContact"
import { StepQuote } from "./steps/StepQuote"

export function SafariPlanner() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<PlannerData>(getDefaultPlannerData())

  const update: UpdatePlannerData = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const reset = () => {
    setData(getDefaultPlannerData())
    setStep(0)
  }

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-500/15 text-emerald-300 text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ring-1 ring-emerald-500/20 mb-5">
            <Compass className="size-3.5" />
            Build Your Safari
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Create Your{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Dream Itinerary
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-xl mx-auto mt-4">
            Select destinations, activities, and preferences — then download your personalized PDF itinerary.
          </p>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 sm:p-10 ring-1 ring-white/10">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-white/15 text-white ring-2 ring-emerald-400" : "bg-white/5 text-white/30"
                  )}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn("text-[10px] mt-1 hidden sm:block whitespace-nowrap transition-colors", i === step ? "text-emerald-300" : "text-white/30")}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("w-6 sm:w-12 h-px mx-1 sm:mx-2 transition-colors", i < step ? "bg-emerald-500/50" : "bg-white/10")} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepDestinations
                key="destinations"
                value={data.destinations}
                onChange={(v) => update("destinations", v)}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <StepActivities
                key="activities"
                value={data.activities}
                onChange={(v) => update("activities", v)}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <StepAccommodation
                key="accommodation"
                value={data.accommodation}
                onChange={(v) => update("accommodation", v)}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepDatesGroup
                key="dates"
                data={data}
                update={update}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && (
              <StepContact
                key="contact"
                data={data}
                update={update}
                onNext={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            )}
            {step === 5 && (
              <StepQuote
                key="quote"
                data={data}
                onBack={() => setStep(4)}
                onReset={reset}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
