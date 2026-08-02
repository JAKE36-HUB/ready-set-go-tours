"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  X, Phone, MessageCircle, Mail, Archive, Trash2, CalendarClock, Plus,
  Clock, Users, Plane, StickyNote, History, Send, CheckCircle2,
} from "lucide-react"
import type { LeadDetail, Reminder } from "@/lib/leads/types"
import { LEAD_STATUSES, formatDateTime, timeAgo, deviceLabel, browserLabel } from "@/lib/leads/types"
import { cn } from "@/lib/utils"

interface Props {
  lead: LeadDetail | null
  onClose: () => void
  onChanged: (leadId: number) => Promise<void>
  onDeleted: (leadId: number) => void
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5">
      <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2.5">
        <Icon className="w-3.5 h-3.5" /> {title}
      </h4>
      {children}
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-3 py-1">
      <span className="text-xs text-slate-400 shrink-0">{label}</span>
      <span className={cn("text-xs text-right break-all", mono && "font-mono", value ? "text-slate-700 dark:text-slate-300" : "")}>{value}</span>
    </div>
  )
}

export default function LeadDetailPanel({ lead, onClose, onChanged, onDeleted }: Props) {
  const [note, setNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)
  const [reminderTitle, setReminderTitle] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [reminderSaving, setReminderSaving] = useState(false)
  const [busy, setBusy] = useState("")

  if (!lead) return null

  const leadId = lead.id

  async function patch(body: Record<string, unknown>, action: string) {
    setBusy(action)
    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      await onChanged(leadId)
    } finally {
      setBusy("")
    }
  }

  async function addNote() {
    if (!note.trim()) return
    setSavingNote(true)
    try {
      await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ detail: note }),
      })
      setNote("")
      await onChanged(leadId)
    } finally {
      setSavingNote(false)
    }
  }

  async function addReminder() {
    if (!reminderTitle.trim() || !reminderDate) return
    setReminderSaving(true)
    try {
      await fetch(`/api/admin/leads/${leadId}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: reminderTitle, due_at: new Date(reminderDate).toISOString() }),
      })
      setReminderTitle("")
      setReminderDate("")
      await onChanged(leadId)
    } finally {
      setReminderSaving(false)
    }
  }

  async function toggleReminder(r: Reminder) {
    await fetch(`/api/admin/leads/${leadId}/reminders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !r.done, id: r.id }),
    })
    await onChanged(leadId)
  }

  const phoneDigits = lead.phone.replace(/\D/g, "")
  const whatsappNumber = phoneDigits ? `https://wa.me/${phoneDigits}` : `https://wa.me/254797867411?text=${encodeURIComponent(`Hi, I'm following up about a tour inquiry${lead.name ? ` for ${lead.name}` : ""}.`)}`

  const statusMeta = LEAD_STATUSES.find((s) => s.value === lead.status)

  const timelineLabels: Record<string, string> = {
    created: "Lead created",
    status_change: "Status changed",
    note: "Note added",
    reminder_set: "Reminder set",
    reminder_done: "Reminder completed",
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-[180]"
        onClick={onClose}
      />
      <motion.aside
        key="panel"
        initial={{ x: 480, opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 480, opacity: 0.5 }}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        className="fixed right-0 top-0 h-full w-full max-w-[460px] bg-white dark:bg-slate-900 z-[190] shadow-2xl flex flex-col"
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold truncate">{lead.name || "Visitor"}</h3>
              <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", statusMeta?.cls)}>{statusMeta?.label}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {timeAgo(lead.created_at)} · <span className="capitalize">{lead.source.replaceAll("_", " ")}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex flex-col items-center gap-1 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 py-2.5 hover:bg-sky-100 dark:hover:bg-sky-950 transition-colors">
                <Phone className="w-4 h-4" /><span className="text-[10px] font-semibold">Call</span>
              </a>
            )}
            {phoneDigits && (
              <a href={whatsappNumber} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 rounded-xl bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 py-2.5 hover:bg-green-100 dark:hover:bg-green-950 transition-colors">
                <MessageCircle className="w-4 h-4" /><span className="text-[10px] font-semibold">WhatsApp</span>
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="flex flex-col items-center gap-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 py-2.5 hover:bg-amber-100 dark:hover:bg-amber-950 transition-colors">
                <Mail className="w-4 h-4" /><span className="text-[10px] font-semibold">Email</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button disabled={!!busy} onClick={() => patch({ status: "contacted" }, "contacted")} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50">
              <CheckCircle2 className="w-3.5 h-3.5" /> Contacted
            </button>
            <button disabled={!!busy} onClick={() => patch({ status: "quote_sent" }, "quote_sent")} className="flex items-center justify-center gap-1.5 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 py-2.5 text-xs font-semibold hover:bg-violet-200 dark:hover:bg-violet-900 transition-colors disabled:opacity-50">
              <Send className="w-3.5 h-3.5" /> Qualified
            </button>
            <button disabled={!!busy} onClick={() => patch({ status: "booked" }, "booked")} className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 py-2.5 text-xs font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors disabled:opacity-50">
              <Plane className="w-3.5 h-3.5" /> Booked
            </button>
            <button disabled={!!busy} onClick={() => patch({ archived: !lead.archived }, "archive")} className={cn("flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors disabled:opacity-50", lead.archived ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700" : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900")}>
              <Archive className="w-3.5 h-3.5" /> {lead.archived ? "Unarchive" : "Archive"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Status pipeline</label>
              <select
                value={lead.status}
                onChange={(e) => patch({ status: e.target.value }, "status")}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-xs"
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Assigned staff</label>
              <input
                value={lead.assigned_to}
                onChange={(e) => patch({ assigned_to: e.target.value }, "assign")}
                placeholder="Staff name / email"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-xs"
              />
            </div>
          </div>

          <Section icon={Users} title="Personal Information">
            <InfoRow label="Name" value={lead.name} />
            <InfoRow label="Email" value={lead.email} />
            <InfoRow label="Phone" value={lead.phone} mono />
            <InfoRow label="Country" value={lead.country} />
            <InfoRow label="IP Country" value={lead.ip_country} />
          </Section>

          <Section icon={Plane} title="Travel Information">
            <InfoRow label="Destination" value={lead.destination} />
            <InfoRow label="Travel date" value={lead.travel_date} />
            <InfoRow label="Budget" value={lead.budget} />
            <InfoRow label="Adults" value={lead.adults} />
            <InfoRow label="Children" value={lead.children} />
          </Section>

          {lead.message && (
            <Section icon={StickyNote} title="Message">
              <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
            </Section>
          )}

          <Section icon={History} title="Source & Context">
            <InfoRow label="Source page" value={lead.page} />
            <InfoRow label="UTM campaign" value={lead.utm_campaign} />
            <InfoRow label="UTM source" value={lead.utm_source} />
            <InfoRow label="UTM medium" value={lead.utm_medium} />
            <InfoRow label="Browser" value={browserLabel(lead.browser || "Unknown")} />
            <InfoRow label="Device" value={deviceLabel(lead.device || "Unknown")} />
            <InfoRow label="IP address" value={lead.ip} mono />
          </Section>

          <Section icon={CalendarClock} title="Follow-up Reminders">
            <div className="space-y-1.5">
              {(lead.reminders || []).map((r) => (
                <div key={r.id} className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 px-2.5 py-2">
                  <button
                    onClick={() => toggleReminder(r)}
                    className={cn("shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors", r.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300 dark:border-slate-600 hover:border-emerald-400")}
                  >
                    {r.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs", r.done && "line-through text-slate-400")}>{r.title}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {formatDateTime(r.due_at)}
                      {new Date(r.due_at).getTime() < Date.now() && !r.done && <span className="text-rose-500 font-semibold">overdue</span>}
                    </p>
                  </div>
                </div>
              ))}
              {(!lead.reminders || lead.reminders.length === 0) && (
                <p className="text-xs text-slate-400">No reminders yet</p>
              )}
              <div className="pt-1 space-y-1.5">
                <div className="flex gap-1.5">
                  {["Call tomorrow", "Email later", "Follow up in 3 days"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        const d = new Date()
                        if (preset.includes("tomorrow")) d.setDate(d.getDate() + 1)
                        if (preset.includes("3 days")) d.setDate(d.getDate() + 3)
                        setReminderTitle(preset)
                        setReminderDate(d.toISOString().slice(0, 16))
                      }}
                      className="flex-1 text-[10px] rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-slate-500 hover:border-amber-400 hover:text-amber-600 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input value={reminderTitle} onChange={(e) => setReminderTitle(e.target.value)} placeholder="Custom reminder" className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs min-w-0" />
                  <input type="datetime-local" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1.5 text-xs" />
                  <button onClick={addReminder} disabled={reminderSaving || !reminderTitle || !reminderDate} className="rounded-lg bg-amber-500 text-white px-2.5 py-1.5 hover:bg-amber-600 transition-colors disabled:opacity-40">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </Section>

          <Section icon={StickyNote} title="Add Note">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write an internal note…"
              rows={3}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-2 text-xs resize-none"
            />
            <button onClick={addNote} disabled={savingNote || !note.trim()} className="mt-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 text-xs font-semibold hover:opacity-80 transition-opacity disabled:opacity-40">
              Add note
            </button>
          </Section>

          <Section icon={History} title="Timeline">
            <div className="space-y-3">
              {(lead.events || []).map((ev) => (
                <div key={ev.id} className="relative pl-4">
                  <span className="absolute left-0 top-1 w-2 h-2 rounded-full bg-amber-400" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {timelineLabels[ev.event_type] || ev.event_type.replaceAll("_", " ")}
                  </p>
                  {ev.detail && <p className="text-xs text-slate-500 mt-0.5">{ev.detail}</p>}
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {formatDateTime(ev.created_at)}{ev.created_by ? ` · ${ev.created_by}` : ""}
                  </p>
                </div>
              ))}
              {(lead.events || []).length === 0 && <p className="text-xs text-slate-400">No timeline events</p>}
            </div>
          </Section>

          <button
            onClick={() => {
              if (confirm("Delete this lead permanently?")) {
                fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" }).then(() => onDeleted(leadId))
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 py-2 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete lead
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  )
}
