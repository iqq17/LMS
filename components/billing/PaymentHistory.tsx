"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, CheckCircle } from "lucide-react"

const payments = [
  {
    id: 1,
    date: "March 1, 2024",
    amount: "$99.00",
    status: "Completed",
    method: "Visa ending in 4242",
    description: "Premium Plan - Monthly Subscription"
  },
  {
    id: 2,
    date: "February 1, 2024",
    amount: "$99.00",
    status: "Completed",
    method: "Visa ending in 4242",
    description: "Premium Plan - Monthly Subscription"
  }
]

export function PaymentHistory() {
  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="hover-card-effect">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{payment.description}</h3>
                  <span className="font-semibold">{payment.amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>{payment.method}</div>
                  <div>{payment.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{payment.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}