import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const platformService = {
  getPlatforms: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/platforms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserLinks: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/platforms/user-links`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  saveSocialLinks: async (links, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/platforms/save-links`,
        { links },
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
};
