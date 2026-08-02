"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { PopupConfig } from "@/lib/popups/types"

const FIELD_LABELS: Record<string, string> = {
  name: "Full Name",
  phone: "Phone / WhatsApp",
  email: "Email Address",
  country: "Country",
  destination: "Preferred Destination",
  travel_date: "Travel Date",
  budget: "Budget Per Person",
  adults: "Adults",
  children: "Children",
  message: "Message",
}

const FIELD_TYPES: Record<string, string> = {
  name: "text",
  phone: "tel",
  email: "email",
  country: "text",
  destination: "text",
  travel_date: "date",
  budget: "text",
  adults: "number",
  children: "number",
  message: "textarea",
}

interface Props {
  popupId: number
  config: PopupConfig
  variant: string
  popupName: string
  onSuccess: () => void
}

export function LeadForm({ popupId, config, variant, popupName, onSuccess }: Props) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle")
  const [error, setError] = useState("")

  const fields = config.leadForm.fields

  function update(field: string, value: string) {
    setValues((v) => ({ ...v, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (config.leadForm.emailRequired && !values.email?.trim()) {
      setError("Please enter your email")
      return
    }
    setStatus("sending")
    setError("")
    try {
      const res = await fetch("/api/popup/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          popup_id: popupId,
          popup_name: popupName,
          variant,
          session_id: (typeof localStorage !== "undefined" && localStorage.getItem("rsgt_session_id")) || "",
          page: window.location.pathname,
          ...values,
        }),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("done")
      onSuccess()
    } catch {
      setStatus("idle")
      setError("Something went wrong. Please try again.")
    }
  }

  if (status === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="text-4xl mb-2">🎉</div>
        <p className="font-semibold text-slate-900 dark:text-white text-sm">
          {config.leadForm.successMessage || "Thank you! We'll be in touch soon."}
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-2.5">
      {fields.map((f) => (
        <div key={f}>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
            {FIELD_LABELS[f] || f}
          </label>
          {FIELD_TYPES[f] === "textarea" ? (
            <textarea
              value={values[f] || ""}
              onChange={(e) => update(f, e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm
                outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 dark:text-white resize-none"
            />
          ) : (
            <input
              type={FIELD_TYPES[f] || "text"}
              required={f === "email" && config.leadForm.emailRequired}
              value={values[f] || ""}
              onChange={(e) => update(f, e.target.value)}
              placeholder={f === "budget" ? "e.g. $1,500 – $2,500" : ""}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm
                outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-900 dark:text-white"
            />
          )}
        </div>
      ))}
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-bold text-white shadow-md
          hover:from-amber-400 hover:to-orange-400 active:scale-[0.98] transition disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : config.leadForm.submitLabel || "Submit"}
      </button>
      <p className="text-[10px] text-center text-slate-400">
        🔒 Your details are safe. No spam, ever.
      </p>
    </form>
  )
}
