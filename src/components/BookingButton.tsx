"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/layout/BookingModal";

export default function BookingButton({
  packageName,
  className,
  children,
}: {
  packageName: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className={className}>
        {children}
      </Button>
      <BookingModal open={open} onOpenChange={setOpen} initialPackage={packageName} />
    </>
  );
}
