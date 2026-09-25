"use client"

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer"
import { COMPANY } from "@/lib/constants"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#059669",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
  },
  logoSub: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: "#6b7280",
    marginBottom: 24,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#059669",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    width: 100,
  },
  value: {
    fontSize: 10,
    color: "#1e293b",
    flex: 1,
  },
  highlightItem: {
    fontSize: 10,
    color: "#1e293b",
    marginBottom: 4,
    paddingLeft: 12,
  },
  bullet: {
    fontSize: 10,
    color: "#059669",
    marginRight: 6,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  description: {
    fontSize: 10,
    color: "#4b5563",
    lineHeight: 1.7,
    marginBottom: 20,
  },
  priceBox: {
    backgroundColor: "#f0fdf4",
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 10,
    color: "#6b7280",
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
  },
  contactRow: {
    flexDirection: "row",
    gap: 20,
  },
  contactItem: {
    fontSize: 8,
    color: "#9ca3af",
  },
})

interface PackageData {
  name: string
  description: string
  duration: string
  price?: number
  accommodation: string
  meals: string
  transport: string
  highlights: string[]
  activities: string[]
  included?: string[]
}

function ItineraryDocument({ data }: { data: PackageData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>{COMPANY.shortName}</Text>
            <Text style={styles.logoSub}>{COMPANY.tagline}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Itinerary</Text>
          </View>
        </View>

        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.subtitle}>{data.duration}</Text>

        {data.price && (
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Package Price</Text>
            <Text style={styles.priceValue}>${data.price.toLocaleString()} / person</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{data.duration}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Accommodation</Text>
            <Text style={styles.value}>{data.accommodation}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Meals</Text>
            <Text style={styles.value}>{data.meals}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transport</Text>
            <Text style={styles.value}>{data.transport}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          {data.highlights.map((h, i) => (
            <View key={i} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.highlightItem}>{h}</Text>
            </View>
          ))}
        </View>

        {data.activities && data.activities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            {data.activities.map((a, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.highlightItem}>{a}</Text>
              </View>
            ))}
          </View>
        )}

        {data.included && data.included.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What&apos;s Included</Text>
            {data.included.map((item, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.highlightItem}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>{COMPANY.shortName} — {COMPANY.tagline}</Text>
          <Text style={styles.footerText}>{COMPANY.email} | {COMPANY.phone}</Text>
        </View>
      </Page>
    </Document>
  )
}

interface PdfItineraryProps {
  data: PackageData
  buttonLabel?: string
  className?: string
}

export default function PdfItinerary({ data, buttonLabel = "Download Itinerary", className = "" }: PdfItineraryProps) {
  return (
    <PDFDownloadLink
      document={<ItineraryDocument data={data} />}
      fileName={`${data.name.replace(/\s+/g, "-").toLowerCase()}-itinerary.pdf`}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 ${className}`}
    >
      {({ loading }) => (loading ? "Generating PDF..." : buttonLabel)}
    </PDFDownloadLink>
  )
}
