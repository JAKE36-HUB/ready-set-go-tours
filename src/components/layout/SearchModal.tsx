"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Clock,
  Compass,
  Heart,
  LifeBuoy,
  Loader2,
  MapPin,
  MessageCircle,
  Search,
  SearchX,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react"

import { PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"
import {
  POPULAR_SEARCHES,
  SEARCH_CATEGORIES,
  type SearchCategory,
  type SearchCategoryFilter,
  type SearchResult,
} from "@/lib/search-shared"
import { cn } from "@/lib/utils"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const RECENT_KEY = "rsg:search:recent"

const CATEGORY_META: Record<
  SearchCategory,
  { icon: LucideIcon; className: string }
> = {
  Safaris: { icon: Compass, className: "bg-primary/10 text-primary" },
  Destinations: { icon: MapPin, className: "bg-[#F5A623]/20 text-[#A56600]" },
  Honeymoons: { icon: Heart, className: "bg-[#E85D75]/15 text-[#B8324C]" },
  "Travel Guide": { icon: BookOpen, className: "bg-[#0E7490]/12 text-[#0E7490]" },
  "Pages & Help": { icon: LifeBuoy, className: "bg-slate-500/12 text-slate-600" },
}

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

function Highlighted({ text, query }: { text: string; query: string }) {
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((token) => token.length >= 2)
    .map(escapeRegExp)

  if (tokens.length === 0) return <>{text}</>

  const regex = new RegExp(`(${tokens.join("|")})`, "gi")
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={index}
            className="rounded bg-[#F5A623]/30 px-0.5 text-inherit"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}

function SuggestionChip({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/75 transition-colors hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary"
    >
      {label}
    </button>
  )
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<SearchCategoryFilter>("All")
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [recent, setRecent] = useState<string[]>([])
  const [retryToken, setRetryToken] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const cacheRef = useRef(new Map<string, { results: SearchResult[]; total: number }>())
  const abortRef = useRef<AbortController | null>(null)

  const trimmed = query.trim()

  // Reset to a clean state and focus the input each time the modal opens.
  useEffect(() => {
    if (!isOpen) return
    /* eslint-disable react-hooks/set-state-in-effect */
    setQuery("")
    setCategory("All")
    setResults([])
    setTotal(0)
    setActiveIndex(0)
    setError(false)
    setLoading(false)
    /* eslint-enable react-hooks/set-state-in-effect */

    try {
      const stored = window.localStorage.getItem(RECENT_KEY)
      const parsed: unknown = stored ? JSON.parse(stored) : []
      setRecent(
        Array.isArray(parsed)
          ? parsed.filter((entry): entry is string => typeof entry === "string").slice(0, 5)
          : []
      )
    } catch {
      setRecent([])
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  // Lock background scrolling while the dialog is open.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Escape from anywhere closes the dialog.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  // Fetch matching content, debounced and aborted when the query changes.
  useEffect(() => {
    if (!isOpen) return

    if (trimmed.length < 2) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setResults([])
      setTotal(0)
      setLoading(false)
      setError(false)
      /* eslint-enable react-hooks/set-state-in-effect */
      return
    }

    const cacheKey = `${category}|${trimmed.toLowerCase()}`
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      setResults(cached.results)
      setTotal(cached.total)
      setLoading(false)
      setError(false)
      setActiveIndex(0)
      return
    }

    setLoading(true)
    setError(false)

    const controller = new AbortController()
    abortRef.current?.abort()
    abortRef.current = controller

    const timer = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: trimmed, category })
        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error(`Search failed with ${response.status}`)

        const data = (await response.json()) as {
          results?: SearchResult[]
          total?: number
        }
        const payload = {
          results: data.results ?? [],
          total: data.total ?? 0,
        }
        cacheRef.current.set(cacheKey, payload)

        if (!controller.signal.aborted) {
          setResults(payload.results)
          setTotal(payload.total)
          setActiveIndex(0)
          setError(false)
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError" && !controller.signal.aborted) {
          setResults([])
          setTotal(0)
          setError(true)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 180)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [trimmed, category, isOpen, retryToken])

  const rememberQuery = (term: string) => {
    const value = term.trim()
    if (!value) return
    const next = [
      value,
      ...recent.filter((entry) => entry.toLowerCase() !== value.toLowerCase()),
    ].slice(0, 5)
    setRecent(next)
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    } catch {
      // Storage can be unavailable in private mode; recents are optional.
    }
  }

  const clearRecent = () => {
    setRecent([])
    try {
      window.localStorage.removeItem(RECENT_KEY)
    } catch {
      // Ignore storage failures.
    }
  }

  const navigateTo = (result: SearchResult) => {
    rememberQuery(query)
    onClose()
    router.push(result.href)
  }

  const chooseSuggestion = (term: string) => {
    setQuery(term)
    setActiveIndex(0)
    inputRef.current?.focus()
  }

  const scrollActiveIntoView = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({ block: "nearest" })
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (results.length === 0) return
      const next = activeIndex + 1 >= results.length ? 0 : activeIndex + 1
      setActiveIndex(next)
      scrollActiveIntoView(next)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (results.length === 0) return
      const next = activeIndex - 1 < 0 ? results.length - 1 : activeIndex - 1
      setActiveIndex(next)
      scrollActiveIntoView(next)
      return
    }

    if (event.key === "Home" && results.length > 0) {
      event.preventDefault()
      setActiveIndex(0)
      scrollActiveIntoView(0)
      return
    }

    if (event.key === "End" && results.length > 0) {
      event.preventDefault()
      const last = results.length - 1
      setActiveIndex(last)
      scrollActiveIntoView(last)
      return
    }

    if (event.key === "Enter") {
      const result = results[activeIndex]
      if (result) {
        event.preventDefault()
        navigateTo(result)
      }
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      onClose()
    }
  }

  // Keep Tab focus inside the dialog.
  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const showResults = trimmed.length >= 2
  const showEmptyState = !showResults
  const showLoading = showResults && loading && results.length === 0
  const showNoResults = showResults && !loading && !error && results.length === 0
  const showList = showResults && results.length > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-[#06101C]/55 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]"
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
          role="presentation"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            initial={{ opacity: 0, y: -18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={handlePanelKeyDown}
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="relative flex shrink-0 items-center border-b border-border">
              <Search className="absolute left-4 size-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveIndex(0)
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search safaris, destinations, guides…"
                role="combobox"
                aria-expanded={showList}
                aria-controls="site-search-results"
                aria-autocomplete="list"
                aria-activedescendant={
                  showList ? `search-result-${activeIndex}` : undefined
                }
                aria-label="Search the site"
                autoComplete="off"
                spellCheck={false}
                className="h-14 w-full bg-transparent pl-12 pr-24 text-base text-foreground placeholder:text-muted-foreground focus:outline-none sm:h-16"
              />
              <div className="absolute right-4 flex items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      inputRef.current?.focus()
                    }}
                    aria-label="Clear search"
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
                  ESC
                </kbd>
              </div>
            </div>

            {showResults && (
              <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SEARCH_CATEGORIES.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => {
                      setCategory(entry)
                      setActiveIndex(0)
                      setResults([])
                      setTotal(0)
                      setLoading(trimmed.length >= 2)
                      setError(false)
                    }}
                    aria-pressed={category === entry}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                      category === entry
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            )}

            {showEmptyState && (
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {trimmed.length === 1 && (
                  <p className="mb-4 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    Keep typing — results appear after two characters.
                  </p>
                )}

                {recent.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        <Clock className="size-3.5" />
                        Recent searches
                      </p>
                      <button
                        type="button"
                        onClick={clearRecent}
                        className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recent.map((term) => (
                        <SuggestionChip
                          key={term}
                          label={term}
                          onClick={() => chooseSuggestion(term)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                <section className={recent.length > 0 ? "mt-5" : undefined}>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <TrendingUp className="size-3.5" />
                    Popular right now
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {POPULAR_SEARCHES.map((term) => (
                      <SuggestionChip
                        key={term}
                        label={term}
                        onClick={() => chooseSuggestion(term)}
                      />
                    ))}
                  </div>
                </section>

                <div className="mt-5 rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Search the whole site
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Find safaris, honeymoons, destinations, deals, travel guides and
                    answers to common questions — all in one place.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={PLAN_SAFARI_ROUTE}
                      onClick={onClose}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Plan my safari
                      <ArrowRight className="size-3.5" />
                    </Link>
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      <MessageCircle className="size-3.5" />
                      Ask an expert
                    </a>
                  </div>
                </div>
              </div>
            )}

            {showLoading && (
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="flex items-start gap-3 px-3 py-3">
                    <div className="size-9 shrink-0 animate-pulse rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showList && (
              <div
                id="site-search-results"
                role="listbox"
                aria-label="Search results"
                className="min-h-0 flex-1 overflow-y-auto p-2"
              >
                {results.map((result, index) => {
                  const meta = CATEGORY_META[result.category]
                  const Icon = meta.icon
                  const isActive = index === activeIndex

                  return (
                    <Link
                      key={`${result.id}-${result.href}`}
                      href={result.href}
                      ref={(node) => {
                        itemRefs.current[index] = node
                      }}
                      role="option"
                      aria-selected={isActive}
                      id={`search-result-${index}`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={(event) => {
                        event.preventDefault()
                        navigateTo(result)
                      }}
                      className={cn(
                        "group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors",
                        isActive
                          ? "border-primary/15 bg-primary/[0.06]"
                          : "hover:bg-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg",
                          meta.className
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-foreground">
                            <Highlighted text={result.title} query={query} />
                          </span>
                          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {result.category}
                          </span>
                        </span>
                        {result.description && (
                          <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                            <Highlighted text={result.description} query={query} />
                          </span>
                        )}
                      </span>
                      <ArrowRight
                        className={cn(
                          "mt-2 size-4 shrink-0 text-muted-foreground transition-all",
                          isActive
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        )}
                      />
                    </Link>
                  )
                })}
              </div>
            )}

            {error && (
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                  <SearchX className="size-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  Search is taking a quick break
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  We couldn&apos;t load results just now. Try again, or message the team
                  and we&apos;ll track it down for you.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      cacheRef.current.delete(`${category}|${trimmed.toLowerCase()}`)
                      setRetryToken((token) => token + 1)
                    }}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Loader2 className="size-3.5" />
                    Try again
                  </button>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <MessageCircle className="size-3.5" />
                    WhatsApp us
                  </a>
                </div>
              </div>
            )}

            {showNoResults && (
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
                  <SearchX className="size-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  No matches for &ldquo;{trimmed}&rdquo;
                </p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Try fewer words, check the spelling, or search a nearby destination.
                  You can also ask our team directly.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {category !== "All" && (
                    <button
                      type="button"
                      onClick={() => setCategory("All")}
                      className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Search all categories
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      inputRef.current?.focus()
                    }}
                    className="inline-flex h-9 items-center rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Browse popular searches
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Link
                    href={PLAN_SAFARI_ROUTE}
                    onClick={onClose}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Plan my safari
                    <ArrowRight className="size-3.5" />
                  </Link>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    <MessageCircle className="size-3.5" />
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            )}

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
              <span aria-live="polite">
                {showResults
                  ? loading
                    ? "Searching…"
                    : error
                      ? "Search unavailable"
                      : total === 0
                        ? "No results"
                        : `${total} result${total === 1 ? "" : "s"}${
                            total > results.length ? ` · showing top ${results.length}` : ""
                          }`
                  : "Search across safaris, destinations, guides and help"}
              </span>
              <span className="flex items-center gap-3">
                <span>
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                    ↑↓
                  </kbd>{" "}
                  navigate
                </span>
                <span className="hidden sm:inline">
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                    ↵
                  </kbd>{" "}
                  open
                </span>
                <span>
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
                    ESC
                  </kbd>{" "}
                  close
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
