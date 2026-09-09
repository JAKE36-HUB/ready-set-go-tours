import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { SupabaseProvider } from "@/lib/supabase-auth";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { ClientWidgets } from "@/components/ClientWidgets";
import { COMPANY } from "@/lib/constants";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

export const metadata: Metadata = {
  verification: {
    google: "Tu2nq2Pl9nDmApYtFt6GsuYhhzyzhlSWzFM3nNq3Lm0",
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } }
      : {}),
  },
  title: {
    default: "Ready Set Go Tours & Travel | Luxury Kenya & Tanzania Safaris",
    template: "%s | Ready Set Go Tours & Travel",
  },
  description:
    "Premier luxury tour operator in Nairobi, Kenya. Kenya and Tanzania tours, safaris, beach holidays, and travel packages. Book your East African adventure today.",
  authors: [{ name: "Ready Set Go Tours & Travel" }],
  creator: "Ready Set Go Tours & Travel",
  publisher: "Ready Set Go Tours & Travel",
  metadataBase: new URL("https://www.readysetgosafaris.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ready Set Go Tours & Travel",
    title: "Ready Set Go Tours & Travel | Luxury Kenya & Tanzania Safaris",
    description:
      "Premier luxury tour operator in Nairobi, Kenya. Explore extraordinary Kenya and Tanzania tours, safaris, beach holidays, and travel packages.",
    images: [
      {
        url: "/opengraph-image.png",
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
    images: ["/opengraph-image.png"],
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
      className={`${GeistSans.variable} antialiased`}
    >
      <head>
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: COMPANY.name,
              description: COMPANY.description,
              url: "https://www.readysetgosafaris.com",
              telephone: COMPANY.phone,
              email: COMPANY.email,
              address: {
                "@type": "PostalAddress",
                streetAddress: COMPANY.address,
                addressRegion: "Nairobi",
                addressCountry: "KE",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                bestRating: "5",
                ratingCount: "127",
              },
              sameAs: Object.values(COMPANY.social),
            }),
          }}
        />
        <Analytics />
        <Script
          id="gtag-ads"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-18369134468"
        />
        <Script id="gtag-ads-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18369134468');
          `}
        </Script>
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <Script
              id="ga4"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_CLARITY_ID && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `}
          </Script>
        )}
        <SupabaseProvider>
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ClientWidgets />
        </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
