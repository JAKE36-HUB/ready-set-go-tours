"use client"

import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, ExternalLink, Calendar, User } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

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

export default function BlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const { data } = await getSupabase().from("blog_posts").select("*").order("created_at", { ascending: false })
      if (data) setPosts(data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this post?")) return
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" })
    if (res.ok) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Blog Posts</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{posts.length} posts</p>
        </div>
        <Button onClick={() => router.push("/admin/blog/new")}>
          <Plus className="w-4 h-4 mr-1.5" />
          New Post
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500">
          <p className="text-sm">No blog posts yet. Click "New Post" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row">
                {post.image && (
                  <div className="sm:w-48 shrink-0">
                    <img src={post.image} alt={post.title} className="w-full h-40 sm:h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                  </div>
                )}
                <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {post.category && <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 text-xs">{post.category}</Badge>}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{post.title}</h3>
                    {post.excerpt && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{post.excerpt}</p>}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      {post.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>}
                      {post.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/travel-guide/${post.slug}`, "_blank")} aria-label="View">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/blog/${post.id}/edit`)} aria-label="Edit">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} aria-label="Delete" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
