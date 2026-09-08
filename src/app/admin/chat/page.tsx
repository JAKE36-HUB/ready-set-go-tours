"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MessagesSquare, Send, Loader2, Bot, User, Globe, Clock, Repeat, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatSessionSummary {
  session_id: string
  visitor_name: string
  visitor_email: string
  page: string
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

function requestNotificationPermission() {
  try {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  } catch {}
}

export default function AdminChat() {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState("")
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  const unreadTotal = sessions.reduce((acc, s) => acc + s.unread, 0)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Chat</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            AI answers instantly; your replies take over the conversation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadTotal > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {unreadTotal} unread
            </span>
          )}
          <button
            onClick={() => loadSessions()}
            className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Repeat className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-4 py-2.5 mb-4 ring-1 ring-red-500/20">{error}</p>
      )}

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sessions */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden flex flex-col min-h-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
            <MessagesSquare className="w-4 h-4 text-sky-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Conversations {sessions.length > 0 && `(${sessions.length})`}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingSessions && sessions.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
                <MessagesSquare className="w-8 h-8 opacity-40" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs text-slate-400/70 px-6 text-center">When a visitor chats with the AI assistant, their conversation appears here.</p>
              </div>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.session_id}
                  onClick={() => handleSelect(s.session_id)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                    selectedId === s.session_id && "bg-sky-50 dark:bg-sky-500/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {s.visitor_name || "Website visitor"}
                      </span>
                      {s.unread > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                          {s.unread}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400">{timeAgo(s.last_message_at)}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-1">
                    {s.last_preview
                      ? `${s.last_preview.role === "owner" ? "You: " : s.last_preview.role === "assistant" ? "AI: " : ""}${s.last_preview.content}`
                      : "No messages"}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        s.ai_active
                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      <Bot className="w-2.5 h-2.5" />
                      {s.ai_active ? "AI" : "Manual"}
                    </span>
                    {s.page && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 truncate">
                        <Globe className="w-2.5 h-2.5 shrink-0" />
                        {s.page.replace("/", "") || s.page}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden flex flex-col min-h-0">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
              <MessagesSquare className="w-10 h-10 opacity-40" />
              <p className="text-sm">Select a conversation to view and reply</p>
              <p className="text-xs text-center max-w-xs px-6 text-slate-400/70">
                Replies you send here take over the conversation — the AI stops and the visitor sees your message as the &quot;team&quot;.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleSelect("")}
                  className="lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {selected.visitor_name || "Website visitor"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {[selected.visitor_email, selected.page && `On ${selected.page}`].filter(Boolean).join(" · ") || "No contact info"}
                  </p>
                </div>
                <button
                  onClick={toggleAi}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ring-1 transition-colors",
                    selected.ai_active
                      ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-sky-500/30 hover:bg-sky-500/20"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30 hover:bg-emerald-500/20"
                  )}
                >
                  <Bot className="w-3 h-3" />
                  {selected.ai_active ? "AI responding" : "Manual"}
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
                {loadingMessages && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                          m.role === "user"
                            ? "bg-sky-500 text-white rounded-br-md"
                            : m.role === "owner"
                              ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-500/30 rounded-bl-md"
                              : "bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md"
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                          {m.role === "owner" ? (
                            <>
                              <User className="w-2.5 h-2.5" /> You
                            </>
                          ) : m.role === "assistant" ? (
                            <>
                              <Bot className="w-2.5 h-2.5" /> AI Assistant
                            </>
                          ) : (
                            <>
                              <User className="w-2.5 h-2.5" /> Visitor
                            </>
                          )}
                          <span className="font-normal normal-case opacity-70">{timeShort(m.created_at)}</span>
                        </div>
                        {m.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="shrink-0 border-t border-slate-200 dark:border-slate-800 px-4 py-3">
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
                    className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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