"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  MessagesSquare,
  Send,
  Loader2,
  Bot,
  User,
  Globe,
  Clock,
  Repeat,
  ArrowLeft,
  Search,
  Mail,
  Copy,
  Check,
  Inbox,
  Sparkles,
  Pencil,
  Tag,
  Trash2,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSessionSummary {
  session_id: string
  visitor_name: string
  visitor_email: string
  page: string
  label: string
  ai_active: boolean
  last_message_at: string
  created_at: string
  last_preview: { role: string; content: string; created_at: string } | null
  unread: number
  total_unread: number
}

interface ChatMessage {
  id: number
  session_id: string
  role: string
  content: string
  created_at: string
}

type Filter = "all" | "unread" | "manual"

const AVATAR_GRADIENTS = [
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-fuchsia-500 to-pink-400",
  "from-amber-500 to-orange-400",
  "from-violet-500 to-purple-400",
  "from-rose-500 to-red-400",
]

const SUGGESTIONS = [
  "Thanks for reaching out! How can we help?",
  "Can you share your email so we can follow up with options?",
  "Best value is our group safari from $650 per person.",
  "Would you prefer a quick call or WhatsApp to plan details?",
  "Let me check availability and get back to you shortly.",
]

function gradientFor(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length]
}

function displayName(s: { label: string; visitor_name: string }) {
  return s.label.trim() || s.visitor_name || "Website visitor"
}

function initials(name: string, email: string) {
  const src = (name || email || "Web").replace(/[^a-zA-Z0-9 ]/g, "").trim()
  const parts = src.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (src.slice(0, 2) || "??").toUpperCase()
}

function timeAgo(date: string) {
  const sec = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (sec < 60) return "just now"
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const days = Math.floor(hr / 24)
  return `${days}d ago`
}

function timeShort(date: string) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function dayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  if (sameDay(d, today)) return "Today"
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (sameDay(d, yesterday)) return "Yesterday"
  return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })
}

function requestNotificationPermission() {
  try {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  } catch {}
}

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "manual", label: "Manual" },
]

