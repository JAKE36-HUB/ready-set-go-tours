"use client";

import { useState } from "react";
import Image from "next/image";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import AnimatedSection from "@/components/AnimatedSection";
import { FAQ_ITEMS, COMPANY } from "@/lib/constants";
import { HelpCircle, Search } from "lucide-react";

const FAQ_CATEGORIES: Record<string, number[]> = {
  Safety: [4, 12, 15],
  Weather: [1],
  Accommodation: [6, 13],
  Transport: [7, 12, 21],
  Packing: [5],
  Payments: [9, 16],
  "Children & Family": [10],
  Insurance: [15],
  Cancellation: [11],
  "General": [2, 3, 8, 14, 17, 18, 19, 20, 22, 23, 24],
};

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [search, setSearch] = useState("");

  const categoryIds = FAQ_CATEGORIES[activeCategory] || [];
  let items = FAQ_ITEMS.filter((item) => categoryIds.includes(item.id));

  if (search.trim()) {
    const q = search.toLowerCase();
    items = FAQ_ITEMS.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg"
          alt="Wildlife in the African savanna"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <AnimatedSection direction="none">
            <HelpCircle className="size-12 text-sky-400 mx-auto mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Everything you need to know about planning your East African safari and travel experience.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <AnimatedSection>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-sky-500 focus:ring-3 focus:ring-sky-500/20 outline-none transition-all text-sm"
              />
            </div>
          </AnimatedSection>

          {/* Category Tabs */}
          <AnimatedSection>
            <div className="flex flex-wrap gap-2 mb-10">
              {Object.keys(FAQ_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearch(""); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat && !search
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Accordion */}
          <AnimatedSection>
            {items.length > 0 ? (
              <Accordion className="ring-1 ring-foreground/10 rounded-2xl bg-card p-2">
                {items.map((item) => (
                  <AccordionItem key={item.id} value={`faq-${item.id}`} className="border-b border-border/50 last:border-0">
                    <AccordionTrigger className="px-4 py-4 text-left text-foreground hover:no-underline hover:text-sky-600">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-card ring-1 ring-foreground/10">
                <HelpCircle className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No questions found. Try a different search term or category.
                </p>
              </div>
            )}
          </AnimatedSection>

          {/* Contact CTA */}
          <AnimatedSection>
            <div className="mt-16 text-center p-10 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 ring-1 ring-sky-100 dark:ring-sky-900/50">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Our travel experts are ready to help. Get in touch and we&apos;ll answer
                any questions about your safari.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
              >
                Contact Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
