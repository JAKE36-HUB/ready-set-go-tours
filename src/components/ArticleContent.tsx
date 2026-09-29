import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, MessageCircle, Send, Compass } from "lucide-react";

import { COMPANY, PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants";
import type { ArticleBlock, ArticleFaq } from "@/lib/articles/types";

const INLINE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE.lastIndex = 0;
  while ((match = INLINE.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1]) {
      nodes.push(
        <Link
          key={`l${key++}`}
          href={match[2]}
          className="text-sky-600 dark:text-sky-400 font-medium underline underline-offset-4 decoration-sky-500/40 hover:decoration-sky-500 transition-colors"
        >
          {match[1]}
        </Link>,
      );
    } else if (match[3]) {
      nodes.push(
        <strong key={`b${key++}`} className="font-semibold text-foreground">
          {match[3]}
        </strong>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function CtaSection() {
  return (
    <section className="mt-14 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/60 p-7 sm:p-10 text-white ring-1 ring-white/10 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 mb-3">
        Ready Set Go Safaris
      </p>
      <p className="text-base sm:text-lg text-white/75 leading-relaxed mb-6">
        Ready to experience Kenya in comfort and style? Contact Ready Set Go Tours
        &amp; Travel and let our local safari team create a private luxury itinerary
        around your travel dates, interests and budget.
      </p>
      <p className="text-sm text-white/60 leading-relaxed mb-8">
        Tell us how many days you have, who is travelling and roughly what you have
        in mind, and we will come back with a written day-by-day quotation — including
        what is included, and what is not.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-semibold shadow-lg shadow-amber-900/30 transition-all"
        >
          <Send className="size-4" />
          Request a Quote
        </Link>
        <a
          href={whatsappLink(
            "Hello Ready Set Go Safaris, I'd like a quotation for a private luxury safari in Kenya.",
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-[#25D366] hover:bg-[#1fb857] text-white text-sm font-semibold transition-all"
        >
          <MessageCircle className="size-4" />
          WhatsApp Us
        </a>
        <Link
          href="/holiday-packages"
          className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium ring-1 ring-white/20 transition-all"
        >
          <Compass className="size-4" />
          Explore Kenya Safari Packages
        </Link>
      </div>
      <p className="text-xs text-white/45 mt-6">
        Prefer to call?{" "}
        <a href={`tel:${COMPANY.phone}`} className="text-amber-300 hover:underline">
          {COMPANY.phone}
        </a>{" "}
        · {COMPANY.hours} ·{" "}
        <a href={PLAN_SAFARI_ROUTE} className="text-amber-300 hover:underline">
          Start your safari plan online
        </a>
      </p>
    </section>
  );
}

export function ArticleContent({
  blocks,
  faqs,
}: {
  blocks: ArticleBlock[];
  faqs?: ArticleFaq[];
}) {
  const toc = blocks
    .filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ text: b.text, id: slugify(b.text) }));

  return (
    <div>
      {toc.length > 2 && (
        <nav
          aria-label="On this page"
          className="mb-10 rounded-2xl bg-muted/40 ring-1 ring-foreground/10 p-6"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
            On this page
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex items-start gap-1.5 text-sm text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  <ArrowRight className="size-3.5 mt-0.5 shrink-0 opacity-60" />
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                id={slugify(block.text)}
                className="font-display text-2xl sm:text-3xl font-medium text-foreground mt-14 mb-5 leading-tight scroll-mt-24"
              >
                {block.text}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                id={slugify(block.text)}
                className="text-xl sm:text-2xl font-semibold text-foreground mt-10 mb-4 leading-snug scroll-mt-24"
              >
                {block.text}
              </h3>
            );

          case "p":
            return (
              <p
                key={i}
                className="text-muted-foreground leading-relaxed mb-5 text-[15px] sm:text-base"
              >
                {renderInline(block.text)}
              </p>
            );

          case "ul":
            return (
              <ul key={i} className="mb-6 space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[15px] sm:text-base">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                    />
                    <span className="text-muted-foreground leading-relaxed">
                      {renderInline(item)}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "faq":
            if (!faqs?.length) return null;
            return (
              <div className="mt-2 space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5 sm:p-6"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            );

          default:
            return null;
        }
      })}

      <CtaSection />
    </div>
  );
}
