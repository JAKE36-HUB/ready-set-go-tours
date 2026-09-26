"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Heart, Users, UsersRound, Briefcase, PawPrint, Binoculars, Camera,
  Mountain, Palmtree, Compass, Wind, TreePine, Bird, Landmark, Coffee,
  ArrowLeft, ArrowRight, Mail, Phone, CheckCircle2, MessageCircle, CalendarDays, PartyPopper,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { COMPANY, PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"
import { getClientSessionId } from "@/lib/session"
import { trackConversion } from "@/lib/conversions"
import { cn } from "@/lib/utils"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const WHO_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "solo", label: "Solo", icon: User },
  { value: "couple", label: "Couple", icon: Heart },
  { value: "family", label: "Family", icon: Users },
  { value: "friends", label: "Friends", icon: UsersRound },
  { value: "group", label: "Group", icon: Briefcase },
]

const TYPE_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "first-safari", label: "First Safari", icon: PawPrint },
  { value: "honeymoon", label: "Honeymoon", icon: Heart },
  { value: "family", label: "Family Safari", icon: Users },
  { value: "wildlife", label: "Big Five & Wildlife", icon: Binoculars },
  { value: "photography", label: "Photography", icon: Camera },
  { value: "adventure", label: "Adventure", icon: Mountain },
  { value: "safari-beach", label: "Safari + Beach", icon: Palmtree },
  { value: "custom", label: "Something Custom", icon: Compass },
]

const EXPERIENCE_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "big-five", label: "Big Five", icon: PawPrint },
  { value: "migration", label: "Wildebeest Migration", icon: Wind },
  { value: "elephants", label: "Elephants", icon: TreePine },
  { value: "birdlife", label: "Birdlife", icon: Bird },
  { value: "photography", label: "Photography", icon: Camera },
  { value: "culture", label: "Culture & People", icon: Landmark },
  { value: "mountains", label: "Mountains & Treks", icon: Mountain },
  { value: "beach", label: "Beach & Islands", icon: Palmtree },
  { value: "relaxation", label: "Relaxation", icon: Coffee },
]

const BUDGET_OPTIONS = [
  { value: "Under $1,000", label: "Under $1,000", sub: "per person" },
  { value: "$1,000 - $2,000", label: "$1,000 – $2,000", sub: "per person" },
  { value: "$2,000 - $4,000", label: "$2,000 – $4,000", sub: "per person" },
  { value: "$4,000+", label: "$4,000+", sub: "per person" },
  { value: "Not sure yet", label: "Not sure yet", sub: "Give me options" },
]

interface PlannerState {
  whenMonth: string
  flexible: boolean
  who: string
  type: string
  experiences: string[]
  budget: string
  name: string
  email: string
  phone: string
  travellers: string
  days: string
  message: string
}

const initial: PlannerState = {
  whenMonth: "",
  flexible: false,
  who: "",
  type: "",
  experiences: [],
  budget: "",
  name: "",
  email: "",
  phone: "",
  travellers: "",
  days: "",
  message: "",
}

const STEPS = [
  { title: "When are you thinking of travelling?", subtitle: "Pick a month, or tell us you're flexible.", icon: CalendarDays, key: "when" },
  { title: "Who's going on this adventure?", subtitle: "We plan around your group, however big or small.", icon: Users, key: "who" },
  { title: "What kind of trip do you have in mind?", subtitle: "Choose the closest match — we'll refine the details together.", icon: Compass, key: "type" },
  { title: "What do you most want to experience?", subtitle: "Pick everything that excites you.", icon: Binoculars, key: "experiences" },
  { title: "What's your budget range?", subtitle: "Rough is fine — it's personal, and we respect it.", icon: PartyPopper, key: "budget" },
  { title: "Where should we send your safari plan?", subtitle: "Our team will design a trip and reach out personally.", icon: Mail, key: "contact" },
] as const

