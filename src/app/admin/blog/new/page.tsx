"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X, Save, FileText, ImageIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()
}

function ArrayInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("")
  const add = () => {
    const val = input.trim()
    if (val && !values.includes(val)) { onChange([...values, val]); setInput("") }
  }
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }} />
        <Button type="button" variant="outline" onClick={add} size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {v}<button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))} className="hover:text-red-500"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: [] as string[], image: "", author: "", date: "", category: "",
  })

  const handleTitleChange = useCallback((title: string) => {
    setForm((prev) => ({ ...prev, title, slug: slugify(title) }))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.slug) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) { router.push("/admin/blog"); router.refresh() }
      else { const err = await res.json(); alert(err.error || "Failed to create post") }
    } catch { alert("Network error") }
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-500 to-indigo-400 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <button onClick={() => router.push("/admin/blog")} className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">New Blog Post</h1>
            <p className="text-sm text-white/80">Write a new article</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {form.image && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="aspect-video relative">
              <img src={form.image} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
            </div>
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 text-xs text-white flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" /> Preview
            </div>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-6 pt-6 pb-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Post Details</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Title, author, category, and metadata</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Title *</Label><Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="e.g. Best Time to Visit Masai Mara" required /></div>
              <div className="space-y-2"><Label>Slug *</Label><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Author</Label><Input value={form.author} onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))} placeholder="Author name" /></div>
              <div className="space-y-2"><Label>Date</Label><Input value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} placeholder="e.g. Jan 15, 2026" /></div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v ?? "" }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="safari">Safari</SelectItem>
                    <SelectItem value="travel-tips">Travel Tips</SelectItem>
                    <SelectItem value="destination">Destination</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Image URL</Label><Input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))} placeholder="Brief summary of the post..." rows={2} /></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-6 pt-6 pb-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Content</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 ml-9">Paragraphs of the blog post</p>
          </div>
          <div className="p-6">
            <ArrayInput label="Content Paragraphs" values={form.content} onChange={(v) => setForm((p) => ({ ...p, content: v }))} placeholder="Enter a paragraph..." />
          </div>
        </div>

        <div className="flex justify-end gap-3 pb-8">
          <Button variant="outline" onClick={() => router.push("/admin/blog")} className="border-slate-200 dark:border-slate-700">Cancel</Button>
          <Button type="submit" disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white border-0 hover:shadow-lg hover:shadow-blue-500/20">
            <Save className="w-4 h-4 mr-1.5" />{saving ? "Saving..." : "Publish Post"}
          </Button>
        </div>
      </form>
    </div>
  )
}
