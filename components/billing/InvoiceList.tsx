"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download } from "lucide-react"

const invoices = [
  {
    id: "INV-2024-001",
    date: "March 1, 2024",
    amount: "$99.00",
    description: "Premium Plan - Monthly Subscription",
    status: "Paid"
  },
  {
    id: "INV-2024-002",
    date: "February 1, 2024",
    amount: "$99.00",
    description: "Premium Plan - Monthly Subscription",
    status: "Paid"
  }
]

export function InvoiceList() {
  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id} className="hover-card-effect">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{invoice.description}</h3>
                  <span className="font-semibold">{invoice.amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>Invoice #{invoice.id}</div>
                  <div>{invoice.date}</div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}