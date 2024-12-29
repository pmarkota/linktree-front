import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const subdomainService = {
  checkAvailability: async (subdomain) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/check-subdomain`, {
        subdomain,
      });
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
};
