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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Holiday{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Curated safari, beach, and adventure packages designed for every type of traveler.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <PackagesBrowser packages={packages} initialType={type} />
    </main>
  );
}
