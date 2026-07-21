import dynamic from "next/dynamic"

const HeroSection = dynamic(() => import("@/components/home/HeroSection").then((m) => m.HeroSection))
const TrustStrip = dynamic(() => import("@/components/home/TrustStrip").then((m) => m.TrustStrip))
const FeaturedDeals = dynamic(() => import("@/components/home/FeaturedDeals").then((m) => m.FeaturedDeals))
const FeaturedDestinations = dynamic(() => import("@/components/home/FeaturedDestinations").then((m) => m.FeaturedDestinations))
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks").then((m) => m.HowItWorks))
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs").then((m) => m.WhyChooseUs))
const TestimonialsCarousel = dynamic(() => import("@/components/home/TestimonialsCarousel").then((m) => m.TestimonialsCarousel))
const BlogPreview = dynamic(() => import("@/components/home/BlogPreview").then((m) => m.BlogPreview))
const FinalCTA = dynamic(() => import("@/components/home/FinalCTA").then((m) => m.FinalCTA))
const StickyMobileCTA = dynamic(() => import("@/components/home/StickyMobileCTA").then((m) => m.StickyMobileCTA))
const HomeClient = dynamic(() => import("@/components/home/HomeClient").then((m) => m.HomeClient))

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <FeaturedDeals />
      <FeaturedDestinations />
      <HowItWorks />
      <HomeClient />
      <WhyChooseUs />
      <TestimonialsCarousel />
      <BlogPreview />
      <FinalCTA />
      <StickyMobileCTA />
    </>
  )
}
