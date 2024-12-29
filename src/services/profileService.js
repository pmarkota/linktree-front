import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const profileService = {
  getUserProfile: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateProfile: async (formData, token) => {
    try {
      const response = await axios.put(`${API_URL}/api/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateBrandName: async (brandName, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/profile/brand-name`,
        { brandName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateSubdomain: async (subdomain, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/profile/subdomain`,
        { subdomain },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateGoal: async (goalType, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/profile/goal`,
        { goalType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBusinessCategories: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/business-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
