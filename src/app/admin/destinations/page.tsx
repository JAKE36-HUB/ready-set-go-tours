"use client"

import { Construction } from "lucide-react"

export default function DestinationsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Construction className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Destinations</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        Destination management coming soon. You can edit destinations from the frontend pages for now.
      </p>
    </div>
  )
}
