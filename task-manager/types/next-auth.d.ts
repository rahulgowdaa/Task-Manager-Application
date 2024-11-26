import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    firstName?: string | null
    lastName?: string | null
  }
} 