export function PlanMySafari() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<PlannerState>(initial)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const set = <K extends keyof PlannerState>(key: K, value: PlannerState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleExperience = (value: string) =>
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.includes(value)
        ? prev.experiences.filter((e) => e !== value)
        : [...prev.experiences, value],
    }))

  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return form.flexible || form.whenMonth !== ""
      case 1: return form.who !== ""
      case 2: return form.type !== ""
      case 3: return true
      case 4: return form.budget !== ""
      case 5: return form.name.trim() !== "" || form.email.trim() !== "" || form.phone.trim() !== ""
      default: return false
    }
  }, [step, form])

  const summaryMessage = useMemo(() => {
    const lines: string[] = []
    lines.push(`Hi ${COMPANY.shortName}! I'd like to plan a safari.`)
    lines.push(form.flexible || !form.whenMonth ? `When: dates flexible` : `When: ${form.whenMonth}`)
    if (form.who) lines.push(`Travelling as: ${form.who}`)
    if (form.type) lines.push(`Trip type: ${TYPE_OPTIONS.find((o) => o.value === form.type)?.label ?? form.type}`)
    if (form.experiences.length > 0) {
      lines.push(`Interests: ${form.experiences.map((e) => EXPERIENCE_OPTIONS.find((o) => o.value === e)?.label ?? e).join(", ")}`)
    }
    if (form.travellers) lines.push(`Travellers: ${form.travellers}`)
    if (form.days) lines.push(`Duration: ${form.days} days`)
    if (form.budget) lines.push(`Budget: ${form.budget} per person`)
    if (form.message) {
      lines.push(`Note: ${form.message}`)
    }
    return lines.join("\n")
  }, [form])

  const whatsappUrl = useMemo(() => {
    const base = whatsappLink(summaryMessage)
    return base
  }, [summaryMessage])

  const submit = async () => {
    if (!canContinue) return
    setError("")
    setSubmitting(true)
    try {
      let crmOk = false
      try {
        const payload = {
          source: "planner",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: "Kenya / Tanzania",
          destination: form.type ? "Custom safari package" : "",
          travel_date: form.flexible ? "flexible" : form.whenMonth,
          days: form.days,
          budget: form.budget,
          adults: form.travellers,
          message: `${form.type ? `Trip type: ${form.type}. ` : ""}${form.experiences.length ? `Interests: ${form.experiences.join(", ")}. ` : ""}${form.who ? `Travel style: ${form.who}. ` : ""}${form.message}`,
          page: PLAN_SAFARI_ROUTE,
          session_id: getClientSessionId(),
        }
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        crmOk = res.ok
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          console.warn("Lead API failed:", data?.error || res.status)
        }
      } catch (e) {
        crmOk = false
        console.warn("Lead API failed:", e)
      }

      let emailOk = false
      try {
        const emailjs = await import("@emailjs/browser")
        await emailjs.default.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            to_email: COMPANY.email,
            fullName: form.name.trim() || "Not provided",
            email: form.email.trim() || "Not provided",
            phone: form.phone.trim() || "Not provided",
            country: "Kenya / Tanzania",
            destination: form.type ? (TYPE_OPTIONS.find((o) => o.value === form.type)?.label ?? form.type) : "Custom safari",
            package: "Plan My Safari",
            travelDate: form.flexible ? "Flexible dates" : form.whenMonth,
            days: form.days || "Not specified",
            adults: form.travellers || "Not specified",
            children: "",
            budget: form.budget || "Not specified",
            specialRequests: `${form.type ? `Trip type: ${form.type}. ` : ""}${form.experiences.length ? `Interests: ${form.experiences.join(", ")}. ` : ""}${form.who ? `Travel style: ${form.who}. ` : ""}${form.message}`.trim() || "None",
            source: "Plan My Safari",
            message: summaryMessage,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        )
        emailOk = true
      } catch (e) {
        console.warn("EmailJS failed:", e)
      }

      if (!crmOk && !emailOk) {
        throw new Error("We couldn't send your safari plan. Please try again or contact us directly on WhatsApp.")
      }
      trackConversion({ type: "planner", label: "plan_my_safari", details: form.type || "custom" })
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const progress = Math.round(((step + (submitted ? 1 : 0)) / STEPS.length) * 100)

  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        {!submitted ? (
          <>
            {/* Progress header */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-amber-400">
                  Plan My Safari
                </p>
                <p className="text-xs text-muted-foreground">
                  Step {step + 1} of {STEPS.length}
                </p>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full gradient-primary"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                {STEPS.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                      i < step
                        ? "bg-primary text-primary-foreground border-primary"
                        : i === step
                          ? "border-primary text-primary dark:text-amber-400"
                          : "border-border text-muted-foreground"
                    )}
                    aria-label={`Step ${i + 1}: ${s.title}`}
                  >
                    {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-8">
                  <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground mb-2 leading-tight">
                    {STEPS[step].title}
                  </h1>
                  <p className="text-muted-foreground">{STEPS[step].subtitle}</p>
                </div>

                {step === 0 && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">Pick a month</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {MONTHS.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => { set("whenMonth", m); set("flexible", false) }}
                            className={cn(
                              "h-11 rounded-xl text-sm font-medium border transition-all",
                              form.whenMonth === m
                                ? "border-primary bg-primary/10 text-primary dark:text-amber-400"
                                : "border-border bg-card text-foreground hover:border-primary/40"
                            )}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => set("flexible", !form.flexible)}
                      className={cn(
                        "flex items-center gap-3 w-full rounded-xl border p-4 text-left transition-all",
                        form.flexible
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/40"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-md border",
                        form.flexible ? "bg-primary border-primary" : "border-muted-foreground/50"
                      )}>
                        {form.flexible && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-foreground">Dates not decided — I&apos;m flexible</span>
                        <span className="block text-xs text-muted-foreground">We&apos;ll suggest the best window for what you want to see.</span>
                      </span>
                    </button>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {WHO_OPTIONS.map((opt) => {
                      const active = form.who === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set("who", opt.value)}
                          className={cn(
                            "flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <opt.icon className={cn("w-6 h-6", active ? "text-primary dark:text-amber-400" : "text-muted-foreground")} />
                          <span className={cn("text-sm font-medium", active ? "text-primary dark:text-amber-400" : "text-foreground")}>
                            {opt.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    {TYPE_OPTIONS.map((opt) => {
                      const active = form.type === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set("type", opt.value)}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border p-4 transition-all",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <opt.icon className={cn("w-5 h-5 shrink-0", active ? "text-primary dark:text-amber-400" : "text-muted-foreground")} />
                          <span className={cn("text-sm font-medium", active ? "text-primary dark:text-amber-400" : "text-foreground")}>
                            {opt.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {EXPERIENCE_OPTIONS.map((opt) => {
                      const active = form.experiences.includes(opt.value)
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleExperience(opt.value)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-2xl border p-4 transition-all",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <opt.icon className={cn("w-5 h-5 shrink-0", active ? "text-primary dark:text-amber-400" : "text-muted-foreground")} />
                          <span className={cn("text-sm font-medium leading-tight", active ? "text-primary dark:text-amber-400" : "text-foreground")}>
                            {opt.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    {BUDGET_OPTIONS.map((opt) => {
                      const active = form.budget === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set("budget", opt.value)}
                          className={cn(
                            "flex items-center justify-between w-full rounded-2xl border p-5 transition-all",
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <span className="text-sm font-medium text-foreground">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">{opt.sub}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-name" className="block text-sm font-medium text-foreground mb-1.5">Full name *</label>
                        <Input
                          id="p-name"
                          value={form.name}
                          onChange={(e) => set("name", e.target.value)}
                          placeholder="Jane Doe"
                          className="h-12"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label htmlFor="p-travellers" className="block text-sm font-medium text-foreground mb-1.5">How many travellers?</label>
                        <Input
                          id="p-travellers"
                          value={form.travellers}
                          onChange={(e) => set("travellers", e.target.value)}
                          placeholder="e.g. 2 adults + 1 child"
                          className="h-12"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-email" className="flex items-center gap-1.5 block text-sm font-medium text-foreground mb-1.5">
                          <Mail className="w-3.5 h-3.5" /> Email
                        </label>
                        <Input
                          id="p-email"
                          type="email"
                          value={form.email}
                          onChange={(e) => set("email", e.target.value)}
                          placeholder="you@email.com"
                          className="h-12"
                          autoComplete="email"
                        />
                      </div>
                      <div>
                        <label htmlFor="p-phone" className="flex items-center gap-1.5 block text-sm font-medium text-foreground mb-1.5">
                          <Phone className="w-3.5 h-3.5" /> WhatsApp / phone
                        </label>
                        <Input
                          id="p-phone"
                          value={form.phone}
                          onChange={(e) => set("phone", e.target.value)}
                          placeholder="+1 555 000 0000"
                          className="h-12"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="p-days" className="flex items-center gap-1.5 block text-sm font-medium text-foreground mb-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> Number of days
                      </label>
                      <Input
                        id="p-days"
                        type="number"
                        min={1}
                        value={form.days}
                        onChange={(e) => set("days", e.target.value)}
                        placeholder="e.g. 7"
                        className="h-12"
                      />
                    </div>
                    <div>
                      <label htmlFor="p-message" className="block text-sm font-medium text-foreground mb-1.5">
                        Anything else we should know?
                      </label>
                      <Textarea
                        id="p-message"
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Special occasions, mobility needs, must-see parks, travel dates…"
                        rows={4}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add a name, email or phone so we can send your plan. No spam — just your safari.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {error && (
              <p className="mt-6 text-sm text-red-600 dark:text-red-400 bg-red-500/10 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="mt-10 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className={cn("gap-2", step === 0 && "invisible")}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button
                  onClick={() => canContinue && setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="h-12 px-8 gap-2 gradient-primary text-white border-0 shadow-premium"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={submit}
                  disabled={!canContinue || submitting}
                  className="h-12 px-8 gap-2 gradient-primary text-white border-0 shadow-premium text-base font-semibold"
                >
                  {submitting ? "Sending…" : "Build My Safari"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-10"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary dark:text-amber-400" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground mb-3 leading-tight">
              Your safari plan is on the way!
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Thanks {form.name || "there"} — our team is already working on your trip. Expect a personal reply within 24 hours with a first draft.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              Prefer to chat right now? Message us on WhatsApp and we&apos;ll start planning together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => window.open(whatsappUrl, "_blank", "noopener,noreferrer")}
                className="h-13 px-8 gap-2 bg-[#25D366] hover:bg-[#1fb857] text-white border-0 text-base font-semibold"
              >
                <MessageCircle className="w-4 h-4" /> Continue on WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => { setForm(initial); setStep(0) }}
                className="h-13 px-8 border-border text-foreground"
              >
                Plan another trip
              </Button>
            </div>
          </motion.div>
        )}
      </section>

      <div className="hidden sm:block relative h-40 overflow-hidden">
        <Image
          src="/images/local/pin_6b44e79b5d7aa2ee44a00365a86144c0.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 to-transparent" />
      </div>
    </div>
  )
}