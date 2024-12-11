import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface SessionOptions {
    jwt?: boolean;
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.users.findUnique({
          where: { email: credentials?.email },
        });

        if (user && bcrypt.compareSync(credentials?.password || "", users.password)) {
          return { id: users.id, email: users.email, role: users.role };
        }

        return null;
      },
    }),
  ],
  session: { jwt: true as any, maxAge: 30 * 24 * 60 * 60 },
});
