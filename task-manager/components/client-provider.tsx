'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

interface ClientProviderProps {
  children: ReactNode
}

const ClientProvider = ({ children }: ClientProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default ClientProvider 