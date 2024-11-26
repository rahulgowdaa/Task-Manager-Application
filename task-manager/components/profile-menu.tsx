"use client"

import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { User, LogOut } from "lucide-react"

export function ProfileMenu() {
  const { data: session } = useSession()
  const [showProfileDialog, setShowProfileDialog] = useState(false)

  if (!session?.user) {
    return null
  }

  // Get initials from first and last name, or email if names are not available
  const getInitials = () => {
    if (session.user.firstName && session.user.lastName) {
      return `${session.user.firstName[0]}${session.user.lastName[0]}`.toUpperCase()
    }
    if (session.user.email) {
      return session.user.email[0].toUpperCase()
    }
    return "U"
  }

  // Get display name
  const getDisplayName = () => {
    if (session.user.firstName && session.user.lastName) {
      return `${session.user.firstName} ${session.user.lastName}`
    }
    return session.user.email?.split('@')[0] || 'User'
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={session.user.image || ""} 
                alt={getDisplayName()} 
              />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {session.user.firstName && session.user.lastName && (
                <p className="font-medium">{getDisplayName()}</p>
              )}
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => setShowProfileDialog(true)}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-red-600"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              Your profile information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={session.user.image || ""} 
                  alt={getDisplayName()} 
                />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-4">
              {(session.user.firstName || session.user.lastName) && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Name:</span>
                  <span className="col-span-3">
                    {getDisplayName()}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Email:</span>
                <span className="col-span-3">{session.user.email}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium">Account:</span>
                <span className="col-span-3">
                  {session.user.image ? 'Google Account' : 'Email Account'}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 