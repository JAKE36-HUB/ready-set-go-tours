import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { getSupabase } from "@/lib/supabase";
import PackagesBrowser, { type PackageCard } from "@/components/PackagesBrowser";

export const revalidate = 3600;

export default async function HolidayPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  let packages: PackageCard[] = [];
  try {
    const { data } = await getSupabase()
      .from("tour_packages")
      .select("*")
      .order("name");
    if (data) packages = data.map((p: Record<string, unknown>) => ({ ...p, priceKES: p.price_kes }) as PackageCard);
  } catch {}

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/local/pin_6c1781159da9a07da57937cc49282cf9.jpg"
          alt="Safari experience"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-400">Holiday Packages</span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-white mt-4 mb-5 leading-tight">
              Safaris worth planning a trip around
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Curated safari, beach, and adventure packages — each one fully customisable to the way you travel.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <PackagesBrowser packages={packages} initialType={type} />
    </main>
  );
}
