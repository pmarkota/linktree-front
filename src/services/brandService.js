import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const brandService = {
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
};
