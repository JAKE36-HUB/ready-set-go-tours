"use client"

import dynamic from "next/dynamic"
import { closeBookingModal, useBookingModalStore } from "@/lib/booking-store"

const BookingModal = dynamic(
  () => import("@/components/layout/BookingModal").then((m) => m.BookingModal),
  { ssr: false }
)

export function BookingModalHost() {
  const { open, initialPackage } = useBookingModalStore()

  if (!open) return null

  return (
    <BookingModal
      open={open}
      onOpenChange={(next) => {
        if (!next) closeBookingModal()
      }}
      initialPackage={initialPackage}
    />
  )
}