"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import AnimatedSection from "@/components/AnimatedSection";
import { contactFormSchema, type ContactFormData } from "@/lib/schemas";
import { COMPANY } from "@/lib/constants";
import {
  MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle, Loader2,
  ArrowRight, ChevronRight, Star, Shield, Users, Globe, Building2,
} from "lucide-react";
import emailjs from "@emailjs/browser";

const CONTACT_INFO = [
  { icon: MapPin, label: "Visit Us", value: COMPANY.address, desc: "Our Nairobi headquarters", color: "text-sky-500", bg: "bg-sky-500/10", gradient: "from-sky-500/20 to-blue-600/10" },
  { icon: Phone, label: "Call Us", value: COMPANY.phone, desc: "Mon–Sat 8AM–6PM EAT", color: "text-emerald-500", bg: "bg-emerald-500/10", gradient: "from-emerald-500/20 to-teal-600/10" },
  { icon: Mail, label: "Email Us", value: COMPANY.email, desc: "We reply within 24hrs", color: "text-amber-500", bg: "bg-amber-500/10", gradient: "from-amber-500/20 to-orange-600/10" },
  { icon: MessageCircle, label: "WhatsApp", value: COMPANY.whatsapp, desc: "Fastest response", color: "text-green-500", bg: "bg-green-500/10", gradient: "from-green-500/20 to-emerald-600/10" },
  { icon: Clock, label: "Office Hours", value: COMPANY.hours, desc: "East Africa Time (EAT)", color: "text-violet-500", bg: "bg-violet-500/10", gradient: "from-violet-500/20 to-purple-600/10" },
];

const DESTINATIONS = [
  "Masai Mara", "Amboseli", "Serengeti", "Ngorongoro", "Kilimanjaro",
  "Zanzibar", "Diani Beach", "Samburu", "Tsavo", "Laikipia", "Other",
];

const BUDGET_RANGES = [
  "Under $1,000", "$1,000 - $2,500", "$2,500 - $5,000",
  "$5,000 - $10,000", "$10,000+", "Flexible / Custom",
];

const PACKAGES = [
  "Ultimate Kenya Safari", "Tanzania Northern Circuit", "Kenya & Tanzania Combo",
  "Luxury Masai Mara Experience", "Kilimanjaro Climb", "Diani Beach Getaway",
  "Zanzibar Beach Holiday", "Great Migration Package",
  "Luxury Kenya Honeymoon", "Custom / Not Sure Yet",
];

const TRUST_STATS = [
  { icon: Users, value: "15,000+", label: "Happy Travelers" },
  { icon: Star, value: "2,000+", label: "5-Star Reviews" },
  { icon: Globe, value: "50+", label: "Countries Served" },
  { icon: Shield, value: "100%", label: "Satisfaction Rate" },
];

