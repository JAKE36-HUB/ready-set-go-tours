"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Compass, Menu, Search, Phone, Moon, Sun, ChevronDown, X } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet"
import { NAV_ITEMS, COMPANY } from "@/lib/constants"
import { cn } from "@/lib/utils"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMobileMenuOpen(false)
    setSearchOpen(false)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false)
        setActiveDropdown(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
          scrolled
            ? "bg-white shadow-premium dark:bg-slate-900"
            : "bg-white/70 backdrop-blur-xl dark:bg-slate-900/70"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 rounded-lg dark:bg-white/90 dark:px-2">
            <Image
              src="https://readysetgosafaris.com/wp-content/uploads/2025/10/Ready-Set-go-Tours-Travel-Limited-1.png"
              alt={COMPANY.shortName}
              width={280}
              height={133}
              className="h-16 w-auto object-contain transition-all duration-300"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              const hasChildren = item.children && item.children.length > 0

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.href ? null : item.href)
                        }
                        className={cn(
                          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/30"
                            : scrolled
                              ? "text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800"
                              : "text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800"
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            activeDropdown === item.href && "rotate-180"
                          )}
                        />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.href && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 shadow-card ring-1 ring-slate-900/5 dark:ring-slate-700/50 overflow-hidden"
                          >
                            <div className="p-1.5">
                              {item.children!.map((child) => {
                                const isChildActive = pathname === child.href
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                                      isChildActive
                                        ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                    )}
                                  >
                                    {child.label}
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                          ? "text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/30"
                          : scrolled
                            ? "text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800"
                            : "text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-sky-400 dark:hover:bg-slate-800"
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "hidden sm:inline-flex",
                scrolled
                  ? "text-slate-700 hover:text-sky-600 dark:text-slate-300"
                  : "text-slate-700 hover:text-sky-600 dark:text-slate-300"
              )}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "hidden sm:inline-flex",
                scrolled
                  ? "text-slate-700 hover:text-sky-600 dark:text-slate-300"
                  : "text-slate-700 hover:text-sky-600 dark:text-slate-300"
              )}
              aria-label="Toggle dark mode"
            >
              {mounted ? (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <div className="w-4 h-4" />}
            </Button>

            <a
              href={`tel:${COMPANY.phone}`}
              className={cn(
                "hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                scrolled
                  ? "text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-sky-400"
                  : "text-slate-700 hover:text-sky-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:text-sky-400"
              )}
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{COMPANY.phone}</span>
            </a>

            <Link href="/contact">
              <Button className="hidden sm:inline-flex items-center gap-2 font-medium gradient-primary text-white border-0 shadow-premium hover:shadow-premium hover:scale-105 transition-all duration-300">
                Book Now
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                "lg:hidden",
                scrolled
                  ? "text-slate-700 dark:text-slate-300"
                  : "text-slate-700 dark:text-slate-300"
              )}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm p-0">
          <MobileNavContent onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <AnimatePresence>
        {searchOpen && (
          <HeaderSearchModal onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

function MobileNavContent({ onClose }: { onClose: () => void }) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary text-white">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            {COMPANY.shortName}
          </span>
        </Link>
        <SheetClose
          render={
            <Button variant="ghost" size="icon" aria-label="Close menu" />
          }
        >
          <X className="w-5 h-5" />
        </SheetClose>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.includes(item.href)

          return (
            <div key={item.href}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.href)}
                    className={cn(
                      "flex w-full items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-sky-100 dark:border-sky-900 pl-3">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "block px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                                pathname === child.href
                                  ? "bg-sky-50 text-sky-700 font-medium dark:bg-sky-900/30 dark:text-sky-400"
                                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-3">
        <a
          href={`tel:${COMPANY.phone}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <Phone className="w-4 h-4 text-sky-500" />
          {COMPANY.phone}
        </a>
        <Link
          href="/contact"
          onClick={onClose}
          className="flex items-center justify-center w-full py-3 rounded-xl gradient-primary text-white font-medium shadow-premium hover:shadow-premium hover:scale-[1.02] transition-all duration-300"
        >
          Book Now
        </Link>
      </div>
    </div>
  )
}

function HeaderSearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ label: string; href: string }[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const matches: { label: string; href: string }[] = []
    NAV_ITEMS.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (
            child.label.toLowerCase().includes(q) ||
            child.href.toLowerCase().includes(q)
          ) {
            matches.push({ label: child.label, href: child.href })
          }
        })
      }
      if (item.label.toLowerCase().includes(q) && item.href !== "/") {
        matches.push({ label: item.label, href: item.href })
      }
    })
    setResults(matches.slice(0, 8))
  }, [query])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg mx-4"
      >
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl ring-1 ring-slate-900/10 dark:ring-slate-700/50 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, tours, packages..."
              className="w-full h-14 pl-12 pr-12 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {results.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800">
              <div className="p-2 space-y-0.5">
                {results.map((result) => (
                  <Link
                    key={`${result.href}-${result.label}`}
                    href={result.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {result.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-4 text-xs text-slate-400">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">↑↓</kbd> to navigate</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
