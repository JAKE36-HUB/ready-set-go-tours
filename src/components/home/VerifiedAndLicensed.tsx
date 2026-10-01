import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Compass,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Star,
  Ticket,
  Users,
  type LucideIcon,
} from "lucide-react"

import {
  LICENCE_CREDENTIAL,
  PROFILE_CREDENTIALS,
  type CredentialIcon,
  type TrustCredential,
} from "@/lib/trustCredentials"
import { COMPANY, PLAN_SAFARI_ROUTE, whatsappLink } from "@/lib/constants"

const PACKAGES_ROUTE = "/holiday-packages"

const ICONS: Record<CredentialIcon, LucideIcon> = {
  star: Star,
  ticket: Ticket,
  compass: Compass,
  users: Users,
  shield: ShieldCheck,
}

/**
 * Brand mark for a credential.
 *
 * When we hold the platform's official file it is shown unmodified on a light
 * chip — the supplied assets are raster with solid backgrounds and no alpha
 * channel, so a white chip keeps every one of them legible on the card.
 * Otherwise falls back to a tinted monogram in the platform's brand colour.
 */
function CredentialMark({ credential, className }: { credential: TrustCredential; className: string }) {
  if (credential.logo) {
    return (
      <span className={`inline-flex items-center justify-center bg-white ${className}`}>
        <Image
          src={credential.logo.src}
          alt={credential.name}
          width={credential.logo.width}
          height={credential.logo.height}
          // Cap by intrinsic size so these small files are never upscaled.
          className="max-h-full w-auto max-w-full object-contain"
        />
      </span>
    )
  }

  const Icon = ICONS[credential.icon]
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl ${className}`}
      style={{
        backgroundColor: `color-mix(in oklab, ${credential.accent} 12%, transparent)`,
        borderColor: `color-mix(in oklab, ${credential.accent} 28%, transparent)`,
      }}
    >
      <Icon className="h-5 w-5" style={{ color: credential.accent }} aria-hidden="true" />
    </span>
  )
}

/** Opens a credential at its source. Always a real URL, never a placeholder. */
function SourceLink({ credential, className }: { credential: TrustCredential; className: string }) {
  if (!credential.url) return null
  return (
    <a
      href={credential.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={className}
      aria-label={`${credential.name} — ${credential.label} (opens in a new tab)`}
    >
      {credential.label}
      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
    </a>
  )
}

export function VerifiedAndLicensed() {
  const licence = LICENCE_CREDENTIAL
  const profiles = PROFILE_CREDENTIALS

  const intro = licence
    ? "Planning a safari is a big decision, so we would rather you check us than take our word for it. Our tourism licence number and our independent listings are all open for you to confirm at the source."
    : "Planning a safari is a big decision, so we would rather you check us than take our word for it. Our independent listings are open for you to confirm at the source."

  return (
    <section
      id="verified-and-licensed"
      className="relative py-20 sm:py-24 bg-background dark:bg-stone-950 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-amber-400">
            <BadgeCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Open To Scrutiny
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground mt-3 mb-4 leading-tight">
            Verified &amp; Licensed
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">{intro}</p>
        </div>

        {/* Licence — regulatory credential, not an endorsement. */}
        {licence?.licenceNumber && licence.url ? (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <ShieldCheck
                  className="w-5 h-5 text-primary dark:text-amber-400"
                  aria-hidden="true"
                />
              </span>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-display text-lg font-medium text-foreground leading-tight">
                  {licence.name} licence
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Licence No.{" "}
                  <span className="font-semibold text-foreground">{licence.licenceNumber}</span>
                </p>
              </div>
              <SourceLink
                credential={licence}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 hover:bg-muted/50 transition-all duration-300"
              />
            </div>
          </div>
        ) : null}

        {/* Independent listings */}
        {profiles.length > 0 ? (
          <div className="mb-12">
            <ul className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
              {profiles.map((profile) => (
                <li
                  key={profile.id}
                  className="group w-full sm:w-[248px] rounded-2xl border border-border bg-card px-5 py-7 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex justify-center">
                    <CredentialMark
                      credential={profile}
                      className="h-14 w-24 rounded-xl p-1.5"
                    />
                  </div>
                  <p className="mt-3.5 text-sm font-medium leading-tight text-muted-foreground">
                    {profile.name}
                  </p>
                  <div className="mt-2.5 flex justify-center">
                    <SourceLink
                      credential={profile}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:underline"
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
              Each link opens our own listing on that platform in a new tab. Platform names and marks
              belong to their respective owners and are shown only to identify where to find us.
            </p>
          </div>
        ) : null}

        {/* CTA */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground mb-3">
            Ready to plan your safari?
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed mb-8">
            Tell us the parks, dates and pace you have in mind and our team will build an itinerary
            around them.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              href={PACKAGES_ROUTE}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-semibold rounded-xl gradient-primary text-white shadow-premium hover:shadow-premium hover:scale-[1.03] transition-all duration-300"
            >
              Explore Safari Packages
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-7 text-base font-semibold rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-foreground hover:bg-[#25D366]/20 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
              Request a Safari Quote
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Prefer email?{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-medium text-primary dark:text-amber-400 hover:underline"
            >
              {COMPANY.email}
            </a>{" "}
            or start a{" "}
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="font-medium text-primary dark:text-amber-400 hover:underline"
            >
              safari plan
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}