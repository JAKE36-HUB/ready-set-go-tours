import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase-auth";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AiChat } from "@/components/layout/AiChat";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import VisitorTracker from "@/components/admin/VisitorTracker";
import PopupBanner from "@/components/admin/PopupBanner";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: { google: "Tu2nq2Pl9nDmApYtFt6GsuYhhzyzhlSWzFM3nNq3Lm0" },
  title: {
    default: "Ready Set Go Tours & Travel | Luxury Kenya & Tanzania Safaris",
    template: "%s | Ready Set Go Tours & Travel",
  },
  description:
    "Premier luxury tour operator in Nairobi, Kenya. Explore extraordinary Kenya and Tanzania tours, safaris, beach holidays, and travel packages. Book your East African adventure today.",
  keywords: [
    "Ready Set Go Tours & Travel",
    "Tours and Travel Kenya",
    "Kenya Tours",
    "Kenya Travel Packages",
    "Tanzania Tours",
    "Masai Mara Tours",
    "Serengeti Tours",
    "Diani Beach Holidays",
    "Zanzibar Holidays",
    "Best Travel Agency Kenya",
    "Holiday Packages Kenya",
    "Wildlife Tours Kenya",
    "Luxury Tours Kenya",
    "Affordable Tours Kenya",
    "East Africa Travel",
  ],
  authors: [{ name: "Ready Set Go Tours & Travel" }],
  creator: "Ready Set Go Tours & Travel",
  publisher: "Ready Set Go Tours & Travel",
  metadataBase: new URL("https://readysetgosafaris.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Go Tours & Travel",
    title: "Ready Set Go Tours & Travel | Luxury Kenya & Tanzania Safaris",
    description:
      "Premier luxury tour operator in Nairobi, Kenya. Explore extraordinary Kenya and Tanzania tours, safaris, beach holidays, and travel packages.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ready Set Go Tours & Travel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ready Set Go Tours & Travel | Luxury Kenya & Tanzania Safaris",
    description:
      "Premier luxury tour operator in Nairobi, Kenya. Explore extraordinary Kenya and Tanzania tours, safaris, beach holidays, and travel packages.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head />
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Ready Set Go Tours & Travel",
              description:
                "Premier luxury tour operator based in Nairobi, Kenya, specializing in bespoke safaris and travel experiences across Kenya and Tanzania.",
              url: "https://readysetgosafaris.com",
              telephone: "+254797867411",
              email: "jaketish2@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Nairobi",
                addressRegion: "Nairobi",
                addressCountry: "KE",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                bestRating: "5",
                ratingCount: "127",
              },
              sameAs: [
                "https://facebook.com/readysetgotours",
                "https://instagram.com/readysetgosafaris",
              ],
            }),
          }}
        />
        <BreadcrumbJsonLd items={[{ name: "Home", item: "/" }]} />
        <SupabaseProvider>
        <VisitorTracker />
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AiChat />
          <WhatsAppButton />
          <ScrollToTop />
          <CookieConsent />
          <PopupBanner />
        </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
