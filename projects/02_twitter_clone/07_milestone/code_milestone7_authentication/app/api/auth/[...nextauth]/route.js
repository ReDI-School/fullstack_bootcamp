import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { makeSureDbIsReady } from "@/lib/db";
import { User } from "@/models/User";

// Mock users for demo/testing purposes (fallback when no DB)
const mockUsers = [
  {
    id: "1",
    username: "john",
    password: "password123",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: "2",
    username: "jane",
    password: "password123",
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: "3",
    username: "demo",
    password: "demo",
    name: "Demo User",
    email: "demo@example.com",
  },
];

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "john" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if database should be used
        const shouldUseDatabase =
          process.env.MONGODB_URI && process.env.MONGODB_URI.length > 0;

        if (shouldUseDatabase) {
          try {
            // Try to authenticate with database
            await makeSureDbIsReady();

            // Find user by username
            const user = await User.findOne({
              username: credentials?.username,
            }).select("+password"); // Explicitly include password field

            if (!user) {
              console.log("❌ User not found in database");
              return null;
            }

            // Compare password with hashed password
            const isPasswordValid = await bcrypt.compare(
              credentials?.password,
              user.password
            );

            if (!isPasswordValid) {
              console.log("❌ Invalid password");
              return null;
            }

            console.log("✅ Database authentication successful");
            // Return user object (without password)
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              username: user.username,
            };
          } catch (error) {
            console.warn(
              "⚠️ Database authentication error, falling back to mock users:",
              error.message
            );
          }
        }

        // Fallback to mock users
        console.log("🔄 Using mock user authentication");
        const user = mockUsers.find(
          (u) => u.username === credentials?.username
        );

        // Check if user exists and password matches (plain text for mock)
        if (user && user.password === credentials?.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token on sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
