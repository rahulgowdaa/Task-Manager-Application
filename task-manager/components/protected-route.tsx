"use client"

import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/signup'

  useEffect(() => {
    if (status === 'loading') return

    if (!session && !isAuthPage) {
      router.push('/login')
    }
  }, [session, status, router, isAuthPage])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!session && !isAuthPage) {
    return null
  }

  return <>{children}</>
}

