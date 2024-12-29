"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import { useAuth } from "../../../src/context/AuthContext";
import { brandService } from "../../../src/services/brandService";
import toast from "react-hot-toast";

export default function BrandNamePage() {
  const [brandName, setBrandName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      toast.error("Please log in to continue");
      router.push("/onboarding/phone");
      return;
    }

    setLoading(true);
    try {
      const response = await brandService.updateBrandName(
        brandName,
        user.token
      );
      if (response.success) {
        toast.success("Brand name saved successfully!");
        router.push("/onboarding/subdomain");
      } else {
        toast.error(response.message || "Failed to save brand name");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save brand name");
      console.error("Brand name update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full pt-8 animate-slideDown">
        <ProgressSteps />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-fadeIn">
          <h1 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
            What's your name?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your name or brand name
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label
                htmlFor="brandName"
                className="block text-base font-semibold text-gray-700 mb-2 transition-transform group-focus-within:-translate-y-1"
              >
                Name
              </label>
              <div
                className={`
                relative rounded-lg transition-all duration-300
                ${isFocused ? "shadow-[0_0_15px_rgba(0,0,0,0.1)]" : ""}
              `}
              >
                <input
                  type="text"
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg
                    focus:border-black focus:outline-none focus:ring-0
                    transition-all duration-300
                    text-2xl font-semibold text-black
                    placeholder:text-gray-400 placeholder:text-xl placeholder:font-normal
                    bg-gray-50 focus:bg-white"
                  placeholder="John Doe"
                  required
                  minLength={2}
                  maxLength={50}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This is how you'll be known on your Linktree
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-4 px-6 rounded-lg
                transform hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]
                transition-all duration-300 ease-out
                relative overflow-hidden
                group
                text-lg font-medium"
            >
              <span className="relative z-10">Continue</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
