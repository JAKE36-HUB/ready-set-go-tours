"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Megaphone } from "lucide-react"
import { PopupForm } from "@/components/admin/PopupForm"

export default function NewPopupPage() {
  const router = useRouter()
  const [allPopups, setAllPopups] = useState<{ id: number; title: string }[]>([])

  useEffect(() => {
    fetch("/api/admin/popups")
      .then((r) => r.json())
      .then((j) => setAllPopups((j.data || []).map((p: any) => ({ id: p.id, title: p.title }))))
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-400 flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Popup Campaign</h2>
            <p className="text-xs text-slate-500">Pick a template, then fine-tune targeting, CTAs and frequency</p>
          </div>
        </div>
      </motion.div>

      <PopupForm allPopups={allPopups} />
    </div>
  )
}
