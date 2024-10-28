"use client"

import { createContext, useContext } from 'react'
import { useAppData, type AppData } from '@/hooks/useAppData'

const AppDataContext = createContext<AppData | null>(null)

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const data = useAppData()

  return (
    <AppDataContext.Provider value={data}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppDataContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppDataProvider')
  }
  return context
}