"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/context/AuthContext";
import ProgressSteps from "@/components/ProgressSteps";
import toast from "react-hot-toast";

export default function SocialPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const platforms = [
    { id: "instagram", name: "Instagram" },
    { id: "twitter", name: "Twitter" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "facebook", name: "Facebook" },
    { id: "youtube", name: "YouTube" },
    { id: "tiktok", name: "TikTok" },
    { id: "github", name: "GitHub" },
    { id: "website", name: "Website" },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
    }
  }, [user, router]);

  const handlePlatformSelect = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter((id) => id !== platformId));
      setLinks(links.filter((link) => link.platformId !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      setLinks([...links, { platformId, url: "" }]);
    }
  };

  const handleUrlChange = (platformId, url) => {
    setLinks(
      links.map((link) =>
        link.platformId === platformId ? { ...link, url } : link
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!links.length) {
      toast.error("Please add at least one social link");
      return;
    }

    const invalidLinks = links.filter((link) => !link.url.trim());
    if (invalidLinks.length) {
      toast.error("Please fill in all selected platform URLs");
      return;
    }

    setLoading(true);
    try {
      // TODO: Save social links to backend
      router.push("/onboarding/profile");
    } catch (error) {
      toast.error(error.message || "Failed to save social links");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full animate-slideDown mb-12">
          <ProgressSteps />
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fadeIn">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Add your social links
              </h1>
              <p className="text-gray-600">
                Select the platforms you want to add to your Linktree
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform.id)}
                    className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-300 ${
                      selectedPlatforms.includes(platform.id)
                        ? "bg-black text-white transform scale-[1.02] shadow-lg"
                        : "bg-white border-2 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3 justify-center">
                      <div className="w-8 h-8">
                        <img
                          src={`/platforms/${platform.id}.svg`}
                          alt={platform.name}
                          className={`w-full h-full ${
                            selectedPlatforms.includes(platform.id)
                              ? "[&>*]:stroke-white"
                              : "[&>*]:stroke-black"
                          }`}
                          style={{
                            filter: selectedPlatforms.includes(platform.id)
                              ? "invert(1)"
                              : "none",
                          }}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          selectedPlatforms.includes(platform.id)
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {platform.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPlatforms.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Add your links
                  </h2>
                  {links.map((link) => {
                    const platform = platforms.find(
                      (p) => p.id === link.platformId
                    );
                    return (
                      <div
                        key={link.platformId}
                        className="flex items-center space-x-4"
                      >
                        <div className="w-8 h-8">
                          <img
                            src={`/platforms/${platform.id}.svg`}
                            alt={platform.name}
                            className="w-full h-full [&>*]:stroke-black"
                          />
                        </div>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) =>
                            handleUrlChange(link.platformId, e.target.value)
                          }
                          placeholder={`Your ${platform.name} URL`}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors text-gray-900 placeholder:text-gray-500"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-black text-white rounded-lg font-medium
                    hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900
                    transform transition-all duration-300 hover:scale-[1.02]
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
