"use client"

import { useState } from "react"

import { TourPackages } from "./TourPackages"
import { MoreServices } from "./MoreServices"
import { BookingModal } from "@/components/layout/BookingModal"

export function HomeClient() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookingPackage, setBookingPackage] = useState<string | undefined>()

  const handleReserve = (name: string) => {
    setBookingPackage(name)
    setBookingOpen(true)
  }

  return (
    <>
      <TourPackages onReserve={handleReserve} />
      <MoreServices onReserve={handleReserve} />
      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} initialPackage={bookingPackage} />
    </>
  )
}
