"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/layout/BookingModal";
import { Plane } from "lucide-react";

interface Props {
  tourName: string;
  isCTA?: boolean;
}

export default function KenyaTourInteractive({ tourName, isCTA }: Props) {
  const [open, setOpen] = useState(false);

  if (isCTA) {
    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-8 h-11 shadow-lg shadow-sky-500/25"
        >
          <Plane className="size-4 mr-2" />
          Start Planning
        </Button>
        <BookingModal open={open} onOpenChange={setOpen} initialPackage={tourName} />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-6"
      >
        <Plane className="size-4 mr-2" />
        Book This Tour
      </Button>
      <BookingModal open={open} onOpenChange={setOpen} initialPackage={tourName} />
    </>
  );
}
