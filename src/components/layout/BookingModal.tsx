"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import emailjs from "@emailjs/browser"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Users,
  MapPin,
  DollarSign,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { bookingFormSchema, type BookingFormData } from "@/lib/schemas"
import { DESTINATIONS, TOUR_PACKAGES } from "@/lib/constants"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPackage?: string
}

type FormStatus = "idle" | "submitting" | "success" | "error"

const FLAT_DESTINATIONS = [
  ...DESTINATIONS.kenya,
  ...DESTINATIONS.tanzania,
]

const BUDGET_OPTIONS = [
  { label: "Under $1,000", value: "Under $1,000" },
  { label: "$1,000 - $2,500", value: "$1,000 - $2,500" },
  { label: "$2,500 - $5,000", value: "$2,500 - $5,000" },
  { label: "$5,000 - $10,000", value: "$5,000 - $10,000" },
  { label: "$10,000+", value: "$10,000+" },
  { label: "Custom Budget", value: "Custom" },
]

export function BookingModal({ open, onOpenChange, initialPackage }: BookingModalProps) {
  const [status, setStatus] = useState<FormStatus>("idle")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      country: "",
      destination: "",
      package: "",
      travelDate: "",
      adults: "",
      children: "",
      budget: "",
      specialRequests: "",
    },
  })

  const watchedDestination = watch("destination")
  const watchedPackage = watch("package")
  const watchedBudget = watch("budget")

  useEffect(() => {
    if (open && initialPackage) {
      setValue("package", initialPackage)
    }
  }, [open, initialPackage, setValue])

  useEffect(() => {
    if (!open) {
      setStatus("idle")
      reset()
    }
  }, [open, reset])

  const [errorMessage, setErrorMessage] = useState("")

  const onSubmit = useCallback(async (data: BookingFormData) => {
    setStatus("submitting")
    setErrorMessage("")
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: "jaketish2@gmail.com",
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          destination: data.destination,
          package: data.package || "Not specified",
          travelDate: data.travelDate,
          adults: data.adults,
          children: data.children || "0",
          budget: data.budget,
          specialRequests: data.specialRequests || "None",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
      )
      setStatus("success")
    } catch (err: unknown) {
      setStatus("error")
      console.error("EmailJS error:", err)
      if (err && typeof err === "object" && "text" in err) {
        const e = err as { text: string; status?: number }
        setErrorMessage(e.text + (e.status ? ` (status: ${e.status})` : ""))
      } else if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        try {
          setErrorMessage("Unknown error: " + JSON.stringify(err))
        } catch {
          setErrorMessage("Unknown error (see console)")
        }
      }
    }
  }, [])

  const sectionHeader = (icon: React.ReactNode, title: string, color: string) => (
    <div className={`flex items-center gap-2.5 mb-4 pb-2 border-b ${color}`}>
      {icon}
      <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
    </div>
  )

  const renderField = (
    name: keyof BookingFormData,
    label: string,
    placeholder: string,
    type: string = "text",
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-xs font-medium text-slate-700 dark:text-slate-300">
        {label}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="h-10 text-sm"
      />
      {errors[name]?.message && (
        <p className="text-xs text-red-500 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  )

  const renderContent = () => {
    if (status === "success") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-6" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
          >
            Booking Request Sent!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 dark:text-slate-400 max-w-sm mb-8"
          >
            Thank you for your interest. Our luxury travel team will reach out within 24 hours to
            craft your perfect East African safari.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              onClick={() => {
                onOpenChange(false)
              }}
              className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white px-8"
            >
              Close
            </Button>
          </motion.div>
        </motion.div>
      )
    }

    if (status === "error") {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center py-16 px-6 text-center"
        >
          <XCircle className="w-20 h-20 text-red-400 mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Submission Failed
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
            {errorMessage || "Something went wrong while sending your booking request. Please try again or contact us directly."}
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStatus("idle")}
            >
              Go Back
            </Button>
            <Button
              onClick={() => handleSubmit(onSubmit)()}
              className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </motion.div>
      )
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
        <div className="px-6 py-5 space-y-7 max-h-[calc(90vh-180px)] overflow-y-auto">
          {/* Personal Information */}
          <div>
            {sectionHeader(
              <Users className="w-4 h-4 text-sky-600" />,
              "Personal Information",
              "border-sky-200 text-sky-800 dark:border-sky-800 dark:text-sky-300",
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField("fullName", "Full Name", "John Doe")}
              {renderField("email", "Email Address", "john@example.com", "email")}
              {renderField("phone", "Phone Number", "+1 234 567 890", "tel")}
              {renderField("country", "Country of Residence", "United States")}
            </div>
          </div>

          {/* Trip Details */}
          <div>
            {sectionHeader(
              <MapPin className="w-4 h-4 text-orange-500" />,
              "Trip Details",
              "border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300",
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Destination */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="destination"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Destination
                </Label>
                <Select
                  value={watchedDestination || ""}
                  onValueChange={(val) => setValue("destination", val ?? "", { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select a destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kenya-all" disabled>
                      — Kenya —
                    </SelectItem>
                    {DESTINATIONS.kenya.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="tanzania-all" disabled>
                      — Tanzania —
                    </SelectItem>
                    {DESTINATIONS.tanzania.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destination?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.destination?.message}</p>
                )}
              </div>

              {/* Package */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="package"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Tour Package <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <Select
                  value={watchedPackage || ""}
                  onValueChange={(val) => setValue("package", val ?? "")}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {TOUR_PACKAGES.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.name}>
                        {pkg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Travel Date */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="travelDate"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Preferred Travel Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="travelDate"
                    type="date"
                    {...register("travelDate")}
                    className="h-10 pl-10 text-sm"
                  />
                </div>
                {errors.travelDate?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.travelDate?.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Travel Party & Budget */}
          <div>
            {sectionHeader(
              <DollarSign className="w-4 h-4 text-amber-500" />,
              "Travel Party & Budget",
              "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300",
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Adults */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="adults"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Adults
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    placeholder="2"
                    {...register("adults")}
                    className="h-10 pl-10 text-sm"
                  />
                </div>
                {errors.adults?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.adults?.message}</p>
                )}
              </div>

              {/* Children */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="children"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Children <span className="text-slate-400 font-normal">(optional)</span>
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("children")}
                    className="h-10 pl-10 text-sm"
                  />
                </div>
                {errors.children?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.children?.message}</p>
                )}
              </div>

              {/* Budget */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="budget"
                  className="text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  Budget Range
                </Label>
                <Select
                  value={watchedBudget || ""}
                  onValueChange={(val) => setValue("budget", val ?? "", { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.budget?.message && (
                  <p className="text-xs text-red-500 mt-1">{errors.budget?.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            {sectionHeader(
              <FileText className="w-4 h-4 text-slate-500" />,
              "Special Requests",
              "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300",
            )}
            <div className="space-y-1.5">
              <Label
                htmlFor="specialRequests"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                Anything we should know? <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Textarea
                id="specialRequests"
                placeholder="Dietary requirements, accommodation preferences, specific experiences you're interested in..."
                rows={4}
                {...register("specialRequests")}
                className="text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 rounded-b-xl">
          <Button
            type="submit"
            disabled={status === "submitting"}
            className="w-full h-12 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-semibold text-base shadow-lg shadow-sky-200 dark:shadow-sky-900/30 transition-all duration-300 disabled:opacity-60"
          >
            {status === "submitting" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending Request...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Booking Request
              </span>
            )}
          </Button>
          <p className="text-xs text-slate-400 text-center mt-3">
            We typically respond within 24 hours
          </p>
        </div>
      </form>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl w-full p-0 gap-0 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:ring-slate-700/50"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 px-6 py-5">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.15),transparent_50%)]" />
              <div className="relative z-10">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-white">
                    Book Your Dream Safari
                  </DialogTitle>
                  <DialogDescription className="text-sky-200/80 text-sm">
                    Fill in your details and our luxury travel consultants will curate the perfect
                    East African experience for you.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Body */}
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
