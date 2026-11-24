import type { Metadata } from "next";
import { SupabaseProvider } from "@/lib/supabase-auth";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "Admin Panel | Ready Set Go Tours",
  description: "Secure admin panel for Ready Set Go Tours & Travel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseProvider>
      <AdminShell>{children}</AdminShell>
    </SupabaseProvider>
  );
}