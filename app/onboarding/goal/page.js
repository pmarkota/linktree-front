"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import { useAuth } from "../../../src/context/AuthContext";
import { goalService } from "../../../src/services/goalService";
import toast from "react-hot-toast";

const goals = [
  {
    id: "Creator",
    title: "Creator",
    description: "Share your content and grow your audience",
    icon: "🎥",
  },
  {
    id: "Business",
    title: "Business",
    description: "Promote your products and services",
    icon: "💼",
  },
  {
    id: "Personal",
    title: "Personal",
    description: "Share your personal links and social media",
    icon: "👤",
  },
];

export default function GoalPage() {
  const [selectedGoal, setSelectedGoal] = useState(null);
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

    if (!selectedGoal) {
      return;
    }

    setLoading(true);
    try {
      const response = await goalService.updateGoal(selectedGoal, user.token);
      if (response.success) {
        toast.success("Goal saved successfully!");
        router.push("/onboarding/template");
      } else {
        toast.error(response.message || "Failed to save goal");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save goal");
      console.error("Goal update error:", error);
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
        <ProgressSteps currentStep="goal" />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-fadeIn">
          <h1 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
            What's your goal?
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Choose what best describes your goal for using Linktree
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  className={`
                    p-6 rounded-xl cursor-pointer
                    transform hover:scale-[1.02] transition-all duration-300
                    ${
                      selectedGoal === goal.id
                        ? "bg-black text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                        : "bg-white border-2 border-gray-200 hover:border-black hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]"
                    }
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{goal.icon}</div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold ${
                          selectedGoal === goal.id
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {goal.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          selectedGoal === goal.id
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <div
                        className={`w-6 h-6 rounded-full border-2 
                          ${
                            selectedGoal === goal.id
                              ? "border-white bg-white"
                              : "border-gray-300"
                          }
                          flex items-center justify-center
                        `}
                      >
                        {selectedGoal === goal.id && (
                          <div className="w-3 h-3 rounded-full bg-black" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!selectedGoal || loading}
                className={`
                  px-8 py-3 rounded-lg text-white text-lg font-medium
                  transform hover:scale-[1.02] transition-all duration-300
                  relative overflow-hidden group
                  ${
                    selectedGoal && !loading
                      ? "bg-black hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                      : "bg-gray-300 cursor-not-allowed"
                  }
                `}
              >
                <span className="relative z-10">
                  {loading ? "Saving..." : "Continue"}
                </span>
                {selectedGoal && !loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
