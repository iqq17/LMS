import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Al'Raajih Quran Institute
          </h1>
          <p className="text-muted-foreground">
            Welcome to our Learning Management System
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/preview" className="w-full">
            <Button className="w-full">
              Preview All Pages
            </Button>
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link href="/student">
              <Button variant="outline" className="w-full">
                Student Portal
              </Button>
            </Link>
            <Link href="/teacher">
              <Button variant="outline" className="w-full">
                Teacher Portal
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}