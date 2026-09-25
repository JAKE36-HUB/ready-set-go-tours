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
        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-8 h-11 shadow-lg shadow-amber-500/25"
      >
        <Plane className="size-4 mr-2" />
        Get a Free Quote
      </Button>
    );
  }

  return (
    <Button
      onClick={() => openBookingModal(tourName)}
      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-6"
    >
      <Plane className="size-4 mr-2" />
      Get a Free Quote
    </Button>
  );
}