"use client";

import { SessionProvider } from "next-auth/react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CommentsProvider } from "@/context/CommentsContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <FavoritesProvider>
        <CommentsProvider>
          {children}
        </CommentsProvider>
      </FavoritesProvider>
    </SessionProvider>
  );
}
