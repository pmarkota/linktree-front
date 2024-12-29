"use client";

import { AuthProvider } from "@/src/context/AuthContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      {children}
    </AuthProvider>
  );
}
