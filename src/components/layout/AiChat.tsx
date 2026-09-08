"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2, HeadphonesIcon, Phone } from "lucide-react"

interface ChatMessage {
  id: number
  role: "user" | "assistant" | "owner"
  content: string
  created_at?: string
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 0,
  role: "assistant",
  content: "Welcome to Ready Set Go Tours & Travel! We can help you plan a safari, beach holiday, or honeymoon across Kenya and Tanzania. What would you like to know?",
  created_at: "",
}

const QUICK_REPLIES = [
  "How much does a safari cost?",
  "Best time to visit Masai Mara",
  "I need a custom itinerary",
  "Talk to a travel specialist",
]

const IDENTITY_KEY = "rsgt_chat_identity"

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

function loadIdentity(): { name: string; email: string; phone: string } {
  try {
    const raw = localStorage.getItem(IDENTITY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { name: parsed.name || "", email: parsed.email || "", phone: parsed.phone || "" }
    }
  } catch {}
  return { name: "", email: "", phone: "" }
}

function saveIdentity(name: string, email: string, phone: string) {
  try {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify({ name, email, phone }))
  } catch {}
}

const inputCls =
  "w-full h-10 px-3.5 rounded-xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-shadow"

export function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [takenOver, setTakenOver] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [identity, setIdentity] = useState<{ name: string; email: string; phone: string }>(() => loadIdentity())
  const [needIdentity, setNeedIdentity] = useState(false)
  const [savingIdentity, setSavingIdentity] = useState(false)
  const [teaser, setTeaser] = useState(false)
  const identityPromptedRef = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastIdRef = useRef(0)
  const sessionIdRef = useRef<string>("")

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading, needIdentity])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    try {
      if (sessionStorage.getItem("rsgt_chat_teaser")) return
      sessionStorage.setItem("rsgt_chat_teaser", "1")
      const show = window.setTimeout(() => setTeaser(true), 6000)
      const hide = window.setTimeout(() => setTeaser(false), 15000)
      return () => {
        window.clearTimeout(show)
        window.clearTimeout(hide)
      }
    } catch {}
  }, [])

  const lastMessage = messages[messages.length - 1]
  const awaitingTeam = takenOver && lastMessage && lastMessage.role !== "owner"

  const sendMessage = async (presetText?: string) => {
    const text = (presetText ?? input).trim()
    if (!text || loading) return
    setInput("")
    const userLocalId = Date.now()
    setMessages((prev) => [...prev, { id: userLocalId, role: "user", content: text, created_at: "" }])

    const hasIdentity = identity.name || identity.email
    if (hasIdentity) {
      saveIdentity(identity.name, identity.email, identity.phone)
    }

    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messagesForApi(), { role: "user", content: text }],
          session_id: sessionIdRef.current,
          visitor_name: identity.name,
          visitor_email: identity.email,
          page: window.location.pathname,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessages((prev) => [...prev, { id: userLocalId + 1, role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or contact us directly at +254 797 867 411." }])
        return
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

      // If the visitor wrote but we still don't know who they are, gently ask once.
      const hasEmailInText = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(text)
      if (!identity.name && !identity.email && !hasEmailInText && !identityPromptedRef.current) {
        identityPromptedRef.current = true
        setNeedIdentity(true)
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

  const submitIdentity = async () => {
    if (savingIdentity) return
    const name = identity.name.trim()
    const email = identity.email.trim().toLowerCase()
    const phone = identity.phone.trim()
    if (!name && !email && !phone) return
    setSavingIdentity(true)
    try {
      const res = await fetch("/api/chat/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          name,
          email,
          phone,
          page: window.location.pathname,
        }),
      })
      if (res.ok) {
        saveIdentity(name, email, phone)
        setNeedIdentity(false)
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: email
              ? `Thanks ${name.split(" ")[0] || email.split("@")[0]}! Your details are saved — our team can now follow up with you directly.`
              : "Got it — thanks for sharing your details!",
            created_at: "",
          },
        ])
        syncMessages()
      }
    } catch {
    } finally {
      setSavingIdentity(false)
    }
  }

  const showIdentityInputs = messages.length <= 1 && !identity.name && !identity.email

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <>
          <AnimatePresence>
            {teaser && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed bottom-[10.5rem] right-6 z-40 hidden sm:block w-64 p-4 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 dark:ring-slate-700"
              >
                <button
                  onClick={() => setTeaser(false)}
                  className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2.5">
                  <span className="flex w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 items-center justify-center text-white shadow-md shadow-sky-500/25">
                    <HeadphonesIcon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Planning a safari?</p>
                    <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      We&apos;re online now
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                  Ask us anything — a travel specialist usually replies within minutes.
                </p>
                <button
                  onClick={() => {
                    setOpen(true)
                    setTeaser(false)
                  }}
                  className="mt-3 w-full h-9 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-xs font-semibold shadow-md shadow-sky-500/25 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                  Chat with us
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen(true)}
            className="fixed bottom-24 right-6 z-40 group flex items-center gap-2.5"
            aria-label="Chat with us"
          >
            <span className="hidden sm:inline-flex items-center h-11 pl-4 pr-5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 dark:ring-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:ring-sky-300 dark:group-hover:ring-sky-700 transition-all">
              Chat with us
            </span>
            <span className="relative inline-flex w-14 h-14 shrink-0">
              {teaser && (
                <span className="absolute inset-0 rounded-full bg-sky-400/40 animate-ping" />
              )}
              <span className="relative flex w-14 h-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/30 group-hover:scale-110 group-hover:shadow-sky-500/50 transition-all duration-300">
                <HeadphonesIcon className="w-6 h-6" />
              </span>
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
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
                  <p className="text-[15px] font-bold text-white leading-tight tracking-tight">Ready Set Go Tours</p>
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

            {/* Identity capture */}
            {showIdentityInputs && (
              <div className="shrink-0 px-4 pt-3 pb-1.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1.5 font-semibold">Your details (optional)</p>
                <div className="flex gap-2">
                  <input
                    value={identity.name}
                    onChange={(e) => setIdentity((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Name"
                    className={inputCls}
                  />
                  <input
                    value={identity.email}
                    onChange={(e) => setIdentity((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email"
                    type="email"
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gradient-to-b from-sky-50/70 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 [scrollbar-width:thin] overscroll-contain">
              {messages.length <= 1 && !needIdentity && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="inline-flex items-center h-8 px-3 rounded-full text-[11px] font-medium text-sky-600 dark:text-sky-300 bg-white dark:bg-slate-800 ring-1 ring-sky-500/20 hover:ring-sky-500/50 hover:bg-sky-500/5 transition-all disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

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

                {needIdentity && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-start"
                  >
                    <span className="shrink-0 mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-sky-500/25">
                      <HeadphonesIcon className="w-3.5 h-3.5" />
                    </span>
                    <div className="ml-2 max-w-[78%] rounded-2xl rounded-bl-sm px-4 py-3 bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700/60 text-slate-700 dark:text-slate-200 shadow-sm">
                      <p className="text-sm leading-relaxed mb-2">
                        Mind sharing your name and email so our team can follow up with tailored options? (Optional, but it helps a lot.)
                      </p>
                      <div className="space-y-2">
                        <input
                          value={identity.name}
                          onChange={(e) => setIdentity((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Your name"
                          className={inputCls}
                        />
                        <input
                          value={identity.email}
                          onChange={(e) => setIdentity((p) => ({ ...p, email: e.target.value }))}
                          placeholder="Email address"
                          type="email"
                          className={inputCls}
                        />
                        <input
                          value={identity.phone}
                          onChange={(e) => setIdentity((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="Phone / WhatsApp (optional)"
                          type="tel"
                          className={inputCls}
                        />
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={submitIdentity}
                            disabled={savingIdentity || (!identity.name.trim() && !identity.email.trim() && !identity.phone.trim())}
                            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white text-xs font-semibold shadow-md shadow-sky-500/25 hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {savingIdentity ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <HeadphonesIcon className="w-3.5 h-3.5" />}
                            Share details
                          </button>
                          <button
                            onClick={() => setNeedIdentity(false)}
                            className="h-9 px-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            Not now
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

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