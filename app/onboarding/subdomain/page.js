"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import { useAuth } from "../../../src/context/AuthContext";
import { subdomainService } from "../../../src/services/subdomainService";
import toast from "react-hot-toast";

export default function SubdomainPage() {
  const [subdomain, setSubdomain] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
    }
  }, [user, router]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (subdomain.length < 3) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const response = await subdomainService.checkAvailability(subdomain);
        setIsAvailable(response.isAvailable);
      } catch (error) {
        console.error("Error checking subdomain availability:", error);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    const debounceTimer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(debounceTimer);
  }, [subdomain]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      toast.error("Please log in to continue");
      router.push("/onboarding/phone");
      return;
    }

    if (!isAvailable) {
      return;
    }

    setLoading(true);
    try {
      const response = await subdomainService.updateSubdomain(
        subdomain,
        user.token
      );
      if (response.success) {
        toast.success("Subdomain saved successfully!");
        router.push("/onboarding/goal");
      } else {
        toast.error(response.message || "Failed to save subdomain");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save subdomain");
      console.error("Subdomain update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!subdomain) return "text-gray-500";
    if (isChecking) return "text-blue-500";
    if (isAvailable) return "text-green-500";
    return "text-red-500";
  };

  const getStatusMessage = () => {
    if (!subdomain) return "Choose your unique username";
    if (subdomain.length < 3) return "Username must be at least 3 characters";
    if (isChecking) return "Checking availability...";
    if (isAvailable) return "This username is available!";
    return "This username is not available";
  };

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full pt-8 animate-slideDown">
        <ProgressSteps currentStep="subdomain" />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-fadeIn">
          <h1 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
            Create your online identity
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Choose a unique username for your Linktree
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label
                htmlFor="subdomain"
                className="block text-base font-semibold text-gray-700 mb-2 transition-transform group-focus-within:-translate-y-1"
              >
                Username
              </label>
              <div
                className={`
                relative rounded-lg transition-all duration-300
                ${isFocused ? "shadow-[0_0_15px_rgba(0,0,0,0.1)]" : ""}
              `}
              >
                <div className="relative">
                  <input
                    type="text"
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) =>
                      setSubdomain(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                      )
                    }
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-full pl-4 pr-32 py-4 border-2 border-gray-300 rounded-lg
                      focus:border-black focus:outline-none focus:ring-0
                      transition-all duration-300
                      text-2xl font-semibold text-black
                      placeholder:text-gray-400 placeholder:text-xl placeholder:font-normal
                      bg-gray-50 focus:bg-white"
                    placeholder="username"
                    required
                    minLength={3}
                    maxLength={30}
                    pattern="[a-z0-9-]+"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                    .linktree.me
                  </div>
                </div>
              </div>
              <p
                className={`mt-2 text-sm ${getStatusColor()} transition-colors duration-300`}
              >
                {getStatusMessage()}
              </p>
            </div>
            <button
              type="submit"
              disabled={!isAvailable}
              className={`w-full py-4 px-6 rounded-lg
                transform hover:scale-[1.02] transition-all duration-300 ease-out
                relative overflow-hidden group text-lg font-medium
                ${
                  isAvailable
                    ? "bg-black text-white hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <span className="relative z-10">Continue</span>
              {isAvailable && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
