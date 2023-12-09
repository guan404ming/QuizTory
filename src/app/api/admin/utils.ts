import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function getAdminServerSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    throw Error("No session!");
  } else {
    if (session.user.role !== "Admin") {
      throw Error("Authentication Error");
    }
    return session;
  }
}