export default function AdminChat() {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState(false)
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const renameRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const seenUnreadRef = useRef<Map<string, number>>(new Map())

  const selected = sessions.find((s) => s.session_id === selectedId) || null

  const loadSessions = useCallback(async (silent = false) => {
    if (!silent) setLoadingSessions(true)
    try {
      const res = await fetch("/api/admin/chat/sessions", { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.sessions)) {
        setSessions(data.sessions)
        for (const s of data.sessions as ChatSessionSummary[]) {
          const prev = seenUnreadRef.current.get(s.session_id) || 0
          if (s.unread > 0 && s.session_id !== selectedId && s.unread > prev) {
            try {
              if ("Notification" in window && Notification.permission === "granted" && document.visibilityState === "visible") {
                new Notification(`New chat from ${s.visitor_name || "a website visitor"}`, {
                  body: (s.last_preview?.content || "").slice(0, 90),
                })
              }
            } catch {}
          }
          seenUnreadRef.current.set(s.session_id, s.unread)
        }
      }
    } catch {
    } finally {
      if (!silent) setLoadingSessions(false)
    }
  }, [selectedId])

  const loadMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetch(`/api/admin/chat/messages?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.messages)) {
        setMessages(data.messages)
        seenUnreadRef.current.set(sessionId, 0)
      }
    } catch {
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    requestNotificationPermission()
    loadSessions()
    const s = setInterval(() => loadSessions(true), 8000)
    return () => clearInterval(s)
  }, [loadSessions])

  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      return
    }
    loadMessages(selectedId)
    const m = setInterval(() => loadMessages(selectedId), 4000)
    return () => clearInterval(m)
  }, [selectedId, loadMessages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, selectedId])

  const handleSelect = (id: string) => {
    setSelectedId(id)
    setCopied(false)
  }

  const startRename = (s: ChatSessionSummary) => {
    setEditingId(s.session_id)
    setEditLabel(s.label || "")
    window.setTimeout(() => {
      renameRef.current?.focus()
      renameRef.current?.select()
    }, 0)
  }

  const saveRename = async () => {
    if (!editingId) return
    const target = editingId
    setBusyId(target)
    try {
      const res = await fetch(`/api/admin/chat/sessions/${encodeURIComponent(target)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: editLabel.trim() }),
      })
      if (res.ok) await loadSessions(true)
    } catch {
    } finally {
      setEditingId(null)
      setEditLabel("")
      setBusyId(null)
    }
  }

  const handleDelete = async (s: ChatSessionSummary) => {
    const name = displayName(s)
    const ok = window.confirm(`Delete the conversation with ${name}?\n\nThis permanently removes all messages in this chat. The CRM lead (if any) is kept.`)
    if (!ok) return
    setBusyId(s.session_id)
    try {
      const res = await fetch(`/api/admin/chat/sessions/${encodeURIComponent(s.session_id)}`, { method: "DELETE" })
      if (res.ok) {
        if (selectedId === s.session_id) setSelectedId(null)
        loadSessions(true)
      }
    } catch {
    } finally {
      setBusyId(null)
    }
  }

  const handleSend = async () => {
    const content = draft.trim()
    if (!content || !selectedId || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: selectedId, content }),
      })
      if (!res.ok) {
        setError("Failed to send. Please try again.")
        return
      }
      const data = await res.json()
      setMessages((prev) => [...prev, data.message])
      setDraft("")
      loadSessions(true)
    } catch {
      setError("Failed to send. Please try again.")
    } finally {
      setSending(false)
    }
  }

  const toggleAi = async () => {
    if (!selectedId) return
    try {
      await fetch("/api/admin/chat/takeover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: selectedId, ai_active: !selected?.ai_active }),
      })
      loadSessions(true)
    } catch {}
  }

  const copyEmail = async () => {
    if (!selected?.visitor_email) return
    try {
      await navigator.clipboard.writeText(selected.visitor_email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const unreadTotal = sessions.reduce((acc, s) => acc + s.unread, 0)
  const manualCount = sessions.filter((s) => !s.ai_active).length
  const unreadCount = sessions.filter((s) => s.unread > 0).length

  const filteredSessions = sessions
    .filter((s) => {
      if (filter === "unread" && s.unread === 0) return false
      if (filter === "manual" && s.ai_active) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const hay = `${s.label} ${s.visitor_name} ${s.visitor_email} ${s.page}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    .slice(0, 100)

  let prevDay = ""

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Chat</h2>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            AI answers instantly; your replies take over the conversation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadTotal > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {unreadTotal} unread
            </span>
          )}
          {manualCount > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 px-3 py-1.5 rounded-full ring-1 ring-sky-500/30">
              <Bot className="w-3 h-3" />
              {manualCount} manual
            </span>
          )}
          <button
            onClick={() => loadSessions()}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:ring-sky-300 dark:hover:ring-sky-700 transition-all"
          >
            <Repeat className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 rounded-xl px-4 py-2.5 mb-4 ring-1 ring-red-500/20">{error}</p>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(300px,360px)_1fr] gap-4">
        {/* Session list */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden flex flex-col min-h-0">
          <div className="px-4 pt-3.5 pb-3 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessagesSquare className="w-4 h-4 text-sky-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Conversations {sessions.length > 0 && `(${sessions.length})`}
                </span>
              </div>
              {search && (
                <button onClick={() => setSearch("")} className="text-[10px] font-medium text-sky-500 hover:text-sky-600">
                  Clear
                </button>
              )}
            </div>
            <div className="relative mb-2.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or page..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 border-0 transition-shadow"
              />
            </div>
            <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
              {FILTER_TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFilter(t.value)}
                  className={cn(
                    "flex-1 h-7 rounded-lg text-[11px] font-semibold transition-all",
                    filter === t.value
                      ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  )}
                >
                  {t.label}
                  {t.value === "unread" && unreadCount > 0 && ` (${unreadCount})`}
                  {t.value === "manual" && manualCount > 0 && ` (${manualCount})`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto [scrollbar-width:thin]">
            {loadingSessions && sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-xs">Loading conversations...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <Inbox className="w-8 h-8 opacity-40" />
                <p className="text-sm">{sessions.length === 0 ? "No conversations yet" : "No matching conversations"}</p>
                <p className="text-xs text-slate-400/70 px-6 text-center">
                  {sessions.length === 0
                    ? "When a visitor starts chatting, their conversation appears here."
                    : "Try a different search or filter."}
                </p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const name = displayName(s)
                const avatar = initials(name, s.visitor_email || "")
                const isActive = selectedId === s.session_id
                const isEditing = editingId === s.session_id
                const isBusy = busyId === s.session_id
                return (
                  <div
                    key={s.session_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(s.session_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        handleSelect(s.session_id)
                      }
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3.5 border-b border-slate-100 dark:border-slate-800/60 transition-colors group relative",
                      isActive
                        ? "bg-sky-50 dark:bg-sky-500/10 border-l-2 border-l-sky-500"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    {isBusy && (
                      <span className="absolute right-3 top-3 z-10 flex w-6 h-6 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      {isEditing ? (
                        <span className={cn("shrink-0 w-10 h-10 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shadow-md", gradientFor(s.session_id))}>
                          <Tag className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className={cn("shrink-0 w-10 h-10 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shadow-md", gradientFor(s.session_id))}>
                          {avatar}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              ref={renameRef}
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => {
                                e.stopPropagation()
                                if (e.key === "Enter") saveRename()
                                if (e.key === "Escape") {
                                  setEditingId(null)
                                  setEditLabel("")
                                }
                              }}
                              placeholder="Name this chat..."
                              className="flex-1 h-8 min-w-0 px-2.5 rounded-lg bg-sky-50 dark:bg-slate-800 ring-2 ring-sky-500/50 text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
                            />
                            <button
                              onClick={saveRename}
                              className="shrink-0 w-7 h-7 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center"
                              aria-label="Save name"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null)
                                setEditLabel("")
                              }}
                              className="shrink-0 w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center"
                              aria-label="Cancel rename"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className={cn("text-sm font-semibold truncate", isActive ? "text-sky-700 dark:text-sky-300" : "text-slate-800 dark:text-slate-100")}>
                                {name}
                              </span>
                              {s.label.trim() && (
                                <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full ring-1 ring-violet-500/20">
                                  <Tag className="w-2.5 h-2.5" />
                                  label
                                </span>
                              )}
                              {s.unread > 0 && (
                                <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                                  {s.unread}
                                </span>
                              )}
                            </div>
                            <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(s.last_message_at)}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {s.last_preview
                            ? `${s.last_preview.role === "owner" ? "You: " : s.last_preview.role === "assistant" ? "AI: " : ""}${s.last_preview.content}`
                            : "No messages yet"}
                        </p>
                        <div className="flex items-center justify-between gap-2 mt-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                                s.ai_active
                                  ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              )}
                            >
                              {s.ai_active ? <Sparkles className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                              {s.ai_active ? "AI responding" : "Manual"}
                            </span>
                            {s.page && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 truncate">
                                <Globe className="w-2.5 h-2.5 shrink-0" />
                                {s.page.replace("/", "") || s.page}
                              </span>
                            )}
                          </div>
                          <div
                            className="hidden group-hover:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => startRename(s)}
                              className="w-7 h-7 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/10 flex items-center justify-center"
                              aria-label="Rename chat"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(s)}
                              className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center"
                              aria-label="Delete chat"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden flex flex-col min-h-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 px-6">
              <span className="flex w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 items-center justify-center">
                <MessagesSquare className="w-8 h-8 opacity-60" />
              </span>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-300">Select a conversation to view and reply</p>
              <p className="text-xs text-center max-w-xs text-slate-400/70">
                Replies you send here take over the conversation — the AI stops and the visitor sees your message as the team.
              </p>
            </div>
          ) : (
            <>
              {/* Transcript header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  onClick={() => handleSelect("")}
                  className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className={cn("shrink-0 w-10 h-10 rounded-full bg-gradient-to-br text-white text-xs font-bold flex items-center justify-center shadow-md", gradientFor(selected.session_id))}>
                  {initials(displayName(selected), selected.visitor_email || "")}
                </span>
                <div className="min-w-0 flex-1">
                  {editingId === selected.session_id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        ref={renameRef}
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename()
                          if (e.key === "Escape") {
                            setEditingId(null)
                            setEditLabel("")
                          }
                        }}
                        placeholder="Name this chat..."
                        className="flex-1 h-8 min-w-0 px-2.5 rounded-lg bg-sky-50 dark:bg-slate-800 ring-2 ring-sky-500/50 text-sm font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
                      />
                      <button
                        onClick={saveRename}
                        className="shrink-0 w-7 h-7 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center"
                        aria-label="Save name"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditLabel("")
                        }}
                        className="shrink-0 w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center"
                        aria-label="Cancel rename"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{displayName(selected)}</p>
                      {selected.label.trim() && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded-full ring-1 ring-violet-500/20">
                          <Tag className="w-2.5 h-2.5" />
                          label
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                    {selected.visitor_email ? (
                      <>
                        <span className="truncate">{selected.visitor_email}</span>
                        <button
                          onClick={copyEmail}
                          className="shrink-0 w-5 h-5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors"
                          aria-label="Copy email"
                        >
                          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </>
                    ) : (
                      <span>No email yet</span>
                    )}
                    {selected.page && (
                      <span className="flex items-center gap-1 text-slate-400 truncate">
                        <span className="mx-0.5 text-slate-300 dark:text-slate-600">·</span>
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{selected.page}</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400 shrink-0">
                      <span className="mx-0.5 text-slate-300 dark:text-slate-600">·</span>
                      <Clock className="w-3 h-3" />
                      {timeAgo(selected.last_message_at)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <button
                    onClick={() => startRename(selected)}
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-500/10 flex items-center justify-center transition-colors"
                    aria-label="Rename chat"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selected)}
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                    aria-label="Delete chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5" />
                  <span className="shrink-0 flex p-0.5 gap-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => !selected.ai_active && toggleAi()}
                    className={cn(
                      "h-7 px-3 rounded-full text-[11px] font-semibold transition-all",
                      selected.ai_active ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                  >
                    AI responding
                  </button>
                  <button
                    onClick={() => selected.ai_active && toggleAi()}
                    className={cn(
                      "h-7 px-3 rounded-full text-[11px] font-semibold transition-all",
                      !selected.ai_active ? "bg-emerald-500 text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    )}
                  >
                    Manual
                  </button>
                </span>
                </div>
              </div>

              {/* Transcript */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin] bg-gradient-to-b from-slate-50/80 via-white to-white dark:from-slate-950/50 dark:via-slate-900 dark:to-slate-950">
                {loadingMessages && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                    <Inbox className="w-8 h-8 opacity-40" />
                    <p className="text-sm">This conversation has no messages yet</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const day = dayLabel(m.created_at)
                    const showDivider = day !== prevDay
                    prevDay = day
                    const isVisitor = m.role === "user"
                    const isOwner = m.role === "owner"
                    return (
                      <div key={m.id}>
                        {showDivider && (
                          <div className="flex items-center justify-center my-4">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full ring-1 ring-slate-200/70 dark:ring-slate-700/60">
                              {day}
                            </span>
                          </div>
                        )}
                        <div className={cn("flex items-end gap-2.5 mb-3", isVisitor ? "flex-row-reverse" : "flex-row")}>
                          {isOwner && (
                            <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-emerald-500/25">
                              YOU
                            </span>
                          )}
                          {m.role === "assistant" && (
                            <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                              <Bot className="w-4 h-4" />
                            </span>
                          )}
                          <div className={cn("flex flex-col max-w-[75%]", isVisitor ? "items-end" : "items-start")}>
                            <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                              <span className="font-semibold uppercase tracking-wider">
                                {isOwner ? "You" : m.role === "assistant" ? "AI Assistant" : "Visitor"}
                              </span>
                              <span>·</span>
                              <span>{timeShort(m.created_at)}</span>
                            </div>
                            <div
                              className={cn(
                                "whitespace-pre-wrap break-words text-sm leading-relaxed px-4 py-2.5 rounded-2xl",
                                isVisitor
                                  ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25 rounded-br-sm"
                                  : isOwner
                                    ? "bg-emerald-50 dark:bg-emerald-950/70 ring-1 ring-emerald-200 dark:ring-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded-bl-sm"
                                    : "bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700/60 text-slate-700 dark:text-slate-200 shadow-sm rounded-bl-sm"
                              )}
                            >
                              {m.content}
                            </div>
                          </div>
                          {isVisitor && (
                            <span className={cn("shrink-0 w-8 h-8 rounded-full bg-gradient-to-br text-white text-[10px] font-bold flex items-center justify-center shadow-md", gradientFor(m.session_id))}>
                              {initials(displayName(selected), selected.visitor_email || "")}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Composer */}
              <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-slate-900">
                <div className="flex gap-1.5 pb-2 overflow-x-auto [scrollbar-width:none]">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setDraft(s)}
                      className="shrink-0 inline-flex items-center h-8 px-3 rounded-full text-[11px] font-medium text-sky-600 dark:text-sky-300 bg-sky-500/5 ring-1 ring-sky-500/20 hover:ring-sky-500/50 hover:bg-sky-500/10 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                    rows={2}
                    placeholder="Type your reply... (Enter to send)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 border-0 resize-none"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !draft.trim()}
                    className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send reply"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
                <p className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2">
                  <Clock className="w-3 h-3" />
                  Replying switches this conversation to manual — the AI stops responding to this visitor.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}