import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";
import { Shield } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: `Privacy Policy | ${COMPANY.name}`,
  description:
    "Learn how Ready Set Go Tours & Travel collects, uses, and protects your personal information. Our privacy policy outlines your rights and our practices.",
  openGraph: {
    title: `Privacy Policy | ${COMPANY.name}`,
    description:
      "Learn how Ready Set Go Tours & Travel collects, uses, and protects your personal information.",
    type: "website",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Privacy Policy", item: "/privacy-policy" },
      ]} />
      <main className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-sky-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            At {COMPANY.name}, we take your privacy seriously. This policy outlines how we
            collect, use, and protect your personal information.
          </p>
          <h2>Information We Collect</h2>
          <p>
            We collect information you provide when filling out forms on our website, including
            your name, email address, phone number, travel preferences, and any other details
            you submit as part of a booking inquiry.
          </p>
          <h2>How We Use Your Information</h2>
          <p>
            We use your information solely to respond to your inquiries, provide travel
            recommendations, process bookings, and improve our services. We do not sell or
            share your personal data with third parties for marketing purposes.
          </p>
          <h2>Cookies</h2>
          <p>
            Our website uses cookies to enhance your browsing experience and analyze site
            traffic. You can control cookie preferences through your browser settings.
          </p>
          <h2>Contact</h2>
          <p>
            If you have any questions about this policy, please contact us at {COMPANY.email}
            or call {COMPANY.phone}.
          </p>
          <p className="text-sm text-muted-foreground mt-8">
            Last updated: July 2026
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
