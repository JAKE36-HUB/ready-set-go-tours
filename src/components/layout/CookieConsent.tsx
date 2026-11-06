"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "readysetgo-cookie-consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setVisible(false)
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-2xl bg-card shadow-2xl ring-1 ring-border p-5 sm:p-6">
          <button
            onClick={decline}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row items-start gap-4 pr-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground mb-1">
                Cookie Notice
              </p>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your browsing experience, analyze site traffic, and
                personalize content. By clicking &ldquo;Accept All&rdquo;, you consent to our use of
                cookies. See our{" "}
                <Link
                  href="/privacy-policy"
                  className="font-medium text-accent hover:underline"
                >
                  Privacy Policy
                </Link>{" "}
                for more details.
              </p>
            </div>
            <div className="flex items-center gap-2 sm:shrink-0">
              <Button
                variant="outline"
                onClick={decline}
                className="text-sm h-9 px-4"
              >
                Decline
              </Button>
              <Button
                onClick={accept}
                className="text-sm h-9 px-5 bg-primary text-primary-foreground border-0 hover:bg-primary/90 hover:shadow-lg transition-all"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
