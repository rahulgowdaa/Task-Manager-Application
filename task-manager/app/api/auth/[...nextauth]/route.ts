import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Import authOptions from the shared configuration file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
