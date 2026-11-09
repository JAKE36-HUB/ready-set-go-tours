import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Tag, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS, COMPANY } from "@/lib/constants";
import AnimatedSection from "@/components/AnimatedSection";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Travel Guide & Blog",
  description:
    "Expert travel tips, destination guides, and safari advice for Kenya and Tanzania. Plan your perfect East African adventure with insider knowledge.",
  openGraph: {
    url: "https://www.readysetgosafaris.com/travel-guide",
    title: `Travel Guide | ${COMPANY.name}`,
    description: "Expert safari tips and destination guides for East Africa.",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Travel Guide - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Travel Guide | ${COMPANY.name}`,
    description: "Expert safari tips and destination guides for East Africa.",
    images: ["/opengraph-image"],
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
          src="/images/local/pin_5ed9e7896df91ef4ad2acdc3d37b0b21.jpg"
          alt="Safari vehicle in the African wilderness"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06101C]/65 via-[#06101C]/40 to-[#06101C]/85" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection direction="none">
            <h1 className="mb-4 font-display text-4xl font-normal text-white sm:text-5xl lg:text-6xl">
              Travel <span className="italic text-[#F7CE84]">Guide</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-white/65">
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
              <article className="group relative mb-12 cursor-pointer overflow-hidden rounded-2xl ring-1 ring-border">
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
                    <span className="mb-3 inline-block rounded-full bg-[#F7CE84] px-3 py-1 text-xs font-semibold text-[#0B2A4A]">
                      {featured.category}
                    </span>
                    <h2 className="mb-3 font-display text-2xl font-normal text-white transition-colors group-hover:text-[#F7CE84] sm:text-3xl">
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
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-shadow hover:shadow-lg">
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
                        <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-white">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="mb-2 line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-accent">
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
                        <span className="flex items-center gap-1 font-medium text-accent transition-all group-hover:gap-2">
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
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                  <Tag className="size-4 text-accent" />
                  Categories
                </h3>
                <ul className="space-y-2">
                  {CATEGORIES.map((cat) => {
                    const count = BLOG_POSTS.filter((p) => p.category === cat).length;
                    return (
                      <li key={cat}>
                        <button className="flex w-full items-center justify-between py-1.5 text-sm text-muted-foreground transition-colors hover:text-accent">
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
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                  <Clock className="size-4 text-accent" />
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
                        <h4 className="line-clamp-2 text-xs font-semibold text-foreground transition-colors group-hover:text-accent">
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
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                  <Tag className="size-4 text-accent" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="cursor-pointer rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent"
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
