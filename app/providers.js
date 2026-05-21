"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/AuthContext";

/**
 * Wrap the app in providers that need the React tree:
 *   - AuthProvider (auth state + token persistence)
 *   - Toaster (global toast notifications)
 */
export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            fontSize: "14px",
          },
        }}
      />
    </AuthProvider>
  );
}
