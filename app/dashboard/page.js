"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../../src/context/AuthContext";
import { dashboardService } from "../../src/services/dashboardService";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const response = await dashboardService.getDashboardData(user.token);
        console.log("Dashboard data response:", response);

        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError(response.message || "Failed to load dashboard data");
          toast.error(response.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
        setError(error.message || "Failed to load dashboard data");
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (loading) {
    console.log("Rendering: Loading state");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering: Error state", error);
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    console.log("Rendering: No dashboard data");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No data found
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering: Full dashboard with data", dashboardData);
  const { profile, template, links, analytics } = dashboardData;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                {profile.profile_image_url ? (
                  <Image
                    src={profile.profile_image_url}
                    alt={profile.name}
                    width={48}
                    height={48}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {profile.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {profile.name || "User"}
                </h1>
                <p className="text-sm text-gray-600">
                  {profile.subdomain
                    ? `linktree.me/${profile.subdomain}`
                    : "No subdomain set"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard/edit-profile")}
                className="px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {
                  const url = profile.subdomain
                    ? `https://linktree.me/${profile.subdomain}`
                    : window.location.origin;
                  if (navigator.share) {
                    navigator.share({
                      title: `${profile.name}'s Linktree`,
                      text: "Check out my Linktree!",
                      url: url,
                    });
                  } else {
                    navigator.clipboard.writeText(url).then(() => {
                      toast.success("Profile link copied to clipboard!");
                    });
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Share Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Analytics Cards */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              30-Day Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalViews}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalClicks}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Profile Info
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-600 font-bold">Brand Name:</span>{" "}
                <span className="text-gray-900">
                  {profile.brand_name || "Not set"}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600 font-bold">Category:</span>{" "}
                <span className="text-gray-900">
                  {profile.business_category_name || "Not set"}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600 font-bold">Goal Type:</span>{" "}
                <span className="text-gray-900">
                  {profile.goal_type || "Not set"}
                </span>
              </p>
            </div>
          </div>

          {/* Template Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Active Template
            </h3>
            <p className="text-sm">
              <span className="text-gray-600">Template:</span>{" "}
              <span className="text-gray-900">
                {template.template_name || "Default"}
              </span>
            </p>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Performance Analytics
          </h3>
          <div className="h-[400px]">
            {analytics.dailyStats && analytics.dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    tick={{ fill: "#000000", fontWeight: 600 }}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                    labelStyle={{
                      color: "#000000",
                      fontWeight: "600",
                      marginBottom: "4px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="page_views"
                    name="Views"
                    stroke="#000000"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total_clicks"
                    name="Clicks"
                    stroke="#666666"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No analytics data available
              </div>
            )}
          </div>
        </div>

        {/* Active Links */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-black">
            Active Links
          </h3>
          <div className="grid gap-4">
            {links && links.length > 0 ? (
              links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8">
                      <img
                        src={`/platforms/${link.platform_name.toLowerCase()}.svg`}
                        alt={link.platform_name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{link.platform_name}</p>
                      <p className="text-sm text-gray-600">{link.url}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.open(link.url, "_blank")}
                    className="text-black hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active links found
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
