"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/context/AuthContext";
import { useEffect } from "react";

export default function CompletePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="mb-8 animate-fadeIn">
          <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Setup Complete!
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your Linktree page is ready to go. You can now start sharing your
            links with the world.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-8 py-3 rounded-lg text-white bg-black
              transform hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]
              transition-all duration-300 ease-out
              relative overflow-hidden
              group
              text-lg font-medium"
          >
            <span className="relative z-10">Continue to Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </main>
  );
}
