import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  country: z.string().min(2, "Please enter your country of residence"),
  destination: z.string().min(2, "Please select or enter a destination"),
  package: z.string().optional(),
  travelDate: z.string().min(1, "Please select a preferred travel date"),
  adults: z.string().min(1, "Please indicate number of adults"),
  children: z.string().optional(),
  budget: z.string().min(1, "Please select a budget range"),
  specialRequests: z.string().optional(),
});

export const bookingFormSchema = contactFormSchema;

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
