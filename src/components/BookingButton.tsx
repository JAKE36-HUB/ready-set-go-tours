"use client";

import { Button } from "@/components/ui/button";
import { openBookingModal } from "@/lib/booking-store";

export default function BookingButton({
  packageName,
  className,
  children,
}: {
  packageName: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button onClick={() => openBookingModal(packageName)} className={className}>
      {children}
    </Button>
  );
}