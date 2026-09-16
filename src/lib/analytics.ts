const CONVERSION_LABEL =
  process.env.NEXT_PUBLIC_GTAG_CONVERSION_LABEL || "AW-18369134468/UtA5CN6SoeEcEIT_irdE";

export function trackLeadConversion() {
  try {
    if (typeof window === "undefined" || !CONVERSION_LABEL) return;
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", { send_to: CONVERSION_LABEL });
    }
  } catch {}
}