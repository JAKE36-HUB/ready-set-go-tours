import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Ready Set Go Tours & Travel",
  description: "Sign in to the Ready Set Go Tours & Travel admin panel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}