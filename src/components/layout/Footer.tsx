"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Clock, ArrowRight, Heart, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COMPANY, NAV_ITEMS, SOCIAL_LINKS, CONTACT_INFO } from "@/lib/constants"
import { cn } from "@/lib/utils"

const footerColumns = [
  {
    title: "Quick Links",
    links: NAV_ITEMS.map((item) => ({ label: item.label, href: item.href })),
  },
  {
    title: "Popular Destinations",
    links: [
      { label: "Kenya Safaris", href: "/kenya-tours" },
      { label: "Tanzania Safaris", href: "/tanzania-tours" },
      { label: "Beach Holidays", href: "/beach-holidays" },
      { label: "Holiday Packages", href: "/holiday-packages" },
      { label: "Honeymoon Packages", href: "/honeymoon-packages" },
    ],
  },
  {
    title: "Travel Resources",
    links: [
      { label: "Best Time to Visit Masai Mara", href: "/travel-guide/best-time-to-visit-masai-mara" },
      { label: "Kilimanjaro Climbing Tips", href: "/travel-guide/kilimanjaro-climbing-tips" },
      { label: "Zanzibar Travel Guide", href: "/travel-guide/zanzibar-travel-guide" },
      { label: "All Travel Guides", href: "/travel-guide" },
      { label: "FAQ", href: "/faq" },
    ],
  },
]

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-300 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="https://readysetgosafaris.com/wp-content/uploads/2025/10/Ready-Set-go-Tours-Travel-Limited-1.png"
                alt={COMPANY.shortName}
                width={320}
                height={152}
                className="h-20 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              {COMPANY.description}
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white hover:scale-110 transition-all duration-200"
                  aria-label={social.name}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1.5 text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200"
                    >
                      <ChevronRight className="w-3 h-3 text-sky-500/0 group-hover:text-sky-500 transition-all duration-200 -ml-0 group-hover:ml-0" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="flex items-start gap-3 text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-start gap-3 text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 mt-0.5 text-sky-500 shrink-0" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
                  {CONTACT_INFO.address}
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <Clock className="w-4 h-4 mt-0.5 text-amber-500 shrink-0" />
                  {CONTACT_INFO.hours}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-3">
                Newsletter
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Subscribe for exclusive travel deals, safari tips, and inspiration.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="h-10 bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-500 focus:border-sky-500"
                    aria-label="Email address for newsletter"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-10 px-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-0 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-emerald-400 mt-2"
                >
                  Thank you for subscribing!
                </motion.p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 text-sm text-slate-500">
              <span>Privacy Policy</span>
              <span className="hidden sm:inline">|</span>
              <span>Terms & Conditions</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>{COMPANY.copyright}</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by JengaCode
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  }

  return icons[name] || null
}
