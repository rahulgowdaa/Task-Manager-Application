import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientProvider from "@/components/client-provider"
import { NavBar } from "@/components/nav-bar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A Trello-like task management application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
        <ClientProvider>
          <div className="min-h-screen bg-gray-100">
            <NavBar />
            <main className="container mx-auto p-4">
              {children}
            </main>
          </div>
          <Toaster />
        </ClientProvider>
      </body>
    </html>
  )
}

