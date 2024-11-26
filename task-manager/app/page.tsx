"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded
    if (session) {
      // If logged in, redirect to the board page
      router.replace("/board");
    } else {
      // If not logged in, redirect to the login page
      router.replace("/login");
    }
  }, [session, status, router]);

  return null; // Render nothing since we are redirecting
}
