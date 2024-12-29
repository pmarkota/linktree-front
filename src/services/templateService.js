import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const templateService = {
  getTemplates: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  selectTemplate: async (templateId, token) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/templates/select`,
        { templateId },
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
