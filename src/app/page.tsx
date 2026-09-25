import dynamic from "next/dynamic"

const HeroSection = dynamic(() => import("@/components/home/HeroSection").then((m) => m.HeroSection))
const TripFinder = dynamic(() => import("@/components/home/TripFinder").then((m) => m.TripFinder))
const FeaturedSafaris = dynamic(() => import("@/components/home/FeaturedSafaris").then((m) => m.FeaturedSafaris))
const CustomSafari = dynamic(() => import("@/components/home/CustomSafari").then((m) => m.CustomSafari))
const WhyChooseUs = dynamic(() => import("@/components/home/WhyChooseUs").then((m) => m.WhyChooseUs))
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks").then((m) => m.HowItWorks))
const HoneymoonSection = dynamic(() => import("@/components/home/HoneymoonSection").then((m) => m.HoneymoonSection))
const TestimonialsCarousel = dynamic(() => import("@/components/home/TestimonialsCarousel").then((m) => m.TestimonialsCarousel))
const FeaturedDestinations = dynamic(() => import("@/components/home/FeaturedDestinations").then((m) => m.FeaturedDestinations))
const FinalCTA = dynamic(() => import("@/components/home/FinalCTA").then((m) => m.FinalCTA))
const StickyMobileCTA = dynamic(() => import("@/components/home/StickyMobileCTA").then((m) => m.StickyMobileCTA))

export default function Home() {
  return (
    <>
      <HeroSection />
      <TripFinder />
      <FeaturedSafaris />
      <CustomSafari />
      <WhyChooseUs />
      <HowItWorks />
      <HoneymoonSection />
      <TestimonialsCarousel />
      <FeaturedDestinations />
      <FinalCTA />
      <StickyMobileCTA />
    </>
  )
}