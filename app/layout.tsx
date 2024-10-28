import { Inter, Noto_Sans_Arabic } from 'next/font/google'
import { Providers } from './providers'
import { Toaster } from "@/components/ui/toaster"
import { Sidebar } from "@/components/navigation/Sidebar"
import SupabaseProvider from '@/components/providers/SupabaseProvider'
import { NotificationsProvider } from '@/components/providers/NotificationsProvider'
import { AppDataProvider } from '@/components/providers/AppDataProvider'
import { PreviewBanner } from '@/components/PreviewBanner'
import { Analytics } from '@/components/Analytics'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-arabic',
})

export const metadata: Metadata = {
  title: "Al'Raajih Quran Institute",
  description: 'Learn Quran with expert teachers online',
  keywords: ['Quran', 'Islamic Education', 'Online Learning', 'Tajweed', 'Arabic'],
  authors: [{ name: "Al'Raajih Quran Institute" }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alraajih.com',
    title: "Al'Raajih Quran Institute",
    description: 'Learn Quran with expert teachers online',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${notoSansArabic.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SupabaseProvider>
          <NotificationsProvider>
            <AppDataProvider>
              <Providers
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className="relative flex min-h-screen">
                  <Sidebar />
                  <main className="flex-1 pl-64">
                    <div className="fixed inset-0 islamic-pattern opacity-5" />
                    <div className="relative">
                      <PreviewBanner />
                      {children}
                    </div>
                  </main>
                </div>
                <Toaster />
                <Analytics />
              </Providers>
            </AppDataProvider>
          </NotificationsProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}