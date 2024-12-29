"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/context/AuthContext";
import { profileService } from "../../../src/services/profileService";
import toast from "react-hot-toast";
import Image from "next/image";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5MB in bytes

const resizeImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > 1920) {
            height = Math.round((height * 1920) / width);
            width = 1920;
          }
        } else {
          if (height > 1920) {
            width = Math.round((width * 1920) / height);
            height = 1920;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Start with high quality
        let quality = 0.9;
        let output = canvas.toDataURL("image/jpeg", quality);
        let iterations = 0;
        const maxIterations = 10;

        // Reduce quality until file size is under MAX_FILE_SIZE
        while (
          output.length > MAX_FILE_SIZE * 1.37 &&
          iterations < maxIterations
        ) {
          quality *= 0.9;
          output = canvas.toDataURL("image/jpeg", quality);
          iterations++;
        }

        resolve(output);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    goalType: "",
    categoryId: "",
    bio: "",
    subdomain: "",
  });
  const [categories, setCategories] = useState([]);

  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, categoriesRes] = await Promise.all([
          profileService.getUserProfile(user.token),
          profileService.getBusinessCategories(user.token),
        ]);

        if (profileRes.success) {
          const { data } = profileRes;
          setFormData({
            name: data.name || "",
            brandName: data.brand_name || "",
            goalType: data.goal_type || "",
            categoryId: data.category_id || "",
            bio: data.bio || "",
            subdomain: data.subdomain || "",
          });
          if (data.profile_image_url) {
            setPreviewUrl(data.profile_image_url);
          }
        }

        if (categoriesRes.success) {
          setCategories(categoriesRes.categories);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (file.type.startsWith("image/")) {
          // Always show preview from original file
          setPreviewUrl(URL.createObjectURL(file));

          // Resize if needed
          if (file.size > MAX_FILE_SIZE) {
            const resizedImage = await resizeImage(file);
            // Convert base64 to blob
            const response = await fetch(resizedImage);
            const blob = await response.blob();
            // Create new file from blob
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            setImage(resizedFile);
          } else {
            setImage(file);
          }
        } else {
          toast.error("Please upload an image file");
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Error processing image");
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      try {
        if (file.type.startsWith("image/")) {
          setPreviewUrl(URL.createObjectURL(file));
          if (file.size > MAX_FILE_SIZE) {
            const resizedImage = await resizeImage(file);
            const response = await fetch(resizedImage);
            const blob = await response.blob();
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            setImage(resizedFile);
          } else {
            setImage(file);
          }
        } else {
          toast.error("Please upload an image file");
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Error processing image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = { ...formData };

      if (image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.split(",")[1];
          const fileType = image.type.split("/")[1];

          submitData.imageData = {
            base64String,
            fileType,
          };

          await submitProfile(submitData);
        };
        reader.readAsDataURL(image);
      } else {
        await submitProfile(submitData);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      setSaving(false);
    }
  };

  const submitProfile = async (data) => {
    try {
      const response = await profileService.updateProfile(data, user.token);
      if (response.success) {
        toast.success("Profile updated successfully");
        router.push("/dashboard");
      }
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-2 text-gray-600">
              Update your profile information and customize your page
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Profile Photo
                </h2>
                <div className="flex items-center space-x-8">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                      relative w-32 h-32 rounded-full
                      overflow-hidden cursor-pointer
                      transition-all duration-300
                      ${
                        isDragging
                          ? "border-4 border-black scale-105"
                          : previewUrl
                          ? "ring-4 ring-gray-100"
                          : "border-4 border-dashed border-gray-300 hover:border-gray-400"
                      }
                    `}
                  >
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Profile"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-8 w-8 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Change photo
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Click on the image or drag and drop a new photo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or GIF (max. 4.5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="brandName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Brand Name
                    </label>
                    <input
                      type="text"
                      id="brandName"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subdomain"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Linktree URL
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="text"
                        id="subdomain"
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                        placeholder="myusername"
                      />
                      <span className="ml-3 text-gray-500 whitespace-nowrap">
                        .linktree.me
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                      placeholder="Tell visitors about yourself or your business..."
                    />
                  </div>
                </div>
              </div>

              {/* Category and Goals */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Category and Goals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="goalType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Goal Type
                    </label>
                    <select
                      id="goalType"
                      name="goalType"
                      value={formData.goalType}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black text-gray-900"
                    >
                      <option value="">Select a goal</option>
                      <option value="Creator">Creator</option>
                      <option value="Business">Business</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
