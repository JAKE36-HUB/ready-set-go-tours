import { ShieldCheck, Wallet, CalendarClock, RotateCcw } from "lucide-react";

import { PAYMENT_POLICY } from "@/lib/constants";

export function PaymentPolicy() {
  return (
    <div className="rounded-2xl bg-card ring-1 ring-foreground/10 p-5">
      <h3 className="font-semibold text-foreground mb-4">Payment &amp; Cancellation</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-3">
          <Wallet className="size-4 text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-muted-foreground">
            <span className="font-medium text-foreground">{PAYMENT_POLICY.depositPercent} deposit</span>{" "}
            {PAYMENT_POLICY.depositNote}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <CalendarClock className="size-4 text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-muted-foreground">
            Balance due <span className="font-medium text-foreground">{PAYMENT_POLICY.balanceDue}</span>
          </span>
        </li>
        <li className="flex items-start gap-3">
          <RotateCcw className="size-4 text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-muted-foreground">{PAYMENT_POLICY.freeCancellation}</span>
        </li>
        <li className="flex items-start gap-3">
          <ShieldCheck className="size-4 text-emerald-500 shrink-0 mt-0.5" />
          <span className="text-muted-foreground">
            {PAYMENT_POLICY.partialRefund}; {PAYMENT_POLICY.noRefund}
          </span>
        </li>
      </ul>
    </div>
  );
}