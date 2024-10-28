import { Metadata } from "next"
import { SettingsDashboard } from "@/components/settings/SettingsDashboard"
import { BackButton } from "@/components/navigation/BackButton"

export const metadata: Metadata = {
  title: "Settings | Al'Raajih Quran Institute",
  description: "Manage your account and preferences",
}

export default function SettingsPage() {
  return (
    <div className="p-4">
      <BackButton />
      <SettingsDashboard />
    </div>
  )
}