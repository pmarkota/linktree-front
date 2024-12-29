"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/context/AuthContext";
import { businessCategoryService } from "../../../src/services/businessCategoryService";
import ProgressSteps from "@/components/ProgressSteps";
import toast from "react-hot-toast";

// Icons for each business type
const businessIcons = {
  Doctor: "👨‍⚕️",
  Mentor: "👨‍🏫",
  Artist: "🎨",
  Musician: "🎵",
  "Fitness Trainer": "💪",
  "Business Owner": "💼",
  "Content Creator": "🎥",
  Writer: "✍️",
  Developer: "💻",
};

export default function BusinessTypePage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/onboarding/phone");
        return;
      }
      loadCategories();
    }
  }, [user, authLoading, router]);

  const loadCategories = async () => {
    try {
      const response = await businessCategoryService.getCategories();
      if (response.success) {
        setCategories(response.categories);
      }
    } catch (error) {
      setError("Failed to load business categories");
      toast.error("Failed to load business categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryId) => {
    if (!user?.token) {
      toast.error("Please log in to continue");
      router.push("/onboarding/phone");
      return;
    }

    setSelectedCategory(categoryId);
    try {
      const response = await businessCategoryService.selectCategory(
        categoryId,
        user.token
      );
      if (response.success) {
        toast.success("Business type selected successfully!");
        router.push("/onboarding/brand-name");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save business type");
      console.error("Category selection error:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full animate-slideDown mb-12">
          <ProgressSteps />
        </div>

        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-bold text-black mb-4">
            What's your site primarily about?
          </h1>
          <p className="text-xl text-black font-medium max-w-2xl mx-auto">
            Choose the category that best describes your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 
                transform hover:scale-[1.02] hover:-translate-y-1
                ${
                  selectedCategory === category.id
                    ? "bg-black text-white"
                    : "bg-white hover:bg-gray-50"
                }
                border-2 ${
                  selectedCategory === category.id
                    ? "border-black"
                    : "border-black/10"
                }
                hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                h-full
              `}
            >
              <div className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div
                    className={`w-20 h-20 flex items-center justify-center rounded-2xl 
                    ${
                      selectedCategory === category.id
                        ? "bg-white/20"
                        : "bg-black/5"
                    }`}
                  >
                    <span className="text-5xl text-black transform transition-transform group-hover:scale-110">
                      {businessIcons[category.name] || "🎯"}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold mb-3 ${
                        selectedCategory === category.id
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {category.name}
                    </h3>
                    {category.description && (
                      <p
                        className={`text-lg leading-relaxed font-medium ${
                          selectedCategory === category.id
                            ? "text-white"
                            : "text-black"
                        }`}
                      >
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {selectedCategory === category.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                    <svg
                      className="w-5 h-5 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-8 p-6 rounded-xl bg-red-50 border-2 border-red-500 text-red-700 text-center text-lg font-medium">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
