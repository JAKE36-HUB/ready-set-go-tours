"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, ExternalLink } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

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
    } catch { } finally { setLoading(false) }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Gallery</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{images.length} images</p>
        </div>
        <Button onClick={() => router.push("/admin/gallery/new")}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Image
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">No images yet. Click "Add Image" to upload one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catImages = images.filter((img) => img.category === cat)
            return (
              <div key={cat}>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white capitalize mb-3">{cat}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {catImages.map((img) => (
                    <div key={img.id} className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/3]">
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image" }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button onClick={() => window.open(img.src, "_blank")} className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                          <ExternalLink className="w-4 h-4 text-white" />
                        </button>
                        <button onClick={() => handleDelete(img.id)} disabled={deleting === img.id} className="w-8 h-8 rounded-lg bg-red-500/60 backdrop-blur flex items-center justify-center hover:bg-red-500/80 transition-colors">
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white truncate">{img.alt || "No description"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
