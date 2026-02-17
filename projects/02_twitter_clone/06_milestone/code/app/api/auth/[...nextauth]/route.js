import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Mock users for demo/testing purposes
const users = [
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
        // Find user by username
        const user = users.find(
          (u) => u.username === credentials?.username
        );

        // Check if user exists and password matches
        if (user && user.password === credentials?.password) {
          // Return user object (without password)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
          };
        }

        // Return null if authentication fails
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
