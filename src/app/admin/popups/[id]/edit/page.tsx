"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Megaphone } from "lucide-react"
import { PopupForm } from "@/components/admin/PopupForm"
import { configFromRecord, type PopupConfig } from "@/lib/popups/types"

function Skeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="h-28 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 animate-pulse" />
      <div className="space-y-4">{[...Array(3)].map((_, i) => (<div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />))}</div>
    </div>
  )
}

export default function EditPopupPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<PopupConfig | null>(null)
  const [variantOf, setVariantOf] = useState<number | null>(null)
  const [trafficSplit, setTrafficSplit] = useState<number | null>(null)
  const [allPopups, setAllPopups] = useState<{ id: number; title: string }[]>([])
  const [name, setName] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const [res, listRes] = await Promise.all([
          fetch(`/api/admin/popups/${params.id}`),
          fetch("/api/admin/popups"),
        ])
        const json = await res.json()
        const list = await listRes.json()
        setAllPopups((list.data || []).map((p: { id: number; title: string }) => ({ id: p.id, title: p.title })))
        if (json.data) {
          const d = json.data
          setConfig(configFromRecord(d))
          setVariantOf(d.variant_of || null)
          setTrafficSplit(d.traffic_split ?? null)
          setName(d.title || "")
        }
      } catch {} finally { setLoading(false) }
    }
    load()
  }, [params.id])

  if (loading) return <Skeleton />

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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Popup</h2>
            <p className="text-xs text-slate-500">{name}</p>
          </div>
        </div>
      </motion.div>

      {config && (
        <PopupForm
          popupId={Number(params.id)}
          initialConfig={config}
          initialVariantOf={variantOf}
          initialTrafficSplit={trafficSplit}
          allPopups={allPopups}
        />
      )}
    </div>
  )
}
