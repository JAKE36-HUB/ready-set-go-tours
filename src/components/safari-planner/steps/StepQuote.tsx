"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  CheckCircle2, Send, Loader2, ExternalLink,
  MapPin, Sun, Users, Home, Car, UserCheck,
} from "lucide-react"
import { COMPANY } from "@/lib/constants"
import PdfItinerary from "@/components/PdfItinerary"
import type { PlannerData } from "../types"
import { getMatchingPackage } from "../utils"

function destStr(data: PlannerData) {
  return data.destinations.map((d) => d.name).join(", ") || "Selected Destinations"
}

function dayCount(data: PlannerData) {
  if (data.startDate && data.endDate) {
    const diff = new Date(data.endDate).getTime() - new Date(data.startDate).getTime()
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1)
  }
  return "-"
}

export function StepQuote({
  data, onBack, onReset,
}: {
  data: PlannerData
  onBack: () => void
  onReset: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pkg = getMatchingPackage(data)

  const days = dayCount(data)
  const destinations = destStr(data)
  const accommodation = data.accommodation || "To be confirmed"

  const itineraryData = {
    name: `Custom Safari Itinerary — ${destinations}`,
    description: `A personalized safari crafted for ${data.fullName}. ${data.destinations.length} destination(s), ${data.activities.length} activities.`,
    duration: days !== "-" ? `${days} Days / ${days - 1} Nights` : "To be confirmed",
    accommodation,
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    highlights: [
      `Explore ${destinations}`,
      `${data.activities.slice(0, 4).join(", ")}${data.activities.length > 4 ? " & more" : ""}`,
      `Private English-speaking driver-guide`,
      `All park fees & taxes included`,
    ],
    activities: data.activities,
    included: pkg?.included || [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Full board accommodation",
      "Game drives as outlined",
      "Park entrance fees",
      "Bottled drinking water during game drives",
    ],
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const emailjs = await import("@emailjs/browser")
      await emailjs.default.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: COMPANY.email,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || "Not provided",
          country: data.country || "Not provided",
          destinations,
          activities: data.activities.join(", "),
          accommodation,
          travelDates: `${data.startDate} to ${data.endDate}`,
          guests: `${data.adults} adults, ${data.children} children`,
          notes: data.notes || "None",
          source: "Safari Itinerary Builder",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setSubmitted(true)
    } catch {
      setError("Failed to send. Please try again or contact us directly.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Your Itinerary is Ready!</h3>
        <p className="text-white/60 max-w-md mx-auto mb-2">
          Thank you, <span className="text-white font-semibold">{data.fullName}</span>! Your custom safari plan has been sent to our team. We&apos;ll review and respond within 24 hours.
        </p>
        <p className="text-white/40 text-sm mb-6">A confirmation has been sent to <span className="text-emerald-400">{data.email}</span></p>
        <div className="flex flex-wrap justify-center gap-3">
          <PdfItinerary data={itineraryData} buttonLabel="Download PDF Itinerary" />
          <a
            href={`https://wa.me/${COMPANY.whatsapp}?text=Hi!%20I%20just%20submitted%20my%20safari%20planner%20request.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Chat on WhatsApp
          </a>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm transition-all"
          >
            Start Over
          </button>
        </div>
      </motion.div>
    )
  }

  const lines = [
    { icon: MapPin, label: "Destinations", value: destinations },
    { icon: Sun, label: "Duration", value: days !== "-" ? `${days} days` : "To be confirmed" },
    { icon: Home, label: "Accommodation", value: accommodation },
    { icon: Users, label: "Guests", value: `${data.adults} adults${data.children ? `, ${data.children} children` : ""}` },
    { icon: Car, label: "Transport", value: "Private 4x4 Land Cruiser" },
    { icon: UserCheck, label: "Guide", value: "Professional driver-guide" },
  ]

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <h3 className="text-xl font-bold text-white mb-1">Your Safari Itinerary</h3>
      <p className="text-white/40 text-sm mb-6">Review your custom itinerary before sending</p>

      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
          <h4 className="text-sm font-semibold text-white mb-4">Trip Summary</h4>
          <div className="space-y-3">
            {lines.map((line) => (
              <div key={line.label} className="flex items-center gap-3 text-sm">
                <line.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white/50 min-w-[100px]">{line.label}</span>
                <span className="text-white font-medium">{line.value}</span>
              </div>
            ))}
          </div>
        </div>

        {data.activities.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
            <h4 className="text-sm font-semibold text-white mb-3">Selected Activities ({data.activities.length})</h4>
            <div className="flex flex-wrap gap-2">
              {data.activities.map((a) => (
                <span key={a} className="text-xs bg-white/10 text-white/70 px-3 py-1.5 rounded-full">{a}</span>
              ))}
            </div>
          </div>
        )}

        {data.notes && (
          <div className="bg-white/5 rounded-2xl p-5 ring-1 ring-white/10">
            <h4 className="text-sm font-semibold text-white mb-2">Special Requests</h4>
            <p className="text-sm text-white/60">{data.notes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <PdfItinerary data={itineraryData} buttonLabel="Download PDF Draft" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-4 py-2.5 mt-4 ring-1 ring-red-500/20">{error}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
        <button type="button" onClick={onBack} className="text-sm text-white/40 hover:text-white/70 transition-colors">Back</button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-semibold shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {submitting ? "Sending..." : "Send My Itinerary"}
        </button>
      </div>
    </motion.div>
  )
}