type FormStatus = "idle" | "submitting" | "success" | "error";
type FormStep = "personal" | "trip" | "party" | "review";

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [step, setStep] = useState<FormStep>("personal");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "", email: "", phone: "", country: "",
      destination: "", package: "", travelDate: "", adults: "",
      children: "", budget: "", specialRequests: "",
    },
  });

  const values = watch();
  const [errorMessage, setErrorMessage] = useState("");

  const steps: FormStep[] = ["personal", "trip", "party", "review"];
  const stepLabels = ["Personal Info", "Trip Details", "Travel Party", "Review"];

  const stepIcons = [Mail, MapPin, Users, CheckCircle];

  const canProceed = async (from: FormStep) => {
    if (from === "personal") {
      const valid = await trigger(["fullName", "email", "phone", "country"]);
      return valid;
    }
    if (from === "trip") {
      const valid = await trigger(["destination", "travelDate", "budget"]);
      return valid;
    }
    if (from === "party") {
      const valid = await trigger(["adults"]);
      return valid;
    }
    return true;
  };

  const nextStep = async () => {
    const ok = await canProceed(step);
    if (!ok) return;
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  };

  const prevStep = () => {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: "readysetgotoursandtravel43@gmail.com",
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
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setStatus("success");
      reset();
    } catch (err: unknown) {
      setStatus("error");
      console.error("EmailJS error:", err);
      if (err && typeof err === "object" && "text" in err) {
        const e = err as { text: string; status?: number };
        setErrorMessage(e.text + (e.status ? ` (status: ${e.status})` : ""));
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        try {
          setErrorMessage("Unknown error: " + JSON.stringify(err));
        } catch {
          setErrorMessage("Unknown error (see console)");
        }
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg"
          alt="African savannah landscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/30 to-transparent" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 mb-6 border border-white/20">
              <MessageCircle className="size-4 text-sky-400" />
              <span className="text-sm font-semibold text-white/90">We&apos;re Here to Help</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
              Let&apos;s Plan Your{" "}
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-cyan-200 bg-clip-text text-transparent">
                Safari
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Tell us your dream adventure and our Nairobi-based team will craft the perfect
              East African experience — from the Mara to Zanzibar.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Trust Strip */}
      <section className="py-12 px-6 border-b border-sky-100 dark:border-sky-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_STATS.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30"
              >
                <div className="size-12 rounded-full bg-sky-500/10 flex items-center justify-center shrink-0">
                  <stat.icon className="size-5 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Reach Out to Us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Prefer to reach us directly? Here&apos;s every way to get in touch with our team.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {CONTACT_INFO.map((info, i) => (
              <AnimatedSection key={info.label} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative group p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 ring-1 ring-foreground/5 hover:ring-2 hover:ring-sky-500/20 transition-all duration-300 h-full overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`size-14 rounded-2xl ${info.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className={`size-7 ${info.color}`} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{info.label}</p>
                    <p className="text-sm font-bold text-foreground mb-1">{info.value}</p>
                    <p className="text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Direct */}
      <section className="pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-8 sm:p-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-4">
                  <MessageCircle className="size-4 text-green-300" />
                  <span className="text-xs font-semibold text-green-200 uppercase tracking-wider">Fastest Response</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Chat With Us on WhatsApp</h3>
                <p className="text-green-200/80 max-w-md">
                  Get an instant response from our team. Tap the button below to start a conversation right now.
                </p>
              </div>
              <a
                href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, "")}?text=Hi%20Ready%20Set%20Go%20Tours!%20I%27d%20love%20to%20plan%20a%20safari.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-white text-green-700 font-bold text-base hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl shrink-0"
              >
                <MessageCircle className="size-5" />
                WhatsApp Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Or Send Us a Message
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Fill out the form below and one of our travel consultants will craft your perfect itinerary within 24 hours.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-10">
            {/* Map */}
            <AnimatedSection direction="left" className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl overflow-hidden ring-1 ring-foreground/10 h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 to-transparent z-10 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.687!2d36.6839!3d-1.3131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTgnNDcuMiJTIDM2wrA0MCcwMi4wIkU!5e0!3m2!1sen!2ske!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ready Set Go Tours office location"
                />
              </div>
              <div className="mt-4 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 ring-1 ring-sky-100 dark:ring-sky-900">
                <div className="flex items-start gap-3">
                  <Building2 className="size-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{COMPANY.shortName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {COMPANY.address} — {COMPANY.hours}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="right" className="lg:col-span-3">
              <div className="rounded-2xl bg-card ring-1 ring-foreground/10 overflow-hidden">
                {/* Step Progress */}
                <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-slate-900 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Plan Your Safari</h2>
                  <div className="flex items-center gap-1">
                    {steps.map((s, i) => {
                      const Icon = stepIcons[i];
                      const isCurrent = s === step;
                      const isCompleted = steps.indexOf(step) > i;
                      return (
                        <div key={s} className="flex items-center gap-1 flex-1">
                          <div className={`flex items-center justify-center size-8 rounded-full text-xs font-bold transition-all duration-300 ${
                            isCompleted ? "bg-emerald-500 text-white" :
                            isCurrent ? "bg-sky-500 text-white ring-2 ring-sky-300" :
                            "bg-white/10 text-white/50"
                          }`}>
                            {isCompleted ? <CheckCircle className="size-4" /> : <Icon className="size-3.5" />}
                          </div>
                          {i < steps.length - 1 && (
                            <div className={`h-0.5 flex-1 transition-all duration-300 ${
                              isCompleted ? "bg-emerald-500" : "bg-white/10"
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {stepLabels.map((l, i) => (
                      <span key={l} className={`text-[10px] font-medium uppercase tracking-wider ${
                        steps.indexOf(step) >= i ? "text-sky-200" : "text-white/30"
                      }`}>{l}</span>
                    ))}
                  </div>
                </div>

                {status === "success" ? (
                  <div className="flex flex-col items-center gap-4 py-20 px-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <CheckCircle className="size-20 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-foreground mt-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Thank you for reaching out. One of our travel consultants will contact you within 24 hours to discuss your dream safari.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button variant="outline" onClick={() => { setStatus("idle"); setStep("personal"); }}>
                        Send Another Message
                      </Button>
                      <Link href="/holiday-packages">
                        <Button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white">
                          Browse Packages <ArrowRight className="size-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                    <div className="min-h-[320px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          {step === "personal" && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-500 mb-4 flex items-center gap-2">
                                  <Mail className="size-4" /> Personal Information
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
                                    <Input id="fullName" {...register("fullName")} placeholder="John Smith" className="h-9" />
                                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs">Email *</Label>
                                    <Input id="email" type="email" {...register("email")} placeholder="john@example.com" className="h-9" />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs">Phone *</Label>
                                    <Input id="phone" type="tel" {...register("phone")} placeholder="+1 234 567 890" className="h-9" />
                                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="country" className="text-xs">Country *</Label>
                                    <Input id="country" {...register("country")} placeholder="United States" className="h-9" />
                                    {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {step === "trip" && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-500 mb-4 flex items-center gap-2">
                                  <MapPin className="size-4" /> Trip Details
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label htmlFor="destination" className="text-xs">Destination *</Label>
                                    <select id="destination" {...register("destination")}
                                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/20">
                                      <option value="">Select destination</option>
                                      {DESTINATIONS.map((d) => (<option key={d} value={d}>{d}</option>))}
                                    </select>
                                    {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="package" className="text-xs">Package (optional)</Label>
                                    <select id="package" {...register("package")}
                                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/20">
                                      <option value="">Select package</option>
                                      {PACKAGES.map((p) => (<option key={p} value={p}>{p}</option>))}
                                    </select>
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="travelDate" className="text-xs">Travel Date *</Label>
                                    <Input id="travelDate" type="date" {...register("travelDate")} className="h-9" />
                                    {errors.travelDate && <p className="text-xs text-destructive">{errors.travelDate.message}</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="budget" className="text-xs">Budget Range *</Label>
                                    <select id="budget" {...register("budget")}
                                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus:border-sky-500 focus:ring-3 focus:ring-sky-500/20">
                                      <option value="">Select budget</option>
                                      {BUDGET_RANGES.map((b) => (<option key={b} value={b}>{b}</option>))}
                                    </select>
                                    {errors.budget && <p className="text-xs text-destructive">{errors.budget.message}</p>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {step === "party" && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-2">
                                  <Users className="size-4" /> Travel Party
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="space-y-1.5">
                                    <Label htmlFor="adults" className="text-xs">Adults *</Label>
                                    <Input id="adults" type="number" min="1" {...register("adults")} placeholder="2" className="h-9" />
                                    {errors.adults && <p className="text-xs text-destructive">{errors.adults.message}</p>}
                                  </div>
                                  <div className="space-y-1.5">
                                    <Label htmlFor="children" className="text-xs">Children (optional)</Label>
                                    <Input id="children" type="number" min="0" {...register("children")} placeholder="0" className="h-9" />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <Label htmlFor="specialRequests" className="text-xs">Special Requests (optional)</Label>
                                <Textarea id="specialRequests" {...register("specialRequests")}
                                  rows={4} placeholder="Dietary requirements, accessibility needs, celebrations, specific wildlife interests..."
                                  className="resize-none" />
                              </div>
                            </div>
                          )}

                          {step === "review" && (
                            <div className="space-y-5">
                              <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-500 mb-4 flex items-center gap-2">
                                  <CheckCircle className="size-4" /> Review Your Request
                                </h3>
                                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-5 space-y-3">
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{values.fullName}</span></div>
                                    <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{values.email}</span></div>
                                    <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{values.phone}</span></div>
                                    <div><span className="text-muted-foreground">Country:</span> <span className="font-medium">{values.country}</span></div>
                                    <div><span className="text-muted-foreground">Destination:</span> <span className="font-medium">{values.destination}</span></div>
                                    <div><span className="text-muted-foreground">Travel Date:</span> <span className="font-medium">{values.travelDate}</span></div>
                                    <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">{values.budget}</span></div>
                                    <div><span className="text-muted-foreground">Adults:</span> <span className="font-medium">{values.adults}</span></div>
                                    {values.children && <div><span className="text-muted-foreground">Children:</span> <span className="font-medium">{values.children}</span></div>}
                                  </div>
                                  {values.specialRequests && (
                                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                      <span className="text-xs text-muted-foreground">Special Requests:</span>
                                      <p className="text-sm text-foreground mt-1">{values.specialRequests}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                      <div>
                        {step !== "personal" && (
                          <Button type="button" variant="outline" onClick={prevStep} className="h-10 px-5 text-sm">
                            <ArrowRight className="size-4 mr-1.5 rotate-180" /> Back
                          </Button>
                        )}
                      </div>
                      {step !== "review" ? (
                        <Button type="button" onClick={nextStep} className="h-10 px-6 text-sm bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/25">
                          Continue <ChevronRight className="size-4 ml-1" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={status === "submitting"}
                          className="h-10 px-8 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/25 font-semibold">
                          {status === "submitting" ? (
                            <><Loader2 className="size-4 mr-2 animate-spin" /> Sending...</>
                          ) : (
                            <><Send className="size-4 mr-2" /> Send Inquiry</>
                          )}
                        </Button>
                      )}
                    </div>
                    {status === "error" && (
                      <p className="text-sm text-destructive text-center mt-4">{errorMessage || "Something went wrong. Please try again or contact us directly."}</p>
                    )}
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.08),transparent_60%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready for the Adventure of a Lifetime?
            </h2>
            <p className="text-sky-200/70 text-lg max-w-2xl mx-auto mb-8">
              Whether you&apos;re dreaming of the Great Migration, Kilimanjaro, or Zanzibar&apos;s beaches —
              we&apos;re here to make it happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${COMPANY.phone}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all ring-1 ring-white/20"
              >
                <Phone className="size-4" />
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-semibold shadow-xl shadow-sky-500/25 transition-all"
              >
                <Mail className="size-4" />
                {COMPANY.email}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
