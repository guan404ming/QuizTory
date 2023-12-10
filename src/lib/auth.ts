import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { activityRecordTable, userRoleTable, userTable } from "@/db/schema";

import { privateEnv } from "./env/private";

export const authOptions: NextAuthOptions = {
  // Secret for Next-auth, without this JWT encryption/decryption won't work
  secret: privateEnv.NEXTAUTH_SECRET,

  events: {
    async signIn({ user }) {
      const [user_] = await db
        .insert(userTable)
        .values({
          name: user.name as string,
          email: user.email as string,
        })
        .onConflictDoUpdate({
          target: userTable.email,
          set: {
            name: user.name as string,
          },
        })
        .returning()
        .execute();

      await db
        .insert(userRoleTable)
        .values({
          role: "Normal",
          userId: user_.id,
        })
        .onConflictDoNothing()
        .execute();

      await db.insert(activityRecordTable).values({
        type: "SIGN_IN",
        userId: user_.id,
      });
    },

    signOut: async ({ token }) => {
      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, token.email!))
        .execute();

      await db.insert(activityRecordTable).values({
        type: "SIGN_OUT",
        userId: user.id,
      });
    },
  },

  callbacks: {
    async session({ session }) {
      const [user] = await db
        .select({ role: userRoleTable.role })
        .from(userTable)
        .innerJoin(userRoleTable, eq(userRoleTable.userId, userTable.id))
        .where(eq(userTable.email, session.user.email!))
        .execute();

      session.user.role = user.role;

      return {
        ...session,
      };
    },
  },

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: privateEnv.GOOGLE_CLIENT_ID as string,
      clientSecret: privateEnv.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
};
