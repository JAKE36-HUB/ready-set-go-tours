import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export interface SimilarPackage {
  name: string;
  slug: string;
  image: string;
  price: number;
  duration: string;
  description: string;
}

export default function SimilarPackages({
  packages,
  title = "Similar Safaris",
}: {
  packages: SimilarPackage[];
  title?: string;
}) {
  if (!packages || packages.length === 0) return null;

  return (
    <section className="py-16 px-6 border-t border-foreground/5 bg-card/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-foreground">
            {title}
          </h2>
          <Link
            href="/holiday-packages"
            className="inline-flex items-center gap-1.5 text-sm text-primary dark:text-amber-400 hover:underline shrink-0"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p) => (
            <Link
              key={p.slug}
              href={`/holiday-packages/${p.slug}`}
              className="group flex flex-col bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 right-3 rounded-xl bg-stone-950/70 backdrop-blur px-3 py-1.5 text-white ring-1 ring-white/15">
                  <span className="text-sm font-semibold leading-none">
                    ${p.price.toLocaleString()}
                    <span className="text-[10px] font-normal text-white/60"> /pp</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-display text-lg font-medium text-foreground mb-2 leading-snug">
                  {p.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {p.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t border-foreground/5">
                  <Clock className="size-3.5 text-primary dark:text-amber-400" />
                  {p.duration}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
