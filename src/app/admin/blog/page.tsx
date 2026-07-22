"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, ExternalLink, Calendar, User, FileText } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  image: string
  author: string
  date: string
  category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  safari: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "travel-tips": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  destination: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  culture: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  news: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
}

export default function BlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("blog_posts").select("*").order("created_at", { ascending: false })
      if (data) setPosts(data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this post?")) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Blog Posts</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{posts.length} posts</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/blog/new")}
          className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white border-0 hover:shadow-lg hover:shadow-blue-500/25 transition-all h-9">
          <Plus className="w-4 h-4 mr-1.5" />
          New Post
        </Button>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-40 sm:h-auto bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 p-5 space-y-3">
                  <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-slate-900 dark:text-white">No blog posts yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">Write your first article to engage visitors</p>
          <Button onClick={() => router.push("/admin/blog/new")}
            className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white border-0">
            <Plus className="w-4 h-4 mr-1.5" /> New Post
          </Button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {posts.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200">
              <div className="flex flex-col sm:flex-row">
                {post.image ? (
                  <div className="sm:w-48 shrink-0 overflow-hidden">
                    <img src={post.image} alt={post.title}
                      className="w-full h-40 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="sm:w-48 shrink-0 h-40 sm:h-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {post.category && (
                        <Badge className={cn("text-xs font-medium", CATEGORY_COLORS[post.category] || "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400")}>
                          {post.category.replace("-", " ")}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {post.author && (
                        <span className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <User className="w-3 h-3" />
                          </div>
                          {post.author}
                        </span>
                      )}
                      {post.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{post.date}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/travel-guide/${post.slug}`, "_blank")}
                        className="hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-600" aria-label="View">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/blog/${post.id}/edit`)}
                        className="hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600" aria-label="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" aria-label="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
