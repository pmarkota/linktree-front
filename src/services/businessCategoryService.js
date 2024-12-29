import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const businessCategoryService = {
  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/business-categories`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  selectCategory: async (categoryId, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/business-categories/select`,
        { categoryId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
