"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, ExternalLink, Images, Edit } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const CATEGORY_COLORS: Record<string, string> = {
  safari: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  landscape: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  wildlife: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  beach: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  culture: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  accommodation: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
  width: number
  height: number
}

export default function GalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("gallery").select("*").order("created_at", { ascending: false })
      if (data) setImages(data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Delete this image?")) return
    setDeleting(id)
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
    if (res.ok) setImages((prev) => prev.filter((img) => img.id !== id))
    setDeleting(null)
  }

  const categories = [...new Set(images.map((img) => img.category))]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Images className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Gallery</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{images.length} images</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/gallery/new")}
          className="bg-gradient-to-r from-purple-500 to-violet-400 text-white border-0 hover:shadow-lg hover:shadow-purple-500/25 transition-all h-9">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Image
        </Button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Images className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">No images yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Add stunning photos to showcase your tours</p>
          <Button onClick={() => router.push("/admin/gallery/new")}
            className="bg-gradient-to-r from-purple-500 to-violet-400 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" /> Add Image
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {categories.map((cat) => {
            const catImages = images.filter((img) => img.category === cat)
            return (
              <motion.div key={cat} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", CATEGORY_COLORS[cat] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400")}>
                    {cat}
                  </span>
                  <span className="text-xs text-slate-400">{catImages.length} image{catImages.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {catImages.map((img, i) => (
                    <motion.div key={img.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/3] shadow-sm hover:shadow-md transition-all duration-300">
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image" }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <button onClick={() => window.open(img.src, "_blank")}
                            className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                            <ExternalLink className="w-4 h-4 text-white" />
                          </button>
                          <button onClick={() => router.push(`/admin/gallery/${img.id}/edit`)}
                            className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button onClick={() => handleDelete(img.id)} disabled={deleting === img.id}
                            className="w-8 h-8 rounded-lg bg-red-500/60 backdrop-blur-sm flex items-center justify-center hover:bg-red-500/80 transition-colors">
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-white truncate">{img.alt || "No description"}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
