"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const steps = [
  { name: "Phone", path: "/onboarding/phone", icon: "📱" },
  { name: "OTP", path: "/onboarding/phone", icon: "🔒", isOtpStep: true },
  { name: "Business", path: "/onboarding/business-type", icon: "💼" },
  { name: "Brand", path: "/onboarding/brand-name", icon: "✨" },
  { name: "Identity", path: "/onboarding/subdomain", icon: "🎯" },
  { name: "Goals", path: "/onboarding/goal", icon: "🎯" },
  { name: "Template", path: "/onboarding/template", icon: "🎨" },
  { name: "Social", path: "/onboarding/social", icon: "🌐" },
  { name: "Profile", path: "/onboarding/profile", icon: "👤" },
];

export default function ProgressSteps() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if we're in OTP verification mode
    const otpMode = sessionStorage.getItem("otpMode");
    setIsOtpVisible(otpMode === "true");
  }, []);

  const currentStepIndex = mounted
    ? Math.max(
        0,
        steps.findIndex((step) => {
          if (step.isOtpStep && isOtpVisible) {
            return true;
          }
          if (!step.isOtpStep) {
            return pathname?.toLowerCase() === step.path.toLowerCase();
          }
          return false;
        })
      )
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
        <div className="text-sm font-medium text-gray-500">
          {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-500 ease-out"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="hidden sm:flex justify-between mt-4">
        {steps.map((step, index) => {
          if (step.isOtpStep && !isOtpVisible) return null;

          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div
              key={step.name}
              className={`
                flex flex-col items-center
                ${isPending ? "opacity-30" : ""}
                ${isActive ? "transform scale-110" : ""}
                transition-all duration-300
              `}
            >
              <div
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${
                    isActive
                      ? "bg-black text-white shadow-lg"
                      : isCompleted
                      ? "bg-black text-white"
                      : "bg-gray-100"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm">{step.icon}</span>
                )}
              </div>
              <span
                className={`
                  mt-1 text-xs font-medium
                  ${isActive ? "text-black" : "text-gray-500"}
                `}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
