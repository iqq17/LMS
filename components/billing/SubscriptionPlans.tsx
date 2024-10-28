"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: "$49",
    features: [
      "4 One-on-One Sessions/Month",
      "Basic Learning Resources",
      "Email Support",
      "Progress Tracking"
    ],
    recommended: false
  },
  {
    name: "Premium",
    price: "$99",
    features: [
      "8 One-on-One Sessions/Month",
      "Premium Learning Resources",
      "Priority Support",
      "Advanced Progress Tracking",
      "Group Study Sessions",
      "Recorded Sessions"
    ],
    recommended: true
  },
  {
    name: "Pro",
    price: "$149",
    features: [
      "12 One-on-One Sessions/Month",
      "All Premium Features",
      "24/7 Priority Support",
      "Personalized Study Plan",
      "Certification Program",
      "Family Discount"
    ],
    recommended: false
  }
]

export function SubscriptionPlans() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.name}
          className={`hover-card-effect relative ${
            plan.recommended ? "border-primary" : ""
          }`}
        >
          {plan.recommended && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-center">
              <div className="text-lg font-semibold">{plan.name}</div>
              <div className="text-3xl font-bold mt-2">
                {plan.price}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={plan.recommended ? "default" : "outline"}>
              {plan.recommended ? "Upgrade Plan" : "Select Plan"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}