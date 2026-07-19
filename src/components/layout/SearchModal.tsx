"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, X, ArrowRight, Compass, MapPin, Package } from "lucide-react"

import { NAV_ITEMS, DESTINATIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const searchCategories = [
  { label: "Destinations", icon: MapPin },
  { label: "Tours", icon: Compass },
  { label: "Packages", icon: Package },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("")
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const getAllItems = () => {
    const items: { label: string; href: string; category: string }[] = []
    NAV_ITEMS.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          items.push({ label: child.label, href: child.href, category: item.label })
        })
      }
    })
    DESTINATIONS.kenya.forEach((dest) => {
      const href = "/kenya-tours";
      if (!items.find((i) => i.href === href && i.label === dest.name)) {
        items.push({ label: dest.name, href, category: "Destinations" })
      }
    });
    DESTINATIONS.tanzania.forEach((dest) => {
      const href = "/tanzania-tours";
      if (!items.find((i) => i.href === href && i.label === dest.name)) {
        items.push({ label: dest.name, href, category: "Destinations" })
      }
    });
    return items
  }

  const filterItems = () => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return getAllItems().filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }

  const results = filterItems()

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] sm:pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl mx-4"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-900/10 dark:ring-slate-700/50 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, tours, packages..."
              className="w-full h-16 pl-14 pr-14 bg-transparent text-base sm:text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {!query && (
            <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
                Quick Links
              </p>
              <div className="flex flex-wrap gap-2">
                {searchCategories.map((cat, i) => {
                  const Icon = cat.icon
                  return (
                    <button
                      key={cat.label}
                      onClick={() => {
                        setActiveCategory(i)
                        setQuery(cat.label.toLowerCase())
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        activeCategory === i
                          ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800">
              <p className="px-5 py-2.5 text-xs text-slate-400 font-medium">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>
              <div className="px-2 pb-2 space-y-0.5 max-h-64 overflow-y-auto">
                {results.map((result) => (
                  <Link
                    key={result.href + result.label}
                    href={result.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-3 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div>
                        <span>{result.label}</span>
                        <span className="ml-2 text-xs text-slate-400">in {result.category}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-3 flex items-center gap-4 text-xs text-slate-400">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">ESC</kbd>{" "}
              to close
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">↑↓</kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">↵</kbd>{" "}
              to select
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
