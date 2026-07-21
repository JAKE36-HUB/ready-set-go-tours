"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hi! I'm your AI travel assistant for Ready Set Go Tours & Travel. Ask me about safaris, destinations, packages, or anything East Africa!",
}

export function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: text }])
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: text }] }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content }])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or contact us directly at +254 797 867 411." }])
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or contact us directly at +254 797 867 411." }])
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
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:scale-110 transition-all duration-300"
        aria-label="Open AI chat assistant"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-180px)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-900/10 dark:ring-slate-700/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Travel Assistant</p>
                  <p className="text-[10px] text-white/70">AI-powered • Ready Set Go Tours</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-sky-500 text-white rounded-br-md"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 px-4 py-3 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about safaris, destinations..."
                  className="flex-1 h-10 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 border-0"
                  aria-label="Type your travel question"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white flex items-center justify-center shrink-0 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
