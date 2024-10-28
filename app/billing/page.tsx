import { Metadata } from "next"
import { BillingDashboard } from "@/components/billing/BillingDashboard"

export const metadata: Metadata = {
  title: "Billing & Payments | Al'Raajih Quran Institute",
  description: "Manage your payments and subscriptions",
}

export default function BillingPage() {
  return <BillingDashboard />
}