/**
 * Credentials shown in the homepage "Verified & Licensed" section.
 *
 * Every entry here is a claim we can evidence, and each one is either a link a
 * visitor can follow to the source, or a licence number they can look up:
 *
 *  - `profile` entries point at our own listing on a third-party marketplace.
 *  - `licence` entries are regulatory, NOT endorsements. We state the licence
 *    number and link to the regulator so anyone can confirm it themselves.
 *
 * Nothing in this file asserts a rating, review count, award or endorsement
 * that the platform does not itself publish.
 *
 * BRAND MARKS
 * `accent` is a restrained brand-adjacent tint used for the monogram chip and
 * the platform name. It is a colour, not a logo — no third-party mark artwork
 * is reproduced here.
 *
 * To use each platform's REAL logo, download the official asset from that
 * platform's partner/brand portal and drop it in /public/trust/, then set
 * `logoSrc`. Tripadvisor and Trustpilot both restrict use of their marks to
 * what their brand guidelines permit, so keep the supplied file unmodified and
 * use it only alongside the link to our own listing.
 */

export type CredentialKind = "profile" | "licence";

/** Lucide icon name, resolved to a component in the section. */
export type CredentialIcon = "star" | "ticket" | "compass" | "users" | "shield";

export interface TrustCredential {
  /** Stable key. */
  id: string;
  /** Name exactly as the organisation writes it. */
  name: string;
  kind: CredentialKind;
  /**
   * Our profile/listing, or the regulator's site. Null keeps the row hidden
   * rather than pointing visitors somewhere unhelpful.
   */
  url: string | null;
  /** One factual line. Never "endorsed by", never "rated". */
  label: string;
  /** Licence number for `licence` rows. Null until supplied by the business. */
  licenceNumber?: string | null;
  /** Restrained brand-adjacent tint for the monogram and name. */
  accent: string;
  icon: CredentialIcon;
  /** Official asset under /public/trust/. Omit unless we hold the real file. */
  logoSrc?: string;
}

/**
 * Our Tourism Regulatory Authority licence number, exactly as printed on the
 * licence (see https://tra.go.ke — "Entities Licensed by TRA").
 *
 * Left null on purpose. Until the real number is supplied the licence row does
 * not render at all, so the site never displays an unverified licence.
 */
export const TRA_LICENCE_NUMBER: string | null = null;

const CREDENTIALS: TrustCredential[] = [
  {
    id: "getyourguide",
    name: "GetYourGuide",
    kind: "profile",
    url: "https://www.getyourguide.com/nairobi-l267/hell-s-gate-national-park-day-trip-with-guide-t1224599",
    // Activity listings under "Readyset Go Tours and TravelLimited". GetYourGuide
    // blocks automated requests, so the live score has not been read; display a
    // number only once it has been confirmed on the page itself.
    label: "Our Nairobi activities",
    accent: "#0F7173",
    icon: "ticket",
  },
  {
    id: "tripadvisor",
    name: "Tripadvisor",
    kind: "profile",
    url: "https://www.tripadvisor.com/Attraction_Review-g294207-d34148496-Reviews-Readyset_go_Tours_and_Travel_limited-Nairobi.html",
    label: "Our Tripadvisor listing",
    accent: "#00803E",
    icon: "star",
  },
  {
    id: "safaribookings",
    name: "SafariBookings",
    kind: "profile",
    url: "https://www.safaribookings.com/p7886",
    label: "Our operator profile",
    accent: "#A16207",
    icon: "compass",
  },
  {
    id: "tourhq",
    name: "tourHQ",
    kind: "profile",
    url: "https://www.tourhq.com/guide/KE66736/readyset-go-tours-and-travel",
    label: "Our guide profile",
    accent: "#0E7490",
    icon: "users",
  },
  {
    id: "tra",
    name: "Tourism Regulatory Authority",
    kind: "licence",
    url: "https://tra.go.ke/",
    label: "Licensed tour operator",
    licenceNumber: TRA_LICENCE_NUMBER,
    accent: "#B45309",
    icon: "shield",
  },
];

/** Rows that are safe to render: real destination plus whatever the kind needs. */
export const RENDERABLE_CREDENTIALS: TrustCredential[] = CREDENTIALS.filter(
  (c) => Boolean(c.url) && (c.kind !== "licence" || Boolean(c.licenceNumber))
);

/** The licence row, once a real licence number exists. */
export const LICENCE_CREDENTIAL: TrustCredential | null =
  RENDERABLE_CREDENTIALS.find((c) => c.kind === "licence") ?? null;

/** Third-party listings a traveller can open. */
export const PROFILE_CREDENTIALS: TrustCredential[] = RENDERABLE_CREDENTIALS.filter(
  (c) => c.kind === "profile"
);