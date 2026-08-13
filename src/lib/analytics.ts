const CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GTAG_CONVERSION_LABEL || "";

export function trackLeadConversion() {
  try {
    if (typeof window === "undefined" || !CONVERSION_LABEL) return;
    const w = window as any;
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", { send_to: CONVERSION_LABEL });
    }
  } catch {}
}