import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { privateEnv } from "./env/private";

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: privateEnv.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: privateEnv.GOOGLE_CLIENT_ID as string,
      clientSecret: privateEnv.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};
