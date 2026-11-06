"use client";

import { Button } from "@/components/ui/button";
import { openBookingModal } from "@/lib/booking-store";
import { Plane } from "lucide-react";

interface Props {
  tourName: string;
  isCTA?: boolean;
}

export default function TanzaniaTourInteractive({ tourName, isCTA }: Props) {
  if (isCTA) {
    return (
      <Button
        onClick={() => openBookingModal(tourName)}
        className="h-11 bg-accent px-8 text-white shadow-lg shadow-accent/20 hover:bg-accent/90"
      >
        <Plane className="mr-2 size-4" />
        Get a Free Quote
      </Button>
    );
  }

  return (
    <Button
      onClick={() => openBookingModal(tourName)}
      className="bg-accent px-6 text-white hover:bg-accent/90"
    >
      <Plane className="mr-2 size-4" />
      Get a Free Quote
    </Button>
  );
}