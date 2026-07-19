import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `Travel Guide & Blog | ${COMPANY.name}`,
  description:
    "Expert travel tips, destination guides, and safari advice for Kenya and Tanzania. Plan your perfect East African adventure with insider knowledge.",
  keywords: [
    "Kenya safari tips",
    "Tanzania travel guide",
    "safari packing list",
    "Masai Mara guide",
    "Kilimanjaro climbing tips",
  ],
  openGraph: {
    title: `Travel Guide | ${COMPANY.name}`,
    description: "Expert safari tips and destination guides for East Africa.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Travel Guide - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/travel-guide",
  },
};

const CATEGORIES = [...new Set(BLOG_POSTS.map((p) => p.category))];
const TAGS = ["Safari", "Beach", "Mountain", "Wildlife", "Culture", "Luxury", "Family", "Photography", "Budget", "Tips"];

export default function TravelGuidePage() {
  const featured = BLOG_POSTS[0];
  const posts = BLOG_POSTS.slice(1);
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Travel Guide", item: "/travel-guide" },
      ]} />
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/5e/d9/e7/5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Safari vehicle in the African wilderness"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Travel{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-sky-300 bg-clip-text text-transparent">
                Guide
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Expert insights, destination guides, and insider tips from our team of East Africa specialists.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Article */}
            <AnimatedSection>
              <Link href={`/travel-guide/${featured.slug}`}>
              <article className="group relative rounded-2xl overflow-hidden ring-1 ring-foreground/10 mb-12 cursor-pointer">
                <div className="relative aspect-[16/9] sm:aspect-[2/1]">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-semibold mb-3">
                      {featured.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-white/70 text-sm sm:text-base max-w-2xl mb-4 hidden sm:block">
                      {featured.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      <span className="flex items-center gap-1.5">
                        <User className="size-3" />
                        {featured.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        {featured.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3" />
                        8 min read
                      </span>
                    </div>
                  </div>
                </div>
              </article>
              </Link>
            </AnimatedSection>

            {/* Posts Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {posts.map((post, i) => (
                <AnimatedSection key={post.id} delay={i * 0.05}>
                  <Link href={`/travel-guide/${post.slug}`}>
                  <article className="group flex flex-col bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white text-[10px] font-semibold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="size-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {post.date}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-sky-500 font-medium group-hover:gap-2 transition-all">
                          Read <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            {/* Categories */}
            <AnimatedSection direction="right" delay={0}>
              <div className="p-6 rounded-2xl bg-card ring-1 ring-foreground/10">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="size-4 text-sky-500" />
                  Categories
                </h3>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const count = BLOG_POSTS.filter((p) => p.category === cat).length;
                    return (
                      <li key={cat}>
                        <button className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-sky-500 transition-colors py-1.5">
                          {cat}
                          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AnimatedSection>

            {/* Recent Posts */}
            <AnimatedSection direction="right" delay={0.1}>
              <div className="p-6 rounded-2xl bg-card ring-1 ring-foreground/10">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="size-4 text-sky-500" />
                  Recent Posts
                </h3>
                <div className="space-y-4">
                  {BLOG_POSTS.slice(0, 5).map((post) => (
                    <Link key={post.id} href={`/travel-guide/${post.slug}`}>
                    <div className="flex gap-3 group cursor-pointer">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-sky-500 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-1">{post.date}</p>
                      </div>
                    </div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Tags */}
            <AnimatedSection direction="right" delay={0.2}>
              <div className="p-6 rounded-2xl bg-card ring-1 ring-foreground/10">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="size-4 text-sky-500" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground hover:bg-sky-50 hover:text-sky-600 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </aside>
        </div>
      </div>
    </main>
    </>
  );
}
