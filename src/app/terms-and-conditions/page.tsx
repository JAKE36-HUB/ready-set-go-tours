import type { Metadata } from "next";
import { COMPANY, PAYMENT_POLICY } from "@/lib/constants";
import { FileText } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Booking, payment, and cancellation terms for Ready Set Go Tours & Travel safari packages. Understand deposits, refunds, and how we handle your booking.",
  openGraph: {
    title: `Terms & Conditions | ${COMPANY.name}`,
    description:
      "Booking, payment, and cancellation terms for Ready Set Go Tours & Travel safari packages.",
    type: "website",
  },
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Terms & Conditions", item: "/terms-and-conditions" },
      ]} />
      <main className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-sky-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Terms & Conditions</h1>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>
              These terms govern bookings made with {COMPANY.name} for safari, beach, and
              mountain packages across Kenya and Tanzania. By making a booking or inquiry,
              you agree to the terms below.
            </p>

            <h2>1. Booking & Payment</h2>
            <ul>
              <li>A deposit of {PAYMENT_POLICY.depositPercent} {PAYMENT_POLICY.depositNote}.</li>
              <li>Balance is due {PAYMENT_POLICY.balanceDue}.</li>
              <li>
                Payments can be made by bank transfer to our account in Nairobi. Payment details
                are provided on your confirmed invoice.
              </li>
              <li>
                Prices are quoted per person in USD (non-resident) or Kenyan Shillings (resident)
                and include the items listed on each package page unless stated otherwise.
              </li>
            </ul>

            <h2>2. Cancellation Policy</h2>
            <ul>
              <li>{PAYMENT_POLICY.freeCancellation}.</li>
              <li>{PAYMENT_POLICY.partialRefund}.</li>
              <li>{PAYMENT_POLICY.noRefund}.</li>
            </ul>

            <h2>3. Itinerary Changes</h2>
            <p>
              We reserve the right to adjust itineraries due to weather, road conditions,
              wildlife movement, or other operational factors. Accommodation may be substituted
              with a lodge of a similar standard when necessary. Any change is made to protect
              your safety and experience.
            </p>

            <h2>4. Passports, Visas & Vaccinations</h2>
            <p>
              You are responsible for holding a valid passport (at least 6 months&apos; validity),
              obtaining the necessary visas (e-visas for Kenya and Tanzania are available
              online), and any required vaccinations or health certificates before travel. We
              can assist with visa applications and advise on requirements.
            </p>

            <h2>5. Travel Insurance</h2>
            <p>
              Comprehensive travel insurance covering medical expenses, evacuation, trip
              cancellation, and personal belongings is strongly recommended for all travelers
              and is required for trekking packages.
            </p>

            <h2>6. Liability</h2>
            <p>
              While we take every care to deliver the experience described, {COMPANY.name} acts
              as an agent for the third-party operators, lodges, and airlines that provide your
              services and is not liable for events beyond our reasonable control, including
              flight delays, natural events (force majeure), or actions of third parties.
            </p>

            <h2>7. Health & Fitness</h2>
            <p>
              Mountain trekking and some safari activities require a reasonable level of fitness
              and may have medical restrictions. Please consult your doctor before booking.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Contact us at {COMPANY.email} or call {COMPANY.phone}.
            </p>
            <p className="text-sm text-muted-foreground mt-8">
              Last updated: August 2026
            </p>
          </div>
        </div>
      </main>
    </>
  );
}