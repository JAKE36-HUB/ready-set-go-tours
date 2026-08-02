"use client"

import type { Lead } from "@/lib/leads/types"
import { formatDate, formatDateTime, LEAD_STATUSES } from "@/lib/leads/types"
const statusLabel = (s: string) => LEAD_STATUSES.find((x) => x.value === s)?.label || s

function rowsOf(leads: Lead[]): (string | number)[][] {
  return leads.map((l) => [
    l.id,
    l.name,
    l.phone,
    l.email,
    l.country,
    l.destination,
    l.travel_date,
    l.budget,
    l.adults,
    l.children,
    l.message,
    l.source.replaceAll("_", " "),
    l.status.replaceAll("_", " "),
    l.assigned_to,
    formatDateTime(l.created_at),
    l.page,
  ])
}

const HEADERS = [
  "ID", "Name", "Phone", "Email", "Country", "Destination", "Travel Date", "Budget",
  "Adults", "Children", "Message", "Source", "Status", "Assigned To", "Inquiry Date", "Page",
]

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const esc = (v: string | number) => `"${String(v ?? "").replace(/"/g, '""')}"`

export function exportCSV(leads: Lead[]) {
  const csv = "\uFEFF" + [HEADERS, ...rowsOf(leads)].map((r) => r.map(esc).join(",")).join("\r\n")
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `leads-${new Date().toISOString().slice(0, 10)}.csv`)
}

export async function exportExcel(leads: Lead[]) {
  const XLSX = await import("xlsx")
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rowsOf(leads)])
  ws["!cols"] = HEADERS.map((h, i) => ({ wch: i < 8 ? 16 : 22 }))
  XLSX.utils.book_append_sheet(wb, ws, "Leads")
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  downloadBlob(new Blob([out], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `leads-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export async function exportPDF(leads: Lead[]) {
  const { Document, Page, Text, View, StyleSheet, renderToBuffer } = await import("@react-pdf/renderer")

  const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 7.5 },
    header: { marginBottom: 14 },
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
    subtitle: { color: "#64748b", marginBottom: 10 },
    row: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", paddingVertical: 4 },
    head: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#334155", paddingBottom: 4, marginBottom: 2, fontWeight: "bold" },
    col: { flex: 1, paddingRight: 6 },
  })

  const widths = [1, 1.4, 1.4, 1.6, 1, 1.4, 1, 1, 1, 1, 2.4, 1, 1.4, 1.2, 1.6, 1.4]
  const keys = HEADERS.length

  const DocumentPDF = (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Ready Set Go Safaris — Lead Export</Text>
          <Text style={styles.subtitle}>{leads.length} leads · Generated {new Date().toLocaleString()}</Text>
        </View>
        <View style={styles.head}>
          {HEADERS.map((h, i) => (
            <Text key={h} style={[styles.col, { flex: widths[i % keys] }]}>{h}</Text>
          ))}
        </View>
        {leads.map((l) => (
          <View key={l.id} style={styles.row} wrap={false}>
            {rowsOf([l])[0].map((cell, i) => (
              <Text key={i} style={[styles.col, { flex: widths[i % keys] }]}>{String(cell)}</Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  )

  const buffer = (await renderToBuffer(DocumentPDF)).buffer as ArrayBuffer
  downloadBlob(new Blob([buffer], { type: "application/pdf" }), `leads-${new Date().toISOString().slice(0, 10)}.pdf`)
}

export function leadCsvLink() {
  return `/api/admin/leads/export`
}

export { statusLabel }
