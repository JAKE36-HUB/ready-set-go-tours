"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Props {
  currentImage?: string
  onUpload: (url: string) => void
  compress?: boolean
}

const MAX_WIDTH = 1920
const MAX_BYTES_OPTIMIZED = 1.5 * 1024 * 1024

async function decodeImage(file: File): Promise<HTMLImageElement | ImageBitmap> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      /* fall through to Image decode */
    }
  }
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("decode failed"))
    img.src = URL.createObjectURL(file)
  })
}

function encodeImage(source: HTMLImageElement | ImageBitmap, file: File): Promise<Blob> {
  const w = source.width
  const h = source.height
  const scale = Math.min(1, MAX_WIDTH / w)
  const width = Math.max(1, Math.round(w * scale))
  const height = Math.max(1, Math.round(h * scale))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return Promise.reject(new Error("canvas unavailable"))
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, 0, 0, width, height)

  const isTransparent = file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp"

  const toBlob = (type: string, quality?: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality))

  return (async () => {
    const webp = await toBlob("image/webp", 0.82)
    if (webp) return webp
    if (!isTransparent) {
      const jpeg = await toBlob("image/jpeg", 0.85)
      if (jpeg) return jpeg
    }
    const png = await toBlob("image/png")
    if (png) return png
    return file
  })()
}

export default function ImageUpload({ currentImage, onUpload, compress = false }: Props) {
  const [uploading, setUploading] = useState(false)
  const [phase, setPhase] = useState<"optimize" | "upload" | null>(null)
  const [preview, setPreview] = useState(currentImage || "")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return }
    if (file.size > 5 * 1024 * 1024) { setError("Image must be under 5MB"); return }
    setError("")
    setUploading(true)

    try {
      let blob: Blob = file
      let ext = file.name.split(".").pop()?.toLowerCase() || "jpg"

      if (compress) {
        setPhase("optimize")
        const source = await decodeImage(file)
        if (source.width > MAX_WIDTH || file.size > MAX_BYTES_OPTIMIZED) {
          blob = await encodeImage(source, file)
          ext = blob.type === "image/webp" ? "webp" : blob.type === "image/jpeg" ? "jpg" : "png"
        }
      }

      setPhase("upload")
      const path = `popup_${Date.now()}.${ext}`
      const sb = getSupabase()
      const { error: uploadErr } = await sb.storage.from("popups").upload(path, blob, {
        contentType: blob.type,
        cacheControl: "31536000",
      })
      if (uploadErr) { setError(uploadErr.message); return }
      const { data: { publicUrl } } = sb.storage.from("popups").getPublicUrl(path)
      setPreview(publicUrl)
      onUpload(publicUrl)
    } catch { setError("Upload failed") } finally { setUploading(false); setPhase(null) }
  }

  function clearImage() {
    setPreview("")
    onUpload("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          {preview ? (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={clearImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
              className={cn(
                "w-full h-40 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-fuchsia-400 dark:hover:border-fuchsia-500 transition-colors flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/50",
                uploading && "opacity-50 cursor-not-allowed"
              )}>
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
                  <span className="text-xs text-slate-500">
                    {phase === "optimize" ? "Optimizing image…" : "Uploading…"}
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  <span className="text-xs text-slate-400">
                    {compress ? "Click to upload (auto-compressed to WebP, max 1920px)" : "Click to upload image (max 5MB)"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}
