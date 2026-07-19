import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, User, Tag, Clock, ArrowLeft, ChevronRight } from "lucide-react";
import { BLOG_POSTS, COMPANY } from "@/lib/constants";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | ${COMPANY.name}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
      type: "article",
    },
    alternates: {
      canonical: `/travel-guide/${slug}`,
    },
  };
}

const READING_TIME: Record<number, string> = {
  1: "8 min read",
  2: "10 min read",
  3: "8 min read",
  4: "6 min read",
  5: "7 min read",
  6: "9 min read",
  7: "7 min read",
  8: "7 min read",
  9: "8 min read",
  10: "6 min read",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter(
    (p) => p.category === post.category && p.id !== post.id
  ).slice(0, 3);

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Travel Guide", item: "/travel-guide" },
        { name: post.title, item: `/travel-guide/${slug}` },
      ]} />
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`/travel-guide/${slug}`}
        authorName="Ready Set Go Tours & Travel"
      />
      <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-semibold mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/60 text-sm">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {READING_TIME[post.id] || "8 min read"}
            </span>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-sky-500 transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/travel-guide" className="hover:text-sky-500 transition-colors">
            Travel Guide
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
        </nav>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed mb-6 text-[15px] sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-foreground/10">
          <Tag className="size-4 text-muted-foreground mt-0.5" />
          {[post.category, "Kenya", "Safari", "Travel Tips"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground hover:bg-sky-50 hover:text-sky-600 transition-colors cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author Card */}
        <div className="mt-10 p-6 rounded-2xl bg-card ring-1 ring-foreground/10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-foreground">{post.author}</p>
            <p className="text-sm text-muted-foreground">
              Travel Specialist at {COMPANY.shortName}
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-10">
          <Link
            href="/travel-guide"
            className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-400 font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Travel Guide
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/travel-guide/${r.slug}`}>
                  <article className="group flex flex-col bg-card rounded-2xl ring-1 ring-foreground/10 overflow-hidden hover:shadow-lg transition-all h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white text-[10px] font-semibold">
                          {r.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors">
                        {r.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                        {r.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
    </>
  );
}
