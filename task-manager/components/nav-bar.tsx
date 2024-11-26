"use client";

import { usePathname } from "next/navigation";
import { ProfileMenu } from "@/components/profile-menu";
import Link from "next/link";

const NavBar = () => {
  const pathname = usePathname();

  // Only render NavBar on the board page
  const isBoardPage = pathname === "/board";

  if (!isBoardPage) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/board" className="text-xl font-bold text-blue-600">
              Task Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export { NavBar };
