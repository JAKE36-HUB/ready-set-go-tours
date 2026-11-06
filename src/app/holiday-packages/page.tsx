import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Holiday Packages", item: "/holiday-packages" },
        ]}
      />
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#08130E]/65 via-[#08130E]/40 to-[#08130E]/80" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E4C9A3]">Holiday Packages</span>
            <h1 className="mb-5 mt-4 font-display text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
              Safaris worth planning a trip around
            </h1>
            <p className="mx-auto max-w-xl text-lg text-white/70">
              Curated safari, beach, and adventure packages — each one fully customisable to the way you travel.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <PackagesBrowser packages={packages} initialType={type} />
    </main>
  );
}
