"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressSteps from "@/components/ProgressSteps";
import { useAuth } from "../../../src/context/AuthContext";
import { templateService } from "../../../src/services/templateService";
import toast from "react-hot-toast";

// Fallback templates in case API fails
const fallbackTemplates = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Minimal",
    description: "Clean and simple design",
    preview_image_url: "/templates/minimal.png",
    template_data: {
      colors: ["#000000", "#FFFFFF"],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Gradient",
    description: "Modern gradient background",
    preview_image_url: "/templates/gradient.png",
    template_data: {
      colors: ["#FF416C", "#FF4B2B"],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Professional",
    description: "Perfect for business profiles",
    preview_image_url: "/templates/professional.png",
    template_data: {
      colors: ["#2C3E50", "#3498DB"],
    },
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Creative",
    description: "Stand out with unique design",
    preview_image_url: "/templates/creative.png",
    template_data: {
      colors: ["#8E2DE2", "#4A00E0"],
    },
  },
];

export default function TemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [templates, setTemplates] = useState(fallbackTemplates);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
      return;
    }

    const fetchTemplates = async () => {
      try {
        const response = await templateService.getTemplates(user.token);
        if (response.success && response.templates.length > 0) {
          setTemplates(response.templates);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        toast.error("Failed to load templates. Using default options.");
      }
    };

    fetchTemplates();
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    if (!user?.token) {
      toast.error("Please log in to continue");
      router.push("/onboarding/phone");
      return;
    }

    setLoading(true);
    try {
      const response = await templateService.selectTemplate(
        selectedTemplate,
        user.token
      );
      if (response.success) {
        toast.success("Template selected successfully!");
        router.push("/onboarding/social");
      } else {
        toast.error(response.message || "Failed to save template selection");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save template selection");
      console.error("Template selection error:", error);
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
        <ProgressSteps currentStep="template" />
      </div>
      <div className="flex-1 w-full max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Choose your style
          </h1>
          <p className="text-gray-700 text-lg">
            Select a template that matches your brand
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Preview Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] p-6 h-[600px] sticky top-8">
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-100">
                {/* Phone Frame */}
                <div className="absolute inset-4 bg-white rounded-[2rem] shadow-[0_0_0_12px_#000000] overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-2xl"></div>

                  {/* Preview Content */}
                  <div className="absolute inset-0 mt-8 p-4">
                    {previewTemplate ? (
                      <div
                        className="w-full h-full rounded-xl transition-colors duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${previewTemplate.template_data.colors[0]}, ${previewTemplate.template_data.colors[1]})`,
                        }}
                      >
                        {/* Template preview content would go here */}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                        Select a template to preview
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setPreviewTemplate(template);
                    }}
                    onMouseEnter={() => setPreviewTemplate(template)}
                    onMouseLeave={() =>
                      setPreviewTemplate(
                        selectedTemplate
                          ? templates.find((t) => t.id === selectedTemplate)
                          : null
                      )
                    }
                    className={`
                      p-6 rounded-xl cursor-pointer
                      transform hover:scale-[1.02] transition-all duration-300
                      ${
                        selectedTemplate === template.id
                          ? "bg-black text-white shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                          : "bg-white hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-lg shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${template.template_data.colors[0]}, ${template.template_data.colors[1]})`,
                        }}
                      ></div>
                      <div>
                        <h3
                          className={`text-lg font-semibold ${
                            selectedTemplate === template.id
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {template.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            selectedTemplate === template.id
                              ? "text-gray-300"
                              : "text-gray-600"
                          }`}
                        >
                          {template.description}
                        </p>
                      </div>
                      <div className="flex-1 flex justify-end">
                        <div
                          className={`w-6 h-6 rounded-full border-2 
                            ${
                              selectedTemplate === template.id
                                ? "border-white bg-white"
                                : "border-gray-300"
                            }
                            flex items-center justify-center
                          `}
                        >
                          {selectedTemplate === template.id && (
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
                  disabled={!selectedTemplate || loading}
                  className={`
                    px-8 py-3 rounded-lg text-white text-lg font-medium
                    transform hover:scale-[1.02] transition-all duration-300
                    relative overflow-hidden group
                    ${
                      selectedTemplate && !loading
                        ? "bg-black hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                        : "bg-gray-400 cursor-not-allowed"
                    }
                  `}
                >
                  <span className="relative z-10">
                    {loading ? "Saving..." : "Continue"}
                  </span>
                  {selectedTemplate && !loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
