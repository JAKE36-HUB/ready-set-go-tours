"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, HeadphonesIcon, Phone } from "lucide-react"
import { trackConversion } from "@/lib/conversions"

interface ChatMessage {
  id: number
  role: "user" | "assistant" | "owner"
  content: string
  created_at?: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 0,
  role: "assistant",
  content: "Welcome to Ready Set Go Safaris! A member of our team will be with you shortly.",
  created_at: "",
}

function ensureSessionId(): string {
  try {
    const existing = localStorage.getItem("rsgt_session_id")
    if (existing) return existing
    const id = "chat-" + crypto.randomUUID()
    localStorage.setItem("rsgt_session_id", id)
    return id
  } catch {
    return "chat-" + Math.random().toString(36).slice(2)
  }
}

export function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [takenOver, setTakenOver] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [teaser, setTeaser] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const stickToBottomRef = useRef(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastIdRef = useRef(0)
  const sessionIdRef = useRef<string>("")
  const conversionTrackedRef = useRef(false)

  const messagesForApi = useCallback((): { role: string; content: string }[] => {
    return messages.map((m) => ({ role: m.role, content: m.content }))
  }, [messages])

  const syncMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/messages?session_id=${encodeURIComponent(sessionIdRef.current)}&after_id=${lastIdRef.current}`, { cache: "no-store" })
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data.messages)) {
        let last = lastIdRef.current
        for (const m of data.messages as ChatMessage[]) {
          if (m.id > last) last = m.id
        }
        if (last > lastIdRef.current) {
          lastIdRef.current = last
          setMessages((prev) => {
            const known = new Set(prev.filter((x) => x.id > 0).map((x) => x.id))
            const fresh = (data.messages as ChatMessage[]).filter((m) => !known.has(m.id))
            return fresh.length > 0 ? [...prev, ...fresh] : prev
          })
        }
        if (typeof data.takenOver === "boolean") setTakenOver(data.takenOver)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (open && !hydrated) {
      const sid = ensureSessionId()
      sessionIdRef.current = sid
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHydrated(true)
      syncMessages()
      return
    }
    if (!open) return
    const t = setInterval(syncMessages, 4000)
    return () => clearInterval(t)
  }, [open, hydrated, syncMessages])

  useEffect(() => {
    if (open && hydrated && messages.length <= 1) syncMessages()
  }, [open, hydrated, messages.length, syncMessages])

  useEffect(() => {
    if (stickToBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, loading])

  const handleChatScroll = () => {
    const el = chatScrollRef.current
    if (!el) return
    // Only auto-follow the newest message while the user is near the bottom.
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const lastMessage = messages[messages.length - 1]
  const awaitingTeam = takenOver && lastMessage && lastMessage.role !== "owner"

  const sendMessage = async (presetText?: string) => {
    const text = (presetText ?? input).trim()
    if (!text || loading) return
    setInput("")
    const userLocalId = Date.now()
    setMessages((prev) => [...prev, { id: userLocalId, role: "user", content: text, created_at: "" }])

    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messagesForApi(), { role: "user", content: text }],
          session_id: sessionIdRef.current,
          page: window.location.pathname,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessages((prev) => [...prev, { id: userLocalId + 1, role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or contact us directly at +254 797 867 411." }])
        return
      }
      if (!conversionTrackedRef.current) {
        conversionTrackedRef.current = true
        trackConversion({ type: "chat", label: "Live chat inquiry", details: text.slice(0, 200) })
      }
      // Server owns the transcript now — drop the optimistic bubble and pull the persisted rows.
      setMessages((prev) => prev.filter((m) => m.id !== userLocalId))
      if (typeof data.first_new_id === "number" && data.first_new_id > 0) {
        lastIdRef.current = data.first_new_id - 1
      }
      await syncMessages()
      if (data.content) {
        setMessages((prev) => {
          if (prev.some((m) => m.role === "assistant" && m.content === data.content)) return prev
          return [...prev, { id: data.last_id || userLocalId + 1, role: "assistant", content: data.content, created_at: "" }]
        })
      }
      if (data.takenOver) {
        setTakenOver(true)
        syncMessages()
      }
    } catch {
      setMessages((prev) => [...prev, { id: userLocalId + 1, role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or contact us directly at +254 797 867 411." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <>
          <AnimatePresence>
            {teaser && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed bottom-44 right-4 sm:right-6 z-40 w-[calc(100vw-3rem)] max-w-[300px] sm:w-72 overflow-hidden rounded-2xl bg-[#1C1917] shadow-2xl shadow-stone-900/40 ring-1 ring-white/10"
              >
                <span className="block h-1 bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#D97706]" />
                <div className="relative px-5 pt-5 pb-5">
                  <button
                    onClick={() => setTeaser(false)}
                    className="absolute top-4 right-4 w-6 h-6 rounded-full text-[#FAF7F2]/40 hover:text-[#FAF7F2] hover:bg-white/5 flex items-center justify-center transition-colors"
                    aria-label="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <h3 className="font-display text-lg leading-snug text-[#FAF7F2] pr-7">
                    Your safari begins with a single question.
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#FAF7F2]/70">
                    Ask our Kenya-based team anything — from the best time to cross the Mara to which
                    lodge overlooks the savannah. We&apos;re one message away.
                  </p>
                  <button
                    onClick={() => {
                      setOpen(true)
                      setTeaser(false)
                    }}
                    className="mt-4 w-full h-10 rounded-xl gradient-primary text-white text-xs font-bold tracking-wide shadow-lg shadow-amber-900/25 hover:shadow-amber-900/40 hover:scale-[1.02] transition-all"
                  >
                    Open Live Chat
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-4 sm:right-6 z-40 group flex items-center gap-2.5"
            aria-label="Chat with us"
          >
            <span className="hidden sm:inline-flex items-center h-11 pl-4 pr-5 rounded-2xl bg-[#1C1917] shadow-xl shadow-stone-900/20 ring-1 ring-white/10 text-sm font-semibold text-[#FAF7F2] group-hover:ring-[#D97706]/60 transition-all">
              Chat with us
            </span>
            <span className="relative inline-flex w-14 h-14 shrink-0">
              {teaser && (
                <span className="absolute inset-0 rounded-full bg-[#D97706]/40 animate-ping" />
              )}
              <span className="relative flex w-14 h-14 items-center justify-center rounded-full gradient-primary text-white shadow-lg shadow-amber-900/30 group-hover:scale-110 group-hover:shadow-amber-900/50 transition-all duration-300">
                <HeadphonesIcon className="w-6 h-6" />
              </span>
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#1C1917]" />
            </span>
          </button>
        </>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-170px)] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/10 dark:ring-slate-700/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden px-4 pt-4 pb-3 bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-500">
              <span className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/10 blur-md" />
              <span className="absolute -bottom-14 -left-10 w-36 h-36 rounded-full bg-black/10 blur-md" />
              <div className="relative flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur ring-2 ring-white/30 flex items-center justify-center text-white text-sm font-bold">
                    RSG
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-300 ring-2 ring-sky-500 animate-pulse" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-white leading-tight tracking-tight">Ready Set Go Safaris</p>
                  <p className="text-[10px] text-white/85 mt-0.5 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Travel specialists online — replies in minutes
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="relative mt-2.5 text-[10px] font-medium text-white/70 truncate">
                Masai Mara · Serengeti · Kilimanjaro · Zanzibar · Diani
              </p>
            </div>

            {/* Messages */}
            <div ref={chatScrollRef} onScroll={handleChatScroll} className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-sky-50/70 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 [scrollbar-width:thin] overscroll-contain">
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id || msg.content}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role !== "user" && (
                        <span
                          className={`shrink-0 mt-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                            msg.role === "owner"
                              ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/25"
                              : "bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sky-500/25"
                          }`}
                        >
                          <HeadphonesIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className={`flex flex-col max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {msg.role === "owner" && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                            Ready Set Go Team
                          </span>
                        )}
                        <div
                          className={`whitespace-pre-wrap break-words text-sm leading-relaxed px-4 py-2.5 rounded-2xl ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/25 rounded-br-sm"
                              : msg.role === "owner"
                                ? "bg-emerald-50 dark:bg-emerald-950/70 ring-1 ring-emerald-200 dark:ring-emerald-500/30 text-emerald-900 dark:text-emerald-100 rounded-bl-sm"
                                : "bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700/60 text-slate-700 dark:text-slate-200 shadow-sm rounded-bl-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-end gap-2"
                  >
                    <span className="shrink-0 mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                      <HeadphonesIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700/60 shadow-sm">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.3s]" />
                      </span>
                    </div>
                  </motion.div>
                )}

                {awaitingTeam && (
                  <div className="flex items-end gap-2">
                    <span className="shrink-0 mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
                      <HeadphonesIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="rounded-2xl rounded-bl-sm px-4 py-3 bg-emerald-50 dark:bg-emerald-950/70 ring-1 ring-emerald-200 dark:ring-emerald-500/30">
                      <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-emerald-200">
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.3s]" />
                        </span>
                        A travel specialist is replying...
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="shrink-0 px-3 pt-2 pb-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200/70 dark:ring-slate-700/60 focus-within:ring-2 focus-within:ring-sky-400/40 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about safaris, destinations..."
                  className="flex-1 h-9 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none border-0"
                  aria-label="Type your travel question"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/30 hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <Phone className="w-3 h-3" />
                Mon–Sat 8:00–18:00 EAT · call or WhatsApp +254 797 867 411
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}