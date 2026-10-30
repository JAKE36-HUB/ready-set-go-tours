import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Safari Deals & Offers",
  description: "Discover exclusive deals on Kenya and Tanzania safaris, Mount Kenya adventures, beach holidays, and group packages. Save up to 25% on your dream East African safari.",
  openGraph: {
    url: "https://www.readysetgosafaris.com/deals",
    title: "Best Safari Deals & Special Offers | Ready Set Go Tours",
    description: "Exclusive early bird, group, and last-minute deals on East African safaris. Save up to 25% on luxury tented camps, Mount Kenya treks, and beach holidays.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Safari Deals & Special Offers - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Safari Deals & Special Offers | Ready Set Go Tours",
    description: "Exclusive early bird, group, and last-minute deals on East African safaris. Save up to 25% on luxury tented camps, Mount Kenya treks, and beach holidays.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/deals",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
