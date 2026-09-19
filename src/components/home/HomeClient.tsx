"use client"

import { TourPackages } from "./TourPackages"
import { MoreServices } from "./MoreServices"
import { openBookingModal } from "@/lib/booking-store"

export function HomeClient() {
  const handleReserve = (name: string) => {
    openBookingModal(name)
  }

  return (
    <>
      <TourPackages onReserve={handleReserve} />
      <MoreServices onReserve={handleReserve} />
    </>
  )
}
