"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Compass, Menu, Search, Phone, Moon, Sun, ChevronDown, X, MessageCircle } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet"
import { NAV_ITEMS, COMPANY, PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"
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
  const transparent = !scrolled && pathname === "/"

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

  const whatsappUrl = whatsappLink()

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/70 bg-background/90 backdrop-blur-xl shadow-[0_10px_40px_-28px_rgba(18,42,32,0.45)]"
            : transparent
              ? "bg-gradient-to-b from-black/45 via-black/10 to-transparent"
              : "border-b border-transparent bg-background/70 backdrop-blur-xl"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/logo.png"
              alt="Ready Set Go Safaris"
              width={280}
              height={133}
              className={cn(
                "h-10 w-auto object-contain transition-all duration-300 sm:h-14",
                transparent && "brightness-0 invert"
              )}
              priority
            />
          </Link>

          <nav
            className={cn(
              "hidden lg:flex items-center gap-0.5 rounded-full border px-1.5 py-1.5 backdrop-blur-md transition-colors duration-300",
              transparent ? "border-white/15 bg-white/10" : "border-border/70 bg-card/60"
            )}
          >
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
                          "flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                          isActive
                            ? transparent
                              ? "bg-white text-primary"
                              : "bg-primary text-primary-foreground"
                            : transparent
                              ? "text-white/80 hover:bg-white/10 hover:text-white"
                              : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
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
                            className="absolute top-full left-0 mt-2 w-60 rounded-2xl border border-border bg-card shadow-card overflow-hidden"
                          >
                            <div className="p-1.5">
                              {item.children!.map((child) => {
                                const isChildActive = pathname === child.href
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={cn(
                                      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                                      isChildActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/75 hover:bg-muted hover:text-foreground"
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
                        "rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                        isActive
                          ? transparent
                            ? "bg-white text-primary"
                            : "bg-primary text-primary-foreground"
                          : transparent
                            ? "text-white/80 hover:bg-white/10 hover:text-white"
                            : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
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
                "hidden rounded-full sm:inline-flex",
                transparent ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-foreground/70 hover:text-primary"
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
                "hidden rounded-full sm:inline-flex",
                transparent ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-foreground/70 hover:text-primary"
              )}
              aria-label="Toggle dark mode"
            >
              {mounted ? (theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />) : <div className="w-4 h-4" />}
            </Button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden xl:inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                transparent
                  ? "text-white/80 hover:bg-white/10 hover:text-white"
                  : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
              )}
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">WhatsApp an Expert</span>
            </a>

            <Link href={PLAN_SAFARI_ROUTE}>
              <Button className="hidden h-10 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-none hover:bg-primary/90 sm:inline-flex">
                Plan My Safari
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className={cn("rounded-full lg:hidden", transparent ? "text-white hover:bg-white/10" : "text-foreground")}
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

  const whatsappUrl = whatsappLink()

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary text-white">
            <Compass className="w-4 h-4" />
          </div>
          <span className="font-display text-xl text-foreground">
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
                      "flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/75 hover:bg-muted hover:text-foreground"
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
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={cn(
                                "block rounded-xl px-3 py-2.5 text-sm transition-all duration-150",
                                pathname === child.href
                                  ? "bg-primary/10 font-medium text-primary"
                                  : "text-foreground/65 hover:bg-muted hover:text-foreground"
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
                    "flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/75 hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white font-medium sm:hover:scale-[1.02] transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          WhatsApp a Safari Expert
        </a>
        <Link
          href={PLAN_SAFARI_ROUTE}
          onClick={onClose}
          className="flex items-center justify-center w-full py-3 rounded-xl gradient-primary text-white font-medium shadow-premium sm:hover:scale-[1.02] transition-all duration-300"
        >
          Plan My Safari
        </Link>
        <a
          href={`tel:${COMPANY.phone}`}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/75 hover:bg-muted hover:text-foreground transition-colors"
        >
          <Phone className="w-4 h-4 text-primary shrink-0" />
          <span className="whitespace-nowrap">{COMPANY.phone}</span>
        </a>
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
        <div className="bg-card rounded-2xl shadow-2xl ring-1 ring-border overflow-hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, tours, packages..."
              className="w-full h-14 bg-transparent pl-12 pr-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search destinations, tours, packages"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {results.length > 0 && (
            <div className="border-t border-border">
              <div className="p-2 space-y-0.5">
                {results.map((result) => (
                  <Link
                    key={`${result.href}-${result.label}`}
                    href={result.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/75 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {result.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="border-t border-border px-4 py-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">ESC</kbd> to close</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd> to navigate</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}