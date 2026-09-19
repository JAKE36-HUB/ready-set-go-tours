"use client"

import { useSyncExternalStore } from "react"

interface BookingModalState {
  open: boolean
  initialPackage?: string
}

let state: BookingModalState = { open: false }

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

export function openBookingModal(initialPackage?: string) {
  state = { open: true, initialPackage }
  emit()
}

export function closeBookingModal() {
  state = { open: false }
  emit()
}

export function useBookingModalStore(): BookingModalState {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange)
      return () => {
        listeners.delete(onStoreChange)
      }
    },
    () => state,
  )
}