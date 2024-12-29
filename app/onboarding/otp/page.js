"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    // TODO: Implement OTP verification API call
    router.push("/onboarding/business-type");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full pt-8 animate-slideDown">
        <ProgressSteps />
      </div>
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm animate-fadeIn">
          <h1 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-600">
            Enter verification code
          </h1>
          <p className="text-center text-gray-600 mb-8 text-lg">
            We've sent a 6-digit code to your phone
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between max-w-xs mx-auto gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-16 text-center text-3xl font-bold border-2 border-gray-300 
                    rounded-xl focus:border-black focus:outline-none focus:ring-0
                    transition-all duration-300
                    focus:shadow-[0_0_15px_rgba(0,0,0,0.1)]
                    transform focus:scale-110
                    bg-gray-50 focus:bg-white
                    text-black"
                  required
                />
              ))}
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
              <span className="relative z-10">Verify</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
