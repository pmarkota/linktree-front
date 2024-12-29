"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProgressSteps from "@/components/ProgressSteps";
import { useAuth } from "../../../src/context/AuthContext";
import { profileService } from "../../../src/services/profileService";
import toast from "react-hot-toast";

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

export default function ProfilePage() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/onboarding/phone");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await profileService.getUserProfile(user.token);
        if (response.success) {
          setName(response.data.name || "");
          setBio(response.data.bio || "");
          if (response.data.profile_image_url) {
            setPreviewUrl(response.data.profile_image_url);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = {
        name,
        bio,
      };

      // Handle image upload if present
      if (image) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result.split(",")[1];
          const fileType = image.type.split("/")[1];

          formData.imageData = {
            base64String,
            fileType,
          };

          try {
            const response = await profileService.updateProfile(
              formData,
              user.token
            );
            if (response.success) {
              toast.success("Profile updated successfully");
              router.push("/dashboard");
            }
          } catch (error) {
            console.error("Profile update error:", error);
            toast.error(error.message || "Failed to update profile");
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(image);
      } else {
        // If no image, just update other profile data
        const response = await profileService.updateProfile(
          formData,
          user.token
        );
        if (response.success) {
          toast.success("Profile updated successfully");
          router.push("/dashboard");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full pt-8 animate-slideDown">
        <ProgressSteps currentStep="profile" />
      </div>
      <div className="flex-1 w-full max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Complete your profile
          </h1>
          <p className="text-gray-700 text-lg">
            Add your details to personalize your page
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Upload */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">
                Profile Photo
              </h2>
              <p className="text-gray-600">
                Add a photo to help people recognize you
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative w-40 h-40 mx-auto rounded-full
                overflow-hidden cursor-pointer
                transition-all duration-300
                ${
                  isDragging
                    ? "border-4 border-black scale-105"
                    : previewUrl
                    ? ""
                    : "border-4 border-dashed border-gray-300 hover:border-gray-400"
                }
              `}
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  fill
                  style={{ objectFit: "cover" }}
                  className="hover:opacity-75 transition-opacity duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <svg
                    className="w-12 h-12 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="text-sm font-medium">Add Photo</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <p className="text-center text-sm text-gray-600 mt-4">
              Click or drag and drop • Max size 5MB
            </p>
          </div>

          {/* Name Section */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Name</h2>
              <p className="text-gray-600">
                Enter your name as you'd like it to appear
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                focus:border-black focus:outline-none focus:ring-0
                transition-all duration-300
                text-gray-900
                placeholder:text-gray-500
                bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Bio Section */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)]">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Bio</h2>
              <p className="text-gray-600">
                Tell people a little bit about yourself
              </p>
            </div>

            <div className="relative">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg
                  focus:border-black focus:outline-none focus:ring-0
                  transition-all duration-300
                  text-gray-900
                  placeholder:text-gray-500
                  bg-gray-50 focus:bg-white"
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-600 font-medium">
                {bio.length}/500
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className={`
                px-8 py-3 rounded-lg text-white
                transform hover:scale-[1.02] transition-all duration-300
                relative overflow-hidden group text-lg font-medium
                ${
                  !loading && name.trim()
                    ? "bg-black hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span className="relative z-10">
                {loading ? "Saving..." : "Continue"}
              </span>
              {!loading && name.trim() && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
