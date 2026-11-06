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
 * Where we hold the platform's official file it is shown unmodified inside a
 * bordered white chip. The frame matters: the supplied artwork has sharp
 * corners, so an unframed white block reads as a misaligned rectangle rather
 * than a logo. Logos are sized by height and left to take their natural width,
 * so a wide wordmark is not forced into a square.
 *
 * Falls back to a tinted monogram where no file is held.
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
          className="h-7 w-auto max-w-[150px] object-contain"
        />
      </span>
    )
  }

  const Icon = ICONS[credential.icon]
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl border ${className}`}
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
      className="relative scroll-mt-24 bg-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Open To Scrutiny
          </span>
          <h2 className="mb-4 mt-3 font-display text-3xl font-normal leading-tight text-foreground sm:text-4xl">
            Verified &amp; Licensed
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">{intro}</p>
        </div>

        {/* Licence — regulatory credential, not an endorsement. */}
        {licence?.licenceNumber && licence.url ? (
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 sm:flex-row sm:items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </span>
              <div className="flex-1 text-center sm:text-left">
                <p className="font-display text-lg font-normal leading-tight text-foreground">
                  {licence.name} licence
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Licence No.{" "}
                  <span className="font-semibold text-foreground">{licence.licenceNumber}</span>
                </p>
              </div>
              <SourceLink
                credential={licence}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/40 hover:bg-muted/50"
              />
            </div>
          </div>
        ) : null}

        {/* Independent listings */}
        {profiles.length > 0 ? (
          <div className="mb-12">
            <ul className="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
              {profiles.map((profile) => (
                <li
                  key={profile.id}
                  className="group w-full rounded-2xl border border-border bg-card px-5 py-7 text-center shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover sm:w-[248px]"
                >
                  <div className="flex justify-center">
                    <CredentialMark
                      credential={profile}
                      className="h-12 rounded-md border border-border px-3.5"
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
            <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
              Each link opens our own listing on that platform in a new tab. Platform names and marks
              belong to their respective owners and are shown only to identify where to find us.
            </p>
          </div>
        ) : null}

        {/* CTA */}
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="mb-3 font-display text-2xl font-normal text-foreground sm:text-3xl">
            Ready to plan your safari?
          </h3>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            Tell us the parks, dates and pace you have in mind and our team will build an itinerary
            around them.
          </p>

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href={PACKAGES_ROUTE}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            >
              Explore Safari Packages
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-7 text-base font-semibold text-foreground transition-all duration-300 hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
              Request a Safari Quote
            </a>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Prefer email?{" "}
            <a
              href={`mailto:${COMPANY.email}`}
              className="font-medium text-primary hover:underline"
            >
              {COMPANY.email}
            </a>{" "}
            or start a{" "}
            <Link
              href={PLAN_SAFARI_ROUTE}
              className="font-medium text-primary hover:underline"
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